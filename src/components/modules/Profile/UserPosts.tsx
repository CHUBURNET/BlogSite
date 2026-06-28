import React, { useEffect, useRef, useState, useCallback } from "react";
import { axiosInstance } from "../../../utils/api.ts";
import type { IPostRender } from "../../../types/postType.ts";
import Post from "../Post/Post.tsx";
import type { IUser } from "../../../types/userType.ts";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store.ts";
import axios from "axios";

interface IUserPosts {
    userId?: number;
    username: string | undefined;
}

const LIMIT = 10;

const UserPosts: React.FC<IUserPosts> = ({ username, userId }) => {

    const [posts, setPosts] = useState<IPostRender[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const user: IUser = useSelector(
        (state: RootState) => state.user
    );

    const observerTarget = useRef<HTMLDivElement | null>(null);

    const getUserPosts = useCallback(async (): Promise<void> => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {

            let url = "";

            if (userId) {
                url = `/post/user/${userId}?limit=${LIMIT}&page=${page}`;
            } else if (username) {
                url = `/post/user/username/${username}?limit=${LIMIT}&page=${page}`;
            } else {
                return;
            }

            const { data } = await axiosInstance.get(url);
            const newPosts: IPostRender[] = data.data || [];

            if (!newPosts.length) {
                setHasMore(false);
                return;
            }
            setPosts((prev) => {
                const combined = [...prev, ...newPosts];

                const uniquePosts = combined.filter(
                    (post, index, arr) =>
                        arr.findIndex(p => p.id === post.id) === index
                );
                if (page === 1) {
                    localStorage.setItem(
                        "posts",
                        JSON.stringify(newPosts)
                    );
                }
                return uniquePosts;
            });
            if (newPosts.length < LIMIT) {
                setHasMore(false);
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error(e.response?.data || e.message);
            }
        } finally {
            setIsLoading(false);
        }
    }, [userId, username, page, isLoading, hasMore]);

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [userId, username]);

    useEffect(() => {
        getUserPosts();
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    !isLoading &&
                    hasMore
                ) {
                    setPage(prev => prev + 1);
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px 400px 0px"
            }
        );

        const currentTarget = observerTarget.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
            observer.disconnect();
        };
    }, [isLoading, hasMore]);



    return (
        <div>
            <div style={{paddingBottom: "50px"}}>
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        author={post.author_username}
                        images={post.images}
                        text={post.text}
                        hashtags={post.hashtags}
                        likes={post.likes_count}
                        dislikes={post.dislikes_count}
                        isDisliked={
                            post.user_reaction === "dislike"
                        }
                        isLiked={
                            post.user_reaction === "like"
                        }
                        getPosts={getUserPosts}
                        username={user.username}
                        comments_count={post.comments_count}
                        comments={post.comments}
                    />
                ))}
                {posts.length <= 0 && <div style={{textAlign: "center", width: "100%"}}>Нет постов</div>}
            </div>
            {isLoading && (
                <p
                    style={{
                        width: "100%",
                        textAlign: "center"
                    }}
                >Загрузка...</p>
            )}
            <div
                ref={observerTarget}
                style={{
                    height: "20px"
                }}
            />
        </div>
    );
};

export default UserPosts;
