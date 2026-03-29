import React, {useState} from 'react';
import {CustomCarousel as CustomSlider} from "./CustomSlider.tsx";
import style from "../../styles/modules/Message.module.css"
import Line from "../UI/Line.tsx";
import {axiosInstance} from "../../utils/api.ts";
import type {INewPost} from "../../types/postType.ts";
import Button from "../UI/Button.tsx";
import UploadImages from "../UI/UploadImages.tsx";
import axios from "axios";

interface Props {
    images: string[];
    text: string;
    likes: string;
    dislikes: string;
    isLiked: boolean;
    isDisliked: boolean;
    author?: string;
    getPosts: () => Promise<void>;
    id: number;
    isAdmin?: boolean;
    username: string;
}

const Message: React.FC<Props> = ({username, isAdmin=false, id, images, author, text, likes, dislikes, isLiked = false, isDisliked = false, getPosts}) => {

    const [dislikeState, setDislikeState] = useState<boolean>(isDisliked);
    const [likeState, setLikeState] = useState<boolean>(isLiked);
    const [likeCount, setLikeCount] = useState<number>(Number(likes));
    const [dislikeCount, setDislikeCount] = useState<number>(Number(dislikes));

    const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [editPostData, setEditPostData] = useState<INewPost>({
        text: text,
        images: null,
    })

    async function sendReaction(id: number, type: string) {
        if (type === "dislike") {
            setLikeState(false);
            if (!dislikeState) {
                setDislikeState(true);
                setDislikeCount(dislikeCount + 1);
                setLikeCount(likeCount - 1);
            } else {
                setDislikeState( false);
                setDislikeCount(dislikeCount - 1);
            }

        } else if (type === "like") {
            setDislikeState(false);
            if (!likeState) {
                setLikeState(true);
                setLikeCount(likeCount + 1);
                setDislikeCount(dislikeCount - 1);
            } else {
                setLikeState(false);
                setLikeCount(likeCount - 1);
            }
        }
        try {
            const {data} = await axiosInstance.post("post/reaction", {
                "postId": id,
                "type": type
            })
            console.log(data)
            getPosts()
        } catch (e) {
            if (type === "dislike") {
                setDislikeState(false);
                setDislikeCount(dislikeCount - 1);
            } else if (type === "like") {
                setLikeState(false);
                setLikeCount(likeCount - 1);
            }
            if (axios.isAxiosError(e)){
                console.error(e)
            }
        }
    }
    
    async function editPost(): Promise<void> {

        const formData = new FormData();

        formData.append("text", editPostData.text);
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

    async function deletePost(): Promise<void> {
        try {
            await axiosInstance.delete(`post/${id}`);
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
            {(isAdmin && author === username) &&
                <div className={style.actionsContainer}>

                    <div>
                        {isDeleteConfirm ?
                            <div className={style.btnsActionContainer}>
                                <button
                                    onClick={() => setIsDeleteConfirm(false)}
                                    className={style.actionBtn}
                                >Отмена</button>
                                <button
                                    onClick={deletePost}
                                    style={{
                                        color: "#ff5b5b",
                                        fontWeight: "500",
                                    }}
                                    className={style.actionBtn}
                                >Удалить</button>
                            </div>
                            :
                            <div className={style.btnsActionContainer}>
                                <button
                                    onClick={() => setIsEditMode(!isEditMode)}
                                    className={style.actionBtn}
                                >edit</button>
                                <button
                                    onClick={() => setIsDeleteConfirm(true)}
                                    className={style.actionBtn}
                                >delete</button>
                            </div>
                        }
                    </div>
                </div>
            }

            <div className={style.authorSection}>
                <img src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${author}`} alt=""/>
                <span>{author}</span>
            </div>
            {isEditMode ?
                <div >
                    <UploadImages
                        onChange={(e) => {
                            if (e.target.files) {
                                setEditPostData({ ...editPostData, images: e.target.files });
                            }
                        }}
                    />
                </div>
                :
                <CustomSlider>
                    {images.map((image: string) =>
                        <img src={image} alt=""/>
                    )}
                </CustomSlider>
            }

            <div className={style.MessageText}>
                {isEditMode ?
                    <textarea
                        cols={30}
                        rows={10}
                        value={editPostData.text}
                        onChange={(e) => setEditPostData({...editPostData, text: e.target.value})}
                    />
                    :
                    <h2>{text}</h2>
                }

            </div>
            <div className={style.MessageReactionsContainer}>
                <div
                    style={{
                        textAlign: "left",
                        background: likeState ? "var(--brand-color)" : "var(--page-background)",
                        color: likeState ? "var(--main-color)" : "var(--text-color)",
                        padding: "5px",
                        borderBottomLeftRadius: "25px",
                        borderTopLeftRadius: "25px",
                        width: "100%",
                    }}
                >
                    <button onClick={async () => {
                        await sendReaction(id, "like")
                    }}>
                        <span>👍</span>
                        <span>{likeCount}</span>
                    </button>
                </div>
                <div>
                    <Line
                        style={{
                            marginLeft: "5px",
                        }}
                        width={"1px"}
                        type={"vertical"}
                    />
                </div>
                <div
                    style={{
                        textAlign: "right",
                        background: dislikeState ? "var(--brand-color)" : "var(--page-background)",
                        color: dislikeState ? "var(--main-color)" : "var(--text-color)",
                        padding: "5px",
                        borderBottomRightRadius: "25px",
                        borderTopRightRadius: "25px",
                        width: "100%",
                    }}
                >
                    <button onClick={async () => {
                        await sendReaction(id, "dislike")
                    }}>
                        <span>{dislikeCount}</span>
                        <span>👎</span>
                    </button>
                </div>
            </div>
            {isEditMode &&
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
            }
        </div>
    );
};

export default Message;