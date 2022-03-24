import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { SyntheticEvent, useContext } from "react";
import Cookies from "universal-cookie";
import { AuthContext } from "../../context/AuthContext";
import { BuyingRequestContext } from "../../context/BuyingRequestContext";
import { LayoutContext } from "../../context/LayoutContext";
import { ProductContext } from "../../context/ProductContext";
import { ProductTypeContext } from "../../context/ProductTypeContext";
import { UploadFileContext } from "../../context/UploadFileContext";
import { UserContext } from "../../context/UserContext";

const ConfirmationModal = () => {
    const cookie = new Cookies();
    const router = useRouter();
    const { userInfo, userAddress, currentUser, updateAdditionalInformation } = useContext(AuthContext);
    const { confirmationModalValue, changeConfirmationModalValues, changeLoadingStatus } = useContext(LayoutContext);
    const {
        submitTypeEvent,
        productTypeValue,
        currentProductTypeId,
        postNewCategory,
        updateCategory,
        hideCategoryInUserSite,
    } = useContext(ProductTypeContext);
    const { createNewProduct, updateProduct, deleteProduct, modalValues, currentProductId, eventType } =
        useContext(ProductContext);
    const { onChangePasswordValue, changeEditingStatus, updatePassword } = useContext(UserContext);
    const {
        fileName,
        fileNames,
        uploadSingleFile,
        uploadMultipleFiles,
        changeCurrentFilePath,
        changeCurrentFilePaths,
    } = useContext(UploadFileContext);
    const { newBuyingRequest, createNewBuyingRequest, confirmBuyingRequest } = useContext(BuyingRequestContext);
    const { isToggle, type, title } = confirmationModalValue;

    const loggoutUser = () => {
        cookie.remove("uid");
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
        router.push("/authentication/login");
    };

    const handleEditProfile = async (id: string) => {
        const { phone } = currentUser;
        const { city, district, ward, street, level, cityCode, districtCode, wardCode } = userAddress;
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
        changeLoadingStatus(true);
        if (fileName && fileName.name !== "") {
            let filePath = "";
            changeCurrentFilePath("");
            changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
            const form = new FormData();
            form.append("data", fileName, fileName.name);
            const response = await uploadSingleFile(form);
            if (response) {
                filePath = response.data.url;
                updateAdditionalInformation(id, phone, address, true, filePath);
                changeEditingStatus(false);
            }
            return;
        }
        changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
        updateAdditionalInformation(id, phone, address, true);
        changeEditingStatus(false);
    };

    const handleAddNewBuyingRequest = async (id: string) => {
        changeLoadingStatus(true);
        changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
        if (fileNames && fileNames.length > 0) {
            const form = new FormData();
            const files = Array.prototype.slice.call(fileNames);
            changeCurrentFilePaths([]);
            files.forEach((file: File) => {
                form.append("data", file, file.name);
            });
            const response = await uploadMultipleFiles(form);
            if (response) {
                createNewBuyingRequest(newBuyingRequest, id, response);
            }
            return;
        }
        createNewBuyingRequest(newBuyingRequest, id);
    };

    const handleAcceptBtn = async (event: SyntheticEvent) => {
        event.preventDefault();
        const { id } = userInfo;
        changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
        switch (type) {
            case "createProductType":
                if (submitTypeEvent === "adding") {
                    postNewCategory(productTypeValue);
                }
                if (submitTypeEvent === "editing") {
                    updateCategory(productTypeValue);
                }
                changeLoadingStatus(true);
                break;
            case "deleteProductType":
                changeLoadingStatus(true);
                hideCategoryInUserSite(currentProductTypeId);
                break;
            case "createProduct":
                if (eventType === "adding") {
                    createNewProduct(modalValues);
                }
                if (eventType === "editing") {
                    updateProduct(modalValues, currentProductId);
                }
                changeLoadingStatus(true);
                break;
            case "deleteProduct":
                changeLoadingStatus(true);
                deleteProduct(currentProductId);
                break;
            case "logout":
                loggoutUser();
                break;
            case "changePassword":
                updatePassword(onChangePasswordValue, id);
                break;
            case "editProfile":
                handleEditProfile(id);
                break;
            case "newBuyingRequest":
                handleAddNewBuyingRequest(id);
                break;
            case "confirmBuyingRequest":
                changeLoadingStatus(true);
                confirmBuyingRequest();
                break;
            default:
                return;
        }
    };
    const handleDeclineBtn = () => {
        changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
    };
    return (
        <Modal
            open={isToggle}
            onClose={() => {
                changeConfirmationModalValues({
                    ...confirmationModalValue,
                    isToggle: false,
                });
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="product-type-modal" padding={4} paddingRight={3} paddingLeft={3}>
                <form
                    onSubmit={event => {
                        handleAcceptBtn(event);
                    }}
                >
                    <Typography>{title}</Typography>
                    <Box mt={4} mb={4}></Box>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                onClick={event => {
                                    handleAcceptBtn(event);
                                }}
                            >
                                Xác nhận
                            </Button>
                            &nbsp;
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleDeclineBtn();
                                }}
                            >
                                Huỷ
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal;
