import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  discount: [], // Holds the array of discount strings
  error: null, // For error handling
};

// Async Thunks

// Fetch the latest discounts
export const fetchDiscount = createAsyncThunk(
  "/discount/fetchDiscount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/common/discount/get`
      );
      console.log(response.data);
      return response.data; // Assuming response.data is an array of discount strings
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a new discount
export const addDiscount = createAsyncThunk(
  "/discount/addDiscount",
  async (text, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/common/discount/add`,
        { text }
      );
      return response.data; // Assuming response.data contains the newly added discount string
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update an existing discount
export const updateDiscount = createAsyncThunk(
  "/discount/updateDiscount",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/common/discount/update/${id}`,
        { text }
      );
      return response.data; // Assuming response.data contains the updated discount string
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a discount
export const deleteDiscount = createAsyncThunk(
  "/discount/deleteDiscount",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/common/discount/delete/${id}`
      );
      return { id, ...response.data }; // Return the ID of the deleted discount
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice

const discountSlice = createSlice({
  name: "discountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Discount
      .addCase(fetchDiscount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiscount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discount = action.payload; // Assuming payload is an array of discount strings
      })
      .addCase(fetchDiscount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch discounts.";
      })

      // Add Discount
      .addCase(addDiscount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDiscount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discount.push(action.payload); // Append the new discount to the array
      })
      .addCase(addDiscount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to add discount.";
      })

      // Update Discount
      .addCase(updateDiscount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedDiscount = action.payload; // Assuming payload is the updated discount object
        const index = state.discount.findIndex(
          (d) => d.id === updatedDiscount.id
        );
        if (index !== -1) {
          state.discount[index] = updatedDiscount;
        }
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update discount.";
      })

      // Delete Discount
      .addCase(deleteDiscount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discount = state.discount.filter(
          (d) => d.id !== action.payload.id
        ); // Remove the deleted discount by its ID
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete discount.";
      });
  },
});

export default discountSlice.reducer;
