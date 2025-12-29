import { Icon } from "@iconify/react"
import { Card } from "react-bootstrap"

const Modal = ({ title, close, children, anima }) => {
     return (
          <div className="d-flex justify-content-center align-content-start z-3">
               <div
                    style={{ width: "100%", height: "100vh", background: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, zIndex: 100 }}
                    onClick={() => close(false)}
               ></div>
               <Card
                    className={`d-flex modal-animation ${anima ? 'modalFadeIn' : 'modalFadeOut'}`}
                    style={{ width: "50%", position: "fixed", top: "30px", zIndex: 101 }}
               >
                    <Card.Body>
                         <nav className="d-flex justify-content-between align-content-center">
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
                    </Card.Body>
               </Card>
          </div>
     )
}

export default Modal