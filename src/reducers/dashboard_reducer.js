import { DASHBOARD_SIDEBAR_TOGGLE, TOGGLE_UPDATE_BLOG_MODAL } from "../actions";

const dashboard_reducer = (state, action) => {
  // Dashboard Sidebar
  if (action.type === DASHBOARD_SIDEBAR_TOGGLE) {
    return { ...state, isSidebarOpen: !state.isSidebarOpen };
  }
  // Modal for update blog
  if (action.type === TOGGLE_UPDATE_BLOG_MODAL) {
    return { ...state, isUpdateBlogOpen: !state.isUpdateBlogOpen };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default dashboard_reducer;
