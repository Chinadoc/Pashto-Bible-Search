/**
 * Test script to verify ElevenLabs API call format
 * This helps debug the form-data issue
 */

const FormData = require('form-data');
const { createReadStream } = require('fs');
const { stat } = require('fs/promises');

async function testElevenLabsAPI() {
  const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543';
  const testFile = '/tmp/video-processing/u9sU5l92Th4.mp3'; // Use a downloaded file
  
  try {
    const fileStats = await stat(testFile);
    console.log(`Testing with file: ${testFile}`);
    console.log(`File size: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
    
    const formData = new FormData();
    const fileStream = createReadStream(testFile);
    
    formData.append('file', fileStream, {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg',
      knownLength: fileStats.size,
    });
    formData.append('language', 'ps');
    formData.append('model_id', 'scribe_v1');
    
    const formHeaders = formData.getHeaders();
    console.log('Form headers:', formHeaders);
    
    const contentLength = await new Promise((resolve, reject) => {
      formData.getLength((err, length) => {
        if (err) {
          console.warn('getLength failed:', err);
          resolve(fileStats.size + 1000);
        } else {
          resolve(length);
        }
      });
    });
    
    console.log(`Content-Length: ${contentLength}`);
    
    const headers = {
      'xi-api-key': apiKey,
      ...formHeaders,
      'Content-Length': contentLength.toString(),
    };
    
    console.log('Request headers:', headers);
    
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    } else {
      const result = await response.json();
      console.log('Success! Result:', result);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testElevenLabsAPI();

