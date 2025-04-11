import { useEffect, useState } from "react";
import bgMenu from '../../assets/images/backgrounds/bg-menu.webp';
import logoUni from '../../assets/images/logo-uni.svg';
import logoGouv from '../../assets/images/logo-gouv.svg';
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguageContext } from "../../contexts/LanguageProvider";
import classNames from "classnames";
import { t } from "i18next";
import { useSharedState } from "../../contexts/ShareStateProvider";

export default function Navbar({color}) {

    const [isOpen, setIsOpen] = useState(false);
    const {language, changeLanguage } = useLanguageContext();
    const [sharedState, setSharedState] = useSharedState();
    const location = useLocation();
    const navigate = useNavigate();

    const handleMenuClick = (path) => {
        if (location.pathname === path) {
            setIsOpen(false);
        } else {
            setIsOpen(false);
            setSharedState((prev) => {return { ...prev, showCurtains: true }}) 
            setTimeout(() => {
                navigate(path);
            }, 1000);
        }
      };

    /** Disable scroll when menu is open */
    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isOpen);
        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    return (
        <>
            <div className="navbar h-[40px] absolute inset-0 border-b z-[101] px-[20px]" style={{ borderColor: color }}>
                <div className="container mx-auto h-full">
                    <ul className="flex justify-between items-center h-full relative">
                        <li className="uppercase cursor-pointer order-2 lg:order-1 absolute left-[50%] -translate-x-[50%] lg:static lg:translate-x-0" onClick={() => handleMenuClick('/') }>
                            <span to={"/"} className="text-[14px] sm:text-[18px] hover:text-[#4100FC] duration-500" style={{ color: color }} >Gilbert Trausch</span>
                        </li>

                        {/** BUTTON MAIN MENU */}
                        <li className="cursor-pointer lg:absolute lg:left-[50%] lg:-translate-x-[50%] order-1 lg:order-2" onClick={() => setIsOpen(!isOpen)}>
                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0.625C0 0.3125 0.273438 0 0.625 0H16.875C17.1875 0 17.5 0.3125 17.5 0.625C17.5 0.976562 17.1875 1.25 16.875 1.25H0.625C0.273438 1.25 0 0.976562 0 0.625ZM0 6.875C0 6.5625 0.273438 6.25 0.625 6.25H16.875C17.1875 6.25 17.5 6.5625 17.5 6.875C17.5 7.22656 17.1875 7.5 16.875 7.5H0.625C0.273438 7.5 0 7.22656 0 6.875ZM16.875 13.75H0.625C0.273438 13.75 0 13.4766 0 13.125C0 12.8125 0.273438 12.5 0.625 12.5H16.875C17.1875 12.5 17.5 12.8125 17.5 13.125C17.5 13.4766 17.1875 13.75 16.875 13.75Z" fill={`${color}`}/>
                            </svg>
                        </li>

                        {/** BUTTON SECTION MENU */}
                        <li className='lg:hidden cursor-pointer order-3'>
                            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="25" cy="25" r="25" fill={"white"}/>
                                <path d="M17.125 19.0625C17.125 18.7812 17.3711 18.5 17.6875 18.5H32.3125C32.5938 18.5 32.875 18.7812 32.875 19.0625C32.875 19.3789 32.5938 19.625 32.3125 19.625H17.6875C17.3711 19.625 17.125 19.3789 17.125 19.0625ZM17.125 24.6875C17.125 24.4062 17.3711 24.125 17.6875 24.125H27.8125C28.0938 24.125 28.375 24.4062 28.375 24.6875C28.375 25.0039 28.0938 25.25 27.8125 25.25H17.6875C17.3711 25.25 17.125 25.0039 17.125 24.6875ZM23.875 30.3125C23.875 30.6289 23.5938 30.875 23.3125 30.875H17.6875C17.3711 30.875 17.125 30.6289 17.125 30.3125C17.125 30.0312 17.3711 29.75 17.6875 29.75H23.3125C23.5938 29.75 23.875 30.0312 23.875 30.3125Z" fill="blue" style={{ transition: 'all 0.5s ease-in-out'}}/>
                            </svg>
                        </li>
                        
                        <li className="hidden lg:block uppercase cursor-pointer text-[14px] hover:text-[#4100FC] duration-500 lg:order-2" style={{ color: color }}>
                            <LanguageSwitcher switchLanguage={changeLanguage} lang={language}/>
                        </li>
                    </ul>
                </div>
            </div>

            <AnimatePresence>           
                {isOpen && 
                    <motion.div 
                        className="w-full absolute inset-0 z-[102]"
                        key="menu"
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <div className="h-screen px-[20px]" style={{ background: `url(${bgMenu}) center / cover no-repeat` }}>
                            <div className="container mx-auto h-full relative">
                                <div className="header h-[40px]">
                                    <ul className="flex justify-between h-full items-center">
                                        <li className="uppercase cursor-pointer text-[18px] hover:text-[#4100FC] duration-500"
                                            onClick={() => handleMenuClick('/')}
                                        >
                                            <span>Gilbert Trausch</span>
                                            {/* <br className="hidden lg:block"/>
                                            <span className="hidden lg:block font-light">Une vie dédiée à l'Histoire (1931-2018)</span> */}
                                        </li>

                                        <li className="text-[18px] cursor-pointer uppercase lg:absolute left-[50%] -translate-x-[50%] hover:text-[#4100FC] " onClick={() => setIsOpen(!isOpen)}>{ t('close') }</li>
                                        
                                        <li className="hidden lg:block uppercase cursor-pointer text-[14px] hover:text-[#4100FC] duration-500">
                                            <LanguageSwitcher switchLanguage={changeLanguage} lang={language}/>
                                        </li>
                                    </ul>
                                </div>

                                {/** MAIN MENU */}
                                <div className="2xl:flex items-center h-[calc(100vh-40px)] mt-[50px] lg:mt-[100px] 2xl:mt-0">
                                    <ul className="font-light text-[20px] md:text-[36px] 2xl:text-[60px] uppercase">
                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:pl-[50px] leading-none mb-5 cursor-pointer"
                                            onClick={() => handleMenuClick('/biography')}
                                        >
                                            { t('biography')}
                                        </li>

                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:pl-[50px] leading-none mb-5 cursor-pointer"
                                            onClick={() => handleMenuClick('/professions')}
                                        >
                                            { t('professions')}
                                        </li>

                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:pl-[50px] leading-none mb-5 cursor-pointer"
                                            onClick={() => handleMenuClick('/magic-notebooks')}
                                        >
                                            { t('magicNotebooks')}
                                        </li>

                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:pl-[50px] mb-5 cursor-pointer"
                                            onClick={() => handleMenuClick('/virtual-tour')} 
                                        >
                                            <span className="block leading-none">{ t('house')}</span>
                                            <span className="block leading-none">({ t('tour')})</span>   
                                        </li>

                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:pl-[50px] leading-none cursor-pointer"
                                            onClick={() => handleMenuClick('/resources')}       
                                        >
                                            { t('resources')}
                                        </li>
                                    </ul>
                                </div>

                                {/** SUBMENU */}
                                <div className="absolute bottom-[150px] left-0">
                                    <ul className="uppercase text-[16px] 2xl:text-[18px] font-light">
                                        <li className="hover:text-[#4100FC] w-fit cursor-pointer"
                                            onClick={() => handleMenuClick('/about')}
                                        >
                                            {t('about')}
                                        </li>

                                        <li className="hover:text-[#4100FC] w-fit cursor-pointer"
                                            onClick={() => handleMenuClick('/terms-of-use')}
                                        >
                                            {t('conditions')}
                                        </li>

                                        <li className="hover:text-[#4100FC] w-fit cursor-pointer">
                                            <Link to={'mailto:c2dh@uni.lu'}>Contact</Link>
                                        </li>
                                    </ul>
                                </div>

                                {/** PARTNERS */}
                                <div className="absolute left-0 bottom-[50px] flex items-end">
                                    <div className="mr-[50px]">
                                        <Link to={'https://www.c2dh.uni.lu/'} target="_blank">
                                            <img src={logoUni} alt="Logo Université" className="h-[50px]" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to={'https://mcult.gouvernement.lu/fr.html'} target="_blank">
                                            <img src={logoGouv} alt="Logo Gouvernement" className="h-[50px]" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )
}


const LanguageSwitcher = ({ switchLanguage, lang }) => {
    return (
        <div className='text-[14px]'>   
            <span className={classNames('cursor-pointer mr-[5px]', {'text-blue': lang === 'fr'})}  onClick={() => switchLanguage('fr') }>FR</span>
            <span className={classNames('cursor-pointer', {'text-blue': lang === 'de'})}  onClick={() => switchLanguage('de') }>DE</span>
        </div>
    )
}

