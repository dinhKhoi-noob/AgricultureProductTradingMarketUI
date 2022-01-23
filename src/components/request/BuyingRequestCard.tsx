import { Box, Button, Grid, LinearProgress, Tooltip, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import NoUserImage from "../../../public/assets/no_user.jpg";
import { LayoutContext } from "../../context/LayoutContext";
import { BuyingRequestContext } from "../../context/BuyingRequestContext";
import { SelledUserProps, OwnerProps } from "../../context/BuyingRequestContext";

interface BuyingRequestCardProps {
    thumbnail: String;
    title: string;
    quantity: number;
    progress: number;
    postBy: OwnerProps;
    user: SelledUserProps[];
    price: number;
}

const BuyingRequestCard = (props: BuyingRequestCardProps) => {
    const { postBy, title, user, quantity, progress, price } = props;
    const quantityRatio = (progress / quantity) * 100;
    const { xsMatched, mdMatched, smMatched } = useContext(LayoutContext);
    const { changeIsOpenModalStatus, changeModalInformation } = useContext(BuyingRequestContext);
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
        <>
            <Grid container justifyContent="space-between" alignItems="center" mb={1} mt={1}>
                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                    <Image src={NoUserImage} width={imageSize} height={imageSize}></Image>
                </Grid>
                <Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
                    <Typography fontSize={fontSize}>{title}</Typography>
                </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                    <Box display="flex">
                        <Tooltip title={<Image src={NoUserImage} width={30} height={30} />}>
                            <Typography fontSize={fontSize}>{postBy.username}</Typography>
                        </Tooltip>
                    </Box>
                </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                    <Typography fontSize={fontSize}>{price}</Typography>
                </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
                    <Typography fontSize={fontSize}>
                        {progress}/{quantity}
                    </Typography>
                    <LinearProgress variant="determinate" value={quantityRatio} style={{ width: "80%" }} />
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Typography fontSize={fontSize}>30/12/2021</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Box mb={2} />
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth={xsMatched ? true : false}
                        style={{ fontSize }}
                        onClick={() => {
                            handleOnToggleModal();
                        }}
                    >
                        Đăng ký mua
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default BuyingRequestCard;
