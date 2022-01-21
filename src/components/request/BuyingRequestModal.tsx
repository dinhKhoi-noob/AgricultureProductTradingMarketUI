import { Box, Button, FormLabel, LinearProgress, Modal, TextField, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useContext } from 'react';
import { animated, useSpring } from 'react-spring';
import { BuyingRequestContext } from '../../context/BuyingRequestContext';

const BuyingRequestModal = () => {
    const modalSlidein = useSpring({
        from:{
            top: "0%",
            opacity: 0
        },
        to:{
            top: "50%",
            opacity: 1
        },
        reset:true
    });

    const {isOpenedModal, modalInformation, changeIsOpenModalStatus} = useContext(BuyingRequestContext);
    const {owner,price,title,selledUser,quantity,process} = modalInformation;
    const quantityRatio = process / quantity * 100;
    return (
        <Modal
            open={isOpenedModal}
            onClose={()=>{
                changeIsOpenModalStatus(false);
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            >
            <animated.div className="modal" style={modalSlidein}>
                <Box>
                    <Typography fontWeight="bold">
                        Thông tin chung
                    </Typography>
                    <hr/>
                    <Box display="flex" mt={2}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Đăng bởi:
                        </Typography>
                        <img src={owner.avatar} width={30} height={30} style={{borderRadius:"50%",objectFit:"cover"}}/>
                        <Typography fontSize={14}>
                            {owner.username}
                        </Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Tên nông sản:
                        </Typography>
                        <Typography fontSize={14}>
                            {title}
                        </Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Giá đề nghị:
                        </Typography>
                        <Typography fontSize={14}>
                            {price}
                        </Typography>
                    </Box>
                    <Box display="flex" mt={1.5}>
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Số lượng:
                        </Typography>
                        <Typography fontSize={14}>
                            {quantity}
                        </Typography>
                    </Box>
                    <Box display="flex" mt={1.5} alignItems="center">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Tiến trình:
                        </Typography>
                        <Tooltip title={<Typography fontSize={12}>{process}/{quantity}</Typography>}>
                            <LinearProgress variant="determinate" value={quantityRatio} style={{width:"50%"}}/>
                        </Tooltip>
                    </Box>
                    <Box display="flex" mt={1.5} alignItems="center">
                        <Typography fontWeight="bold" fontSize={14} mr={1}>
                            Đã đăng ký thành công:
                        </Typography>
                        <Tooltip title={
                            <>
                                {
                                    selledUser.length > 0 ?
                                        selledUser.map(user=>
                                            <Link href={"/profile/"+user.id}>
                                                <Box display="flex">
                                                    <Typography fontSize={12} fontWeight="bold" style={{cursor:"pointer"}}>
                                                        {user.username}:
                                                    </Typography>
                                                    &nbsp;
                                                    <Typography fontSize={12}>
                                                        {user.quantity}
                                                    </Typography>
                                                </Box>
                                            </Link>
                                        )
                                        :
                                        <Typography fontSize={14}>
                                            Chưa có
                                        </Typography>

                                }
                            </>
                        }>
                            <Box display="flex">
                                {
                                    selledUser.length > 0?
                                        selledUser.map(user =>
                                            <img src={user.avatar} width={30} height={30} style={{borderRadius:"50%",objectFit:"cover",marginRight:"-8px"}}/>
                                        )
                                        :
                                    <Typography fontSize={14}>
                                        Chưa có
                                    </Typography>
                                }
                            </Box>
                        </Tooltip>
                    </Box>
                </Box>
                <form>
                    <Typography fontWeight="bold" mt={2}>
                        Đăng ký bán
                    </Typography>
                    <hr/>
                    <Box mt={2}></Box>
                    <FormLabel htmlFor="modal-price">
                        Đề xuất giá
                    </FormLabel>
                    <Box mb={1}></Box>
                    <TextField id="modal-price" value={price} fullWidth></TextField>
                    <FormLabel htmlFor="modal-quantity">
                        Số lượng
                    </FormLabel>
                    <TextField id="modal-quantity" value={quantity} fullWidth></TextField>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant='outlined' color="success">Đăng ký</Button>
                        &nbsp;
                        <Button variant='outlined' color="warning">Hủy</Button>
                    </Box>
                </form>
            </animated.div>
        </Modal>
    );
};

export default BuyingRequestModal;
