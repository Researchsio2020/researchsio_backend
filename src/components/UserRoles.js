import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import FormRow from "./FormRow";

const UserRoles = ({ roles }) => {
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please fill out the field");
      return;
    }

    try {
      const id = new Date().getTime().toString();
      await setDoc(doc(db, "userRoles", id), {
        timeStamp: serverTimestamp(),
        date: new Date().toLocaleDateString("en-GB"),
        name: category,
      });

      setCategory("");
      toast.success("Successfully added role!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add role!");
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setCategory(value);
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, "userRoles", id));
      toast.success("Deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-responsive">
      <h2>Add User Role</h2>
      <form className="form" onSubmit={handleSubmit}>
        <FormRow
          type="text"
          className="from-input"
          value={category}
          handleChange={handleInput}
        />
        <button className="btn btn-primary" type="submit">
          Add Category
        </button>
      </form>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Category Name</th>
          </tr>
        </thead>
        <tbody>
          {roles?.map((item, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteCategory(item.id)}
                  >
                    Delete
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

export default UserRoles;
