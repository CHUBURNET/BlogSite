import React, {useState} from 'react';
import style from "../../styles/pages/AuthPage.module.css"
import Button from "../UI/Button.tsx";
import Input from "../UI/Input.tsx";

const AuthPage: React.FC = () => {

    const [action, setAction] = useState(true)

    return (
        <div className={"Page"}>
            <div className={style.container}>
                <div className={style.content}>
                    <h2>{action ? "Вход" : "Регистрация"}</h2>
                    <form>
                        <div className={style.inputs}>
                            <Input
                                placeholder={action ? "Имя пользователя или Email" : "Имя пользователя"}
                                formType={"text"}
                                color={"blue"}
                                style={{width:'100%'}}
                            />
                            {!action &&
                                <Input
                                    placeholder={"email"}
                                    formType={"text"}
                                    color={"blue"}
                                    style={{width:'100%'}}
                                />
                            }
                            <Input
                                placeholder={"Пароль"}
                                formType={"password"}
                                color={"blue"}
                                style={{width:'100%'}}
                            />
                            {!action &&
                                <Input
                                    placeholder={"Повторите пароль"}
                                    formType={"password"}
                                    color={"blue"}
                                    style={{width:'100%'}}
                                />
                            }
                        </div>
                        <Button
                            formType={"submit"}
                            onClick={() => {}}
                            text={action ? "Войти" : "Зарегистрироваться"}
                            style={{width:'100%'}}
                            height={"33px"}
                            color={"blue"}
                            // type={"underline"}
                        />
                    </form>
                    {action ?
                        <span>
                            Нет аккаунта?
                            <button
                                className={style.changeAction}
                                onClick={() => {setAction(false)}}
                            >Зарегистрироваться</button>
                        </span>
                        :
                        <span>
                            Уже есть аккаунт?
                            <button
                                className={style.changeAction}
                                onClick={() => {setAction(true)}}
                            >Войти</button>
                        </span>
                    }
                </div>
            </div>
        </div>
    );
};

export default AuthPage;