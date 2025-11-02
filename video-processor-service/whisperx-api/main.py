"""
WhisperX API Service for Railway
FastAPI service for forced alignment using WhisperX
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import whisperx
import torch
import tempfile
import os
from typing import Optional

app = FastAPI(title="WhisperX Alignment API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device detection
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🚀 WhisperX API starting on device: {DEVICE}")


@app.get("/")
async def root():
    return {
        "service": "WhisperX Alignment API",
        "device": DEVICE,
        "status": "ready"
    }


@app.post("/align")
async def align_transcription(
    audio: UploadFile = File(...),
    transcription: str = Form(...),
    language: str = Form("ps")
):
    """
    Align existing transcription with audio using WhisperX forced alignment
    
    Args:
        audio: Audio file (mp3, wav, etc.)
        transcription: Existing transcription text
        language: Language code (default: "ps" for Pashto)
    
    Returns:
        JSON with aligned segments and word-level timestamps
    """
    temp_audio = None
    
    try:
        # Save uploaded audio to temp file
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=f".{audio.filename.split('.')[-1]}")
        content = await audio.read()
        temp_audio.write(content)
        temp_audio.close()
        
        print(f"📥 Received audio: {len(content)} bytes")
        print(f"📝 Transcription length: {len(transcription)} chars")
        print(f"🌐 Language: {language}")
        
        # Load audio
        audio_data = whisperx.load_audio(temp_audio.name)
        
        # Load alignment model
        print(f"📚 Loading alignment model for {language}...")
        try:
            model_a, metadata = whisperx.load_align_model(language_code=language, device=DEVICE)
        except Exception as e:
            print(f"⚠️ Warning: Could not load alignment model for {language}: {e}")
            print(f"   Trying with 'auto' language detection...")
            model_a, metadata = whisperx.load_align_model(language_code='auto', device=DEVICE)
        
        # Split transcription into sentences
        sentences = [s.strip() for s in transcription.split('.') if s.strip()]
        if not sentences:
            sentences = [transcription.strip()]
        
        print(f"📝 Processing {len(sentences)} sentences...")
        
        # Align each sentence
        all_words = []
        all_segments = []
        
        for sentence in sentences:
            if not sentence:
                continue
                
            try:
                # Align sentence
                result = whisperx.align(
                    [sentence],
                    model_a,
                    metadata,
                    audio_data,
                    device=DEVICE,
                    return_char_alignments=False
                )
                
                if result and "segments" in result and len(result["segments"]) > 0:
                    segment = result["segments"][0]
                    words = segment.get("words", [])
                    
                    if words:
                        segment_words = []
                        for word in words:
                            if "start" in word and "end" in word and "word" in word:
                                segment_words.append({
                                    "word": word["word"],
                                    "start": word["start"],
                                    "end": word["end"]
                                })
                        
                        if segment_words:
                            all_words.extend(segment_words)
                            all_segments.append({
                                "text": sentence,
                                "start": segment_words[0]["start"],
                                "end": segment_words[-1]["end"],
                                "words": segment_words
                            })
            except Exception as e:
                print(f"⚠️ Error aligning sentence: {e}")
                continue
        
        print(f"✅ Aligned {len(all_segments)} segments, {len(all_words)} words")
        
        return JSONResponse({
            "text": transcription,
            "words": all_words,
            "segments": all_segments
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Alignment failed: {str(e)}")
    
    finally:
        # Cleanup temp file
        if temp_audio and os.path.exists(temp_audio.name):
            os.unlink(temp_audio.name)


@app.get("/health")
async def health():
    return {"status": "healthy", "device": DEVICE}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

