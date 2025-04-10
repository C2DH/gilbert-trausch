import { useEffect, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';


export default function PlayerAudio( {url} ) {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});


    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.on('audioprocess', () => {
                setCurrentTime(wavesurfer.getCurrentTime());
            });

            wavesurfer.on('ready', () => {
                const dur = wavesurfer.getDuration();
                if (!isNaN(dur) && dur > 0) {
                    setDuration(dur);
                }
            });

            return () => {
                wavesurfer.un('audioprocess');
                wavesurfer.un('ready');
            };
        }
    }, [wavesurfer]);
  
    const onReady = (ws) => {
        setWavesurfer(ws)
        setIsPlaying(false)
        const dur = ws.getDuration();
        if (!isNaN(dur) && dur > 0) {
            setDuration(dur);
        }
    }

    const onPlayPause = () => {
      wavesurfer && wavesurfer.playPause()
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
  
    return (
        <div className="w-full border border-black rounded-[10px] px-[20px] lg:px-[30px] py-[10px] lg:py-[20px] player-audio">
            <div className='flex items-center justify-between'>
                <div onClick={onPlayPause} className='w-[40px] lg:w-[60px] h-[40px] lg:h-[60px] bg-blue rounded-[50%] flex items-center justify-center'>
                    {isPlaying ? 
                        <FontAwesomeIcon icon={faPause} style={{color: 'white', fontSize: isMobile ? '20px' : '30px' }}/> 
                        : 
                        <FontAwesomeIcon icon={faPlay} style={{color: 'white', fontSize: isMobile ? '20px' : '30px' }}/>
                    }
                </div>

                {/* <div className='min-w-[300px] h-full'> */}
                <div className='w-[calc(100%-70px)] md:w-[calc(100%-150px)]'>
                    <WavesurferPlayer
                        height={ isMobile ? 40 : 60 }
                        cursorWidth={3}
                        waveColor="#CDD3D7"
                        barRadius={20}
                        barGap={7}
                        barWidth={3}
                        barHeight={1}
                        progressColor="#4100FC"
                        url={url}
                        onReady={onReady}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    
                    <div className='flex justify-between pt-[10px] text-[13px]'>
                        <span className='block leading-none'>{formatTime(currentTime)}</span>
                        <span className={
                            classNames('block leading-none', {
                                'text-[#CDD3D7]': currentTime !== duration 
                            })}
                        >
                            {!isNaN(duration) ? formatTime(duration) : '0:00'}
                        </span>
                    </div>
                </div>
            </div>
      </div>
    )
}