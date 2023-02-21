import React, { useContext, useReducer, useState } from "react";
import reducer from "../reducers/dashboard_reducer";
import { DASHBOARD_SIDEBAR_TOGGLE, TOGGLE_UPDATE_BLOG_MODAL } from "../actions";
import axios from "axios";

const initialState = {
  isSidebarOpen: true,
  isUpdateBlogOpen: false,
};

const DashboardContext = React.createContext();

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [updateBlog, setUpdateBlog] = useState("");

  // Sidebar
  const dashboardSidebarToggle = () => {
    dispatch({ type: DASHBOARD_SIDEBAR_TOGGLE });
  };

  // Modal for update blog
  const toggleUpdateBlogModal = () => {
    dispatch({ type: TOGGLE_UPDATE_BLOG_MODAL });
  };

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        dashboardSidebarToggle,
        // Blog
        toggleUpdateBlogModal,
        updateBlog,
        setUpdateBlog,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook for reducing line of codes
export const useDashboardContext = () => {
  return useContext(DashboardContext);
};
