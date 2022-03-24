/* eslint-disable react/no-children-prop */
import { Box, Button, FormLabel, Grid, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext, useEffect } from "react";
import { AuthContext } from "../../src/context/AuthContext";
import { BsFillPencilFill } from "react-icons/bs";
import NoUserImage from "../../public/assets/no_user.jpg";
import Image from "next/image";
import { UserContext } from "../../src/context/UserContext";
import { AiOutlineCamera, AiOutlineKey } from "react-icons/ai";
import AdditionalInformation from "../../src/components/auth/AdditionalInformation";
import { LayoutContext } from "../../src/context/LayoutContext";
import { UploadFileContext } from "../../src/context/UploadFileContext";
import Progress from "../../src/components/layouts/Progress";

type PasswordInputType = "oldPassword" | "newPassword" | "retypePassword";

const Profile = () => {
    const { userInfo, currentUser, userAddress, getCityNameApi, fillUserInformationOnEditing } =
        useContext(AuthContext);
    const {
        isOnEditing,
        isToggleRating,
        isOnEditingPassword,
        onChangePasswordValue,
        changeEditingStatus,
        changeToggleRatingStatus,
        changeOnEditingPasswordStatus,
        changePasswordValue,
    } = useContext(UserContext);
    const { changeSnackbarValues, changeConfirmationModalValues } = useContext(LayoutContext);
    const { fileName, currentFilePath, changeFileName, changeCurrentFilePath } = useContext(UploadFileContext);
    const { phone, email, address, avatar, username, loginMethod } = userInfo;
    const { oldPassword, newPassword, retypePassword } = onChangePasswordValue;
    useEffect(() => {
        if (!fileName) {
            changeFileName(undefined);
            return;
        }
        const objectURL = URL.createObjectURL(fileName);
        console.log(objectURL);
        changeCurrentFilePath(objectURL);
        return () => {
            URL.revokeObjectURL(objectURL);
            changeCurrentFilePath("");
        };
    }, [fileName]);

    const onChangePasswordInput = (event: SyntheticEvent, type: PasswordInputType) => {
        const target = event.target as HTMLInputElement;
        switch (type) {
            case "oldPassword":
                changePasswordValue({ ...onChangePasswordValue, oldPassword: target.value });
                break;
            case "newPassword":
                changePasswordValue({ ...onChangePasswordValue, newPassword: target.value });
                break;
            case "retypePassword":
                changePasswordValue({ ...onChangePasswordValue, retypePassword: target.value });
                break;
            default:
                return;
        }
    };

    const handleSubmitUpdatePassword = () => {
        changeConfirmationModalValues({
            title: "Bạn chắc chắn muốn thay đổi mật khẩu ?",
            type: "changePassword",
            isToggle: true,
        });
    };

    const handleChangeUserAvatar = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            changeFileName(target.files[0]);
        }
    };

    const onCompleteUpdateInformation = () => {
        const { phone } = currentUser;
        const { city, district, ward, street, level } = userAddress;
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

        changeConfirmationModalValues({
            title: "Bạn chắc chắn muốn thay đổi thông tin cá nhân với những thông tin này ?",
            type: "editProfile",
            isToggle: true,
        });
    };

    useEffect(() => {
        getCityNameApi();
    }, []);

    return (
        <>
            <Progress />
            <Box
                padding={8}
                width="90%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                className="centralized-relative"
            >
                <Grid container alignItems="flex-end" justifyContent="center">
                    <Grid item>
                        <Grid container alignItems="flex-end">
                            <Grid item>
                                <Image
                                    src={
                                        currentFilePath === ""
                                            ? avatar === "" || avatar === "'avatar'" || !avatar
                                                ? NoUserImage
                                                : avatar
                                            : currentFilePath
                                    }
                                    layout="fixed"
                                    width="220px"
                                    height="220px"
                                    className="profile-avatar"
                                ></Image>
                            </Grid>
                            {isOnEditing ? (
                                <Grid item width="0">
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="raised-button-file"
                                        type="file"
                                        onChange={event => {
                                            handleChangeUserAvatar(event);
                                        }}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <AiOutlineCamera className="camera-icon" />
                                    </label>
                                </Grid>
                            ) : (
                                <></>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">{username}</Typography>
                    </Grid>
                </Grid>
                <Box display="flex" marginTop={5}>
                    <Typography
                        borderBottom={!isToggleRating ? "1px solid black" : "none"}
                        onClick={() => {
                            changeToggleRatingStatus(false);
                        }}
                    >
                        Thông tin
                    </Typography>
                    <Box marginLeft={2} marginRight={2} />
                    <Typography
                        borderBottom={isToggleRating ? "1px solid black" : "none"}
                        onClick={() => {
                            changeToggleRatingStatus(false);
                        }}
                    >
                        Đánh giá
                    </Typography>
                </Box>
                {!isToggleRating ? (
                    <>
                        <Typography variant="h5" className="text-uppercase" marginTop={10}>
                            Thông tin cá nhân
                        </Typography>
                        {!isOnEditing && !isOnEditingPassword ? (
                            <>
                                <Box display="flex" marginTop={10}>
                                    <Box mr={1}>
                                        <Typography fontWeight="bold">Số điện thoại:</Typography>
                                        <Box mt={1} mb={1}></Box>
                                        <Typography fontWeight="bold">Email</Typography>
                                        <Box mt={1} mb={1}></Box>
                                        <Typography fontWeight="bold">Địa chỉ liên lạc:</Typography>
                                        <Box mt={1} mb={1}></Box>
                                    </Box>
                                    <Box ml={1}>
                                        <Typography>{phone}</Typography>
                                        <Box mt={1} mb={1}></Box>
                                        <Typography>{email}</Typography>
                                        <Box mt={1} mb={1}></Box>
                                        <Typography>{address.split("!^!")[0]}</Typography>
                                        <Box mt={1} mb={1}></Box>
                                    </Box>
                                </Box>
                                <Box display="flex" mt={2} mb={2} className="float-right">
                                    <Button
                                        variant="contained"
                                        endIcon={<BsFillPencilFill />}
                                        onClick={() => {
                                            changeEditingStatus(true);
                                            fillUserInformationOnEditing();
                                        }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <Box marginLeft={1} marginRight={1}></Box>
                                    {loginMethod === "default" && (
                                        <Button
                                            variant="contained"
                                            endIcon={<AiOutlineKey />}
                                            onClick={() => {
                                                changeOnEditingPasswordStatus(true);
                                            }}
                                            color="secondary"
                                        >
                                            Đổi mật khẩu
                                        </Button>
                                    )}
                                </Box>
                            </>
                        ) : !isOnEditingPassword ? (
                            <Box width="100%">
                                <AdditionalInformation />
                                <Box mt={4} mb={4}></Box>
                                <Box justifyContent="flex-end" className="float-right">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                            onCompleteUpdateInformation();
                                        }}
                                    >
                                        Lưu
                                    </Button>
                                    &nbsp;
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => {
                                            changeEditingStatus(false);
                                            changeCurrentFilePath("");
                                        }}
                                    >
                                        Huỷ
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box width="100%">
                                <FormLabel htmlFor="profile-password" children={<Typography>Mật khẩu cũ</Typography>} />
                                <TextField
                                    fullWidth
                                    id="profile-password"
                                    placeholder="Mật khẩu cũ"
                                    type="password"
                                    value={oldPassword}
                                    onChange={event => {
                                        onChangePasswordInput(event, "oldPassword");
                                    }}
                                    helperText="Vui lòng nhập đúng mật khẩu cũ để thay đổi mật khẩu mới"
                                />
                                <Box mt={1} mb={1}></Box>
                                <FormLabel
                                    htmlFor="profile-password-new"
                                    children={<Typography>Mật khẩu mới</Typography>}
                                />
                                <TextField
                                    fullWidth
                                    id="profile-password-new"
                                    placeholder="Mật khẩu mới"
                                    type="password"
                                    value={newPassword}
                                    onChange={event => {
                                        onChangePasswordInput(event, "newPassword");
                                    }}
                                    helperText="Mật khẩu phải dài hơn 8 ký tự, gồm ít nhất 1 chữ số, 1 chữ hoa và 1 chữ thường"
                                />
                                <Box mt={1} mb={1}></Box>
                                <FormLabel
                                    htmlFor="profile-password-new-confirm"
                                    children={<Typography>Xác nhận mật khẩu</Typography>}
                                />
                                <TextField
                                    fullWidth
                                    id="profile-password-new-confirm"
                                    placeholder="Xác nhận mật khẩu"
                                    type="password"
                                    value={retypePassword}
                                    onChange={event => {
                                        onChangePasswordInput(event, "retypePassword");
                                    }}
                                    helperText="Mật khẩu 2 lần nhập phải trùng khớp"
                                />
                                <Box mt={4} mb={4}></Box>
                                <Box justifyContent="flex-end" className="float-right">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                            handleSubmitUpdatePassword();
                                        }}
                                    >
                                        Lưu
                                    </Button>
                                    &nbsp;
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => {
                                            changeOnEditingPasswordStatus(false);
                                        }}
                                    >
                                        Huỷ
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </>
                ) : (
                    <>Rating</>
                )}
            </Box>
        </>
    );
};

export default Profile;
