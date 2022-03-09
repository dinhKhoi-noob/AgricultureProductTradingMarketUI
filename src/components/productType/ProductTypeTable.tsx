import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React, { ReactNode, useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { ProductTypeContext } from "../../context/ProductTypeContext";
import ProductTypeCard from "./ProductTypeCard";
import { format } from "date-fns";

const ProductTypeTable = () => {
    const { changeToggleModalStatus, categoryList } = useContext(ProductTypeContext);
    const renderProductTypeCard = (): ReactNode => {
        return (
            <>
                {categoryList.map((item, index) => {
                    const { id, type, title, createdBy, dateCreated, dateModified } = item;
                    return (
                        <ProductTypeCard
                            key={index}
                            id={id}
                            title={title}
                            createdBy={createdBy}
                            dateCreated={format(new Date(dateCreated), "dd/MM/yyyy")}
                            dateModified={format(new Date(dateModified), "dd/MM/yyyy")}
                            type={type}
                        />
                    );
                })}
            </>
        );
    };
    return (
        <Container>
            <Box mt={4} mr={3} mb={2} style={{ float: "right" }}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AiOutlinePlus />}
                    onClick={() => {
                        changeToggleModalStatus(true);
                    }}
                >
                    Thêm danh mục mới
                </Button>
            </Box>
            <Grid container justifyContent="space-between">
                <Grid xs={4} sm={4} md={4} lg={3} xl={3} item>
                    <Typography fontWeight="bold" textAlign="center">
                        Loại
                    </Typography>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={2.5} xl={2.5} item>
                    <Typography fontWeight="bold" textAlign="center">
                        Ngày tạo
                    </Typography>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={2.5} xl={2.5} item>
                    <Typography fontWeight="bold" textAlign="center">
                        Loại danh mục
                    </Typography>
                </Grid>
                <Grid xs={2} sm={2} md={2} lg={4} xl={4} item></Grid>
            </Grid>
            <hr />
            <Box mt={2} mb={2}></Box>
            {renderProductTypeCard()}
        </Container>
    );
};

export default ProductTypeTable;
