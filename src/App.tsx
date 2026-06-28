import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import HomePage from "./components/pages/HomePage.tsx";
import Navigation from "./components/modules/Navigation.tsx";
import GalleryPage from "./components/pages/GalleryPage.tsx";
import AuthPage from "./components/pages/AuthPage.tsx";
import ProfileSettingsPage from "./components/pages/ProfileSettingsPage.tsx";
import type {IUser} from "./types/userType.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "./redux/store.ts";
import PublicationPage from "./components/pages/PublicationPage.tsx";
import {axiosInstance} from "./utils/api.ts";
import axios from "axios";
import {useEffect, useState} from "react";
import type {IPostRender} from "./types/postType.ts";
import ProfilePage from "./components/pages/ProfilePage.tsx";
import {setUser} from "./redux/slices/userSlice.ts";

const App = () => {
    const [posts, setPosts] = useState<IPostRender[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [query, setQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [hashtag, setHashtag] = useState<string>("")

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {pathname} = useLocation()

    const user: IUser = useSelector((state: RootState) => state.user);

    async function getPosts(): Promise<void> {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get(
                `post/list?limit=10&page=${page}&q=${encodeURIComponent(query)}${hashtag ? `&hashtag=${hashtag}` : ""}`
            );

            const newPosts = data.data;

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => {
                    const combined = [...prev, ...newPosts];
                    if (page === 1) localStorage.setItem("posts", JSON.stringify(newPosts));
                    return combined;
                });
            }
        } catch (e) {
            if (axios.isAxiosError(e)) console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    async function getUser(): Promise<void> {
        try {
            const {data} = await axiosInstance.get("/user/me")
            dispatch(setUser(data.data))
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const status = e.response?.status;
                if ((status === 401 || status === 403) && pathname === "/me") {
                    navigate("/");
                }
                console.error("Ошибка при получении данных пользователя:", status);
            }
        }
    }

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [query]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            getPosts();
        }, page === 1 ? 0 : 300);

        return () => clearTimeout(timeout);
    }, [query, page, hashtag]);

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage
                                            setQuery={setQuery}
                                            setHashtag={setHashtag}
                                            setPage={setPage}
                                            posts={posts}
                                            getPosts={getPosts}
                                            isLoading={isLoading}
                                            hasMore={hasMore}
                                         />
                } />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/me">
                    <Route path="" element={<ProfilePage
                                                user={user}
                                            />
                    } />
                    <Route path="settings" element={<ProfileSettingsPage />} />
                </Route>
                <Route path="/user">
                    <Route path=":username" element={<ProfilePage />} />
                </Route>
                <Route path="/publication" element={<PublicationPage />} />
            </Routes>
            <Navigation getUser={getUser} />
        </>
    );
};

export default App;