/* eslint-disable no-undef */
/* eslint-disable react/no-children-prop */
import Link from "next/link";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { AiFillGoogleCircle } from "react-icons/ai";
import { LayoutContext } from "../../../src/context/LayoutContext";
import loginImage from "../../../public/assets/login-image.svg";
import Image from "next/image";
import { Button, FormLabel, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { AuthContext } from "../../../src/context/AuthContext";
import { ProductTypeContext } from "../../../src/context/ProductTypeContext";
import AdditionalInformation from "../../../src/components/auth/AdditionalInformation";
import { useRouter } from "next/router";

export interface RegisterUserType {
    username: string;
    password: string;
    phone: string;
    address: string;
    email: string;
}

const Register = () => {
    const router = useRouter();
    const [passwordRetype, setRetypePassword] = useState("");
    const { interestList, getCategoryList } = useContext(ProductTypeContext);
    const { changeOnLoginPageStatus, changeSnackbarValues } = useContext(LayoutContext);
    const {
        registerUser,
        getCityNameApi,
        changeWarningStatus,
        changeCurrentUserInformation,
        isLoggedIn,
        warningStatus,
        currentUser,
    } = useContext(AuthContext);
    const { username, password, phone, email } = currentUser;
    useEffect(() => {
        const loginStatus = isLoggedIn();
        if (loginStatus) {
            router.push("/");
        }
        getCityNameApi();
        getCategoryList();
        changeOnLoginPageStatus(true);
        return () => {
            changeOnLoginPageStatus(false);
        };
    }, []);

    const retypePassword = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        setRetypePassword(target.value);
    };

    const checkPhoneNumber = () => {
        const regexPhone = /^((\+)84|0)[1-9](\d{2}){4}$/;
        const isValidPhone = regexPhone.test(phone);
        return isValidPhone;
    };

    const checkValidEmail = () => {
        const regexEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        const isValidEmail = regexEmail.test(email);
        return isValidEmail;
    };

    const checkPassword = () => {
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        const isStrongPassword = regexPassword.test(password);
        if (password !== passwordRetype) {
            return { content: "M???t kh???u kh??ng tr??ng kh???p", status: false };
        }

        if (!isStrongPassword) {
            return {
                content: "M???t kh???u ph???i d??i h??n 8 k?? t???, g???m ??t nh???t 1 ch??? s???, 1 ch??? hoa v?? 1 ch??? th?????ng",
                status: false,
            };
        }
        return { content: "", status: true };
    };

    const submitRegisterForm = (event: SyntheticEvent) => {
        event.preventDefault();
        const passwordStatus = checkPassword();
        const phoneStatus = checkPhoneNumber();
        const emailStatus = checkValidEmail();
        if (!phoneStatus) {
            changeWarningStatus("phone", true);
            changeSnackbarValues({
                content: "S??? ??i???n tho???i kh??ng h???p l???, s??? ??i???n tho???i ph???i d??i 10 ch??? s??? v?? b???t ?????u t??? 0",
                type: "error",
                isToggle: true,
            });
            return;
        }
        if (!passwordStatus?.status) {
            changeWarningStatus("password", true);
            changeSnackbarValues({ content: passwordStatus.content, type: "error", isToggle: true });
            return;
        }
        if (!emailStatus) {
            changeWarningStatus("email", true);
            changeSnackbarValues({ content: "Email kh??ng h???p l???", type: "error", isToggle: true });
        }
        registerUser(currentUser, interestList);
    };

    return (
        <div>
            <Grid container padding={3} pl={1} pr={1}>
                <Grid item sm={12} md={6} xl={6}>
                    <Image src={loginImage} />
                </Grid>
                <Grid item sm={12} md={6} xl={6}>
                    <Typography variant="h2" textAlign="center" fontSize={49} mt={3} mb={3}>
                        ????ng k??
                    </Typography>
                    <form
                        onSubmit={event => {
                            submitRegisterForm(event);
                        }}
                    >
                        <FormLabel htmlFor="register-username" children={<Typography>T??n t??i kho???n</Typography>} />
                        <TextField
                            id="register-username"
                            helperText="T??n ng?????i d??ng ph???i d??i t???i thi???u 8 k?? t??? v?? ph???i l?? duy nh???t"
                            fullWidth
                            value={username}
                            error={warningStatus.username}
                            onChange={event => {
                                changeCurrentUserInformation(event, "username");
                            }}
                        />
                        <Box mt={1}></Box>
                        <br />
                        <FormLabel
                            htmlFor="register-password"
                            children={<Typography>M???t kh???u</Typography>}
                            autoCorrect="off"
                        />
                        <TextField
                            id="register-password"
                            type="password"
                            helperText="M???t kh???u ph???i d??i t???i thi???u 8 k?? t??? v?? ch???a ??t nh???t 1 ch??? c??i vi???t th?????ng, 1 ch??? c??i vi???t hoa v?? 1 s???"
                            fullWidth
                            error={warningStatus.password}
                            value={password}
                            onChange={event => {
                                changeCurrentUserInformation(event, "password");
                            }}
                        />
                        <Box mt={1}></Box>
                        <br />
                        <FormLabel
                            htmlFor="register-confirm-password"
                            children={<Typography>X??c nh???n m???t kh???u</Typography>}
                        />
                        <TextField
                            id="register-confirm-password"
                            type="password"
                            helperText="M???t kh???u ph???i tr??ng kh???p"
                            fullWidth
                            error={warningStatus.retypePassword}
                            value={passwordRetype}
                            onChange={event => {
                                retypePassword(event);
                            }}
                        />
                        <Box mt={2}></Box>
                        <FormLabel htmlFor="register-email" children={<Typography>Email</Typography>} />
                        <TextField
                            id="register-email"
                            fullWidth
                            helperText="V?? d???: nguyenvana@test.com"
                            value={email}
                            error={warningStatus.email}
                            onChange={event => {
                                changeCurrentUserInformation(event, "email");
                            }}
                        />
                        <Box mt={1}></Box>
                        <br />
                        <AdditionalInformation />
                        <Box mt={3}></Box>
                        <Typography textAlign="center" fontSize={15}>
                            Ho???c s??? d???ng t??i kho???n kh??c
                        </Typography>
                        <Box mt={3}></Box>
                        <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="secondary" startIcon={<FaFacebook />} fullWidth>
                                    <a href="http://localhost:4000/api/user/page/facebook">????ng k?? v???i Facebook</a>
                                </Button>
                            </Grid>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="error" startIcon={<AiFillGoogleCircle />} fullWidth>
                                    <a href="http://localhost:4000/api/user/page/google">????ng k?? v???i Google</a>
                                </Button>
                            </Grid>
                        </Grid>
                        <Box mt={3}></Box>
                        <Button variant="contained" fullWidth type="submit">
                            ????ng k?? ngay
                        </Button>
                        <Box display="flex" mt={2} justifyContent="center">
                            <Typography fontSize={14}>???? c?? t??i kho???n?</Typography>
                            <Box mr={1}></Box>
                            <Typography fontSize={14} fontWeight="bold" className="cursor-pointer">
                                <Link href="/authentication/login">????ng nh???p</Link>
                            </Typography>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default Register;
