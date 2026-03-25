import React, {useEffect, useState} from 'react';
import style from "../../styles/pages/GalleryPage.module.css";
import {axiosInstance} from "../../utils/api.ts";
import type {IGalleryItem} from "../../types/postType.ts";

const GalleryPage: React.FC = () => {

    const [images, setImages] = useState<IGalleryItem[]>()

    async function getPhotos(): Promise<void> {
        try {
            const {data} = await axiosInstance.get("/post/images")
            setImages(data.data.items)
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getPhotos()
    }, []);

    return (
        <div className={`Page ${style.container}`}>
            <div className={style.imageList}>
                {images?.map((image) =>
                    <img
                        key={image.image_url}
                        src={image.image_url}
                        alt={image.post_text}
                    />
                )}
            </div>
        </div>
    );
};

export default GalleryPage;