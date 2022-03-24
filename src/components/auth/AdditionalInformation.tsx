/* eslint-disable react/no-children-prop */
import {
    Box,
    Chip,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    InterestItemValueInitializer,
    ProductTypeContext,
    ProductTypePropertyInitializer,
} from "../../context/ProductTypeContext";

const AdditionalInformation = () => {
    const [interestValue, setInterestValue] = useState<InterestItemValueInitializer>({
        id: "default",
        title: "default",
    });
    const { categoryList, interestList, getCategoryList, changeInterestList, removeInterestItem } =
        useContext(ProductTypeContext);
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
        getCategoryList();
    }, []);

    const renderCategoryList = (): ReactNode => {
        return categoryList.map((category: ProductTypePropertyInitializer) => {
            const { id, title } = category;
            return (
                <MenuItem key={id} value={`${id}_${title.replaceAll(" ", "--")}`}>
                    {title}
                </MenuItem>
            );
        });
    };

    const selectCategory = (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value !== "default_default") {
            const valueArray = value.split("_");
            const title = valueArray[1].replaceAll("--", " ");
            const id = valueArray[0];
            const currentInterestValue = {
                title,
                id,
            };
            setInterestValue(currentInterestValue);
            changeInterestList(currentInterestValue);
        }
    };

    const handleDeleteInterestItem = (id: string) => {
        removeInterestItem(id);
    };
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
            <Typography>Bạn quan tâm đến ?</Typography>
            <Box mt={2} mb={2}></Box>
            <FormControl fullWidth>
                <InputLabel id="interest-selector">Danh mục</InputLabel>
                <Select
                    labelId="interest-selector"
                    id="interest-selector-select"
                    value={`${interestValue.id}_${interestValue.title.replaceAll(" ", "--")}`}
                    onChange={(event: SelectChangeEvent) => selectCategory(event)}
                    defaultValue="default_default"
                >
                    <MenuItem value="default_default">-- Chọn danh mục --</MenuItem>
                    {renderCategoryList()}
                </Select>
            </FormControl>
            <Box mt={2} mb={2} />
            {interestList.map((item, index) => {
                return (
                    <Chip
                        key={index}
                        label={item.title}
                        variant="outlined"
                        onDelete={() => handleDeleteInterestItem(item.id)}
                    />
                );
            })}
        </>
    );
};

export default AdditionalInformation;
