export const INITIAL_STATE = {
  title: "",
  about: "", // Detailed description of the container service
  containerType: "20ft", // Default to 20ft container
  cargoType: "",
  taxClearance: "handled_by_courier", // Default to handled by courier
  locationCountry: "",
  locationCity: "",
  availableSpaceCBM: 0, // Available space in cubic meters
  priceRMB: 0, // Price per CBM in Chinese Yuan
  departureDate: "",
  arrivalDate: "",
  expirationDays: 0, // Days until listing expires
};

export const containerReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};
