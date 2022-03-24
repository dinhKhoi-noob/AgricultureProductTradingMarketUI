import { Container } from "@mui/material";
import React, { useContext, useEffect } from "react";
import ConfirmationModal from "../src/components/layouts/ConfirmationModal";
import Progress from "../src/components/layouts/Progress";
import ProductTypeModal from "../src/components/productType/ProductTypeModal";
import ProductTypeTable from "../src/components/productType/ProductTypeTable";
import { AuthContext } from "../src/context/AuthContext";

const ProductType = () => {
    const { navigateUser } = useContext(AuthContext);
    useEffect(() => {
        navigateUser("/product_type", ["manager"]);
    }, []);
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
