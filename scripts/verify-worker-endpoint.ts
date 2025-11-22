
async function main() {
    const word = 'وهل';
    const url = `https://pashtobiblesearch.jeremy-samuels17.workers.dev/api/verb-forms?lemma=${encodeURIComponent(word)}`;

    console.log(`Checking URL: ${url}`);

    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            console.log('✅ Success! Worker returned data:');
            console.log(`   Count: ${data.count}`);
            console.log(`   First form: ${JSON.stringify(data.forms[0])}`);
        } else {
            console.error(`❌ Failed: ${res.status} ${res.statusText}`);
        }
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

main();
