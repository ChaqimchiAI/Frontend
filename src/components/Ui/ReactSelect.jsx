import Select from "react-select"
import { useTheme } from "../../Context/Context"
import clsx from "clsx"
import React, { useId } from "react"

const ReactSelect = ({
    className,
    containerClassName,
    labelClassName,
    label,
    id,
    styles,
    ...props
}) => {
    const { theme } = useTheme();
    const autoId = useId();
    const selectId = id ?? autoId;

    const customStyles = {
        control: (base, state) => ({
            ...base,
            background: !theme ? "#15263a" : "#fff",
            borderColor: state.isFocused ? "#0881c2" : (!theme ? "rgba(255,255,255,0.1)" : "#dee2e6"),
            boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(8, 129, 194, 0.25)" : null,
            borderRadius: "0.375rem",
            padding: "2px 4px",
            minHeight: "38px",
            transition: "all 0.2s ease",
            "&:hover": {
                borderColor: state.isFocused ? "#0881c2" : (!theme ? "rgba(255,255,255,0.2)" : "#bcbebf"),
            },
            ...styles?.control?.(base, state)
        }),
        placeholder: (base) => ({
            ...base,
            color: !theme ? "rgba(255,255,255,0.5)" : "#6c757d",
            fontSize: "14px",
            ...styles?.placeholder?.(base)
        }),
        singleValue: (base) => ({
            ...base,
            color: !theme ? "#fff" : "#000",
            fontSize: "14px",
            ...styles?.singleValue?.(base)
        }),
        input: (base) => ({
            ...base,
            color: !theme ? "#fff" : "#000",
            fontSize: "14px",
            ...styles?.input?.(base)
        }),
        menu: (base) => ({
            ...base,
            background: !theme ? "#1b2e4b" : "#fff",
            border: "1px solid " + (!theme ? "rgba(255,255,255,0.1)" : "#dee2e6"),
            boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            ...styles?.menu?.(base)
        }),
        option: (base, state) => ({
            ...base,
            fontSize: "14px",
            backgroundColor: state.isSelected
                ? "#0881c2"
                : state.isFocused
                    ? (!theme ? "rgba(255,255,255,0.05)" : "#f8f9fa")
                    : "transparent",
            color: state.isSelected ? "#fff" : (!theme ? "#fff" : "#000"),
            cursor: "pointer",
            "&:active": {
                backgroundColor: "#0881c2"
            },
            ...styles?.option?.(base, state)
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
            ...base,
            color: !theme ? "rgba(255,255,255,0.4)" : "#6c757d",
            "&:hover": {
                color: !theme ? "#fff" : "#343a40"
            },
            ...styles?.dropdownIndicator?.(base)
        })
    };

    return (
        <div className={clsx("mb-3", containerClassName)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={clsx("form-label", !theme ? "text-white-50" : "text-muted", labelClassName)}
                >
                    {label}
                </label>
            )}
            <Select
                id={selectId}
                styles={customStyles}
                className={clsx("react-select-container", className)}
                classNamePrefix="react-select"
                {...props}
            />
        </div>
    );
};

export { ReactSelect };