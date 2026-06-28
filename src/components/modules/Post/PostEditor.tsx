import React, {useState} from 'react';
import axios from "axios";
import style from "../../../styles/modules/Post/PostEditor.module.css"
import type {IHashtags, INewPost} from "../../../types/postType.ts";
import {axiosInstance} from "../../../utils/api.ts";
import Button from "../../UI/Button.tsx";
import UploadImages from "../../UI/UploadImages.tsx";
import Author from "../../UI/Author.tsx";

interface IPostEditor {
    text: string;
    id: number;
    hashtags: IHashtags[];
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    getPosts: () => Promise<void>;
    author: string | undefined;
    isEditMode: boolean;
}

const PostEditor: React.FC<IPostEditor> = ({text, hashtags, id, setIsEditMode, getPosts, author, isEditMode}) => {
    const [editPostData, setEditPostData] = useState<INewPost>({
        text: text,
        images: null,
        hashtags: hashtags.map(h => h.name),
    })

    async function editPost(): Promise<void> {
        const formData = new FormData();

        formData.append("text", editPostData.text);
        editPostData.hashtags.forEach((tag) => {
            formData.append("hashtags", tag);
        });

        if (editPostData.images) {
            Array.from(editPostData.images).forEach((file) => {
                formData.append("images", file);
            });
        }

        try {
            await axiosInstance.put(`post/edit/${id}`, formData)
            setIsEditMode(false)
            getPosts()
        } catch (e) {
            if (axios.isAxiosError(e)){
                console.error(e)
            }
        }
    }

    return (
        <div
            className={style.MessageContainer}
        >
            <Author
                author={author}
            />
            <div >
                <UploadImages
                    onChange={(e) => {
                        if (e.target.files) {
                            setEditPostData({ ...editPostData, images: e.target.files });
                        }
                    }}
                />
            </div>
            <div className={style.MessageText}>
                <textarea
                    className={style.textArea}
                    cols={30}
                    rows={10}
                    value={editPostData.text}
                    onChange={(e) => setEditPostData({...editPostData, text: e.target.value})}
                />
            </div>
            <div className={style.MessageText}>
                <input
                    className={style.input}
                    value={editPostData.hashtags.join(", ")}
                    onChange={(e) => setEditPostData({...editPostData, hashtags: e.target.value.split(", ")})}
                />
            </div>
            <div className={style.btnsActionContainer}>
                <Button
                    width={"49%"}
                    text={"Отмена"}
                    onClick={() => setIsEditMode(!isEditMode)}
                />
                <Button
                    onClick={editPost}
                    width={"49%"}
                    color={"blue"}
                    text={"Сохранить"}
                />
            </div>
        </div>
    );
};

export default PostEditor;