/* eslint-disable react/no-children-prop */
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import React, { ReactNode, SyntheticEvent, useContext, useEffect } from "react";
import { LayoutContext } from "../../context/LayoutContext";
import { ProductContext } from "../../context/ProductContext";
import { ProductTypeContext, ProductTypePropertyInitializer } from "../../context/ProductTypeContext";

const ProductModal = () => {
    const { modalValues, changeModalValues, resetField, changeSubmitTypeEvent } = useContext(ProductContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const { categoryList, getCategoryList } = useContext(ProductTypeContext);
    const { isToggle, title, typeId } = modalValues;

    useEffect(() => {
        getCategoryList();
    }, []);

    const changeInputModalValue = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        changeModalValues(value, "title");
    };

    const changeProductTypeId = (event: SelectChangeEvent) => {
        changeModalValues(event.target.value, "typeId");
    };

    const createNewProduct = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            title: "Lưu những thay đổi?",
            isToggle: true,
            type: "createProduct",
        });
    };

    const renderCategoryOptions = (): ReactNode => {
        return categoryList.map((category: ProductTypePropertyInitializer) => {
            const { id, title } = category;
            return (
                <MenuItem key={id} value={id}>
                    {title}
                </MenuItem>
            );
        });
    };

    return (
        <Modal
            open={isToggle}
            onClose={() => {
                changeModalValues(false, "status");
                changeSubmitTypeEvent("adding");
                resetField();
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="product-type-modal scrollable" p={4} pr={2} pl={2}>
                <Typography variant="h6" component="h2" textAlign="center">
                    Thêm nông sản
                </Typography>
                <Box mt={1} mb={1} />
                <form
                    onSubmit={event => {
                        createNewProduct(event);
                    }}
                >
                    <FormLabel htmlFor="product-title" children={<Typography>Tên nông sản</Typography>} />
                    <Input
                        id="product-title"
                        fullWidth
                        onChange={event => {
                            changeInputModalValue(event);
                        }}
                        value={title}
                    />
                    <Box mt={1} mb={1} />
                    <FormControl fullWidth>
                        <InputLabel id="product-type-selector">Loại nông sản</InputLabel>
                        <Select
                            labelId="product-type-selector"
                            id="product-type-selector-select"
                            value={typeId}
                            onChange={event => changeProductTypeId(event)}
                        >
                            {renderCategoryOptions()}
                        </Select>
                    </FormControl>
                    <Box mt={1} mb={7} />
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Button variant="contained" color="success" type="submit">
                                Lưu
                            </Button>
                        </Grid>
                        &nbsp;
                        <Grid>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    resetField();
                                    changeSubmitTypeEvent("adding");
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

export default ProductModal;
