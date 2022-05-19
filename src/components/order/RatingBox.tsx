import { Box, Rating, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useState } from "react";

interface RatingBoxProps {
    name: string;
}

const RatingBox = ({ name }: RatingBoxProps) => {
    const [ratingPoint, setRatingPoint] = useState(0);
    const [comment, setComment] = useState("");
    return (
        <>
            <Box display="flex">
                <Typography>Đánh giá(*):</Typography>&nbsp;
                <Rating
                    name={`rating-${name}`}
                    value={ratingPoint}
                    onChange={(event, newValue) => {
                        setRatingPoint(newValue ? newValue : 0);
                    }}
                ></Rating>
            </Box>
            <Typography>Bình luận</Typography>
            <Box mt={2} />
            <TextField
                multiline
                name={`comment-${name}`}
                rows={4}
                fullWidth
                value={comment}
                onChange={(event: SyntheticEvent) => {
                    const target = event.target as HTMLInputElement;
                    setComment(target.value);
                }}
            />
        </>
    );
};

export default RatingBox;
