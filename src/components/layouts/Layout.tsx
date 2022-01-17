import { ScriptProps } from 'next/script';
import React, { Children, useContext } from 'react';
import NavigationBar from './NavigationBar';
import TopNavigationBar from './TopNavigationBar';
import { LayoutContext } from '../../context/LayoutContext';
import { animated, useSpring } from 'react-spring';

interface Layout{
    children: ScriptProps
}

const Layout = (props: Layout) => {
    const {isToggleOnNavbar,isOnLoginPage} = useContext(LayoutContext);
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
                <div className="w-100-percent">
                    <animated.div className="top-navbar-container" style={topNavbarScaleAnimation}>
                        <TopNavigationBar/>
                    </animated.div>
                    <animated.div className="page-wrapper" style={pageScaleAnimation}>
                        {props.children}
                    </animated.div>
                </div>
            </>
            :
            <>
                <animated.div className="navbar-container" style={navbarScaleAnimation}>
                    <NavigationBar/>
                </animated.div>
                <div className="w-100-percent">
                    <animated.div className="top-navbar-container">
                        <TopNavigationBar/>
                    </animated.div>
                    <animated.div className="page-wrapper">
                        {props.children}
                    </animated.div>
                </div>
            </>
        )
        :
        <div>
            {props.children}
        </div>
    )
}

export default Layout
