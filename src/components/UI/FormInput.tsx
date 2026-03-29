import React from 'react';

interface IProps {
    field: any;
    placeholder?: string;
    error?: boolean;
    formType?: string;
    style?: React.CSSProperties;
}

const FormInput: React.FC<IProps> = ({
                                     field,
                                     placeholder = "",
                                     error,
                                     formType = "text",
                                     style
                                 }) => {

    return (
        <input
            {...field}
            placeholder={placeholder}
            type={formType}
            className="inputActive"
            style={{
                width: "100%",
                height: "35px",
                borderRadius: "8px",
                padding: "8px",
                border: error ? "2px solid red" : "1px solid gray",
                ...style
            }}
        />
    );
};

export default FormInput;
