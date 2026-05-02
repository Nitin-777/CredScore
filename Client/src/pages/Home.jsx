import { useState } from 'react';
import InputForm from '../components/InputForm';
import ResultPanel from '../components/ResultPanel';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h2 className="page-title">CredScore</h2>
      <p className="page-subtitle">
        Evaluate the credibility and hallucination risk of any LLM response
      </p>

      <InputForm
        onResult={setResult}
        onLoading={setLoading}
      />

      {loading && !result && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p className="loading-text">
            Analyzing claims and retrieving evidence...
          </p>
          <p className="loading-text" style={{ marginTop: '0.5rem' }}>
            This may take 1-2 minutes
          </p>
        </div>
      )}

      {result && !loading && (
        <ResultPanel result={result} />
      )}
    </div>
  );
}