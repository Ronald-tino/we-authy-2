import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    const featureValue = e.target[0].value.trim();
    if (featureValue) {
      dispatch({
        type: "ADD_FEATURE",
        payload: featureValue,
      });
      e.target[0].value = "";
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
    onError: (error) => {
      console.error("Error creating gig:", error);
      alert(
        `Failed to create gig: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!state.title || !state.desc || !state.shortTitle || !state.shortDesc) {
      alert("Please fill in all required text fields");
      return;
    }

    if (!state.cat) {
      alert("Please select a category");
      return;
    }

    if (!state.cover) {
      alert("Please upload a cover image first");
      return;
    }

    if (!state.price || state.price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    if (!state.deliveryTime || state.deliveryTime <= 0) {
      alert("Please enter a valid delivery time");
      return;
    }

    if (!state.revisionNumber || state.revisionNumber < 0) {
      alert("Please enter a valid revision number");
      return;
    }

    console.log("Submitting gig with data:", state);
    mutation.mutate(state);
  };

  return (
    <div className="add">
      <div className="add-container">
        <div className="add-header">
          <h1 className="add-title">Add New Gig</h1>
          <p className="add-subtitle">
            Create a new service listing to start earning
          </p>
        </div>

        <div className="add-form">
          <div className="form-sections">
            <div className="left-section">
              <h2 className="section-title">Basic Information</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Title *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  id="title"
                  placeholder="e.g. I will do something I'm really good at"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cat">
                  Category *
                </label>
                <select
                  className="form-select"
                  name="cat"
                  id="cat"
                  value={state.cat}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  <option value="design">Design</option>
                  <option value="web">Web Development</option>
                  <option value="animation">Animation</option>
                  <option value="music">Music</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea"
                  name="desc"
                  placeholder="Brief descriptions to introduce your service to customers"
                  rows="6"
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="file-upload-section">
                <label className="form-label">Images *</label>
                <div className="file-inputs">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cover">
                      Cover Image
                    </label>
                    <input
                      className="file-input"
                      type="file"
                      id="cover"
                      onChange={(e) => setSingleFile(e.target.files[0])}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="images">
                      Additional Images
                    </label>
                    <input
                      className="file-input"
                      type="file"
                      id="images"
                      multiple
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </div>
                </div>
                <button
                  className="form-button upload-btn"
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Images"}
                </button>
              </div>
            </div>

            <div className="right-section">
              <h2 className="section-title">Service Details</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="shortTitle">
                  Service Title *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="shortTitle"
                  id="shortTitle"
                  placeholder="e.g. One-page web design"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="shortDesc">
                  Short Description *
                </label>
                <textarea
                  className="form-textarea"
                  name="shortDesc"
                  id="shortDesc"
                  placeholder="Short description of your service"
                  rows="4"
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="deliveryTime">
                  Delivery Time (days) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="deliveryTime"
                  id="deliveryTime"
                  placeholder="e.g. 3"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="revisionNumber">
                  Revision Number *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="revisionNumber"
                  id="revisionNumber"
                  placeholder="e.g. 2"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  Price ($) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="price"
                  id="price"
                  placeholder="e.g. 50"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Add Features</label>
                <form className="feature-form" onSubmit={handleFeature}>
                  <input
                    className="form-input feature-input"
                    type="text"
                    placeholder="e.g. page design"
                  />
                  <button className="add-feature-btn" type="submit">
                    Add
                  </button>
                </form>
                <div className="added-features">
                  {state?.features?.map((f) => (
                    <div className="feature-tag" key={f}>
                      <span>{f}</span>
                      <button
                        className="remove-btn"
                        onClick={() =>
                          dispatch({ type: "REMOVE_FEATURE", payload: f })
                        }
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            className="form-button create-btn"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating Gig..." : "Create Gig"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;
