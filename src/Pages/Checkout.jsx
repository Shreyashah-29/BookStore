import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Stepper, Step, StepLabel, Button, Box, TextField, Card, CardContent, CardMedia, Grid, Divider, FormControl, FormLabel, InputAdornment,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFirebase } from '../Context/Firebase';
import { doc, getDoc, setDoc, collection, addDoc, getFirestore } from 'firebase/firestore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { v4 as uuidv4 } from 'uuid';

const steps = ['Review Cart', 'Contact Information', 'Shipping Address', 'Payment Details'];

const Checkout = () => {

  const location = useLocation();
  const { user } = useFirebase();
  const [activeStep, setActiveStep] = useState(0);
  const [contactInfo, setContactInfo] = useState({
    receiverName: '',
    receiverPhone: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({
    house: '',
    city: '',
    pinCode: '',
    roadAreaColony: '',
    state: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [paymentOption, setPaymentOption] = useState('');
  const [googlePayPin, setGooglePayPin] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  // const cartBooks = location.state?.books|| [];
  const { books = [], total = 0 } = location.state || {}
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setContactInfo({
              receiverName: userData.name || '',
              receiverPhone: userData.mobile || ''
            });

            if (userData.addresses) {
              setAddresses(userData.addresses);
              if (userData.addresses.length > 0) {
                setSelectedAddress(userData.addresses[0].id);
              }
            }
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    fetchUserData();
  }, [db, user]);

  useEffect(() => {
    if (activeStep === 2 && selectedAddress) {
      const address = addresses.find(addr => addr.id === selectedAddress);
      if (address) {
        setNewAddress({
          house: address.house || '',
          city: address.city || '',
          pinCode: address.pinCode || '',
          roadAreaColony: address.roadAreaColony || '',
          state: address.state || ''
        });
      }
    }
  }, [activeStep, selectedAddress, addresses]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      placeOrder();
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prevContactInfo => ({ ...prevContactInfo, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prevAddress => ({ ...prevAddress, [name]: value }));
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .substring(0, 19);
  };

  const formatExpiryDate = (value) => {
    const parts = value.replace(/\D/g, '').substring(0, 4);
    if (parts.length <= 2) return parts;
    return `${parts.substring(0, 2)}/${parts.substring(2, 4)}`;
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setPaymentDetails(prevPayment => ({
        ...prevPayment,
        cardNumber: formatCardNumber(value),
      }));
    } else if (name === 'expiryDate') {
      setPaymentDetails(prevPayment => ({
        ...prevPayment,
        expiryDate: formatExpiryDate(value),
      }));
    } else {
      setPaymentDetails(prevPayment => ({ ...prevPayment, [name]: value }));
    }
  };

  const handleGooglePayPinChange = (e) => {
    setGooglePayPin(e.target.value);
  };

  const handleAddNewAddress = () => {
    setNewAddress({
      house: '',
      city: '',
      pinCode: '',
      roadAreaColony: '',
      state: ''
    });

    setSelectedAddress('');
    setActiveStep(2);
  };

  const handlePaymentOptionChange = (e) => {
    setPaymentOption(e.target.value);
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    setGooglePayPin('');
  };

  const placeOrder = async () => {
    if (user) {
      try {
        if (paymentOption === 'googlePay') {
          if (!googlePayPin || googlePayPin.length !== 4) {
            alert('Please enter a valid 4-digit Google Pay PIN.');
            return;
          }
        } else if (paymentOption === 'card') {
          if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
            alert('Please complete the payment details.');
            return;
          }
        } else {
          alert('Please select a payment method.');
          return;
        }

        // Determine whether to update an existing address or add a new one
        let addressToUse = addresses.find(addr => addr.id === selectedAddress);
        if (!addressToUse && (newAddress.house || newAddress.city || newAddress.pinCode || newAddress.roadAreaColony || newAddress.state)) {
          const existingAddressIndex = addresses.findIndex(addr =>
            addr.house === newAddress.house &&
            addr.city === newAddress.city &&
            addr.pinCode === newAddress.pinCode &&
            addr.roadAreaColony === newAddress.roadAreaColony &&
            addr.state === newAddress.state
          );

          if (existingAddressIndex === -1) {
            const addressId = `address_${new Date().getTime()}`;
            const newAddressData = { id: addressId, ...newAddress };

            await setDoc(doc(db, 'users', user.uid), {
              addresses: [...addresses, newAddressData]
            }, { merge: true });

            setAddresses([...addresses, newAddressData]);
            addressToUse = newAddressData;
          } else {
            addressToUse = addresses[existingAddressIndex];
          }
        }

        const orderDate = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(orderDate.getDate() + 5);

        // Generate coupon code
        const generateCouponCode = () => {
          return uuidv4().split('-')[0].toUpperCase();
        };
        const newCouponCode = generateCouponCode();

        // add order
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          ...contactInfo,
          address: addressToUse,
          books,
          paymentDetails: paymentOption === 'card' ? paymentDetails : {},
          paymentOption,
          createdAt: orderDate,
          deliveryDate: deliveryDate,
          couponCode: newCouponCode
        });

        await setDoc(doc(db, 'users', user.uid), {
          couponCode: newCouponCode
        }, { merge: true });

        //Remove product from cart 
        const cartRef = doc(db, 'carts', user.uid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          const userCartBooks = cartData.books || [];
          const updatedCart = userCartBooks.filter(book => !books.some(cartBook => cartBook.isbn === book.isbn));
          await setDoc(cartRef, { books: updatedCart }, { merge: true });
        }
        setCouponCode(newCouponCode); // Set the coupon code state
        setOrderPlaced(true);
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } catch (error) {
        console.error('Error placing order: ', error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate("/orders")
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom >
              Review your cart
            </Typography>
            {books.length > 0 ? (
              <Grid container spacing={2}>
                {books.map((book, index) => (
                  <Grid item xs={12} sm={12} md={12} key={index}>
                    <Card sx={{ display: 'flex', flexDirection: 'row', borderRadius: 2, boxShadow: 2, height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={book.imageURL || 'https://via.placeholder.com/140'}
                        alt={book.title}
                        sx={{ width: 140, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {book.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Price:</b> ${book.price}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Quantity:</b> {book.quantity}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">No items in the cart</Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom >
              Total: <span style={{ color: '#0a410a' }}>${total}</span>
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom >
              Contact Info
            </Typography>
            <Typography variant="body1" gutterBottom color="text.secondary">
              {contactInfo.receiverName}
            </Typography>
            <Typography variant="body1" gutterBottom color="text.secondary">
              {contactInfo.receiverPhone}
            </Typography>

            <Typography variant="h6" gutterBottom mt={5}>
              Shipping Address
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
              {addresses.length === 0 ? (
                <Button variant="contained" onClick={handleAddNewAddress}>
                  Add Address
                </Button>
              ) : (
                addresses.map(address => (
                  <Box
                    key={address.id}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: selectedAddress === address.id ? 'primary.main' : 'grey.300',
                      borderRadius: 1,
                      width: { xs: '100%', sm: '48%', md: '30%' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <LocationOnIcon color="action" />
                    <Box>
                      <Typography variant="body1" color="text.primary">
                        {address.house}, {address.city}, {address.state}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {address.roadAreaColony}, {address.pinCode}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => {
                          setSelectedAddress(address.id);
                          setActiveStep(2);
                        }}
                      >
                        Select
                      </Button>
                    </Box>
                  </Box>
                ))
              )}

            </Box>
            {addresses.length > 0 && (
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddNewAddress}>
                Add New Address
              </Button>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom >
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Receiver's Name"
                  name="receiverName"
                  fullWidth
                  variant="outlined"
                  value={contactInfo.receiverName}
                  onChange={handleContactChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Receiver's Phone Number"
                  name="receiverPhone"
                  fullWidth
                  variant="outlined"
                  value={contactInfo.receiverPhone}
                  onChange={handleContactChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h5" gutterBottom >
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="House Number"
                  name="house"
                  fullWidth
                  variant="outlined"
                  value={newAddress.house}
                  onChange={handleAddressChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  name="city"
                  fullWidth
                  variant="outlined"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pin Code"
                  name="pinCode"
                  fullWidth
                  variant="outlined"
                  value={newAddress.pinCode}
                  onChange={handleAddressChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Road/Area/Colony"
                  name="roadAreaColony"
                  fullWidth
                  variant="outlined"
                  value={newAddress.roadAreaColony}
                  onChange={handleAddressChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="State"
                  name="state"
                  fullWidth
                  variant="outlined"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Grid container spacing={4} mt={5}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Book Details
              </Typography>
              {books.length > 0 ? (
                <Grid container spacing={2}>
                  {books.map((book, index) => (
                    <Grid item xs={10} sm={10} md={10} key={index}>
                      <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 2, height: '100%' }}>
                        <CardContent sx={{ flex: 1 }} >
                          <Typography variant="h6" component="div" fontFamily={'cursive'} gutterBottom >
                            Book Name: {book.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" fontFamily={'cursive'}>
                            <b>Price:</b> ${book.price}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" fontFamily={'cursive'}>
                            <b>Quantity:</b> {book.quantity}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary">No items in the cart</Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 2, height: '100%' }}>
                  <CardContent sx={{ flex: 1 }} >
                    <Typography variant="body1" color="text.secondary" fontFamily={'cursive'}>
                      {`${newAddress.house}, ${newAddress.roadAreaColony}, ${newAddress.city}, ${newAddress.state}, ${newAddress.pinCode}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Payment Details
              </Typography>
              <Typography variant="h6" fontFamily={'cursive'}>
                Total: <span style={{ backgroundColor: 'lightcoral', padding: "3px" }}>${total}</span>
              </Typography>
              <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                <FormLabel component="legend">Payment Method</FormLabel>
                <RadioGroup
                  value={paymentOption}
                  onChange={handlePaymentOptionChange}
                >
                  <FormControlLabel
                    value="googlePay"
                    control={<Radio />}
                    label="Google Pay"
                  />
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label="Credit/Debit Card"
                  />
                </RadioGroup>
              </FormControl>

              {paymentOption === 'googlePay' && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Google Pay PIN"
                    name="googlePayPin"
                    fullWidth
                    variant="outlined"
                    type="password"
                    value={googlePayPin}
                    onChange={handleGooglePayPinChange}
                    inputProps={{ maxLength: 4 }}
                    helperText="Enter a 4-digit PIN"
                  />
                </Box>
              )}

              {paymentOption === 'card' && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    fullWidth
                    variant="outlined"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentChange}
                    inputProps={{ maxLength: 19 }}
                    helperText="Enter a 16-digit card number"
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">**** **** ****</InputAdornment>,
                      inputProps: {
                        pattern: "[0-9]*",
                        maxLength: 19
                      }
                    }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Expiry Date"
                        name="expiryDate"
                        fullWidth
                        variant="outlined"
                        value={paymentDetails.expiryDate}
                        onChange={handlePaymentChange}
                        helperText="MM/YY format"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">MM/YY</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="CVV"
                        name="cvv"
                        fullWidth
                        variant="outlined"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentChange}
                        inputProps={{ maxLength: 3 }}
                        helperText="3-digit CVV"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {orderPlaced ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: (theme) => theme.zIndex.snackbar,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            pointerEvents: 'none',
          }}
        >
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            sx={{
              width: 'auto',
              maxWidth: '400px',
              pointerEvents: 'auto',
              transform: {
                xs: 'translate(10%, -60%)',
                sm: 'translate(180%, -100%)',
                md: 'translate(180%, -100%)'

              },
            }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: '#333',
                color: '#fff',
                padding: 3,
                borderRadius: 2,
                boxShadow: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <div>
                Order placed successfully!
              </div>
              <div>
                <strong>Your coupon code is:</strong> {couponCode}
              </div>
            </Alert>
          </Snackbar>
        </Box>
      ) : (
        renderStepContent(activeStep)
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {activeStep > 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
        </Button>
      </Box>

    </Container>
  );
};

export default Checkout;
