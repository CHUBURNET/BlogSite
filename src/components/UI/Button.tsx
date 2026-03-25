import React from 'react';

interface IProps {
    text?: string
    width?: string
    height?: string
    style?: React.CSSProperties
    variant?: "default" | "underline"
    color?: "blue" | "gray"
    onClick?: () => void
    formType?: "button" | "submit" | "reset"
}

const Button: React.FC<IProps> = ({
                                      formType = "button",
                                      variant = "default",
                                      text,
                                      width,
                                      height,
                                      style,
                                      color = "gray",
                                      onClick
                                  }) => {

    const styleDefault: React.CSSProperties = {
        backgroundColor: color === "blue" ? 'var(--brand-color)' : "gray",
        width: width || '100px',
        height: height || '30px',
        borderRadius: '10px',
        color: "white",
        ...style
    }

    const styleUnderline: React.CSSProperties = {
        backgroundColor: 'transparent',
        width: width || '100px',
        height: height || '30px',
        borderRadius: '10px',
        border: `2px solid ${color === "blue" ? 'var(--brand-color)' : "gray"}`,
        color: color === "blue" ? 'var(--text-color)' : "gray",
        ...style
    }

    return (
        <button
            type={formType}
            className="buttonHover"
            style={variant === "default" ? styleDefault : styleUnderline}
            onClick={onClick}
        >
            {text || ""}
        </button>
    );
};

export default Button;