import { useEffect, useState } from "react";
import { formatRichText } from "../../lib/utils";
import PlayerPDF from './PlayerPDF';
import PopupResource from "./PopupResource";
import {AnimatePresence, motion } from "framer-motion";

export default function SlideMasonry({data}) {

    const API_URL = import.meta.env.VITE_API_URL;

    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const documents = data?.slidable?.documents;
    const color = data?.slidable?.color_text;
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
            <div style={{ background: `url(${imageUrl}) right / cover no-repeat` }} className='h-screen slide slide_masonry slide'>
                <div className="container mx-auto px-[30px] xl:px-0 h-full overflow-y-scroll">
                    <div className="relative top-[40px]">
                        <div className="grid grid-cols-12 lg:h-[calc(100vh-40px)]">

                            <div className="col-span-12 lg:col-span-4 lg:border-r border-black py-[40px] lg:overflow-y-scroll pr-[30px]">
                                {(data?.slidable?.content && locale) &&
                                    <div className="richeditor" style={{ color: color }}>{ formatRichText(data.slidable.content[locale])}</div>
                                }
                            </div>

                            <div className="col-span-12 lg:col-span-8 lg:overflow-y-scroll py-[40px] lg:pl-[30px]">
                                <div className="columns-3 lg:columns-4">
                                    {documents?.map((document, index) => {
                                        if (document?.url && locale) {
                                            return (
                                                <div key={index} className="mb-4 break-inside-avoid cursor-pointer" onClick={() => { setIsOpenPopup(true); setDataPopup(document); }}>
                                                    {document.url.endsWith('.pdf') ? (
                                                        <PlayerPDF key={document.id} file={document?.url} className="max-h-[60vh]" />
                                                    ) : (
                                                        <img src={document.url} alt={document?.name[locale]} className="w-full" />
                                                        // TODO : Changer l'url document.optimized_url.url (Mettre la taille du thumbnail)
                                                    )}                                                  
                                                </div>
                                            );
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