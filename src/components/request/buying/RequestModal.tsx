/* eslint-disable react/no-children-prop */
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    ImageList,
    ImageListItem,
    InputLabel,
    LinearProgress,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { RequestContext, TransactionType } from "../../../context/RequestContext";
import { LayoutContext } from "../../../context/LayoutContext";
import { UploadFileContext } from "../../../context/UploadFileContext";
import NumberFormat from "react-number-format";

interface RequestModalProps {
    type: TransactionType;
    submitType: "edit" | "create";
}

const RequestModal = ({ type, submitType }: RequestModalProps) => {
    const {
        isOpenedModal,
        modalInformation,
        currentSellingRequest,
        currentTargetRequest,
        changeCurrentSubrequest,
        changeIsOpenModalStatus,
        changeToggleOnAddNewAddressModalStatus,
        renderTransactionAddressSelector,
        changeTransactionAddress,
    } = useContext(RequestContext);
    const { changeSnackbarValues, changeConfirmationModalValues } = useContext(LayoutContext);
    const { currentFilePaths, fileNames, changeFilesArray, changeCurrentFilePaths } = useContext(UploadFileContext);
    const { owner, price, title, selledUser, quantity, process } = modalInformation;
    const [isValidQuantity, setIsValidQuantity] = useState(true);
    const [isValidPrice, setIsValidPrice] = useState(true);
    const { fee, measure } = currentTargetRequest;
    const quantityRatio = (process / quantity) * 100;
    const priceIncludeFee = Math.round((quantity * price * (1 + fee / 100)) / quantity);
    const resetField = () => {
        setIsValidQuantity(true);
        setIsValidPrice(true);
    };

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
        changeCurrentSubrequest({
            ...currentSellingRequest,
            dateCompletedOrder: new Date(
                new Date(new Date(currentTargetRequest.expiredDate)).setHours(
                    type === "selling"
                        ? new Date(currentTargetRequest.expiredDate).getHours() + 12
                        : new Date(currentTargetRequest.expiredDate).getHours() - 12
                )
            ),
        });
    }, [currentTargetRequest]);

    const submitRegisterSellingRequest = (type: TransactionType) => {
        const maxPrice =
            type === "buying" ? Math.round((priceIncludeFee * 110) / 100) : Math.round((priceIncludeFee * 103) / 100);
        const minPrice =
            type === "buying" ? Math.round((priceIncludeFee * 97) / 100) : Math.round((priceIncludeFee * 90) / 100);
        if (
            currentSellingRequest.price < minPrice ||
            currentSellingRequest.price < 0 ||
            currentSellingRequest.price > maxPrice ||
            currentSellingRequest.quantity > quantity ||
            currentSellingRequest.quantity < 0 ||
            currentSellingRequest.address === "default" ||
            (type === "selling" && currentSellingRequest.description === "")
        ) {
            console.log(minPrice, maxPrice);
            changeSnackbarValues({
                content: "Th??ng tin kh??ng h???p l???, vui l??ng th??? l???i !",
                isToggle: true,
                type: "error",
            });
            return;
        }
        changeConfirmationModalValues({
            title: `B???n mu???n ????ng k?? ${
                type === "selling" ? "b??n" : "mua"
            } s???n ph???m n??y v???i th??ng tin nh?? tr??n ? B???n s??? kh??ng th??? thay ?????i th??ng tin m???t khi ch??? c???a y??u c???u n??y x??c nh???n y??u c???u mua c???a b???n !`,
            isToggle: true,
            type: type === "selling" ? "registerSellingSubrequest" : "registerBuyingSubrequest",
        });
    };

    const updateSubrequestInformation = (event: SyntheticEvent) => {
        event.preventDefault();
        console.log(type);
        const maxPrice =
            type === "selling" ? Math.round((priceIncludeFee * 110) / 100) : Math.round((priceIncludeFee * 103) / 100);
        const minPrice =
            type === "buying" ? Math.round((priceIncludeFee * 90) / 100) : Math.round((priceIncludeFee * 97) / 100);
        if (
            currentSellingRequest.price < minPrice ||
            currentSellingRequest.price < 0 ||
            currentSellingRequest.price > maxPrice ||
            currentSellingRequest.quantity > quantity ||
            currentSellingRequest.quantity < 0 ||
            currentSellingRequest.address === "default" ||
            (type === "buying" && currentSellingRequest.description === "")
        ) {
            changeSnackbarValues({
                content: "Th??ng tin kh??ng h???p l???, vui l??ng th??? l???i !",
                isToggle: true,
                type: "error",
            });
            return;
        }
        changeConfirmationModalValues({
            title: `B???n ch???c ch???n mu???n c???p nh???t th??ng tin y??u c???u n??y !`,
            isToggle: true,
            type: type === "selling" ? "updateSellingSubrequest" : "updateBuyingSubrequest",
        });
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

    const selectTransactionAddress = (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value !== "default") {
            changeTransactionAddress(event.target.value);
            changeCurrentSubrequest({ ...currentSellingRequest, address: value });
        }
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
                        id="raised-button"
                        type="file"
                        onChange={event => {
                            handleChangeImages(event);
                        }}
                    />
                    <Button variant="contained" color="warning">
                        <label htmlFor="raised-button">Ch???n ???nh kh??c</label>
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
            open={isOpenedModal}
            onClose={() => {
                changeIsOpenModalStatus(false);
                resetField();
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="product-type-modal scrollable" p={4} pr={2} pl={2}>
                <Box>
                    <Typography fontWeight="bold">Th??ng tin chung</Typography>
                    <hr />
                    <Box display="flex" mt={2} justifyContent="space-between">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            ????ng b???i:
                        </Typography>
                        <Box display="flex">
                            <img
                                src={owner.avatar}
                                width={30}
                                height={30}
                                style={{ borderRadius: "50%", objectFit: "cover" }}
                            />
                            <Typography fontSize={14}>{owner.username}</Typography>
                        </Box>
                    </Box>
                    <Box display="flex" mt={1.5} justifyContent="space-between">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            T??n n??ng s???n:
                        </Typography>
                        <Typography fontSize={14}>{title}</Typography>
                    </Box>
                    <Box display="flex" mt={1.5} justifyContent="space-between">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Gi?? ????? ngh???:
                        </Typography>
                        <Typography fontSize={14}>
                            <NumberFormat
                                value={Math.round(priceIncludeFee)}
                                suffix="VND"
                                thousandSeparator={true}
                                displayType="text"
                            />
                        </Typography>
                    </Box>
                    <Box mt={1.5}>
                        <Tooltip title={type === "selling" ? "Gi?? ????? ngh??? + 10%" : "Gi?? ????? ngh??? + 3%"}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography fontWeight="bold" fontSize={14} mr={1}>
                                    Gi?? t???i ??a c?? th??? ????? ngh???:
                                </Typography>
                                <Typography fontSize={14}>
                                    <NumberFormat
                                        displayType="text"
                                        value={
                                            type === "selling"
                                                ? Math.round((priceIncludeFee * 110) / 100)
                                                : Math.round((priceIncludeFee * 103) / 100)
                                        }
                                        suffix="VND"
                                        thousandSeparator={true}
                                    />
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                    <Box mt={1.5}>
                        <Tooltip title={type === "buying" ? "Gi?? ????? ngh??? - 10%" : "Gi?? ????? ngh??? - 3%"}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography fontWeight="bold" fontSize={14} mr={1}>
                                    Gi?? t???i thi???u c?? th??? ????? ngh???:
                                </Typography>
                                <Typography fontSize={14}>
                                    <NumberFormat
                                        displayType="text"
                                        value={
                                            type === "buying"
                                                ? Math.round((priceIncludeFee * 90) / 100)
                                                : Math.round((priceIncludeFee * 97) / 100)
                                        }
                                        suffix="VND"
                                        thousandSeparator={true}
                                    />
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                    <Box display="flex" mt={1.5} justifyContent="space-between">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            S??? l?????ng:
                        </Typography>
                        <Typography fontSize={14}>
                            <NumberFormat
                                displayType="text"
                                value={Math.abs(quantity + process)}
                                suffix={measure}
                                thousandSeparator={true}
                            />
                        </Typography>
                    </Box>
                    <Box display="flex" mt={1.5} justifyContent="space-between">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            S??? l?????ng c?? th??? ????ng k?? th??m:
                        </Typography>
                        <Typography fontSize={14}>
                            <NumberFormat
                                displayType="text"
                                value={quantity}
                                suffix={measure}
                                thousandSeparator={true}
                            />
                        </Typography>
                    </Box>
                    <Box display="flex" mt={1.5} alignItems="center">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Ti???n tr??nh:
                        </Typography>
                        <Tooltip
                            title={
                                <Typography fontSize={12}>
                                    {process}/{quantity}
                                </Typography>
                            }
                        >
                            <LinearProgress variant="determinate" value={quantityRatio} style={{ width: "50%" }} />
                        </Tooltip>
                    </Box>
                    {submitType === "create" ? (
                        <Box display="flex" mt={1.5} alignItems="center">
                            <Typography fontWeight="bold" fontSize={14} mr={1}>
                                ???? ????ng k?? th??nh c??ng:
                            </Typography>
                            <Tooltip
                                title={
                                    <>
                                        {selledUser.length > 0 && selledUser[0] !== undefined ? (
                                            selledUser.map((user, index) => (
                                                <Link key={index} href={"/profile/" + user.id}>
                                                    <Box display="flex">
                                                        <Typography
                                                            fontSize={12}
                                                            fontWeight="bold"
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            {user.username}:
                                                        </Typography>
                                                        &nbsp;
                                                        <Typography fontSize={12}>{user.quantity}</Typography>
                                                    </Box>
                                                </Link>
                                            ))
                                        ) : (
                                            <Typography fontSize={14}>Ch??a c??</Typography>
                                        )}
                                    </>
                                }
                            >
                                <Box display="flex">
                                    {selledUser.length > 0 ? (
                                        selledUser.map((user, index) => (
                                            <img
                                                key={index}
                                                src={user.avatar}
                                                width={30}
                                                height={30}
                                                style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px" }}
                                            />
                                        ))
                                    ) : (
                                        <Typography fontSize={14}>Ch??a c??</Typography>
                                    )}
                                </Box>
                            </Tooltip>
                        </Box>
                    ) : (
                        <></>
                    )}
                </Box>
                <form
                    onSubmit={event => {
                        event.preventDefault();
                        submitType === "create"
                            ? (() => {
                                  submitRegisterSellingRequest(type === "selling" ? "buying" : "selling");
                                  resetField();
                              })()
                            : updateSubrequestInformation(event);
                    }}
                >
                    <Typography fontWeight="bold" mt={2}>
                        ????ng k?? {type === "buying" ? "b??n" : "mua"}
                    </Typography>
                    <hr />
                    <Box mt={2}></Box>
                    <FormLabel htmlFor="modal-price">????? xu???t gi?? (*) (VND)</FormLabel>
                    <Box mb={1}></Box>
                    <TextField
                        id="modal-price"
                        type="number"
                        defaultValue={currentSellingRequest.price}
                        error={!isValidPrice}
                        value={currentSellingRequest.price}
                        fullWidth
                        onChange={event => {
                            const parsedPrice = parseInt(event.target.value);
                            const maxPrice =
                                type === "selling"
                                    ? Math.round((priceIncludeFee * 110) / 100)
                                    : Math.round((priceIncludeFee * 103) / 100);
                            const minPrice =
                                type === "buying"
                                    ? Math.round((priceIncludeFee * 90) / 100)
                                    : Math.round((priceIncludeFee * 97) / 100);
                            changeCurrentSubrequest({ ...currentSellingRequest, price: parsedPrice });
                            if (
                                parsedPrice > maxPrice ||
                                parsedPrice < minPrice ||
                                parsedPrice < 0 ||
                                isNaN(parsedPrice) ||
                                !parsedPrice
                            ) {
                                setIsValidPrice(false);
                                return;
                            }
                            if (isNaN(parsedPrice) || !parsedPrice) {
                                setIsValidPrice(false);
                                return;
                            }
                            setIsValidPrice(true);
                        }}
                    />
                    <Box mb={1}></Box>
                    <FormLabel htmlFor="modal-quantity">S??? l?????ng (*)</FormLabel>
                    <Box mb={2}></Box>
                    <TextField
                        id="modal-quantity"
                        defaultValue={quantity - process}
                        error={!isValidQuantity}
                        type="number"
                        value={currentSellingRequest.quantity}
                        helperText="S??? l?????ng ph???i l???n h??n 0 v?? kh??ng l???n h??n s??? l?????ng c?? th??? ????ng k?? th??m"
                        fullWidth
                        onChange={event => {
                            const parsedQuantity = parseInt(event.target.value);
                            changeCurrentSubrequest({ ...currentSellingRequest, quantity: parsedQuantity });
                            if (
                                isNaN(parsedQuantity) ||
                                !parsedQuantity ||
                                parsedQuantity < 0 ||
                                parsedQuantity > quantity
                            ) {
                                setIsValidQuantity(false);
                                return;
                            }
                            setIsValidQuantity(true);
                        }}
                    />
                    <Box mt={2} mb={2} />
                    {type === "buying" ? (
                        <>
                            <FormLabel htmlFor="product-desc" children={<Typography>Nh???p m?? t???(*)</Typography>} />
                            <Box p={1}>
                                <Typography variant="caption" style={{ opacity: 0.6 }}>
                                    Nh???p m?? t??? ????? kh??ch h??ng hi???u r?? h??n v??? y??u c???u c???a b???n
                                </Typography>
                            </Box>
                            <TextareaAutosize
                                id="product-desc"
                                value={currentSellingRequest.description}
                                autoComplete="off"
                                onChange={(event: SyntheticEvent) => {
                                    const target = event.target as HTMLInputElement;
                                    changeCurrentSubrequest({ ...currentSellingRequest, description: target.value });
                                }}
                                className="w-100-percent font-20"
                                minRows={4}
                                maxRows={5}
                            />
                            <Box mt={2} mb={2} />
                        </>
                    ) : (
                        <></>
                    )}
                    <Box mt={2} mb={2} />
                    {type === "buying" ? (
                        <>
                            <FormLabel children={<Typography>H??nh ???nh minh ho???</Typography>} />
                            <Box mt={2} mb={2} />
                            {renderImageReview()}
                        </>
                    ) : (
                        <></>
                    )}
                    <FormLabel
                        children={
                            <Typography>
                                {type === "selling" ? "Th???i gian giao h??ng" : "Th???i gian nh???n h??ng"}
                            </Typography>
                        }
                    />
                    <Box mt={2} mb={2}>
                        <Typography>
                            {type === "selling" ? "Tr?????c" : "T???"}: &nbsp;
                            {format(
                                new Date(
                                    new Date(new Date(currentTargetRequest.expiredDate)).setHours(
                                        type === "selling"
                                            ? new Date(currentTargetRequest.expiredDate).getHours() + 12
                                            : new Date(currentTargetRequest.expiredDate).getHours() - 12
                                    )
                                ),
                                "HH:mm dd/MM/yyyy"
                            )}
                        </Typography>
                    </Box>
                    <FormLabel
                        children={
                            <Typography>{type === "buying" ? "Giao h??ng ?????n(*)" : "Nh???n h??ng t???i(*)"}</Typography>
                        }
                    />
                    <Box mt={2} mb={2} />
                    <FormControl fullWidth>
                        <InputLabel id="address-selector">?????a ch??? nh???n h??ng</InputLabel>
                        <Select
                            labelId="address-selector"
                            id="address-selector-select"
                            defaultValue="default"
                            value={currentSellingRequest.address}
                            onChange={event => {
                                selectTransactionAddress(event);
                            }}
                        >
                            <MenuItem value="default">-- Ch???n ?????a ch??? --</MenuItem>
                            {renderTransactionAddressSelector()}
                        </Select>
                    </FormControl>
                    <Box mt={2} />
                    <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                            changeToggleOnAddNewAddressModalStatus();
                        }}
                    >
                        Th??m ?????a ch??? m???i
                    </Button>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained" type="submit" color="success">
                            {submitType === "create" ? "????ng k??" : "C???p nh???t"}
                        </Button>
                        &nbsp;
                        <Button variant="contained" color="warning">
                            H???y
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default RequestModal;
