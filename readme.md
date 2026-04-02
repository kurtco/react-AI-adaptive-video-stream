## Jira Ticket

[CRM-XXXX](https://usatoday.atlassian.net/browse/CRM-XXXX)

## Summary

HLS-Sentinel es un orquestador de video de "lazo cerrado" diseñado para maximizar el QoE (Quality of Experience) y proteger el revenue publicitario. El sistema captura telemetría de alta frecuencia desde el cliente (HLS.js) y utiliza un agente de IA (LangGraph) para diagnosticar y mitigar fallos de red o de anuncios en tiempo real.

## Architecture

- **Frontend:** React + HLS.js (Custom Wrapper para telemetría).
- **Backend:** NestJS + WebSockets (Ingesta de eventos).
- **AI Orchestration:** LangGraph + Gemini (Máquina de estados para diagnóstico).
- **Delivery:** HLS (Adaptive Bitrate Streaming).

## Changes

- Implementación de `TelemetryGateway` en NestJS para ingesta masiva.
- Integración de HLS.js con hooks de React para monitoreo de buffer.
- Lógica de diagnóstico en LangGraph para diferenciar fallos de CDN vs Ad-server.

## Testing

- Simulación de `BUFFER_STALLED` para verificar la respuesta del agente.
- Pruebas de inyección de configuración dinámica en el player.
