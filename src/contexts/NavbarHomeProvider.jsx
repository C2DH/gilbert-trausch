import { createContext, useState } from "react";

export const NavbarHomeContext = createContext();

export const NavbarHomeProvider = ({ children }) => {
    const [firstTime, setFirstTime] = useState(true);

    return (
        <NavbarHomeContext.Provider value={{ firstTime, setFirstTime }}>
            {children}
        </NavbarHomeContext.Provider>
    );
};