import { useEffect, useState } from "react";
import bgChapters from '../assets/images/backgrounds/bg-chapters.webp';
import chapter1 from '../assets/images/backgrounds/bg-chapter-1.webp';
import chapter2 from '../assets/images/backgrounds/bg-chapter-2.webp';
import chapter3 from '../assets/images/backgrounds/bg-chapter-3.webp';
import bg_empty from '../assets/images/backgrounds/bg-1.webp';
import { Link } from "react-router-dom";
import { romanize } from "../lib/utils";
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { easeInOut } from "motion";
import logoMobile from '../assets/images/backgrounds/logo-professions-mobile.png';


export default function Chapters() {
    const [data, setData] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const { i18n, t } = useTranslation();
    const locale = i18n.language;
    const API_URL = import.meta.env.VITE_API_URL;
    const isMobile = useMediaQuery({ query: '(max-width: 1023px)'});
    
    const getBackgroundImage = () => {
        switch (hoveredIndex) {
            case 0:
                return `url(${chapter1})`;
            case 1:
                return `url(${chapter2})`;
            case 2:
                return `url(${chapter3})`;
            default:
                return `url(${bgChapters})`;
        }
    };

    useEffect(() => {
        fetch(`${API_URL}/api/chapters`)
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
            .catch((error) => console.error("Erreur lors du chargement des chapitres :", error));
    }, [locale]);


    return (
        <>
            <motion.div className="h-[100dvh] overflow-hidden"
                style={{
                    backgroundImage: isMobile ? `url(${bg_empty})` : getBackgroundImage(),
                    backgroundPosition: "right",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    transition: "background-image 0.5s ease-in-out"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ easeInOut, duration: 0.5 }}   
            >
                <div className="container mx-auto flex flex-col justify-center h-full">
                   
                   {isMobile &&
                        <div className='w-full flex justify-center mb-[30px]'>
                            <img src={logoMobile} alt="Logo Gilbert Trausch" className='w-full md:w-[90%]'/>
                        </div>
                    }

                    

                    <div className="xl:h-full flex flex-col justify-center items-center lg:items-start px-[20px] xl:px-0">
                        <h1 className="font-extralight text-[24px] md:text-[36px] 2xl:text-[50px] uppercase tracking-[2px] text-[#4100FC] mb-[30px] xl:mb-[50px] text-center lg:text-left">
                        {t('professions')}
                        </h1>
                       
                        { isLoaded &&                        
                            <ul className="text-[22px] lg:text-[24px] 2xl:text-[36px] 2xl:leading-[40px] pl-0 list-inside">
                                {data?.map((item, index) => (
                                    <li
                                        key={item.id}
                                        className="group mb-[20px] lg:mb-[50px] last:mb-0  hover:text-[#4100FC] transition-all duration-350 font-extralight w-fit flex gap-5"
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <span className="transition-all duration-500 group-hover:text-[#4100FC]">{romanize(index)}.</span>
                                        <Link to={`/chapter/${item.slug}`} className="transition-all duration-500 group-hover:text-[#4100FC] group-hover:lg:pl-[30px]">{item.name[locale]}</Link>
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                </div>
            </motion.div>
        </>
    );
}
 