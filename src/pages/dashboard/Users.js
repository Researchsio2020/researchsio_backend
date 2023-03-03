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
import UserRoles from "../../components/UserRoles";
import UsersTable from "../../components/UsersTable";

const Users = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "userRoles")),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setRoles(list);
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
      <UserRoles roles={roles} />
      <UsersTable roles={roles} />
    </Wrapper>
  );
};

export default Users;
