import { useEffect, useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';


export default function PlayerAudio( {url} ) {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.on('audioprocess', () => {
                setCurrentTime(wavesurfer.getCurrentTime());
            });

            wavesurfer.on('ready', () => {
                setDuration(wavesurfer.getDuration());
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
        setDuration(ws.getDuration())
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
        <div className="w-full border border-black rounded-[10px] px-[30px] py-[20px] player-audio">
            <div className='flex items-center justify-between'>
                <div onClick={onPlayPause} className='w-[60px] h-[60px] bg-blue rounded-[50%] flex items-center justify-center'>
                    {isPlaying ? 
                        <FontAwesomeIcon icon={faPause} style={{color: 'white', fontSize: '30px' }}/> 
                        : 
                        <FontAwesomeIcon icon={faPlay} style={{color: 'white', fontSize: '30px' }}/>
                    }
                </div>

                {/* <div className='min-w-[300px] h-full'> */}
                <div className='w-[calc(100%-150px)]'>
                    <WavesurferPlayer
                        height={60}
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
                        <span className={classNames('block leading-none', {
                            'text-[#CDD3D7]': currentTime !== duration 
                        })}>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
      </div>
    )
}