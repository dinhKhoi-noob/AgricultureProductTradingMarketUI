import React, { createContext, ReactNode, useState } from 'react';
import { useMediaQuery,useTheme } from '@mui/material';

interface LayoutContextProviderProps{
    children: ReactNode
}

interface LayoutContextDefault {
    isToggleOnNavbar: Boolean;
    isOnLoginPage: Boolean;
    xsMatched: Boolean;
    smMatched: Boolean;
    mdMatched: Boolean;
    lgMatched: Boolean;
    xlMatched: Boolean;
    changeToggleOnNavbarStatus: (status? :boolean) => void;
    changeOnLoginPageStatus:(status: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextDefault>({
    isToggleOnNavbar: false,
    isOnLoginPage: false,
    xsMatched: false,
    smMatched: false,
    mdMatched: false,
    lgMatched: false,
    xlMatched: false,
    changeToggleOnNavbarStatus: () => null,
    changeOnLoginPageStatus:() => null
})

const LayoutContextProvider = ({children}: LayoutContextProviderProps) => {
    const theme = useTheme();
    const xsMatched = useMediaQuery(theme.breakpoints.up('xs'));
    const mdMatched = useMediaQuery(theme.breakpoints.up('md'));
    const smMatched = useMediaQuery(theme.breakpoints.up('sm'));
    const lgMatched = useMediaQuery(theme.breakpoints.up('lg'));
    const xlMatched = useMediaQuery(theme.breakpoints.up('xl'));

    const [isToggleOnNavbar,setIsToggleOnNavbar] = useState(false);
    const [isOnLoginPage,setIsOnLoginPage] = useState(false);
    const changeToggleOnNavbarStatus = (status? :boolean) => {
        setIsToggleOnNavbar(status?status:!isToggleOnNavbar);
    }
    const changeOnLoginPageStatus = (status: boolean) => {
        setIsOnLoginPage(status);
    }
    const layoutContextData = {
        isToggleOnNavbar,
        isOnLoginPage,
        xsMatched,
        mdMatched,
        smMatched,
        lgMatched,
        xlMatched,
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
