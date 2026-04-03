## Summary

- Sensor Layer (Frontend): A React component using useRef to manage the hls.js instance without triggering unnecessary re-renders, emitting metrics like bufferLength, bandwidth, and latency.

- Ingestion Layer (Backend): A NestJS Gateway that receives metrics and applies a gate of 15–30 seconds to stay within the 15 RPM limit of the Gemini free tier.

- Orchestration Layer (LangGraph): A stateful graph that maintains a sliding window (History) of the last 5 metrics to identify negative health trends.

- Actuator Logic: A deterministic node that translates AI reasoning into actionable player commands like TUNE_ABR to prevent a Stall.

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
