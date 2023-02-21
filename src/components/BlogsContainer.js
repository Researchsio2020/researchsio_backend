import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import Wrapper from "../assets/wrappers/JobsContainer";
import Loading from "./Loading";

import { useAuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import Blog from "./Blog";

const BlogsContainer = () => {
  const [isLoading, setIsLoading] = useState();
  const { currentUser } = useAuthContext();
  const [filteredData, setFilteredData] = useState([]);

  const [data, setData] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      query(collection(db, "blog"), where("userId", "==", currentUser.uid)),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        setIsLoading(false);
        setFilteredData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  // const deleteItem = async (id) => {
  //   try {
  //     await deleteDoc(doc(db, "blog", id));
  //     setData(data.filter((item) => item.id !== id));
  //     toast.success("Deleted successfully!");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const allData = () => {
    setFilteredData(data);
  };
  const pendingData = () => {
    const pending = data.filter((item) => item.status === "pending");
    setFilteredData(pending);
  };
  const approvedData = () => {
    const approved = data.filter((item) => item.status === "approved");
    setFilteredData(approved);
  };
  const rejectedData = () => {
    const rejected = data.filter((item) => item.status === "rejected");
    setFilteredData(rejected);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (filteredData.length === 0) {
    return (
      <Wrapper>
        <h2>No blogs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* status start */}
      <div className="container ">
        <div className="row">
          <div className="col-lg-12 text-center mb-3">
            <button
              className="btn btn-dark mx-2"
              style={{ background: "black" }}
              onClick={allData}
            >
              ALL ({data && data.length})
            </button>
            <button className="btn btn-success mx-2" onClick={approvedData}>
              Approved (
              {data && data.filter((item) => item.status === "approved").length}
              )
            </button>
            <button
              className="btn btn-warning mx-2"
              style={{ background: "#0dcaf0", color: "white" }}
              onClick={pendingData}
            >
              Pending (
              {data && data.filter((item) => item.status === "pending").length})
            </button>
            <button className="btn btn-danger mx-2" onClick={rejectedData}>
              Rejected (
              {data && data.filter((item) => item.status === "rejected").length}
              )
            </button>
          </div>
        </div>
      </div>
      {/* status end  */}
      {/* card start  */}
      <h5>
        {filteredData?.length} blog{filteredData?.length > 1 && "s"} found
      </h5>
      <div className="jobs">
        {filteredData?.map((item, i) => {
          return <Blog key={i} item={item} />;
        })}
      </div>
      {/* {numOfPages > 1 && <PageBtnContainer />} */}
      {/* card end  */}
    </Wrapper>
  );
};
export default BlogsContainer;
