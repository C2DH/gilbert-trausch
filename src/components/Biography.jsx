import { useEffect, useState } from "react";
import { getYear, formatRichText } from "../lib/utils";
import bg from '../assets/images/backgrounds/biography.webp'
import { Link, Element } from 'react-scroll';
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import { AnimatePresence, motion } from "motion/react";
import { easeInOut } from "motion";
import PopupResource from "./content/PopupResource";
import { useTranslation } from "react-i18next";
import { useSharedState } from "../contexts/ShareStateProvider";

export default function Biography() {

    const API_URL = import.meta.env.VITE_API_URL;
    const { i18n } = useTranslation();
    const locale = i18n.language;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [years, setYears] = useState([]);
    const [activeYear, setActiveYear] = useState(null);
    const [activeElement, setActiveElement] = useState(null); // Nouvel état pour l'élément actif
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [dataPopup, setDataPopup] = useState();
    const [sharedState, setSharedState] = useSharedState();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});

    useEffect(() => {
        fetch(`${API_URL}/api/biography`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setData(data.data);
                setIsLoading(true);
            })
            .catch((error) => console.error("Erreur de chargement :", error));
    }, [locale]);

    useEffect(() => {
       setSharedState({ ...sharedState, showCurtains: false }) 
    }, [])

    useEffect(() => {
        if (data.length > 0) {
            data.forEach(item => {
                setYears(prev => {
                    const year = getYear(item.date[locale]);
                    return prev.includes(year) ? prev : [...prev, year];
                });
            });
        }    
    }, [data, locale])
    

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveElement(entry.target.id);
                        
                        const visibleYear = getYear(entry.target.id);
                        if (activeYear !== visibleYear) {
                            setActiveYear(null); // Réinitialiser activeYear
                        }
                    }
                });
            },
            {
                rootMargin: "0px",
                threshold: 1, // 60% de visibilité
            }
        );

        const elements = document.querySelectorAll('.timeline-event');
        elements.forEach((element) => {
            observer.observe(element);
        });

        return () => {
            elements.forEach((element) => {
                observer.unobserve(element);
            });
        };
    }, [data]);



    return (
        <>
            {isLoading &&            
                <motion.div 
                    className="" style={{ background: `url(${bg}) center / contain repeat`}}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ easeInOut, duration: 1.2 }}
                >
                    <div className="biography container mx-auto pt-[80px] xl:pt-[100px] px-[20px] xl:px-0">
                        <div className="grid grid-cols-12 mb-[50px] xl:mb-[100px] 2xl:mb-[150px]">
                            <div className="col-span-12 md:col-span-10 lg:col-span-8 2xl:col-span-6 text-[#4100FC]">
                                <h1 className="text-[40px] leading-none md:text-[60px] md:leading-[95px] text-center md:text-left mb-[30px] md:mb-[40px]">Biographie</h1>
                                <p>L’historien Gilbert Trausch (1931-2018) est encore largement connu du public luxembourgeois. Pendant des décennies, ses incontournables interventions dans les médias ont contribué à faire découvrir l’histoire du Luxembourg à toute une génération.</p>
                                <p>Ce n’est pourtant là qu’une des nombreuses facettes d’un historien prolifique de la seconde moitié du XXe siècle qui, en plus d’avoir renouvelé le paysage historiographique luxembourgeois, bénéficiait aussi d’une renommée solide en dehors des frontières du Grand-Duché.</p>
                                <p>Formateur de toute une génération d’historiens, tour à tour directeur de la Bibliothèque nationale, du Centre Universitaire de Luxembourg (CUL – ancêtre de l’Université du Luxembourg) et du Centre d'études et de recherches européennes Robert Schuman (CERE), fréquentant les cercles ministériels et diplomatiques, Gilbert Trausch était une personnalité omniprésente de la société luxembourgeoise.</p>
                            </div>
                        </div>

                        <div className="xl:grid grid-cols-12">

                            {/** YEARS */}
                            {/** Desktop */}
                            <div className="hidden xl:block col-span-2">
                                <div className="timeline_blocks sticky top-40">
                                    <div className="flex flex-col">
                                        {years?.map((year, index) => 
                                            <Link
                                                onClick={() => setActiveYear(year)}
                                                isDynamic={true}
                                                key={index}
                                                to={`event-${year}`}
                                                spy={true}
                                                offset={-100} 
                                                smooth={true} 
                                                duration={500}
                                                className={classNames("w-[100px] 2xl:w-[135px] block text-[15px] 2xl:text-[18px] px-[8px] 2xl:px-[17px] py-[3px] text-white mb-[6px] cursor-pointer border-blue transition-all  duration-300 ease-in-out", {
                                                    "bg-white text-blue border" : activeYear === year || activeElement === `event-${getYear(year)}`,
                                                    "bg-blue border" : year && activeYear !== year && activeElement !== `event-${getYear(year)}`
                                                })}
                                            >
                                                <span className="block text-center">{year}</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/** Mobile */}
                            <div className="xl:hidden sticky top-0 z-[100] mb-[40px] bg-blue rounded-b-[5px]">
                                <div className="timeline_blocks">
                                    <div className="flex">
                                        {years?.map((year, index) => 
                                            <Link
                                                onClick={() => setActiveYear(year)}
                                                isDynamic={true}
                                                key={index}
                                                to={`event-${year}`}
                                                spy={true}
                                                offset={-100} 
                                                smooth={true} 
                                                duration={500}
                                                className={classNames("block text-[14px] 2xl:text-[18px] px-[10px] 2xl:px-[17px] py-[2px] xl:py-[3px] text-white cursor-pointer transition-all duration-300 ease-in-out", {
                                                    "bg-white text-blue first:rounded-bl-[5px]" : activeYear === year || activeElement === `event-${getYear(year)}`,
                                                    "bg-blue" : activeYear !== year && activeElement !== `event-${getYear(year)}`
                                                })}
                                            >
                                                <span className="block text-center">{year}</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/** EVENTS */}
                            <div className="events col-span-12 lg:col-span-10 relative before:absolute before:left-[-82px] before:top-0 before:w-[2px] before:xl:h-full before:bg-[#4100FC]">
                                { data?.map(item => 
                                    <Element
                                        name={`event-${getYear(item.date[locale])}`}
                                        key={item.id}
                                        id={`event-${getYear(item.date[locale])}`}
                                        data-year={getYear(item.date[locale])}
                                        className="timeline-event pb-[50px] xl:pb-[100px] 2xl:pb-[200px] relative">

                                        <div className="hidden xl:block absolute -left-[99px] w-[36px] h-[36px] bg-blue rounded-full">
                                            <div className={classNames("w-[10px] h-[10px] rounded-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]", {
                                                "bg-white": activeElement === `event-${getYear(item.date[locale])}`
                                            })}></div>
                                        </div>

                                        {(item?.date && locale) &&
                                            <span className="special-elite-regular text-[#4100FC] text-[20px] lg:text-[26px]">{item.date[locale]}</span>
                                        }

                                        <hr className="w-[40px] my-[10px] lg:my-[20px] h-[1px] border-blue border-t"/>

                                        <div className="grid grid-cols-12 lg:grid-cols-10 pb-[30px] lg:pb-[50px]">
                                            <div className="col-span-12 lg:col-span-8">
                                                {(item?.title && locale) &&                                        
                                                    <h3 className="uppercase text-[18px] leading-[24px] lg:text-[22px] lg:leading-[32px] font-semibold mb-[20px]">{item.title[locale]}</h3>
                                                }
                                                {(item?.content && locale) &&
                                                    <div className="richeditor">{formatRichText(item.content[locale])}</div>
                                                }
                                            </div>
                                        </div>

                                        <div className="md:flex md:flex-wrap gap-3">
                                            {item?.documents?.map(document => 
                                                <div 
                                                    key={document.id} 
                                                    className="py-[10px] md:py-0 cursor-pointer"
                                                    onClick={() => { setIsOpenPopup(true); setDataPopup(document) }}
                                                >
                                                    <img className="w-full max-h-[350px] md:max-h-auto object-contain md:h-[220px]" src={ document?.optimized_url.thumbnail.url } alt={document?.name[locale]}/>
                                                </div>
                                            )}
                                        </div>
                                    </Element>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            }


            {/** POPUP */}
            <AnimatePresence>           
                {isOpenPopup &&
                    <motion.div 
                        className="w-full h-full fixed inset-0 z-[103] flex items-center justify-center bg-black/50"
                        key="popupResourceBiography"
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