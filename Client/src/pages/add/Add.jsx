import React, { useReducer } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

// ISO Country codes list
const COUNTRIES = [
  { code: "AE", name: "United Arab Emirates" },
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "AM", name: "Armenia" },
  { code: "AR", name: "Argentina" },
  { code: "AT", name: "Austria" },
  { code: "AU", name: "Australia" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CH", name: "Switzerland" },
  { code: "CN", name: "China" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DE", name: "Germany" },
  { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" },
  { code: "ES", name: "Spain" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IN", name: "India" },
  { code: "IQ", name: "Iraq" },
  { code: "IR", name: "Iran" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "KE", name: "Kenya" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "LB", name: "Lebanon" },
  { code: "LK", name: "Sri Lanka" },
  { code: "MA", name: "Morocco" },
  { code: "MX", name: "Mexico" },
  { code: "MY", name: "Malaysia" },
  { code: "NG", name: "Nigeria" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "NZ", name: "New Zealand" },
  { code: "OM", name: "Oman" },
  { code: "PH", name: "Philippines" },
  { code: "PK", name: "Pakistan" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SE", name: "Sweden" },
  { code: "SG", name: "Singapore" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "TW", name: "Taiwan" },
  { code: "UA", name: "Ukraine" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
  { code: "ZA", name: "South Africa" },
];

const Add = () => {
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
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

    if (!state.price || state.price <= 0) {
      alert("Please enter a valid price");
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
          <div className="form-sections">
            <div className="left-section">
              <h2 className="section-title">Departure Information</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="departureCountry">
                  Departure Country *
                </label>
                <select
                  className="form-select"
                  name="departureCountry"
                  id="departureCountry"
                  value={state.departureCountry || ""}
                  onChange={handleChange}
                >
                  <option value="">Select departure country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </option>
                  ))}
                </select>
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
                  placeholder="e.g. 40"
                  min="1"
                  step="0.5"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="right-section">
              <h2 className="section-title">Destination Information</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="destinationCountry">
                  Destination Country *
                </label>
                <select
                  className="form-select"
                  name="destinationCountry"
                  id="destinationCountry"
                  value={state.destinationCountry || ""}
                  onChange={handleChange}
                >
                  <option value="">Select destination country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </option>
                  ))}
                </select>
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
                <label className="form-label" htmlFor="price">
                  Price (USD) *
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="price"
                  id="price"
                  placeholder="e.g. 298"
                  min="1"
                  step="0.01"
                  onChange={handleChange}
                />
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
