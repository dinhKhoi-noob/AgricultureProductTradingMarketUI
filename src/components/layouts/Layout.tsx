import { ScriptProps } from 'next/script';
import React, { useContext, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import TopNavigationBar from './TopNavigationBar';
import { LayoutContext } from '../../context/LayoutContext';
import { animated, useSpring } from 'react-spring';
import { Container } from '@mui/material';

interface Layout{
    children: ScriptProps
}

const Layout = (props: Layout) => {
    const {isToggleOnNavbar,mdMatched,isOnLoginPage,changeToggleOnNavbarStatus} = useContext(LayoutContext);
    useEffect(()=>{
        if(mdMatched){
            changeToggleOnNavbarStatus(false);
        }
        else{
            changeToggleOnNavbarStatus(true);
        }
        return ()=>{
            changeToggleOnNavbarStatus(false);
        }
    },[mdMatched])

    const topNavbarScaleAnimation = useSpring({
        from:{
            width:"80%",
            marginLeft:"270px"
        },
        to:{
            width:"100%",
            marginLeft:"0"
        }
    })
    const pageScaleAnimation = useSpring({
        from:{
            padding:"90px 0 0 270px"
        },
        to:{
            padding:"90px 0 0 0"
        }
    })
    const navbarNarrowAnimation = useSpring({
        from:{
            left:"0"
        },
        to:{
            left:"-270px"
        },
        reset:true,
    })
    const navbarScaleAnimation = useSpring({
        from:{
            left:"-270px"
        },
        to:{
            left:"0"
        },
        reset:true
    })
    return (
        !isOnLoginPage?
        (
            isToggleOnNavbar?
            <>
                <animated.div className="navbar-container" style={navbarNarrowAnimation}>
                    <NavigationBar/>
                </animated.div>
                {
                    mdMatched
                    ?
                    <div>
                        <animated.div className="top-navbar-container" style={topNavbarScaleAnimation}>
                            <TopNavigationBar/>
                        </animated.div>
                        <animated.div className="page-wrapper" style={pageScaleAnimation}>
                            {props.children}
                        </animated.div>
                    </div>
                    :
                    <div>
                        <div className="top-navbar-container top-navbar-container--responsive">
                            <TopNavigationBar/>
                        </div>
                        <div className="page-wrapper page-wrapper--responsive">
                            {props.children}
                        </div>
                    </div>
                }
            </>
            :
            <>
                <animated.div className="navbar-container" style={navbarScaleAnimation}>
                    <NavigationBar/>
                </animated.div>
                {
                    mdMatched
                    ?
                    <div>
                        <animated.div className="top-navbar-container">
                            <TopNavigationBar/>
                        </animated.div>
                        <animated.div className="page-wrapper">
                            {props.children}
                        </animated.div>
                    </div>
                    :
                    <div>
                        <div className="top-navbar-container top-navbar-container--responsive">
                            <TopNavigationBar/>
                        </div>
                        <div className="page-wrapper page-wrapper--responsive">
                            {props.children}
                        </div>
                    </div>
                }
            </>
        )
        :
        <Container>
            {props.children}
        </Container>
    )
}

export default Layout