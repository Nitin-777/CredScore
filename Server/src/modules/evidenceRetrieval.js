const axios = require('axios');

// extract key search term from claim
function extractSearchTerm(claim) {
  const stopWords = ['the', 'is', 'are', 'was', 'were', 'a', 'an', 
                     'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or'];
  
  const words = claim
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(w => w.length > 3 && !stopWords.includes(w.toLowerCase()));

  return words.slice(0, 4).join(' ');
}

// wikipedia requires a user agent header
const wikiHeaders = {
  'User-Agent': 'CredScore/1.0 (educational project; contact@credscore.com)',
  'Accept': 'application/json'
};

async function retrieveEvidence(claim) {
  try {
    const searchTerm = extractSearchTerm(claim);
    console.log(`Searching evidence for: "${searchTerm}"`);

    // step 1 - search wikipedia for relevant page
    const searchRes = await axios.get(
      'https://en.wikipedia.org/w/api.php',
      {
        headers: wikiHeaders,
        params: {
          action: 'query',
          list: 'search',
          srsearch: searchTerm,
          format: 'json',
          srlimit: 2
        }
      }
    );

    const pages = searchRes.data.query.search;
    
    if (!pages || pages.length === 0) {
      console.log('No evidence found');
      return "";
    }

    // step 2 - get summary of top result
    const title = pages[0].title;
    console.log(`Found wikipedia page: "${title}"`);

    const summaryRes = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: wikiHeaders }
    );

    return summaryRes.data.extract || "";

  } catch (err) {
    console.log('Evidence retrieval error:', err.message);
    return "";
  }
}

module.exports = { retrieveEvidence };

module.exports = { retrieveEvidence };

async function test() {
  const evidence = await retrieveEvidence(
    "The Eiffel Tower is located in Paris France"
  );
  console.log('Evidence found:');
  console.log(evidence.substring(0, 200));
}
test();