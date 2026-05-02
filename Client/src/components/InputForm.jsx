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
    <div className="input-container fade-in">
      <h2 style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ color: 'var(--teal-primary)' }}>✦</span>
        Paste LLM Response
      </h2>

      <input
        className="input-field"
        placeholder="What did you ask the AI? (optional)"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <textarea
        className="textarea-field"
        placeholder="Paste any AI-generated response here to analyze its credibility and detect hallucinations..."
        value={llmResponse}
        onChange={e => setLlmResponse(e.target.value)}
      />

      {error && <p className="error-text">⚠ {error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="submit-btn"
      >
        <span>
          {loading
            ? '⏳ Analyzing claims...'
            : '⚡ Evaluate Credibility'
          }
        </span>
      </button>
    </div>
  );
}