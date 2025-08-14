FROM python:3.11-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend /app/backend
COPY backend/requirements.txt /app/requirements.txt
COPY web/pashto_bible.json /app/web/pashto_bible.json
COPY form_occurrence_index.json /app/form_occurrence_index.json
COPY form_to_root_map.json /app/form_to_root_map.json
COPY audio_file_map.json /app/audio_file_map.json

RUN pip install --no-cache-dir -r /app/requirements.txt

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8080"]

