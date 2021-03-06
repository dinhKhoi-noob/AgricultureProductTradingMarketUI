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
                content: "Th??ng tin kh??ng h???p l???, vui l??ng th??? l???i !",
                type: "error",
                isToggle: true,
            });
            return;
        }
        changeConfirmationModalValues({
            title: `B???n ch???c ch???n mu???n t???o m???t y??u c???u ${
                type === "buying" ? "mua" : "b??n"
            } n??ng s???n m???i v???i nh???ng th??ng tin n??y ? B???n s??? kh??ng th??? ch???nh s???a th??ng tin khi ng?????i qu???n l?? duy???t y??u c???u n??y!`,
            isToggle: true,
            type: type === "buying" ? "newBuyingRequest" : "newSellingRequest",
        });
    };

    const handleUpdateRequest = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            title: "B???n ch???c ch???n mu???n thay ?????i th??ng tin c???a y??u c???u n??y ?",
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
                        <label htmlFor="raised-button-file">Ch???n ???nh kh??c</label>
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
                                (Ch???n ???nh)
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
                        submitType === "edit" ? handleUpdateRequest(event) : createNewBuyingRequest(event);
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
                    <FormLabel htmlFor="product-price" children={<Typography>Gi?? ????? ngh??? (*) (VND)</Typography>} />
                    <TextField
                        id="product-price"
                        type="number"
                        fullWidth
                        helperText="Gi?? ????? ngh??? s??? cho kh??ch h??ng bi???t ???????c m???c gi?? h???p l?? c?? th??? ????? ngh???"
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
                                onChange={event => {
                                    handleOnChangeInputField(event, "quantity", type);
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

                        <Box mt={2} mb={2} display="flex">
                            <Tooltip
                                title={
                                    <Typography variant="caption" fontStyle="italic" style={{ opacity: 0.6 }}>
                                        10% cho y??u c???u v???i t???ng gi?? tr??? ??t h??n 100.000VND <br />
                                        8% cho y??u c???u v???i t???ng gi?? tr??? t??? 100.000VND ?????n 500.00VND
                                        <br />
                                        7% cho y??u c???u v???i t???ng gi?? tr??? t??? 500.000VND ?????n 1.000.000VND
                                        <br />
                                        6% cho y??u c???u v???i t???ng gi?? tr??? t??? 1.000.000VND ?????n 5.000.000VND
                                        <br />
                                        5% cho y??u c???u v???i t???ng gi?? tr??? t??? 5.000.000VND tr??? ??i
                                    </Typography>
                                }
                            >
                                <Typography>Ph?? ????ng g??i / v???n chuy???n (%):</Typography>
                            </Tooltip>
                            &nbsp;
                            <Typography>{fee ? fee : 10}%</Typography>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Ph?? (th??nh ti???n):</Typography>
                            <NumberFormat
                                value={Math.round((quantity * price * fee) / 100)}
                                thousandSeparator={true}
                                style={{ fontSize: "20px" }}
                                suffix="VND"
                                displayType="text"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>
                                {type === "buying"
                                    ? "T???ng ti???n ph???i tr??? ?????c t??nh c???a y??u c???u:"
                                    : "T???ng gi?? tr??? ?????c t??nh c???a y??u c???u:"}
                            </Typography>
                            <NumberFormat
                                displayType="text"
                                value={Math.round(quantity * price * (1 + fee / 100))}
                                thousandSeparator={true}
                                style={{ fontSize: "20px" }}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>
                                {type === "buying"
                                    ? "T???ng gi?? tr??? ?????c t??nh c???a y??u c???u"
                                    : "Th???c nh???n ?????c t??nh c???a y??u c???u:"}
                            </Typography>
                            <NumberFormat
                                displayType="text"
                                value={quantity * price}
                                style={{ fontSize: "20px" }}
                                thousandSeparator={true}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Gi?? ????? ngh??? ???? bao g???m ph??:</Typography>
                            <NumberFormat
                                displayType="text"
                                value={Math.round(quantity * price * (1 + fee / 100)) / quantity}
                                style={{ fontSize: "20px" }}
                                thousandSeparator={true}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Gi?? t???i ??a kh??ch h??ng c?? th??? ????? ngh???:</Typography>
                            <Typography
                                variant="caption"
                                fontStyle="italic"
                                p={2}
                                pt={0}
                                pb={0}
                                style={{ opacity: 0.6 }}
                            >
                                {type === "selling"
                                    ? "Gi?? ????? ngh??? ???? bao g???m ph?? + 10%"
                                    : "Gi?? ????? ngh??? ???? bao g???m ph?? + 3%"}
                            </Typography>
                            <NumberFormat
                                displayType="text"
                                value={
                                    type === "selling"
                                        ? Math.round((quantity * price * (1 + fee / 100)) / quantity) +
                                          Math.round(((quantity * price * (1 + fee / 100)) / quantity / 100) * 10)
                                        : Math.round((quantity * price * (1 + fee / 100)) / quantity) +
                                          Math.round(((quantity * price * (1 + fee / 100)) / quantity / 100) * 3)
                                }
                                style={{ fontSize: "20px" }}
                                thousandSeparator={true}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
                        <Box mt={1} mb={1}>
                            <Typography>Gi?? t???i thi???u kh??ch h??ng c?? th??? ????? ngh???:</Typography>
                            <Typography
                                variant="caption"
                                fontStyle="italic"
                                p={2}
                                pt={0}
                                pb={0}
                                style={{ opacity: 0.6 }}
                            >
                                {type === "buying"
                                    ? "Gi?? ????? ngh??? ???? bao g???m ph?? - 10%"
                                    : "Gi?? ????? ngh??? ???? bao g???m ph?? - 3%"}
                            </Typography>
                            <NumberFormat
                                displayType="text"
                                value={
                                    type === "buying"
                                        ? Math.round((quantity * price * (1 + fee / 100)) / quantity) -
                                          Math.round(((quantity * price * (1 + fee / 100)) / quantity / 100) * 10)
                                        : Math.round((quantity * price * (1 + fee / 100)) / quantity) -
                                          Math.round(((quantity * price * (1 + fee / 100)) / quantity / 100) * 3)
                                }
                                style={{ fontSize: "20px" }}
                                thousandSeparator={true}
                                suffix="VND"
                            ></NumberFormat>
                        </Box>
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
                                {submitType === "create" ? "L??u" : "C???p nh???t"}
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

export default AddNewRequestModal;
