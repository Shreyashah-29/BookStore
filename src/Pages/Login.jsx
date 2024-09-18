import React, { useState } from 'react';
import { useFirebase } from '../Context/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Alert, Box, IconButton } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
    const { auth } = useFirebase();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ message: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setAlert({ message: 'Login successful!', type: 'success' });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setAlert({ message: error.message, type: 'error' });
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: 3,
            p: 4,
            mt: 8,
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(131,58,180,1)  0%, rgba(253,29,84,1) 50% , rgba(117,64,67,1) 100%)'  // Updated gradient
        }}>
            {/* Decorative Elements Using CSS Gradients */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                
                    background: 'radial-gradient(circle, rgba(131,58,180,1) 0%, rgba(253,29,84,1) 50%, rgba(117,64,67,1) 100%)',
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
                   
                    background: 'radial-gradient(circle, rgba(131,58,180,1) 0%, rgba(253,29,84,1) 50%, rgba(117,64,67,1) 100%)',
                    borderRadius: '50%',
                    zIndex: -1
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                 
                    background: 'radial-gradient(circle, rgba(131,58,180,1) 0%, rgba(253,29,84,1) 50%, rgba(117,64,67,1) 100%)',
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
                    border: '1px solid #754043',
                    position: 'relative',
                    zIndex: 1,
                    width: '100%', 
                    maxWidth: '400px' 
                }}
            >
                <IconButton sx={{ mb: 2, color: '#754043' }}>
                    <LoginIcon sx={{ fontSize: 50 }} />
                </IconButton>
                <Typography component="h1" variant="h4" sx={{ color: '#754043', mb: 3, fontFamily: 'Georgia, serif' }}>
                    Login
                </Typography>
                {alert.message && (
                    <Alert severity={alert.type} sx={{ mb: 2, bgcolor: alert.type === 'error' ? '#ffebee' : '#e8f5e9', color: alert.type === 'error' ? '#d32f2f' : '#388e3c' }}>
                        {alert.message}
                    </Alert>
                )}
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <IconButton sx={{ color: '#754043' }}>
                                    <Email />
                                </IconButton>
                            )
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <IconButton sx={{ color: '#754043' }}>
                                    <Lock />
                                </IconButton>
                            )
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
                            bgcolor: '#754043',
                            ':hover': { bgcolor: '#754043' },
                            color: '#fff'
                        }}
                    >
                        Login
                    </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Don't have an account? <Link to="/register" style={{ color: '#754043', textDecoration: 'none' }}>Sign Up!</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
