import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {
      userName: "",
      email: "",
      mobileNumber: "",
    },
  },
  reducers: {
    registerSucess: (state, action) => {
     state.userInfo = action.payload
    },
  },
});

export const { registerSucess } = userSlice.actions;
export default userSlice.reducer;