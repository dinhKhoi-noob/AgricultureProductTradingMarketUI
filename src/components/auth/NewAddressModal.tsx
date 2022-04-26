/* eslint-disable react/no-children-prop */
import { Box, Button, FormLabel, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { RequestContext } from "../../context/RequestContext";
import { LayoutContext } from "../../context/LayoutContext";
import { ProductTypeContext } from "../../context/ProductTypeContext";

const NewAddressModal = () => {
    const { changeSnackbarValues, changeConfirmationModalValues } = useContext(LayoutContext);
    const { getCategoryList } = useContext(ProductTypeContext);
    const { isToggleAddNewAddress, changeToggleOnAddNewAddressModalStatus } = useContext(RequestContext);
    const {
        getCityNameApi,
        renderAddressSelector,
        changeAddressLineOne,
        cities,
        warningStatus,
        districtSelection,
        wardSelection,
        userAddress,
    } = useContext(AuthContext);
    useEffect(() => {
        getCityNameApi();
        getCategoryList();
    }, []);

    const handleAddNewAddress = (event: SyntheticEvent) => {
        event.preventDefault();
        const { cityCode, districtCode, wardCode, level, street } = userAddress;
        if (
            !cityCode ||
            !districtCode ||
            !wardCode ||
            !level ||
            !street ||
            cityCode === "" ||
            districtCode === "" ||
            wardCode === "" ||
            level === "" ||
            street === ""
        ) {
            changeSnackbarValues({
                content: "Thông tin không hợp lệ, vui lòng thử lại !",
                type: "error",
                isToggle: true,
            });
            return;
        }
        changeConfirmationModalValues({
            title: "Bạn muốn thêm địa chỉ mới với những thông tin này ?",
            isToggle: true,
            type: "newAddress",
        });
    };

    return (
        <Modal
            open={isToggleAddNewAddress}
            onClose={() => {
                changeToggleOnAddNewAddressModalStatus();
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="product-type-modal scrollable" padding={4} paddingRight={3} paddingLeft={3}>
                <Typography variant="h5" textAlign="center" className="text-camel" m={4} ml={0} mr={0}>
                    Thêm địa chỉ mới
                </Typography>
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
                    children={<Typography>Tên Khu vực / Ấp / Đường / Tổ / Khu phố</Typography>}
                />
                <TextField
                    id="register-address"
                    helperText="Tên Khu vực / Ấp / Đường / Tổ / Khu phố không được để trống"
                    fullWidth
                    error={warningStatus.street}
                    value={userAddress.street}
                    onChange={event => {
                        changeAddressLineOne(event, "street");
                    }}
                />
                <Box mt={3}></Box>
                <FormLabel htmlFor="register-level" children={<Typography>Số nhà:</Typography>} />
                <TextField
                    id="register-level"
                    helperText="Số nhà không được để trống"
                    fullWidth
                    error={warningStatus.level}
                    value={userAddress.level}
                    onChange={event => {
                        changeAddressLineOne(event, "level");
                    }}
                />
                <Box mt={4} mb={4}></Box>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            onClick={event => {
                                handleAddNewAddress(event);
                            }}
                        >
                            Thêm
                        </Button>
                        &nbsp;
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                changeToggleOnAddNewAddressModalStatus();
                            }}
                        >
                            Huỷ
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default NewAddressModal;
