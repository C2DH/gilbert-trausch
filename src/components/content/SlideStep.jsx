import { useContext, useEffect } from "react";
import { formatRichText } from "../../lib/utils";
import PlayerPDF from "./PlayerPDF";
import Slider from "./Slider";
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "framer-motion";
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
                    <div className="container mx-auto px-[20px] xl:px-0 h-[calc(100dvh-40px)] sm:h-[calc(100vh-40px)] overflow-hidden">
                        <div className="grid grid-cols-12 h-full">
                            <div className="col-span-12 xl:col-span-8 relative order-2 xl:order-1">
                                <div className="grid grid-cols-8 lg:h-full">
                                    <div className="col-span-8 py-[40px] flex items-center lg:pr-[30px]">
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

                            <div className="col-span-12 xl:col-span-4 lg:border-l border-black flex flex-col justify-center order-1 xl:order-2" style={{ color: color }}>
                                { (data?.slidable?.title && locale) &&
                                    <span className={`block uppercase px-[30px] py-[10px] xl:py-[40px] border-l lg:border-l-0 border-t border-r rounded-tr-xl border-black`}>{data.slidable.title[locale]}</span>
                                }

                                { (data?.slidable?.content && locale) &&
                                    <div className="border-b border-r border-t border-l lg:border-l-0 px-[30px] pt-[20px] rounded-br-xl border-black richeditor">{formatRichText(data.slidable.content[locale])}</div>
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
                        <PopupResource setIsOpenPopup={ setIsOpenPopup } data={ dataPopup } locale={ locale }/>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )
}