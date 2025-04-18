import { useContext, useEffect } from 'react';
import Navbar from '../content/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { NavbarContext } from '../../contexts/NavbarProvider';
import { NavbarHomeContext } from '../../contexts/NavbarHomeProvider';
import { AnimatePresence } from 'motion/react';
import { useMediaQuery } from 'react-responsive';

export default function Layout () {
    
    const {firstTime, setFirstTime} = useContext(NavbarHomeContext)
    const {colorNavbar, setColorNavbar} = useContext(NavbarContext);
    const location = useLocation();
    const isMobile = useMediaQuery({ query: '(max-width: 1023px)'});

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

        const isBlack = blackNavbarRoutes.includes(location.pathname);
        setColorNavbar(isBlack ? '#000000' : '#ffffff');
    }, [location.pathname]);

   
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

