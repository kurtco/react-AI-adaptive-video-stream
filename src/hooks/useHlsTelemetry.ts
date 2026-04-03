import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Socket } from "socket.io-client";
import type { HlsMetrics } from "../types/types";

/**
 * TELEMETRY HOOK
 */
export const useHlsTelemetry = (
  hlsRef: React.RefObject<Hls | null>,
  socket: Socket | null,
) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const socketInstance = socket;
    if (!socketInstance) return;

    // function to extract and read metrics
    const emitTelemetry = (eventType: string) => {
      // Access the instance via the current ref value
      const hls = hlsRef.current;
      if (!hls || !hls.media) return;

      const buffered = hls.media.buffered;
      const currentTime = hls.media.currentTime;
      let bufferLength = 0;

      for (let i = 0; i < buffered.length; i++) {
        if (
          currentTime >= buffered.start(i) &&
          currentTime <= buffered.end(i)
        ) {
          bufferLength = buffered.end(i) - currentTime;
          break;
        }
      }

      const metrics: HlsMetrics = {
        bufferLength: Number(bufferLength.toFixed(2)),
        bitrate: hls.levels[hls.currentLevel]?.bitrate || 0,
        bandwidth: hls.bandwidthEstimate || 0,
        latency: hls.latency || 0,
        eventType,
      };

      socketInstance.emit("hls-telemetry", metrics);
    };

    // Note: We use a small delay or event listeners to ensure the ref is populated
    const hls = hlsRef.current;
    if (hls) {
      hls.on(Hls.Events.FRAG_BUFFERED, () => emitTelemetry("FRAG_BUFFERED"));
      hls.on(Hls.Events.LEVEL_SWITCHED, () => emitTelemetry("LEVEL_SWITCHED"));
    }

    intervalRef.current = setInterval(() => emitTelemetry("HEARTBEAT"), 10000);
    return () => {
      const currentHls = hlsRef.current;
      if (currentHls) {
        currentHls.off(Hls.Events.FRAG_BUFFERED);
        currentHls.off(Hls.Events.LEVEL_SWITCHED);
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // socket and hlsRef are stable, but we re-run if socket changes
  }, [socket, hlsRef]);
};
