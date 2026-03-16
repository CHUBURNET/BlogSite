import React from "react";

interface Props {
    type?: "horizontal" | "vertical",
    color?: string,
    width: string,
    style?: {
        margin?: string,
        marginLeft?: string,
        marginRight?: string,
        marginBottom?: string,
        marginTop?: string,
    },
}

const Line: React.FC<Props> = ({type = "horizontal", color, width, style}) => {
    return (
        <div
            style={{
                backgroundColor: color || "var(--main-color)",
                width: type === "horizontal" ? "100%" : width,
                height: type === "horizontal" ? width : "100%",
                ...style,
            }}
        />
    );
};

export default Line;
