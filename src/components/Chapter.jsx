import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {AnimatePresence, motion } from "framer-motion";
import Navbar from '../components/content/Navbar';
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
import wallpaper_menu from '../assets/images/menu/menu-wallpaper-ch1.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, EffectFade } from 'swiper/modules';
import 'swiper/css';
import classNames from "classnames";
import { PopupProvider } from "../contexts/PopupContext";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";


export default function Chapter() {

    const API_URL = import.meta.env.VITE_API_URL;
    const { i18n, t } = useTranslation();
    const locale = i18n.language;
    const { id } = useParams();
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const swiperRef = useRef();
    const [activeIndex, setActiveIndex] = useState(1);
    const [total, setTotal] = useState(null);
    const [colorElement, setColorElement] = useState("");
    const [colorNavbar, setColorNavbar] = useState("");
    const [slideHeaders, setSlideHeaders] = useState([]);
    const [title, setTitle] = useState("");
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [firstClick, setFirstClick] = useState(true);
    const [showSubtitle, setShowSubtitle] = useState(false);
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    useEffect(() => {
        fetch(`${API_URL}/api/chapter/${id}`)
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
                setSlideHeaders(data?.data?.slides?.filter(slide => slide.slidable.type === "SlideHeader") || []);
                setIsLoading(true);
            })
            .catch((error) => console.error("Erreur lors du chargement du chapitre :", error));
    }, [id]);


    // Couleur Navbar et éléments swiper
    useEffect(() => {
        if (data?.slides) {
            setColorElement(data.slides[activeIndex - 1].slidable.color_menu === "#ffffff" ? data.slides[activeIndex - 1].slidable.color_menu : '#4100FC');
            setColorNavbar(data.slides[activeIndex - 1].slidable.color_menu)
        }
    }, [activeIndex, data]);


    // Calcul circonférence et progression
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (activeIndex / total) * circumference;

    // Click Next
    const handleNextClick = () => {
        if (activeIndex === 1 && firstClick) {
            setShowSubtitle(true)
            setFirstClick(false)
        } else {
            swiperRef.current?.slideNext()
        }
    }

    const handlePrevClick = () => {
        if (activeIndex === 1 && !firstClick) {
            setShowSubtitle(false)
            setFirstClick(true)
        } else {
            swiperRef.current?.slidePrev()
        }
    }

    return (

        <div className="relative w-full h-screen">

            <Navbar color={colorNavbar} />
            
            <PopupProvider>
                <Swiper
                    modules={[Mousewheel]}
                    ref={swiperRef}
                    direction="vertical"
                    slidesPerView={1}
                    speed={800}
                    className="h-full"
                    mousewheel={ false }
                    simulateTouch={ isMobile ? false : true }
                    grabCursor={ isMobile ? false : true }
                    touchMoveStopPropagation={true}
                    effect="fade"
                    // mousewheel={{ forceToAxis: true }}
                    // mousewheel={{ forceToAxis: true, nested: true }} 
                    // fadeEffect={{ crossFade: true }}
                    onSwiper={(swiper) => { swiperRef.current = swiper }}
                    onActiveIndexChange={swiper => setActiveIndex(swiper.activeIndex + 1)}
                >

                    {isLoading && data?.slides?.map((slide) =>
                        <SwiperSlide key={slide.id}>
                            { slide.slidable.type === "SlideHeader" && <SlideHeader data={ slide } showSubtitle={ showSubtitle } index={ activeIndex } locale={locale}/> }
                            { slide.slidable.type === "SlideMediaFull" && <SlideMediaFull data={ slide } locale={locale} /> }
                            { slide.slidable.type === "SlideCitation" && <SlideCitation data={ slide } locale={locale}/> }
                            { slide.slidable.type === "SlideCentralText" && <SlideCentralText data={ slide } locale={locale} /> }
                            { slide.slidable.type === "SlideColumn" && <SlideColumn data={ slide } locale={locale} /> }
                            { slide.slidable.type === "SlideSlider" && <SlideSlider data={ slide } locale={locale}/> }
                            { slide.slidable.type === "SlideMasonry" && <SlideMasonry data={ slide } locale={locale}/> }
                            { slide.slidable.type === "SlideImageText" && <SlideImageText data={ slide } locale={locale}/> }
                            { slide.slidable.type === "SlideStep" && <SlideStep data={ slide } locale={locale}/> }
                            { slide.slidable.type === "SlideAudio" && <SlideAudio data={ slide } locale={locale}/> }
                        </SwiperSlide>
                    )}
                </Swiper>
            </PopupProvider>    

            {/** BUTTON MENU SECTION */}
            <div className='hidden xl:block absolute right-[20px] top-[80px] z-[100] cursor-pointer' onClick={() => setIsOpenMenu(true)}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="25" fill={colorElement}/>
                    <path d="M17.125 19.0625C17.125 18.7812 17.3711 18.5 17.6875 18.5H32.3125C32.5938 18.5 32.875 18.7812 32.875 19.0625C32.875 19.3789 32.5938 19.625 32.3125 19.625H17.6875C17.3711 19.625 17.125 19.3789 17.125 19.0625ZM17.125 24.6875C17.125 24.4062 17.3711 24.125 17.6875 24.125H27.8125C28.0938 24.125 28.375 24.4062 28.375 24.6875C28.375 25.0039 28.0938 25.25 27.8125 25.25H17.6875C17.3711 25.25 17.125 25.0039 17.125 24.6875ZM23.875 30.3125C23.875 30.6289 23.5938 30.875 23.3125 30.875H17.6875C17.3711 30.875 17.125 30.6289 17.125 30.3125C17.125 30.0312 17.3711 29.75 17.6875 29.75H23.3125C23.5938 29.75 23.875 30.0312 23.875 30.3125Z" fill={colorElement === "#ffffff" ? "#4100FC" : "#ffffff"} style={{ transition: 'all 0.5s ease-in-out'}}/>
                </svg>
            </div>    

            {/** LOADER */}
            <AnimatePresence>
                {showSubtitle &&
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
                        <span className="absolute text-[16px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500" style={{ color: colorElement }}>{activeIndex}/{total}</span>
                    </motion.div>
                }
            </AnimatePresence>

            {/** BUTTONS SWIPER */}
            <div className='hidden xl:block absolute right-[0] top-[50%] -translate-y-[50%] z-[100]'>
                <button onClick={() => handlePrevClick() }
                    className={classNames("cursor-pointer relative right-0 bottom-[5px]", { "pointer-events-none opacity-30": !showSubtitle })}
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
                        "pointer-events-none opacity-30": activeIndex >= total
                    })}
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

            {/** MENU ASIDE */}
            <AnimatePresence>
                {isOpenMenu &&            
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                        className="fixed top-0 right-0 bottom-0 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 bg-blue z-[101]"
                    >
                        {/* Bouton de fermeture */}
                        <div className="absolute top-4 right-4 z-[102] cursor-pointer bg-white rounded-full" onClick={() => setIsOpenMenu(false)}
                        >
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="25" cy="25" r="25" fill="#ffffff"/>
                                <path d="M17.125 19.0625C17.125 18.7812 17.3711 18.5 17.6875 18.5H32.3125C32.5938 18.5 32.875 18.7812 32.875 19.0625C32.875 19.3789 32.5938 19.625 32.3125 19.625H17.6875C17.3711 19.625 17.125 19.3789 17.125 19.0625ZM17.125 24.6875C17.125 24.4062 17.3711 24.125 17.6875 24.125H27.8125C28.0938 24.125 28.375 24.4062 28.375 24.6875C28.375 25.0039 28.0938 25.25 27.8125 25.25H17.6875C17.3711 25.25 17.125 25.0039 17.125 24.6875ZM23.875 30.3125C23.875 30.6289 23.5938 30.875 23.3125 30.875H17.6875C17.3711 30.875 17.125 30.6289 17.125 30.3125C17.125 30.0312 17.3711 29.75 17.6875 29.75H23.3125C23.5938 29.75 23.875 30.0312 23.875 30.3125Z" fill="#4100FC"/>
                            </svg>
                        </div>

                        {/* Contenu du menu */}
                        <div className="relative">
                            <div className="absolute top-[12px] left-[30px] flex items-center">
                                <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.14062 5.86328L6.20312 0.800781C6.41406 0.589844 6.80078 0.589844 7.01172 0.800781C7.22266 1.01172 7.22266 1.39844 7.01172 1.60938L2.89844 5.6875H18.4375C18.7188 5.6875 19 5.96875 19 6.25C19 6.56641 18.7188 6.8125 18.4375 6.8125H2.89844L7.01172 10.9258C7.22266 11.1367 7.22266 11.5234 7.01172 11.7344C6.80078 11.9453 6.41406 11.9453 6.20312 11.7344L1.14062 6.67188C0.929688 6.46094 0.929688 6.07422 1.14062 5.86328Z" fill="white"/>
                                </svg>
                                <Link to={"/professions"}>
                                    <span className="uppercase text-white text-[16px] font-normal pl-[10px] cursor-pointer">Changer de chapitre</span>
                                </Link>
                            </div>
                            <img src={ wallpaper_menu } alt="Gilbert Trausch dans son bureau" className="w-full" />
                            <span className="absolute top-1/2 left-8 transform -translate-y-1/2 text-[24px] md:text-[40px] text-white">{ title }</span>
                        </div>

                        <div className="p-[30px]">
                            { slideHeaders?.map((header) => {
                                const slideIndex = data?.slides?.findIndex(slide => slide.id === header.id)
                                return (
                                    <h3 key={header.slidable.id} className="text-white cursor-pointer hover:underline pb-[25px]" onClick={() => swiperRef?.current?.slideTo(slideIndex)}>
                                        {header?.slidable.subtitle ? header?.slidable.subtitle[locale] : ""}
                                    </h3>
                                )
                            })}
                        </div>
                    </motion.div>
                }
            </AnimatePresence>

            <div className="absolute xl:hidden bottom-0 left-0 right-0 bg-blue h-[40px] flex border-t">
                <div className="w-1/2 flex items-center justify-center border-r border-white">
                    <button onClick={() => handlePrevClick() }
                        className={classNames("cursor-pointer relative right-0", { "pointer-events-none opacity-30": !showSubtitle })}
                    >    
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="14.5" transform="rotate(-180 15 15)" stroke="white"/>
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
                            "pointer-events-none opacity-30": activeIndex >= total
                        })}
                    >
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="14.5" stroke="white"/>
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
        </div>
    )
}