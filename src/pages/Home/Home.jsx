import "./Home.css";
import { Icon } from "@iconify/react";
import {
  IconDotsVertical,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
} from "@tabler/icons-react";

const Home = () => {
  return (
    <div className="row">
      <div className="col-12">
        <div id="body-card-index" className="card mb-0">
          <div id="body-card-main" className="card-body">
            <div className="d-md-flex justify-content-between mb-9">
              <div className="mb-9 mb-md-0">
                <h4 id="card-title" className="card-title">
                  Latest Reviews
                </h4>
                <p className="card-subtitle mb-0">
                  Review received across all channels
                </p>
              </div>
              <div className="d-flex align-items-center">
                <form className="position-relative me-3 w-100">
                  <input
                    type="text"
                    className="form-control search-chat py-2 ps-5"
                    id="text-srh"
                    placeholder="Search"
                  />
                  <IconSearch className="position-absolute top-50 start-0 translate-middle-y text-dark ms-3" />
                </form>
                <div className="dropdown">
                  <a
                    href="javascript:void(0)"
                    className="btn border-dark-subtle shadow-none px-3"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <IconDotsVertical className="fs-5" />
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <a
                        className="dropdown-item d-flex align-items-center gap-3"
                        href="javascript:void(0)"
                      >
                        <IconPlus className="fs-4" />
                        Add
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item d-flex align-items-center gap-3"
                        href="javascript:void(0)"
                      >
                        <IconEdit className="fs-4" />
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item d-flex align-items-center gap-3"
                        href="javascript:void(0)"
                      >
                        <IconTrash className="fs-4" />
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="table-responsive overflow-x-auto latest-reviews-table">
              <table className="table align-middle text-nowrap">
                <thead className="text-dark fs-4">
                  <tr>
                    <th style={{ fontSize: "16px" }} className="ps-0">
                      #
                    </th>
                    <th style={{ fontSize: "16px" }}>Products</th>
                    <th style={{ fontSize: "16px" }}>Customer</th>
                    <th style={{ fontSize: "16px" }}>Reviews</th>
                    <th style={{ fontSize: "16px" }}>Status</th>
                    <th style={{ fontSize: "16px" }}>Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="ps-0">
                      <div className="form-check mb-0 flex-shrink-0">
                        <input
                          className="form-check-input flexCheckDefaultWrapper"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault1"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center product text-truncate">
                        <img
                          src="/product-5.png"
                          className="img-fluid flex-shrink-0"
                          width="60"
                          height="60"
                        />
                        <div className="ms-3 product-title">
                          <h6 className="mb-0 text-truncate-2 index-item-title">
                            iPhone 13 pro max-Pacific Blue-128GB storage
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-truncate">
                        <img
                          src="/user-2.jpg"
                          alt="spike-img"
                          className="img-fluid rounded-circle flex-shrink-0"
                          width="40"
                          height="40"
                        />
                        <div className="ms-3">
                          <h4
                            style={{ fontSize: "16.6px", fontWeight: 600 }}
                            className="card-title mb-1"
                          >
                            Arlene McCoy
                          </h4>
                          <p className="card-subtitle">macoy@arlene.com</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-reviews">
                        <ul className="list-unstyled d-flex align-items-center mb-0">
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="" href="javascript:void(0)">
                              <Icon
                                icon="solar:star-line-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                        </ul>
                        <p
                          style={{ fontSize: "15px" }}
                          className="text-dark mb-0 fw-medium text-truncate-2"
                        >
                          This theme is great. Clean and easy to understand.
                          Perfect for those who don't have
                          <br />
                          time to... <a href="javascript:void(0)">See more</a>
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-success-subtle text-success border-success border">
                        Confirmed
                      </span>
                    </td>
                    <td>
                      <p className="mb-0">Nov 8</p>
                    </td>
                    <td>
                      <div className="dropdown dropstart">
                        <a
                          href="javascript:void(0)"
                          className="text-muted "
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <IconDotsVertical className="fs-5" />
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconPlus className="fs-4" />
                              Add
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconEdit className="fs-4" />
                              Edit
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconTrash className="fs-4" />
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-0">
                      <div className="form-check mb-0 flex-shrink-0">
                        <input
                          className="form-check-input flexCheckDefaultWrapper"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault2"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center product text-truncate">
                        <img
                          src="/product-6.png"
                          className="img-fluid flex-shrink-0"
                          width="60"
                          height="60"
                        />
                        <div className="ms-3 product-title">
                          <h6 className="mb-0 text-truncate-2 index-item-title">
                            Apple MacBook Pro 13 inch-M1-8/256GB-space
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-truncate">
                        <img
                          src="/user-3.jpg"
                          alt="spike-img"
                          className="img-fluid rounded-circle flex-shrink-0"
                          width="40"
                          height="40"
                        />
                        <div className="ms-3">
                          <h4 className="card-title mb-1">Jerome Bell</h4>
                          <p className="card-subtitle">belljerome@yahoo.com</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-reviews">
                        <ul className="list-unstyled d-flex align-items-center mb-0">
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="" href="javascript:void(0)">
                              <Icon
                                icon="solar:star-line-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                        </ul>
                        <p
                          style={{ fontSize: "15px" }}
                          className="text-dark mb-0 fw-medium text-truncate-2"
                        >
                          It's a Mac, after all. Once you've gone Mac,there's no
                          going back. My first Mac lastedover nine years.
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-warning-subtle text-warning border-warning border">
                        Pending
                      </span>
                    </td>
                    <td>
                      <p className="mb-0">Nov 8</p>
                    </td>
                    <td>
                      <div className="dropdown dropstart">
                        <a
                          href="javascript:void(0)"
                          className="text-muted "
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <IconDotsVertical className="fs-5" />
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconPlus className="fs-4" />
                              Add
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconEdit className="fs-4" />
                              Edit
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconTrash className="fs-4" />
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-0">
                      <div className="form-check mb-0 flex-shrink-0">
                        <input
                          className="form-check-input flexCheckDefaultWrapper"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault3"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center product text-truncate">
                        <img
                          src="/product-7.png"
                          className="img-fluid flex-shrink-0"
                          width="60"
                          height="60"
                        />
                        <div className="ms-3 product-title">
                          <h6 className="mb-0 text-truncate-2 index-item-title">
                            PlayStation 5 DualSense Wireless Controller
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-truncate">
                        <img
                          src="/user-4.jpg"
                          alt="spike-img"
                          className="img-fluid rounded-circle flex-shrink-0"
                          width="40"
                          height="40"
                        />
                        <div className="ms-3">
                          <h4 className="card-title mb-1">Jacob Jones</h4>
                          <p className="card-subtitle">jones009@hotmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-reviews">
                        <ul className="list-unstyled d-flex align-items-center mb-0">
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="" href="javascript:void(0)">
                              <Icon
                                icon="solar:star-line-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                        </ul>
                        <p
                          style={{ fontSize: "15px" }}
                          className="text-dark mb-0 fw-medium text-truncate-2"
                        >
                          The best experience we could hope for.Customer service
                          team is amazing and thequality of their products...{" "}
                          <a href="javascript:void(0)">See more</a>
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-warning-subtle text-warning border-warning border">
                        Pending
                      </span>
                    </td>
                    <td>
                      <p className="mb-0">Nov 8</p>
                    </td>
                    <td>
                      <div className="dropdown dropstart">
                        <a
                          href="javascript:void(0)"
                          className="text-muted "
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <IconDotsVertical className="fs-5" />
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconPlus className="fs-4" />
                              Add
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconEdit className="fs-4" />
                              Edit
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconTrash className="fs-4" />
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-0">
                      <div className="form-check mb-0 flex-shrink-0">
                        <input
                          className="form-check-input flexCheckDefaultWrapper"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault4"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center product text-truncate">
                        <img
                          src="/product-8.png"
                          className="img-fluid flex-shrink-0"
                          width="60"
                          height="60"
                        />
                        <div className="ms-3 product-title">
                          <h6 className="mb-0 index-item-title text-truncate-2">
                            Amazon Basics Mesh, Mid-Back, Swivel Office De...
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-truncate">
                        <img
                          src="/user-5.jpg"
                          alt="spike-img"
                          className="img-fluid rounded-circle flex-shrink-0"
                          width="40"
                          height="40"
                        />
                        <div className="ms-3">
                          <h4 className="card-title mb-1">Annette Black</h4>
                          <p className="card-subtitle">blackanne@yahoo.com</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-reviews">
                        <ul className="list-unstyled d-flex align-items-center mb-0">
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="" href="javascript:void(0)">
                              <Icon
                                icon="solar:star-line-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                        </ul>
                        <p
                          style={{ fontSize: "15px" }}
                          className="text-dark mb-0 fw-medium text-truncate-2"
                        >
                          The controller is quite comfy for me. Despiteits
                          increased size, the controller still fits well
                          <br />
                          in my hands.
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-success-subtle text-success border-success border">
                        Confirmed
                      </span>
                    </td>
                    <td>
                      <p className="mb-0">Nov 8</p>
                    </td>
                    <td>
                      <div className="dropdown dropstart">
                        <a
                          href="javascript:void(0)"
                          className="text-muted "
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <IconDotsVertical className="fs-5" />
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconPlus className="fs-4" />
                              Add
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconEdit className="fs-4" />
                              Edit
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconTrash className="fs-4" />
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="ps-0">
                      <div className="form-check mb-0 flex-shrink-0">
                        <input
                          className="form-check-input flexCheckDefaultWrapper"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault5"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center product text-truncate">
                        <img
                          src="/product-9.png"
                          className="img-fluid flex-shrink-0"
                          width="50"
                          height="50"
                        />
                        <div className="ms-3 product-title">
                          <h6
                            style={{ fontSize: "16px" }}
                            className="mb-0 text-truncate-2 index-item-title"
                          >
                            Sony X85J 75 Inch Sony 4K Ultra HD LED Smart G...
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-truncate">
                        <img
                          src="/user-6.jpg"
                          alt="spike-img"
                          className="img-fluid rounded-circle flex-shrink-0"
                          width="40"
                          height="40"
                        />
                        <div className="ms-3">
                          <h4 className="card-title mb-1">Albert Flores</h4>
                          <p className="card-subtitle">albertflo9@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-reviews">
                        <ul className="list-unstyled d-flex align-items-center mb-0">
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="me-1 " href="javascript:void(0)">
                              <Icon
                                icon="solar:star-bold-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                          <li>
                            <a className="" href="javascript:void(0)">
                              <Icon
                                icon="solar:star-line-duotone"
                                className="text-warning"
                              />
                            </a>
                          </li>
                        </ul>
                        <p
                          style={{ fontSize: "15px" }}
                          className="text-dark mb-0 fw-medium text-truncate-2"
                        >
                          This theme is great. Perfect for those whodon't have
                          time to start everything from
                          <br />
                          scratch.
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-warning-subtle text-warning border-warning border">
                        Pending
                      </span>
                    </td>
                    <td>
                      <p className="mb-0">Nov 8</p>
                    </td>
                    <td>
                      <div className="dropdown dropstart">
                        <a
                          href="javascript:void(0)"
                          className="text-muted "
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <IconDotsVertical className="fs-5" />
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconPlus className="fs-4" />
                              Add
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconEdit className="fs-4" />
                              Edit
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item d-flex align-items-center gap-3"
                              href="javascript:void(0)"
                            >
                              <IconTrash className="fs-4" />
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-10">
              <p className="mb-0 fw-normal">1-6 of 32</p>
              <nav aria-label="Page navigation example">
                <ul className="pagination mb-0 align-items-center">
                  <li className="page-item">
                    <a
                      className="page-link border-0 d-flex align-items-center text-muted fw-normal"
                      href="javascript:void(0)"
                    >
                      <Icon
                        icon="solar:alt-arrow-left-line-duotone"
                        className="fs-5"
                      />
                      Previous
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link border-0 d-flex align-items-center fw-normal"
                      href="javascript:void(0)"
                    >
                      Next
                      <Icon
                        icon="solar:alt-arrow-right-line-duotone"
                        className="fs-5"
                      />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
