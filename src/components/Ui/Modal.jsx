import { Icon } from "@iconify/react"
import { Card } from "react-bootstrap"

const Modal = ({ title, close, children, anima, width, zIndex, style }) => {
     return (
          <div className="d-flex justify-content-center" style={{ zIndex: zIndex }}>
               <div
                    style={{ width: "100%", height: "100vh", background: "#00000080", position: "fixed", top: 0, left: 0, zIndex: zIndex, borderBottom: "1px solid #000000cc" }}
                    onClick={() => close(false)}
               ></div>
               <Card
                    className={`d-flex ${anima ? 'modalFadeIn' : 'modalFadeOut'} px-4 py-4`}
                    style={{ width: width, maxHeight: "90vh", position: "fixed", top: "30px", zIndex: zIndex, marginLeft: "-5%", style }}
               >
                    <nav
                         className="d-flex border-bottom justify-content-between align-content-center w-100 bg-white py-3"
                         style={{ top: -24, position: "sticky", zIndex: 10 }}
                    >
                         <h5>{title}</h5>
                         <Icon
                              icon="majesticons:close"
                              width="30"
                              height="30"
                              className="cursor-pointer hover-white"
                              onClick={() => close(false)}
                         />
                    </nav>
                    {children}
               </Card>
          </div>
     )
}

export default Modal