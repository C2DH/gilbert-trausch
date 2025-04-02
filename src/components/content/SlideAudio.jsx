import { useEffect, useState } from "react";
import { formatRichText } from "../../lib/utils";
import Slider from "./Slider";
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { PopupContext } from "../../contexts/PopupContext";


export default function SlideAudio({ data }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const color = data?.slidable?.color_text;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const locale = 'fr';
    const { isOpenPopup, setIsOpenPopup, dataPopup } = useContext(PopupContext);

    useEffect(() => {
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            swiperContainer.style.zIndex = isOpenPopup ? "1000" : "0";
        }
    }, [isOpenPopup])

    return (
        <>
        <div style={{ background: `url(${imageUrl}) right / cover no-repeat` }} className='slide_audio h-screen slide'>
            <div className="">
                <div className="container mx-auto px-4 xl:px-0 pt-[40px]">
                    <div className="grid grid-cols-12 lg:h-[calc(100vh-40px)]">

                        <div className="col-span-12 lg:col-span-8 flex items-center relative mb-[60px] lg:mb-0 mt-[40px]">
                            <div className="grid grid-cols-8 h-full w-full overflow-hidden">
                                <div className="col-span-8 lg:col-span-6 lg:col-start-2 max-h-[calc(100vh-180px)]">
                                    { data?.slidable?.documents &&
                                        <Slider items={data.slidable.documents} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 lg:border-l border-black py-[40px] pl-[30px] lg:flex lg:items-center overflow-y-scroll">
                            { (data?.slidable?.content && locale) &&
                                <div className="richeditor" style={{ color: color }}>{ formatRichText(data.slidable.content[locale])}</div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>

        {/** POPUP */}
        <AnimatePresence>           
            {isOpenPopup &&
                <motion.div 
                    className="w-full h-full absolute inset-0 z-[103]"
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