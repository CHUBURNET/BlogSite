import React from 'react';
import style from "../../../styles/modules/ProfileSettings/Logout.module.css";
import Button from "../../UI/Button.tsx";
import {axiosInstance} from "../../../utils/api.ts";
import {clearUser} from "../../../redux/slices/userSlice.ts";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import type {LoadingState} from "../../../types/utilsType.ts";

interface ILogout {
    loading: LoadingState;
    setLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
}

const Logout: React.FC<ILogout> = ({loading, setLoading}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function logout(): Promise<void> {
        setLoading("logout");

        try {
            await axiosInstance.post("user/logout", {
                refreshToken: localStorage.getItem("refreshToken"),
            });

            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");

            dispatch(clearUser());
            navigate("/auth");

        } catch (e) {
            console.error(e);
        } finally {
            setLoading("idle");
        }
    }

    return (
        <div className={style.logoutContainer}>
            <p className={style.loadingMessage}>
                {loading === "logout" && "Выполняется выход..."}
            </p>

            <Button
                disabled={loading !== "idle"}
                onClick={logout}
                text={"Выйти"}
                style={{
                    background: "red",
                    width: "100%",
                }}
            />
        </div>
    );
};

export default Logout;