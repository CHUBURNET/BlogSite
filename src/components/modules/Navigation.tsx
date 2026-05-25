import React, {useEffect} from 'react';
import style from "../../styles/modules/Navigation.module.css"
import homeIcon from "../../assets/homeIcon.svg"
import userIcon from "../../assets/userIcon.svg"
import galleryIcon from "../../assets/galleryIcon.png"
import {Link, useLocation, useNavigate} from "react-router-dom";
import {axiosInstance} from "../../utils/api.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../redux/slices/userSlice.ts";
import type {IUser} from "../../types/userType.ts";
import axios from "axios";
import type {RootState} from "../../redux/store.ts";

interface IProps {
    username?: string
}

const Navigation: React.FC<IProps> = ({username}) => {
    const navigate = useNavigate();
    const {pathname} = useLocation()
    const dispatch = useDispatch();
    const user:IUser = useSelector((state: RootState) => state.user);

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
        if(localStorage.getItem("refreshToken")){
            getUser();
        }
    }, []);


    return (
        <footer className={style.footer}>
            <div className={style.buttonsContainer}>
                <Link to={"/gallery"}>
                    <div className={style.buttonLink}>
                        <img style={{width: "30px"}} src={galleryIcon} alt=""/>
                    </div>
                </Link>
                <div className={style.buttonHome}>
                    <Link to={"/"}>
                        <button title={"На главную"}>
                            <img src={homeIcon} alt=""/>
                        </button>
                    </Link>
                </div>
                <div className={style.linksList}>
                    {username ?
                        <div className={style.buttonLink}>
                            <img src={userIcon} alt="user"/>
                            <span>{username}</span>
                        </div>
                        :
                        <Link to={user.username ? "/me" : "/auth"}>
                            <div className={style.buttonLink}>
                                <img src={userIcon} alt="user"/>
                                <span>{user.username || "Авторизация"}</span>
                            </div>
                        </Link>
                    }

                </div>
            </div>
        </footer>
    );
};

export default Navigation;