import { ScriptProps } from "next/script";
import React, { useContext, useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import TopNavigationBar from "./TopNavigationBar";
import { LayoutContext } from "../../context/LayoutContext";
import { animated, useSpring } from "react-spring";
import { Container } from "@mui/material";
import Snackbar from "./Snackbar";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";

interface LayoutProps {
    children: ScriptProps;
}

// eslint-disable-next-line no-redeclare
const Layout = (props: LayoutProps) => {
    const [isDatedCookie, setIsDatedCookie] = useState(false);
    const router = useRouter();
    const { checkCookie } = useContext(AuthContext);
    const checkLoginStatus = () => {
        const currentPath = router.pathname;
        const isLoggedIn = checkCookie();
        if (!isLoggedIn && currentPath === "/") {
            changeSnackbarValues({
                content: "You're not logged in or your cookie is now expired, please login to continue",
                type: "error",
                isToggle: true,
            });
            setIsDatedCookie(true);
            return;
        }
        if (currentPath === "/") {
            changeSnackbarValues({
                content: "Welcome back!",
                type: "info",
                isToggle: true,
            });
        }
    };
    const {
        isToggleOnNavbar,
        mdMatched,
        isOnLoginPage,
        snackbarValues,
        snackbarPosition,
        changeToggleOnNavbarStatus,
        changeSnackbarValues,
        changeSnackbarPosition,
        changeSnackbarStatus,
    } = useContext(LayoutContext);
    const { content, isToggle, type } = snackbarValues;
    const checkLoginStatusInterval = setInterval(() => {
        checkLoginStatus();
    }, 360000);
    useEffect(() => {
        checkLoginStatus();
        if (snackbarValues.isToggle) {
            changeSnackbarStatus(false);
        }
        return () => {
            changeSnackbarStatus(false);
        };
    }, []);
    useEffect(() => {
        if (mdMatched) {
            changeToggleOnNavbarStatus(false);
            changeSnackbarPosition({ ...snackbarPosition, vertical: "top" });
        } else {
            changeToggleOnNavbarStatus(true);
            changeSnackbarPosition({ ...snackbarPosition, vertical: "bottom" });
        }
        return () => {
            changeToggleOnNavbarStatus(false);
            changeSnackbarPosition({ ...snackbarPosition, vertical: "top" });
        };
    }, [mdMatched]);
    useEffect(() => {
        if (isDatedCookie) {
            clearInterval(checkLoginStatusInterval);
        }
    }, [isDatedCookie]);
    const topNavbarScaleAnimation = useSpring({
        from: {
            width: "80%",
            marginLeft: "270px",
        },
        to: {
            width: "100%",
            marginLeft: "0",
        },
    });
    const pageScaleAnimation = useSpring({
        from: {
            padding: "90px 0 0 270px",
        },
        to: {
            padding: "90px 0 0 0",
        },
    });
    const navbarNarrowAnimation = useSpring({
        from: {
            left: "0",
        },
        to: {
            left: "-270px",
        },
        // reset: true,
    });
    const navbarScaleAnimation = useSpring({
        from: {
            left: "-270px",
        },
        to: {
            left: "0",
        },
        // reset: true,
    });
    return !isOnLoginPage ? (
        isToggleOnNavbar ? (
            <>
                <animated.div className="navbar-container" style={navbarNarrowAnimation}>
                    <NavigationBar />
                </animated.div>
                {mdMatched ? (
                    <div>
                        <animated.div className="top-navbar-container" style={topNavbarScaleAnimation}>
                            <TopNavigationBar />
                        </animated.div>
                        <animated.div className="page-wrapper" style={pageScaleAnimation}>
                            <Snackbar type={type} content={content} isToggle={isToggle} />
                            {props.children}
                        </animated.div>
                    </div>
                ) : (
                    <div>
                        <div className="top-navbar-container top-navbar-container--responsive">
                            <TopNavigationBar />
                        </div>
                        <div className="page-wrapper page-wrapper--responsive">
                            <Snackbar type={type} content={content} isToggle={isToggle} />
                            {props.children}
                        </div>
                    </div>
                )}
            </>
        ) : (
            <>
                <animated.div className="navbar-container" style={navbarScaleAnimation}>
                    <NavigationBar />
                </animated.div>
                {mdMatched ? (
                    <div>
                        <animated.div className="top-navbar-container">
                            <TopNavigationBar />
                        </animated.div>
                        <animated.div className="page-wrapper">
                            <Snackbar type={type} content={content} isToggle={isToggle} />
                            {props.children}
                        </animated.div>
                    </div>
                ) : (
                    <div>
                        <div className="top-navbar-container top-navbar-container--responsive">
                            <TopNavigationBar />
                        </div>
                        <div className="page-wrapper page-wrapper--responsive">
                            <Snackbar type={type} content={content} isToggle={isToggle} />
                            {props.children}
                        </div>
                    </div>
                )}
            </>
        )
    ) : (
        <Container>
            <Snackbar type={type} content={content} isToggle={isToggle} />
            {props.children}
        </Container>
    );
};

export default Layout;
