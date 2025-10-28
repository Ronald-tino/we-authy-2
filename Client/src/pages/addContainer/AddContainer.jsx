import React, { useReducer, useEffect } from "react";
import "./AddContainer.scss";
import {
  containerReducer,
  INITIAL_STATE,
} from "../../reducers/containerReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { useMode } from "../../context/ModeContext";
import CountrySelect from "../../components/CountrySelect/CountrySelect";

const AddContainer = () => {
  const [state, dispatch] = useReducer(containerReducer, INITIAL_STATE);
  const { isInSellerMode, isSeller } = useMode();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect if user is not in seller mode
  useEffect(() => {
    if (!isSeller || !isInSellerMode) {
      console.log("AddContainer page access denied:", {
        isSeller,
        isInSellerMode,
      });
      if (!isSeller) {
        alert(
          "You need to become a seller first. Redirecting to the registration page..."
        );
        navigate("/become-seller");
      } else if (!isInSellerMode) {
        alert(
          "Please toggle to seller mode first using the switch in the navigation bar."
        );
        navigate("/");
      }
    }
  }, [isSeller, isInSellerMode, navigate]);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const mutation = useMutation({
    mutationFn: (container) => {
      return newRequest.post("/containers", container);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myContainers"]);
      navigate("/myContainers");
    },
    onError: (error) => {
      console.error("Error creating container:", error);
      alert(
        `Failed to create container: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!state.title || state.title.trim().length < 10) {
      alert("Please enter a title (minimum 10 characters)");
      return;
    }

    if (!state.about || state.about.trim().length < 50) {
      alert(
        "Please provide a detailed description (minimum 50 characters). Include container specifications and cargo types."
      );
      return;
    }

    if (!state.containerType) {
      alert("Please select a container type");
      return;
    }

    if (!state.cargoType || state.cargoType.trim().length < 10) {
      alert(
        "Please specify what types of cargo can be transported (minimum 10 characters)"
      );
      return;
    }

    if (!state.taxClearance) {
      alert("Please select tax clearance option");
      return;
    }

    if (!state.locationCountry) {
      alert("Please select a location country");
      return;
    }

    if (!state.locationCity) {
      alert("Please enter a location city");
      return;
    }

    if (!state.availableSpaceCBM || state.availableSpaceCBM <= 0) {
      alert("Please enter a valid available space in CBM");
      return;
    }

    if (!state.priceRMB || state.priceRMB <= 0) {
      alert("Please enter a valid price per CBM in RMB (¥)");
      return;
    }

    if (!state.departureDate) {
      alert("Please enter a departure date");
      return;
    }

    if (!state.arrivalDate) {
      alert("Please enter an arrival date");
      return;
    }

    if (!state.expirationDays || state.expirationDays <= 0) {
      alert("Please enter a valid expiration period in days");
      return;
    }

    // Validate dates
    const departure = new Date(state.departureDate);
    const arrival = new Date(state.arrivalDate);
    if (arrival <= departure) {
      alert("Arrival date must be after departure date");
      return;
    }

    console.log("Submitting container with data:", state);
    mutation.mutate(state);
  };

  return (
    <div className="add-container">
      <div className="add-container__wrapper">
        <div className="add-container__header">
          <h1 className="add-container__title">Add New Container</h1>
          <p className="add-container__subtitle">
            Create a new container space listing for cargo transport
          </p>
        </div>

        <div className="add-container__form">
          {/* Container Information */}
          <div className="form-sections">
            <div className="full-width-section">
              <h2 className="section-title">Container Information</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Listing Title *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  id="title"
                  placeholder="e.g. 40ft Container Space - Shanghai to Los Angeles"
                  onChange={handleChange}
                  maxLength="100"
                />
                <span className="form-helper">
                  Create a clear, descriptive title for your container listing
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="about">
                  Container Description * (Specifications and Details)
                </label>
                <textarea
                  className="form-textarea"
                  name="about"
                  id="about"
                  placeholder="Example: 40ft High Cube shipping container with 30 CBM of available space. Container is climate-controlled and suitable for various cargo types.

Key Features:
• Temperature controlled environment
• Secure and sealed container
• GPS tracking available
• Professional handling and loading
• Full insurance coverage

Ideal for businesses looking to ship bulk cargo internationally."
                  onChange={handleChange}
                  rows="10"
                  minLength="50"
                />
                <span className="form-helper">
                  <strong>⚠️ IMPORTANT:</strong> Provide detailed information
                  about the container specifications, features, and services.
                  Minimum 50 characters.
                </span>
              </div>
            </div>
          </div>

          <div className="form-sections">
            <div className="left-section">
              <h2 className="section-title">Container Specifications</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="containerType">
                  Container Type *
                </label>
                <select
                  className="form-input"
                  name="containerType"
                  id="containerType"
                  value={state.containerType}
                  onChange={handleChange}
                >
                  <option value="20ft">20ft Standard Container</option>
                  <option value="40ft">40ft Standard Container</option>
                  <option value="40ft-HC">40ft High Cube Container</option>
                </select>
                <span className="form-helper">
                  Select the type of shipping container
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cargoType">
                  Cargo Types Accepted *
                </label>
                <textarea
                  className="form-textarea"
                  name="cargoType"
                  id="cargoType"
                  placeholder="e.g. Electronics, Textiles, Machinery, Furniture, Non-perishable goods"
                  onChange={handleChange}
                  rows="4"
                  minLength="10"
                />
                <span className="form-helper">
                  Specify what types of cargo can be transported in this
                  container
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="taxClearance">
                  Tax Clearance *
                </label>
                <select
                  className="form-input"
                  name="taxClearance"
                  id="taxClearance"
                  value={state.taxClearance}
                  onChange={handleChange}
                >
                  <option value="handled_by_courier">Handled by Courier</option>
                  <option value="paid_separately">
                    Paid Separately by Client
                  </option>
                </select>
                <span className="form-helper">
                  Specify how customs and tax clearance will be handled
                </span>
              </div>

              <div className="form-group">
                <CountrySelect
                  name="locationCountry"
                  id="locationCountry"
                  value={state.locationCountry || ""}
                  onChange={handleChange}
                  label="Current Location Country"
                  placeholder="Select location country"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="locationCity">
                  Current Location City *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="locationCity"
                  id="locationCity"
                  placeholder="e.g. Shanghai"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="right-section">
              <h2 className="section-title">Pricing & Schedule</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="availableSpaceCBM">
                  Available Space (CBM) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="availableSpaceCBM"
                  id="availableSpaceCBM"
                  placeholder="e.g. 30"
                  min="0.5"
                  step="0.5"
                  onChange={handleChange}
                />
                <span className="form-helper">
                  How many cubic meters of container space are available?
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="priceRMB">
                  Price per CBM (¥ RMB) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="priceRMB"
                  id="priceRMB"
                  placeholder="e.g. 500"
                  min="1"
                  step="1"
                  onChange={handleChange}
                />
                <span className="form-helper">
                  Set your price per cubic meter in Chinese Yuan (¥)
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="departureDate">
                  Departure Date *
                </label>
                <input
                  className="form-input"
                  type="date"
                  name="departureDate"
                  id="departureDate"
                  onChange={handleChange}
                />
                <span className="form-helper">
                  When will the container depart?
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="arrivalDate">
                  Estimated Arrival Date *
                </label>
                <input
                  className="form-input"
                  type="date"
                  name="arrivalDate"
                  id="arrivalDate"
                  onChange={handleChange}
                />
                <span className="form-helper">
                  When is the container expected to arrive?
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expirationDays">
                  Listing Expiration (days) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="expirationDays"
                  id="expirationDays"
                  placeholder="e.g. 30"
                  min="1"
                  onChange={handleChange}
                />
                <span className="form-helper">
                  How many days until this container listing expires?
                </span>
              </div>
            </div>
          </div>

          <button
            className="form-button create-btn"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Creating Container..."
              : "Create Container Listing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContainer;
