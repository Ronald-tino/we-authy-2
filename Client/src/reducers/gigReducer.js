export const INITIAL_STATE = {
  title: "",
  about: "", // Required: Detailed description of the luggage service
  goodsCan: "• Electronics (phones, tablets, laptops - sealed in original packaging)\n• Clothing and textiles\n• Documents and small packages\n• Cosmetics and personal care items\n• Small gifts and souvenirs", // Optional: Goods I CAN transport (prefilled)
  goodsCannot: "✗ Prohibited items (weapons, drugs, etc.)\n✗ Liquids over 100ml\n✗ Fragile glass items\n✗ Perishable food items", // Optional: Goods I CANNOT transport (prefilled)
  departureCountry: "",
  departureCity: "",
  destinationCountry: "",
  destinationCity: "",
  availableSpace: 0,
  priceRMB: 0, // Price per kg in Chinese Yuan
  expirationDays: 0,
  // Legacy fields (optional)
  cat: "luggage-transport",
  cover: "",
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  revisionNumber: 0,
  features: [],
  price: 0,
};

export const gigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };
    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };

    default:
      return state;
  }
};
