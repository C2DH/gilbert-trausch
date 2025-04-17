import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

export default function PlayerVideo ({url, startAudio, setStartAudio}) {

    console.log('start', startAudio)

    const location = useLocation();
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false)

    if (location.pathname === "/") {
        return (
            <div className='fixed bottom-[20px] left-[50%] -translate-x-[50%]'>
             {startAudio &&
                <div className='w-[40px] h-[40px] bg-blue rounded-[50%] flex items-center justify-center' onClick={() => setStartAudio(!startAudio)}>
                    {/* {startAudio ?
                        <SpeakerXMarkIcon className='text-white w-[22px] cursor-pointer'/>
                    : 
                        <SpeakerWaveIcon className='text-white w-[22px] cursor-pointer ' />
                    } */}
                   
                        <SpeakerXMarkIcon className='text-white w-[22px] cursor-pointer'/>
                </div>
                    }
                
                <ReactPlayer
                    ref={playerRef}
                    playing={startAudio}
                    url={url}  
                    width="100%" 
                    height="100%" 
                    className="bg-blue"
                    controls={false}
                    onEnded={() => setIsPlaying(false)}
                />
            </div>
        )
    } else {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <ReactPlayer 
                        url={url}  
                        width="100%" 
                        height="100%" 
                        className="absolute top-0 left-0"
                        controls={true}
                    />
                </div>
            </div>
        )
    }
}