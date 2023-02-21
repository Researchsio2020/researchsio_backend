import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";

import {
  updateDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import FormRow from "./FormRow";
import FormRowSelect from "./FormRowSelect";
import { useAuthContext } from "../context/AuthContext";

const GalleryImages = ({ categories }) => {
  const { currentUser } = useAuthContext();
  const initialState = {
    image: "",
    title: currentUser?.displayName || "",
    category: "",
    imageSrc: "",
    author: currentUser?.displayName || "",
  };

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState();
  const [gallery, setGallery] = useState(initialState);
  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + gallery.image.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, gallery.image);

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
            setGallery((prev) => ({ ...prev, imageSrc: downloadURL }));
          });
        }
      );
    };

    gallery.image && uploadFile();
  }, [gallery.image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { imageSrc, title, author, category } = gallery;
    if (!category || !imageSrc) {
      toast.error("please fill out all fields");
      return;
    }
    try {
      setIsLoading(true);
      const id = new Date().getTime().toString();
      await setDoc(doc(db, "gallery", id), {
        author,
        title,
        timeStamp: serverTimestamp(),
        date: new Date().toLocaleDateString("en-GB"),
        category: ["all", category],
        imageSrc,
      });
      setIsLoading(false);
      setGallery(initialState);
      toast.success("Successfully Uploaded Image!");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error("Failed to Upload Image!");
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setGallery({ ...gallery, [name]: value });
  };

  // get images form firebase
  const [galleries, setGalleries] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "gallery")),
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

  const deleteImage = async (id) => {
    try {
      await deleteDoc(doc(db, "gallery", id));
      toast.success("Deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  // update image category
  const [updateImageCategory, setUpdateImageCategory] = useState("");
  const [galleryId, setGalleryId] = useState("");
  const [galleryCategory, setGalleryCategory] = useState([]);
  const handleImageCategorySubmit = async (e) => {
    e.preventDefault();

    if (!updateImageCategory) {
      toast.error("Please select category");
      return;
    }

    try {
      await updateDoc(doc(db, "gallery", galleryId), {
        category: galleryCategory,
      });
      toast.success("Successfully updated!");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error("Failed to update!");
    }
  };

  return (
    <div className="table-responsive mt-5">
      <h2>Gallery Images</h2>
      <form className="form" onSubmit={handleSubmit}>
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
              setGallery({ ...gallery, image: event.target.files[0] });
            }}
          />
        </div>
        <FormRowSelect
          name="category"
          value={gallery.category}
          handleChange={handleChange}
          list={categories?.map((item) => item.name)}
        />
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Category</th>
            <th scope="col">Action</th>
            <th scope="col">Add More Category</th>
          </tr>
        </thead>
        <tbody>
          {galleries.map((item, i) => {
            return (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>
                  <img src={item.imageSrc} alt={item.title} width="50px" />
                </td>
                <td>{item.category.join()}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteImage(item.id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <form onSubmit={handleImageCategorySubmit}>
                    <select
                      value={updateImageCategory}
                      onChange={(e) => {
                        setUpdateImageCategory(e.target.value);
                        setGalleryId(item.id);
                        setGalleryCategory([...item.category, e.target.value]);
                      }}
                      className="form-select"
                    >
                      {categories?.map((itemValue, index) => {
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GalleryImages;
