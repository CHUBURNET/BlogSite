import React, {useState} from 'react';
import style from "../../styles/pages/AuthPage.module.css"
import Button from "../UI/Button.tsx";
import Input from "../UI/Input.tsx";
import {axiosInstance} from "../../utils/api.ts";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setUser} from "../../redux/slices/userSlice.ts";

interface IUser {
    username: string;
    email: string;
    password: string;
    password2: string;
}

const AuthPage: React.FC = () => {
    const [action, setAction] = useState<boolean>(true);
    const [userData, setUserData] = useState<IUser>({
        username: "",
        email: "",
        password: "",
        password2: "",
    })

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        if (action) {
            try {
                const {data} = await axiosInstance.post("/user/login/", {
                    email: userData.email,
                    password: userData.password,
                    password2: userData.password2,
                    identifier: userData.username,
                })
                dispatch(setUser(data.data.user));
                localStorage.setItem("refreshToken", data.data.refreshToken)
                localStorage.setItem("accessToken", data.data.accessToken)
                navigate("/");
            } catch (e) {
                console.log(e)
            }
        } else {
            const {data} = await axiosInstance.post("user/register/", {
                email: userData.email,
                password: userData.password,
                password2: userData.password2,
                username: userData.username,
            })
            localStorage.setItem("refreshToken", data.data.refreshToken)
            localStorage.setItem("accessToken", data.data.accessToken)
            navigate("/me");
        }



    };


    return (
        <div className="Page">
            <div className={style.container}>
                <div className={style.content}>
                    <h2>{action ? "Вход" : "Регистрация"}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className={style.inputs}>
                            <Input
                                value={userData.username}
                                name={"username"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setUserData({...userData, username: e.target.value})
                                }
                                placeholder={action ? "Имя пользователя или Email" : "Имя пользователя"}
                                formType="text"
                                style={{ width: '100%' }}
                            />
                            {!action && (
                                <Input
                                    value={userData.email}
                                    name={"email"}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({...userData, email: e.target.value})}
                                    placeholder="Email"
                                    formType="email"
                                    style={{ width: '100%' }}
                                />
                            )}
                            <Input
                                value={userData.password}
                                name={"password"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({...userData, password: e.target.value})}
                                placeholder="Пароль"
                                formType="password"
                                style={{ width: '100%' }}
                            />
                            {!action && (
                                <Input
                                    value={userData.password2}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({...userData, password2: e.target.value})}
                                    error={userData.password !== userData.password2 && userData.password !== "" && userData.password2 !== ""}
                                    placeholder="Повторите пароль"
                                    formType="password"
                                    style={{ width: '100%' }}
                                />
                            )}
                        </div>

                        <Button
                            onClick={() => {}}
                            formType="submit"
                            text={action ? "Войти" : "Зарегистрироваться"}
                            style={{ width: '100%', marginTop: '10px' }}
                            height="40px"
                            color="blue"
                        />
                    </form>

                    <div>
                        <span>{action ? "Нет аккаунта?" : "Уже есть аккаунт?"}</span>
                        <button
                            type="button"
                            className={style.changeAction}
                            onClick={() => setAction(!action)}
                        >
                            {action ? "Зарегистрироваться" : "Войти"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;