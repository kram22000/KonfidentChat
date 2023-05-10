const initialState = {
    isAuthenticated: false,
    userData: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return { ...state, isAuthenticated: true, userData: action.payload };
      case 'LOGOUT':
        return { ...state, isAuthenticated: false, userData: null };
      default:
        return state;
    }
  };
  
  export default authReducer;
  