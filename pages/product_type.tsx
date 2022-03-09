import { Container } from "@mui/material";
import React from "react";
import ConfirmationModal from "../src/components/layouts/ConfirmationModal";
import Progress from "../src/components/layouts/Progress";
import ProductTypeModal from "../src/components/productType/ProductTypeModal";
import ProductTypeTable from "../src/components/productType/ProductTypeTable";

const ProductType = () => {
    return (
        <>
            <Container>
                <ConfirmationModal />
                <Progress />
                <ProductTypeModal />
                <ProductTypeTable />
            </Container>
        </>
    );
};

export default ProductType;
