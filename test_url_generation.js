// Test the URL generation logic
const testUrlGeneration = () => {
  // Simulate the logic from the API
  const verse = {
    book: 'Psalms',
    chapter: 2,
    verse: 12
  };
  
  // Generate the expected URL pattern
  const bookSlug = verse.book?.toLowerCase() === 'psalms' ? 'psalms' : 
                  verse.book?.toLowerCase() === 'proverbs' ? 'proverbs' : null
  if (bookSlug) {
    const chapterPadded = String(verse.chapter).padStart(3, '0')
    const versePadded = String(verse.verse).padStart(3, '0')
    const filename = `yousafzai_${bookSlug}${chapterPadded}_verse_${versePadded}.mp3`
    const audioVerseUrl = `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/yousafzai/${filename}`
    
    console.log('Generated URL:', audioVerseUrl);
    console.log('Expected filename:', filename);
    return audioVerseUrl;
  }
  return null;
};

testUrlGeneration();
