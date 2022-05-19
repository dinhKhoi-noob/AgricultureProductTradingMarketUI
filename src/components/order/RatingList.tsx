import { Box, Rating, TextField, Typography } from "@mui/material";
import React, { ReactNode, useContext } from "react";
import { OrderContext, RatingValueInitializer } from "../../context/OrderContext";

const RatingList = () => {
    const { ratingList } = useContext(OrderContext);
    const serviceRating =
        ratingList.filter(rating => rating.type === "service").length > 0
            ? ratingList.filter(rating => rating.type === "service")[0]
            : undefined;
    const renderProductRatingList = (): ReactNode => {
        return ratingList
            .filter(rating => rating.type === "product")
            .map((rating: RatingValueInitializer, index) => {
                return (
                    <Box key={index} pt={1} pb={1}>
                        <Box display="flex" mt={1} mb={1}>
                            <Typography fontWeight="bold">Mã yêu cầu: </Typography>&nbsp;
                            <Typography>{rating.requestId.toUpperCase()}</Typography>
                        </Box>
                        <Box display="flex" mt={1} mb={1}>
                            <Rating value={rating.ratePoint}></Rating>&nbsp;
                            <Typography>{rating.ratePoint}/5</Typography>
                        </Box>
                        {rating.comment ? (
                            <TextField disabled={true} value={rating.comment} multiline rows={3} fullWidth />
                        ) : (
                            <></>
                        )}
                    </Box>
                );
            });
    };
    return (
        <Box p={6}>
            <Typography variant="h6">1. Chất lượng sản phẩm</Typography>
            {renderProductRatingList()}
            <Typography variant="h6">2. Chất lượng dịch vụ</Typography>
            <Box pt={1} pb={1}>
                <Box display="flex" mt={1} mb={1}>
                    <Typography fontWeight="bold">Mã yêu cầu: </Typography>&nbsp;
                    <Typography>{serviceRating?.requestId.toUpperCase()}</Typography>
                </Box>
                <Box display="flex" mt={1} mb={1}>
                    <Rating value={serviceRating?.ratePoint}></Rating>&nbsp;
                    <Typography>{serviceRating?.ratePoint}/5</Typography>
                </Box>
                {serviceRating?.comment ? (
                    <TextField disabled={true} value={serviceRating.comment} multiline rows={3} fullWidth />
                ) : (
                    <></>
                )}
            </Box>
        </Box>
    );
};

export default RatingList;
