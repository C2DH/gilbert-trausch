import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { easeInOut } from "motion";
import intro_1 from '../assets/images/intro/wallpaper_intro_1.webp';
import intro_2 from '../assets/images/intro/wallpaper_intro_2.jpg';
import intro_3 from '../assets/images/intro/wallpaper_intro_3.jpg';
import intro_4 from '../assets/images/intro/wallpaper_intro_4.jpg';
import intro_5 from '../assets/images/intro/wallpaper_intro_5.jpg';
import intro_6 from '../assets/images/intro/wallpaper_intro_6.jpg';
import intro_7 from '../assets/images/intro/wallpaper_intro_7.jpg';
import intro_8 from '../assets/images/intro/wallpaper_intro_8.jpg';
import intro_9 from '../assets/images/intro/wallpaper_intro_9.jpg';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import bgSmall from '../assets/images/backgrounds/bg-1.webp';
import logoMobile from "../assets/images/backgrounds/logo-home.png";
import { useTranslation } from 'react-i18next';
import Player from './content/PlayerVideo';
import audio from "../assets/audio/short-audio.mp3";
import { NavbarHomeContext } from '../contexts/NavbarHomeProvider';


const images = [intro_2, intro_3, intro_4, intro_5, intro_6, intro_7, intro_8, intro_9];
const EXPIRE = 6 * 3600 * 1000;

