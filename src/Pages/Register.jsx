import React, { useState } from 'react';
import { useFirebase } from '../Context/Firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Alert, Box, IconButton } from '@mui/material';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { AccountCircle, Email, Lock, Phone } from '@mui/icons-material';
import BookIcon from '@mui/icons-material/Book';

const Register = () => {
    const { auth } = useFirebase();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password === '' || confirmPassword === '' || name === '' || email === '' || mobile === '') {
            setError("All fields are required. Please fill out the form properly.");
            return;
        }

        if (mobile === '') {
            setError("Please enter a valid mobile number.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
          
            await updateProfile(user, { displayName: name });
            
            const db = getFirestore();
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                mobile
            });
            
            setSuccess("Registration successful!");
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setError(error.message);
            setSuccess('');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: 3,
            p: 4,
            mt: 8,
            minHeight: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'linear-gradient(135deg, #ffebee 0%, #fbe9e7 100%)'
        }}>
            {/* Decorative Elements Using CSS Gradients */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)',
                    zIndex: -1,
                    borderRadius: 3,
                    pointerEvents: 'none'
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.2) 0%, rgba(255, 228, 225, 0.3) 100%)',
                    borderRadius: '50%',
                    zIndex: -1
                }}
            />
             <Box
                sx={{
                    position: 'absolute',
                    top: -0,
                    right: -50,
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.2) 0%, rgba(255, 228, 225, 0.3) 100%)',
                    borderRadius: '50%',
                    zIndex: -1
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.2) 0%, rgba(255, 228, 225, 0.3) 100%)',
                    borderRadius: '50%',
                    zIndex: -1
                }}
            />
             <Box
                sx={{
                    position: 'absolute',
                    bottom: -0,
                    left: -50,
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.2) 0%, rgba(255, 228, 225, 0.3) 100%)',
                    borderRadius: '50%',
                    zIndex: -1
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    bgcolor: '#ffffff',
                    borderRadius: 3,
                    boxShadow: 3,
                    border: '1px solid #d32f2f',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <IconButton sx={{ mb: 2, color: '#d32f2f' }}>
                    <BookIcon sx={{ fontSize: 50 }} />
                </IconButton>
                <Typography component="h1" variant="h4" sx={{ color: '#d32f2f', mb: 3, fontFamily: 'Georgia, serif' }}>
                    Register
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2, bgcolor: '#ffebee', color: '#d32f2f' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2, bgcolor: '#e8f5e9', color: '#388e3c' }}>{success}</Alert>}
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ width: '100%' }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <IconButton sx={{ color: '#d32f2f' }}>
                                    <AccountCircle />
                                </IconButton>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <IconButton sx={{ color: '#d32f2f' }}>
                                    <Email />
                                </IconButton>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <IconButton sx={{ color: '#d32f2f' }}>
                                    <Lock />
                                </IconButton>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <IconButton sx={{ color: '#d32f2f' }}>
                                    <Lock />
                                </IconButton>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <IconButton sx={{ color: '#d32f2f' }}>
                                    <Phone />
                                </IconButton>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            bgcolor: '#d32f2f',
                            ':hover': { bgcolor: '#b71c1c' },
                            color: '#fff'
                        }}
                    >
                        Register
                    </Button>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Have an account? <Link to="/login" style={{ color: '#d32f2f', textDecoration: 'none' }}>Log In</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
