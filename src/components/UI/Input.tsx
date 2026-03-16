import React from 'react';

interface IProps {
    text?: string
    width?: string
    height?: string
    placeholder?: string
    style?: React.CSSProperties
    variant?: "default" | "underline"
    color?: "blue" | "gray"
    onChange?: () => void
    formType?: "button" | "submit" | "reset" | "password" | "text" | "email"
}

const Input: React.FC<IProps> = ({width, height, placeholder="", formType = "text", color, variant, style, onChange = (e: any) => console.log(e.target.value)}) => {

    const styleDefault: React.CSSProperties = {
        backgroundColor: color === "blue" ? 'var(--brand-color)' : "gray",
        width: width || '100px',
        height: height || '30px',
        borderRadius: '10px',
        color: "white",
        padding: '10px',
        ...style
    }

    const styleUnderline: React.CSSProperties = {
        backgroundColor: 'transparent',
        width: width || '100px',
        height: height || '30px',
        borderRadius: '10px',
        padding: '10px',
        // border: `2px solid ${color === "blue" ? 'var(--brand-color)' : "gray"}`,
        color: color === "blue" ? 'var(--text-color)' : "gray",
        ...style
    }

    return (
        <input
            placeholder={placeholder}
            type={formType}
            className={"inputActive"}
            style={variant === "default" ? styleDefault : styleUnderline}
            onChange={onChange}
        />
    );
};

export default Input;