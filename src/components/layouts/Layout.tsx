import { ScriptProps } from 'next/script';
import React from 'react';
import NavigationBar from './NavigationBar';
import TopNavigationBar from './TopNavigationBar';

interface Layout{
    children: ScriptProps
}

const Layout = (props: Layout) => {
    return (
        <>
            <NavigationBar/>
            <div className="w-100-percent">
                <TopNavigationBar/>
                <div className="page-wrapper">
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default Layout
