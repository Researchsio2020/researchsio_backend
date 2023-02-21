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
  const { currentUser, userProfileUpdate } = useAuthContext();
  const [userDetails, setUserDetails] = useState({});

  const [userData, setUserData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    facebook: "",
    twitter: "",
    instagram: "",
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
        facebook: userDetails.facebook,
        twitter: userDetails.twitter,
        instagram: userDetails.instagram,
      };
    });
  }, [userDetails]);

  // For Image Start
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + url.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, url);

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
            setImageUrl(downloadURL);
          });
        }
      );
    };

    url && uploadFile();
  }, [url]);
  // For Image End

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address, facebook, twitter, instagram } = userData;
    const image = imageUrl || userData.image;
    if (!name || !address || !phone) {
      toast.error("please fill out all fields");
      return;
    }
    // dispatch(updateUser(userData));
    try {
      setIsLoading(true);
      await userProfileUpdate(
        name,
        phone,
        address,
        image,
        facebook,
        twitter,
        instagram
      );
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
            type="number"
            name="phone"
            value={userData.phone}
            handleChange={handleChange}
          />

          {/* social  */}
          <FormRow
            type="text"
            name="facebook"
            value={userData.facebook}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            name="twitter"
            value={userData.twitter}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            name="instagram"
            value={userData.instagram}
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
                setUrl(event.target.files[0]);
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
