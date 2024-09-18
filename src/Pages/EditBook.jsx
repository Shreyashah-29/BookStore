import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Box
} from '@mui/material';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

const EditBook = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState({ title: '', author: '', isbn: '', imageURL: '', description: '', bookType: '', price: '' });
  const [originalBookData, setOriginalBookData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();
  const theme = useTheme();


  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const db = getFirestore();
        const bookDoc = doc(db, 'books', id);
        const docSnapshot = await getDoc(bookDoc);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setBookData(data);
          setOriginalBookData(data);
        } else {
          setSnackbarMessage('No book data found');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (err) {
        setSnackbarMessage('Error fetching book data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchBookData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const bookDoc = doc(db, 'books', id);
      await updateDoc(bookDoc, bookData);
      setSnackbarMessage('Book updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate(`/book/${id}`);
      }, 2000);
    } catch (err) {
      setSnackbarMessage('Error updating book');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setBookData(originalBookData);
    navigate('/account');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: theme.palette.background.paper,
        boxShadow: 3,
        borderRadius: 2,
        p: 4,
        mt: 2,
        mb: 5,
        width: '100%',
        overflow: 'auto'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Book
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={bookData.title}
            onChange={handleInputChange}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ISBN"
            name="isbn"
            value={bookData.isbn}
            onChange={handleInputChange}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={bookData.price}
            onChange={handleInputChange}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={bookData.description}
            onChange={handleInputChange}
            required
            multiline
            rows={4}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Image URL"
            name="imageURL"
            value={bookData.imageURL}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Book Type</InputLabel>
            <Select
              name="bookType"
              value={bookData.bookType}
              onChange={handleInputChange}
              label="Book Type"
            >
              <MenuItem value="Programming">Programming</MenuItem>
              <MenuItem value="Religious">Religious</MenuItem>
              <MenuItem value="Fiction">Fiction</MenuItem>
              <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
              <MenuItem value="Biography">Biography</MenuItem>
              <MenuItem value="History">History</MenuItem>
              <MenuItem value="Thrillers">Thrillers</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleUpdate}
            >
              Update Book
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        action={
          <Button color="inherit" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditBook;
