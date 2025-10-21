import React, { useReducer, useEffect } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { useMode } from "../../context/ModeContext";
import CountrySelect from "../../components/CountrySelect/CountrySelect";

const Add = () => {
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const { isInSellerMode, isSeller } = useMode();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect if user is not in seller mode
  useEffect(() => {
    if (!isSeller || !isInSellerMode) {
      navigate("/");
    }
  }, [isSeller, isInSellerMode, navigate]);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

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
    if (!state.title || state.title.trim().length < 10) {
      alert("Please enter a title (minimum 10 characters)");
      return;
    }

    if (!state.about || state.about.trim().length < 50) {
      alert(
        "Please provide a detailed description (minimum 50 characters). Include what types of goods you can transport."
      );
      return;
    }

    if (!state.departureCountry) {
      alert("Please select a departure country");
      return;
    }

    if (!state.departureCity) {
      alert("Please enter a departure city");
      return;
    }

    if (!state.destinationCountry) {
      alert("Please select a destination country");
      return;
    }

    if (!state.destinationCity) {
      alert("Please enter a destination city");
      return;
    }

    if (!state.availableSpace || state.availableSpace <= 0) {
      alert("Please enter a valid available space in kg");
      return;
    }

    if (!state.priceRMB || state.priceRMB <= 0) {
      alert("Please enter a valid price per kg in RMB (¥)");
      return;
    }

    if (!state.expirationDays || state.expirationDays <= 0) {
      alert("Please enter a valid expiration period in days");
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
            Create a new luggage space listing for travelers
          </p>
        </div>

        <div className="add-form">
          {/* Listing Title and Description */}
          <div className="form-sections">
            <div className="full-width-section">
              <h2 className="section-title">Listing Information</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Listing Title *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  id="title"
                  placeholder="e.g. Dubai to Lahore - Reliable Luggage Transport Service"
                  onChange={handleChange}
                  maxLength="100"
                />
                <span className="form-helper">
                  Create a clear, descriptive title for your luggage transport
                  service
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="about">
                  Service Description * (What goods can you transport?)
                </label>
                <textarea
                  className="form-textarea"
                  name="about"
                  id="about"
                  placeholder="Example: I'm traveling from Dubai to Lahore and have 15kg of extra luggage space available. I can transport the following items:

• Electronics (phones, tablets, laptops - sealed in original packaging)
• Clothing and textiles
• Documents and small packages
• Cosmetics and personal care items
• Small gifts and souvenirs

I CANNOT transport:
✗ Prohibited items (weapons, drugs, etc.)
✗ Liquids over 100ml
✗ Fragile glass items
✗ Perishable food items

I'm a verified traveler with 5+ years experience. All items will be handled with care and delivered promptly. I'll provide tracking updates throughout the journey."
                  onChange={handleChange}
                  rows="10"
                  minLength="50"
                />
                <span className="form-helper">
                  <strong>⚠️ IMPORTANT:</strong> You MUST specify what types of
                  goods you can and cannot transport. Include any restrictions,
                  handling instructions, and your experience level. Minimum 50
                  characters.
                </span>
              </div>
            </div>
          </div>

          <div className="form-sections">
            <div className="left-section">
              <h2 className="section-title">Departure Information</h2>

              <div className="form-group">
                <CountrySelect
                  name="departureCountry"
                  id="departureCountry"
                  value={state.departureCountry || ""}
                  onChange={handleChange}
                  label="Departure Country"
                  placeholder="Select departure country"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="departureCity">
                  Departure City *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="departureCity"
                  id="departureCity"
                  placeholder="e.g. Dubai"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="availableSpace">
                  Available Space (kg) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="availableSpace"
                  id="availableSpace"
                  placeholder="e.g. 15"
                  min="0.5"
                  step="0.5"
                  onChange={handleChange}
                />
                <span className="form-helper">
                  How many kilograms of luggage space can you offer?
                </span>
              </div>
            </div>

            <div className="right-section">
              <h2 className="section-title">Destination Information</h2>

              <div className="form-group">
                <CountrySelect
                  name="destinationCountry"
                  id="destinationCountry"
                  value={state.destinationCountry || ""}
                  onChange={handleChange}
                  label="Destination Country"
                  placeholder="Select destination country"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="destinationCity">
                  Destination City *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="destinationCity"
                  id="destinationCity"
                  placeholder="e.g. Lahore"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="priceRMB">
                  Price per kg (¥ RMB) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="priceRMB"
                  id="priceRMB"
                  placeholder="e.g. 120"
                  min="1"
                  step="1"
                  onChange={handleChange}
                />
                <span className="form-helper">
                  Set your price per kilogram in Chinese Yuan (¥)
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expirationDays">
                  Expiration (days) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="expirationDays"
                  id="expirationDays"
                  placeholder="e.g. 22"
                  min="1"
                  onChange={handleChange}
                />
                <span className="form-helper">
                  How many days until this offer expires?
                </span>
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
