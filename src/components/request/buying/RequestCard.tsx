import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Grid,
    IconButton,
    IconButtonProps,
    LinearProgress,
    Typography,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { styled } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import {
    RequestContext,
    OwnerProps,
    SucceedTradingUserProps,
    SubrequestResponseValueInitializer,
    TransactionType,
} from "../../../context/RequestContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NoThumbnailImage from "../../../../public/assets/default-thumbnail.jpeg";
import Image from "next/image";
import { AuthContext } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import NumberFormat from "react-number-format";

interface RequestCardProps {
    id: string;
    type: TransactionType;
    productName: string;
    quantity: number;
    price: number;
    process: number;
    postBy: OwnerProps;
    measure: string;
    createdDate: Date;
    expiredDate: string;
    thumbnail: string[];
    description: string;
    user: SucceedTradingUserProps[];
    fee: number;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line no-unused-vars
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

const RequestCard = (props: RequestCardProps) => {
    const {
        id,
        postBy,
        productName,
        expiredDate,
        thumbnail,
        description,
        quantity,
        process,
        price,
        user,
        measure,
        type,
        fee,
    } = props;
    const actuallyPrice = Math.round((price * (quantity + process) * (1 + fee / 100)) / (quantity + process));
    const quantityRatio = (process / (quantity + quantity)) * 100;
    const router = useRouter();
    const cookie = new Cookies();
    const [expanded, setExpanded] = useState(false);
    const [subrequestId, setSubrequestId] = useState("");
    const {
        currentSellingRequest,
        subrequests,
        changeIsOpenModalStatus,
        changeModalInformation,
        changeCurrentSubrequest,
        loadSpecificRequest,
    } = useContext(RequestContext);
    const { userInfo } = useContext(AuthContext);
    const splittedUsername = postBy.username.split(" ");
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const requestIndex = subrequests.findIndex((request: SubrequestResponseValueInitializer) => {
            const { requestId, createdBy } = request;
            return requestId === id && createdBy === userInfo.id;
        });
        if (requestIndex > -1) {
            setSubrequestId(subrequests[requestIndex].id);
        }
    }, [subrequests]);

    const requestStatus = () => {
        const requestIndex = subrequests.findIndex((request: SubrequestResponseValueInitializer) => {
            const { requestId, createdBy } = request;
            return requestId === id && createdBy === userInfo.id;
        });
        if (requestIndex > -1) {
            return subrequests[requestIndex].status;
        }
        return null;
    };

    const handleOnToggleModal = () => {
        const modalInformation = {
            owner: {
                username: postBy.username,
                avatar: postBy.avatar,
                id: postBy.id,
            },
            quantity,
            process,
            title: productName,
            price,
            selledUser: user,
        };
        changeIsOpenModalStatus(true);
        changeModalInformation(modalInformation);
    };

    return (
        <Box m={1}>
            <Card sx={{ width: 320 }}>
                <CardHeader
                    avatar={
                        postBy.avatar === "" || postBy.avatar === "'avatar'" || !postBy.avatar ? (
                            <Avatar sx={{ bgcolor: red[500] }}>{splittedUsername[splittedUsername.length - 1]}</Avatar>
                        ) : (
                            <Avatar src={postBy.avatar} />
                        )
                    }
                    title={postBy.username}
                    subtitle={productName}
                />
                {thumbnail && thumbnail.length > 1 ? (
                    <Carousel showThumbs={false} showArrows={true} autoPlay={true} infiniteLoop={true} interval={8000}>
                        {thumbnail.map((image: string, index) => {
                            if (image && image.length > 0) {
                                return (
                                    <div>
                                        <img src={image} height="245px" className="object-fit-cover" />
                                    </div>
                                );
                            }
                            return <Image src={NoThumbnailImage} key={index} />;
                        })}
                    </Carousel>
                ) : (
                    <Image src={NoThumbnailImage} />
                )}
                <CardContent>
                    <Typography m={2} mr={0} ml={0}>
                        Mô tả: {description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" m={2} mr={0} ml={0}>
                        <Typography>Giá đề nghị:</Typography>
                        <NumberFormat displayType="text" value={actuallyPrice} suffix="VND" thousandSeparator={true} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" m={2} mr={0} ml={0}>
                        <Typography>Số lượng:</Typography>
                        <NumberFormat
                            displayType="text"
                            value={quantity + process}
                            suffix={measure}
                            thousandSeparator={true}
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" m={2} mr={0} ml={0}>
                        <Typography>Đã giao dịch được:</Typography>
                        <>
                            <NumberFormat
                                displayType="text"
                                value={process}
                                suffix={measure}
                                thousandSeparator={true}
                            />
                            /
                            <NumberFormat
                                displayType="text"
                                value={quantity + process}
                                suffix={measure}
                                thousandSeparator={true}
                            />
                        </>
                    </Box>
                    <LinearProgress variant="determinate" value={quantityRatio} style={{ width: "80%" }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center" m={2} mr={0} ml={0}>
                        <Typography>Hết hạn sau:</Typography>
                        <Typography>{expiredDate}</Typography>
                    </Box>
                </CardContent>
                <CardActions>
                    <Box display="flex" justifyContent="space-between">
                        {requestStatus() ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    const endPoint =
                                        type === "buying"
                                            ? `/my_request/details/selling_request_for_buying?id=${subrequestId}`
                                            : `/my_request/details/buying_request_for_selling?id=${subrequestId}`;
                                    cookie.remove("pid");
                                    cookie.set("pid", subrequestId);
                                    router.push(endPoint);
                                }}
                            >
                                Xem yêu cầu của bạn
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    loadSpecificRequest(id, false, type);
                                    changeCurrentSubrequest({ ...currentSellingRequest, id });
                                    handleOnToggleModal();
                                }}
                            >
                                Đăng ký {type === "buying" ? "bán" : "mua"}
                            </Button>
                        )}
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Box>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        {user.length > 0 ? (
                            user.map((user: SucceedTradingUserProps, index) => {
                                const splittedSelledUsername = user.username.split("");
                                return (
                                    <Grid container key={index}>
                                        <Grid item>
                                            {user.avatar === "" || user.avatar === "'avatar'" || !user.avatar ? (
                                                <Avatar sx={{ bgcolor: blue[500] }}>
                                                    {splittedSelledUsername[splittedSelledUsername.length - 1]}
                                                </Avatar>
                                            ) : (
                                                <Avatar src={user.avatar} />
                                            )}
                                        </Grid>
                                        <Grid item>{user.username}</Grid>
                                        <Grid item>
                                            Số lượng: &nbsp;<Typography>{user.quantity}</Typography>
                                        </Grid>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Typography>Chưa có giao dịch được thực hiện</Typography>
                        )}
                    </CardContent>
                </Collapse>
            </Card>
        </Box>
    );
};

export default RequestCard;
