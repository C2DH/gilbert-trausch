import { useEffect, useState } from "react";
import bgMenu from '../../assets/images/backgrounds/bg-menu.webp';
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguageContext } from "../../contexts/LanguageProvider";
import classNames from "classnames";
import { t } from "i18next";
import ftcm from "../../assets/images/FTCM.svg";
import hist from "../../assets/images/IHIST.svg";
import llc from "../../assets/images/LLC.svg";
import losch from "../../assets/images/losch.svg";
import uni from "../../assets/images/uni.svg";

export default function Navbar({color}) {

    const [isOpen, setIsOpen] = useState(false);
    const {language, changeLanguage } = useLanguageContext();
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    // Pas de backgrounds
    const noBackgroundRoutes = [
        /^\/$/,
        /^\/chapter\/.+/,
        /^\/resources(\/.*)?$/,
        /^\/magic-notebooks$/,
        /^\/magic-notebook\/.+/,
        /^\/professions$/,
    ];

    const hasBackground = !noBackgroundRoutes.some((regex) => regex.test(path));

    const handleMenuClick = (path) => {
        if (location.pathname === path) {
            setIsOpen(false);
        } else {
            setIsOpen(false);
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
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={classNames("navbar h-[40px] fixed inset-0 border-b z-[101] px-[20px]", {
                    "bg-[#FAF8F7] opacity-90" : hasBackground
                })} 
                style={{ borderColor: color }}>
                <div className="container mx-auto h-[40px]">
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

                        <li className="hidden lg:block uppercase cursor-pointer text-[14px] hover:text-[#4100FC] duration-500 lg:order-2" style={{ color: color }}>
                            <LanguageSwitcher switchLanguage={changeLanguage} lang={language}/>
                        </li>
                    </ul>
                </div>
            </motion.div>

            <AnimatePresence>           
                {isOpen && 
                    <motion.div 
                        className="w-full fixed inset-0 z-[102]"
                        key="menu"
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <div className="h-[100svh] sm:h-[100dvh] px-[20px]" style={{ background: `url(${bgMenu}) center / cover no-repeat` }}>
                            <div className="container mx-auto h-full relative">
                                <div className="header h-[40px]">
                                    <ul className="flex justify-between h-full items-center">
                                        <li className="uppercase cursor-pointer text-[14px] lg:text-[18px] hover:text-[#4100FC] duration-500"
                                            onClick={() => handleMenuClick('/')}
                                        >
                                            <span>Gilbert Trausch</span>
                                            {/* <br className="hidden lg:block"/>
                                            <span className="hidden lg:block font-light">Une vie dédiée à l'Histoire (1931-2018)</span> */}
                                        </li>

                                        <li className="text-[14px] lg:text-[18px] cursor-pointer uppercase lg:absolute lg:left-[50%] lg:-translate-x-[50%] hover:text-[#4100FC] " onClick={() => setIsOpen(!isOpen)}>{ t('close') }</li>
                                        
                                        <li className="hidden lg:block uppercase cursor-pointer text-[14px] hover:text-[#4100FC] duration-500">
                                            <LanguageSwitcher switchLanguage={changeLanguage} lang={language}/>
                                        </li>
                                    </ul>
                                </div>

                                {/** MAIN MENU */}
                                <div className="2xl:flex items-center h-auto lg:h-[calc(100dvh-40px)] mt-[40px] lg:mt-[100px] 2xl:mt-0">
                                    <ul className="font-extralight text-[24px] md:text-[36px] 2xl:text-[50px] uppercase tracking-[2px]">
                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:lg:pl-[50px] leading-none mb-4 lg:mb-6 cursor-pointer w-fit"
                                            onClick={() => handleMenuClick('/biography')}
                                        >
                                            { t('biography')}
                                        </li>

                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:lg:pl-[50px] leading-none mb-4 lg:mb-6 cursor-pointer w-fit"
                                            onClick={() => handleMenuClick('/professions')}
                                        >
                                            { t('professions')}
                                        </li>

                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:lg:pl-[50px] leading-none mb-4 lg:mb-6 cursor-pointer w-fit"
                                            onClick={() => handleMenuClick('/magic-notebooks')}
                                        >
                                            { t('magicNotebooks')}
                                        </li>

                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:lg:pl-[50px] mb-4 lg:mb-6 cursor-pointer w-fit"
                                            onClick={() => handleMenuClick('/virtual-tour')} 
                                        >
                                            <span className="block leading-none">{ t('house')}</span>
                                            <span className="text-[20px] md:text-[30px] 2xl:text-[35px] block leading-none">({ t('tour')})</span>   
                                        </li>

                                        <li className="hover:text-[#4100FC] duration-[450ms] hover:lg:pl-[50px] leading-none cursor-pointer w-fit"
                                            onClick={() => handleMenuClick('/resources')}       
                                        >
                                            { t('resources')}
                                        </li>
                                    </ul>
                                </div>

                                {/** SUBMENU */}
                                <div className="lg:absolute pt-[70px] lg:pt-0 bottom-[150px] left-0">
                                    <ul className="uppercase text-[16px] 2xl:text-[18px] leading-[22px] font-light">
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
                                <div className="absolute left-0 bottom-[60px] flex items-end gap-3 lg:gap-8 flex-wrap">
                                    <div>
                                        <Link to={'https://www.c2dh.uni.lu/'} target="_blank">
                                            <img src={uni} alt="Logo Université Luxembourg et C2DH" className="h-[40px] lg:h-[50px]" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to={'https://history.uni.lu/'} target="_blank">
                                            <img src={hist} alt="Logo Institute of History" className="h-[40px] lg:h-[50px]" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to={'https://www.uni.lu/llc-fr/'} target="_blank">
                                            <img src={llc} alt="Logo Luxembourg Learning Center" className="h-[40px] lg:h-[50px]" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to={'https://www.uni.lu/fstm-fr/'} target="_blank">
                                            <img src={ftcm} alt="Logo Faculté des Sciences, des Technologies et de Médecine" className="h-[40px] lg:h-[50px]" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to={'https://www.loschfondation.lu/'} target="_blank">
                                            <img src={losch} alt="Logo Fondation André Losch" className="h-[40px] lg:h-[50px]" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="text-[12px] leading-[12px] lg:text-[15px] lg:leading-[15px] absolute left-0 bottom-[10px] flex items-end">
                                    <span>Copyright © Université du Luxembourg 2025. All rights reserved.</span>
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

