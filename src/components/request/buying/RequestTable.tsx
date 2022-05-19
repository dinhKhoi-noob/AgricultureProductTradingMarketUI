import { Box, Button, Grid, Typography } from "@mui/material";
import React, { ReactNode, useContext, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
    RequestContext,
    RequestImage,
    RequestValueResponseInitializer,
    SubrequestResponseValueInitializer,
    SucceedTradingUserProps,
    TransactionType,
} from "../../../context/RequestContext";
import { ProductContext } from "../../../context/ProductContext";
import { formatDistance } from "date-fns";
import vi from "date-fns/locale/vi";
import { AuthContext } from "../../../context/AuthContext";
import RequestCard from "./RequestCard";

interface BuyingRequestTableProps {
    transactionType: TransactionType;
}

const BuyingRequestTable = ({ transactionType }: BuyingRequestTableProps) => {
    const { changeToggleCreateNewRequestModal, getAllSubrequest, confirmedRequests, requestImages, subrequests } =
        useContext(RequestContext);
    const { getProduct } = useContext(ProductContext);
    const { userInfo, renderUserAddress } = useContext(AuthContext);
    useEffect(() => {
        renderUserAddress();
        getProduct();
        getAllSubrequest(transactionType === "selling" ? "buying" : "selling");
    }, []);

    const renderBuyingRequestCard = (type: "owner" | "other"): ReactNode => {
        const mappingRequest =
            type === "owner"
                ? confirmedRequests.filter(
                      (request: RequestValueResponseInitializer) =>
                          request && request.owner.id === userInfo.id && request.quantity !== 0
                  )
                : confirmedRequests.filter(
                      (request: RequestValueResponseInitializer) =>
                          request && request.owner.id !== userInfo.id && request.quantity !== 0
                  );
        return mappingRequest.map((item: RequestValueResponseInitializer, index) => {
            const {
                id,
                owner,
                price,
                process,
                measure,
                quantity,
                productName,
                createdDate,
                description,
                expiredDate,
                fee,
            } = item;
            const images = requestImages
                .filter((image: RequestImage) => {
                    return image.requestId === item.id;
                })
                .map((image: RequestImage) => {
                    return image.url;
                });
            const succeededSubrequest = subrequests
                .filter((request: SubrequestResponseValueInitializer) => {
                    return request.requestId === item.id && request.status === "success";
                })
                .map((request: SubrequestResponseValueInitializer) => {
                    const { avatar, id, username, quantity } = request;
                    const temporaryData: SucceedTradingUserProps = {
                        avatar,
                        id,
                        username,
                        quantity,
                    };
                    return temporaryData;
                });

            return (
                <Grid key={index} item>
                    <RequestCard
                        fee={fee}
                        id={id}
                        postBy={owner}
                        price={price}
                        process={process}
                        productName={productName}
                        thumbnail={images.length > 0 ? images : [""]}
                        type={transactionType}
                        user={
                            typeof succeededSubrequest[0] !== undefined
                                ? (succeededSubrequest as SucceedTradingUserProps[])
                                : []
                        }
                        quantity={quantity}
                        measure={measure}
                        createdDate={new Date(createdDate)}
                        expiredDate={formatDistance(new Date(expiredDate), new Date(Date.now()), {
                            addSuffix: true,
                            locale: vi,
                        })}
                        description={description}
                    />
                </Grid>
            );
        });
    };

    return (
        <Box padding={4}>
            <Typography variant="h4" fontWeight="bold" className="text-uppercase" textAlign="center" marginBottom={4}>
                Trang đăng ký {transactionType === "selling" ? "bán" : "mua"}
            </Typography>
            <Grid container>
                <Grid item md={9}>
                    {/* <Box display="flex">
                        <TextField fullWidth />
                        <Button startIcon={<FiSearch />} variant="outlined" />
                    </Box> */}
                </Grid>
                <Grid item md={3}>
                    <Button
                        variant="contained"
                        endIcon={<AiOutlinePlus />}
                        color="success"
                        className="float-right"
                        onClick={() => {
                            changeToggleCreateNewRequestModal(false);
                        }}
                    >
                        Thêm một yêu cầu mới
                    </Button>
                </Grid>
            </Grid>
            <Typography variant="h5" fontWeight="bold" textAlign="center" marginTop={12} className="text-camel">
                Các yêu cầu {transactionType === "selling" ? "bán" : "mua"} đang có trên hệ thống
            </Typography>
            <Box mt={2} mb={2}></Box>
            <Grid alignItems="stretch" container>
                {renderBuyingRequestCard("other")}
            </Grid>
        </Box>
    );
};

export default BuyingRequestTable;
