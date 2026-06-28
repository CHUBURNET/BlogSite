import { Controller } from "react-hook-form";
import FormInput from "./FormInput.tsx";
import type {
    Control,
    FieldValues,
    Path,
    RegisterOptions
} from "react-hook-form";

interface IFormController<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    placeholder: string;
    error?: boolean;
    rules?: RegisterOptions<T, Path<T>>;
    formType?: string;
}


const FormController = <T extends FieldValues>({
                                                   name,
                                                   control,
                                                   placeholder,
                                                   error,
                                                   rules,
                                                   formType
                                               }: IFormController<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <FormInput
                    field={field}
                    placeholder={placeholder}
                    error={error}
                    formType={formType}
                />
            )}
        />
    );
};

export default FormController;
