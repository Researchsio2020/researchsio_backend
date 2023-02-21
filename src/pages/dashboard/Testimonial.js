import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";

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

import { useAuthContext } from "../../context/AuthContext";
import { FormRow, FormRowSelect } from "../../components";

const Testimonial = () => {
  const initialState = {
    image: "",
    title: "",
    category: "",
    imageSrc: "",
    description: "",
    rating: 0,
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
    const { imageSrc, title, description, rating, category } = gallery;
    if (!category || !imageSrc) {
      toast.error("please fill out all fields");
      return;
    }
    try {
      setIsLoading(true);
      const id = new Date().getTime().toString();
      await setDoc(doc(db, "testimonial", id), {
        description,
        rating,
        title,
        timeStamp: serverTimestamp(),
        date: new Date().toLocaleDateString("en-GB"),
        category,
        imageSrc,
      });
      setIsLoading(false);
      setGallery(initialState);
      toast.success("Successfully Uploaded Testimonial!");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error("Failed to Upload Testimonial!");
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
      query(collection(db, "testimonial")),
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
      await deleteDoc(doc(db, "testimonial", id));
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
      <h2>Testimonials</h2>
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
        <FormRow
          type="text"
          name="title"
          value={gallery.title}
          handleChange={handleChange}
        />
        <FormRow
          type="text"
          name="description"
          value={gallery.description}
          handleChange={handleChange}
        />

        <FormRow
          type="text"
          name="category"
          value={gallery.category}
          handleChange={handleChange}
        />
        <FormRow
          type="number"
          name="rating"
          value={gallery.rating}
          handleChange={handleChange}
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
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Position</th>
            <th scope="col">Rating</th>
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
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>{item.rating}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteImage(item.id)}
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

export default Testimonial;
