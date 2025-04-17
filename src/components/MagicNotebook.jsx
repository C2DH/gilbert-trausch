import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {AnimatePresence, motion } from "framer-motion";
import SlideHeader from "./content/SlideHeader";
import SlideCitation from "./content/SlideCitation";
import SlideMediaFull from "./content/SlideMediaFull";
import SlideCentralText from "./content/SlideCentralText";
import SlideColumn from "./content/SlideColumn";
import SlideSlider from "./content/SlideSlider";
import SlideMasonry from "./content/SlideMasonry";
import SlideImageText from "./content/SlideImageText";
import SlideStep from "./content/SlideStep";
import SlideAudio from "./content/SlideAudio";
import { useMediaQuery } from "react-responsive";
import wallpaper_menu from '../assets/images/menu/menu-wallpaper-ch1.png';
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { NavbarContext } from "../contexts/NavbarProvider";

// Variants pour les animations
const variants = {
    initial: (direction) => {
        return {
            y: direction > 0 ? '100%' : '-100%',
            opacity: 0
        };
    },
    animate: {
        zIndex: 1,
        y: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            y: direction < 0 ? '100%' : '-100%',
            opacity: 0
        };
    }
};


export default function MagicNotebook() {
    
    const API_URL = import.meta.env.VITE_API_URL;
    const [searchParams] = useSearchParams();
    const { i18n, t } = useTranslation();
    const locale = i18n.language;    
    const { slug, id } = useParams();
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [total, setTotal] = useState(null);
    const [colorElement, setColorElement] = useState("");
    const [slideHeaders, setSlideHeaders] = useState([]);
    const [title, setTitle] = useState("");
    const isLarge = useMediaQuery({query: '(min-width: 1279px)'});
    const {setColorNavbar} = useContext(NavbarContext);
    const [slideGroups, setSlideGroups] = useState([]);
    const [currentInGroupIndex, setCurrentInGroupIndex] = useState(1);
    const [currentGroupTotal, setCurrentGroupTotal] = useState(1);
    const [direction, setDirection] = useState(0)
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        setActiveIndex(parseInt(searchParams.get('index') ?? 0));
    }, [searchParams]);

    useEffect(() => {
        fetch(`${API_URL}/api/magic-notebook/${slug}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setTitle(data.data.name);
                setData(data.data);
                setTotal(data.data.slides.length)
                setSlideHeaders(data?.data?.slides?.map((slide, index) => ({ slide, index }))?.filter(({ slide }) => slide.slidable.type === "SlideHeader"));
                setIsLoading(true);
            })
            .catch((error) => console.error("Erreur lors du chargement du chapitre :", error));
    }, [id, locale]);

    useEffect(() => {
        if (data?.slides?.length > 0) {
            const groups = [];
            let currentGroup = [];
        
            data.slides.forEach((slide) => {
                if (slide.slidable.type === "SlideHeader") {
                    
                    if (currentGroup.length > 0) {
                        groups.push(currentGroup);
                    }
                    
                    currentGroup = [];
                }

                if (slide.slidable.type !== "SlideHeader") {
                    currentGroup.push(slide);
                }
            });
        
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            } 

            setSlideGroups(groups);
        }
    }, [data]);

    useEffect(() => {
        if (!data?.slides || slideGroups.length === 0) return;

        const realIndex = activeIndex - 1; // car activeIndex commence à 1
        let slideCounter = 0;

        for (const group of slideGroups) {
            const groupLength = group.length;
            
            if (realIndex >= slideCounter && realIndex < slideCounter + groupLength) {
                const indexInGroup = realIndex - slideCounter + 1;
                setCurrentInGroupIndex(indexInGroup);
                setCurrentGroupTotal(groupLength);
                break;
            }
            slideCounter += groupLength + 1;
        }
    }, [activeIndex, slideGroups]);

    // Couleur Navbar et éléments swiper
    useEffect(() => {
        if (data?.slides) {
            setColorElement(data.slides[activeIndex].slidable.color_menu === "#ffffff" ? data.slides[activeIndex].slidable.color_menu : '#4100FC');
            setColorNavbar(data.slides[activeIndex].slidable.color_menu)
        }
    }, [activeIndex, data]);


    // Calcul circonférence et progression
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (currentInGroupIndex / currentGroupTotal) * circumference;

    // Click Next
    const handleNextClick = () => {
        setDirection(1);
        navigate(location.pathname + '?index=' + Math.min(data.slides.length - 1, activeIndex + 1)); 
    }

    const handlePrevClick = () => {
        setDirection(-1);
        navigate(location.pathname + '?index=' + Math.max(0, activeIndex - 1));
    }

    return (
        <div className="relative w-full h-screen">
            {isLoading &&
                <>
                    {/** SLIDES */}
                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        {data?.slides?.map((slide, index) => {
                            return (
                                index === activeIndex && (
                                    <motion.div key={`${slide.id}-${activeIndex}`}
                                        custom={direction}
                                        variants={variants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{
                                            y: { type: "easeInOut", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.5 }
                                        }}
                                    >
                                        <>
                                            {slide.slidable.type === "SlideHeader" && <SlideHeader data={slide} showSubtitle={false} index={activeIndex} locale={locale} />}
                                            {slide.slidable.type === "SlideMediaFull" && <SlideMediaFull data={slide} locale={locale} />}
                                            {slide.slidable.type === "SlideCitation" && <SlideCitation data={slide} locale={locale} />}
                                            {slide.slidable.type === "SlideCentralText" && <SlideCentralText data={slide} locale={locale} />}
                                            {slide.slidable.type === "SlideColumn" && <SlideColumn data={slide} locale={locale} />}
                                            {slide.slidable.type === "SlideSlider" && <SlideSlider data={slide} locale={locale} />}
                                            {slide.slidable.type === "SlideMasonry" && <SlideMasonry data={slide} locale={locale} />}
                                            {slide.slidable.type === "SlideImageText" && <SlideImageText data={slide} locale={locale} />}
                                            {slide.slidable.type === "SlideStep" && <SlideStep data={slide} locale={locale} />}
                                            {slide.slidable.type === "SlideAudio" && <SlideAudio data={slide} locale={locale} />}
                                        </>
                                    </motion.div>
                                )
                            );
                        })}
                    </AnimatePresence>
                    
                    {/** BUTTON RETURN NOTEBOOKS */}
                    <div
                        className={classNames('fixed xl:absolute right-[20px] z-[100] cursor-pointer transition-all duration-500', {
                            'top-[80px]': isLarge,
                            'top-[4px]': !isLarge
                        })}
                        onClick={() => navigate('/magic-notebooks')}
                    >
                        <svg
                            width={isLarge ? "50" : "30"}
                            height={isLarge ? "50" : "30"}
                            viewBox="0 0 50 50" // ✅ Toujours 50x50 pour centrer le path correctement
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="25"
                                cy="25"
                                r="25"
                                fill={colorElement}
                            />
                            <path
                                d="M21.2031 30.7344L16.1406 25.6719C16.0352 25.5664 16 25.4258 16 25.25C16 25.1094 16.0352 24.9688 16.1406 24.8633L21.2031 19.8008C21.4141 19.5898 21.8008 19.5898 22.0117 19.8008C22.2227 20.0117 22.2227 20.3984 22.0117 20.6094L17.8984 24.6875H33.4375C33.7188 24.6875 34 24.9688 34 25.25C34 25.5664 33.7188 25.8125 33.4375 25.8125H17.8984L22.0117 29.9258C22.2227 30.1367 22.2227 30.5234 22.0117 30.7344C21.8008 30.9453 21.4141 30.9453 21.2031 30.7344Z"
                                fill={colorElement === "#ffffff" ? "#4100fc" : "#ffffff"}
                                style={{ transition: 'all 0.5s ease-in-out' }}
                            />
                        </svg>
                    </div>

                    {/** LOADER */}
                    <AnimatePresence>
                        {data.slides[activeIndex].slidable.type !== "SlideHeader" &&
                            <motion.div 
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ duration: 0.4 }}
                                className='hidden xl:block absolute right-[20px] top-[150px] z-[100]'
                            >
                                <svg width="50" height="50" viewBox="0 0 80 80" className="rotate-90">
                                    <circle cx="40" cy="40" r="35" stroke={colorElement} strokeWidth="2" fill="none" />
                                    <circle cx="40" cy="40" r="30" stroke={colorElement} strokeWidth="5" fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        style={{
                                            transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease'
                                        }}
                                    />
                                </svg>
                                <span className="absolute text-[16px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500" style={{ color: colorElement }}>{currentInGroupIndex}/{currentGroupTotal}</span>
                            </motion.div>
                        }
                    </AnimatePresence>
        
                    {/** BUTTONS SWIPER DESKTOP */}
                    <div className='hidden xl:block absolute right-[0] top-[50%] -translate-y-[50%] z-[100]'>
                        <button onClick={() => handlePrevClick() }
                            className={classNames("cursor-pointer relative right-0 bottom-[5px]", { "pointer-events-none opacity-30": activeIndex === 0})}
                            aria-label="Previous button"
                        >    
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15" cy="15" r="14.5" transform="rotate(-180 15 15)" stroke={colorElement}/>
                                <mask id="mask0_93_485" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30">
                                <circle cx="15" cy="15" r="15" transform="rotate(-180 15 15)" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_93_485)">
                                <path d="M20.8906 17.2734C20.8086 17.3828 20.6992 17.4375 20.5625 17.4375C20.4805 17.4375 20.3711 17.4102 20.2891 17.3281L14.9023 12.3789L9.48828 17.3281C9.32422 17.4922 9.05078 17.4922 8.88672 17.3008C8.72266 17.1367 8.72266 16.8633 8.91406 16.6992L14.6016 11.4492C14.7656 11.2852 15.0117 11.2852 15.1758 11.4492L20.8633 16.6992C21.0547 16.8359 21.0547 17.1094 20.8906 17.2734Z" fill={colorElement}/>
                                </g>
                            </svg>
                        </button>

                        <div className="h-[1px] relative left-0 right-0 w-[80px]" style={{ backgroundColor: colorElement}}></div>

                        <button onClick={() => handleNextClick() } 
                            className={classNames("cursor-pointer relative right-0 top-[10px]", {
                                "pointer-events-none opacity-30": activeIndex >= total - 1
                            })}
                            aria-label="Next button"
                        >
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15" cy="15" r="14.5" stroke={colorElement}/>
                                <mask id="mask0_93_483" style={{ maskType:"alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30">
                                <circle cx="15" cy="15" r="15" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_93_483)">
                                <path d="M9.10938 12.7266C9.19141 12.6172 9.30078 12.5625 9.4375 12.5625C9.51953 12.5625 9.62891 12.5898 9.71094 12.6719L15.0977 17.6211L20.5117 12.6719C20.6758 12.5078 20.9492 12.5078 21.1133 12.6992C21.2773 12.8633 21.2773 13.1367 21.0859 13.3008L15.3984 18.5508C15.2344 18.7148 14.9883 18.7148 14.8242 18.5508L9.13672 13.3008C8.94531 13.1641 8.94531 12.8906 9.10938 12.7266Z" fill={colorElement}/>
                                </g>
                            </svg>
                        </button>
                    </div>

                    {/** BUTTONS SWIPER MOBILE */}
                    <div className="absolute xl:hidden bottom-0 left-0 right-0 bg-blue h-[40px] flex border-t z-[100]">
                        <div className="w-1/2 flex items-center justify-center border-r border-white">
                            <button onClick={() => handlePrevClick() }
                                className={classNames("cursor-pointer relative right-0", { "pointer-events-none opacity-30": activeIndex >= data.slides.length })}
                            >    
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* <circle cx="15" cy="15" r="14.5" transform="rotate(-180 15 15)" stroke="white"/> */}
                                    <mask id="mask0_93_485" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30">
                                    <circle cx="15" cy="15" r="15" transform="rotate(-180 15 15)" fill="#D9D9D9"/>
                                    </mask>
                                    <g mask="url(#mask0_93_485)">
                                    <path d="M20.8906 17.2734C20.8086 17.3828 20.6992 17.4375 20.5625 17.4375C20.4805 17.4375 20.3711 17.4102 20.2891 17.3281L14.9023 12.3789L9.48828 17.3281C9.32422 17.4922 9.05078 17.4922 8.88672 17.3008C8.72266 17.1367 8.72266 16.8633 8.91406 16.6992L14.6016 11.4492C14.7656 11.2852 15.0117 11.2852 15.1758 11.4492L20.8633 16.6992C21.0547 16.8359 21.0547 17.1094 20.8906 17.2734Z" fill="white"/>
                                    </g>
                                </svg>
                            </button>
                        </div>

                        <div className="w-1/2 flex items-center justify-center">
                            <button onClick={() => handleNextClick() } 
                                className={classNames("cursor-pointer relative right-0", {
                                    "pointer-events-none opacity-30": activeIndex >= total - 1
                                })}
                            >
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* <circle cx="15" cy="15" r="14.5" stroke="white"/> */}
                                    <mask id="mask0_93_483" style={{ maskType:"alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30">
                                    <circle cx="15" cy="15" r="15" fill="#D9D9D9"/>
                                    </mask>
                                    <g mask="url(#mask0_93_483)">
                                    <path d="M9.10938 12.7266C9.19141 12.6172 9.30078 12.5625 9.4375 12.5625C9.51953 12.5625 9.62891 12.5898 9.71094 12.6719L15.0977 17.6211L20.5117 12.6719C20.6758 12.5078 20.9492 12.5078 21.1133 12.6992C21.2773 12.8633 21.2773 13.1367 21.0859 13.3008L15.3984 18.5508C15.2344 18.7148 14.9883 18.7148 14.8242 18.5508L9.13672 13.3008C8.94531 13.1641 8.94531 12.8906 9.10938 12.7266Z" fill="white"/>
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}