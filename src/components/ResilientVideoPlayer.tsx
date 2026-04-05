import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { socket } from '../services/socket';
import type { PlayerCommand } from '../types/types';
import { useHlsTelemetry } from '../hooks/useHlsTelemetry';

interface Props {
  primaryUrl: string;
  fallbackUrl: string;
}

/**
 * RESILIENT VIDEOPLAYER: Multi-CDN Fallback Architecture.
 * Captures fatal network errors on the primary CDN and hot-swaps the manifest source.
 */
export const ResilientVideoPlayer = ({ primaryUrl, fallbackUrl }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  // STAFF TIP: Track fallback state mutably to prevent infinite retry loops 
  // without triggering React re-renders.
  const hasFallenBackRef = useRef<boolean>(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!Hls.isSupported()) {
      console.error('HLS is not supported in this browser.');
      return;
    }

    const hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      // Optional: Tweak retry configuration to fail faster and trigger fallback sooner
      manifestLoadingMaxRetry: 2, 
      levelLoadingMaxRetry: 2,
    });

    hlsRef.current = hlsInstance;

    /**
     * ERROR INTERCEPTOR: The core of the HA Architecture.
     */
    hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.warn(`🌐 [HLS] Fatal Network Error on CDN. Details:`, data.details);
            
            if (!hasFallenBackRef.current) {
              console.log(`🔄 [HA] Intercepted 50x error. Executing fallback to Secondary CDN...`);
              hasFallenBackRef.current = true;
              
              // 1. Stop current network calls
              hlsInstance.stopLoad(); 
              // 2. Inject the fallback manifest
              hlsInstance.loadSource(fallbackUrl);
              // 3. Restart fetching
              hlsInstance.startLoad(); 
            } else {
              // Both CDNs are down. Catastrophic failure.
              console.error(`❌ [HA] Secondary CDN also failed. Broadcasting critical error.`);
              // Here you would trigger a UI state update for a "Service Unavailable" screen
            }
            break;
            
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.warn(`🎞️ [HLS] Fatal Media Error. Attempting to recover decoder...`);
            hlsInstance.recoverMediaError();
            break;
            
          default:
            console.error(`💥 [HLS] Unrecoverable Error. Destroying instance.`, data);
            hlsInstance.destroy();
            break;
        }
      }
    });

    // Initial load
    hlsInstance.loadSource(primaryUrl);
    hlsInstance.attachMedia(videoRef.current);

    /**
     * AGENTIC COMMAND LISTENER
     */
    socket.on('player-command', (data: PlayerCommand) => {
      console.log('🤖 AI Agent Command:', data);
      if (data.command === 'TUNE_ABR' && data.payload && hlsRef.current) {
        hlsRef.current.currentLevel = data.payload.capLevel;
      }
    });

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      socket.off('player-command');
    };
  }, [primaryUrl, fallbackUrl]);
  // If either of these two URLs changes, run this entire cleanup process immediately
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