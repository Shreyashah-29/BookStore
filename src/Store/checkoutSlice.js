import { createSlice } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    activeStep: 0,
    cartBooks: [],
    contactInfo: {
      receiverName: '',
      receiverPhone: ''
    },
    addresses: [],
    selectedAddress: '',
    newAddress: {
      house: '',
      city: '',
      pinCode: '',
      roadAreaColony: '',
      state: ''
    },
    paymentOption: 'card',
    paymentDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    },
    googlePayPin: '',
    snackbarOpen: false,
    orderPlaced: false
  },
  reducers: {
    setActiveStep(state, action) {
      state.activeStep = action.payload;
    },
    setCartBooks(state, action) {
      state.cartBooks = action.payload;
    },
    setContactInfo(state, action) {
      state.contactInfo = action.payload;
      console.log(state.contactInfo);
    },
    setAddresses(state, action) {
      state.addresses = action.payload;
    },
    setSelectedAddress(state, action) {
      state.selectedAddress = action.payload;
    },
    setNewAddress(state, action) {
      state.newAddress = action.payload;
      console.log(state.newAddress);
    },
    setPaymentOption(state, action) {
      state.paymentOption = action.payload;
    },
    setPaymentDetails(state, action) {
      state.paymentDetails = action.payload;
    },
    setGooglePayPin(state, action) {
      state.googlePayPin = action.payload;
    },
    setSnackbarOpen(state, action) {
      state.snackbarOpen = action.payload;
    },
    setOrderPlaced(state, action) {
      state.orderPlaced = action.payload;
    }
  }
});

export const {
  setActiveStep,
  setCartBooks,
  setContactInfo,
  setAddresses,
  setSelectedAddress,
  setNewAddress,
  setPaymentOption,
  setPaymentDetails,
  setGooglePayPin,
  setSnackbarOpen,
  setOrderPlaced
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
