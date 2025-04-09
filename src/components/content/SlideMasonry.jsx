import { useEffect, useState } from "react";
import { formatRichText } from "../../lib/utils";
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "framer-motion";
import audioLogo from '../../assets/images/audio.svg';
import videoLogo from '../../assets/images/video.svg';
import bgSmall from '../../assets/images/backgrounds/bg-1.webp';
import { useMediaQuery } from "react-responsive";

export default function SlideMasonry({ data }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const documents = data?.slidable?.documents;
    const color = data?.slidable?.color_text;
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [dataPopup, setDataPopup] = useState()
    const locale = 'fr';
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)'});
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});

    useEffect(() => {
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            swiperContainer.style.zIndex = isOpenPopup ? "1000" : "0";
        }
    }, [isOpenPopup])

    return (
        <>
            <div style={{ background: `url(${isMobile ? bgSmall : imageUrl}) right / cover no-repeat` }} className='h-screen slide slide_masonry slide'>
                <div className="container mx-auto px-[20px] xl:px-0 h-full overflow-y-scroll">
                    <div className="relative top-[40px]">
                        <div className="grid grid-cols-12 lg:h-[calc(100vh-40px)]">

                            <div className="col-span-12 lg:col-span-4 lg:border-r border-black py-[20px] lg:py-[40px] lg:overflow-y-scroll lg:pr-[30px]">
                                {(data?.slidable?.content && locale) &&
                                    <div className="richeditor" style={{ color: color }}>{ formatRichText(data.slidable.content[locale])}</div>
                                }
                            </div>

                            <div className="col-span-12 lg:col-span-7 2xl:col-span-8 lg:overflow-y-scroll pb-[60px] lg:py-[40px] lg:pl-[30px]">
                                <div className="columns-2 lg:columns-4">
                                    {documents?.map((document, index) => {
                                        if (document?.url && locale) {

                                            // All types except Video and Audio
                                            if (document.type !== "audio" && document.type !== "video" && document.optimized_url ) {
                                                return (
                                                    <div key={index} className="mb-4 break-inside-avoid cursor-pointer" onClick={() => { setIsOpenPopup(true); setDataPopup(document); }}>
                                                        <img src={document?.optimized_url?.thumbnail?.url} alt={document?.name[locale]} className="w-full" />
                                                    </div>
                                                )
                                            }

                                            // Audio / Video
                                            if (document.type === "audio" || document.type === "video") {
                                                return document?.cover ? (
                                                    <div key={index} className="mb-4 break-inside-avoid cursor-pointer" onClick={() => { setIsOpenPopup(true); setDataPopup(document); }}>
                                                        <img src={document.cover} alt={document?.name[locale]} className="w-full" />
                                                    </div>
                                                ) : (
                                                    <div className="mb-4 break-inside-avoid cursor-pointer bg-[#DBDBD0] flex justify-center items-center h-[200px]" onClick={() => { setIsOpenPopup(true); setDataPopup(document); }}>
                                                        <img src={ document.type === "audio" ? audioLogo : videoLogo } alt={ document.name[locale]} className="h-[100px]"/>
                                                    </div>
                                                )
                                            }
                                        }
                                        return null;
                                    })}
                                </div>
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