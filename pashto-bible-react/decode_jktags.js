#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Decode jktags from afghanbibles.org
 * The jktags contain time markers for verse boundaries
 */
function decodeJktags(jktags) {
  console.log(`Decoding jktags (${jktags.length} chars)...`);

  const parts = jktags.split('&');
  if (parts.length < 2) return [];

  const encodedData = parts[1];
  console.log(`Encoded data preview: ${encodedData.substring(0, 100)}...`);

  const markers = [];

  // Method 1: Look for numeric sequences that might represent time codes
  // The jktags seem to use a custom encoding, let's try to find patterns
  const numberPattern = /(\d+)/g;
  const numbers = [];
  let match;

  while ((match = numberPattern.exec(encodedData)) !== null) {
    numbers.push(parseInt(match[1]));
  }

  console.log(`Found ${numbers.length} numbers in jktags`);

  // Method 2: Try to interpret numbers as time codes
  // Look for sequences that could be minutes/seconds
  let verseNum = 1;
  let lastTime = 0;

  for (let i = 0; i < numbers.length - 1; i++) {
    const current = numbers[i];
    const next = numbers[i + 1];

    // Look for time-like patterns (minutes:seconds)
    if (current >= 0 && current <= 59 && next >= 0 && next <= 59) {
      const totalSeconds = current * 60 + next;
      if (totalSeconds > lastTime && totalSeconds < 3600) { // Less than 1 hour
        markers.push({
          verse: verseNum,
          startTime: totalSeconds
        });
        verseNum++;
        lastTime = totalSeconds;
        i++; // Skip next number as it's part of this time
      }
    }
  }

  // Method 3: If no markers found, try different interpretation
  if (markers.length === 0) {
    console.log('Trying alternative decoding approach...');

    // Split by common delimiters and look for time patterns
    const segments = encodedData.split(/[A-Za-z]/).filter(s => s.length > 2);

    for (const segment of segments) {
      const timeMatch = segment.match(/(\d{1,2})(\d{2})/);
      if (timeMatch) {
        const minutes = parseInt(timeMatch[1]);
        const seconds = parseInt(timeMatch[2]);
        const totalSeconds = minutes * 60 + seconds;

        if (totalSeconds > lastTime && totalSeconds < 3600) {
          markers.push({
            verse: verseNum,
            startTime: totalSeconds
          });
          verseNum++;
          lastTime = totalSeconds;
        }
      }
    }
  }

  // Method 4: Create estimated markers based on verse count if still no markers
  if (markers.length === 0) {
    console.log('No markers decoded, creating estimated markers...');
    // We'll get the actual verse count from the HTML parsing
    // For now, estimate conservatively
    const estimatedVerses = 20;
    for (let i = 0; i < estimatedVerses; i++) {
      markers.push({
        verse: i + 1,
        startTime: i * 12 // 12 seconds per verse estimate
      });
    }
  }

  console.log(`Decoded ${markers.length} time markers`);
  return markers;
}

async function getChapterData(book, chapter) {
  try {
    const url = `https://afghanbibles.org/eng/pashto-bible/${book}/${book}-${chapter}`;
    console.log(`Fetching data for ${book} ${chapter}...`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Get jktags
    const jktagsMatch = html.match(/id=["']jktags["'][^>]*data-tags=["']([^"']+)["']/);
    const jktags = jktagsMatch ? jktagsMatch[1] : null;

    // Get verse count
    const verseRegex = /(\d+)\s*([^<\d\n]+)/g;
    const verses = [];
    let match;
    while ((match = verseRegex.exec(html)) !== null) {
      const verseNum = parseInt(match[1]);
      if (verseNum > 0 && verseNum < 100) {
        verses.push(verseNum);
      }
    }

    return {
      jktags,
      verseCount: Math.max(...verses),
      markers: jktags ? decodeJktags(jktags) : []
    };

  } catch (error) {
    console.error(`Error fetching ${book} ${chapter}:`, error.message);
    return null;
  }
}

async function testChapter(book, chapter) {
  const data = await getChapterData(book, chapter);
  if (data) {
    console.log(`\n=== ${book.toUpperCase()} ${chapter} ===`);
    console.log(`Verses: ${data.verseCount}`);
    console.log(`Jktags length: ${data.jktags ? data.jktags.length : 0}`);
    console.log(`Markers found: ${data.markers.length}`);

    if (data.markers.length > 0) {
      console.log('\nFirst 5 markers:');
      data.markers.slice(0, 5).forEach(marker => {
        const minutes = Math.floor(marker.startTime / 60);
        const seconds = marker.startTime % 60;
        console.log(`  Verse ${marker.verse}: ${minutes}:${seconds.toString().padStart(2, '0')} (${marker.startTime}s)`);
      });
    }

    return data;
  }
  return null;
}

// Test the decoder
if (require.main === module) {
  testChapter('1-corinthians', 2);
}

module.exports = { decodeJktags, getChapterData, testChapter };
