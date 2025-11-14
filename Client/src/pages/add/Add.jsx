import React, { useReducer, useEffect, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";
import { useMode } from "../../context/ModeContext";
import CountrySelect from "../../components/CountrySelect/CountrySelect";

const Add = () => {
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const { isInSellerMode, isSeller, currentUser, user } = useMode();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if user is not in seller mode
  useEffect(() => {
    if (!isSeller || !isInSellerMode) {
      console.log("Add page access denied:", { isSeller, isInSellerMode });
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

    // Get final description (combine fields if needed)
    const finalAbout = getFinalDescription();
    
    if (!finalAbout || finalAbout.trim().length < 50) {
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

    // Get userId from currentUser or user
    const userId = currentUser?._id || user?._id;

    if (!userId) {
      alert("User ID not found. Please log in again.");
      console.error("User ID missing:", { currentUser, user });
      return;
    }

    // Ensure userId is set in the gig data and combine description fields
    const gigData = {
      ...state,
      userId: userId,
      about: finalAbout,
    };

    console.log("Submitting gig with data:", gigData);
    mutation.mutate(gigData);
  };

  // Helper to check if value is still the default prefilled text
  const isDefaultValue = (value, defaultValue) => {
    if (!value || !defaultValue) return false;
    return value.trim() === defaultValue.trim();
  };

  // Combine structured fields into 'about' if main field is empty, otherwise use main field
  const getFinalDescription = () => {
    if (state.about && state.about.trim().length > 0) {
      return state.about;
    }
    // If main field is empty, combine structured fields
    const parts = [];
    // Only include fields that have been modified (not just placeholder text)
    const defaultGoodsCan = INITIAL_STATE.goodsCan;
    const defaultGoodsCannot = INITIAL_STATE.goodsCannot;
    
    if (state.goodsCan && !isDefaultValue(state.goodsCan, defaultGoodsCan)) {
      parts.push(`Goods I CAN transport:\n${state.goodsCan}`);
    }
    if (state.goodsCannot && !isDefaultValue(state.goodsCannot, defaultGoodsCannot)) {
      parts.push(`Goods I CANNOT transport:\n${state.goodsCannot}`);
    }
    return parts.join('\n\n') || '';
  };

  return (
    <div className="add">
      {/* Mobile Top Bar */}
      <div className="add-top-bar">
        <Link to="/" className="add-logo">
          <img
            src="https://res.cloudinary.com/dzmrfifoq/image/upload/v1761657923/OFFICIAL-LOGO_ccpbzm.png"
            alt="LUGGAGE-SHARE Logo"
            className="add-logo-img"
          />
        </Link>
        <button
          className="add-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={mobileMenuOpen ? "open" : ""}></span>
          <span className={mobileMenuOpen ? "open" : ""}></span>
          <span className={mobileMenuOpen ? "open" : ""}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="add-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="add-menu-content" onClick={(e) => e.stopPropagation()}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/gigs" onClick={() => setMobileMenuOpen(false)}>Explore Luggage</Link>
            <Link to="/mygigs" onClick={() => setMobileMenuOpen(false)}>My Gigs</Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
          </div>
        </div>
      )}

      <div className="add-container">
        <div className="add-form-wrapper">
          <h2 className="add-page-title">Listing Information</h2>

          <form className="add-form" onSubmit={handleSubmit}>
            {/* Listing Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Listing Title <span className="required-indicator">*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="title"
                id="title"
                placeholder="e.g. Dubai to Lahore - Reliable Luggage Transport Service"
                value={state.title || ""}
                onChange={handleChange}
                maxLength="100"
                required
              />
              <span className="form-helper">
                Create a clear, descriptive title for your luggage transport service
              </span>
            </div>

            {/* Service Description - Main Textarea */}
            <div className="form-group">
              <label className="form-label" htmlFor="about">
                Service Description <span className="required-indicator">*</span>
              </label>
              <textarea
                className="form-textarea form-textarea-main"
                name="about"
                id="about"
                placeholder="Start typing your service description here..."
                value={state.about || ""}
                onChange={handleChange}
                minLength="50"
                required
              />
              <span className="form-helper">
                <strong>⚠️ IMPORTANT:</strong> Provide a detailed description of your service. Minimum 50 characters.
              </span>
            </div>

            {/* Goods I CAN Transport */}
            <div className="form-group">
              <label className="form-label" htmlFor="goodsCan">
                Goods I CAN Transport
              </label>
              <textarea
                className={`form-textarea ${isDefaultValue(state.goodsCan, INITIAL_STATE.goodsCan) ? 'prefilled' : ''}`}
                name="goodsCan"
                id="goodsCan"
                value={state.goodsCan || ""}
                onChange={(e) => {
                  dispatch({
                    type: "CHANGE_INPUT",
                    payload: { name: e.target.name, value: e.target.value },
                  });
                }}
                rows="5"
              />
              <span className="form-helper">
                List the types of goods you can safely transport (one per line or bulleted) - optional
              </span>
            </div>

            {/* Goods I CANNOT Transport */}
            <div className="form-group">
              <label className="form-label" htmlFor="goodsCannot">
                Goods I CANNOT Transport
              </label>
              <textarea
                className={`form-textarea ${isDefaultValue(state.goodsCannot, INITIAL_STATE.goodsCannot) ? 'prefilled' : ''}`}
                name="goodsCannot"
                id="goodsCannot"
                value={state.goodsCannot || ""}
                onChange={(e) => {
                  dispatch({
                    type: "CHANGE_INPUT",
                    payload: { name: e.target.name, value: e.target.value },
                  });
                }}
                rows="5"
              />
              <span className="form-helper">
                Clearly specify what you cannot transport to avoid misunderstandings (optional)
              </span>
            </div>

            {/* Departure Information */}
            <div className="form-section-divider"></div>
            <h3 className="form-section-title">Departure Information</h3>

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
                Departure City <span className="required-indicator">*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="departureCity"
                id="departureCity"
                placeholder="e.g. Dubai"
                value={state.departureCity || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Destination Information */}
            <div className="form-section-divider"></div>
            <h3 className="form-section-title">Destination Information</h3>

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
                Destination City <span className="required-indicator">*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="destinationCity"
                id="destinationCity"
                placeholder="e.g. Lahore"
                value={state.destinationCity || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Pricing & Details */}
            <div className="form-section-divider"></div>
            <h3 className="form-section-title">Pricing & Details</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="availableSpace">
                Available Space (kg) <span className="required-indicator">*</span>
              </label>
              <input
                className="form-input"
                type="number"
                name="availableSpace"
                id="availableSpace"
                placeholder="e.g. 15"
                value={state.availableSpace || ""}
                onChange={handleChange}
                min="0.5"
                step="0.5"
                required
              />
              <span className="form-helper">
                How many kilograms of luggage space can you offer?
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="priceRMB">
                Price per kg (¥ RMB) <span className="required-indicator">*</span>
              </label>
              <input
                className="form-input"
                type="number"
                name="priceRMB"
                id="priceRMB"
                placeholder="e.g. 120"
                value={state.priceRMB || ""}
                onChange={handleChange}
                min="1"
                step="1"
                required
              />
              <span className="form-helper">
                Set your price per kilogram in Chinese Yuan (¥)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expirationDays">
                Expiration (days) <span className="required-indicator">*</span>
              </label>
              <input
                className="form-input"
                type="number"
                name="expirationDays"
                id="expirationDays"
                placeholder="e.g. 22"
                value={state.expirationDays || ""}
                onChange={handleChange}
                min="1"
                required
              />
              <span className="form-helper">
                How many days until this offer expires?
              </span>
            </div>

            {/* Hidden submit button for form validation */}
            <button type="submit" style={{ display: "none" }} />
          </form>
        </div>

        {/* Fixed Bottom CTA Button */}
        <div className="add-cta-container">
          <button
            className="add-cta-button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Gig"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;
