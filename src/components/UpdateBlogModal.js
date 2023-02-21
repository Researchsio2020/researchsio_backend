import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDashboardContext } from "../context/dashboard_context";
import { toast } from "react-toastify";
import { db, storage } from "../firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import DropFileInput from "../components/DropFileInput";
import FormRow from "./FormRow";
import JoditEditor from "jodit-react";
import FormRowSelect from "./FormRowSelect";
import { collection, onSnapshot, query } from "firebase/firestore";

const UpdateBlogModal = () => {
  const [categories, setCategories] = useState([]);

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
  // for text editor
  const editor = useRef(null);

  const { toggleUpdateBlogModal, isUpdateBlogOpen, updateBlog } =
    useDashboardContext();

  useEffect(() => {
    setValues({
      id: updateBlog.id,
      image: updateBlog.image,
      title: updateBlog.title,
      description: updateBlog.description,
      category: updateBlog.category,
      newImage: "",
      newUrl: "",
    });
  }, [updateBlog]);

  const initialState = {
    id: "",
    image: "",
    title: "",
    description: "",
    category: "",
    newImage: "",
    newUrl: "",
  };
  const [values, setValues] = useState(initialState);

  const [isLoading, setIsLoading] = useState();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + values.newImage.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, values.newImage);

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
            setValues((prev) => ({ ...prev, newUrl: downloadURL }));
          });
        }
      );
    };

    values.newImage && uploadFile();
  }, [values.newImage]);

  const handleBlogInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, image, category, title, description, newUrl } = values;

    if (!title || !description || !category) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      setIsLoading(true);

      await updateDoc(doc(db, "blog", id), {
        title,
        description,
        category,
        image: newUrl || image,
        updatedAt: serverTimestamp(),
      });
      setIsLoading(false);
      toast.success("Successfully updated!");
      toggleUpdateBlogModal();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error("Failed to update!");
    }
  };

  return (
    <Modal show={isUpdateBlogOpen} onHide={toggleUpdateBlogModal} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Blog Overview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-center">
          {/* title */}
          <FormRow
            type="text"
            name="title"
            value={values.title}
            handleChange={handleBlogInput}
          />
          <FormRowSelect
            name="category"
            value={values.category}
            handleChange={handleBlogInput}
            list={categories?.map((item) => item.name)}
          />
          {/* description */}
          {/* <FormRow
            type="text"
            name="description"
            value={values.description}
            handleChange={handleBlogInput}
          /> */}
          <JoditEditor
            ref={editor}
            value={values.description}
            onChange={(newContent) => {
              setValues({ ...values, description: newContent });
            }}
          />

          <div className="col-12">
            <label>Image</label>
            <img src={values.image} width="20%" alt="Request product" />
          </div>
          <div className="col-12">
            {!values.newImage && <label className="mt-3">Change Image</label>}
            <DropFileInput
              onFileChange={(files) =>
                setValues({ ...values, newImage: files[0] })
              }
              active={values.newImage}
            />
          </div>

          <p>
            {progress && progress < 100 ? `Uploading ${progress}% ...` : ""}
          </p>
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {`${
                isLoading || (progress && progress < 100)
                  ? "Please wait..."
                  : "Submit"
              }`}
            </button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleUpdateBlogModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateBlogModal;
