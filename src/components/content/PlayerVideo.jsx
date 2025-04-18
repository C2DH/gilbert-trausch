import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { motion } from "motion/react";
import { AnimatePresence } from 'motion/react';

export default function PlayerVideo ({url, startAudio, setStartAudio, isVisible, isMobile }) {

    const location = useLocation();
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false)

    if (location.pathname === "/") {
        return (
            <>
                <AnimatePresence>
                    {isVisible &&
                        <motion.div 
                            initial={{ opacity: 0, y: 100, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 100, x: '-50%' }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className='fixed bottom-[20px] left-[50%] -translate-x-[50%]'>
                            {startAudio ? (
                                <div className='w-[40px] h-[40px] bg-blue rounded-[50%] flex items-center justify-center' onClick={() => setStartAudio(!startAudio)}>
                                    <SpeakerXMarkIcon className='text-white w-[22px] cursor-pointer'/>
                                </div>
                            ) : (
                                <div className='w-[40px] h-[40px] bg-blue rounded-[50%] flex items-center justify-center' onClick={() => setStartAudio(!startAudio)}>
                                    <SpeakerWaveIcon className='text-white w-[22px] cursor-pointer ' />
                                </div>
                            )}
                            
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
                        </motion.div>
                    }
                </AnimatePresence>

                {isMobile &&
                    <motion.div
                        initial={{ opacity: 0, y: 100, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className='fixed bottom-[20px] left-[50%]'>
                        {startAudio ? (
                            <div className='w-[40px] h-[40px] bg-blue rounded-[50%] flex items-center justify-center' onClick={() => setStartAudio(!startAudio)}>
                                <SpeakerXMarkIcon className='text-white w-[22px] cursor-pointer'/>
                            </div>
                        ) : (
                            <div className='w-[40px] h-[40px] bg-blue rounded-[50%] flex items-center justify-center' onClick={() => setStartAudio(!startAudio)}>
                                <SpeakerWaveIcon className='text-white w-[22px] cursor-pointer ' />
                            </div>
                        )}
                        
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
                    </motion.div>
                }
            </>
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