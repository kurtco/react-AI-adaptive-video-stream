import { useEffect, useRef } from "react";
import Hls from "hls.js";

export const TEST_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
export const SSAI_STREAM = "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8";

export const TestPlayerAdds = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
       console.log(" Hls isSupported")
      const hls = new Hls();
      
      // We load the single DAI manifest. The ads are already inside it.
      hls.loadSource(SSAI_STREAM);
      hls.attachMedia(video);

      // hls.js reads the #EXT-X-DISCONTINUITY tag natively 
      // and plays through the ad seamlessly.
      
      return () => {
        hls.destroy();
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      style={{ width: "100%", backgroundColor: "#000" }}
    />
  );
};