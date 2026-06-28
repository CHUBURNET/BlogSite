import React, {useEffect} from 'react';
import style from "../../styles/modules/Navigation.module.css"
import homeIcon from "../../assets/homeIcon.svg"
import userIcon from "../../assets/userIcon.svg"
import galleryIcon from "../../assets/galleryIcon.png"
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import type {IUser} from "../../types/userType.ts";
import type {RootState} from "../../redux/store.ts";

interface IProps {
    username?: string
    getUser: () => Promise<void>
}

const Navigation: React.FC<IProps> = ({username, getUser}) => {

    const user:IUser = useSelector((state: RootState) => state.user);



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