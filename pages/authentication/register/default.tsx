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
            return { content: "Mật khẩu không trùng khớp", status: false };
        }

        if (!isStrongPassword) {
            return {
                content: "Mật khẩu phải dài hơn 8 ký tự, gồm ít nhất 1 chữ số, 1 chữ hoa và 1 chữ thường",
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
                content: "Số điện thoại không hợp lệ, số điện thoại phải dài 10 chữ số và bắt đầu từ 0",
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
            changeSnackbarValues({ content: "Email không hợp lệ", type: "error", isToggle: true });
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
                        Đăng ký
                    </Typography>
                    <form
                        onSubmit={event => {
                            submitRegisterForm(event);
                        }}
                    >
                        <FormLabel htmlFor="register-username" children={<Typography>Tên tài khoản</Typography>} />
                        <TextField
                            id="register-username"
                            helperText="Tên người dùng phải dài tối thiểu 1 ký tự và phải là duy nhất"
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
                            children={<Typography>Mật khẩu</Typography>}
                            autoCorrect="off"
                        />
                        <TextField
                            id="register-password"
                            type="password"
                            helperText="Mật khẩu phải dài tối thiểu 8 ký tự và chứa ít nhất 1 chữ cái viết thường, 1 chữ cái viết hoa và 1 số"
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
                            children={<Typography>Xác nhận mật khẩu</Typography>}
                        />
                        <TextField
                            id="register-confirm-password"
                            type="password"
                            helperText="Mật khẩu phải trùng khớp"
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
                            helperText="Ví dụ: nguyenvana@test.com"
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
                            Hoặc sử dụng tài khoản khác
                        </Typography>
                        <Box mt={3}></Box>
                        <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="secondary" startIcon={<FaFacebook />} fullWidth>
                                    <a href="http://localhost:4000/api/user/page/facebook">Đăng ký với Facebook</a>
                                </Button>
                            </Grid>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="error" startIcon={<AiFillGoogleCircle />} fullWidth>
                                    <a href="http://localhost:4000/api/user/page/google">Đăng ký với Google</a>
                                </Button>
                            </Grid>
                        </Grid>
                        <Box mt={3}></Box>
                        <Button variant="contained" fullWidth type="submit">
                            Đăng ký ngay
                        </Button>
                        <Box display="flex" mt={2} justifyContent="center">
                            <Typography fontSize={14}>Đã có tài khoản?</Typography>
                            <Box mr={1}></Box>
                            <Typography fontSize={14} fontWeight="bold" className="cursor-pointer">
                                <Link href="/authentication/login">Đăng nhập</Link>
                            </Typography>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default Register;
