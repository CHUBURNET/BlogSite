import React, {useState} from 'react';
import type {IUser} from "../../types/userType.ts";
import {useDispatch, useSelector} from "react-redux";
import Input from "../UI/Input.tsx";
import style from "../../styles/pages/ProfilePage.module.css"
import Button from "../UI/Button.tsx";
import {axiosInstance} from "../../utils/api.ts";
import {useNavigate} from "react-router-dom";
import {clearUser} from "../../redux/slices/userSlice.ts";
import type {RootState} from "../../redux/store.ts";

interface INewPassword {
    oldPassword: string,
    newPassword: string
    newPassword2: string
}

const ProfilePage: React.FC = () => {
    const [changePasswordState, setChangePasswordState] = useState<INewPassword>({
        oldPassword: "",
        newPassword: "",
        newPassword2: "",
    })

    const user:IUser = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function logout(): Promise<void> {
        try {
            const {data} = await axiosInstance.post("user/logout", {
                refreshToken: localStorage.getItem("refreshToken"),
            });
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            dispatch(clearUser());
            navigate("/auth");
            console.log(data);
        } catch (e) {
            console.log(e)
        }
    }

    async function changePassword(): Promise<void> {
        if (changePasswordState.newPassword2 !== changePasswordState.newPassword2) {
            console.log("net")
            return
        }
        try {
            const {data} = await axiosInstance.post("user/change-password", changePasswordState);
            console.log(data);
        } catch (e) {
            console.log(e)
        }
    }

    console.log(changePasswordState)

    return (
        <div className={style.page}>
            <div className={style.mainInfo}>
                <div className={style.avatar}>
                    <img src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.username}`} alt=""/>
                </div>

                {/*<Avatar seed={user.username}/>*/}
                <div>
                    <div className={style.textInfo}>
                        <div>
                            <div>Имя:</div>
                            <div>Почта:</div>
                        </div>
                        <div>
                            <div>{user.username}</div>
                            <div>{user.email}</div>
                        </div>
                    </div>
                    <div className={style.profileBtnChange}>
                        <Button
                            text={"Изменить"}
                            color={"blue"}
                            width={"100%"}
                        />
                    </div>
                </div>


            </div>
            <div className={style.changePasswordContainer}>
                <h3>Сменить пароль</h3>
                <div className={style.changePasswordInputContainer}>
                    <Input
                        formType={"password"}
                        value={changePasswordState.oldPassword}
                        name={"oldPassword"}
                        placeholder={"Старый пароль"}
                        onChange={(e) => {
                            setChangePasswordState({...changePasswordState, oldPassword: e.target.value});
                        }}
                    />
                    <Input
                        formType={"password"}
                        value={changePasswordState.newPassword}
                        name={"newPassword"}
                        placeholder={"Новый пароль"}
                        onChange={(e) => {
                            setChangePasswordState({...changePasswordState, newPassword: e.target.value});
                        }}
                    />
                    <Input
                        formType={"password"}
                        value={changePasswordState.newPassword2}
                        placeholder={"Повторите пароль"}
                        onChange={(e) => {
                            setChangePasswordState({...changePasswordState, newPassword2: e.target.value});
                        }}
                    />
                    <Button
                        text={"Подтвердить"}
                        width={"100%"}
                        color={"blue"}
                        onClick={changePassword}
                    />
                </div>
            </div>
            <div className={style.logoutContainer}>
                <Button
                    onClick={logout}
                    text={"Выйти"}
                    style={{
                        background: "red",
                        width: "100%",
                    }}
                />
            </div>
        </div>
    );
};

export default ProfilePage;