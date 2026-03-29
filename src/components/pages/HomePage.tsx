import React, {useEffect, useState} from 'react';
import Message from "../modules/Message.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";
import Button from "../UI/Button.tsx";
import {Link} from "react-router-dom";
import type {IUser} from "../../types/userType.ts";
import {axiosInstance} from "../../utils/api.ts";
import type {IPostRender} from "../../types/postType.ts";
import axios from "axios";
// import style from "../../styles/pages/HomePage.module.css"


const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<IPostRender[]>(() => {
        const saved = localStorage.getItem("posts");
        return saved ? JSON.parse(saved) : [];
    });
    const user: IUser = useSelector((state: RootState) => state.user);

    async function getPosts() {
        try {
            const {data} = await axiosInstance.get("post/list?limit=10&page=1");
            setPosts(data.data);
            localStorage.setItem("posts", JSON.stringify(data.data));
        } catch (e) {
            if (axios.isAxiosError(e)){
                console.error(e)
            }

        }
    }



    useEffect(() => {
        getPosts()
    }, [])

    return (
        <div className={"Page"}>
            <div>
                {user.isAdmin &&
                    <Link to={"/publication"}>
                        <Button
                            text={"+"}
                            color={"blue"}
                            width={"100%"}
                            style={{
                                margin: "10px auto",
                                fontSize: "24px",
                            }}
                        />
                    </Link>
                }
            </div>
            <div>
                {posts.map((post: IPostRender) =>
                    <Message
                        key={post.id}
                        id={post.id}
                        author={post.author_username}
                        images={post.images}
                        text={post.text}
                        likes={post.likes_count}
                        dislikes={post.dislikes_count}
                        isDisliked={post.user_reaction === "dislike"}
                        isLiked={post.user_reaction === "like"}
                        getPosts={getPosts}
                        isAdmin={user.isAdmin}
                        username={user.username}
                    />
                )}
            </div>

        </div>
    );
};

export default HomePage;