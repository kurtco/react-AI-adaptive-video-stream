## Summary

HLS-Sentinel is a "closed-loop" video orchestrator designed to maximize QoE (Quality of Experience) and protect ad revenue. The system captures high-frequency telemetry from the client (HLS.js) and utilizes an AI agent (LangGraph) to diagnose and mitigate network or advertisement failures in real time.

## Changes

- **TelemetryGateway Implementation:** Developed a high-throughput gateway in NestJS for massive event ingestion.
- **React & HLS.js Integration:** Implemented custom React hooks to monitor buffer health and player states.
- **LangGraph Diagnostic Logic:** Integrated a state machine using LangGraph and Gemini to differentiate between CDN issues and Ad-server failures.
- **Dynamic Delivery:** Optimized HLS Adaptive Bitrate Streaming (ABR) based on real-time AI feedback.

## Testing

- **Stall Recovery:** Simulated `BUFFER_STALLED` events to verify the AI agent's mitigation response.
- **Dynamic Configuration:** Conducted injection tests for real-time player configuration updates.
- **Event Integrity:** Verified high-frequency telemetry ingestion via WebSockets.

## Notes

N/A
