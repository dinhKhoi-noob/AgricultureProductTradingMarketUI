import React, { createContext, ReactNode, useState } from 'react';
import { useMediaQuery,useTheme } from '@mui/material';

interface LayoutContextProviderProps{
    children: ReactNode
}

interface LayoutContextDefault {
    isToggleOnNavbar: Boolean;
    smMatched: Boolean,
    mdMatched: Boolean,
    changeToggleOnNavbarStatus: (status? :boolean) => void
}

export const LayoutContext = createContext<LayoutContextDefault>({
    isToggleOnNavbar: false,
    smMatched: false,
    mdMatched: false,
    changeToggleOnNavbarStatus: () => null
})

const LayoutContextProvider = ({children}: LayoutContextProviderProps) => {
    const theme = useTheme();
    const mdMatched = useMediaQuery(theme.breakpoints.up('md'));
    const smMatched = useMediaQuery(theme.breakpoints.up('sm'));
    const [isToggleOnNavbar,setIsToggleOnNavbar] = useState(false);
    const changeToggleOnNavbarStatus = (status? :boolean) => {
        setIsToggleOnNavbar(status?status:!isToggleOnNavbar);
    }
    const layoutContextData = {
        isToggleOnNavbar,
        mdMatched,
        smMatched,
        changeToggleOnNavbarStatus
    }
    return (
        <LayoutContext.Provider value={layoutContextData}>
            {children}
        </LayoutContext.Provider>
    )
}

export default LayoutContextProvider
