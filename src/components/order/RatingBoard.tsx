import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext, useRef, useState } from "react";
import NumberFormat from "react-number-format";
import { LayoutContext } from "../../context/LayoutContext";
import { OrderContext, OrderValueInitializer, RatingInputValue } from "../../context/OrderContext";
import { TransactionType } from "../../context/RequestContext";
import RatingBox from "./RatingBox";

interface RatingBoardProps {
    subOrders: OrderValueInitializer[];
    id: string;
    isRoot: boolean;
    transactionType: TransactionType;
}

const RatingBoard = ({ subOrders, id, isRoot, transactionType }: RatingBoardProps) => {
    const [serviceRatingInput, setServiceRatingInput] = useState<RatingInputValue>({
        comment: "",
        ratePoint: 0,
        requestId: subOrders[0].requestId,
        type: "service",
    });
    const { setRatingList, changeCurrentOrderConfirmationValue } = useContext(OrderContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);

    const formRef = useRef<HTMLFormElement | null>(null);

    const handlePostRating = () => {
        changeCurrentOrderConfirmationValue({
            id,
            isRoot,
            type: transactionType,
        });
        const form = formRef.current;
        if (form) {
            const currentRatingList: RatingInputValue[] = subOrders.map(order => {
                const transitoryRating: RatingInputValue = {
                    comment: form[`comment-${order.subrequestId}`].value,
                    ratePoint: form[`rating-${order.subrequestId}`].value,
                    requestId: order.subrequestId,
                    type: "product",
                };
                return transitoryRating;
            });
            currentRatingList.push(serviceRatingInput);
            setRatingList(currentRatingList);
            changeConfirmationModalValues({
                isToggle: true,
                type: subOrders.length > 1 ? "ratingRequest" : "ratingSubrequest",
                title: "Bạn chắc chắn muốn đánh giá và hoàn thành đơn hàng này?",
            });
        }
    };

    return (
        <Box p={6} pt={1}>
            <Typography variant="h5" marginTop={4} marginBottom={6}>
                Bình luận và đánh giá
            </Typography>
            <Typography variant="h6">1. Chất lượng sản phẩm</Typography>
            <form ref={formRef}>
                {subOrders.map((order: OrderValueInitializer, index) => {
                    return (
                        <Box key={index}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={1}>
                                <Typography fontWeight="bold">Khách hàng:</Typography>&nbsp;
                                <Box mt={1} mb={1} />
                                <Typography>{order.subrequestUsername}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={1}>
                                <Typography fontWeight="bold">Số lượng hàng:</Typography>&nbsp;
                                <Box mt={1} mb={1} />
                                <Typography>
                                    {order.quantity} {order.measure}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={1}>
                                <Typography fontWeight="bold">Giá:</Typography>&nbsp;
                                <Box mt={1} mb={1} />
                                <Typography>
                                    <NumberFormat
                                        value={order.price}
                                        displayType="text"
                                        thousandSeparator={true}
                                        suffix="VND"
                                    />
                                </Typography>
                            </Box>
                            <RatingBox name={order.subrequestId} />
                        </Box>
                    );
                })}
            </form>
            <Typography variant="h6">2. Chất lượng dịch vụ</Typography>
            <Box display="flex">
                <Typography>Đánh giá(*):</Typography>&nbsp;
                <Rating
                    value={serviceRatingInput.ratePoint}
                    onChange={(event, newValue) => {
                        setServiceRatingInput({ ...serviceRatingInput, ratePoint: newValue ? newValue : 0 });
                    }}
                ></Rating>
            </Box>
            <Typography>Bình luận</Typography>
            <Box mt={2} />
            <TextField
                multiline
                rows={4}
                fullWidth
                value={serviceRatingInput.comment}
                onChange={(event: SyntheticEvent) => {
                    const target = event.target as HTMLInputElement;
                    setServiceRatingInput({ ...serviceRatingInput, comment: target.value });
                }}
            />
            <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" color="primary" onClick={handlePostRating}>
                    Xác nhận và đánh giá
                </Button>
            </Box>
        </Box>
    );
};

export default RatingBoard;
