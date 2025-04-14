import { createContext, useState } from "react";

export const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
    const [colorNavbar, setColorNavbar] = useState(false);

    return (
        <NavbarContext.Provider value={{ colorNavbar, setColorNavbar }}>
            {children}
        </NavbarContext.Provider>
    );
};