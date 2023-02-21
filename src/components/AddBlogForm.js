import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FormRow, FormRowSelect } from "../components";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import DropFileInput from "../components/DropFileInput";
import JoditEditor from "jodit-react";

const AddBlogForm = ({ categories }) => {
  // for text editor
  const editor = useRef(null);

  const { currentUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState();
  const [progress, setProgress] = useState(0);
  const initialState = {
    image: "",
    url: "",
    title: "",
    author: currentUser?.displayName || "",
    description: "",
    category: "",
  };
  const [blog, setBlog] = useState(initialState);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + blog.image.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, blog.image);

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
            setBlog((prev) => ({ ...prev, url: downloadURL }));
          });
        }
      );
    };

    blog.image && uploadFile();
  }, [blog.image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category } = blog;

    if (!title || !description || !category) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      setIsLoading(true);
      const id = new Date().getTime().toString();
      await setDoc(doc(db, "blog", id), {
        userId: currentUser.uid,
        timeStamp: serverTimestamp(),
        date: new Date().toLocaleDateString("en-GB"),
        title: blog.title,
        description: blog.description,
        image: blog.url,
        author: blog.author,
        category: blog.category,
        status: "pending",
        comments: [],
      });
      setIsLoading(false);
      setBlog(initialState);
      toast.success("Successfully requested for a product!");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error("Failed to request product!");
    }
  };

  const handleBlogInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBlog({ ...blog, [name]: value });
  };
  return (
    <form className="form mt-5">
      <h3>add blog</h3>
      <div className="form-center">
        {/* title */}
        <FormRow
          type="text"
          name="title"
          value={blog.title}
          handleChange={handleBlogInput}
        />
        {/* description */}
        {/* <FormRow
            type="text"
            name="description"
            value={blog.description}
            handleChange={handleBlogInput}
          /> */}
        {/* text editor start  */}

        <FormRowSelect
          name="category"
          value={blog.category}
          handleChange={handleBlogInput}
          list={categories?.map((item) => item.name)}
        />

        {/* text editor end  */}
        <div className="col-12">
          {!blog.image && <label className="mt-3">Upload Image</label>}
          <DropFileInput
            onFileChange={(files) => setBlog({ ...blog, image: files[0] })}
            active={blog.image}
          />
          <p>
            {progress && progress < 100 ? `Uploading ${progress}% ...` : ""}
          </p>
        </div>
        <JoditEditor
          ref={editor}
          value={blog.description}
          onChange={(newContent) => {
            setBlog({ ...blog, description: newContent });
          }}
        />
        {/* <FormRow
            type="text"
            name="jobLocation"
            labelText="job location"
            value={blog.description}
            handleChange={handleJobInput}
          />
        
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
         
          <FormRowSelect
            name="jobType"
            labelText="job type"
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          /> */}

        <div className="btn-container">
          <button
            type="submit"
            className="btn btn-block btn-primary"
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
    </form>
  );
};

export default AddBlogForm;
