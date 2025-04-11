import Navbar from '../content/Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout () {
    return (
        <>
            <Navbar color={'#000000'} />
            <Outlet /> 
        </>
    )
}

