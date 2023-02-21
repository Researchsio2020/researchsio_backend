import React from "react";
import Wrapper from "../assets/wrappers/SmallSidebar";
import { FaTimes } from "react-icons/fa";
import Logo from "./Logo";
// import { useSelector, useDispatch } from "react-redux";
// import { toggleSidebar } from "../features/user/userSlice";
import NavLinks from "./NavLinks";
import { useDashboardContext } from "../context/dashboard_context";
const SmallSidebar = () => {
  // const { isSidebarOpen } = useSelector((store) => store.user);
  // const dispatch = useDispatch();

  // const toggle = () => {
  //   dispatch(toggleSidebar());
  // };
  const { isSidebarOpen, dashboardSidebarToggle } = useDashboardContext();
  return (
    <Wrapper>
      <div
        className={
          !isSidebarOpen
            ? "sidebar-container show-sidebar"
            : "sidebar-container"
        }
      >
        <div className="content">
          <button className="close-btn" onClick={dashboardSidebarToggle}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={dashboardSidebarToggle} />
        </div>
      </div>
    </Wrapper>
  );
};
export default SmallSidebar;
