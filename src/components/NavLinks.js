import { NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import links from "../utils/links";

const NavLinks = ({ toggleSidebar }) => {
  const { userDetails } = useAuthContext();
  return (
    <div className="nav-links">
      {userDetails.role === "admin"
        ? links.map((link) => {
            const { text, path, id, icon } = link;
            return (
              <NavLink
                to={path}
                className={({ isActive }) => {
                  return isActive ? "nav-link active" : "nav-link";
                }}
                key={id}
                onClick={toggleSidebar}
                end
              >
                <span className="icon">{icon}</span>
                {text}
              </NavLink>
            );
          })
        : links.slice(0, 4).map((link) => {
            const { text, path, id, icon } = link;
            return (
              <NavLink
                to={path}
                className={({ isActive }) => {
                  return isActive ? "nav-link active" : "nav-link";
                }}
                key={id}
                onClick={toggleSidebar}
                end
              >
                <span className="icon">{icon}</span>
                {text}
              </NavLink>
            );
          })}
    </div>
  );
};
export default NavLinks;
