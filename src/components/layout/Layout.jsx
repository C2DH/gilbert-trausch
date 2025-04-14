import { useContext } from 'react';
import Navbar from '../content/Navbar';
import { Outlet } from 'react-router-dom';
import { NavbarContext } from '../../contexts/NavbarProvider';

export default function Layout () {

    const {colorNavbar} = useContext(NavbarContext)    

    return (
        <>
            <Navbar color={colorNavbar ? colorNavbar : "#000000" } />
            <Outlet /> 
        </>
    )
}

