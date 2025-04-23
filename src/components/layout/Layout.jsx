import { useContext, useEffect } from 'react';
import Navbar from '../content/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { NavbarContext } from '../../contexts/NavbarProvider';
import { NavbarHomeContext } from '../../contexts/NavbarHomeProvider';
import { AnimatePresence } from 'motion/react';
import { useMediaQuery } from 'react-responsive';
import { DeviceTabletIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function Layout () {
    
    const {firstTime, setFirstTime} = useContext(NavbarHomeContext)
    const {colorNavbar, setColorNavbar} = useContext(NavbarContext);
    const location = useLocation();
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ query: '(max-width: 1023px)'});
    const isTabletPortrait = useMediaQuery({
        query: '(min-width: 600px) and (max-width: 1024px) and (orientation: portrait)',
    });

    useEffect(() => {
        const blackNavbarRoutes = [
            '/',
            '/biography',
            '/resources',
            '/professions',
            '/magic-notebooks',
            '/virtual-tour',
            '/about',
            '/terms-of-use',
        ];

        const isBlack = blackNavbarRoutes.includes(location.pathname) || location.pathname.startsWith('/resources/');
        setColorNavbar(isBlack ? '#000000' : '#ffffff');

    }, [location.pathname]);

    if (isTabletPortrait) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center px-6 bg-black/90  z-[9999]">
                <DeviceTabletIcon className="w-40 h-40 rotate-90 text-white mb-4 animate-pulse" />
                <p className="text-xl font-semibold text-white">
                    { t('tablet_message')}
                </p>
            </div>
        );
    }
   
    return (
        <>
            <AnimatePresence>
                {(!firstTime || location.pathname !== "/" || isMobile) &&
                    <Navbar color={colorNavbar} />
                }
            </AnimatePresence>
            <Outlet /> 
        </>
    )
}

