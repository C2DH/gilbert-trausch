import { useEffect, useState } from "react";
import PlayerVideo from "./PlayerVideo";
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "framer-motion";


export default function SlideMediaFull({ data }) {

    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [dataPopup, setDataPopup] = useState()
    const locale = 'fr';

    useEffect(() => {
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            swiperContainer.style.zIndex = isOpenPopup ? "1000" : "0";
        }
    }, [isOpenPopup])
    
    return (
        <>
            <div className="relative">
                {/** VIDEO */}
                { data?.slidable?.document?.type === "video" &&
                    <div className="h-screen w-full flex items-center justify-center bg-black">
                        <div className="w-[75%]">
                            <PlayerVideo url={data?.slidable?.document?.url} />
                        </div>
                    </div>
                }

                {/** IMAGES / PDF */}
                { data?.slidable?.document &&
                    <div className="h-screen w-full flex items-center justify-center" style={{ background: `url(${data?.slidable?.document?.optimized_url?.large?.url}) center / cover no-repeat` }}>
                    </div>
                }

                {/** BUTTON POPUP RESOURCE */}
                { data.slidable.document &&              
                    <div className="absolute bottom-[15px] left-[50%] -translate-x-[50%] cursor-pointer" onClick={() => { setIsOpenPopup(true); setDataPopup(data.slidable?.document); }} >
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="14.5" stroke={data.slidable.color_menu ? data.slidable.color_menu : "#000000"}/>
                            <path d="M14.125 9.5C14.125 9.03516 14.5078 8.625 15 8.625C15.4648 8.625 15.875 9.03516 15.875 9.5C15.875 9.99219 15.4648 10.375 15 10.375C14.5078 10.375 14.125 9.99219 14.125 9.5ZM12.8125 12.5625C12.8125 12.3438 13.0039 12.125 13.25 12.125H15C15.2188 12.125 15.4375 12.3438 15.4375 12.5625V20H17.1875C17.4062 20 17.625 20.2188 17.625 20.4375C17.625 20.6836 17.4062 20.875 17.1875 20.875H12.8125C12.5664 20.875 12.375 20.6836 12.375 20.4375C12.375 20.2188 12.5664 20 12.8125 20H14.5625V13H13.25C13.0039 13 12.8125 12.8086 12.8125 12.5625Z" fill={data.slidable.color_menu ? data.slidable.color_menu : "#000000"}/>
                        </svg>
                    </div>            
                }
            </div>

            {/** POPUP */}
            <AnimatePresence>           
                {isOpenPopup &&
                    <motion.div 
                        className="w-full h-full absolute inset-0 z-[105] flex items-center justify-center bg-black/50"
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

    );
}