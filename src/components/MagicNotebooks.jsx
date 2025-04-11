import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg from '../assets/images/backgrounds/bg-magic-notebooks.webp';
import { romanize } from "../lib/utils";
import bg_empty from '../assets/images/backgrounds/bg-1.webp';
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";
import { useSharedState } from "../contexts/ShareStateProvider";
import { motion } from "motion/react";
import { easeInOut } from "motion";

export default function MagicNotebooks() {

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const { i18n, t } = useTranslation();
    const locale = i18n.language;    const API_URL = import.meta.env.VITE_API_URL;
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});
    const [sharedState, setSharedState] = useSharedState();
    

    useEffect(() => {
        fetch(`${API_URL}/api/magic-notebooks`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setIsLoading(true);
            })
            .catch((error) => console.error("Erreur lors du chargement des cahiers magiques :", error));
    }, [locale]);

    useEffect(() => {
        setSharedState({ ...sharedState, showCurtains: false }) 
     }, [])

    return (
        <>
            {/* <Navbar color={'#000000'} /> */}

            <motion.div className="h-screen"
                style={{
                    backgroundImage: isMobile ? `url(${bg_empty})` : `url(${bg})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ easeInOut, duration: 1.2 }}
            >
                <div className="container mx-auto h-full px-[20px] xl:px-0">
                    <div className="relative top-[40px]">
                        <div className="grid grid-cols-12 pt-[20px] lg:pt-[40px]">
                            <div className="col-span-12 lg:col-span-6">
                                <h1 className="text-[30px] leading-[35px] lg:text-[40px] 2xl:text-[60px] 2xl:leading-[66px] text-[#4100FC] mb-[30px]">{t('magicNotebooks')}</h1>
                                
                                <p className="text-[16px] xl:text-[22px] text-blue mb-[40px] lg:mb-[120px]">{t('description_magicNotebooks')}</p>
                                
                                {isLoading &&                                
                                    <ul className="text-[20px] lg:text-[30px] 2xl:text-[40px] 2xl:leading-[48px] pl-0">
                                        {data?.map((item, index) => (
                                            <li key={item.id} className="group mb-[20px] lg:mb-[50px] last:mb-0 flex gap-5 font-extralight ">
                                                <span className="transition-all duration-500 group-hover:text-[#4100FC]">{romanize(index)}.</span>
                                                <Link to={`/magic-notebook/${item.id}`} className="transition-all duration-500 group-hover:text-[#4100FC] group-hover:pl-[30px]">{item.name[locale]}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}