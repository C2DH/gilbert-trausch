import { useEffect, useState } from "react";
import { formatRichText } from "../../lib/utils";
import PlayerPDF from "./PlayerPDF";
import {AnimatePresence, motion } from "framer-motion";
import PopupResource from "./PopupResource";
import classNames from "classnames";
import bgSmall from '../../assets/images/backgrounds/bg-1.webp';
import { useMediaQuery } from "react-responsive";

export default function SlideColumn({data}) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const position = data?.slidable?.position;
    const color = data?.slidable?.color_text;
    const locale = 'fr';
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [dataPopup, setDataPopup] = useState();
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)'});
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});
    let columns = [];

    const imageElement = (data?.slidable?.document?.url && locale) ? (
        <div className="flex flex-col items-center">
            {data.slidable.document.url.endsWith('.pdf') ? (
                <PlayerPDF 
                    key={data.slidable.document.id} 
                    file={data.slidable.document.url} 
                    className="max-h-[60vh]" 
                />
            ) : (
                <img 
                    src={data.slidable.document.url} 
                    alt={data.slidable.document.name[locale]} 
                    className="w-full"
                />
            )}
    
            {/** BUTTON POPUP RESOURCE */}
            <div 
                className="mt-5 cursor-pointer" 
                onClick={() => { setIsOpenPopup(true); setDataPopup(data.slidable?.document); }} 
            >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="14.5" stroke="black"/>
                    <path d="M14.125 9.5C14.125 9.03516 14.5078 8.625 15 8.625C15.4648 8.625 15.875 9.03516 15.875 9.5C15.875 9.99219 15.4648 10.375 15 10.375C14.5078 10.375 14.125 9.99219 14.125 9.5ZM12.8125 12.5625C12.8125 12.3438 13.0039 12.125 13.25 12.125H15C15.2188 12.125 15.4375 12.3438 15.4375 12.5625V20H17.1875C17.4062 20 17.625 20.2188 17.625 20.4375C17.625 20.6836 17.4062 20.875 17.1875 20.875H12.8125C12.5664 20.875 12.375 20.6836 12.375 20.4375C12.375 20.2188 12.5664 20 12.8125 20H14.5625V13H13.25C13.0039 13 12.8125 12.8086 12.8125 12.5625Z" fill="black"/>
                </svg>
            </div>
        </div>
    ) : null;

    const content1Element = (data?.slidable?.content_1 && locale) && (
        <div className="richeditor" style={{ color: color }}>{formatRichText(data.slidable.content_1[locale])}</div>
    );
    
    const content2Element = (data?.slidable?.content_2 && locale) && (
        <div className="richeditor" style={{ color: color }}>{formatRichText(data.slidable.content_2[locale])}</div>
    );
    
    if (position === "0") {
        columns = [imageElement, content1Element, content2Element];
    } else if (position === "1") {
        columns = [content1Element, imageElement, content2Element];
    } else if (position === "2") {
        columns = [content1Element, content2Element, imageElement];
    }

    useEffect(() => {
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            swiperContainer.style.zIndex = isOpenPopup ? "1000" : "0";
        }
    }, [isOpenPopup])

    return (
        <>
            <div style={{ background: `url(${isMobile ? bgSmall : imageUrl}) right / cover no-repeat` }} className="h-screen slide_columns slide">
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0">
                        <div className="grid grid-cols-12 h-[calc(100vh-40px)] overflow-scroll">
                            {columns?.map((column, index) => (
                                <div key={index} className={classNames("col-span-12 lg:col-span-4 lg:overflow-y-scroll h-full pt-[20px] pb-[60px] lg:py-[40px]",{
                                    'lg:pr-[30px]' : index === 0,
                                    'lg:px-[30px] lg:border-r lg:border-l border-black' : index === 1,
                                    'lg:pl-[30px]' : index === 2
                                })}>{column}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/** POPUP */}
            <AnimatePresence>           
                {isOpenPopup &&
                    <motion.div 
                        className="w-full h-full absolute inset-0 z-[103] flex items-center justify-center bg-black/50"
                        key="popupResourceChapter"
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
    );
}