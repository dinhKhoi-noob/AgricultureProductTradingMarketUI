import { Box, Button, Grid, LinearProgress, Tooltip, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import NoUserImage from "../../../../public/assets/no_user.jpg";
import { LayoutContext } from "../../../context/LayoutContext";
import { RequestContext, TransactionType } from "../../../context/RequestContext";
import { SucceedTradingUserProps, OwnerProps } from "../../../context/RequestContext";
import DefaultThumbnail from "../../../../public/assets/default-thumbnail.jpeg";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";

interface BuyingRequestCardProps {
    id: string;
    title: string;
    quantity: number;
    progress: number;
    postBy: OwnerProps;
    user: SucceedTradingUserProps[];
    price: number;
    type: "manage" | "trading" | "view";
    thumbnail: string;
    measure: string;
    createdDate: string;
    transactionType: TransactionType;
}

const BuyingRequestCard = (props: BuyingRequestCardProps) => {
    const {
        id,
        postBy,
        title,
        user,
        quantity,
        progress,
        price,
        type,
        thumbnail,
        measure,
        createdDate,
        transactionType,
    } = props;
    const quantityRatio = (progress / quantity) * 100;
    const { xsMatched, mdMatched, smMatched } = useContext(LayoutContext);
    const router = useRouter();
    const cookie = new Cookies();
    const { changeIsOpenModalStatus, changeModalInformation, fillRequest, changeSubmitType, changeCurrentRequestId } =
        useContext(RequestContext);
    const [fontSize, setFontSize] = useState(16);
    const [imageSize, setImageSize] = useState(80);

    const handleOnToggleModal = () => {
        const modalInformation = {
            owner: {
                username: postBy.username,
                avatar: postBy.avatar,
                id: postBy.id,
            },
            quantity: quantity,
            process: progress,
            title: title,
            price: price,
            selledUser: user,
        };
        changeIsOpenModalStatus(true);
        changeModalInformation(modalInformation);
    };

    useEffect(() => {
        console.log(postBy.avatar);
        if (mdMatched) {
            setFontSize(16);
            setImageSize(80);
            return;
        }
        if (smMatched) {
            setFontSize(14);
            setImageSize(60);
            return;
        }
        if (xsMatched) {
            setFontSize(12);
            setImageSize(50);
            return;
        }
        return () => {
            setFontSize(16);
        };
    }, [xsMatched, smMatched, mdMatched]);

    return (
        <Box borderBottom="1px solid">
            <Grid container justifyContent="space-between" alignItems="center" mb={1} mt={1}>
                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                    <Image
                        src={thumbnail === "" || !thumbnail ? DefaultThumbnail : thumbnail}
                        width={imageSize}
                        height={imageSize}
                    />
                </Grid>
                <Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
                    <Typography fontSize={fontSize}>{title}</Typography>
                </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                    <Box display="flex">
                        <Tooltip
                            title={
                                <Image
                                    src={
                                        postBy.avatar === "" ||
                                        !postBy.avatar ||
                                        postBy.avatar === "'avatar'" ||
                                        postBy.avatar === "avatar"
                                            ? NoUserImage
                                            : postBy.avatar
                                    }
                                    width={30}
                                    height={30}
                                />
                            }
                        >
                            <Typography fontSize={fontSize}>{postBy.username}</Typography>
                        </Tooltip>
                    </Box>
                </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                    <Typography fontSize={fontSize}>{price}</Typography>
                </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                    <Typography fontSize={fontSize}>
                        {progress}/{quantity}&nbsp;{measure}
                    </Typography>
                    <LinearProgress variant="determinate" value={quantityRatio} style={{ width: "80%" }} />
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Typography fontSize={fontSize}>{createdDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Box mb={2} />
                    {type === "trading" ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth={xsMatched ? true : false}
                            onClick={() => {
                                handleOnToggleModal();
                            }}
                        >
                            Đăng ký bán
                        </Button>
                    ) : type === "manage" ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth={xsMatched ? true : false}
                            onClick={() => {
                                changeCurrentRequestId(id);
                                changeSubmitType(
                                    transactionType === "buying" ? "confirmBuyingRequest" : "confirmSellingRequest"
                                );
                                fillRequest(id);
                            }}
                        >
                            Duyệt yêu cầu
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth={xsMatched ? true : false}
                            onClick={() => {
                                cookie.remove("pid");
                                cookie.set("pid", id);
                                const endPoint =
                                    transactionType === "buying"
                                        ? `/my_request/details/buying?id=${id}&type=manage`
                                        : `/my_request/details/selling?id=${id}&type=manage`;
                                router.push(endPoint);
                            }}
                        >
                            Xem chi tiết
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default BuyingRequestCard;
