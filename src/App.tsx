import { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';

import './App.css';
import { ResilientVideoPlayer } from './components/ResilientVideoPlayer';

/**
 * MAIN APPLICATION ENTRY:
 * Orchestrates the primary AIdaptive Stream view.
 * Connects the UI to the backend telemetry gateway.
 */
export const TEST_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
// Fallback
export const FALLBACK_STREAM = "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8";

function App() {
  // Reliable HLS test stream (Big Buck Bunny via Akamai)
  const [playerMode, setPlayerMode] = useState<'standard' | 'resilient'>('standard');

  return (
    <main className="app-container">
      <header className="app-header">
        <div className="branding">
          <h1>AIdaptive Stream <span className="version">v1.0.0</span></h1>
          <p className="status-indicator">
            <span className="dot"></span> Local AI Orchestrator Connected
          </p>
        </div>

        {/* UI CONTROL: Architecture Switcher */}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="architecture-select" style={{ color: '#888', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Architecture Mode:
          </label>
          <select 
            id="architecture-select"
            value={playerMode} 
            onChange={(e) => setPlayerMode(e.target.value as 'standard' | 'resilient')}
            style={{
              appearance: 'none',
              backgroundColor: '#1a1a1a',
              color: '#00ff00',
              border: '1px solid #333',
              padding: '8px 32px 8px 16px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300ff00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '16px'
            }}
          >
            <option value="standard">Standard HLS (Single CDN)</option>
            <option value="resilient">HA Multi-CDN (Resilient)</option>
          </select>
        </div>
      </header>

      <section className="player-section" style={{ marginTop: '2rem' }}>
        {/* CONDITIONAL RENDERING BASED ON ARCHITECTURE MODE */}
        {playerMode === 'standard' ? (
          <VideoPlayer url={TEST_STREAM} />
        ) : (
          <ResilientVideoPlayer 
            primaryUrl={TEST_STREAM} 
            fallbackUrl={FALLBACK_STREAM} 
          />
        )}
      </section>

      <section className="metadata-panel">
        <div className="info-card">
          <h3>System Architecture</h3>
          <p>
            This sensor layer emits real-time QoS metrics to the 
            <strong> NestJS + LangGraph</strong> backend. 
            The closed-loop logic triggers <code>TUNE_ABR</code> commands 
            via WebSockets based on Gemini 1.5 Flash analysis.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;