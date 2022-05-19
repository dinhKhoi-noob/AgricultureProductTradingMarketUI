/* eslint-disable react/no-children-prop */
import { Box, Button, FormLabel, Modal, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LayoutContext, UserConfirmationType } from "../../context/LayoutContext";
import AdditionalInformation from "./AdditionalInformation";

interface CreateUserModalProps {
    role: string;
}

const CreateUserModal = ({ role }: CreateUserModalProps) => {
    const { currentUser, isToggleOnCreateUserModal, changeCurrentUserInformation, changeIsToggleOnCreateUserModal } =
        useContext(AuthContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const [passwordRetype, setRetypePassword] = useState("");
    const retypePassword = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        setRetypePassword(target.value);
    };
    const { username, password, email } = currentUser;
    const switchRole = (role: string): UserConfirmationType => {
        switch (role) {
            case "manager":
                return "createManager";
            case "shipper":
                return "createShipper";
            case "packing_staff":
                return "createPackingStaff";
            case "customer":
                return "createCustomer";
            default:
                return "createCustomer";
        }
    };
    const submitRegisterForm = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            isToggle: true,
            type: switchRole(role),
            title: "Bạn chắc chắn muốn tạo tài khoản người dùng với những thông tin này ?",
        });
    };
    return (
        <Modal
            open={isToggleOnCreateUserModal}
            onClose={() => {
                changeIsToggleOnCreateUserModal();
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="product-type-modal scrollable" padding={4} paddingRight={3} paddingLeft={3}>
                <Typography marginTop={3} marginBottom={4} variant="h5" textAlign="center">
                    Tạo người dùng mới
                </Typography>
                <form
                    onSubmit={event => {
                        submitRegisterForm(event);
                    }}
                >
                    <FormLabel htmlFor="register-username" children={<Typography>Tên tài khoản</Typography>} />
                    <TextField
                        id="register-username"
                        fullWidth
                        value={username}
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
                        fullWidth
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
                        fullWidth
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
                        value={email}
                        onChange={event => {
                            changeCurrentUserInformation(event, "email");
                        }}
                    />
                    <Box mt={1}></Box>
                    <br />
                    <AdditionalInformation />
                    <Box mt={3}></Box>
                    <Button variant="contained" fullWidth type="submit">
                        Tạo ngay
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateUserModal;
