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
import { useSharedState } from "../contexts/ShareStateProvider";
import { motion } from "motion/react";
import { easeInOut } from "motion";


export default function Chapters() {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const { i18n, t } = useTranslation();
    const locale = i18n.language;
    const API_URL = import.meta.env.VITE_API_URL;
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});
    const [sharedState, setSharedState] = useSharedState();
    


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
                setIsLoading(true);
            })
            .catch((error) => console.error("Erreur lors du chargement des chapitres :", error));
    }, [locale]);

    useEffect(() => {
        setSharedState({ ...sharedState, showCurtains: false }) 
     }, [])

    return (
        <>
            {/* <Navbar color={'#000000'} /> */}

            <motion.div className="relative h-screen overflow-hidden"
                style={{
                    backgroundImage: isMobile ? `url(${bg_empty})` : getBackgroundImage(),
                    backgroundPosition: "right",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    transition: "background-image 2s ease-in-out"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ easeInOut, duration: 1.2 }}   
            >
                <div className="container mx-auto h-full px-[20px] xl:px-0">
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-[30px] leading-[35px] lg:text-[40px] 2xl:text-[60px] 2xl:leading-[66px] text-[#4100FC] mb-[50px] uppercase">{t('professions')}</h1>
                        
                        { isLoading &&                        
                            <ul className="text-[20px] lg:text-[30px] 2xl:text-[40px] 2xl:leading-[48px] pl-0 list-inside">
                                {data?.map((item, index) => (
                                    <li
                                        key={item.id}
                                        className="group mb-[50px] last:mb-0 hover:text-[#4100FC] transition-all duration-350 flex gap-2 font-extralight w-fit"
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <span className="transition-all duration-500 group-hover:text-[#4100FC]">{romanize(index)}.</span>
                                        <Link to={`/chapter/${item.id}`} className="transition-all duration-500 group-hover:text-[#4100FC] group-hover:pl-[30px]">{item.name[locale]}</Link>
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
 