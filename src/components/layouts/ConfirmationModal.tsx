import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { SyntheticEvent, useContext } from "react";
import Cookies from "universal-cookie";
import { AuthContext } from "../../context/AuthContext";
import { RequestContext, TransactionType } from "../../context/RequestContext";
import { LayoutContext } from "../../context/LayoutContext";
import { ProductContext } from "../../context/ProductContext";
import { ProductTypeContext } from "../../context/ProductTypeContext";
import { UploadFileContext } from "../../context/UploadFileContext";
import { UserContext } from "../../context/UserContext";
import { OrderContext } from "../../context/OrderContext";

const ConfirmationModal = () => {
    const cookie = new Cookies();
    const router = useRouter();
    const { userInfo, userAddress, currentUser, updateAdditionalInformation, addNewAddress } = useContext(AuthContext);
    const { confirmationModalValue, changeConfirmationModalValues, changeLoadingStatus, changeSnackbarValues } =
        useContext(LayoutContext);
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
    const {
        newRequest,
        currentSellingRequest,
        createNewRequest,
        registerSubrequest,
        confirmRequest,
        changeToggleOnAddNewAddressModalStatus,
        updateRequest,
        updateSubrequest,
        changeRequestStatus,
        changeSubrequestStatus,
    } = useContext(RequestContext);

    const { changeOrderStatus } = useContext(OrderContext);

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

    const handleAddNewRequest = async (id: string, type: "selling" | "buying") => {
        if (fileNames && fileNames.length > 0) {
            changeLoadingStatus(true);
            changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
            const form = new FormData();
            const files = Array.prototype.slice.call(fileNames);
            changeCurrentFilePaths([]);
            files.forEach((file: File) => {
                form.append("data", file, file.name);
            });
            const response = await uploadMultipleFiles(form);
            if (response && type === "buying") {
                createNewRequest(newRequest, id, "buying", response);
            }
            if (response && type === "selling") {
                createNewRequest(newRequest, id, "selling", response);
            }
            return;
        } else {
            changeSnackbarValues({
                content: "Vui lòng chọn hình ảnh mô tả để người dùng hiểu rõ hơn về yêu cầu của bạn !",
                type: "error",
                isToggle: true,
            });
        }
    };

    const handleUpdateRequest = async (type: TransactionType) => {
        changeLoadingStatus(true);
        if (fileNames && fileNames.length > 0) {
            const form = new FormData();
            const files = Array.prototype.slice.call(fileNames);
            changeCurrentFilePaths([]);
            files.forEach((file: File) => {
                form.append("data", file, file.name);
            });
            const response = await uploadMultipleFiles(form);
            if (response) {
                updateRequest(type, response);
                return;
            }
            changeSnackbarValues({
                content: "Đã xảy ra lỗi trong quá trình tải ảnh lên !",
                type: "error",
                isToggle: true,
            });
            return;
        }
        updateRequest(type, []);
    };

    const handleUpdateSubrequest = async (type: TransactionType) => {
        changeLoadingStatus(true);
        if (fileNames && fileNames.length > 0) {
            const form = new FormData();
            const files = Array.prototype.slice.call(fileNames);
            changeCurrentFilePaths([]);
            files.forEach((file: File) => {
                form.append("data", file, file.name);
            });
            const response = await uploadMultipleFiles(form);
            if (response) {
                updateSubrequest(type, response);
                return;
            }
            changeSnackbarValues({
                content: "Đã xảy ra lỗi trong quá trình tải ảnh lên !",
                type: "error",
                isToggle: true,
            });
            return;
        }
        updateSubrequest(type, []);
    };

    const handleAddNewRegistrationSubrequest = async (id: string, type: TransactionType) => {
        console.log(type);
        if (fileNames && fileNames.length > 0 && type === "selling") {
            changeLoadingStatus(true);
            changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
            const form = new FormData();
            const files = Array.prototype.slice.call(fileNames);
            changeCurrentFilePaths([]);
            files.forEach((file: File) => {
                form.append("data", file, file.name);
            });
            const response = await uploadMultipleFiles(form);
            if (response) {
                registerSubrequest(id, currentSellingRequest, response, type);
            }
            return;
        }
        if (type === "buying") {
            registerSubrequest(id, currentSellingRequest, [], type);
            return;
        }
        changeSnackbarValues({
            content:
                "Thiếu hình ảnh minh hoạ, hình ảnh minh hoạ sẽ giúp người đăng yêu cầu hiểu rõ hơn về sản phẩm của bạn !",
            isToggle: true,
            type: "error",
        });
    };

    const handleAddNewAddress = (id: string) => {
        changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
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
        addNewAddress(address, id);
        changeToggleOnAddNewAddressModalStatus();
    };

    const handleChangeRequestStatus = (status: string, type: TransactionType) => {
        changeRequestStatus(status, type);
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
                handleAddNewRequest(id, "buying");
                break;
            case "newSellingRequest":
                handleAddNewRequest(id, "selling");
                break;
            case "confirmBuyingRequest":
                changeLoadingStatus(true);
                confirmRequest("buying");
                break;
            case "confirmSellingRequest":
                changeLoadingStatus(true);
                confirmRequest("selling");
                break;
            case "registerBuyingSubrequest":
                changeLoadingStatus(true);
                handleAddNewRegistrationSubrequest(id, "buying");
                break;
            case "registerSellingSubrequest":
                changeLoadingStatus(true);
                handleAddNewRegistrationSubrequest(id, "selling");
                break;
            case "newAddress":
                handleAddNewAddress(id);
                break;
            case "updateBuyingRequest":
                updateRequest("buying");
                break;
            case "updateSellingRequest":
                handleUpdateRequest("selling");
                break;
            case "cancelBuyingRequest":
                handleChangeRequestStatus("cancel", "buying");
                break;
            case "cancelSellingRequest":
                handleChangeRequestStatus("cancel", "selling");
                break;
            case "updateBuyingSubrequest":
                handleUpdateSubrequest("buying");
                break;
            case "updateSellingSubrequest":
                handleUpdateSubrequest("selling");
                break;
            case "cancelBuyingSubrequest":
                changeSubrequestStatus("refused", "Đã huỷ yêu cầu thành công !", "buying");
                break;
            case "cancelSellingSubrequest":
                changeSubrequestStatus("refused", "Đã huỷ yêu cầu thành công !", "selling");
                break;
            case "confirmBuyingSubrequest":
                changeSubrequestStatus("success", "Yêu cầu đã được phê duyệt", "buying");
                break;
            case "confirmSellingSubrequest":
                changeSubrequestStatus("success", "Yêu cầu đã được phê duyệt", "selling");
                break;
            case "changeToReady":
                changeOrderStatus("ready", id);
                break;
            case "changeToCarryingIn":
                changeOrderStatus("carrying_in", id);
                break;
            case "changeToCarriedIn":
                changeOrderStatus("carried_in", id);
                break;
            case "changeToPackaging":
                changeOrderStatus("packaging", id);
                break;
            case "changeToPackaged":
                changeOrderStatus("packaged", id);
                break;
            case "changeToDelivering":
                changeOrderStatus("delivering", id);
                break;
            case "changeToSuccess":
                changeOrderStatus("success", id);
                break;
            case "changeToConfirmed":
                changeOrderStatus("confirmed", id);
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
