import { Dropdown } from "react-bootstrap";
import { useTheme } from "../../../Context/Context";
import "./StatusFilter.css";
import { Icon } from "@iconify/react";

export default function StatusDropdown({ currentItem, setCurrentItem, statuses = [] }) {
     const { theme } = useTheme();

     return (
          <Dropdown autoClose="outside inside">
               {/* TOGGLE */}
               <Dropdown.Toggle
                    className={`fs-3 d-flex align-items-center rounded border gap-2 ${!theme ? "text-white" : "text-dark"
                         }`}
                    style={{
                         background: !theme ? "#0f172a" : "#fff",
                         padding: "11.5px 25px 11.5px 15px",
                         width: "195px"
                    }}
               >
                    <span className={`dot dot-${currentItem.color}`}></span>
                    {currentItem.label}
               </Dropdown.Toggle>

               {/* MENU */}
               <Dropdown.Menu
                    className="px-2 py-3 rounded w-auto"
                    style={{
                         boxShadow: `0px 0px 10px ${!theme ? "#1e293b" : "#ccc"}`,
                    }}
               >
                    {statuses.map(item => (
                         <Dropdown.Item
                              key={item.key}
                              style={{ transition: "0.1s" }}
                              className="rounded-2 d-flex align-items-center gap-2 ps-1"
                              onClick={() => setCurrentItem(item)}
                         >
                              {/* CHECK ICON */}
                              <span
                                   style={{ width: 20, height: 20 }}
                                   className="d-flex justify-content-center align-items-center"
                              >
                                   {item.key === currentItem.key && (
                                        <Icon icon="ic:outline-check" width="20" height="20" />
                                   )}
                              </span>

                              {item.color ? (<span className={`dot dot-${item.color}`}></span>) : ""}
                              &nbsp;
                              {item.label}
                         </Dropdown.Item>
                    ))}
               </Dropdown.Menu>
          </Dropdown>
     );
}
