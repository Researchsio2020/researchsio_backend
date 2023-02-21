import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

import {
  updateDoc,
  collection,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";

import { useAuthContext } from "../context/AuthContext";

const UsersTable = ({ roles }) => {
  const { currentUser } = useAuthContext();

  // get all users form firebase
  const [galleries, setGalleries] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users")),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setGalleries(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  // const deleteImage = async (id) => {
  //   try {
  //     await deleteDoc(doc(db, "users", id));
  //     toast.success("Deleted successfully!");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // update user role
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const handleImageCategorySubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select role");
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        role,
      });
      toast.success("Successfully updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update!");
    }
  };

  // show/hide user in homepage handler
  const homeSlideStatus = async ({ showHome, userId }) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        showHome: !showHome,
      });
      toast.success("Successfully updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update!");
    }
  };

  // all usr table
  return (
    <div className="table-responsive mt-5">
      <h2>All Users</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Address</th>
            <th scope="col">Role</th>
            <th scope="col">Add Role</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {galleries.map((item, i) => {
            return (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>
                  <img src={item.image} alt={item.username} width="50px" />
                </td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                <td>{item.role}</td>
                {/* <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteImage(item.id)}
                  >
                    Delete
                  </button>
                </td> */}
                <td>
                  <form onSubmit={handleImageCategorySubmit}>
                    <select
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setUserId(item.userId);
                      }}
                      className="form-select"
                    >
                      {roles?.map((itemValue, index) => {
                        return (
                          <option key={index} value={itemValue.name}>
                            {itemValue.name}
                          </option>
                        );
                      })}
                    </select>
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </form>
                </td>
                <td>
                  <button
                    className={`btn ${
                      item.showHome ? "btn-danger" : "btn-info text-white"
                    }`}
                    onClick={() => {
                      homeSlideStatus({
                        showHome: item.showHome,
                        userId: item.userId,
                      });
                    }}
                  >
                    {item.showHome ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
