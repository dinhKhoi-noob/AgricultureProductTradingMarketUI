import { Box, Chip, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import NumberFormat from "react-number-format";
import { OrderValueInitializer } from "../../context/OrderContext";
import Progress from "../layouts/Progress";

interface OrderInformationProps {
    order: OrderValueInitializer | undefined;
}

const OrderInformation = ({ order }: OrderInformationProps) => {
    const formatDateString = "dd/MM/yyyy HH:mm";
    const convertOrderStatus = (status: string) => {
        if (status === "ready") {
            return { convertedStatus: "Đang chờ nhận hàng", isDone: true };
        }
        if (status === "carrying_in") {
            return { convertedStatus: "Đang nhận hàng", isDone: false };
        }
        if (status === "carried_in") {
            return { convertedStatus: "Đang chờ đóng gói", isDone: true };
        }
        if (status === "packaging") {
            return { convertedStatus: "Đang đóng gói", isDone: false };
        }
        if (status === "packaged") {
            return { convertedStatus: "Đang chờ giao hàng", isDone: true };
        }
        if (status === "delivering") {
            return { convertedStatus: "Đang giao hàng", isDone: false };
        }
        if (status === "success") {
            return { convertedStatus: "Đã giao hàng", isDone: true };
        }
        if (status === "confirmed") {
            return { convertedStatus: "Đã xác nhận", isDone: true };
        }
        if (status === "cancel") {
            return {
                convertedStatus: "Đã huỷ",
                isDone: false,
            };
        }
        return {
            convertedStatus: "Đang chuẩn bị",
            isDone: false,
        };
    };
    return order ? (
        <Box p={6} pb={0} pt={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Mã đơn hàng:</Typography>
                <Typography>{order.id?.toUpperCase()}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Tên mặt hàng:</Typography>
                <Typography>{order.productName}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Số lượng:</Typography>
                <Typography>
                    {order.quantity}&nbsp;{order.measure}
                </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Giá:</Typography>
                <Typography>
                    <NumberFormat value={order.price} displayType="text" thousandSeparator={true} suffix="VND" />
                </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Phí:</Typography>
                <Typography>{order.fee}%</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Tổng cộng:</Typography>
                <Typography>
                    <NumberFormat
                        value={Math.round(order.total)}
                        displayType="text"
                        thousandSeparator={true}
                        suffix="VND"
                    />
                </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Trạng thái:</Typography>
                <Chip
                    label={convertOrderStatus(order.status).convertedStatus}
                    color={convertOrderStatus(order.status).isDone ? "success" : "warning"}
                />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Ngày tạo:</Typography>
                <Typography>{format(new Date(order.orderCreatedDate), formatDateString)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">
                    Ngày nhận hàng({order.transactionType === "buying" ? "Sau:" : "Trước"}):
                </Typography>
                <Typography>{format(new Date(order.dateCompletedOrder), formatDateString)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">
                    Ngày giao hàng({order.transactionType === "selling" ? "Sau:" : "Trước"}):
                </Typography>
                <Typography>{format(new Date(order.expiredDate), formatDateString)}</Typography>
            </Box>
            {order.status === "confirmed" ? (
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                    <Typography fontWeight="bold">Ngày xác nhận đơn hàng:</Typography>
                    <Typography>{format(new Date(order.orderConfirmedDate), formatDateString)}</Typography>
                </Box>
            ) : (
                <></>
            )}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Nhận hàng từ:</Typography>
                <Typography>
                    {order.transactionType === "buying" ? order.subrequestUsername : order.requestUsername}
                </Typography>
            </Box>
            <Box mt={2} mb={2}>
                <Typography fontWeight="bold">Địa chỉ:</Typography>
                {order.transactionType === "buying" ? (
                    order.subrequestAddress.split("!^!").length > 1 ? (
                        order.subrequestAddress.split("!^!").map((address: String, index: number) => (
                            <li key={index}>
                                <Typography>{address}</Typography>
                            </li>
                        ))
                    ) : (
                        <Typography>{order.subrequestAddress}</Typography>
                    )
                ) : order.requestAddress.split("!^!").length > 1 ? (
                    order.requestAddress.split("!^!").map((address: String, index: number) => (
                        <li key={index}>
                            <Typography>{address}</Typography>
                        </li>
                    ))
                ) : (
                    <Typography>{order.requestAddress}</Typography>
                )}
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                <Typography fontWeight="bold">Giao hàng đến:</Typography>
                <Typography>
                    {order.transactionType === "buying" ? order.requestUsername : order.subrequestUsername}
                </Typography>
            </Box>
            <Box mt={2} mb={2}>
                <Typography fontWeight="bold">Địa chỉ:</Typography>
                {order.transactionType === "buying" ? (
                    order.requestAddress.split("!^!").length > 1 ? (
                        order.requestAddress.split("!^!").map((address: String, index: number) => (
                            <li key={index}>
                                <Typography>{address}</Typography>
                            </li>
                        ))
                    ) : (
                        <Typography>{order.requestAddress}</Typography>
                    )
                ) : order.subrequestAddress.split("!^!").length > 1 ? (
                    order.subrequestAddress.split("!^!").map((address: String, index: number) => (
                        <li key={index}>
                            <Typography>{address}</Typography>
                        </li>
                    ))
                ) : (
                    <Typography>{order.subrequestAddress}</Typography>
                )}
            </Box>
        </Box>
    ) : (
        <Progress></Progress>
    );
};

export default OrderInformation;
