import React from "react";
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import JobInfo from "./JobInfo";
import moment from "moment";
import { toast } from "react-toastify";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useDashboardContext } from "../context/dashboard_context";
import UpdateBlogModal from "./UpdateBlogModal";
import { useAuthContext } from "../context/AuthContext";

const Blog = ({ item }) => {
  const { userDetails } = useAuthContext();
  const { id, title, description, image, author, date, status, timeStamp } =
    item;
  // console.log(item);
  const { toggleUpdateBlogModal, setUpdateBlog } = useDashboardContext();
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "blog", id));
      // setData(data.filter((item) => item.id !== id));
      toast.success("Deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  const approveBlog = async (id) => {
    try {
      await updateDoc(doc(db, "blog", id), {
        status: "approved",
      });
      toast.success("Successfully updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to approve!");
    }
  };

  return (
    <Wrapper style={{ border: "1px solid gray" }}>
      <header>
        {/* <div className="main-icon">{company.charAt(0)}</div> */}
        <div className="info">
          <h5>{title}</h5>
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          {/* <JobInfo icon={<FaLocationArrow />} text={jobLocation} /> */}
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          {/* <JobInfo icon={<FaBriefcase />} text={jobType} /> */}
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            {/* <Link
              to="/add-job"
              className="btn edit-btn"
              onClick={() =>
                dispatch(
                  setEditJob({
                    editJobId: _id,
                    position,
                    company,
                    jobLocation,
                    jobType,
                    status,
                  })
                )
              }
            >
              Edit
            </Link> */}
            {status === "pending"
              ? userDetails.role === "admin" && (
                  <button
                    type="button"
                    className="btn btn-info"
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      approveBlog(id);
                    }}
                  >
                    Approve
                  </button>
                )
              : ""}

            <button
              type="button"
              className="btn btn-primary"
              style={{ marginRight: "5px" }}
              onClick={() => {
                toggleUpdateBlogModal();
                setUpdateBlog(item);
              }}
            >
              edit
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteItem(id)}
            >
              delete
            </button>
          </div>
        </footer>
      </div>

      <UpdateBlogModal />
    </Wrapper>
  );
};

export default Blog;
