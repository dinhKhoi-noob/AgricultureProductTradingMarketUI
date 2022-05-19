import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Cookie from "universal-cookie";
import axios, { AxiosResponse } from "axios";
import { LayoutContext } from "../src/context/LayoutContext";
import { AuthContext } from "../src/context/AuthContext";
import loginImage from "../public/assets/login.png";
import Image from "next/image";
import { Grid } from "@mui/material";

const Authorization = () => {
    const host = `http://localhost:4000`;
    const { getCityNameApi, storeUserLoginInformation } = useContext(AuthContext);
    const { changeOnLoginPageStatus, changeSnackbarValues } = useContext(LayoutContext);

    const router = useRouter();
    const cookie = new Cookie();
    const [response, setResponse] = useState<AxiosResponse | null>(null);
    const handleCookie = async () => {
        try {
            const id = response?.data?.id;
            const userResponse = await axios.get(`${host}/api/user/${id}`);
            const userData = userResponse.data.result;
            if (!userData) {
                changeSnackbarValues({
                    content: "Xác thực người dùng không thành công, bạn sẽ được điều hướng về trang đăng nhập!",
                    type: "error",
                    isToggle: true,
                });
                setTimeout(() => {
                    router.push("/authentication/login");
                }, 3000);
                return;
            }
            cookie.set("uid", id, {
                path: "/",
                expires: new Date(new Date().setMinutes(new Date().getMinutes() + 1440)),
            });
            if (userData.address === "" || !userData.address || userData.phone === "" || !userData.phone) {
                router.push("/authentication/register/oauth?id=" + id);
                storeUserLoginInformation();
                return;
            }
            storeUserLoginInformation();
            router.push("/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeSnackbarValues({
                    content: "Xác thực người dùng không thành công, bạn sẽ được điều hướng về trang đăng nhập!",
                    type: "error",
                    isToggle: true,
                });
                setTimeout(() => {
                    router.push("/authentication/login");
                }, 3000);
                return;
            }
            changeSnackbarValues({
                content: "Lỗi hệ thống!",
                type: "error",
                isToggle: true,
            });
            setTimeout(() => {
                router.push("/authentication/login");
            }, 3000);
        }
    };

    const validation = async () => {
        const token = router.query["token"];
        const err = router.query["err"];
        if (err) {
            router.push(`/authentication/login?err=${err}`);
            return;
        }
        if (token) {
            try {
                const response = await axios.post(`${host}/api/user/verify`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response) {
                    setResponse(response);
                }
                return;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    changeSnackbarValues({
                        content: "Xác thực người dùng không thành công, bạn sẽ được điều hướng về trang đăng nhập!",
                        type: "error",
                        isToggle: true,
                    });
                    setTimeout(() => {
                        router.push("/authentication/login");
                    }, 3000);
                    return;
                }
                changeSnackbarValues({
                    content: "Lỗi hệ thống!",
                    type: "error",
                    isToggle: true,
                });
                setTimeout(() => {
                    router.push("/authentication/login");
                }, 3000);
            }
        }
    };
    useEffect(() => {
        validation();
    });
    // for (let i = 0; i <= 2; i++) {
    //     validation();
    // }
    useEffect(() => {
        if (response) {
            handleCookie();
        }
    }, [response]);
    useEffect(() => {
        getCityNameApi();
        changeOnLoginPageStatus(true);
        return () => {
            changeOnLoginPageStatus(false);
        };
    }, []);
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Image src={loginImage} />
        </Grid>
    );
};

export default Authorization;
