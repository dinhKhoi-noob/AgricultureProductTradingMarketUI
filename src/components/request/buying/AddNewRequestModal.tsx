/* eslint-disable react/no-children-prop */
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    ImageList,
    ImageListItem,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import Image from "next/image";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { RequestContext, TransactionType } from "../../../context/RequestContext";
import { LayoutContext } from "../../../context/LayoutContext";
import { ProductContext, ProductValueInitializer } from "../../../context/ProductContext";
import { UploadFileContext } from "../../../context/UploadFileContext";
import NumberFormat from "react-number-format";

type InputTypeEvent = "price" | "desc" | "quantity" | "measure" | "address" | "title";

interface AddNewRequestModalProps {
    type: TransactionType;
    submitType: "edit" | "create";
}

const AddNewRequestModal = ({ type, submitType }: AddNewRequestModalProps) => {
    const {
        isToggleCreateNewRequestModal,
        newRequest,
        changeToggleCreateNewRequestModal,
        changeNewRequestValue,
        resetField,
        changeTransactionAddress,
        renderTransactionAddressSelector,
        changeToggleOnAddNewAddressModalStatus,
    } = useContext(RequestContext);
    const { changeConfirmationModalValues, changeSnackbarValues } = useContext(LayoutContext);
    const { fileNames, currentFilePaths, changeFilesArray, changeCurrentFilePaths } = useContext(UploadFileContext);
    const { productList } = useContext(ProductContext);
    const currentDate = new Date(Date.now());
    const defaultShippingDate = new Date(currentDate.setDate(currentDate.getDate() + 2));
    const [currentFee, setCurrentFee] = useState(10);
    const { product, price, quantity, desc, measure, expiredDate, productName, address, fee } = newRequest;
    useEffect(() => {
        if (!fileNames || fileNames?.length === 0) {
            changeFilesArray(undefined);
            return;
        }
        const imageFiles = Array.prototype.slice.call(fileNames);
        const temporaryFilePaths = imageFiles.map((item: File) => {
            const objectURL = URL.createObjectURL(item);
            return objectURL;
        });
        changeCurrentFilePaths(temporaryFilePaths);
        return () => {
            currentFilePaths.forEach((item: string) => {
                URL.revokeObjectURL(item);
            });
            changeCurrentFilePaths([]);
        };
    }, [fileNames]);

    useEffect(() => {
        const total = quantity * price;
        if (total < 100000) {
            setCurrentFee(10);
        }
        if (total < 500000 && total >= 100000) {
            setCurrentFee(8);
        }
        if (total < 1000000 && total >= 500000) {
            setCurrentFee(7);
        }
        if (total < 5000000 && total >= 1000000) {
            setCurrentFee(6);
        }
        if (total >= 5000000) {
            setCurrentFee(5);
        }
    }, [quantity, price]);

    useEffect(() => {
        changeNewRequestValue({ ...newRequest, fee: currentFee });
    }, [currentFee]);

    const selectTransactionAddress = (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value !== "default") {
            changeTransactionAddress(event.target.value);
            changeNewRequestValue({ ...newRequest, address: event.target.value });
        }
    };

    const handleChangeImages = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files && files?.length > 4) {
            changeSnackbarValues({
                content: "Vượt quá giới hạn hình ảnh cho phép",
                isToggle: true,
                type: "error",
            });
            return;
        }
        if (files) {
            changeFilesArray(files);
        }
    };

    const renderProductSelector = () => {
        return productList.map((product: ProductValueInitializer, index) => {
            const { id, title } = product;
            return (
                <MenuItem value={id} key={index}>
                    {title}
                </MenuItem>
            );
        });
    };

    const pickDate = (value: Date | null) => {
        changeNewRequestValue({ ...newRequest, expiredDate: value ? value : new Date(Date.now()) });
    };

    const handleOnChangeInputField = (event: SyntheticEvent, eventType: InputTypeEvent, type?: TransactionType) => {
        const target = event.target as HTMLInputElement;
        switch (eventType) {
            case "price":
                changeNewRequestValue({ ...newRequest, price: parseInt(target.value) });
                break;
            case "quantity":
                changeNewRequestValue({ ...newRequest, quantity: parseInt(target.value) });
                break;
            case "desc":
                changeNewRequestValue({ ...newRequest, desc: target.value });
                break;
            case "measure":
                changeNewRequestValue({ ...newRequest, measure: target.value });
                break;
            case "title":
                changeNewRequestValue({ ...newRequest, productName: target.value });
                break;
            default:
                return;
        }
    };

    const selectProduct = (event: SelectChangeEvent) => {
        changeNewRequestValue({ ...newRequest, product: event.target.value });
    };

    const createNewBuyingRequest = (event: SyntheticEvent) => {
        event.preventDefault();
        if (
            !product ||
            !price ||
            !quantity ||
            !desc ||
            !measure ||
            !expiredDate ||
            product === "" ||
            price === 0 ||
            quantity === 0 ||
            desc === "" ||
            measure === "" ||
            expiredDate < new Date(defaultShippingDate.setHours(defaultShippingDate.getHours() - 1))
        ) {
            console.log(expiredDate, new Date(defaultShippingDate.setHours(defaultShippingDate.getHours() - 1)));
            changeSnackbarValues({
                content: "Thông tin không hợp lệ, vui lòng thử lại !",
                type: "error",
                isToggle: true,
            });
            return;
        }
        changeConfirmationModalValues({
            title: `Bạn chắc chắn muốn tạo một yêu cầu ${
                type === "buying" ? "mua" : "bán"
            } nông sản mới với những thông tin này ? Bạn sẽ không thể chỉnh sửa thông tin khi người quản lý duyệt yêu cầu này!`,
            isToggle: true,
            type: type === "buying" ? "newBuyingRequest" : "newSellingRequest",
        });
    };

    const handleUpdateRequest = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            title: "Bạn chắc chắn muốn thay đổi thông tin của yêu cầu này ?",
            isToggle: true,
            type: type === "buying" ? "updateBuyingRequest" : "updateSellingRequest",
        });
    };

    const renderImageReview = () => {
        if (currentFilePaths.length > 0) {
            return (
                <>
                    <ImageList>
                        {currentFilePaths.map((imageSrc: string, index) => {
                            return (
                                <ImageListItem key={index}>
                                    <Image src={`${imageSrc}`} width="164px" height="164px" />
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                    <Box mt={2} mb={2} />
                    <input
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        id="raised-button-file"
                        type="file"
                        onChange={event => {
                            handleChangeImages(event);
                        }}
                    />
                    <Button variant="contained" color="warning">
                        <label htmlFor="raised-button-file">Chọn ảnh khác</label>
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <input
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        id="raised-button-file"
                        type="file"
                        onChange={event => {
                            handleChangeImages(event);
                        }}
                    />
                    <label htmlFor="raised-button-file">
                        <Box
                            width="100%"
                            height="300px"
                            display="flex"
                            p={3}
                            flexDirection="column"
                            justifyContent="space-around"
                            alignItems="center"
                            border="2px dotted"
                        >
                            <Typography variant="caption" fontStyle="italic">
                                (Chọn nhiều nhất 4 ảnh)
                            </Typography>
                            <RiImageAddFill fontSize={100} opacity={0.4} />
                        </Box>
                    </label>
                </>
            );
        }
    };

    return (
        <Modal
            open={isToggleCreateNewRequestModal}
            onClose={() => {
                changeToggleCreateNewRequestModal(false);
                resetField(type);
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="product-type-modal scrollable" p={4} pr={2} pl={2}>
                <Typography variant="h5" component="h2" textAlign="center">
                    Yêu cầu {type === "buying" ? "mua" : "bán"} nông sản mới
                </Typography>
                <Box mt={4} mb={4} />
                <form
                    onSubmit={event => {
                        submitType === "edit" ? handleUpdateRequest(event) : createNewBuyingRequest(event);
                    }}
                >
                    <FormLabel children={<Typography>Tên loại nông sản / sản phẩm nông nghiệp(*)</Typography>} />
                    <Box mt={2} mb={2} />
                    <FormControl fullWidth>
                        <InputLabel id="product-type-selector">Chọn</InputLabel>
                        <Select
                            labelId="product-type-selector"
                            id="product-type-selector-select"
                            value={product}
                            onChange={event => {
                                selectProduct(event);
                            }}
                        >
                            {renderProductSelector()}
                        </Select>
                    </FormControl>
                    <Box mt={2} mb={2} />
                    <FormLabel htmlFor="product-price" children={<Typography>Tên nông sản / sản phẩm(*)</Typography>} />
                    <TextField
                        id="product-title"
                        fullWidth
                        helperText="Tên nông sản không được để trống"
                        autoComplete="off"
                        onChange={event => {
                            handleOnChangeInputField(event, "title");
                        }}
                        value={productName}
                    />
                    <Box mt={2} mb={2} />
                    <FormLabel htmlFor="product-price" children={<Typography>Giá đề nghị(*)</Typography>} />
                    <TextField
                        id="product-price"
                        type="number"
                        fullWidth
                        helperText="Giá đề nghị sẽ cho khách hàng biết được mức giá hợp lý có thể đề nghị"
                        onChange={event => {
                            handleOnChangeInputField(event, "price");
                        }}
                        value={price}
                    />
                    <Box mt={2} mb={2} />
                    <Grid display="flex" container>
                        <Grid item md={9}>
                            <FormLabel htmlFor="product-quantity" children={<Typography>Số lượng(*)</Typography>} />
                            <TextField
                                id="product-quantity"
                                type="number"
                                fullWidth
                                helperText="Số lượng mua phải lớn hơn 0 và chia hết cho 5"
                                onChange={event => {
                                    handleOnChangeInputField(event, "quantity", type);
                                }}
                                value={quantity}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <FormLabel htmlFor="product-quantity-type" children={<Typography>Đơn vị(*)</Typography>} />
                            <TextField
                                id="product-quantity-type"
                                fullWidth
                                autoComplete="off"
                                onChange={event => {
                                    handleOnChangeInputField(event, "measure");
                                }}
                                value={measure}
                            />
                        </Grid>

                        <Box mt={2} mb={2} display="flex">
                            <Tooltip
                                title={
                                    <Typography variant="caption" fontStyle="italic" style={{ opacity: 0.6 }}>
                                        10% cho yêu cầu với tổng giá trị ít hơn 100.000VND <br />
                                        8% cho yêu cầu với tổng giá trị từ 100.000VND đến 500.00VND
                                        <br />
                                        7% cho yêu cầu với tổng giá trị từ 500.000VND đến 1.000.000VND
                                        <br />
                                        6% cho yêu cầu với tổng giá trị từ 1.000.000VND đến 5.000.000
                                        <br />
                                        5% cho yêu cầu với tổng giá trị từ 5.000.000VND trở đi
                                    </Typography>
                                }
                            >
                                <Typography>Phí đóng gói / vận chuyển (%):</Typography>
                            </Tooltip>
                            &nbsp;
                            <Typography>{fee ? fee : 10}%</Typography>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Phí (thành tiền):</Typography>
                            <NumberFormat
                                value={Math.round((quantity * price * fee) / 100)}
                                thousandSeparator={true}
                                style={{ fontSize: "20px" }}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Tổng giá trị ước tính theo giá đề nghị:</Typography>
                            <NumberFormat
                                displayType="text"
                                value={Math.round(quantity * price * (1 + fee / 100))}
                                thousandSeparator={true}
                                style={{ fontSize: "20px" }}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Thực nhận ước tính theo giá đề nghị:</Typography>
                            <NumberFormat
                                displayType="text"
                                value={quantity * price}
                                style={{ fontSize: "20px" }}
                                thousandSeparator={true}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Giá đề nghị đã bao gồm phí:</Typography>
                            <NumberFormat
                                displayType="text"
                                value={Math.round(quantity * price * (1 + fee / 100)) / quantity}
                                style={{ fontSize: "20px" }}
                                thousandSeparator={true}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Giá tối đa khách hàng có thể đề nghị:</Typography>
                            <Typography
                                variant="caption"
                                fontStyle="italic"
                                p={2}
                                pt={0}
                                pb={0}
                                style={{ opacity: 0.6 }}
                            >
                                Giá đề nghị đã bao gồm phí + 10%
                            </Typography>
                            <NumberFormat
                                displayType="text"
                                value={
                                    Math.round((quantity * price * (1 + fee / 100)) / quantity) +
                                    Math.round(((quantity * price * (1 + fee / 100)) / quantity / 100) * 10)
                                }
                                style={{ fontSize: "20px" }}
                                thousandSeparator={true}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Giá tối thiểu khách hàng có thể đề nghị:</Typography>
                            <Typography
                                variant="caption"
                                fontStyle="italic"
                                p={2}
                                pt={0}
                                pb={0}
                                style={{ opacity: 0.6 }}
                            >
                                Giá đề nghị đã bao gồm phí - 10%
                            </Typography>
                            <NumberFormat
                                displayType="text"
                                value={
                                    Math.round((quantity * price * (1 + fee / 100)) / quantity) -
                                    Math.round(((quantity * price * (1 + fee / 100)) / quantity / 100) * 10)
                                }
                                style={{ fontSize: "20px" }}
                                thousandSeparator={true}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                    </Grid>
                    <Box mt={2} mb={2} />
                    <FormLabel htmlFor="product-desc" children={<Typography>Nhập mô tả(*)</Typography>} />
                    <Box p={1}>
                        <Typography variant="caption" style={{ opacity: 0.6 }}>
                            Nhập mô tả để khách hàng hiểu rõ hơn về yêu cầu của bạn
                        </Typography>
                    </Box>
                    <TextareaAutosize
                        id="product-desc"
                        value={desc}
                        autoComplete="off"
                        onChange={event => {
                            handleOnChangeInputField(event, "desc");
                        }}
                        className="w-100-percent font-20"
                        minRows={4}
                        maxRows={5}
                    />
                    <Box mt={2} mb={2} />
                    <FormLabel children={<Typography>Hình ảnh minh hoạ</Typography>} />
                    <Box mt={2} mb={2} />
                    {renderImageReview()}
                    <Box mt={2} mb={2} />
                    <FormLabel
                        children={<Typography>Giao hàng {type === "buying" ? "trước ngày" : "từ"}(*)</Typography>}
                    />
                    <Box p={1}>
                        <Typography variant="caption" style={{ opacity: 0.6 }}>
                            Thời gian giao hàng hàng phải lớn hơn thời gian hiện tại ít nhất 2 ngày (1 ngày trước khi
                            giao hàng, yêu cầu sẽ được đóng để nhân viên có thời gian chuẩn bị, mặc định là lớn hơn 2
                            ngày).
                        </Typography>
                    </Box>
                    <Box mt={2} mb={2} />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label={type === "buying" ? "Ngày nhận hàng" : "Ngày giao hàng"}
                            inputFormat="dd/MM/yyyy HH:mm:ss"
                            value={expiredDate}
                            onChange={value => pickDate(value)}
                            renderInput={params => <TextField {...params} fullWidth />}
                        />
                        <Box mt={2} mb={2} />
                    </LocalizationProvider>
                    <FormLabel
                        children={<Typography>{type === "buying" ? "Giao đến(*)" : "Lấy hàng tại(*)"}</Typography>}
                    />
                    <Box mt={2} mb={2} />
                    <FormControl fullWidth>
                        <InputLabel id="address-selector">
                            {type === "buying" ? "Địa chỉ giao hàng" : "Địa chỉ"}
                        </InputLabel>
                        <Select
                            labelId="address-selector"
                            id="address-selector-select"
                            value={address}
                            onChange={event => {
                                selectTransactionAddress(event);
                            }}
                        >
                            <MenuItem value="default">-- Chọn địa chỉ --</MenuItem>
                            {renderTransactionAddressSelector()}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                            changeToggleOnAddNewAddressModalStatus();
                        }}
                    >
                        Thêm địa chỉ mới
                    </Button>
                    <Box mt={1} mb={7} />
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Button variant="contained" color="success" type="submit">
                                {submitType === "create" ? "Lưu" : "Cập nhật"}
                            </Button>
                        </Grid>
                        &nbsp;
                        <Grid>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    resetField(type);
                                }}
                            >
                                Huỷ
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default AddNewRequestModal;
