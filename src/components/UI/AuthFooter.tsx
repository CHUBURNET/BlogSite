import React from 'react';
import style from "../../styles/UI/AuthFooter.module.css";

interface IAuthFooter {
    action: boolean
    setAction: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthFooter: React.FC<IAuthFooter> = ({action, setAction}) => {
    return (
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
    );
};

export default AuthFooter;