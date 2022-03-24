/* eslint-disable react/no-children-prop */
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import AdditionalInformation from "../../../src/components/auth/AdditionalInformation";
import { AuthContext } from "../../../src/context/AuthContext";
import { LayoutContext } from "../../../src/context/LayoutContext";

const Oauth = () => {
    const { currentUser, userAddress, getCityNameApi, updateAdditionalInformation } = useContext(AuthContext);
    const { changeOnLoginPageStatus, changeSnackbarValues } = useContext(LayoutContext);
    const router = useRouter();
    const host = "http://localhost:4000";

    const onCompleteAdditionalInformation = async () => {
        const id = router.query["id"];
        const { phone } = currentUser;
        const { city, district, ward, street, level, cityCode, districtCode, wardCode } = userAddress;
        if (
            !phone ||
            phone === "" ||
            !city ||
            city === "" ||
            !district ||
            district === "" ||
            !ward ||
            ward === "" ||
            !street ||
            street === "" ||
            !level ||
            level === ""
        ) {
            changeSnackbarValues({
                content: "Vui lòng nhập đầy đủ các thông tin cần thiết!",
                type: "error",
                isToggle: true,
            });
            return;
        }
        const address =
            level +
            ", " +
            street +
            ", " +
            ward +
            ", " +
            district +
            ", " +
            city +
            "!^!" +
            cityCode +
            "&" +
            districtCode +
            "&" +
            wardCode;
        if (typeof id === "string") {
            await updateAdditionalInformation(id, phone, address, false);
        }
    };

    const checkExistId = async () => {
        const id = router.query["id"];
        if (!id || id === "") {
            changeSnackbarValues({
                content: "Không tìm thấy người dùng, bạn sẽ được điều hướng về trang đăng nhập",
                type: "error",
                isToggle: true,
            });
            changeSnackbarValues({
                content: "Không tìm thấy người dùng, bạn sẽ được điều hướng về trang đăng nhập",
                type: "error",
                isToggle: true,
            });
        }
        if (id) {
            try {
                const response = await axios.get(`${host}/api/user/${id}`);
                const uid = response.data.result.id;
                if (uid === "" || !uid) {
                    changeSnackbarValues({
                        content: "Không tìm thấy người dùng, bạn sẽ được điều hướng về trang đăng nhập",
                        type: "error",
                        isToggle: true,
                    });
                    setTimeout(() => {
                        router.push("/authentication/login");
                    }, 3000);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    changeSnackbarValues({
                        content: "Không tìm thấy người dùng, bạn sẽ được điều hướng về trang đăng nhập",
                        type: "error",
                        isToggle: true,
                    });
                    setTimeout(() => {
                        router.push("/authentication/login");
                    }, 3000);
                }
            }
        }
    };

    useEffect(() => {
        getCityNameApi();
        changeOnLoginPageStatus(true);
        checkExistId();
        return () => {
            changeOnLoginPageStatus(false);
        };
    }, []);
    return (
        <>
            <Box mt={8} mb={5}></Box>
            <Typography variant="h4" textAlign="center" className="text-uppercase">
                Thông tin bổ sung
            </Typography>
            <Box mt={4} mb={2}></Box>
            <AdditionalInformation />
            <br />
            <Box mt={3} mb={4}></Box>
            <Button
                fullWidth
                variant="contained"
                onClick={() => {
                    onCompleteAdditionalInformation();
                }}
            >
                Đăng ký ngay
            </Button>
            <Box mt={3} mb={4}></Box>
        </>
    );
};

export default Oauth;
