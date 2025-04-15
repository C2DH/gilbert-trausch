import { useContext, useEffect } from 'react';
import Navbar from '../content/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { NavbarContext } from '../../contexts/NavbarProvider';

export default function Layout () {
    
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
            <Navbar color={colorNavbar} />
            <Outlet /> 
        </>
    )
}

