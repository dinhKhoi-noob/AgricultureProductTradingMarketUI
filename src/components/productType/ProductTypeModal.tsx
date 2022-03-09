/* eslint-disable react/no-children-prop */
import { Button, FormControlLabel, FormLabel, Grid, Input, Modal, Radio, RadioGroup, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { SyntheticEvent, useContext, useEffect } from "react";
import { LayoutContext } from "../../context/LayoutContext";
import { ProductTypeContext, ProductTypeDefault, ProductTypeModalActionType } from "../../context/ProductTypeContext";

const ProductTypeModal = () => {
    const crudeType: ProductTypeDefault = "crude";
    const processedType: ProductTypeDefault = "processed";
    const {
        isToggleModal,
        productTypeValue,
        changeToggleModalStatus,
        getCategoryList,
        changeProductTypeValue,
        resetField,
    } = useContext(ProductTypeContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    useEffect(() => {
        getCategoryList();
    }, []);

    const changeProductCategoryData = (event: SyntheticEvent, action: ProductTypeModalActionType): void => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        if (action === "title") {
            changeProductTypeValue(value, "title");
        }
        if (action === "type") {
            changeProductTypeValue(value, "type");
        }
    };

    const createNewCategory = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            title: "Lưu những thay đổi?",
            isToggle: true,
            type: "createProductType",
        });
    };
    return (
        <Modal
            open={isToggleModal}
            onClose={() => {
                changeToggleModalStatus(false);
                resetField();
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="product-type-modal scrollable" p={4} pr={2} pl={2}>
                <Typography variant="h6" component="h2" textAlign="center">
                    Thêm danh mục
                </Typography>
                <Box mt={1} mb={1} />
                <form
                    onSubmit={event => {
                        createNewCategory(event);
                    }}
                >
                    <FormLabel htmlFor="product-type-title" children={<Typography>Tên danh mục</Typography>} />
                    <Input
                        id="product-type-title"
                        fullWidth
                        onChange={event => {
                            changeProductCategoryData(event, "title");
                        }}
                        value={productTypeValue.title}
                    />
                    <Box mt={1} mb={1} />
                    <FormLabel id="demo-radio-buttons-group-label">Loại danh mục: </FormLabel>
                    <Box mt={1} mb={1} />
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        defaultValue={null}
                        value={productTypeValue.type}
                        onChange={event => changeProductCategoryData(event, "type")}
                    >
                        <FormControlLabel value={crudeType} control={<Radio />} label="Nông sản thô" />
                        <FormControlLabel value={processedType} control={<Radio />} label="Nông sản đã qua chế biến" />
                    </RadioGroup>
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
                                    changeToggleModalStatus();
                                    resetField();
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

export default ProductTypeModal;
