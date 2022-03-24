import React, { useContext, useEffect } from "react";
import ConfirmationModal from "../src/components/layouts/ConfirmationModal";
import Progress from "../src/components/layouts/Progress";
import ProductModal from "../src/components/product/ProductModal";
import ProductTable from "../src/components/product/ProductTable";
import { AuthContext } from "../src/context/AuthContext";

const Product = () => {
    const { navigateUser } = useContext(AuthContext);
    useEffect(() => {
        navigateUser("/product", ["manager"]);
    }, []);
    return (
        <>
            <Progress />
            <ConfirmationModal />
            <ProductModal />
            <ProductTable />
        </>
    );
};

export default Product;
