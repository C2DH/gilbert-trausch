import { useContext, useEffect } from "react";
import { formatRichText } from "../../lib/utils";
import Slider from "./Slider";
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "framer-motion";
import { PopupContext } from "../../contexts/PopupContext";

export default function SlideSlider({data}) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;
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
            <div style={{ background: `url(${imageUrl}) right / cover no-repeat` }} className='slide_text_slider h-screen slide'>
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0">
                        <div className="grid grid-cols-12 lg:gap-x-8 lg:h-[calc(100vh-40px)] overflow-hidden">

                            <div className="col-span-12 lg:col-span-4 lg:border-r border-black py-[40px] lg:pr-[30px] pt-[40px]">
                                { (data?.slidable?.content && locale) &&
                                    <div className="richeditor" style={{ color: color }}>{ formatRichText(data.slidable.content[locale])}</div>
                                }
                            </div>

                            <div className="col-span-12 lg:col-span-8 relative">
                                <div className="grid grid-cols-8 h-f
                                l">
                                    <div className="col-span-8 py-[40px]">
                                        { data?.slidable?.documents &&
                                            <Slider items={data.slidable.documents} />
                                        }
                                    </div>
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