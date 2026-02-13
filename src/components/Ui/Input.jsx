import * as React from "react"
import clsx from "clsx"
import { Icon } from "@iconify/react"

const Input = React.forwardRef(
    (
        {
            className,
            type = "text",
            label,
            id,
            containerClassName,
            labelClassName,
            ...props
        },
        ref
    ) => {
        const autoId = React.useId()
        const inputId = id ?? (label ? autoId : undefined)

        const [value, setValue] = React.useState(props.defaultValue ?? "")
        const [show, setShow] = React.useState(false)

        const handleChange = (e) => {
            if (props.value === undefined) setValue(e.target.value)
            props.onChange?.(e)
        }

        const inputType =
            type === "password" ? (show ? "text" : "password") : type

        const inputEl = (
            <div className={clsx("position-relative d-flex align-items-center")}>
                <input
                    id={inputId}
                    ref={ref}
                    {...props}
                    type={inputType}
                    value={props.value ?? value}
                    onChange={handleChange}
                    className={clsx(
                        "form-control",
                        type === "password" && "pe-5",
                        className
                    )}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="btn btn-sm btn-link position-absolute end-0 me-2 text-secondary border-0 p-1"
                        style={{ top: "50%", transform: "translateY(-50%)", zIndex: 5 }}
                        tabIndex={-1}
                    >
                        {show ? (
                            <Icon icon="mdi:eye-off-outline" width="20" height="20" />
                        ) : (
                            <Icon icon="mdi:eye-outline" width="20" height="20" />
                        )}
                    </button>
                )}
            </div>
        )

        if (!label) return inputEl

        return (
            <div className={clsx("mb-3", containerClassName)}>
                <label
                    htmlFor={inputId}
                    className={clsx("form-label", labelClassName)}
                >
                    {label}
                </label>
                {inputEl}
            </div>
        )
    }
)

Input.displayName = "Input"
export { Input }
