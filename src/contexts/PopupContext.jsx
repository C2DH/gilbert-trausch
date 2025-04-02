import { createContext, useState } from "react";

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [dataPopup, setDataPopup] = useState(null);

    return (
        <PopupContext.Provider value={{ isOpenPopup, setIsOpenPopup, dataPopup, setDataPopup }}>
            {children}
        </PopupContext.Provider>
    );
};
