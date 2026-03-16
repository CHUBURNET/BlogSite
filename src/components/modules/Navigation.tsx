import React from 'react';
import style from "../../styles/modules/Navigation.module.css"
import homeIcon from "../../assets/homeIcon.svg"
import userIcon from "../../assets/userIcon.svg"
import okakIcon from "../../assets/secret.png"
import {Link} from "react-router-dom";

interface IProps {
    username?: string
}

const Navigation: React.FC<IProps> = ({username}) => {
    return (
        <footer className={style.footer}>
            <div className={style.buttonsContainer}>
                <Link to={"/surprise"}>
                    <div className={style.buttonLink}>
                        <img style={{width: "30px"}} src={okakIcon} alt=""/>
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
                        <Link to="/auth">
                            <div className={style.buttonLink}>
                                <img src={userIcon} alt="user"/>
                                <span>{username || "Авторизация"}</span>
                            </div>
                        </Link>
                    }

                </div>
            </div>
        </footer>
    );
};

export default Navigation;