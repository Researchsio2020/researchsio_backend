import React, { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/JobsContainer";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import {
  FormRow,
  FormRowSelect,
  GalleryImage,
  GalleryCategory,
} from "../../components";

const Gallery = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "galleryCategory")),
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
      <GalleryCategory categories={categories} />
      <GalleryImage categories={categories} />
    </Wrapper>
  );
};

export default Gallery;
