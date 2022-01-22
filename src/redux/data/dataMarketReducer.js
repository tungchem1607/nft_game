const initialState = {
  loading: false,
  allMarkets: [],
  allOwnerMarkets: [],
  error: false,
  errorMsg: "",
};

const dataMarketReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_MARKET_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CHECK_DATA_MARKET_SUCCESS":
      return {
        ...initialState,
        loading: false,
        allMarkets: action.payload.allMarkets,
        allOwnerMarkets: action.payload.allOwnerMarkets,
      };
    case "CHECK_DATA_MARKET_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataMarketReducer;
