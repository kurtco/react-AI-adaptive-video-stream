import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Socket } from "socket.io-client";
import type { HlsMetrics } from "../types/types";

export const useHlsTelemetry = (hls: Hls | null, socket: Socket | null) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!hls || !socket) return;

    // Función para extraer y enviar métricas
    const emitTelemetry = (eventType: string) => {
      if (!hls.media) return;

      // Calculamos la longitud del buffer actual
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

      socket.emit("hls-telemetry", metrics);
    };

    // Listeners de eventos críticos de hls.js
    hls.on(Hls.Events.FRAG_BUFFERED, () => emitTelemetry("FRAG_BUFFERED"));
    hls.on(Hls.Events.LEVEL_SWITCHED, () => emitTelemetry("LEVEL_SWITCHED"));
    hls.on(Hls.Events.ERROR, (_, data) =>
      emitTelemetry(`ERROR_${data.details}`),
    );

    // Heartbeat cada 2 segundos para alimentar la memoria (history) de LangGraph
    intervalRef.current = setInterval(() => emitTelemetry("HEARTBEAT"), 2000);

    return () => {
      hls.off(Hls.Events.FRAG_BUFFERED);
      hls.off(Hls.Events.LEVEL_SWITCHED);
      hls.off(Hls.Events.ERROR);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hls, socket]);
};
