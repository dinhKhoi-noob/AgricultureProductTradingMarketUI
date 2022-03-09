import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { ReactNode, useContext, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { ProductContext, ProductValueInitializer } from "../../context/ProductContext";
import ProductCard from "./ProductCard";

const ProductTable = () => {
    const { productList, getProduct, changeModalValues } = useContext(ProductContext);
    useEffect(() => {
        getProduct();
    }, []);
    const renderProductCard = (): ReactNode => {
        return productList.map((product: ProductValueInitializer, index) => {
            const { id, categoryName, title, createdBy, dateCreated, dateModified, typeId } = product;
            return (
                <ProductCard
                    key={index}
                    id={id}
                    categoryName={categoryName}
                    title={title}
                    createdBy={createdBy}
                    dateCreated={format(new Date(dateCreated), "dd/MM/yyyy")}
                    dateModified={format(new Date(dateModified), "dd/MM/yyyy")}
                    typeId={typeId}
                />
            );
        });
    };
    return (
        <Container>
            <Box mt={4} mr={3} mb={2} style={{ float: "right" }}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AiOutlinePlus />}
                    onClick={() => {
                        changeModalValues(true, "status");
                    }}
                >
                    Thêm nông sản mới
                </Button>
            </Box>
            <Grid container justifyContent="space-between">
                <Grid xs={4} sm={4} md={4} lg={3} xl={3} item>
                    <Typography fontWeight="bold" textAlign="center">
                        Tên nông sản
                    </Typography>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={2.5} xl={2.5} item>
                    <Typography fontWeight="bold" textAlign="center">
                        Ngày tạo
                    </Typography>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={2.5} xl={2.5} item>
                    <Typography fontWeight="bold" textAlign="center">
                        Thuộc danh mục
                    </Typography>
                </Grid>
                <Grid xs={2} sm={2} md={2} lg={4} xl={4} item></Grid>
            </Grid>
            <hr />
            <Box mt={2} mb={2}></Box>
            {renderProductCard()}
        </Container>
    );
};

export default ProductTable;
