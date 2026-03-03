import { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify/react"
import { useTheme } from "../../Context/Context"

const monthNames = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
]

const now = new Date()
const currentMonth = now.getMonth()
const currentYear = now.getFullYear()

const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(currentYear, currentMonth - i, 1)
    return {
        month: d.getMonth(),
        year: d.getFullYear(),
        label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`
    }
})

export default function MonthSelect({ value, onChange }) {
    const { theme } = useTheme()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const selected = value || monthOptions[0]

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside, true)
        return () => document.removeEventListener('click', handleClickOutside, true)
    }, [])

    return (
        <div className="position-relative" ref={ref}>
            <button
                className="btn d-flex align-items-center gap-2 px-3 py-2"
                onClick={() => setOpen(!open)}
                style={{
                    background: !theme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${!theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '12px',
                    color: !theme ? '#e2e8f0' : '#1e293b',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    minWidth: '150px',
                    zIndex: 40,
                    justifyContent: 'space-between',
                }}
            >
                <div className="d-flex align-items-center gap-2">
                    {selected.label}
                </div>
                <Icon
                    icon="ph:caret-down-bold"
                    fontSize={14}
                    className="text-muted"
                    style={{
                        transition: 'transform 0.2s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                />
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    zIndex: 50,
                    minWidth: '180px',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    background: !theme ? 'rgba(15, 23, 42, 0.97)' : 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${!theme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '14px',
                    padding: '6px',
                    boxShadow: !theme
                        ? '0 16px 48px rgba(0,0,0,0.5)'
                        : '0 16px 48px rgba(0,0,0,0.12)',
                }}>
                    {monthOptions.map((opt, i) => (
                        <button
                            key={i}
                            className="btn w-100 text-start d-flex align-items-center justify-content-between px-3 py-2"
                            onClick={() => {
                                onChange(opt)
                                setOpen(false)
                            }}
                            style={{
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: selected.label === opt.label ? 700 : 500,
                                color: selected.label === opt.label
                                    ? '#6366f1'
                                    : (!theme ? '#cbd5e1' : '#475569'),
                                background: selected.label === opt.label
                                    ? (!theme ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)')
                                    : 'transparent',
                                border: 'none',
                                transition: 'all 0.15s',
                                marginBottom: '2px',
                            }}
                            onMouseEnter={e => {
                                if (selected.label !== opt.label) {
                                    e.currentTarget.style.background = !theme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                                }
                            }}
                            onMouseLeave={e => {
                                if (selected.label !== opt.label) {
                                    e.currentTarget.style.background = 'transparent'
                                }
                            }}
                        >
                            <span>{opt.label}</span>
                            {selected.label === opt.label && (
                                <Icon icon="ph:check-bold" fontSize={14} style={{ color: '#6366f1' }} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export { monthOptions }
