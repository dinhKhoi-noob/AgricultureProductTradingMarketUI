import { ScriptProps } from "next/script";
import React, { useContext, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import TopNavigationBar from "./TopNavigationBar";
import { LayoutContext } from "../../context/LayoutContext";
import { animated, useSpring } from "react-spring";
import { Container } from "@mui/material";
import Snackbar from "./Snackbar";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import socket from "../../socket";
import ConfirmationModal from "./ConfirmationModal";

interface LayoutProps {
    children: ScriptProps;
}

// eslint-disable-next-line no-redeclare
const Layout = (props: LayoutProps) => {
    const router = useRouter();
    const { userInfo, checkCookie, getUserInformation } = useContext(AuthContext);

    const checkLoginStatus = () => {
        const currentPath = router.pathname;
        const isLoggedIn = checkCookie();
        if (
            !isLoggedIn &&
            currentPath !== "/authentication/login" &&
            currentPath !== "/authentication/register/default" &&
            currentPath !== "/authentication/register/oauth" &&
            currentPath !== "/authorization"
        ) {
            changeSnackbarValues({
                content: "Phiên đăng nhập của bạn đã hết hạn, vui lòng thử lại !",
                type: "error",
                isToggle: true,
            });
            setTimeout(() => {
                socket.disconnect();
                router.push("/authentication/login");
            }, 3000);
            return;
        }
        if (currentPath === "/") {
            changeSnackbarValues({
                content: "Chào mừng quay trở lại !",
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
        notifications,
        changeNotificationList,
        changeToggleOnNavbarStatus,
        changeSnackbarValues,
        changeSnackbarPosition,
        changeSnackbarStatus,
    } = useContext(LayoutContext);
    const { content, isToggle, type, link } = snackbarValues;
    useEffect(() => {
        getUserInformation();
        checkLoginStatus();
        socket.on("notification:get:all", result => {
            changeNotificationList(result);
        });
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
        if (userInfo.id) {
            socket.emit("joinroom", { role: userInfo.role });
            socket.auth = { uid: userInfo.id };
            socket.connect();
        }
    }, [userInfo]);
    useEffect(() => {
        socket.on("notification:newrequest", result => {
            const { content, status } = result;
            changeSnackbarValues({ content, isToggle: true, type: status === 201 ? "info" : "error" });
        });
    }, [notifications]);
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
                            <ConfirmationModal />
                            <Snackbar
                                type={type}
                                content={content}
                                isToggle={isToggle}
                                link={link ? link : undefined}
                            />
                            {props.children}
                        </animated.div>
                    </div>
                ) : (
                    <div>
                        <div className="top-navbar-container top-navbar-container--responsive">
                            <TopNavigationBar />
                        </div>
                        <div className="page-wrapper page-wrapper--responsive">
                            <ConfirmationModal />
                            <Snackbar
                                type={type}
                                content={content}
                                isToggle={isToggle}
                                link={link ? link : undefined}
                            />
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
                            <ConfirmationModal />
                            <Snackbar
                                type={type}
                                content={content}
                                isToggle={isToggle}
                                link={link ? link : undefined}
                            />
                            {props.children}
                        </animated.div>
                    </div>
                ) : (
                    <div>
                        <div className="top-navbar-container top-navbar-container--responsive">
                            <TopNavigationBar />
                        </div>
                        <div className="page-wrapper page-wrapper--responsive">
                            <ConfirmationModal />
                            <Snackbar
                                type={type}
                                content={content}
                                isToggle={isToggle}
                                link={link ? link : undefined}
                            />
                            {props.children}
                        </div>
                    </div>
                )}
            </>
        )
    ) : (
        <Container>
            <ConfirmationModal />
            <Snackbar type={type} content={content} isToggle={isToggle} link={link ? link : undefined} />
            {props.children}
        </Container>
    );
};

export default Layout;
