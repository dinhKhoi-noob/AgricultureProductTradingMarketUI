/* eslint-disable react/no-children-prop */
/* eslint-disable no-undef */
import Link from "next/link";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { AiFillGoogleCircle } from "react-icons/ai";
import { LayoutContext } from "../../src/context/LayoutContext";
import loginImage from "../../public/assets/login-image.svg";
import Image from "next/image";
import { Button, FormLabel, Grid, Input, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { AuthContext } from "../../src/context/AuthContext";

export interface LoginUserType {
    username: string;
    password: string;
}
const Login = () => {
    const { loginUser } = useContext(AuthContext);
    const { changeOnLoginPageStatus } = useContext(LayoutContext);
    const [currentUser, setCurrentUser] = useState<LoginUserType>({
        username: "",
        password: "",
    });

    useEffect(() => {
        changeOnLoginPageStatus(true);
        return () => {
            changeOnLoginPageStatus(false);
        };
    }, []);

    const submitLoginForm = (event: SyntheticEvent) => {
        event.preventDefault();
        loginUser(currentUser);
    };
    const changeCurrentUserInformation = (event: SyntheticEvent, inputFieldName: "username" | "password") => {
        const target = event.target as HTMLInputElement;
        if (inputFieldName === "username") {
            setCurrentUser({ ...currentUser, username: target.value });
            return;
        }
        setCurrentUser({ ...currentUser, password: target.value });
    };

    return (
        <div>
            <Grid container padding={3} pl={1} pr={1}>
                <Grid item sm={12} md={6} xl={6} lg={6}>
                    <Image src={loginImage} />
                </Grid>
                <Grid item sm={12} md={6} xl={6} lg={6}>
                    <Typography variant="h2" textAlign="center" fontSize={49} mt={3} mb={3}>
                        Đăng nhập
                    </Typography>
                    <form
                        onSubmit={event => {
                            submitLoginForm(event);
                        }}
                    >
                        <FormLabel htmlFor="login-username" children={<Typography>Tên tài khoản</Typography>} />
                        <Input
                            id="login-username"
                            fullWidth
                            value={currentUser.username}
                            onChange={event => {
                                changeCurrentUserInformation(event, "username");
                            }}
                        />
                        <Box mt={1}></Box>
                        <br />
                        <FormLabel htmlFor="login-password" children={<Typography>Mật khẩu</Typography>} />
                        <Input
                            id="login-password"
                            type="password"
                            fullWidth
                            value={currentUser.password}
                            onChange={event => {
                                changeCurrentUserInformation(event, "password");
                            }}
                        />
                        <Box mt={3}></Box>
                        <Typography textAlign="center" fontSize={15}>
                            Hoặc sử dụng tài khoản khác
                        </Typography>
                        <Box mt={3}></Box>
                        <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="secondary" startIcon={<FaFacebook />} fullWidth>
                                    <a href="http://localhost:4000/api/user/page/facebook">Đăng nhập với Facebook</a>
                                </Button>
                            </Grid>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="error" startIcon={<AiFillGoogleCircle />} fullWidth>
                                    <a href="http://localhost:4000/api/user/page/google">Đăng nhập với Google</a>
                                </Button>
                            </Grid>
                        </Grid>
                        <Box mt={3}></Box>
                        <Button variant="contained" type="submit" fullWidth>
                            Đăng nhập
                        </Button>
                        <Box display="flex" mt={2} justifyContent="center">
                            <Typography fontSize={14}>Chưa có tài khoản?</Typography>
                            <Box mr={1}></Box>
                            <Typography fontSize={14} fontWeight="bold" className="cursor-pointer">
                                <Link href="/authentication/register/default">Đăng ký</Link>
                            </Typography>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;
