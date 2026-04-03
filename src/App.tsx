import { VideoPlayer } from './components/VideoPlayer';
import './App.css';

/**
 * MAIN APPLICATION ENTRY:
 * Orchestrates the primary AIdaptive Stream view.
 * Connects the UI to the backend telemetry gateway.
 */
export const TEST_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

function App() {
  // Reliable HLS test stream (Big Buck Bunny via Akamai)

  return (
    <main className="app-container">
      <header className="app-header">
        <div className="branding">
          <h1>AIdaptive Stream <span className="version">v1.0.0</span></h1>
          <p className="status-indicator">
            <span className="dot"></span> Local AI Orchestrator Connected
          </p>
        </div>
      </header>

      <section className="player-section">
        <VideoPlayer url={TEST_STREAM} />
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