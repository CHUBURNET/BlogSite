import React from 'react';

interface IProps {
    text?: string,
    width?: string,
    height?: string,
    placeholder?: string,
    error?: boolean,
    style?: React.CSSProperties,
    variant?: "default" | "underline",
    color?: "blue" | "gray",
    formType?: "button" | "submit" | "reset" | "password" | "text" | "email",
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    name?: string,
    value?: string,
    field?: any,
}

const Input: React.FC<IProps> = ({
                                     field,
                                     value,
                                     name,
                                     width,
                                     error,
                                     height,
                                     placeholder = "",
                                     formType = "text",
                                     color,
                                     variant,
                                     style,
                                     onChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log(e.target.value),
                                 }) => {

    const styleDefault: React.CSSProperties = {
        backgroundColor: color === "blue" ? 'var(--brand-color)' : "gray",
        width: width || '100%',
        height: height || '30px',
        borderRadius: '10px',
        color: "white",
        padding: '10px',
        border: `1px solid ${error ? "red" : "none"}`,
        ...style
    }

    const styleUnderline: React.CSSProperties = {
        backgroundColor: 'transparent',
        width: width || '100%',
        height: height || '30px',
        borderRadius: '10px',
        padding: '10px',
        border: `2px solid ${error ? "red" : "none"}`,
        // border: `2px solid ${color === "blue" ? 'var(--brand-color)' : "gray"}`,
        color: color === "blue" ? 'var(--text-color)' : "gray",
        ...style
    }

    return (
        <input
            {...field}
            value={value}
            name={name}
            placeholder={placeholder}
            type={formType}
            className={"inputActive"}
            style={variant === "default" ? styleDefault : styleUnderline}
            onChange={onChange}
        />
    );
};

export default Input;