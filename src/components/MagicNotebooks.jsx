import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg from '../assets/images/backgrounds/bg-magic-notebooks.webp';
import { romanize } from "../lib/utils";
import bg_empty from '../assets/images/backgrounds/bg-1.webp';
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { easeInOut } from "motion";
import logoMobile from '../assets/images/backgrounds/logo-notebook-mobile.png';


export default function MagicNotebooks() {

    const [data, setData] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const { i18n, t } = useTranslation();
    const locale = i18n.language;    const API_URL = import.meta.env.VITE_API_URL;
    const isMobile = useMediaQuery({query: '(max-width: 1023px)'});

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
                setIsLoaded(true);
            })
            .catch((error) => console.error("Erreur lors du chargement des cahiers magiques :", error));
    }, [locale]);

    return (
        <>
            <motion.div className="h-screen overflow-hidden"
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
                <div className="container mx-auto flex flex-col justify-center h-full">

                    {isMobile &&
                        <div className='w-full flex justify-center mb-[20px]'>
                            <img src={logoMobile} alt="Logo Gilbert Trausch" className='w-full md:w-[90%]'/>
                        </div>
                    }

                    <div className="grid grid-cols-12 px-[20px] xl:px-0">
                        <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 flex flex-col items-center lg:items-start">
                            <h1 className="font-extralight text-[24px] md:text-[36px] 2xl:text-[50px] uppercase tracking-[2px] text-[#4100FC] mb-[20px] text-center lg:text-left">{t('magicNotebooks')}</h1>
                            
                            <p className="text-[16px] xl:text-[22px] text-blue mb-[30px] lg:mb-[80px] text-center lg:text-left">{t('description_magicNotebooks')}</p>
                            
                            {isLoaded &&                                
                                <ul className="text-[20px] lg:text-[24px] 2xl:text-[36px] 2xl:leading-[48px] pl-0">
                                    {data?.map((item, index) => (
                                        <li key={item.id} className="group mb-[20px] lg:mb-[50px] last:mb-0 flex gap-5 font-extralight w-fit">
                                            <span className="transition-all duration-500 group-hover:text-[#4100FC]">{romanize(index)}.</span>
                                            <Link to={`/magic-notebook/${item.slug}`} className="transition-all duration-500 group-hover:text-[#4100FC] group-hover:pl-[30px]">{item.name[locale]}</Link>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    </div>
                </div>

            </motion.div>
        </>
    );
}