export default function Home() {

    const { t } = useTranslation();
    const [visibleImages, setVisibleImages] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [showStartButton, setShowStartButton] = useState(true);
    const [animationActive, setAnimationActive] = useState(false);
    const isMobile = useMediaQuery({query: '(max-width: 1023px)'});
    const navigate = useNavigate();
    const [startAudio, setStartAudio] = useState(false);
    const {firstTime, setFirstTime} = useContext(NavbarHomeContext)
    

    const handleMenuClick = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 1000);
    }


    // useEffect(() => {
    //     const storedHome = localStorage.getItem('home');
    //     const now = new Date().getTime();

    //     if (!storedHome || Number(storedHome) < now) {
    //         setShowStartButton(true); // Première visite -> bouton start affiché
    //     } else {
    //         setVisibleImages(images); // Seconde visite -> toutes les images visibles instantanément
    //         setShowMenu(true);
    //     }
    // }, []);

    const handleStart = () => {
        setShowStartButton(false);
        setAnimationActive(true);
        setStartAudio(true);
        localStorage.setItem('home', new Date().getTime() + EXPIRE);
    };

    useEffect(() => {
        if (!animationActive) return;
    
        if (isMobile) {
            setShowMenu(true);
        } else {
            setTimeout(() => {
                images.forEach((img, index) => {
                    setTimeout(() => {
                        setVisibleImages((prev) => [...prev, img]);
    
                        if (index === images.length - 1) {
                            setTimeout(() => {
                                setShowMenu(true)
                                setFirstTime(false)
                            }, 1000)
                              
                        }
                    }, index * 3000);
                });
            }, 2000); // Délai avant le début des images"
        }
    }, [animationActive, isMobile]);

    return (
        <motion.div 
            className="relative h-[100dvh] sm:h-screen w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ easeInOut, duration: 1.2 }}
            style={{ background: `url(${isMobile ? bgSmall : intro_1}) center / cover no-repeat` }}
        >

            {/* Images animées après le clic */}
            {!isMobile && visibleImages.map((img, index) => (
                <motion.div
                    key={index}
                    className="h-screen absolute inset-0"
                    style={{ background: `url(${img}) center / cover no-repeat` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: animationActive ? 3 : 0, ease: "easeOut" }}
                />
            ))}

            {/* Bouton */}
            <AnimatePresence>
                {(!isMobile && showStartButton) && (
                    <motion.button
                        className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] px-[25px] py-[7px] rounded-[7px] border border-[#4100FC] text-[14px] uppercase font-medium text-[#4100FC] cursor-pointer hover:text-white hover:bg-[#4100FC] duration-500"
                        onClick={handleStart}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} // Animation de sortie
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        { t('start') }
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(!isMobile && showMenu) && (
                    <motion.div
                        className="absolute bottom-[30px] 2xl:bottom-[50px] left-0 right-0 flex justify-between"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                    >

                        <div className="menu w-full lg:container mx-auto">
                            <ul className="font-normal text-[17px] 2xl:text-[20px] uppercase flex flex-col lg:flex-row justify-between items-center text-center">
                                <hr className='lg:hidden w-3/4 border-black'/>
                                <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/biography')}
                                >
                                    {t('biography')}
                                </li>

                                <hr className='lg:hidden w-3/4 border-black'/>
                                <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/professions')}
                                >
                                    {t('professions')}
                                </li>

                                <hr className='lg:hidden w-3/4 border-black'/>
                                <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/magic-notebooks')}
                                >
                                    {t('magicNotebooks')}
                                </li>

                                <hr className='lg:hidden w-3/4 border-black'/>
                                <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/virtual-tour')}
                                >
                                    <span className="block leading-none">{ t('house') }</span>
                                </li>

                                <hr className='lg:hidden w-3/4 border-black'/>
                                <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/resources')}
                                >
                                    {t('resources')}
                                </li> 

                                <hr className='lg:hidden w-3/4 border-black'/>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMobile && (
                    <motion.div
                        className="flex flex-col justify-center h-full"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >

                        <div className='w-full flex justify-center'>
                            <img src={logoMobile} alt="Logo Gilbert Trausch" className='w-full md:w-[58%]'/>
                        </div>
                    
                        <div className="menu w-full xl:container mx-auto">
                            <ul className="font-normal text-[18px] 2xl:text-[20px] uppercase flex flex-col xl:flex-row justify-between items-center text-center">
                                <hr className='xl:hidden w-3/4 md:w-1/2 border-black'/>
                                <li className="leading-none border-black xl:border-t-2 xl:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:xl:text-blue hover:xl:py-[30px] hover:xl:border-blue duration-[450ms] my-[10px] xl:my-[20px] hover:xl:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/biography')}
                                >
                                    {t('biography')}
                                </li>

                                <hr className='xl:hidden w-3/4 md:w-1/2 border-black'/>
                                <li className="leading-none border-black xl:border-t-2 xl:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:xl:text-blue hover:xl:py-[30px] hover:xl:border-blue duration-[450ms] my-[10px] xl:my-[20px] hover:xl:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/professions')}
                                >
                                    {t('professions')}
                                </li>

                                <hr className='xl:hidden w-3/4 md:w-1/2 border-black'/>
                                <li className="leading-none border-black xl:border-t-2 xl:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:xl:text-blue hover:xl:py-[30px] hover:xl:border-blue duration-[450ms] my-[10px] xl:my-[20px] hover:xl:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/magic-notebooks')}
                                >
                                    {t('magicNotebooks')}
                                </li>

                                <hr className='xl:hidden w-3/4 md:w-1/2 border-black'/>
                                <li className="leading-none border-black xl:border-t-2 xl:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:xl:text-blue hover:xl:py-[30px] hover:xl:border-blue duration-[450ms] my-[10px] xl:my-[20px] hover:xl:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/virtual-tour')}
                                >
                                    <span className="block leading-none">{ t('house') }</span>
                                </li>

                                <hr className='xl:hidden w-3/4 md:w-1/2 border-black'/>
                                <li className="leading-none border-black xl:border-t-2 xl:border-b-2 px-[10px] xl:px-[20px] 2xl:px-[40px] py-[10px] xl:py-[20px] hover:xl:text-blue hover:xl:py-[30px] hover:xl:border-blue duration-[450ms] my-[10px] xl:my-[20px] hover:xl:my-0 cursor-pointer"
                                    onClick={() => handleMenuClick('/resources')}
                                >
                                    {t('resources')}
                                </li> 

                                <hr className='xl:hidden w-3/4 md:w-1/2 border-black'/>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                <Player url={ audio } startAudio={startAudio} setStartAudio={setStartAudio} isVisible={animationActive && !showMenu} isMobile={false}/>
            </AnimatePresence>

            {isMobile &&
                <Player url={ audio } isMobile={isMobile} startAudio={startAudio} setStartAudio={setStartAudio}/>
            }

        </motion.div>
    );
}
