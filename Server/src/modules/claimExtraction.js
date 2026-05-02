const nlp = require('compromise');

function extractClaims(text) {
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');

  const claims = sentences
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.split(' ').length > 3);

  return claims;
}

module.exports = { extractClaims };


