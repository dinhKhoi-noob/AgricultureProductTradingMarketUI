/* eslint-disable react/no-children-prop */
import { Box, FormLabel, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdditionalInformation = () => {
    const {
        getCityNameApi,
        renderAddressSelector,
        changeAddressLineOne,
        changeCurrentUserInformation,
        cities,
        warningStatus,
        districtSelection,
        wardSelection,
        userAddress,
        currentUser,
    } = useContext(AuthContext);
    const { phone } = currentUser;
    useEffect(() => {
        getCityNameApi();
    }, []);

    return (
        <>
            <FormLabel htmlFor="register-phone" children={<Typography>Số điện thoại</Typography>} />
            <TextField
                id="register-phone"
                helperText="Ví dụ: 0123231123"
                fullWidth
                value={phone}
                error={warningStatus.phone}
                onChange={event => {
                    changeCurrentUserInformation(event, "phone");
                }}
            />
            <br />
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
        </>
    );
};

export default AdditionalInformation;
