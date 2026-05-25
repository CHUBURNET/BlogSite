import React, { type ChangeEvent, useState, useEffect } from 'react';
import style from "../../styles/UI/UploadImages.module.css";
import uploadIcon from "../../assets/upload.png";

interface IUploadImages {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UploadImages: React.FC<IUploadImages> = ({ onChange }) => {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles);
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));

            setPreviews(newPreviews);
        }

        onChange(e);
    };

    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);

    return (
        <div className={style.container}>
            <div className={style.previewGrid}>
                {previews.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`preview ${index}`}
                        className={style.previewImage}
                    />
                ))}
            </div>

            <label className={style.uploadLabel}>
                <img className={style.icon} src={uploadIcon} alt="upload" />
                <input
                    onChange={handleFileChange}
                    type="file"
                    multiple
                    accept=".jpg, .jpeg, .png, .webp, .gif"
                    className={style.hiddenInput}
                />
            </label>
        </div>
    );
};

export default UploadImages;