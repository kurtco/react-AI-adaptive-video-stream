import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { socket } from '../services/socket';
import type { PlayerCommand } from '../types/types';
import { useHlsTelemetry } from '../hooks/useHlsTelemetry';

interface Props {
  url: string;
}

/**
 * VIDEOPLAYER: Optimized for React 19.
 * Uses a Ref for the HLS instance to avoid cascading renders (TS2503).
 */
export const VideoPlayer = ({ url }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // STAFF TIP: Use useRef for imperative controllers, not useState.
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    /**
     * INITIALIZE HLS ENGINE:
     * Managed as a side-effect, stored in a ref to bypass the React render cycle.
     */
    const hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });

    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(videoRef.current);
    
    // Store in ref instead of state to avoid cascading renders
    hlsRef.current = hlsInstance;

    /**
     * AGENTIC COMMAND LISTENER:
     * Direct actuation on the HLS instance from the AI orchestrator.
     */
    socket.on('player-command', (data: PlayerCommand) => {
      console.log('🤖 AI Agent Command:', data);
      if (data.command === 'TUNE_ABR' && data.payload && hlsRef.current) {
        hlsRef.current.currentLevel = data.payload.capLevel;
      }
    });

    return () => {
      hlsInstance.destroy();
      hlsRef.current = null;
      socket.off('player-command');
    };
  }, [url]);

  /**
   * TELEMETRY SENSOR:
   * Passing the Ref instead of the State value.
   */
  useHlsTelemetry(hlsRef, socket);

  return (
    <div className="player-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>
      <video 
        ref={videoRef} 
        controls 
        autoPlay 
        muted 
        style={{ width: '100%', borderRadius: '12px', border: '1px solid #333', background: '#000' }} 
      />
      <div className="ai-status" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', color: '#00ff00' }}>
        ● AI MONITOR ACTIVE
      </div>
    </div>
  );
};