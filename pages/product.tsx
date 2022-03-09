import React from "react";
import ConfirmationModal from "../src/components/layouts/ConfirmationModal";
import Progress from "../src/components/layouts/Progress";
import ProductModal from "../src/components/product/ProductModal";
import ProductTable from "../src/components/product/ProductTable";
import ProductContextProvider from "../src/context/ProductContext";

const Product = () => {
    return (
        <ProductContextProvider>
            <Progress />
            <ConfirmationModal />
            <ProductModal />
            <ProductTable />
        </ProductContextProvider>
    );
};

export default Product;
