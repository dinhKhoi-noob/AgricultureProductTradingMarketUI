import { Box, Button, FormLabel, Modal, TextField, Typography } from '@mui/material';
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
                <form>
                    <Typography fontWeight="bold">
                        Đăng ký bán
                    </Typography>
                    <hr/>
                    <Box mt={2}></Box>
                    <FormLabel htmlFor="modal-price">
                        Giá đề xuất
                    </FormLabel>
                    <Box mb={1}></Box>
                    <TextField id="modal-price" fullWidth></TextField>
                    <FormLabel htmlFor="modal-quantity">
                        Số lượng
                    </FormLabel>
                    <TextField id="modal-quantity" fullWidth></TextField>
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant='outlined' color="success">Đăng ký</Button>
                        <Button variant='outlined' color="warning">Hủy</Button>
                    </Box>
                </form>
            </animated.div>
        </Modal>
    );
};

export default BuyingRequestModal;
