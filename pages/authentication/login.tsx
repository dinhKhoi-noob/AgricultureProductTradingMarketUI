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
import { useRouter } from "next/router";

export interface LoginUserType {
    username: string;
    password: string;
}
const Login = () => {
    const router = useRouter();
    const { isLoggedIn, loginUser } = useContext(AuthContext);
    const { changeOnLoginPageStatus } = useContext(LayoutContext);
    const [currentUser, setCurrentUser] = useState<LoginUserType>({
        username: "",
        password: "",
    });

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

    useEffect(() => {
        const loginStatus = isLoggedIn();
        if (loginStatus) {
            router.push("/");
        }
        changeOnLoginPageStatus(true);
        return () => {
            changeOnLoginPageStatus(false);
        };
    }, []);

    return (
        <div>
            <Grid container padding={3} pl={1} pr={1}>
                <Grid item sm={12} md={6} xl={6} lg={6}>
                    <Image src={loginImage} />
                </Grid>
                <Grid item sm={12} md={6} xl={6} lg={6}>
                    <Typography variant="h2" textAlign="center" fontSize={49} mt={3} mb={3}>
                        ????ng nh???p
                    </Typography>
                    <form
                        onSubmit={event => {
                            submitLoginForm(event);
                        }}
                    >
                        <FormLabel htmlFor="login-username" children={<Typography>T??n t??i kho???n</Typography>} />
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
                        <FormLabel htmlFor="login-password" children={<Typography>M???t kh???u</Typography>} />
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
                            Ho???c s??? d???ng t??i kho???n kh??c
                        </Typography>
                        <Box mt={3}></Box>
                        <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="secondary" startIcon={<FaFacebook />} fullWidth>
                                    <a href="http://localhost:4000/api/user/page/facebook">????ng nh???p v???i Facebook</a>
                                </Button>
                            </Grid>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="error" startIcon={<AiFillGoogleCircle />} fullWidth>
                                    <a href="http://localhost:4000/api/user/page/google">????ng nh???p v???i Google</a>
                                </Button>
                            </Grid>
                        </Grid>
                        <Box mt={3}></Box>
                        <Button variant="contained" type="submit" fullWidth>
                            ????ng nh???p
                        </Button>
                        <Box display="flex" mt={2} justifyContent="center">
                            <Typography fontSize={14}>Ch??a c?? t??i kho???n?</Typography>
                            <Box mr={1}></Box>
                            <Typography fontSize={14} fontWeight="bold" className="cursor-pointer">
                                <Link href="/authentication/register/default">????ng k??</Link>
                            </Typography>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;
