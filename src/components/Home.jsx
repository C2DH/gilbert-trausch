import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import intro_1 from '../assets/images/intro/wallpaper_intro_1.webp';
import intro_2 from '../assets/images/intro/wallpaper_intro_2.jpg';
import intro_3 from '../assets/images/intro/wallpaper_intro_3.jpg';
import intro_4 from '../assets/images/intro/wallpaper_intro_4.jpg';
import intro_5 from '../assets/images/intro/wallpaper_intro_5.jpg';
import intro_6 from '../assets/images/intro/wallpaper_intro_6.jpg';
import intro_7 from '../assets/images/intro/wallpaper_intro_7.jpg';
import intro_8 from '../assets/images/intro/wallpaper_intro_8.jpg';
import intro_9 from '../assets/images/intro/wallpaper_intro_9.jpg';
import { Link } from 'react-router-dom';
import Navbar from './content/Navbar';
import { useMediaQuery } from 'react-responsive';
import bgSmall from '../assets/images/backgrounds/bg-home-small.webp'

const images = [intro_2, intro_3, intro_4, intro_5, intro_6, intro_7, intro_8, intro_9];

const EXPIRE = 6 * 3600 * 1000;

export default function Home() {
    const [visibleImages, setVisibleImages] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [showStartButton, setShowStartButton] = useState(false);
    const [animationActive, setAnimationActive] = useState(false);
    const isMobile = useMediaQuery({query: '(max-width: 1024px)'})
    
    console.log('isMobile', isMobile)

    useEffect(() => {
        const storedHome = localStorage.getItem('home');
        const now = new Date().getTime();

        if (!storedHome || Number(storedHome) < now) {
            setShowStartButton(true); // Première visite -> bouton start affiché
        } else {
            setVisibleImages(images); // Seconde visite -> toutes les images visibles instantanément
            setShowMenu(true);
        }
    }, []);

    const handleStart = () => {
        setShowStartButton(false);
        setAnimationActive(true);
        localStorage.setItem('home', new Date().getTime() + EXPIRE);
    };

    useEffect(() => {
        if (animationActive) {
            setTimeout(() => {
                images.forEach((img, index) => {
                    setTimeout(() => {
                        setVisibleImages((prev) => [...prev, img]);

                        // Afficher le menu seulement après la dernière image
                        if (index === images.length - 1) {
                            setTimeout(() => setShowMenu(true), 1000);
                        }
                    }, index * 600);
                });
            }, 1000); // Délai de 1s avant le début des images
        }
    }, [animationActive]);

    return (
        <>
            <Navbar color={ '#000000' } />
            <div className="relative h-screen w-full">

                <motion.div
                    className="h-screen absolute inset-0"
                    style={{ background: `url(${isMobile ? bgSmall : intro_1}) center / cover no-repeat` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Images animées après le clic */}
                {!isMobile && visibleImages.map((img, index) => (
                    <motion.div
                        key={index}
                        className="h-screen absolute inset-0"
                        style={{ background: `url(${img}) center / cover no-repeat` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: animationActive ? 0.2 : 0, ease: "easeOut" }}
                    />
                ))}

                {/* Bouton */}
                <AnimatePresence>
                    {showStartButton && (
                        <motion.button
                            className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] px-[25px] py-[7px] rounded-[7px] border border-[#4100FC] text-[14px] uppercase font-medium text-[#4100FC] cursor-pointer hover:text-white hover:bg-[#4100FC] duration-500"
                            onClick={handleStart}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }} // Animation de sortie
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            Débuter
                        </motion.button>
                    )}
                </AnimatePresence>


                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            className="absolute bottom-[80px] left-0 right-0 flex justify-between"
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <div className="menu w-full lg:container mx-auto">
                                <ul className="font-normal text-[20px] 2xl:text-[20px] uppercase flex flex-col lg:flex-row justify-between items-center text-center">
                                    <hr className='lg:hidden w-3/4 border-black'/>
                                    <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0">
                                        <Link to={"/biography"}>Biographie</Link>
                                    </li>

                                    <hr className='lg:hidden w-3/4 border-black'/>
                                    <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0">
                                        <Link to={"/professions"}>Les métiers de l'historien</Link>
                                    </li>

                                    <hr className='lg:hidden w-3/4 border-black'/>
                                    <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0">
                                        <Link to={"/magic-notebooks"}>Cahiers magiques</Link>
                                    </li>

                                    <hr className='lg:hidden w-3/4 border-black'/>
                                    <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0">
                                        <Link to={"/virtual-tour"}>
                                            <span className="block leading-none">La maison-bibliothèque</span>
                                        </Link>
                                    </li>

                                    <hr className='lg:hidden w-3/4 border-black'/>
                                    <li className="leading-none border-black lg:border-t-2 lg:border-b-2 px-[10px] xl:px-[40px] py-[10px] xl:py-[20px] hover:lg:text-blue hover:lg:py-[30px] hover:lg:border-blue duration-[450ms] my-[10px] lg:my-[20px] hover:lg:my-0">
                                        <Link to={"/resources"}>Ressources</Link>
                                    </li> 

                                    <hr className='lg:hidden w-3/4 border-black'/>
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
