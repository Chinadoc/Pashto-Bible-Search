from __future__ import annotations

import base64
import json
import os
from pathlib import Path
from typing import Optional, Tuple

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload

SCOPES = ["https://www.googleapis.com/auth/drive"]

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CREDENTIALS_PATH = Path(
    os.getenv("GOOGLE_DRIVE_CREDENTIALS_PATH", PROJECT_ROOT / "credentials.json")
)
TOKEN_PATH = Path(os.getenv("GOOGLE_DRIVE_TOKEN_PATH", PROJECT_ROOT / "token.json"))

DOWNLOAD_URL_TEMPLATE = "https://drive.google.com/uc?export=download&id={file_id}"


class GoogleDriveAuthError(RuntimeError):
    """Raised when Google Drive authentication cannot be completed automatically."""


def _load_token() -> Optional[dict]:
    if not TOKEN_PATH.exists():
        return None

    with TOKEN_PATH.open("r", encoding="utf-8") as token_file:
        token_data = json.load(token_file)
        if isinstance(token_data, str):
            token_data = json.loads(token_data)
        return token_data


def _save_token(creds: Credentials) -> None:
    TOKEN_PATH.parent.mkdir(parents=True, exist_ok=True)
    with TOKEN_PATH.open("w", encoding="utf-8") as token_file:
        token_file.write(creds.to_json())


def _load_credentials() -> Credentials:
    token_data = _load_token()
    creds: Optional[Credentials] = None

    if token_data:
        creds = Credentials.from_authorized_user_info(token_data, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            _save_token(creds)
        else:
            if not CREDENTIALS_PATH.exists():
                raise GoogleDriveAuthError(
                    "Google Drive credentials.json not found. "
                    "Provide GOOGLE_DRIVE_CREDENTIALS_PATH or place credentials.json at project root."
                )
            # Cannot run OAuth flow automatically in server context.
            raise GoogleDriveAuthError(
                "Google Drive token.json is missing or invalid. "
                "Run a local OAuth consent flow (see google_drive_api_helper.py) to initialize credentials."
            )

    return creds


def get_drive_service():
    creds = _load_credentials()
    return build("drive", "v3", credentials=creds)


def ensure_public_permission(service, file_id: str) -> None:
    """Ensure the uploaded file is accessible via direct link."""
    try:
        service.permissions().create(
            fileId=file_id,
            body={"type": "anyone", "role": "reader"},
            fields="id",
            supportsAllDrives=True,
        ).execute()
    except HttpError as exc:  # pragma: no cover - best effort
        if exc.resp.status == 403 and "alreadyExists" in str(exc):
            return
        raise


def upload_file(
    file_path: Path,
    *,
    filename: Optional[str] = None,
    folder_id: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Upload a file to Google Drive.

    Returns a tuple of (file_id, direct_download_url).
    """
    service = get_drive_service()

    metadata = {"name": filename or file_path.name}
    if folder_id:
        metadata["parents"] = [folder_id]

    media = MediaFileUpload(str(file_path))
    file = (
        service.files()
        .create(
            body=metadata,
            media_body=media,
            fields="id",
            supportsAllDrives=True,
        )
        .execute()
    )

    file_id = file["id"]
    ensure_public_permission(service, file_id)
    return file_id, DOWNLOAD_URL_TEMPLATE.format(file_id=file_id)


def download_file(file_id: str, destination: Path) -> Path:
    """Download a file from Google Drive into destination path."""
    service = get_drive_service()
    request = service.files().get_media(fileId=file_id, supportsAllDrives=True)

    destination.parent.mkdir(parents=True, exist_ok=True)
    fh = destination.open("wb")
    downloader = MediaIoBaseDownload(fh, request)

    done = False
    while not done:
        status, done = downloader.next_chunk()
        if status:
            # Optional: log progress
            pass

    fh.close()
    return destination


def encode_file_base64(file_path: Path) -> str:
    with file_path.open("rb") as f:
        return base64.b64encode(f.read()).decode("ascii")
