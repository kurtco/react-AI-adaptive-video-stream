## Jira Ticket

[CRM-XXXX](https://buildops.atlassian.net/browse/CRM-XXXX)

## Summary

The **AIdaptive Stream Frontend** is a high-performance React application serving as the sensor layer for an AI-driven HLS orchestration system. It integrates `hls.js` with a custom WebSocket provider to feed real-time Quality of Service (QoS) metrics into a NestJS/LangGraph backend, enabling closed-loop Adaptive Bitrate (ABR) adjustments via Gemini 1.5 Flash.

## Changes

- **HLS Telemetry Provider**: Custom React hook that extracts `bufferLength`, `bitrate`, `bandwidth`, and `latency` directly from the `hls.js` engine.
- **WebSocket Integration**: Low-latency communication layer using `socket.io-client` for real-time telemetry emission and command reception.
- **Deterministic Command Actuator**: Logic to intercept `TUNE_ABR` and `SKIP_AD_SEGMENT` commands from the AI agent and apply them to the video instance.
- **Strict TypeScript Implementation**: Full type safety for telemetry DTOs and Socket.io event schemas, mirroring the backend architecture.
- **Responsive Video UI**: Optimized player layout designed for cross-browser compatibility using Media Source Extensions (MSE).
