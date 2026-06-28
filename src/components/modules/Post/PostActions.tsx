import React, {useState} from 'react';
import style from "../../../styles/modules/Post/PostActions.module.css";
import editIcon from "../../../assets/editIcon.svg";
import deleteIcon from "../../../assets/deleteIcon.svg";
import {axiosInstance} from "../../../utils/api.ts";
import axios from "axios";

interface IPostActions {
    postId: number;
    getPosts: () => Promise<void>;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    isEditMode: boolean;
}

const PostActions: React.FC<IPostActions> = ({postId, getPosts, setIsEditMode, isEditMode}) => {
    const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)

    async function deletePost(): Promise<void> {
        try {
            await axiosInstance.delete(`post/${postId}`);
        } catch (e) {
            if (axios.isAxiosError(e)){
                console.error(e)
            }
        } finally {
            getPosts()
        }
    }

    return (
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
                                margin: "10px",
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
                        >
                            <img src={editIcon} alt="edit"/>
                        </button>
                        <button
                            onClick={() => setIsDeleteConfirm(true)}
                            className={style.actionBtn}
                        >
                            <img src={deleteIcon} alt="delete"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default PostActions;