import { Box, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import {
    BuyingRequestContext,
    BuyingRequestImage,
    BuyingRequestValueResponseInitializer,
} from "../../context/BuyingRequestContext";
import { ProductContext } from "../../context/ProductContext";
import BuyingRequestCard from "./BuyingRequestCard";

const ManagerBuyingRequestTable = () => {
    const { confirmedBuyingRequests, unconfirmedBuyingRequests, requestImages } = useContext(BuyingRequestContext);
    const { getProduct } = useContext(ProductContext);

    useEffect(() => {
        getProduct();
    }, []);

    const renderBuyingRequestCard = (isRenderingConfirmedRequest: boolean) => {
        const mappingList = isRenderingConfirmedRequest ? confirmedBuyingRequests : unconfirmedBuyingRequests;
        return mappingList.map((item: BuyingRequestValueResponseInitializer, index) => {
            const { id, productName, quantity, process, owner, price } = item;
            const images = requestImages
                .filter((image: BuyingRequestImage) => {
                    return image.requestId === id;
                })
                .map((image: BuyingRequestImage) => {
                    return image.url;
                });
            console.log(item);
            return (
                <BuyingRequestCard
                    id={id}
                    title={productName}
                    quantity={quantity}
                    progress={process}
                    postBy={owner}
                    price={price}
                    user={[]}
                    key={index}
                    type="manage"
                    thumbnail={images.length > 0 ? images[0] : ""}
                />
            );
        });
    };
    return (
        <>
            <Box padding={8}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    className="text-uppercase"
                    textAlign="center"
                    marginBottom={4}
                >
                    Trang quản lý yêu cầu thu mua nông sản,
                    <br />
                    sản phẩm từ nông nghiệp
                </Typography>
                <Grid container>
                    <Grid item md={9}>
                        {/* <Box display="flex">
                        <TextField fullWidth />
                        <Button startIcon={<FiSearch />} variant="outlined" />
                    </Box> */}
                    </Grid>
                </Grid>
                <Typography variant="h5" fontWeight="bold" className="text-camel" textAlign="center">
                    Yêu cầu chưa được duyệt
                </Typography>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom="1px solid"
                    marginTop={4}
                    paddingBottom={2}
                >
                    <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}></Grid>
                    <Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
                        <Typography fontWeight="bold" variant="caption">
                            Tên mặt hàng
                        </Typography>
                    </Grid>
                    <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                        <Typography fontWeight="bold" variant="caption">
                            Đăng bởi
                        </Typography>
                    </Grid>
                    <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                        <Typography fontWeight="bold" variant="caption">
                            Giá đề nghị
                        </Typography>
                    </Grid>
                    <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                        <Typography fontWeight="bold" variant="caption">
                            Số lượng
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                        <Typography fontWeight="bold" variant="caption">
                            Ngày đăng
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}></Grid>
                </Grid>
                <Box mt={2} mb={2}></Box>
                {renderBuyingRequestCard(false)}
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    className="text-camel"
                    textAlign="center"
                    marginTop={12}
                    marginBottom={4}
                >
                    Yêu cầu đã được duyệt
                </Typography>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom="1px solid"
                    paddingBottom={2}
                >
                    <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}></Grid>
                    <Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
                        <Typography fontWeight="bold" variant="caption">
                            Tên mặt hàng
                        </Typography>
                    </Grid>
                    <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                        <Typography fontWeight="bold" variant="caption">
                            Đăng bởi
                        </Typography>
                    </Grid>
                    <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                        <Typography fontWeight="bold" variant="caption">
                            Giá đề nghị
                        </Typography>
                    </Grid>
                    <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                        <Typography fontWeight="bold" variant="caption">
                            Số lượng
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                        <Typography fontWeight="bold" variant="caption">
                            Ngày đăng
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}></Grid>
                </Grid>
                <Box mt={2} mb={2}></Box>
                {renderBuyingRequestCard(true)}
            </Box>
        </>
    );
};

export default ManagerBuyingRequestTable;
