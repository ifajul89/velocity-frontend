import { createSlice } from "@reduxjs/toolkit";

export type TCar = {
  name: string;
  brand: string;
  model: string;
  image?: FileList;
  year: number;
  price: number;
  category: "Sedan" | "SUV" | "Truck" | "Coupe" | "Convertible";
  description: string;
  quantity: number;
  inStock: boolean;
};

const carSlice = createSlice({
  name: "car",
  initialState: {
    car: {} as TCar,
    loading: false,
    error: null,
  },
  reducers: {
    setCar: (state, action) => {
      state.car = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCar, setLoading, setError } = carSlice.actions;
export default carSlice.reducer;
