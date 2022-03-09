import { Button, Container, Grid, Typography } from "@mui/material";
import { BsFillPencilFill } from "react-icons/bs";
import React, { useContext } from "react";
import { IoMdTrash } from "react-icons/io";
import { ProductTypeContext, ProductTypePropertyInitializer } from "../../context/ProductTypeContext";
import { LayoutContext } from "../../context/LayoutContext";

const ProductTypeCard = (props: ProductTypePropertyInitializer) => {
    const { id, type, title, dateCreated } = props;
    const {
        getSpecificProductType,
        changeProductTypeValue,
        changeToggleModalStatus,
        changeSubmitEventType,
        changeCurrentProductTypeId,
    } = useContext(ProductTypeContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const editProductType = (id: string) => {
        const product = getSpecificProductType(id);
        changeSubmitEventType("editing");
        if (product) {
            changeProductTypeValue(product.title, "title");
            changeProductTypeValue(product.type, "type");
            changeCurrentProductTypeId(id);
            changeToggleModalStatus(true);
        }
    };
    return (
        <Container>
            <Grid container justifyContent="space-between" mt={1} mb={1}>
                <Grid xs={4} sm={4} md={4} lg={3} xl={3} item>
                    <Typography>{title}</Typography>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={2.5} xl={2.5} item>
                    <Typography>{dateCreated}</Typography>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={2.5} xl={2.5} item>
                    <Typography>{type === "crude" ? "Nông sản thô" : "Sản phẩm từ nông sản"}</Typography>
                </Grid>
                <Grid justifyContent="space-around" xs={2} sm={2} md={2} lg={3} xl={3} container item>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="warning"
                            endIcon={<BsFillPencilFill />}
                            onClick={() => {
                                editProductType(id);
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="error"
                            endIcon={<IoMdTrash />}
                            onClick={() => {
                                changeCurrentProductTypeId(id);
                                changeConfirmationModalValues({
                                    title: "Bạn muốn xoá danh mục này ?",
                                    isToggle: true,
                                    type: "deleteProductType",
                                });
                            }}
                        >
                            Xoá
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductTypeCard;
