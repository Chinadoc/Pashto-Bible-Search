#!/usr/bin/env node

const fs = require('fs');

// The jktags data from the user
const jktagsData = "1&0SZkjvAfNQZjNwAk4lZ2jPZjNQZ0pwY4HmJf0IZfLQYjNQZjDmAhtGAfNQZjNQA14lZ1fSYqSGZfHQYjNQZjDGAhZGAfNQZjNwA14FB0fSYqSQY1jPZjNQZ2HwY5DQY5LQZjpwZhHQAokFKmRQY0jFB2NQZ3VwY1DQYjNQZjtwAhRQAokFK2jPAfNQZjNQB24FZ0jPZjNQZlDwY5ZmJf0IZfDQYjNQZjVQAhxmZfNQZjNQAm4lAmfSYqqwZfZQYjNQZjDmZhpmZfNQZjNQZ54vZmfSYqyGZfZQYjNQZjNGBhVmZfNQZjNQB04FBlfSYqOGZfZQYjNQZjNGAhLGZfNQZjNQZ14lZkfSYquGZfRQYjNQZjNGAhZGZfNQZjNwZ54PZkfSYqyQYkjPZjNQZlxwYjRQYjNQZjtQBhpmJf0IZfRQYjNQZjtQBhpQY0VGZjNwAhDmJf0IZfVFZmWPY0VGZjNwAhDQYkVGZjHmAhRmJf0IZfVvZVWPYkVGZjHmAhRQY4xGZjLGZhNmJf0IZfVFZVWPY4xGZjLGZhNQYjNQZjHQZhNmJf0SofIaofjTo15TYjNQZjHQZhNQYjNQZjNQZhNmJ";

function decodeJktags(jktags) {
    console.log('Decoding jktags data...');
    console.log(`Raw data length: ${jktags.length} characters`);

    const parts = jktags.split('&');
    if (parts.length < 2) {
        console.log('Invalid jktags format');
        return [];
    }

    const encodedData = parts[1]; // Skip the '1&' prefix
    console.log(`Encoded data: ${encodedData.substring(0, 50)}...`);

    // Method 1: Look for time patterns directly in the encoded string
    const timePattern = /(\d+):(\d+)/g;
    const markers = [];
    let timeMatch;
    let verseNum = 1;

    console.log('\nMethod 1: Looking for MM:SS patterns...');
    while ((timeMatch = timePattern.exec(encodedData)) !== null) {
        const minutes = parseInt(timeMatch[1]);
        const seconds = parseInt(timeMatch[2]);
        const totalSeconds = minutes * 60 + seconds;

        markers.push({
            verse: verseNum,
            startTime: totalSeconds,
            timeString: `${minutes}:${seconds.toString().padStart(2, '0')}`
        });
        verseNum++;
        console.log(`Found verse ${verseNum-1} at ${minutes}:${seconds.toString().padStart(2, '0')} (${totalSeconds}s)`);
    }

    // Method 2: Try base64 decoding segments
    if (markers.length === 0) {
        console.log('\nMethod 2: Trying base64 decoding...');
        const segments = encodedData.match(/[A-Za-z0-9+/=]{4,}/g) || [];
        console.log(`Found ${segments.length} potential base64 segments`);

        for (let i = 0; i < Math.min(segments.length, 20); i++) { // Limit to first 20
            try {
                const decoded = Buffer.from(segments[i], 'base64').toString('utf8');
                const segmentTimeMatch = decoded.match(/(\d+):(\d+)/);
                if (segmentTimeMatch) {
                    const minutes = parseInt(segmentTimeMatch[1]);
                    const seconds = parseInt(segmentTimeMatch[2]);
                    const totalSeconds = minutes * 60 + seconds;

                    markers.push({
                        verse: verseNum,
                        startTime: totalSeconds,
                        timeString: `${minutes}:${seconds.toString().padStart(2, '0')}`,
                        source: 'base64'
                    });
                    verseNum++;
                    console.log(`Decoded verse ${verseNum-1} at ${minutes}:${seconds.toString().padStart(2, '0')} (${totalSeconds}s)`);
                }
            } catch (e) {
                // Skip invalid segments
            }
        }
    }

    // Method 3: Character-by-character analysis
    if (markers.length === 0) {
        console.log('\nMethod 3: Character-by-character analysis...');

        // Look for patterns that might represent time markers
        // Common patterns: numbers followed by colons, or encoded time values

        // Look for digit sequences that might be time values
        const digitSequences = encodedData.match(/\d+/g) || [];
        console.log(`Found ${digitSequences.length} digit sequences`);

        // Try to interpret as seconds directly
        for (let i = 0; i < Math.min(digitSequences.length, 10); i++) {
            const num = parseInt(digitSequences[i]);
            if (num > 0 && num < 1000) { // Reasonable time range
                markers.push({
                    verse: verseNum,
                    startTime: num,
                    timeString: `${Math.floor(num/60)}:${(num%60).toString().padStart(2, '0')}`,
                    source: 'digits'
                });
                verseNum++;
                console.log(`Interpreted verse ${verseNum-1} at ${Math.floor(num/60)}:${(num%60).toString().padStart(2, '0')} (${num}s)`);
            }
        }
    }

    console.log(`\nDecoded ${markers.length} time markers total`);
    return markers;
}

// Decode the provided jktags
const markers = decodeJktags(jktagsData);

// Output results
console.log('\n=== FINAL RESULTS ===');
console.log('Verse timings for Psalm 1:');
markers.forEach(marker => {
    console.log(`Verse ${marker.verse}: ${marker.timeString} (${marker.startTime}s) ${marker.source ? '[' + marker.source + ']' : ''}`);
});

// Check if we have reasonable verse count for Psalm 1 (should be 6 verses)
if (markers.length !== 6) {
    console.log(`\n⚠️  WARNING: Expected 6 verses for Psalm 1, but found ${markers.length}`);
} else {
    console.log('\n✅ Correct number of verses decoded');
}

// Export to JSON for further analysis
const result = {
    book: 'Psalms',
    chapter: 1,
    verseCount: markers.length,
    expectedVerses: 6,
    markers: markers
};

fs.writeFileSync('psalm1_jktags_decoded.json', JSON.stringify(result, null, 2));
console.log('\nResults saved to psalm1_jktags_decoded.json');



