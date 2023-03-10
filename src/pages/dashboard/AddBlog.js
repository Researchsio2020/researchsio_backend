import React, { useEffect, useMemo, useRef, useState } from "react";

import { db, storage } from "../../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

import BlogCategory from "../../components/BlogCategory";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import AddBlogForm from "../../components/AddBlogForm";
import { useAuthContext } from "../../context/AuthContext";

const AddBlog = () => {
  const [categories, setCategories] = useState([]);
  const { userDetails } = useAuthContext();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "blogCategory")),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setCategories(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {userDetails.role === "admin" && <BlogCategory categories={categories} />}
      <hr />
      <AddBlogForm categories={categories} />
    </Wrapper>
  );
};

export default AddBlog;
