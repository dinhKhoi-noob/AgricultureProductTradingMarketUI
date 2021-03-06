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
    const {
        userInfo,
        userAddress,
        currentUser,
        updateAdditionalInformation,
        addNewAddress,
        changeUserActiveStatus,
        createUser,
    } = useContext(AuthContext);
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

    const { changeOrderStatus, postRating } = useContext(OrderContext);

    const { isToggle, type, title } = confirmationModalValue;

    const loggoutUser = () => {
        cookie.remove("uid");
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
        router.push("/authentication/login");
    };

    const handleCreateUser = (role: string) => {
        const { city, district, ward, street, level, cityCode, districtCode, wardCode } = userAddress;
        const { email, password, phone, username } = currentUser;
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
        createUser({ address, email, password, phone, username }, role);
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
                content: "Vui l??ng ch???n h??nh ???nh m?? t??? ????? ng?????i d??ng hi???u r?? h??n v??? y??u c???u c???a b???n !",
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
                content: "???? x???y ra l???i trong qu?? tr??nh t???i ???nh l??n !",
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
                content: "???? x???y ra l???i trong qu?? tr??nh t???i ???nh l??n !",
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
                "Thi???u h??nh ???nh minh ho???, h??nh ???nh minh ho??? s??? gi??p ng?????i ????ng y??u c???u hi???u r?? h??n v??? s???n ph???m c???a b???n !",
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

    const handleConfirmOrder = (id: string, type: string) => {
        changeOrderStatus("confirmed", id);
        postRating(id, type);
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
            case "createCustomer":
                handleCreateUser("1234567890");
                break;
            case "createManager":
                handleCreateUser("1234567892");
                break;
            case "createPackingStaff":
                handleCreateUser("1234567893");
                break;
            case "createShipper":
                handleCreateUser("1234567894");
                break;
            case "activeUser":
                changeUserActiveStatus(true);
                break;
            case "inactiveUser":
                changeUserActiveStatus(false);
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
                changeSubrequestStatus("refused", "???? hu??? y??u c???u th??nh c??ng !", "buying");
                break;
            case "cancelSellingSubrequest":
                changeSubrequestStatus("refused", "???? hu??? y??u c???u th??nh c??ng !", "selling");
                break;
            case "confirmBuyingSubrequest":
                changeSubrequestStatus("success", "Y??u c???u ???? ???????c ph?? duy???t", "buying");
                break;
            case "confirmSellingSubrequest":
                changeSubrequestStatus("success", "Y??u c???u ???? ???????c ph?? duy???t", "selling");
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
            case "ratingRequest":
                handleConfirmOrder(id, "root");
                break;
            case "ratingSubrequest":
                handleConfirmOrder(id, "component");
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
                                X??c nh???n
                            </Button>
                            &nbsp;
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleDeclineBtn();
                                }}
                            >
                                Hu???
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal;
