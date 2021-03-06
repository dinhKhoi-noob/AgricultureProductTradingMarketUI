import { Box, Chip, Grid, Typography } from "@mui/material";
import { compareAsc, formatDistance, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useContext, useEffect, useState } from "react";
import {
    ModalProps,
    RequestContext,
    SubrequestResponseValueInitializer,
    SucceedTradingUserProps,
} from "../../../src/context/RequestContext";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import MessageBox from "../../../src/components/request/buying/MessageBox";
import { AuthContext } from "../../../src/context/AuthContext";
import ButtonGroupDetailsPage from "../../../src/components/request/buying/ButtonGroupSubrequestPage";
import RequestModal from "../../../src/components/request/buying/RequestModal";
import ConfirmationModal from "../../../src/components/layouts/ConfirmationModal";
import NewAddressModal from "../../../src/components/auth/NewAddressModal";
import Progress from "../../../src/components/layouts/Progress";
import socket from "../../../src/socket";
import { ChatContext } from "../../../src/context/ChatContext";
import NumberFormat from "react-number-format";

const SellingRequestForBuyingRequestDetails = () => {
    const {
        currentSubrequest,
        currentTargetRequest,
        subrequests,
        loadSpecificRequest,
        loadSpecificBuyingRequest,
        getAllSubrequest,
        changeModalInformation,
    } = useContext(RequestContext);
    const { userInfo, getUserInformation, renderUserAddress } = useContext(AuthContext);
    const { loadMessages } = useContext(ChatContext);
    const cookie = new Cookies();
    const router = useRouter();
    const [currentPid, setCurrentPid] = useState("");

    useEffect(() => {
        getAllSubrequest("buying");
        renderUserAddress();
        getUserInformation();
        const pid = typeof router.query["id"] === "string" ? router.query["id"] : cookie.get("pid");
        if (typeof pid === "string") {
            loadSpecificRequest(pid, true, "buying");
            setCurrentPid(pid);
        }
        return () => {
            socket.emit("leave:discuss", currentPid);
        };
    }, []);

    useEffect(() => {
        if (currentSubrequest.requestId && currentSubrequest.requestId !== "") {
            loadSpecificBuyingRequest(currentSubrequest.requestId);
        }
    }, [currentSubrequest]);

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

    return (
        <>
            <RequestModal type="selling" submitType="edit" />
            <ConfirmationModal />
            <NewAddressModal />
            <Progress />
            <Typography variant="h3" textAlign="center">
                Y??u c???u mua
            </Typography>
            <Grid container padding={6} justifyContent="space-between">
                <Grid item md={3.8} sm={12}>
                    <Typography variant="h5" textAlign="center">
                        Th??ng tin y??u c???u
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">M?? y??u c???u:</Typography>&nbsp;
                        <Typography>{currentSubrequest.id?.toUpperCase()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Y??u c???u t???i:</Typography>&nbsp;
                        <Typography>{currentSubrequest.customerName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">T??n s???n ph???m:</Typography>&nbsp;
                        <Typography>{currentSubrequest.specificProductName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Thu???c lo???i:</Typography>&nbsp;
                        <Typography>{currentSubrequest.productName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ng??y t???o:</Typography>&nbsp;
                        <Typography>
                            {formatDistanceToNow(new Date(currentSubrequest.createdDate), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ng??y giao h??ng:</Typography>&nbsp;
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
                            <Typography fontWeight="bold">H???t h???n duy???t sau:</Typography>&nbsp;
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
                        <Typography fontWeight="bold">Gi?? ????? ngh???:</Typography>&nbsp;
                        <Typography>
                            <NumberFormat
                                value={currentSubrequest.price}
                                displayType="text"
                                thousandSeparator={true}
                                suffix="VND"
                            />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">S??? l?????ng:</Typography>&nbsp;
                        <Typography>
                            <NumberFormat
                                value={currentSubrequest.quantity}
                                displayType="text"
                                thousandSeparator={true}
                                suffix={currentSubrequest.measure}
                            />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">T???ng c???ng:</Typography>&nbsp;
                        <Typography>
                            <NumberFormat
                                value={currentSubrequest.quantity * currentSubrequest.price}
                                displayType="text"
                                thousandSeparator={true}
                                suffix="VND"
                            />
                        </Typography>
                    </Box>
                    <Box mt={2} mb={2}>
                        <Typography fontWeight="bold">Giao ?????n:</Typography>
                        <Typography ml={2} mt={1}>
                            {currentSubrequest.address.split("!^!")[0]}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">T??nh tr???ng:</Typography>
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
                                            ? "Qu?? h???n ph?? duy???t"
                                            : "???? hu???"
                                        : currentSubrequest.status === "waiting"
                                        ? "??ang ch??? ph?? duy???t"
                                        : "???? hu???"
                                    : "???? ph?? duy???t"
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
                    <ButtonGroupDetailsPage
                        type="buying"
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
                        Trao ?????i th??ng tin
                    </Typography>
                    <MessageBox userId={userInfo.id} roomId={currentSubrequest.id} />
                </Grid>
            </Grid>
        </>
    );
};

export default SellingRequestForBuyingRequestDetails;
