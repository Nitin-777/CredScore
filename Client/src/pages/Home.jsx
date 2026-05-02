import { useState } from 'react';
import InputForm from '../components/InputForm';
import ResultPanel from '../components/ResultPanel';

const STEPS = [
  { id: 1, label: 'Extracting claims from response' },
  { id: 2, label: 'Retrieving evidence from Wikipedia' },
  { id: 3, label: 'Verifying claims with NLI model' },
  { id: 4, label: 'Computing credibility score' },
];

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
    if (isLoading) {
      setResult(null);
      setCurrentStep(1);
      // simulate step progression
      const timings = [0, 3000, 8000, 40000];
      timings.forEach((delay, i) => {
        setTimeout(() => {
          if (isLoading) setCurrentStep(i + 1);
        }, delay);
      });
    } else {
      setCurrentStep(4);
    }
  };

  const handleResult = (data) => {
    setResult(data);
    setCurrentStep(4);
  };

  return (
    <div className="page-enter">
      {/* hero */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">
          Detect{' '}
          <span className="gradient-text">Hallucinations</span>
        </h1>
        <p className="page-subtitle">
          Paste any AI-generated response to evaluate its credibility,
          verify claims against real-world evidence, and get a detailed report.
        </p>
      </div>

      <InputForm
        onResult={handleResult}
        onLoading={handleLoading}
      />

      {/* progress steps */}
      {loading && (
        <div className="progress-container fade-in">
          <p className="progress-title">
            🔍 Analyzing your response...
          </p>
          <div className="progress-steps">
            {STEPS.map((step) => {
              const state = currentStep > step.id ? 'done'
                : currentStep === step.id ? 'active'
                : 'waiting';
              return (
                <div key={step.id} className={`progress-step ${state}`}>
                  <div className={`step-icon ${state}`}>
                    {state === 'done' ? '✓' : step.id}
                  </div>
                  <span className={`step-text ${state}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result && !loading && (
        <ResultPanel result={result} />
      )}
    </div>
  );
}