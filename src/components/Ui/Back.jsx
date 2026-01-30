import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"

const Back = ({ style }) => {
     const navigate = useNavigate()
     return (
          <span
               className="fs-3 ms-2 cursor-pointer d-flex align-items-center hover-white"
               style={{ transform: "translateY(-15px)", width: "100px", ...style }}
               onClick={() => navigate(-1)}
          >    
               <Icon icon="si:arrow-left-fill" width="24" className="me-1" height="24" />
               Orqaga
          </span>
     )
}

export default Back