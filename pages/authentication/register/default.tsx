/* eslint-disable no-undef */
/* eslint-disable react/no-children-prop */
import Link from "next/link";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { AiFillGoogleCircle } from "react-icons/ai";
import { LayoutContext } from "../../../src/context/LayoutContext";
import loginImage from "../../../public/assets/login-image.svg";
import Image from "next/image";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Input,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { AuthContext } from "../../../src/context/AuthContext";

type InputFieldType = "username" | "password" | "phone" | "retypePassword";
type AccountType = "provider" | "consummer";

export interface RegisterUserType {
    username: string;
    password: string;
    phone: string;
    address: string;
    accountType: AccountType;
}

const Register = () => {
    const [passwordRetype, setRetypePassword] = useState("");
    const [currentUser, setCurrentUser] = useState<RegisterUserType>({
        username: "",
        password: "",
        phone: "",
        address: "",
        accountType: "provider",
    });

    const { changeOnLoginPageStatus, changeSnackbarValues } = useContext(LayoutContext);
    const {
        registerUser,
        getCityNameApi,
        renderAddressSelector,
        changeAddressLineOne,
        changeWarningStatus,
        cities,
        warningStatus,
        districtSelection,
        wardSelection,
        userAddress,
    } = useContext(AuthContext);
    const { username, password, phone, accountType } = currentUser;
    useEffect(() => {
        getCityNameApi();
        changeOnLoginPageStatus(true);
        return () => {
            changeOnLoginPageStatus(false);
        };
    }, []);

    const changeAccountType = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const type = value === "consummer" ? "consummer" : "provider";
        setCurrentUser({ ...currentUser, accountType: type });
    };

    const changeCurrentUserInformation = (event: SyntheticEvent, inputFieldType: InputFieldType) => {
        const target = event.target as HTMLInputElement;
        const value = target?.value;
        switch (inputFieldType) {
            case "password":
                setCurrentUser({ ...currentUser, password: value });
                break;
            case "phone":
                setCurrentUser({ ...currentUser, phone: value });
                break;
            case "username":
                setCurrentUser({ ...currentUser, username: value });
                break;
            case "retypePassword":
                setRetypePassword(value);
                break;
            default:
                return;
        }
    };

    const checkPhoneNumber = () => {
        const regexPhone = /^((\+)84|0)[1-9](\d{2}){4}$/;
        const isValidPhone = regexPhone.test(phone);
        return isValidPhone ? true : false;
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
        registerUser(currentUser);
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
                        <Input
                            id="register-username"
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
                        <Input
                            id="register-password"
                            type="password"
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
                        <Input
                            id="register-confirm-password"
                            type="password"
                            fullWidth
                            error={warningStatus.retypePassword}
                            value={passwordRetype}
                            onChange={event => {
                                changeCurrentUserInformation(event, "retypePassword");
                            }}
                        />
                        <Box mt={1}></Box>
                        <br />
                        <FormLabel htmlFor="register-phone" children={<Typography>Số điện thoại</Typography>} />
                        <Input
                            id="register-phone"
                            fullWidth
                            value={phone}
                            error={warningStatus.phone}
                            onChange={event => {
                                changeCurrentUserInformation(event, "phone");
                            }}
                        />
                        <br />
                        <Box mt={2}></Box>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Bạn là: </FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={accountType}
                                onChange={event => changeAccountType(event)}
                            >
                                <FormControlLabel value="provider" control={<Radio />} label="Nhà cung cấp nông sản" />
                                <FormControlLabel value="consummer" control={<Radio />} label="Nhà tiêu thụ nông sản" />
                            </RadioGroup>
                        </FormControl>
                        <Box mt={3}></Box>
                        <Typography>Địa chỉ liên lạc:</Typography>
                        <Box mt={3}></Box>
                        {renderAddressSelector("city", cities)}
                        <Box mt={3}></Box>
                        {renderAddressSelector("district", districtSelection)}
                        <Box mt={3}></Box>
                        {renderAddressSelector("ward", wardSelection)}
                        <Box mt={3}></Box>
                        <FormLabel
                            htmlFor="register-address"
                            children={<Typography>Tên Đường / Tổ / Khu phố:</Typography>}
                        />
                        <Input
                            id="register-address"
                            fullWidth
                            error={warningStatus.street}
                            value={userAddress.street}
                            onChange={event => {
                                changeAddressLineOne(event, "street");
                            }}
                        />
                        <Box mt={3}></Box>
                        <FormLabel htmlFor="register-level" children={<Typography>Số nhà:</Typography>} />
                        <Input
                            id="register-level"
                            fullWidth
                            error={warningStatus.level}
                            value={userAddress.level}
                            onChange={event => {
                                changeAddressLineOne(event, "level");
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
                                    <a href={process.env.REACT_APP_DEV_SERVER_URL}>Đăng ký với Facebook</a>
                                </Button>
                            </Grid>
                            <Grid item md={5.8} sm={12} xs={12}>
                                <Button variant="contained" color="error" startIcon={<AiFillGoogleCircle />} fullWidth>
                                    <a href="https://facebook.com">Đăng ký với Google</a>
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
