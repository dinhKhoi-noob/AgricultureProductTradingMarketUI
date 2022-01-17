import React, { createContext, ReactNode, useState } from 'react';

interface LayoutContextProviderProps{
    children: ReactNode
}

interface LayoutContextDefault {
    isToggleOnNavbar: Boolean;
    isOnLoginPage: Boolean;
    changeOnLoginPageStatus:(status: boolean) => void;
    changeToggleOnNavbarStatus: () => void;

}

export const LayoutContext = createContext<LayoutContextDefault>({
    isToggleOnNavbar: false,
    isOnLoginPage: false,
    changeOnLoginPageStatus:(status: boolean) => null,
    changeToggleOnNavbarStatus: () => null
})

const LayoutContextProvider = ({children}: LayoutContextProviderProps) => {
    const [isToggleOnNavbar, setIsToggleOnNavbar] = useState(false);
    const [isOnLoginPage, setIsOnLoginPage] = useState(false);

    const changeOnLoginPageStatus = (status: boolean) => {
        setIsOnLoginPage(status)
    }

    const changeToggleOnNavbarStatus = () => {
        setIsToggleOnNavbar(!isToggleOnNavbar);
    }
    const layoutContextData = {
        isToggleOnNavbar,
        isOnLoginPage,
        changeToggleOnNavbarStatus,
        changeOnLoginPageStatus
    }
    return (
        <LayoutContext.Provider value={layoutContextData}>
            {children}
        </LayoutContext.Provider>
    )
}

export default LayoutContextProvider
