# ☁️ AssemblyAI Cloud Integration

## Overview

You now have a **fully cloud-native video processing solution** that requires no local tools or dependencies!

### How It Works

```
You: Paste YouTube URL on website
     ↓
Backend: Sends URL directly to AssemblyAI
     ↓
AssemblyAI: Downloads video, transcribes to Pashto
     ↓
Backend: Receives results, saves to Supabase
     ↓
You: See results in Videos tab instantly
```

## 🎯 Key Features

### Cloud Processing (No Local Tools)
- ✅ **No yt-dlp needed** - AssemblyAI handles YouTube downloads
- ✅ **No ffmpeg needed** - Cloud compression built-in
- ✅ **No local transcription** - All on AssemblyAI servers
- ✅ **Complete backend handling** - Browser just sends URL

### Dual Service Support
- **AssemblyAI** (default): Fast, cloud-native, requires no local tools
- **ElevenLabs** (fallback): Higher quality, used if AssemblyAI unavailable

### Automatic Pashto Support
- Language code: `ps` (Pashto)
- Language detection enabled
- Validation checks for Pashto content

## 🚀 Quick Start

### 1. Paste YouTube URL
Open the app → Videos tab → Enter YouTube URL

### 2. Select Service
Choose "⚡ AssemblyAI (Cloud, Faster)" from dropdown

### 3. Transcribe
Click "Analyze Audio" → Results auto-save to Supabase

That's it! No backend setup, no local tools, no complexity.

## 📋 API Flow

### POST /api/transcribe-audio (YouTube URL)

**Request:**
```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=ZmM_DQ0aRvk",
  "service": "assemblyai"
}
```

**What Happens:**
1. Backend receives URL
2. Sends to AssemblyAI cloud servers
3. AssemblyAI downloads YouTube video
4. Transcribes to Pashto (`language_code: "ps"`)
5. Returns transcript text
6. Backend validates Pashto content
7. Saves to Supabase
8. Returns to frontend

**Response:**
```json
{
  "success": true,
  "transcript": "پشتو متن...",
  "service": "assemblyai",
  "validation": {
    "confidence": 0.85,
    "isValid": true,
    "reason": "Transcription appears to be in Pashto"
  }
}
```

## ⚙️ Environment Setup

### Required Variables
```bash
ASSEMBLYAI_API_KEY=4c15846aff03429e99207a86450addae
```

### Optional (for fallback)
```bash
ELEVENLABS_API_KEY=sk_xxx
```

Both already configured in `.env.local`

## 📊 Service Comparison

| Feature | AssemblyAI | ElevenLabs |
|---------|-----------|-----------|
| **Processing** | 100% cloud | Download + Cloud |
| **Speed** | Fast | Medium |
| **Local Tools** | None needed | yt-dlp, ffmpeg required |
| **Pashto Support** | ✅ Yes | ✅ Yes |
| **Accuracy** | Good | Excellent |
| **Cost** | Cheaper | More expensive |
| **Best For** | Quick processing | Quality over speed |

## 🔄 Transcription Flow with Fallback

```typescript
// Backend logic
if (youtubeUrl) {
  try {
    // Step 1: Try AssemblyAI first
    const result = await transcribeWithAssemblyAI(youtubeUrl);
    if (result) return result; // Success! ✅
  } catch (error) {
    // Step 2: Fallback to ElevenLabs
    const audio = await downloadAndCompressYouTube(youtubeUrl);
    const result = await transcribeWithElevenLabs(audio);
    return result;
  }
}
```

## 📱 UI Components

### Service Selector
- Located in Videos tab
- Dropdown: "⚡ AssemblyAI (Cloud, Faster)" or "🎙️ ElevenLabs"
- Helpful descriptions for each option
- Persistent selection

### Status Display
- Shows which service was used
- Displays confidence score
- Shows validation results
- Auto-saves to Supabase

## ⏱️ Performance

### AssemblyAI Processing Times
- **Setup**: < 1 second
- **Download & Transcription**: 2-5 minutes for 5-minute video
- **Polling**: Every 5 seconds
- **Storage**: < 1 second
- **Total**: ~5 minutes

### Quality Considerations
- Pashto accuracy: "Fair" (AssemblyAI rating)
- Recommended for general transcription
- Use ElevenLabs fallback if quality issues

## 🔒 Pashto Language Support

### Language Code
```javascript
language_code: 'ps'  // Pashto
```

### Validation Checks
- Pashto script detection (Arabic script range)
- Common Pashto word recognition
- Confidence score (0-100%)
- Word count validation

### Confidence Scoring
- **90-100%**: High confidence ✅
- **70-89%**: Medium confidence ⚠️
- **<70%**: Low confidence, flagged for review ❌

## 🛠️ Backend Implementation

### AssemblyAI Function
```typescript
async function transcribeWithAssemblyAI(youtubeUrl: string) {
  // 1. Start job
  const job = await fetch(ASSEMBLYAI_API_URL, {
    body: {
      audio_url: youtubeUrl,
      language_code: 'ps',
      language_detection: true
    }
  });

  // 2. Poll for completion (max 5 minutes)
  while (pollingAttempt < 60) {
    const status = await fetch(`${ASSEMBLYAI_API_URL}/${job.id}`);
    if (status.completed) return status.text;
    await wait(5000);
  }
}
```

## 📞 Troubleshooting

### "AssemblyAI API error"
- Check API key is correct in `.env.local`
- Verify YouTube URL is public
- Check AssemblyAI status: https://status.assemblyai.com

### "Transcription timeout"
- Video too long? (~5 minute limit)
- Try shorter video
- Check internet connection

### "Transcription does not appear to be in Pashto"
- Video may not be Pashto speech
- Confidence < 70% triggers auto-retry
- Use ElevenLabs fallback for better accuracy

### Service keeps switching to ElevenLabs
- AssemblyAI failing for some reason
- Check error logs in browser DevTools
- Verify API key works

## 🚀 Future Enhancements

1. **Batch Processing** - Multiple videos at once
2. **Custom Language Models** - Better Pashto accuracy
3. **Cost Optimization** - Track API usage
4. **Caching** - Store transcription results
5. **Direct Integration** - Skip polling, use webhooks

## 📊 Cost Analysis

### AssemblyAI
- ~$0.02 per minute of audio
- 5-minute video = ~$0.10
- Cheaper overall

### ElevenLabs
- Pay-as-you-go pricing
- Variable based on quality settings

## ✅ Checklist: Cloud-Native Setup

- [x] AssemblyAI API key configured
- [x] Backend endpoint supports YouTube URLs directly
- [x] Service selector in UI
- [x] Fallback to ElevenLabs working
- [x] Pashto language detection enabled
- [x] Validation and confidence scoring
- [x] Auto-save to Supabase
- [x] No local tools required
- [x] Complete documentation

## 🎬 Try It Now

1. Start the app: `npm run dev`
2. Go to Videos tab
3. Paste: `https://www.youtube.com/watch?v=ZmM_DQ0aRvk`
4. Select: "⚡ AssemblyAI (Cloud, Faster)"
5. Click: "Analyze Audio"
6. Wait ~5 minutes for results
7. See results in Videos tab automatically ✅

That's it! Pure cloud processing. No local complexity. 🌩️
