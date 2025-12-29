import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import './Notification.css'

const variants = {
     success: { color: '#3ad97a', icon: 'mdi:check-circle' },
     warn: { color: '#f6c85f', icon: 'mdi:alert-circle' },
     edited: { color: '#0085db', icon: 'mdi:pencil' },
     deleted: { color: '#fb6b6b', icon: 'mdi:delete' }
}

const Notification = ({ type = 'success', message = '', onClose, duration = 3000 }) => {
     const [exiting, setExiting] = useState(false)

     useEffect(() => {
          const t = setTimeout(() => setExiting(true), duration)
          return () => clearTimeout(t)
     }, [duration])

     useEffect(() => {
          if (!exiting) return
          const t = setTimeout(() => { onClose && onClose() }, 260)
          return () => clearTimeout(t)
     }, [exiting, onClose])

     const v = variants[type] || variants.success

     return (
          <div
               className={`cp-notification ${exiting ? 'hide' : ''}`}
               style={{
                    borderLeft: `4px solid ${v.color}`,
                    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1050
               }}
          >
               <div className="cp-notification-content">
                    <Icon icon={v.icon} width={18} height={18} style={{ color: v.color }} />
                    <div className="cp-notification-message">{message}</div>
                    <button className="cp-notification-close" onClick={() => setExiting(true)} aria-label="close">
                         <Icon
                              icon="majesticons:close"
                              width="20"
                              height="20"
                              className="cursor-pointer"
                         />
                    </button>
               </div>
          </div>
     )
}

export default Notification
