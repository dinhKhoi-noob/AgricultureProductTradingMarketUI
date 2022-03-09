import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext } from "react";
import { LayoutContext } from "../../context/LayoutContext";
import { ProductContext } from "../../context/ProductContext";
import { ProductTypeContext } from "../../context/ProductTypeContext";

const ConfirmationModal = () => {
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
    const { isToggle, type, title } = confirmationModalValue;
    const handleAcceptBtn = (event: SyntheticEvent) => {
        event.preventDefault();
        switch (type) {
            case "createProductType":
                if (submitTypeEvent === "adding") {
                    postNewCategory(productTypeValue);
                }
                if (submitTypeEvent === "editing") {
                    updateCategory(productTypeValue);
                }
                changeLoadingStatus(true);
                changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
                break;
            case "deleteProductType":
                changeLoadingStatus(true);
                hideCategoryInUserSite(currentProductTypeId);
                changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
                break;
            case "createProduct":
                if (eventType === "adding") {
                    createNewProduct(modalValues);
                }
                if (eventType === "editing") {
                    updateProduct(modalValues, currentProductId);
                }
                changeLoadingStatus(true);
                changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
                break;
            case "deleteProduct":
                changeLoadingStatus(true);
                deleteProduct(currentProductId);
                changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
                break;
            default:
                return;
        }
    };
    const handleDeclineBtn = () => {};
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
