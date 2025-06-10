import { useEffect, useState } from 'react';
import background from '../assets/images/backgrounds/bg-1.webp';
import { formatRichText, formatTypeName, formatDate, formatDateYear } from '../lib/utils';
import classNames from 'classnames';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import PlayerVideo from './content/PlayerVideo';
import PlayerAudio from './content/PlayerAudio';
import PlayerPDF from './content/PlayerPDF';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import i18n from '../../i18n';
import bgAudio from '../assets/images/backgrounds/bg-audio-default.webp';
import { AnimatePresence, motion } from "motion/react"

const API_URL = import.meta.env.VITE_API_URL;


export default function Resource() {

    const locale = i18n.language;
    const [isImageVisible, setIsImageVisible] = useState(false);
    const { id } = useParams();
    const [data, setData] = useState(null);
    const { t } = useTranslation();
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setIsImageVisible(true);

        const fetchData = async () => {
            const res = await fetch(`${API_URL}/api/resource/${id}`);
            const product = await res.json();
            setData(product.data);
        }

        fetchData();
    }, []);


    if(!data) return null;

    return (

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ background: `url(${background}) center / cover no-repeat` }} className={classNames('popup_resource h-[100dvh] flex flex-col overflow-hidden  ', { "fixed inset-0 z-[9999]": location.state?.modal })}>
                
                <div className='lg:hidden py-[10px] border-b border-black h-[40px]'>
                    <span className='block text-[14px] text-center cursor-pointer hover:text-[#4100FC] duration-500 uppercase font-light' onClick={() => location.state?.modal ? navigate(-1) : navigate('/virtual-tour') }>{ t('close') }</span>
                </div>

                <div className='flex-1 overflow-y-auto'>
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 lg:col-span-8 2xl:col-span-9 border-r border-black lg:h-[100dvh] relative pt-[20px] lg:pt-0 lg:flex justify-center items-center">
        
                            { (data.type === "image" && data.optimized_url) &&
                                <div className='px-[20px] w-full'>
                                    <ImageZoom image={ isMobile ? data.optimized_url.thumbnail.url : data.optimized_url.large.url } alt={ data.name[locale] }/>  
                                </div>                       
                            }

                            { data.type === "video" &&
                                <div className='w-full h-full bg-black py-[20px] lg:py-0'>
                                    <PlayerVideo url={ data.url } />
                                </div>
                            }

                            { data.type === "audio" && (
                                <div className='aspect-square w-2/3 md:w-1/3 flex flex-col items-center'>
                                    { data.cover[locale] ? (
                                        <img src={data.cover[locale]} alt={data.name[locale]} className='rounded-[6px] mb-[30px] max-h-[250px] md:max-h-none'/>
                                    ) : (
                                        <div className="bg-[#DBDBD0] flex justify-center items-center relative mb-[30px] border border-black rounded-[6px]">
                                            <img src={ bgAudio } alt="Logo audio" className="rounded-[6px] max-h-[250px] md:max-h-none" />
                                        </div>
                                    )}

                                    <PlayerAudio url={data.url}/>
                                </div>
                            )}

                            { (data.type !== 'audio' && data.type !== 'video' && data.type !== 'image') &&
                                <div className='w-full px-[20px] lg:flex flex-col lg:flex-row items-center justify-center'>
                                    <PlayerPDF url={ data.url } optimized_url={data.optimized_url}/>
                                </div>
                            }

                        </div>

                        <div className="col-span-12 lg:col-span-4 2xl:col-span-3 flex flex-col overflow-auto">
                            <div className='hidden border-b border-black pl-[20px] h-[40px] lg:flex items-center'>
                                <span className='cursor-pointer text-[18px] font-light hover:text-[#4100FC] duration-500 uppercase' onClick={() => location.state?.modal ? navigate(-1) : navigate('/resources') }>{ t('close') }</span>
                            </div>

                            <div className='lg:h-[calc(100dvh-55px)] lg:overflow-auto'>
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
                                            <span className='inline-block py-[4px] px-[6px] text-[12px] leading-[12px] mb-[25px] bg-blue text-white rounded-[4px]'>{ formatTypeName(data.type , locale) }</span>
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
                                            <div key={ tag.id } className='py-[7px] px-[14px] text-[12px] leading-none uppercase border border-black rounded-[6px]'>{ tag.name[locale] }</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
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
                    <TransformComponent wrapperStyle={{ width: '100%'}}>
                        <img src={ image } alt={ alt } className='lg:max-h-[calc(100dvh-120px)]'/>
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
        <>
            {/* Controls Desktop */}
            <div className='hidden lg:block absolute bottom-0 xl:bottom-[10px] left-[50%] -translate-x-[50%] mt-[20px]'>
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

            {/* Controls Mobile */}
            <div className='lg:hidden flex justify-center mt-[20px] pb-[50px]'>
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
        </>
    )
}