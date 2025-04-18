import { useContext, useEffect } from 'react';
import Navbar from '../content/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { NavbarContext } from '../../contexts/NavbarProvider';
import { NavbarHomeContext } from '../../contexts/NavbarHomeProvider';
import { AnimatePresence } from 'motion/react';

export default function Layout () {
    
    const {firstTime, setFirstTime} = useContext(NavbarHomeContext)
    const {colorNavbar, setColorNavbar} = useContext(NavbarContext);
    const location = useLocation();

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
                {firstTime &&
                    <Navbar color={colorNavbar} />
                }
            </AnimatePresence>
            <Outlet /> 
        </>
    )
}

