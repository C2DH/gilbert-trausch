import { useEffect, useState } from "react";
import { formatRichText } from "../lib/utils";
import bg from '../assets/images/backgrounds/bg_360.webp';
import { useTranslation } from "react-i18next";
import { useSharedState } from "../contexts/ShareStateProvider";
import { motion } from "motion/react";
import { easeInOut } from "motion";

export default function VirtualTour() {

    const API_URL = import.meta.env.VITE_API_URL;
    const { i18n, t } = useTranslation();
    const locale = i18n.language;
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({});
    const [sharedState, setSharedState] = useSharedState();
    
    useEffect(() => {
        fetch(`${API_URL}/api/virtual-tour`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setData(data.data);
                setIsLoading(true)
                console.log(data.data)
            })
            .catch((error) => console.error("Erreur lors du chargement des données de la page du tour virtuel :", error));
    }, [locale]);

    useEffect(() => {
        setSharedState({ ...sharedState, showCurtains: false }) 
     }, [])



    return (
        <motion.div 
            style={{ background: `url(${bg}) center / cover no-repeat`}} 
            className="h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ easeInOut, duration: 1.2 }}
        >

            {isLoading &&
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0 h-[calc(100vh-40px)]">

                        {/** SECTION 1 */}
                        <div className="grid grid-cols-12 h-full">
                            <div className="col-span-12 xl:col-span-8 xl:col-start-3 md:flex flex-col justify-center">
                                <h2 className="text-[22px] lg:text-[26px] pb-[40px] xl:pb-[80px] pt-[40px] md:pt-0">{ data.title[locale]}</h2>
                                <div className="richeditor">
                                    { formatRichText(data.content[locale]) }
                                </div>
                                <div className="flex justify-center pt-[40px] lg:pt-[80px]">
                                    <button 
                                        className="uppercase text-blue text-[14px] px-[10px] lg:px-[25px] py-[7px] border border-blue w-fit rounded-[7px] hover:bg-blue hover:text-white outline-none duration-500"
                                        aria-label="Virtual tour button"    
                                    >
                                    {t('link_virtual_tour')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </motion.div>    
    )
}