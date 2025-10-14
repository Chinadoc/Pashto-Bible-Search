// Test script to check verb filtering for بوځو
const fetch = require('node-fetch');

async function testVerbFiltering() {
  try {
    console.log('Testing search for بوځو...');

    const response = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'بوځو',
        includeRelated: true,
        enableFuzzy: false,
        language: 'pashto'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Search results:');
    console.log('Related forms:', data.relatedForms);
    console.log('Number of results:', data.results?.length || 0);

    if (data.relatedForms?.verbs) {
      console.log('\nVerb forms:');
      data.relatedForms.verbs.forEach((verb, index) => {
        console.log(`${index + 1}. Form: "${verb.form}", Label: "${verb.label}"`);
      });
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testVerbFiltering();

