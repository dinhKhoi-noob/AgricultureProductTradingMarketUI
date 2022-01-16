import React, { createContext, ReactNode, useState } from 'react';

interface LayoutContextProviderProps{
    children: ReactNode
}

interface LayoutContextDefault {
    isToggleOnNavbar: Boolean;
    changeToggleOnNavbarStatus: () => void
}

export const LayoutContext = createContext<LayoutContextDefault>({
    isToggleOnNavbar: false,
    changeToggleOnNavbarStatus: () => null
})

const LayoutContextProvider = ({children}: LayoutContextProviderProps) => {
    const [isToggleOnNavbar,setIsToggleOnNavbar] = useState(false);
    const changeToggleOnNavbarStatus = () => {
        setIsToggleOnNavbar(!isToggleOnNavbar);
    }
    const layoutContextData = {
        isToggleOnNavbar,
        changeToggleOnNavbarStatus
    }
    return (
        <LayoutContext.Provider value={layoutContextData}>
            {children}
        </LayoutContext.Provider>
    )
}

export default LayoutContextProvider
