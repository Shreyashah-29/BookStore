// import React, { useState } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Snackbar,
//   Alert,
//   useTheme,
//   useMediaQuery
// } from '@mui/material';
// import { getFirestore, collection, addDoc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { useFirebase } from '../Context/Firebase';

// const AddBook = () => {
//   const [title, setTitle] = useState('');
//   const [author, setAuthor] = useState('');
//   const [isbn, setIsbn] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [imageURL, setImageURL] = useState('');
//   const [bookType, setBookType] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');
//   const navigate = useNavigate();
//   const { user } = useFirebase();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !author || !isbn || !description || !price || !bookType) {
//       setError('All fields are required');
//       setSnackbarMessage('All fields are required');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     try {
//       const db = getFirestore();
//       const booksCollection = collection(db, 'books');
//       await addDoc(booksCollection, {
//         title,
//         author,
//         isbn,
//         description,
//         price,
//         imageURL,
//         bookType,
//         userId: user?.uid
//       });

//       setSuccess('Book added successfully!');
//       setError('');
//       setSnackbarMessage('Book added successfully!');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);

//       setTitle('');
//       setAuthor('');
//       setIsbn('');
//       setDescription('');
//       setPrice('');
//       setImageURL('');
//       setBookType('');

//       setTimeout(() => navigate('/bookList'), 2000);
//     } catch (err) {
//       setError('Error adding book');
//       setSnackbarMessage('Error adding book');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <Container
//       component="main"
//       maxWidth="xs"
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         bgcolor: theme.palette.background.paper,
//         boxShadow: 3,
//         borderRadius: 2,
//         p: 4,
//         mt: 5,
//         mb: 5
//       }}
//     >
//       <Typography variant="h4" component="h1" gutterBottom>
//         Add Book
//       </Typography>
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{
//           width: '100%',
//           maxWidth: isSmallScreen ? '100%' : '400px',
//           mt: 2,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center'
//         }}
//       >
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
//         <TextField
//           margin="normal"
//           fullWidth
//           label="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <TextField
//           margin="normal"
//           fullWidth
//           label="Author"
//           value={author}
//           onChange={(e) => setAuthor(e.target.value)}
//           required
//         />
//         <TextField
//           margin="normal"
//           fullWidth
//           label="ISBN"
//           value={isbn}
//           onChange={(e) => setIsbn(e.target.value)}
//           required
//         />
//         <TextField
//           margin="normal"
//           fullWidth
//           label="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//           multiline
//           rows={4}
//         />
//         <TextField
//           margin="normal"
//           fullWidth
//           label="Price"
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//         />
//         <TextField
//           margin="normal"
//           fullWidth
//           label="Image URL"
//           value={imageURL}
//           onChange={(e) => setImageURL(e.target.value)}
//         />
//         <FormControl fullWidth margin="normal" required>
//           <InputLabel>Book Type</InputLabel>
//           <Select
//             value={bookType}
//             onChange={(e) => setBookType(e.target.value)}
//             label="Book Type"
//           >
//             <MenuItem value="Programming">Programming</MenuItem>
//             <MenuItem value="Religious">Religious</MenuItem>
//             <MenuItem value="Fiction">Fiction</MenuItem>
//             <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
//             <MenuItem value="Biography">Biography</MenuItem>
//             <MenuItem value="History">History</MenuItem>
//             <MenuItem value="Thrillers">Thrillers</MenuItem>
//           </Select>
//         </FormControl>
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           color="primary"
//           sx={{ mt: 3 }}
//         >
//           Add Book
//         </Button>
//       </Box>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         action={
//           <Button color="inherit" onClick={handleCloseSnackbar}>
//             Close
//           </Button>
//         }
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbarSeverity}
//           sx={{ width: '100%' }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default AddBook;




import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../Context/Firebase';

const AddBook = () => {

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [bookType, setBookType] = useState('');
  const [, setError] = useState('');
  const [, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();
  const { user } = useFirebase();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !isbn || !description || !price || !bookType) {
      setError('All fields are required');
      setSnackbarMessage('All fields are required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const db = getFirestore();
      const booksCollection = collection(db, 'books');
      await addDoc(booksCollection, {
        title,
        author,
        isbn,
        description,
        price,
        imageURL,
        bookType,
        userId: user?.uid
      });

      setSuccess('Book added successfully!');
      setError('');
      setSnackbarMessage('Book added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTitle('');
      setAuthor('');
      setIsbn('');
      setDescription('');
      setPrice('');
      setImageURL('');
      setBookType('');

      setTimeout(() => navigate('/bookList'), 2000);
    } catch (err) {
      setError('Error adding book');
      setSnackbarMessage('Error adding book');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
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
        maxWidth: '600px',
        overflow: 'auto'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
        Add Book
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="normal"
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            margin="normal"
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
            margin="normal"
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            margin="normal"
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={4}
            margin="normal"
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Image URL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            margin="normal"
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Book Type</InputLabel>
            <Select
              value={bookType}
              onChange={(e) => setBookType(e.target.value)}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Add Book
          </Button>
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

export default AddBook;
