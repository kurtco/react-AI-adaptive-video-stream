export interface HlsMetrics {
  bufferLength: number;
  bitrate: number;
  bandwidth: number;
  latency: number;
  eventType: string;
}

export interface PlayerCommand {
  command: "TUNE_ABR" | "SKIP_AD_SEGMENT" | "RELOAD";
  payload?: {
    capLevel: number;
    minBuffer?: number;
  };
}
