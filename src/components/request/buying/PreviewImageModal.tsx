import { Box, Modal } from "@mui/material";
import React, { useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import { LayoutContext } from "../../../context/LayoutContext";
import Image from "next/image";
import NoThumbnailImage from "../../../../public/assets/default-thumbnail.jpeg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { UploadFileContext } from "../../../context/UploadFileContext";
interface PreviewImageModalProps {
    images: string[];
    isSendingMessage: boolean;
}

const PreviewImageModal = (props: PreviewImageModalProps) => {
    const { images, isSendingMessage } = props;
    const { changeCurrentFilePaths } = useContext(UploadFileContext);
    const { isTogglePreviewImage, changeIsTogglePreviewImage } = useContext(LayoutContext);
    return (
        <Modal
            open={isTogglePreviewImage}
            onClose={() => {
                changeIsTogglePreviewImage();
                !isSendingMessage && changeCurrentFilePaths([]);
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box width="90%" height="90%" className="central">
                <Carousel
                    className="carousel-100"
                    showThumbs={false}
                    showArrows={true}
                    autoPlay={true}
                    infiniteLoop={true}
                    interval={8000}
                >
                    {images.map((image: string, index) => {
                        if (image && image.length > 0) {
                            return (
                                <div style={{ width: "100%", height: "100%" }}>
                                    <img src={image} className="object-fit-cover" />
                                </div>
                            );
                        }
                        return <Image src={NoThumbnailImage} key={index} />;
                    })}
                </Carousel>
            </Box>
        </Modal>
    );
};

export default PreviewImageModal;
