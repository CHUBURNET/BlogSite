import React, {useState} from 'react';
import {CustomCarousel as CustomSlider} from "./CustomSlider.tsx";
import style from "../../styles/modules/Message.module.css"
import Line from "../UI/Line.tsx";
import {axiosInstance} from "../../utils/api.ts";
import type {INewPost} from "../../types/postType.ts";
import Button from "../UI/Button.tsx";
import UploadImages from "../UI/UploadImages.tsx";

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

    const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [editPostdata, setEditPostdata] = useState<INewPost>({
        text: text,
        images: null,
    })

    async function sendReaction(id: number, type: string) {
        try {
            const {data} = await axiosInstance.post("post/reaction", {
                "postId": id,
                "type": type
            })
            getPosts()
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }
    
    async function editPost(): Promise<void> {

        const formData = new FormData();

        formData.append("text", editPostdata.text);
        if (editPostdata.images) {
            Array.from(editPostdata.images).forEach((file) => {
                formData.append("images", file);
            });
        }

        try {
            const {data} = await axiosInstance.put(`post/edit/${id}`, formData)
            setIsEditMode(false)
            getPosts()
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    async function deletePost(): Promise<void> {
        try {
            const {data} = await axiosInstance.delete(`post/${id}`);
            console.log(data)
            getPosts()
        } catch (e) {
            console.log(e)
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
                                setEditPostdata({ ...editPostdata, images: e.target.files });
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
                        value={editPostdata.text}
                        onChange={(e) => setEditPostdata({...editPostdata, text: e.target.value})}
                    />
                    :
                    <h2>{text}</h2>
                }

            </div>
            <div className={style.MessageReactionsContainer}>
                <div
                    style={{
                        textAlign: "left",
                        background: isLiked ? "var(--brand-color)" : "var(--page-background)",
                        color: isLiked ? "var(--main-color)" : "var(--text-color)",
                        padding: "5px",
                        borderBottomLeftRadius: "25px",
                        borderTopLeftRadius: "25px",
                        width: "100%",
                    }}
                >
                    <button onClick={() => {
                        sendReaction(id, "like")
                    }}>
                        <span>👍</span>
                        <span>{likes}</span>
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
                        background: isDisliked ? "var(--brand-color)" : "var(--page-background)",
                        color: isDisliked ? "var(--main-color)" : "var(--text-color)",
                        padding: "5px",
                        borderBottomRightRadius: "25px",
                        borderTopRightRadius: "25px",
                        width: "100%",
                    }}
                >
                    <button onClick={() => {
                        sendReaction(id, "dislike")
                    }}>
                        <span>{dislikes}</span>
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