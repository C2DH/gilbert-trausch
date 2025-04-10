import { useContext, useEffect } from "react";
import { formatRichText } from "../../lib/utils";
import Slider from "./Slider";
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "framer-motion";
import { PopupContext } from "../../contexts/PopupContext";
import { useMediaQuery } from "react-responsive";
import bgSmall from '../../assets/images/backgrounds/bg-1.webp';


export default function SlideSlider({data, locale}) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;
    const { isOpenPopup, setIsOpenPopup, dataPopup } = useContext(PopupContext);
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});
    
    useEffect(() => {
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            swiperContainer.style.zIndex = isOpenPopup ? "1000" : "0";
        }
    }, [isOpenPopup])

    return (
        <>
            <div style={{ background: `url(${isMobile ? bgSmall : imageUrl}) right / cover no-repeat` }} className='slide_text_slider h-screen slide'>
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0 h-[calc(100vh-40px)] overflow-hidden">
                        <div className="grid grid-cols-12 lg:gap-x-8 lg:h-full overflow-scroll">

                            <div className="col-span-12 lg:col-span-4 lg:border-r border-black lg:pr-[30px] flex items-center lg:overflow-hidden">
                                { (data?.slidable?.content && locale) &&
                                    <div className="richeditor lg:h-full overflow-scroll pb-[40px] pt-[20px] lg:py-[40px]" style={{ color: color }}>{ formatRichText(data.slidable.content[locale])}</div>
                                }
                            </div>

                            <div className="col-span-12 lg:col-span-7 2xl:col-span-8 relative">
                                <div className="grid grid-cols-8 lg:h-full">
                                    <div className="col-span-8 lg:py-[40px]">
                                        { data?.slidable?.documents &&
                                            <Slider items={data.slidable.documents} locale={ locale }/>
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
                        <PopupResource setIsOpenPopup={ setIsOpenPopup } data={ dataPopup } locale={ locale }/>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )
}