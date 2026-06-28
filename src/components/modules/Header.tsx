import React from 'react';
import style from "../../styles/modules/Header.module.css"
import Input from "../UI/Input.tsx";
import searchIcon from "../../assets/searchIcon.svg"

interface IHeader {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<IHeader> = ({setQuery}) => {
    return (
        <div className={style.container}>
            <div className={style.searchWrapper}>
                <Input
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        paddingRight: "35px",
                    }}
                />
                <img className={style.searchIcon} src={searchIcon} alt="search"/>
            </div>
        </div>

    );
};

export default Header;