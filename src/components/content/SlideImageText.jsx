import { formatRichText } from "../../lib/utils";
import PlayerPDF from "./PlayerPDF";
import { useState, useEffect } from "react";
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "framer-motion";
import bgSmall from '../../assets/images/backgrounds/bg-1.webp';
import { useMediaQuery } from "react-responsive";



export default function SlideImageText({ data }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;
    const locale = 'fr';
    const [isPortrait, setIsPortrait] = useState(false);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [dataPopup, setDataPopup] = useState();
    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'});
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    useEffect(() => {
        if (data?.slidable?.document?.url && locale) {
            const img = new Image();
            img.src = data.slidable.document.url;
            img.onload = () => {
                setIsPortrait(img.height > img.width);
            };
        }
    }, [data, locale]);

    useEffect(() => {
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            swiperContainer.style.zIndex = isOpenPopup ? "1000" : "0";
        }
    }, [isOpenPopup])


    return (
        <>
            <div style={{ background: `url(${isMobile ? bgSmall : imageUrl}) right / cover no-repeat` }} className='h-screen slide'>
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0 h-[calc(100vh-40px)] overflow-scroll">
                        <div className="grid grid-cols-12 lg:h-full">
                            <div className="col-span-12 xl:col-span-7 2xl:col-span-8">
                                <div className="grid grid-cols-8 h-full">
                                    <div className="col-span-8 flex flex-col items-center justify-center lg:pr-[30px] pt-[20px] lg:pt-0">
                                        {(data?.slidable?.document?.url && locale) && (
                                            <img src={data.slidable.document.optimized_url.large.url} alt={data.slidable.document.name[locale]} className="lg:h-[calc(100vh-200px)] object-contain"/>
                                        )}

                                        {/** BUTTON POPUP RESOURCE */}
                                        <div className="mt-5 cursor-pointer flex justify-center" onClick={() => { setIsOpenPopup(true); setDataPopup(data.slidable?.document); }} >
                                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="15" cy="15" r="14.5" stroke="black"/>
                                                <path d="M14.125 9.5C14.125 9.03516 14.5078 8.625 15 8.625C15.4648 8.625 15.875 9.03516 15.875 9.5C15.875 9.99219 15.4648 10.375 15 10.375C14.5078 10.375 14.125 9.99219 14.125 9.5ZM12.8125 12.5625C12.8125 12.3438 13.0039 12.125 13.25 12.125H15C15.2188 12.125 15.4375 12.3438 15.4375 12.5625V20H17.1875C17.4062 20 17.625 20.2188 17.625 20.4375C17.625 20.6836 17.4062 20.875 17.1875 20.875H12.8125C12.5664 20.875 12.375 20.6836 12.375 20.4375C12.375 20.2188 12.5664 20 12.8125 20H14.5625V13H13.25C13.0039 13 12.8125 12.8086 12.8125 12.5625Z" fill="black"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 xl:col-span-4 xl:border-l border-black flex items-center xl:pl-[30px] overflow-hidden h-full">
                                {data.slidable?.content && locale && (
                                    <div className="richeditor text-center lg:text-left pt-[20px] pb-[60px] lg:py-[40px] lg:overflow-scroll h-full" style={{ color: color }}>
                                        { formatRichText(data.slidable.content[locale])}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/** POPUP */}
            <AnimatePresence>           
                {isOpenPopup &&
                    <motion.div 
                        className="w-full h-full absolute inset-0 z-[103] flex items-center justify-center bg-black/50"
                        key="popupResource"
                        initial={{ scale: 0.5, opacity: 0, y: "-50%" }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: "-50%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <PopupResource setIsOpenPopup={ setIsOpenPopup } data={ dataPopup }/>
                    </motion.div>
                }
            </AnimatePresence>      
        </>    
    )
}
