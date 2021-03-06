import { Box, Button, Chip, Collapse, Grid, IconButton, IconButtonProps, styled, Typography } from "@mui/material";
import { formatDistance, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import {
    RequestContext,
    RequestImage,
    StatisticProps,
    SubrequestResponseValueInitializer,
} from "../../../src/context/RequestContext";
import { Carousel } from "react-responsive-carousel";
import NoThumbnailImage from "../../../public/assets/default-thumbnail.jpeg";
import Image from "next/image";
import { GridColDef, DataGrid, GridToolbar } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from "next/router";
import { AuthContext } from "../../../src/context/AuthContext";
import { compareAsc } from "date-fns";
import AddNewRequestModal from "../../../src/components/request/buying/AddNewRequestModal";
import ButtonGroupRequestPage from "../../../src/components/request/buying/ButtonGroupRequestPage";
import { ProductContext } from "../../../src/context/ProductContext";
import ConfirmationModal from "../../../src/components/layouts/ConfirmationModal";
import NewAddressModal from "../../../src/components/auth/NewAddressModal";
import Progress from "../../../src/components/layouts/Progress";
import NumberFormat from "react-number-format";

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

const SellingRequestDetails = () => {
    const cookie = new Cookies();
    const router = useRouter();
    const {
        currentTargetRequest,
        specificRequestImages,
        subrequestForSpecificRequest,
        getAllRequestImage,
        loadSpecificRequest,
    } = useContext(RequestContext);
    const { getProduct } = useContext(ProductContext);
    const { userInfo, getUserInformation, renderUserAddress } = useContext(AuthContext);
    const [unconfirmedRequestData, setUnconfirmedRequestData] = useState<any[]>([]);
    const [successRequestData, setSuccessRequestData] = useState<any[]>([]);
    const [refusedRequestData, setRefusedRequestData] = useState<any[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [statistic, setStatistic] = useState<StatisticProps>({
        fee: 0,
        avgPrice: 0,
        amount: 0,
        budget: 0,
    });
    const reRenderData = (type: "waiting" | "refused" | "success") => {
        console.log(subrequestForSpecificRequest);
        const requestList = subrequestForSpecificRequest
            .filter((request: SubrequestResponseValueInitializer) => {
                return request.status === type;
            })
            .map((request: SubrequestResponseValueInitializer) => {
                const { id, username, price, quantity, completedDateOrder, fee } = request;
                return {
                    id,
                    username,
                    price,
                    quantity,
                    completedDateOrder: formatDistanceToNow(new Date(completedDateOrder), {
                        addSuffix: true,
                        locale: vi,
                    }),
                    fee,
                };
            });
        switch (type) {
            case "waiting":
                setUnconfirmedRequestData(requestList);
                break;
            case "success":
                setSuccessRequestData(requestList);
                break;
            case "refused":
                setRefusedRequestData(requestList);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        getAllRequestImage("request", "selling");
        renderUserAddress();
        getProduct();
        getUserInformation();
        const pid = typeof router.query["id"] === "string" ? router.query["id"] : cookie.get("pid");
        if (typeof pid === "string") {
            loadSpecificRequest(pid, false, "selling");
        }
    }, []);

    useEffect(() => {
        reRenderData("success");
        reRenderData("waiting");
        reRenderData("refused");
    }, [subrequestForSpecificRequest]);

    useEffect(() => {
        if (successRequestData.length > 0) {
            let currentFee: number = 0;
            let currentBudget: number = 0;
            let currentAmount: number = 0;
            successRequestData.forEach(item => {
                const { fee, quantity, price } = item;
                currentFee += (fee / 100) * quantity * price;
                currentBudget += (1 + fee / 100) * quantity * price;
                currentAmount += quantity * price;
            });
            console.log(currentFee, currentBudget, currentAmount);
            setStatistic({ fee: currentFee, budget: currentBudget, amount: currentAmount, avgPrice: 0 });
        } else {
            setStatistic({ fee: 0, budget: 0, amount: 0, avgPrice: 0 });
        }
    }, [successRequestData]);

    const requestDataGridColumn: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "username", headerName: "Ng?????i y??u c???u", width: 150 },
        { field: "price", headerName: "Gi?? ????? xu???t", width: 100 },
        { field: "quantity", headerName: "S??? l?????ng", width: 100 },
        { field: "completedDateOrder", headerName: "Ng??y giao h??ng", width: 200 },
        {
            field: "view",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button variant="outlined" color="info">
                        Xem y??u c???u
                    </Button>
                );
            },
        },
    ];

    const {
        quantity,
        process,
        price,
        fee,
        specificProductName,
        id,
        productName,
        expiredDate,
        createdDate,
        isConfirmed,
        status,
        measure,
        description,
    } = currentTargetRequest;

    const priceIncludeFee = ((quantity + process) * price * (1 + fee / 100)) / (quantity + process);

    return (
        <>
            <ConfirmationModal />
            <AddNewRequestModal type="selling" submitType="edit" />
            <NewAddressModal />
            <Progress />
            <Typography variant="h3" textAlign="center">
                Y??u c???u b??n
            </Typography>
            <Grid container padding={6} justifyContent="space-between">
                <Grid item md={3.8} sm={12}>
                    <Typography variant="h4" textAlign="center">
                        Th??ng tin y??u c???u
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">M?? y??u c???u:</Typography>&nbsp;
                        <Typography>{id?.toUpperCase()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">T??n s???n ph???m:</Typography>&nbsp;
                        <Typography>{specificProductName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Thu???c lo???i:</Typography>&nbsp;
                        <Typography>{productName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ng??y t???o:</Typography>&nbsp;
                        <Typography>
                            {formatDistanceToNow(new Date(createdDate), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ng??y giao h??ng:</Typography>&nbsp;
                        <Typography>
                            {formatDistanceToNow(new Date(expiredDate), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </Typography>
                    </Box>
                    {compareAsc(
                        new Date(expiredDate).setHours(new Date(expiredDate).getHours() - 24),
                        new Date(Date.now())
                    ) === -1 ? (
                        <></>
                    ) : (
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">H???t h???n duy???t sau:</Typography>&nbsp;
                            <Typography>
                                {formatDistance(
                                    new Date(expiredDate).setHours(new Date(expiredDate).getHours() - 24),
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
                        <Typography fontWeight="bold">T??nh tr???ng duy???t:</Typography>
                        <Chip
                            label={
                                !isConfirmed
                                    ? compareAsc(
                                          new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1),
                                          new Date(Date.now())
                                      ) === -1
                                        ? status !== "cancel"
                                            ? "Qu?? h???n ph?? duy???t"
                                            : "???? hu???"
                                        : status !== "cancel"
                                        ? "??ang ch??? ph?? duy???t"
                                        : "???? hu???"
                                    : "???? ph?? duy???t"
                            }
                            color={
                                !isConfirmed
                                    ? compareAsc(
                                          new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1),
                                          new Date(Date.now())
                                      ) === -1
                                        ? "error"
                                        : "warning"
                                    : "success"
                            }
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">T??nh tr???ng y??u c???u:</Typography>
                        <Chip
                            label={
                                isConfirmed
                                    ? compareAsc(
                                          new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1),
                                          new Date(Date.now())
                                      ) === -1
                                        ? status !== "success"
                                            ? "???? ????ng"
                                            : "???? ????? s??? l?????ng"
                                        : status !== "success"
                                        ? "??ang th???c hi???n"
                                        : "???? ????? s??? l?????ng"
                                    : "Ch??a b???t ?????u"
                            }
                            color={
                                status !== "success"
                                    ? compareAsc(
                                          new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1),
                                          new Date(Date.now())
                                      ) === -1
                                        ? "error"
                                        : "warning"
                                    : "success"
                            }
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Gi?? ????? ngh???(ch??a t??nh ph??):</Typography>&nbsp;
                        <Typography>
                            <NumberFormat displayType="text" value={price} suffix="VND" thousandSeparator={true} />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Gi?? ????? ngh??? th???c t???:</Typography>&nbsp;
                        <Typography>
                            <NumberFormat
                                displayType="text"
                                value={Math.round(priceIncludeFee)}
                                suffix="VND"
                                thousandSeparator={true}
                            />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">S??? l?????ng:</Typography>&nbsp;
                        <Typography>
                            <NumberFormat
                                displayType="text"
                                value={quantity + process}
                                suffix={measure}
                                thousandSeparator={true}
                            />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ti???n tr??nh:</Typography>&nbsp;
                        <Typography>
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
                        </Typography>
                    </Box>
                    <Box mt={2} mb={2}>
                        <Typography fontWeight="bold">M?? t???:</Typography>
                        <Typography ml={2} mt={1}>
                            {description}
                        </Typography>
                    </Box>
                    <Button onClick={() => setExpanded(!expanded)}>
                        Xem chi ti???t
                        <ExpandMore
                            expand={expanded}
                            aria-expanded={expanded}
                            aria-label="show more"
                            className="float-right"
                        >
                            <ExpandMoreIcon color="primary" />
                        </ExpandMore>
                    </Button>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Typography variant="h6" textAlign="center">
                            S??? li???u th???c t???
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Ph?? th???c t???({fee}%):</Typography>&nbsp;
                            <Typography>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(statistic.fee)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <Box mt={2} mb={2}>
                            <Typography fontWeight="bold">T???ng gi?? tr??? th???c t??? c???a y??u c???u</Typography>&nbsp;
                            <Typography className="float-right">
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(statistic.budget)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <Box mt={2} mb={2}>
                            <Typography fontWeight="bold">Th???c nh???n th???c t??? c???a y??u c???u</Typography>&nbsp;
                            <Typography className="float-right">
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(statistic.amount)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <hr></hr>
                        <Typography variant="h6" textAlign="center">
                            S??? li???u ?????c t??nh
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Ph?? ?????c t??nh({fee}%):</Typography>&nbsp;
                            <Typography>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round((price * (quantity + process) * fee) / 100)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <Box mt={2} mb={2}>
                            <Typography fontWeight="bold">T???ng gi?? tr??? ?????c t??nh c???a y??u c???u</Typography>&nbsp;
                            <Typography className="float-right">
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(priceIncludeFee * (quantity + process))}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <Box mt={2} mb={2}>
                            <Typography fontWeight="bold">Th???c nh???n ?????c t??nh c???a y??u c???u</Typography>&nbsp;
                            <Typography className="float-right">
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(price * (quantity + process))}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <hr></hr>
                        <Typography variant="h6" textAlign="center">
                            Gi?? ????? ngh???
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Gi?? ????? ngh??? bao g???m ph??:</Typography>&nbsp;
                            <Typography>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(priceIncludeFee)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Gi?? ????? ngh??? t???i ??a:</Typography>&nbsp;
                            <Typography>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(priceIncludeFee * 1.1)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Gi?? ????? ngh??? t???i thi???u:</Typography>&nbsp;
                            <Typography>
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(priceIncludeFee * 0.9)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                    </Collapse>
                    <Box mt={2} mb={2}>
                        <Typography fontWeight="bold">H??nh ???nh minh ho???:</Typography>
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
                        <Typography fontWeight="bold">Giao ?????n:</Typography>
                        <Typography ml={2} mt={1}>
                            {currentTargetRequest.address.split("!^!")[0]}
                        </Typography>
                    </Box>
                    <ButtonGroupRequestPage
                        type="selling"
                        id={currentTargetRequest.id}
                        role={
                            currentTargetRequest.owner.id === userInfo.id
                                ? "owner"
                                : userInfo.role === "manager"
                                ? "manager"
                                : "customer"
                        }
                        isDated={
                            compareAsc(
                                new Date(currentTargetRequest.expiredDate).setHours(
                                    new Date(currentTargetRequest.expiredDate).getHours() - 24
                                ),
                                new Date(Date.now())
                            ) === -1
                                ? true
                                : false
                        }
                        status={
                            !currentTargetRequest.isConfirmed
                                ? currentTargetRequest.status === "cancel"
                                    ? "cancel"
                                    : "unconfirmed"
                                : "success"
                        }
                    />
                </Grid>
                <Grid item md={7.8} sm={12}>
                    <Typography variant="h4" textAlign="center" mb={4}>
                        ??ang ch??? duy???t
                    </Typography>
                    <DataGrid
                        getRowId={row => row.id}
                        rows={unconfirmedRequestData}
                        columns={requestDataGridColumn}
                        disableSelectionOnClick
                        autoHeight
                        pagination
                        onCellClick={row => {
                            if (row.field === "view") {
                                cookie.remove("pid");
                                cookie.set("pid", row.id);
                                router.push(`/my_request/details/buying_request_for_selling?id=${row.id}`);
                            }
                        }}
                        localeText={{
                            toolbarDensity: "Size",
                            toolbarDensityLabel: "Size",
                            toolbarDensityCompact: "Small",
                            toolbarDensityStandard: "Medium",
                            toolbarDensityComfortable: "Large",
                        }}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        rowsPerPageOptions={[5, 10, 15]}
                    ></DataGrid>
                    <Typography variant="h5" textAlign="center" mb={4}>
                        ???? duy???t
                    </Typography>
                    <DataGrid
                        getRowId={row => row.id}
                        rows={successRequestData}
                        columns={requestDataGridColumn}
                        disableSelectionOnClick
                        autoHeight
                        pagination
                        onCellClick={row => {
                            if (row.field === "view") {
                                cookie.remove("pid");
                                cookie.set("pid", row.id);
                                router.push(`/my_request/details/buying_request_for_selling?id=${row.id}`);
                            }
                        }}
                        localeText={{
                            toolbarDensity: "Size",
                            toolbarDensityLabel: "Size",
                            toolbarDensityCompact: "Small",
                            toolbarDensityStandard: "Medium",
                            toolbarDensityComfortable: "Large",
                        }}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        rowsPerPageOptions={[5, 10, 15]}
                    ></DataGrid>
                    <Typography variant="h5" textAlign="center" mb={4}>
                        ???? hu???
                    </Typography>
                    <DataGrid
                        getRowId={row => row.id}
                        rows={refusedRequestData}
                        columns={requestDataGridColumn}
                        disableSelectionOnClick
                        autoHeight
                        pagination
                        onCellClick={row => {
                            if (row.field === "view") {
                                cookie.remove("pid");
                                cookie.set("pid", row.id);
                                router.push(`/my_request/details/buying_request_for_selling?id=${row.id}`);
                            }
                        }}
                        localeText={{
                            toolbarDensity: "Size",
                            toolbarDensityLabel: "Size",
                            toolbarDensityCompact: "Small",
                            toolbarDensityStandard: "Medium",
                            toolbarDensityComfortable: "Large",
                        }}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        rowsPerPageOptions={[5, 10, 15]}
                    ></DataGrid>
                </Grid>
            </Grid>
        </>
    );
};

export default SellingRequestDetails;
