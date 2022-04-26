import { Box, Button, Chip, Collapse, Grid, IconButton, IconButtonProps, styled, Typography } from "@mui/material";
import { compareAsc, formatDistance, formatDistanceToNow } from "date-fns";
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
import ButtonGroupRequestPage from "../../../src/components/request/buying/ButtonGroupRequestPage";
import AddNewRequestModal from "../../../src/components/request/buying/AddNewRequestModal";
import { ProductContext } from "../../../src/context/ProductContext";
import Progress from "../../../src/components/layouts/Progress";
import NewAddressModal from "../../../src/components/auth/NewAddressModal";
import ConfirmationModal from "../../../src/components/layouts/ConfirmationModal";
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

const BuyingRequestDetails = () => {
    const cookie = new Cookies();
    const router = useRouter();
    const {
        currentTargetRequest,
        specificRequestImages,
        subrequestForSpecificRequest,
        loadSpecificRequest,
        getAllRequestImage,
    } = useContext(RequestContext);
    const { userInfo, getUserInformation, renderUserAddress } = useContext(AuthContext);
    const { getProduct } = useContext(ProductContext);
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
    const {
        id,
        address,
        createdDate,
        description,
        expiredDate,
        fee,
        isConfirmed,
        measure,
        owner,
        price,
        process,
        productName,
        quantity,
        specificProductName,
        status,
    } = currentTargetRequest;
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
        getAllRequestImage("request", "buying");
        renderUserAddress();
        getProduct();
        getUserInformation();
        const pid = typeof router.query["id"] === "string" ? router.query["id"] : cookie.get("pid");
        if (typeof pid === "string") {
            loadSpecificRequest(pid, false, "buying");
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
            console.log(successRequestData);
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
        { field: "username", headerName: "Người yêu cầu", width: 150 },
        { field: "price", headerName: "Giá đề xuất", width: 100 },
        { field: "quantity", headerName: "Số lượng", width: 100 },
        { field: "completedDateOrder", headerName: "Ngày giao hàng", width: 200 },
        {
            field: "view",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button onClick={() => {}} variant="outlined" color="warning">
                        Xem yêu cầu
                    </Button>
                );
            },
        },
    ];

    const priceIncludeFee = ((quantity + process) * price * (1 + fee / 100)) / (quantity + process);

    return (
        <>
            <AddNewRequestModal type="buying" submitType="edit" />
            <NewAddressModal />
            <Progress />
            <ConfirmationModal />
            <Typography variant="h3" textAlign="center">
                Yêu cầu mua
            </Typography>
            <Grid container padding={6} justifyContent="space-between">
                <Grid item md={3.8} sm={12}>
                    <Typography variant="h5" textAlign="center">
                        Thông tin yêu cầu
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Mã yêu cầu:</Typography>&nbsp;
                        <Typography>{id?.toUpperCase()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Tên sản phẩm:</Typography>&nbsp;
                        <Typography>{specificProductName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Thuộc loại:</Typography>&nbsp;
                        <Typography>{productName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ngày tạo:</Typography>&nbsp;
                        <Typography>
                            {formatDistanceToNow(new Date(createdDate), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Ngày giao hàng:</Typography>&nbsp;
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
                            <Typography fontWeight="bold">Hết hạn duyệt sau:</Typography>&nbsp;
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
                        <Typography fontWeight="bold">Tình trạng duyệt:</Typography>
                        <Chip
                            label={
                                !isConfirmed
                                    ? compareAsc(
                                          new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1),
                                          new Date(Date.now())
                                      ) === -1
                                        ? status !== "cancel"
                                            ? "Quá hạn phê duyệt"
                                            : "Đã huỷ"
                                        : status !== "cancel"
                                        ? "Đang chờ phê duyệt"
                                        : "Đã huỷ"
                                    : "Đã phê duyệt"
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
                        <Typography fontWeight="bold">Tình trạng yêu cầu:</Typography>
                        <Chip
                            label={
                                isConfirmed
                                    ? compareAsc(
                                          new Date(expiredDate).setDate(new Date(expiredDate).getDate() - 1),
                                          new Date(Date.now())
                                      ) === -1
                                        ? status !== "success"
                                            ? "Đã đóng"
                                            : "Đã đủ số lượng"
                                        : status !== "success"
                                        ? "Đang thực hiện"
                                        : "Đã đủ số lượng"
                                    : "Chưa bắt đầu"
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
                        <Typography fontWeight="bold">Giá đề nghị:</Typography>&nbsp;
                        <Typography>
                            <NumberFormat displayType="text" value={price} suffix="VND" thousandSeparator={true} />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Số lượng:</Typography>&nbsp;
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
                        <Typography fontWeight="bold">Tiến trình:</Typography>&nbsp;
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
                                value={Math.abs(quantity + process)}
                                suffix={measure}
                                thousandSeparator={true}
                            />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Phí({fee}%):</Typography>&nbsp;
                        <Typography>
                            <NumberFormat
                                displayType="text"
                                value={Math.round((price * quantity * fee) / 100)}
                                suffix="VND"
                                thousandSeparator={true}
                            />
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                        <Typography fontWeight="bold">Giá đề nghị bao gồm phí:</Typography>&nbsp;
                        <Typography>
                            <NumberFormat
                                displayType="text"
                                value={Math.round(priceIncludeFee)}
                                suffix="VND"
                                thousandSeparator={true}
                            />
                        </Typography>
                    </Box>
                    <Box mt={2} mb={2}>
                        <Typography fontWeight="bold">Mô tả:</Typography>
                        <Typography ml={2} mt={1}>
                            {description}
                        </Typography>
                    </Box>
                    <Button onClick={() => setExpanded(!expanded)}>
                        Xem chi tiết
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
                            Số liệu thực tế
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Phí thực tế({fee}%):</Typography>&nbsp;
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
                            <Typography fontWeight="bold">Tổng giá trị thực tế của yêu cầu</Typography>&nbsp;
                            <Typography className="float-right">
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(statistic.amount)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <Box mt={2} mb={2}>
                            <Typography fontWeight="bold">Thực chi thực tế của yêu cầu</Typography>&nbsp;
                            <Typography className="float-right">
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(statistic.budget)}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <hr></hr>
                        <Typography variant="h6" textAlign="center">
                            Số liệu ước tính
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Phí ước tính({fee}%):</Typography>&nbsp;
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
                            <Typography fontWeight="bold">Tổng giá trị ước tính của yêu cầu</Typography>&nbsp;
                            <Typography className="float-right">
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(price * (quantity + process))}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <Box mt={2} mb={2}>
                            <Typography fontWeight="bold">Thực chi ước tính của yêu cầu</Typography>&nbsp;
                            <Typography className="float-right">
                                <NumberFormat
                                    displayType="text"
                                    value={Math.round(priceIncludeFee * (quantity + process))}
                                    suffix="VND"
                                    thousandSeparator={true}
                                />
                            </Typography>
                        </Box>
                        <hr></hr>
                        <Typography variant="h6" textAlign="center">
                            Giá đề nghị
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
                            <Typography fontWeight="bold">Giá đề nghị bao gồm phí:</Typography>&nbsp;
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
                            <Typography fontWeight="bold">Giá đề nghị tối đa:</Typography>&nbsp;
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
                            <Typography fontWeight="bold">Giá đề nghị tối thiểu:</Typography>&nbsp;
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
                            {address.split("!^!")[0]}
                        </Typography>
                    </Box>
                    <ButtonGroupRequestPage
                        type="buying"
                        id={id}
                        role={owner.id === userInfo.id ? "owner" : userInfo.role === "manager" ? "manager" : "customer"}
                        isDated={
                            compareAsc(
                                new Date(expiredDate).setHours(new Date(expiredDate).getHours() - 24),
                                new Date(Date.now())
                            ) === -1
                                ? true
                                : false
                        }
                        status={!isConfirmed ? (status === "cancel" ? "cancel" : "unconfirmed") : "success"}
                    />
                </Grid>
                <Grid item md={7.8} sm={12}>
                    <Typography variant="h5" textAlign="center" mb={4}>
                        Đang chờ duyệt
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
                                router.push(`/my_request/details/selling_request_for_buying?id=${row.id}`);
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
                        Đã duyệt
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
                                router.push(`/my_request/details/selling_request_for_buying?id=${row.id}`);
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
                        Đã huỷ
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
                                router.push(`/my_request/details/selling_request_for_buying?id=${row.id}`);
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

export default BuyingRequestDetails;
