import { Button, Grid } from "@mui/material";
import React, { useContext } from "react";
import { LayoutContext, OrderConfirmationType } from "../../context/LayoutContext";
import { OrderContext, OrderValueInitializer } from "../../context/OrderContext";
import { TransactionType } from "../../context/RequestContext";
import RatingBoard from "./RatingBoard";

interface OrderButtonGroupProps {
    id: string | undefined;
    role: string | undefined;
    status: string | undefined;
    type: TransactionType | undefined;
    isRoot: boolean;
    userId: string | undefined;
    requestUserId: string | undefined;
    subrequestUserId: string | undefined;
    subOrders: OrderValueInitializer[];
}

const OrderButtonGroup = (props: OrderButtonGroupProps) => {
    const { id, role, status, type, isRoot, userId, requestUserId, subrequestUserId, subOrders } = props;
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const { changeCurrentOrderConfirmationValue } = useContext(OrderContext);

    const handleOnClickOrderButton = (
        id: string,
        content: string,
        type: OrderConfirmationType,
        isRoot: boolean,
        transactionType: TransactionType
    ) => {
        changeCurrentOrderConfirmationValue({
            id,
            isRoot,
            type: transactionType,
        });
        changeConfirmationModalValues({
            isToggle: true,
            title: `Bạn chắc chắn muốn ${content} này?`,
            type,
        });
    };

    const renderButtonGroups = (
        id: string,
        role: string,
        status: string,
        type: TransactionType,
        isRoot: boolean,
        userId: string,
        requestUserId: string,
        subrequestUserId: string
    ) => {
        switch (status) {
            case "preparing":
                if (
                    (role === "consummer" && type === "buying" && !isRoot && userId === subrequestUserId) ||
                    (role === "consummer" && type === "selling" && isRoot && userId === requestUserId)
                ) {
                    return (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                handleOnClickOrderButton(
                                    id,
                                    "hoàn tất chuẩn bị cho đơn hàng",
                                    "changeToReady",
                                    isRoot,
                                    type
                                );
                            }}
                        >
                            Hoàn tất chuẩn bị
                        </Button>
                    );
                }
                break;
            case "ready":
                if (
                    (role === "shipper" && type === "buying" && !isRoot) ||
                    (role === "shipper" && type === "selling" && isRoot)
                ) {
                    return (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                handleOnClickOrderButton(id, "nhận đơn hàng", "changeToCarryingIn", isRoot, type);
                            }}
                        >
                            Nhận đơn hàng này
                        </Button>
                    );
                }
                break;
            case "carrying_in":
                if (
                    (role === "shipper" && type === "buying" && !isRoot) ||
                    (role === "shipper" && type === "selling" && isRoot)
                ) {
                    return (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                handleOnClickOrderButton(
                                    id,
                                    "hoàn thành việc nhận hàng cho đơn hàng",
                                    "changeToCarriedIn",
                                    isRoot,
                                    type
                                );
                            }}
                        >
                            Hoàn thành nhận hàng
                        </Button>
                    );
                }
                break;
            case "carried_in":
                if (
                    (role === "packing_staff" && type === "buying" && isRoot) ||
                    (role === "packing_staff" && type === "selling" && !isRoot)
                ) {
                    return (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                handleOnClickOrderButton(
                                    id,
                                    "nhận đóng gói đơn hàng",
                                    "changeToPackaging",
                                    isRoot,
                                    type
                                );
                            }}
                        >
                            Đóng gói đơn hàng
                        </Button>
                    );
                }
                break;
            case "packaging":
                if (
                    (role === "packing_staff" && type === "buying" && isRoot) ||
                    (role === "packing_staff" && type === "selling" && !isRoot)
                ) {
                    return (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                handleOnClickOrderButton(
                                    id,
                                    "hoàn tất việc đóng gói cho đơn hàng",
                                    "changeToPackaged",
                                    isRoot,
                                    type
                                );
                            }}
                        >
                            Hoàn thành đóng gói
                        </Button>
                    );
                }
                break;
            case "packaged":
                if (
                    (role === "shipper" && type === "buying" && isRoot) ||
                    (role === "shipper" && type === "selling" && !isRoot)
                ) {
                    return (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                handleOnClickOrderButton(id, "nhận giao đơn hàng", "changeToDelivering", isRoot, type);
                            }}
                        >
                            Giao đơn hàng này
                        </Button>
                    );
                }
                break;
            case "delivering":
                if (
                    (role === "shipper" && type === "buying" && isRoot) ||
                    (role === "shipper" && type === "selling" && !isRoot)
                ) {
                    return (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                handleOnClickOrderButton(
                                    id,
                                    "hoàn tất việc giao đơn hàng",
                                    "changeToSuccess",
                                    isRoot,
                                    type
                                );
                            }}
                        >
                            Hoàn thành giao hàng
                        </Button>
                    );
                }
                break;
        }
    };
    return id && role && status && type && userId && requestUserId && subrequestUserId ? (
        (role === "consummer" && type === "buying" && isRoot && userId === requestUserId && status === "success") ||
        (role === "consummer" &&
            type === "selling" &&
            !isRoot &&
            userId === subrequestUserId &&
            status === "success") ? (
            <Grid container>
                <Grid item md={12}>
                    <RatingBoard id={id} isRoot={isRoot} transactionType={type} subOrders={subOrders} />
                </Grid>
            </Grid>
        ) : (
            <Grid container>
                <Grid md={6} sm={12} item justifyContent="flex-end" display="flex">
                    {renderButtonGroups(id, role, status, type, isRoot, userId, requestUserId, subrequestUserId)}
                </Grid>
                <Grid item md={6} sm={12}></Grid>
            </Grid>
        )
    ) : (
        <></>
    );
};

export default OrderButtonGroup;
