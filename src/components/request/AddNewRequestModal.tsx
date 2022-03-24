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
    Typography,
} from "@mui/material";
import Image from "next/image";
import React, { SyntheticEvent, useContext, useEffect } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { BuyingRequestContext } from "../../context/BuyingRequestContext";
import { LayoutContext } from "../../context/LayoutContext";
import { ProductContext, ProductValueInitializer } from "../../context/ProductContext";
import { UploadFileContext } from "../../context/UploadFileContext";

type InputTypeEvent = "price" | "desc" | "quantity" | "measure";

const AddNewRequestModal = () => {
    const {
        isToggleCreateNewRequestModal,
        newBuyingRequest,
        submitType,
        changeToggleCreateNewRequestModal,
        changeNewBuyingRequestValue,
        resetField,
    } = useContext(BuyingRequestContext);
    const { changeConfirmationModalValues, changeSnackbarValues } = useContext(LayoutContext);
    const { fileNames, currentFilePaths, changeFilesArray, changeCurrentFilePaths } = useContext(UploadFileContext);
    const { productList } = useContext(ProductContext);
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
    const { product, price, quantity, desc, measure, expiredDate } = newBuyingRequest;

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

    const handleDeclineImageReview = () => {
        changeFilesArray(undefined);
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
        changeNewBuyingRequestValue({ ...newBuyingRequest, expiredDate: value ? value : new Date(Date.now()) });
    };

    const handleOnChangeInputField = (event: SyntheticEvent, type: InputTypeEvent) => {
        const target = event.target as HTMLInputElement;
        switch (type) {
            case "price":
                changeNewBuyingRequestValue({ ...newBuyingRequest, price: parseInt(target.value) });
                break;
            case "quantity":
                changeNewBuyingRequestValue({ ...newBuyingRequest, quantity: parseInt(target.value) });
                break;
            case "desc":
                changeNewBuyingRequestValue({ ...newBuyingRequest, desc: target.value });
                break;
            case "measure":
                changeNewBuyingRequestValue({ ...newBuyingRequest, measure: target.value });
                break;
            default:
                return;
        }
    };

    const selectProduct = (event: SelectChangeEvent) => {
        changeNewBuyingRequestValue({ ...newBuyingRequest, product: event.target.value });
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
            expiredDate <= new Date(Date.now())
        ) {
            changeSnackbarValues({
                content: "Vui lòng nhập đầy đủ các thông tin cần thiết!",
                type: "error",
                isToggle: true,
            });
            return;
        }
        changeConfirmationModalValues({
            title: "Bạn chắc chắn muốn tạo một yêu cầu mua nông sản mới với những thông tin này ? Bạn sẽ không thể chỉnh sửa thông tin khi người quản lý duyệt yêu cầu này!",
            isToggle: true,
            type: "newBuyingRequest",
        });
    };

    const confirmBuyingRequest = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            title: "Bạn chắc chắn muốn duyệt yêu cầu này ?",
            isToggle: true,
            type: "confirmBuyingRequest",
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
                    <Button
                        fullWidth
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            handleDeclineImageReview();
                        }}
                    >
                        Huỷ chọn
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
                resetField();
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="product-type-modal scrollable" p={4} pr={2} pl={2}>
                <Typography variant="h5" component="h2" textAlign="center">
                    Yêu cầu mua nông sản mới
                </Typography>
                <Box mt={4} mb={4} />
                <form
                    onSubmit={event => {
                        submitType === "confirmBuyingRequest"
                            ? confirmBuyingRequest(event)
                            : createNewBuyingRequest(event);
                    }}
                >
                    <FormLabel children={<Typography>Tên nông sản / sản phẩm nông nghiệp(*)</Typography>} />
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
                    <FormLabel htmlFor="product-price" children={<Typography>Giá đề nghị(*)</Typography>} />
                    <TextField
                        id="product-price"
                        type="number"
                        fullWidth
                        helperText="Giá đề nghị sẽ cho khách hàng biết được mức giá hợp lý có thể đề nghị"
                        autoComplete="off"
                        onChange={event => {
                            handleOnChangeInputField(event, "price");
                        }}
                        value={price}
                    />
                    <Box mt={2} mb={2} />
                    <Grid display="flex" container>
                        <Grid item md={9}>
                            <FormLabel htmlFor="product-quantity" children={<Typography>Số lượng mua(*)</Typography>} />
                            <TextField
                                id="product-quantity"
                                type="number"
                                fullWidth
                                helperText="Số lượng mua phải lớn hơn 0 và chia hết cho 5"
                                autoComplete="off"
                                onChange={event => {
                                    handleOnChangeInputField(event, "quantity");
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
                    <FormLabel children={<Typography>Thời gian hết hạn(*) </Typography>} />
                    <Box mt={2} mb={2} />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Ngày hết hạn"
                            inputFormat="dd/MM/yyyy HH:mm:ss"
                            value={expiredDate}
                            onChange={value => pickDate(value)}
                            renderInput={params => <TextField {...params} fullWidth />}
                        />
                        <Box mt={2} mb={2} />
                    </LocalizationProvider>
                    <Box mt={1} mb={7} />
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Button variant="contained" color="success" type="submit">
                                {submitType === "newBuyingRequest" ? "Lưu" : "Duyệt yêu cầu"}
                            </Button>
                        </Grid>
                        &nbsp;
                        <Grid>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    resetField();
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
