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
import { RequestContext, TransactionType } from "../../../context/RequestContext";
import { LayoutContext } from "../../../context/LayoutContext";
import { ProductContext, ProductValueInitializer } from "../../../context/ProductContext";
import { UploadFileContext } from "../../../context/UploadFileContext";

type InputTypeEvent = "price" | "desc" | "quantity" | "measure" | "address" | "title";

interface AddNewRequestModalProps {
    type: TransactionType;
}

const UpdateRequestModal = ({ type }: AddNewRequestModalProps) => {
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

    const { product, price, quantity, desc, measure, expiredDate, productName, address } = newRequest;

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
                content: "V?????t qu?? gi???i h???n h??nh ???nh cho ph??p",
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
        changeNewRequestValue({ ...newRequest, expiredDate: value ? value : new Date(Date.now()) });
    };

    const handleOnChangeInputField = (event: SyntheticEvent, type: InputTypeEvent) => {
        const target = event.target as HTMLInputElement;
        switch (type) {
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

    const handleUpdateRequest = (event: SyntheticEvent, type: TransactionType) => {
        event.preventDefault();
        changeConfirmationModalValues({
            title: "B???n ch???c ch???n mu???n thay ?????i th??ng tin c???a y??u c???u n??y ?",
            isToggle: true,
            type: type === "selling" ? "updateSellingRequest" : "updateBuyingRequest",
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
                        Hu??? ch???n
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
                                (Ch???n nhi???u nh???t 4 ???nh)
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
                    Y??u c???u {type === "buying" ? "mua" : "b??n"} n??ng s???n m???i
                </Typography>
                <Box mt={4} mb={4} />
                <form
                    onSubmit={event => {
                        handleUpdateRequest(event, type);
                    }}
                >
                    <FormLabel children={<Typography>T??n lo???i n??ng s???n / s???n ph???m n??ng nghi???p(*)</Typography>} />
                    <Box mt={2} mb={2} />
                    <FormControl fullWidth>
                        <InputLabel id="product-type-selector">Ch???n</InputLabel>
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
                    <FormLabel htmlFor="product-price" children={<Typography>T??n n??ng s???n / s???n ph???m(*)</Typography>} />
                    <TextField
                        id="product-title"
                        fullWidth
                        helperText="T??n n??ng s???n kh??ng ???????c ????? tr???ng"
                        autoComplete="off"
                        onChange={event => {
                            handleOnChangeInputField(event, "title");
                        }}
                        value={productName}
                    />
                    <Box mt={2} mb={2} />
                    <FormLabel htmlFor="product-price" children={<Typography>Gi?? ????? ngh???(*)</Typography>} />
                    <TextField
                        id="product-price"
                        type="number"
                        fullWidth
                        helperText="Gi?? ????? ngh??? s??? cho kh??ch h??ng bi???t ???????c m???c gi?? h???p l?? c?? th??? ????? ngh???"
                        autoComplete="off"
                        onChange={event => {
                            handleOnChangeInputField(event, "price");
                        }}
                        value={price}
                    />
                    <Box mt={2} mb={2} />
                    <Grid display="flex" container>
                        <Grid item md={9}>
                            <FormLabel htmlFor="product-quantity" children={<Typography>S??? l?????ng(*)</Typography>} />
                            <TextField
                                id="product-quantity"
                                type="number"
                                fullWidth
                                helperText="S??? l?????ng mua ph???i l???n h??n 0 v?? chia h???t cho 5"
                                autoComplete="off"
                                onChange={event => {
                                    handleOnChangeInputField(event, "quantity");
                                }}
                                value={quantity}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <FormLabel htmlFor="product-quantity-type" children={<Typography>????n v???(*)</Typography>} />
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
                    <FormLabel htmlFor="product-desc" children={<Typography>Nh???p m?? t???(*)</Typography>} />
                    <Box p={1}>
                        <Typography variant="caption" style={{ opacity: 0.6 }}>
                            Nh???p m?? t??? ????? kh??ch h??ng hi???u r?? h??n v??? y??u c???u c???a b???n
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
                    <FormLabel children={<Typography>H??nh ???nh minh ho???</Typography>} />
                    <Box mt={2} mb={2} />
                    {renderImageReview()}
                    <Box mt={2} mb={2} />
                    <FormLabel
                        children={<Typography>Giao h??ng {type === "buying" ? "tr?????c ng??y" : "t???"}(*)</Typography>}
                    />
                    <Box p={1}>
                        <Typography variant="caption" style={{ opacity: 0.6 }}>
                            Th???i gian giao h??ng h??ng ph???i l???n h??n th???i gian hi???n t???i ??t nh???t 2 ng??y (1 ng??y tr?????c khi
                            giao h??ng, y??u c???u s??? ???????c ????ng ????? nh??n vi??n c?? th???i gian chu???n b???, m???c ?????nh l?? l???n h??n 2
                            ng??y).
                        </Typography>
                    </Box>
                    <Box mt={2} mb={2} />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label={type === "buying" ? "Ng??y nh???n h??ng" : "Ng??y giao h??ng"}
                            inputFormat="dd/MM/yyyy HH:mm:ss"
                            value={expiredDate}
                            onChange={value => pickDate(value)}
                            renderInput={params => <TextField {...params} fullWidth />}
                        />
                        <Box mt={2} mb={2} />
                    </LocalizationProvider>
                    <FormLabel
                        children={<Typography>{type === "buying" ? "Giao ?????n(*)" : "L???y h??ng t???i(*)"}</Typography>}
                    />
                    <Box mt={2} mb={2} />
                    <FormControl fullWidth>
                        <InputLabel id="address-selector">
                            {type === "buying" ? "?????a ch??? giao h??ng" : "?????a ch???"}
                        </InputLabel>
                        <Select
                            labelId="address-selector"
                            id="address-selector-select"
                            value={address}
                            onChange={event => {
                                selectTransactionAddress(event);
                            }}
                        >
                            <MenuItem value="default">-- Ch???n ?????a ch??? --</MenuItem>
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
                        Th??m ?????a ch??? m???i
                    </Button>
                    <Box mt={1} mb={7} />
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Button variant="contained" color="success" type="submit">
                                C???p nh???t
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
                                Hu???
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default UpdateRequestModal;
