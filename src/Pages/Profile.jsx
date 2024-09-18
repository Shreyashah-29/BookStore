import React, { useEffect, useState } from 'react';
import { useFirebase } from '../Context/Firebase';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Snackbar, Alert } from '@mui/material';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useFirebase();
    const [userData, setUserData] = useState({ name: '', email: '', mobile: '' });
    const [originalUserData, setOriginalUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const db = getFirestore();
                    const userDoc = doc(db, 'users', user.uid);
                    const docSnapshot = await getDoc(userDoc);
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        setUserData(data);
                        setOriginalUserData(data);
                    } else {
                        setError('No user data found');
                    }
                } catch (err) {
                    setError('Error fetching user data');
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const db = getFirestore();
            const userDoc = doc(db, 'users', user.uid);
            await updateDoc(userDoc, userData);
            setOriginalUserData(userData);
            setIsEditing(false);
            setSnackbarMessage('Profile updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setError('');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError('Error updating profile');
            setSnackbarMessage('Error updating profile');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCancel = () => {
        setUserData(originalUserData);
        setIsEditing(false);
        setError('');
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container component="main" maxWidth="xs">
            <Card sx={{ maxWidth: 500, marginTop: '40px', padding: 2 }}>
                <CardContent>
                    <Typography component="h1" variant="h4" gutterBottom>
                        Profile
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Name"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            InputProps={{ readOnly: !isEditing }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            InputProps={{ readOnly: !isEditing }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Phone Number"
                            name="mobile"
                            value={userData.mobile}
                            onChange={handleInputChange}
                            InputProps={{ readOnly: !isEditing }}
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleUpdate}
                                    sx={{ mr: 2 }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default Profile;
