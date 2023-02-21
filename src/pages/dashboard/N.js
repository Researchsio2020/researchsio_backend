import React, { useEffect } from "react";
import { useState } from "react";
import { FormRow } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const Profile = () => {
  const [isLoading, setIsLoading] = useState();
  const [progress, setProgress] = useState(0);
  const { currentUser, userProfileUpdate } = useAuthContext();
  const [userDetails, setUserDetails] = useState();
  const [userData, setUserData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    image: "",
    url: "",
  });

  useEffect(() => {
    const getUserDetails = async () => {
      const querySnapshot = await getDoc(doc(db, "users", currentUser.uid));
      setUserDetails(querySnapshot.data());
    };
    getUserDetails();
  }, []);

  useEffect(() => {
    setUserData((oldState) => {
      return {
        ...oldState,
        phone: userDetails.phone,
        address: userDetails.address,
        image: userDetails.image,
      };
    });
  }, [userDetails]);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + userData.url.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, userData.url);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUserData((prev) => ({ ...prev, image: downloadURL }));
          });
        }
      );
    };

    userData.url && uploadFile();
  }, [userData.url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address, url, image } = userData;
    if (!name || !address || !phone || !url) {
      toast.error("please fill out all fields");
      return;
    }
    try {
      setIsLoading(true);
      await userProfileUpdate(name, phone, address, image);
      toast.success("Profile updated successfully!");
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error("Failed to update profile!");
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        <div>
          <p>Profile Picture</p>
          <img src={userData.image} alt="profile" width="20%" />
        </div>
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            value={userData.name}
            handleChange={handleChange}
          />

          {/* <FormRow type="email" name="email" value={userData.email} /> */}
          <div className="form-row">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={userData.email}
              className="form-input"
              readOnly
            />
          </div>

          <FormRow
            type="text"
            name="address"
            value={userData.address}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            name="phone"
            value={userData.phone}
            handleChange={handleChange}
          />

          <div className="form-row">
            <label htmlFor="image" className="form-label">
              Image
            </label>
            <input
              id="image"
              type="file"
              name="image"
              className="form-input"
              onChange={(event) => {
                setUserData({ ...userData, url: event.target.files[0] });
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-block btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Please Wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
export default Profile;
