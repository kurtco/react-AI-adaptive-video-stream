
import {useEffect, useRef} from "react"
import { TEST_STREAM } from "../App"

export const TestPlayer = ()    => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const startTimePlayRef = useRef<number>(0)

    useEffect(() => {
        const video = videoRef.current
        if(!video){
            return
        }

        const handleError = (e: any) => {
            console.log(`There was a error ${e}`)
        }

        const handlePause = () => {
            console.log('video stopped')
        }

        const handlePlay=() => {
            const timeFirstFrame = performance.now() - startTimePlayRef.current;
            if(startTimePlayRef.current === 0){
                return
            }

            if(startTimePlayRef.current > 0){
                console.log(`TTFF (Time to first frame): ${timeFirstFrame.toFixed(2) } ms`)
                startTimePlayRef.current = 0
            }

        }

        const handleVideoLoadStart = () => {
            startTimePlayRef.current = performance.now()
            console.log('carga iniciada')
        }

        video.addEventListener('pause', handlePause)
        video.addEventListener('loadstart', handleVideoLoadStart)
        video.addEventListener('playing', handlePlay)
        video.addEventListener("error", handleError)

        return () =>{
            video.removeEventListener('pause', handlePause)
            video.removeEventListener('loadstart', handleVideoLoadStart)
            video.removeEventListener('playing', handlePlay)
            video.removeEventListener('error', handleError)
        }
    },[videoRef])

    return <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{width: "100%", borderRadius: "12px", backgroundColor: "#0000", border: "1px solid #3333"}}
    >
        <source src={TEST_STREAM} type="video/mp4"/> No Video Supported
    </video>
}