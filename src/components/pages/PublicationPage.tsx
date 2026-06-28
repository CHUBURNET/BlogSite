import React, {useState} from 'react';
import style from "../../styles/pages/PublicationPage.module.css";
import {axiosInstance} from "../../utils/api.ts";
import Button from "../UI/Button.tsx";
import type {INewPost} from "../../types/postType.ts";
import UploadImages from "../UI/UploadImages.tsx";
import axios from "axios";

const PublicationPage: React.FC = () => {

    const [newPostData, setNewPostData] = useState<INewPost>({
        text: "",
        images: null,
        hashtags: [],
    })

    async function newPost(): Promise<void> {
        const formData = new FormData();

        formData.append("text", newPostData.text);
        newPostData.hashtags.forEach((tag) => {
            formData.append("hashtags", tag);
        });

        if (newPostData.images) {
            Array.from(newPostData.images).forEach((file) => {
                formData.append("images", file);
            });
        }
        console.log(newPostData);
        try {
            await axiosInstance.post("post/publish", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (e) {
            if (axios.isAxiosError(e)){
                console.error(e)
            }
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
                <input
                    className={style.input}
                    type="text"
                    placeholder={"Хештеги через пробел"}
                    onChange={(e) => setNewPostData({...newPostData, hashtags: e.target.value.split(", ")})}
                />
                <Button
                    width={"100%"}
                    style={{
                        maxWidth: "505px",
                    }}
                    color={"blue"}
                    onClick={newPost}
                    text={"Опубликовать"}
                />
            </form>
        </div>
    );
};

export default PublicationPage;