import { Box, Button, FormLabel, LinearProgress, Modal, TextField, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { animated, useSpring } from "react-spring";
import { BuyingRequestContext } from "../../context/BuyingRequestContext";

const BuyingRequestModal = () => {
    const { isOpenedModal, isBeginSlide, modalInformation, setIsBeginSlide, changeIsOpenModalStatus } =
        useContext(BuyingRequestContext);
    const { owner, price, title, selledUser, quantity, process } = modalInformation;
    const [isValidQuantity, setIsValidQuantity] = useState(true);
    const [isValidPrice, setIsValidPrice] = useState(true);
    const [registerInformation, setRegisterInformation] = useState({
        quantity,
        price,
    });
    const modalSlidein = useSpring({
        from: {
            top: "0%",
            opacity: 0,
        },
        to: {
            top: "50%",
            opacity: 1,
        },
        reset: isBeginSlide,
    });
    const quantityRatio = (process / quantity) * 100;
    const resetField = () => {
        setRegisterInformation({
            quantity,
            price,
        });
        setIsValidQuantity(true);
        setIsValidPrice(true);
        setIsBeginSlide(true);
    };
    return (
        <Modal
            open={isOpenedModal}
            onClose={() => {
                changeIsOpenModalStatus(false);
                setIsBeginSlide(true);
                resetField();
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <animated.div className="modal scrollable" style={modalSlidein}>
                <Box>
                    <Typography fontWeight="bold">Thông tin chung</Typography>
                    <hr />
                    <Box display="flex" mt={2}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Đăng bởi:
                        </Typography>
                        <img
                            src={owner.avatar}
                            width={30}
                            height={30}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                        <Typography fontSize={14}>{owner.username}</Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Tên nông sản:
                        </Typography>
                        <Typography fontSize={14}>{title}</Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Giá đề nghị:
                        </Typography>
                        <Typography fontSize={14}>{price}</Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Giá tối đa có thể đề nghị:
                        </Typography>
                        <Typography fontSize={14}>{(price * 130) / 100}</Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Giá tối thiểu có thể đề nghị:
                        </Typography>
                        <Typography fontSize={14}>{(price * 70) / 100}</Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Số lượng:
                        </Typography>
                        <Typography fontSize={14}>{quantity}</Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Số lượng có thể đăng ký thêm:
                        </Typography>
                        <Typography fontSize={14}>{quantity - process}</Typography>
                    </Box>
                    <Box display="flex" mt={1.5} alignItems="center">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Tiến trình:
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
                    <Box display="flex" mt={1.5} alignItems="center">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Đã đăng ký thành công:
                        </Typography>
                        <Tooltip
                            title={
                                <>
                                    {selledUser.length > 0 ? (
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
                                        <Typography fontSize={14}>Chưa có</Typography>
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
                                    <Typography fontSize={14}>Chưa có</Typography>
                                )}
                            </Box>
                        </Tooltip>
                    </Box>
                </Box>
                <form
                    onSubmit={event => {
                        event.preventDefault();
                        resetField();
                    }}
                >
                    <Typography fontWeight="bold" mt={2}>
                        Đăng ký bán
                    </Typography>
                    <hr />
                    <Box mt={2}></Box>
                    <FormLabel htmlFor="modal-price">Đề xuất giá</FormLabel>
                    <Box mb={1}></Box>
                    <TextField
                        id="modal-price"
                        defaultValue={registerInformation.price}
                        error={!isValidPrice}
                        helperText="Giá phải lớn hơn 0 và bé/lớn hơn 30% giá đề nghị"
                        fullWidth
                        onChange={event => {
                            const parsedPrice = parseInt(event.target.value);
                            const maxPrice = (price * 130) / 100;
                            const minPrice = (price * 70) / 100;
                            setRegisterInformation({ ...registerInformation, price: parsedPrice });
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
                    <FormLabel htmlFor="modal-quantity">Số lượng</FormLabel>
                    <Box mb={2}></Box>
                    <TextField
                        id="modal-quantity"
                        defaultValue={quantity - process}
                        error={!isValidQuantity}
                        helperText="Số lượng phải lớn hơn 0 và không lớn hơn số lượng có thể đăng ký thêm"
                        fullWidth
                        onChange={event => {
                            const parsedQuantity = parseInt(event.target.value);
                            if (
                                isNaN(parsedQuantity) ||
                                !parsedQuantity ||
                                parsedQuantity < 0 ||
                                parsedQuantity > quantity - process
                            ) {
                                setIsValidQuantity(false);
                                return;
                            }
                            setIsValidQuantity(true);
                            setRegisterInformation({ ...registerInformation, quantity: parsedQuantity });
                        }}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="outlined" type="submit" color="success">
                            Đăng ký
                        </Button>
                        &nbsp;
                        <Button variant="outlined" color="warning">
                            Hủy
                        </Button>
                    </Box>
                </form>
            </animated.div>
        </Modal>
    );
};

export default BuyingRequestModal;
