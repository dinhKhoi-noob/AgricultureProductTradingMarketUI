import { Box, Button, CircularProgress, Container, Grid, LinearProgress, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import NoUserImage from '../../../public/assets/no_user.jpg';
import { LayoutContext } from '../../context/LayoutContext';

interface UserSellingSuccessInfor{
    id: String;
    avatar: String;
    username: String;
    quantity: Number;
}

interface OwnerInfor{
    id: String;
    avatar: String;
    username: String;
}

interface BuyingRequestCardProps {
    thumbnail: String;
    title: String;
    quantity: number;
    progress: number;
    postBy: OwnerInfor;
    user: UserSellingSuccessInfor [];
    price:String;
}

const BuyingRequestCard = (props: BuyingRequestCardProps) => {
    const { postBy,thumbnail,title,user,quantity,progress,price } = props;
    const quantityRatio = (progress / quantity) * 100;
    const {xsMatched,mdMatched,smMatched} = useContext(LayoutContext);
    const [fontSize,setFontSize] = useState(16);

    useEffect(()=>{
        if(mdMatched){
            setFontSize(16);
            return;
        }
        if(smMatched){
            setFontSize(14);
            return;
        }
        if(xsMatched){
            setFontSize(12);
            return;
        }
        return ()=>{
            setFontSize(16);
        }
    },[xsMatched,smMatched,mdMatched])
    
    return (
        <Grid container justifyContent="space-between" alignItems="center" mb={1} mt={1}>
            <Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
                <Image src={NoUserImage} width={80} height={80}></Image>
            </Grid>
            <Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
                <Typography fontSize={fontSize}>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
                <Box display="flex">
                    <Tooltip title={<Image src={NoUserImage} width={30} height={30}/>}>
                        <Typography fontSize={fontSize}>
                            {postBy.username}
                        </Typography>
                    </Tooltip>
                </Box>
            </Grid>
            <Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
                <Typography fontSize={fontSize}>
                    {price}
                </Typography>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Typography>
                    {progress}/{quantity}
                </Typography>
                <React.Fragment>
                    <LinearProgress variant="determinate" value={quantityRatio} style={{width:"80%"}}/>
                </React.Fragment>
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Box mb={2}/>
                <Button variant='contained' color="secondary" fullWidth={xsMatched?true:false} style={{fontSize}}>
                    Đăng ký mua
                </Button>
            </Grid>
        </Grid>
    )
}

export default BuyingRequestCard
