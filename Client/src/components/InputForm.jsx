import { useState } from 'react';
import axios from 'axios';

export default function InputForm({ onResult, onLoading }) {
  const [query, setQuery] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!llmResponse.trim()) {
      setError('Please paste an LLM response to evaluate');
      return;
    }
    setLoading(true);
    setError('');
    onLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/evaluate`,
        { query, llmResponse }
      );
      onResult(res.data);
    } catch (err) {
      setError('Evaluation failed. Please try again.');
    }

    setLoading(false);
    onLoading(false);
  };

  return (
    <div className="input-container">
      <h2 className="page-title">Evaluate LLM Response</h2>
      <p className="page-subtitle">
        Paste any AI generated response below to check its credibility
      </p>

      <input
        className="input-field"
        placeholder="Your query (optional)"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <textarea
        className="textarea-field"
        placeholder="Paste any LLM response here to evaluate its credibility..."
        value={llmResponse}
        onChange={e => setLlmResponse(e.target.value)}
      />

      {error && (
        <p className="error-text">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="submit-btn"
      >
        {loading
          ? '⏳ Evaluating... This may take 1-2 minutes'
          : '🔍 Evaluate Credibility'
        }
      </button>
    </div>
  );
}