/* eslint-disable react/no-children-prop */
/* eslint-disable no-undef */
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import { AiFillGoogleCircle } from "react-icons/ai";
import { LayoutContext } from "../../src/context/LayoutContext";
import loginImage from "../../public/assets/login-image.svg";
import Image from "next/image";
import { Button, FormLabel, Grid, Input, Typography } from "@mui/material";
import { Box } from "@mui/system";

const Login = () => {
    const { changeOnLoginPageStatus } = useContext(LayoutContext);
    useEffect(() => {
        changeOnLoginPageStatus(true);
        return () => {
            changeOnLoginPageStatus(false);
        };
    }, []);
    return (
        <div>
            <Grid container padding={3} pl={8} pr={8}>
                <Grid item sm={12} md={6} xl={6}>
                    <Image src={loginImage} />
                </Grid>
                <Grid item sm={12} md={6} xl={6}>
                    <Typography variant="h2" textAlign="center" fontSize={49} mt={3} mb={3}>
                        Đăng nhập
                    </Typography>
                    <form>
                        <FormLabel htmlFor="login-username" children={<Typography>Tên tài khoản</Typography>} />
                        <Input id="login-username" fullWidth />
                        <Box mt={1}></Box>
                        <br />
                        <FormLabel htmlFor="login-password" children={<Typography>Mật khẩu</Typography>} />
                        <Input id="login-password" type="password" fullWidth />
                        <Box mt={3}></Box>
                        <Typography textAlign="center" fontSize={15}>
                            Hoặc sử dụng tài khoản khác
                        </Typography>
                        <Box mt={3}></Box>
                        <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="secondary" startIcon={<FaFacebook />} fullWidth>
                                    <a href={process.env.REACT_APP_DEV_SERVER_URL}>Đăng nhập với Facebook</a>
                                </Button>
                            </Grid>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="error" startIcon={<AiFillGoogleCircle />} fullWidth>
                                    <a href="https://facebook.com">Đăng nhập với Google</a>
                                </Button>
                            </Grid>
                        </Grid>
                        <Box mt={3}></Box>
                        <Button variant="contained" fullWidth>
                            Đăng nhập
                        </Button>
                        <Box display="flex" mt={2} justifyContent="center">
                            <Typography fontSize={14}>Chưa có tài khoản?</Typography>
                            <Box mr={1}></Box>
                            <Typography fontSize={14} fontWeight="bold" className="cursor-pointer">
                                <Link href="/authentication/register">Đăng ký</Link>
                            </Typography>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;
