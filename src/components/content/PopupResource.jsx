import { useEffect, useState } from 'react';
import background from '../../assets/images/backgrounds/bg-1.webp';
import { formatRichText, formatTypeName, formatDate, formatDateYear } from '../../lib/utils';
import { motion } from "framer-motion";
import classNames from 'classnames';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import PlayerVideo from '../content/PlayerVideo';
import PlayerAudio from './PlayerAudio';
import audioLogo from '../../assets/images/audio.svg';
import PlayerPDF from './PlayerPDF';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';

export default function PopupResource({ setIsOpenPopup, data, locale }) {

    const [isImageVisible, setIsImageVisible] = useState(false);
    const { t } = useTranslation();
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    console.log('locale', locale)

    useEffect(() => {
        setIsImageVisible(true);
    }, []);

    return (
        <div style={{ background: `url(${background}) center / cover no-repeat` }} className='popup_resource h-screen w-full'>
        
			<div className='lg:hidden py-[10px] border-b border-black'>
				<span className='block text-[16px] text-center cursor-pointer hover:text-[#4100FC] duration-500 uppercase font-normal' onClick={() => setIsOpenPopup(false) }>{ t('close') }</span>
			</div>

            <div className="grid grid-cols-12 h-full">
                <div className="col-span-12 lg:col-span-9 border-r border-black pt-[20px] lg:pt-[60px] lg:py-[60px] h-[300px] lg:h-full relative overflow-hidden">
                    <div className='grid grid-cols-12 lg:grid-cols-9 h-full px-[20px]'>
                        <div className='col-span-12 lg:col-span-9 lg:flex justify-center items-center overflow-hidden h-[220px] xl:h-[calc(100vh-120px)]'>

                            { (data.type === "image" && data.optimized_url) &&                            
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: isImageVisible ? 1 : 0, scale: isImageVisible ? 1 : 0.5 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <ImageZoom image={ isMobile ? data.optimized_url.thumbnail.url : data.optimized_url.large.url } alt={ data.name[locale] }/>
                                </motion.div>
                            }

                            { data.type === "video" &&
                                <PlayerVideo url={ data.url } />
                            }

                            { data.type === "audio" && (
                                <div className='w-1/2'>
                                    <div className='w-full'>
                                        { data.cover ? (
                                            <img src={data.cover} alt={data.name[locale]} className='aspect-square rounded-[10px] mb-[30px]'/>
                                        ) : (
                                            <div className="bg-[#DBDBD0] w-full flex justify-center items-center relative mb-[30px] border border-black rounded-[10px]">
                                                <img src={ audioLogo } alt="Logo audio" className="h-[250px]" />
                                            </div>
                                        )}

                                        <PlayerAudio url={data.url} />
                                    </div>
                                </div>
                            )}

                            { (data.type !== 'audio' && data.type !== 'video' && data.type !== 'image') && 
                                <PlayerPDF url={ data.url }/>
                            }

                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-3 flex flex-col overflow-auto">
                    <div className='hidden lg:block py-[10px] border-b border-black px-[30px]'>
                        <span className='cursor-pointer text-[18px] hover:text-[#4100FC] duration-500 uppercase font-normal' onClick={() => setIsOpenPopup(false) }>{ t('close') }</span>
                    </div>

					<div className='lg:h-[calc(100vh-55px)] lg:overflow-auto'>
						<div className="content py-[30px] px-[20px] border-b border-black">
							<div className='flex lg:block justify-between items-center'>
								{ data?.date && (
									data.display_year ? (
										<span className='block text-[15px] mb-[25px]'>{ formatDateYear(data.date, locale) }</span>
									) : (
										<span className='block text-[15px] mb-[25px]'>{ formatDate(data.date, locale) }</span>
									)
								)}

								{ data?.type &&
									<span className='inline-block py-[3px] px-[10px] text-[14px] mb-[25px] bg-blue text-white rounded-[10px]'>{ formatTypeName(data.type , locale) }</span>
								}
							</div>

							<h1 className="text-[22px] leading-[32px] font-normal mb-[15px]">{ data.name[locale] }</h1>
							
							{ data?.description &&
								<div className='mb-[30px] ]'>{ formatRichText(data.description[locale]) }</div>
							}

							{ data?.source &&
								<div className='text-[14px] leading-[18px]'>
									<span className='font-semibold'>Source</span>
									<div>{ formatRichText(data.source) }</div>
								</div>
							}

							{ data?.copyright &&
								<div className='text-[14px] leading-[18px] mt-[20px]'>
									<span className='font-semibold'>Copyright</span>
									<div>{ formatRichText(data.copyright) }</div>
								</div>
							}
						</div>

						<div className="tags py-[30px] px-[20px] overflow auto">
							<div className='flex flex-wrap gap-[15px]'>
								{ data?.tags?.map(tag =>
									<span key={ tag.id } className='inline-block py-[4px] px-[10px] text-[12px] uppercase border border-black rounded-[8px]'>{ tag.name[locale] }</span>
								)}
							</div>
						</div>
					</div>

                </div>
            </div>
        </div>
    )
}


const ImageZoom = ({ image, alt }) => {
    const [stateZoom, setStateZoom] = useState(null)

    function handleTransform(e){
        setStateZoom(e.instance.transformState.scale)
    }

    return (
        <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0} onTransformed={(e) => handleTransform(e)}>
            {() => (
                <>
                    <TransformComponent wrapperStyle={{ overflow: 'visible'}}>
                        <img src={ image } alt={ alt } className='max-h-[50dvh] lg:max-h-[calc(100vh-120px)] object-contain'/>
                    </TransformComponent>
                    <Controls zoom={stateZoom}/>
                </>
            )}
        </TransformWrapper>
    )
}

const Controls = ({ zoom }) => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    return (
        <div className='absolute bottom-[10px] left-[50%] -translate-x-[50%]'>
            <div className='flex justify-center'>
                <div className="flex cursor-pointer">
                    <div className='border border-black' style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px'}} onClick={() => zoomOut() }>
                        <MagnifyingGlassMinusIcon style={{width: '50px'}} className={classNames('px-[15px] py-[8px]', { "pointer-events-none opacity-30": zoom === null || zoom === 1 })} />
                    </div>
                    <div className='uppercase text-[14px] flex items-center border-t border-b border-black px-[12px]' onClick={() => resetTransform()}>
                        <span className={classNames({"pointer-events-none opacity-30": zoom === null || zoom === 1 })}>Reset</span>
                    </div>
                    <div className='border border-black' style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px'}} onClick={() => zoomIn()}>
                        <MagnifyingGlassPlusIcon style={{width: '50px'}} className={classNames('px-[15px] py-[8px]', { "pointer-events-none opacity-30": zoom === 8 })}/>
                    </div>
                </div>
            </div>
        </div>
    )
}