import axios from "axios";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { LayoutContext } from "./LayoutContext";

interface ChangePasswordInputValueInitializer {
    oldPassword: string;
    newPassword: string;
    retypePassword: string;
}

interface UserContextProps {
    children: ReactNode;
}

interface UserContextDefault {
    isOnEditing: boolean;
    isToggleRating: boolean;
    isOnEditingPassword: boolean;
    onChangePasswordValue: ChangePasswordInputValueInitializer;
    changeEditingStatus: (status?: boolean) => void;
    changeToggleRatingStatus: (status?: boolean) => void;
    changeOnEditingPasswordStatus: (status?: boolean) => void;
    updatePassword: (passwordValue: ChangePasswordInputValueInitializer, id: string) => void;
    changePasswordValue: (password: ChangePasswordInputValueInitializer) => void;
}

export const UserContext = createContext<UserContextDefault>({
    isOnEditing: false,
    isToggleRating: false,
    isOnEditingPassword: false,
    onChangePasswordValue: {
        oldPassword: "",
        newPassword: "",
        retypePassword: "",
    },
    changeEditingStatus: () => null,
    changeToggleRatingStatus: () => null,
    changeOnEditingPasswordStatus: () => null,
    changePasswordValue: () => null,
    updatePassword: () => null,
});

const UserContextProvider = ({ children }: UserContextProps) => {
    const [isOnEditing, setIsOnEditing] = useState(false);
    const [isToggleRating, setIsToggleRating] = useState(false);
    const [isOnEditingPassword, setIsOnEditingPassword] = useState(false);
    const [onChangePasswordValue, setOnChangePasswordValue] = useState<ChangePasswordInputValueInitializer>({
        oldPassword: "",
        newPassword: "",
        retypePassword: "",
    });
    const { changeSnackbarValues, changeLoadingStatus } = useContext(LayoutContext);
    const host = "http://localhost:4000";
    const changeEditingStatus = (status?: boolean) => {
        setIsOnEditing(status ? status : !isOnEditing);
    };

    const changeToggleRatingStatus = (status?: boolean) => {
        setIsToggleRating(status ? status : !isToggleRating);
    };

    const changeOnEditingPasswordStatus = (status?: boolean) => {
        setIsOnEditingPassword(status ? status : !isOnEditingPassword);
    };

    const changePasswordValue = (password: ChangePasswordInputValueInitializer) => {
        setOnChangePasswordValue(password);
    };

    const checkPassword = (password: string) => {
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        const isStrongPassword = regexPassword.test(password);
        if (!isStrongPassword) {
            return false;
        }
        return true;
    };

    const updatePassword = async (passwordValue: ChangePasswordInputValueInitializer, id: string) => {
        const { oldPassword, newPassword, retypePassword } = passwordValue;

        if (newPassword !== retypePassword) {
            changeSnackbarValues({
                content: "Mật khẩu không trùng khớp !",
                type: "error",
                isToggle: true,
            });
            return;
        }
        if (!checkPassword(newPassword)) {
            changeSnackbarValues({
                content: "Mật khẩu không hợp lệ, vui lòng thử lại !",
                type: "error",
                isToggle: true,
            });
            return;
        }
        try {
            await axios.patch(`${host}/api/user/password/${id}`, {
                password: newPassword,
                old_password: oldPassword,
            });
            changeSnackbarValues({
                content: "Thay đổi mật khẩu thành công !",
                type: "success",
                isToggle: true,
            });
            changeOnEditingPasswordStatus(false);
            changePasswordValue({
                newPassword: "",
                oldPassword: "",
                retypePassword: "",
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                changeSnackbarValues({ content: error.response?.data.message, type: "error", isToggle: true });
                changeLoadingStatus(false);
                return;
            }
            changeLoadingStatus(false);
            changeSnackbarValues({
                content: "Lỗi hệ thống",
                type: "error",
                isToggle: true,
            });
        }
    };

    const userContextValue = {
        isToggleRating,
        isOnEditing,
        isOnEditingPassword,
        onChangePasswordValue,
        changeEditingStatus,
        changeToggleRatingStatus,
        changeOnEditingPasswordStatus,
        changePasswordValue,
        updatePassword,
    };

    return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
