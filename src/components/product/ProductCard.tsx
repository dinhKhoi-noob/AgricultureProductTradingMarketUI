import { Button, Container, Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { LayoutContext } from "../../context/LayoutContext";
import { ProductContext, ProductValueInitializer } from "../../context/ProductContext";

const ProductCard = (props: ProductValueInitializer) => {
    const { id, title, categoryName, dateCreated, typeId } = props;
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const { changeCurrentId, changeModalValues, changeSubmitTypeEvent } = useContext(ProductContext);

    const editProduct = () => {
        changeCurrentId(id);
        changeSubmitTypeEvent("editing");
        changeModalValues(title, "title");
        changeModalValues(typeId, "typeId");
        changeModalValues(true, "status");
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
                    <Typography>{categoryName}</Typography>
                </Grid>
                <Grid justifyContent="space-around" xs={2} sm={2} md={2} lg={3} xl={3} container item>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="warning"
                            endIcon={<BsFillPencilFill />}
                            onClick={() => {
                                editProduct();
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
                                changeCurrentId(id);
                                changeConfirmationModalValues({
                                    title: "Bạn muốn xoá danh mục này ?",
                                    isToggle: true,
                                    type: "deleteProduct",
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

export default ProductCard;
