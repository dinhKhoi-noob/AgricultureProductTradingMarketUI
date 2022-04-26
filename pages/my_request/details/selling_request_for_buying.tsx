/* eslint-disable camelcase */
import { Box, Button, Chip, Grid, Input, Typography } from "@mui/material";
import { compareAsc, formatDistance, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import React, { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import {
    ModalProps,
    RequestContext,
    RequestImage,
    SubrequestResponseValueInitializer,
    SucceedTradingUserProps,
} from "../../../src/context/RequestContext";
import { Carousel } from "react-responsive-carousel";
import NoThumbnailImage from "../../../public/assets/default-thumbnail.jpeg";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { AuthContext } from "../../../src/context/AuthContext";
import socket from "../../../src/socket";
import { ChatContext, MessageValueResponseInitializer } from "../../../src/context/ChatContext";
import { RiImageAddFill } from "react-icons/ri";
import { UploadFileContext } from "../../../src/context/UploadFileContext";
import { FiSend } from "react-icons/fi";
import { LayoutContext } from "../../../src/context/LayoutContext";
import ButtonGroupDetailsPage from "../../../src/components/request/buying/ButtonGroupSubrequestPage";
import RequestModal from "../../../src/components/request/buying/RequestModal";
import ConfirmationModal from "../../../src/components/layouts/ConfirmationModal";
import NewAddressModal from "../../../src/components/auth/NewAddressModal";
import Progress from "../../../src/components/layouts/Progress";

const SellingRequestForBuyingRequestDetails = () => {
    const {
        currentSubrequest,
        specificRequestImages,
        currentTargetRequest,
        subrequests,
        loadSpecificRequest,
        loadSpecificBuyingRequest,
        getAllSubrequest,
        getAllRequestImage,
        changeModalInformation,
    } = useContext(RequestContext);
    const { userInfo, getUserInformation, renderUserAddress } = useContext(AuthContext);
    const { addNewMessage, loadMessages, messages, haveNewMessage } = useContext(ChatContext);
    const { changeFilesArray } = useContext(UploadFileContext);
    const { changeSnackbarValues } = useContext(LayoutContext);
    const [currentPid, setCurrentPid] = useState("");
    const [message, setMessage] = useState("");
    const cookie = new Cookies();
    const router = useRouter();
    const chatSheetRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatSheetRef.current?.scrollTo({ behavior: "smooth", top: chatSheetRef.current.scrollHeight });
    };

    useEffect(() => {
        const { owner, price, process, quantity, specificProductName, id } = currentTargetRequest;
        console.log(currentTargetRequest, subrequests);
        const succeededSubrequest = subrequests
            .filter((request: SubrequestResponseValueInitializer) => {
                return request.requestId === id;
            })
            .map((request: SubrequestResponseValueInitializer) => {
                const { avatar, id, username, quantity } = request;
                if (request.status === "success") {
                    const temporaryData: SucceedTradingUserProps = {
                        avatar,
                        id,
                        username,
                        quantity,
                    };
                    return temporaryData;
                }
            });
        const modalValues: ModalProps = {
            owner,
            price,
            process,
            quantity,
            selledUser:
                typeof succeededSubrequest && succeededSubrequest.length > 0 && succeededSubrequest[0] !== undefined
                    ? (succeededSubrequest as SucceedTradingUserProps[])
                    : [],
            title: specificProductName,
        };
        console.log(modalValues);
        changeModalInformation(modalValues);
    }, [currentTargetRequest, subrequests]);

    useEffect(() => {
        getAllRequestImage("subrequest", "selling");
        getAllSubrequest("selling");
        renderUserAddress();
        getUserInformation();
        const pid = typeof router.query["id"] === "string" ? router.query["id"] : cookie.get("pid");
        console.log(pid, router.basePath);
        if (typeof pid === "string") {
            loadSpecificRequest(pid, true, "selling");
            setCurrentPid(pid);
        }
        return () => {
            socket.emit("leave:discuss", currentPid);
        };
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.id !== "" && currentPid !== "" && currentSubrequest.createdBy !== "") {
            console.log(userInfo, currentPid);
            socket.auth = { uid: userInfo.id };
            socket.connect();
            socket.emit("join:discuss", {
                roomId: currentPid,
                firstUser: userInfo.id,
                secondUser: currentSubrequest.createdBy,
                userId: userInfo.username,
            });
            loadMessages(userInfo.id, currentPid);
            loadSpecificBuyingRequest(currentSubrequest.requestId);
        }
    }, [userInfo, currentSubrequest]);

    useEffect(() => {
        socket.on("newMessage:error", result => {
            console.log(result);
        });
        setMessage("");
        socket.off("newMessage:success").on("newMessage:success", result => {
            if (router.basePath.includes("/my_request/details/selling_request_for_buying")) {
                changeSnackbarValues({
                    content: "Bạn có tin nhắn trao đổi từ đơn hàng " + currentPid,
                    isToggle: true,
                    type: "info",
                    link: "/my_request/details/selling_request_for_buying?id=" + currentPid,
                });
            }
            loadMessages(userInfo.id, currentPid);
            return;
        });
        loadMessages(userInfo.id, currentPid);
    }, [haveNewMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const reRenderMessages = () => {
        return (
            <Box style={{ backgroundColor: "#eee", height: "90%" }} className="scrollable" ref={chatSheetRef} pb={4}>
                {messages.map((message: MessageValueResponseInitializer, index) => {
                    const { content, sentBy, dateSent } = message;
                    return (
                        <Box key={index} className={sentBy === userInfo.id ? "message-right" : "message-left"}>
                            <Typography variant="caption">
                                {formatDistanceToNow(new Date(dateSent), { addSuffix: true, locale: vi })}
                            </Typography>
                            <Box className={sentBy === userInfo.id ? "own-message" : "other-message"}>
                                <Typography>{content}</Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    const changeMessageInput = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        setMessage(target.value);
    };

    const handleChangeMessageImages = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            changeFilesArray(files);
        }
    };

    const postNewMessage = (event: SyntheticEvent) => {
        event.preventDefault();
        console.log(message, currentPid, userInfo.id);
        addNewMessage({ content: message, uid: userInfo.id }, currentPid);
    };

    return (
        <>
            <RequestModal type="buying" submitType="edit" />
            <ConfirmationModal />
            <NewAddressModal />
            <Progress />
            <Typography variant="h3" textAlign="center">
                Yêu cầu bán
            </Typography>
            <Grid container padding={6} justifyContent="space-between">
                <Grid item md={3.8} sm={12}>
                    <Typography variant="h5" textAlign="center">
                        Thông tin yêu cầu
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Mã yêu cầu:</Typography>&nbsp;
                        <Typography>{currentSubrequest.id?.toUpperCase()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Khách hàng:</Typography>&nbsp;
                        <Typography>{currentSubrequest.customerName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Tên sản phẩm:</Typography>&nbsp;
                        <Typography>{currentSubrequest.specificProductName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Thuộc loại:</Typography>&nbsp;
                        <Typography>{currentSubrequest.productName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ngày tạo:</Typography>&nbsp;
                        <Typography>
                            {formatDistanceToNow(new Date(currentSubrequest.createdDate), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ngày giao hàng:</Typography>&nbsp;
                        <Typography>
                            {formatDistanceToNow(new Date(currentSubrequest.completedDateOrder), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </Typography>
                    </Box>
                    {compareAsc(
                        new Date(currentSubrequest.completedDateOrder).setHours(
                            new Date(currentSubrequest.completedDateOrder).getHours() - 12
                        ),
                        new Date(Date.now())
                    ) === -1 ? (
                        <></>
                    ) : (
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Hết hạn duyệt sau:</Typography>&nbsp;
                            <Typography>
                                {formatDistance(
                                    new Date(currentSubrequest.completedDateOrder).setHours(
                                        new Date(currentSubrequest.completedDateOrder).getHours() - 12
                                    ),
                                    new Date(Date.now()),
                                    {
                                        addSuffix: true,
                                        locale: vi,
                                    }
                                )}
                            </Typography>
                        </Box>
                    )}
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Giá đề nghị:</Typography>&nbsp;
                        <Typography>{currentSubrequest.price}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Số lượng:</Typography>&nbsp;
                        <Typography>
                            {currentSubrequest.quantity}
                            {currentSubrequest.measure}
                        </Typography>
                    </Box>
                    <Box mt={2} mb={2}>
                        <Typography fontWeight="bold">Mô tả:</Typography>
                        <Typography ml={2} mt={1}>
                            {currentSubrequest.description}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Tình trạng:</Typography>
                        <Chip
                            label={
                                currentSubrequest.status !== "success"
                                    ? compareAsc(
                                          new Date(currentSubrequest.completedDateOrder).setHours(
                                              new Date(currentSubrequest.completedDateOrder).getHours() - 12
                                          ),
                                          new Date(Date.now())
                                      ) === -1
                                        ? currentSubrequest.status === "waiting"
                                            ? "Quá hạn phê duyệt"
                                            : "Đã huỷ"
                                        : currentSubrequest.status === "waiting"
                                        ? "Đang chờ phê duyệt"
                                        : "Đã huỷ"
                                    : "Đã phê duyệt"
                            }
                            color={
                                currentSubrequest.status !== "success"
                                    ? compareAsc(
                                          new Date(currentSubrequest.completedDateOrder).setHours(
                                              new Date(currentSubrequest.completedDateOrder).getHours() - 12
                                          ),
                                          new Date(Date.now())
                                      ) === -1
                                        ? "error"
                                        : "warning"
                                    : "success"
                            }
                        />
                    </Box>
                    <Box mt={2} mb={2}>
                        <Typography fontWeight="bold">Hình ảnh minh hoạ:</Typography>
                        <Box mt={2} mb={2}></Box>
                        {specificRequestImages.length > 0 ? (
                            <Carousel
                                width="100%"
                                showThumbs={false}
                                showArrows={true}
                                autoPlay={true}
                                infiniteLoop={true}
                                interval={8000}
                            >
                                {specificRequestImages.map((image: RequestImage, index) => {
                                    if (image.url && image.url.length > 0) {
                                        return (
                                            <div>
                                                <img src={image.url} height="245px" className="object-fit-cover" />
                                            </div>
                                        );
                                    }
                                    return <Image src={NoThumbnailImage} key={index} />;
                                })}
                            </Carousel>
                        ) : (
                            <></>
                        )}
                    </Box>
                    <Box mt={2} mb={2}>
                        <Typography fontWeight="bold">Giao đến:</Typography>
                        <Typography ml={2} mt={1}>
                            {currentSubrequest.address.split("!^!")[0]}
                        </Typography>
                    </Box>
                    <ButtonGroupDetailsPage
                        type="selling"
                        id={currentSubrequest.id}
                        role={
                            currentSubrequest.createdBy === userInfo.id
                                ? "owner"
                                : userInfo.id === currentTargetRequest.owner.id
                                ? "manager"
                                : "customer"
                        }
                        isDated={
                            compareAsc(
                                new Date(currentSubrequest.completedDateOrder).setHours(
                                    new Date(currentSubrequest.completedDateOrder).getHours() - 12
                                ),
                                new Date(Date.now())
                            ) === -1
                                ? true
                                : false
                        }
                        status={
                            currentSubrequest.status !== "success"
                                ? currentSubrequest.status === "refused"
                                    ? "refused"
                                    : "unconfirmed"
                                : "success"
                        }
                    />
                </Grid>
                <Grid item md={7.8} sm={12} style={{ width: "100%" }}>
                    <Typography variant="h5" textAlign="center">
                        Trao đổi thông tin
                    </Typography>
                    <Box display="flex" flexDirection="column" height="40rem">
                        {reRenderMessages()}
                        <form
                            style={{ height: "10%" }}
                            onSubmit={event => {
                                postNewMessage(event);
                            }}
                        >
                            <Box display="flex" alignItems="center">
                                <Input
                                    style={{ width: "90%" }}
                                    value={message}
                                    onChange={event => {
                                        changeMessageInput(event);
                                    }}
                                ></Input>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <input
                                            accept="image/*"
                                            multiple
                                            style={{ display: "none" }}
                                            id="raised-button-message"
                                            type="file"
                                            onChange={event => {
                                                handleChangeMessageImages(event);
                                            }}
                                        />
                                        <label htmlFor="raised-button-message">
                                            <RiImageAddFill fontSize={25} />
                                        </label>
                                    </Box>
                                    <Button variant="text" type="submit">
                                        <FiSend fontSize={25} />
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default SellingRequestForBuyingRequestDetails;
