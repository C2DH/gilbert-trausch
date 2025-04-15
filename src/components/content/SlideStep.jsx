import { useContext, useEffect } from "react";
import { formatRichText } from "../../lib/utils";
import PlayerPDF from "./PlayerPDF";
import Slider from "./Slider";
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "motion/react";
import { PopupContext } from "../../contexts/PopupContext";

export default function SlideStep({ data, locale }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;

    const { isOpenPopup, setIsOpenPopup, dataPopup } = useContext(PopupContext);
    
    useEffect(() => {
        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
            swiperContainer.style.zIndex = isOpenPopup ? "1000" : "0";
        }
    }, [isOpenPopup])

    return (
        <>
            <div style={{ background: `url(${imageUrl}) right / cover no-repeat` }} className='h-screen slide slide_step'>
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0 h-[calc(100vh-80px)] xl:h-[calc(100vh-40px)] overflow-hidden">
                        <div className="grid grid-cols-12 h-full overflow-y-scroll">
                            <div className="col-span-12 lg:col-span-8 relative order-2 lg:order-1 h-full">
                                <div className="grid grid-cols-8 lg:h-full">
                                    <div className="col-span-8 lg:py-[40px] xl:flex items-center lg:pr-[30px] relative h-full">
                                        {data?.slidable?.documents?.length > 0 ? (
                                            data.slidable.documents.length === 1 ? (
                                                data.slidable.documents[0].url.endsWith('.pdf') ? (
                                                    <PlayerPDF file={data.slidable.documents[0].url} />
                                                ) : (
                                                    <img src={data.slidable.documents[0].url} alt={data.slidable.documents[0].name[locale]} className="max-h-[80vh]"/>
                                                )
                                            ) : (
                                                <Slider items={data.slidable.documents} locale={ locale }/>
                                            )
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-4 lg:border-l border-black flex flex-col justify-center items-center lg:items-start order-1 lg:order-2 pt-[20px]" style={{ color: color }}>
                                <div className="w-full md:w-2/3 lg:w-full">
                                    { (data?.slidable?.title && locale) &&
                                        <span className={`block uppercase px-[10px] lg:px-[20px]  py-[10px] xl:py-[40px] border-l lg:border-l-0 border-t border-r rounded-tl-xl rounded-tr-xl lg:rounded-tl-none border-black`}>{data.slidable.title[locale]}</span>
                                    }

                                    { (data?.slidable?.content && locale) &&
                                        <div className="border-b border-r border-t border-l lg:border-l-0 px-[10px] lg:px-[20px] py-[10px] rounded-bl-xl rounded-br-xl lg:rounded-bl-none border-black richeditor">{formatRichText(data.slidable.content[locale])}</div>
                                    }
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
                        className="w-full h-full absolute inset-0 z-[1000]"
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