import React, {useState} from 'react';
import style from "../../styles/pages/PublicationPage.module.css";
import {axiosInstance} from "../../utils/api.ts";
import Button from "../UI/Button.tsx";
import type {INewPost} from "../../types/postType.ts";
import UploadImages from "../UI/UploadImages.tsx";

const PublicationPage: React.FC = () => {

    const [newPostData, setNewPostData] = useState<INewPost>({
        text: "",
        images: null,
    })

    async function newPost(): Promise<void> {
        const formData = new FormData();

        formData.append("text", newPostData.text);

        if (newPostData.images) {
            Array.from(newPostData.images).forEach((file) => {
                formData.append("images", file);
            });
        }

        try {
            const {data} = await axiosInstance.post("post/publish", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={style.container}>
            <form className={style.form}>
                <UploadImages
                    onChange={(e) => setNewPostData({...newPostData, images: e.target.files})}
                />
                <textarea
                    value={newPostData.text}
                    onChange={(e) => setNewPostData({...newPostData, text:e.target.value})}
                    placeholder={"Текст публикации"}

                    cols={30}
                    rows={10}
                />
                <Button
                    width={"100%"}
                    color={"blue"}
                    onClick={newPost}
                    text={"Опубликовать"}
                />
            </form>
        </div>
    );
};

export default PublicationPage;