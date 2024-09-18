import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Box,
    Avatar,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    useMediaQuery,
    useTheme,
    Menu,
    MenuItem
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, Favorite as FavoriteIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../Context/Firebase';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const Navbar = () => {
    const { auth, user } = useFirebase();
    const [cartItemCount, setCartItemCount] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); 
    const navigate = useNavigate();
    const db = getFirestore();
    const theme = useTheme();

    const isMediumOrLess = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (user) {
            const cartRef = doc(db, 'carts', user.uid);

            const unsubscribe = onSnapshot(cartRef, (doc) => {
                const data = doc.data();
                if (data && data.books) {
                    const itemCount = data.books.reduce((sum, book) => sum + book.quantity, 0);
                    setCartItemCount(itemCount);
                } else {
                    setCartItemCount(0);
                }
            });

            return () => unsubscribe();
        } else {
            setCartItemCount(0);
        }
    }, [user, db]);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/profile');
        handleMenuClose();
    };

    const handleAccount = () => {
        navigate('/account');
        handleMenuClose();
    };

    const handleOrdes = () => {
        navigate('/orders');
        handleMenuClose();
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        if (isMediumOrLess) setDrawerOpen(false);
    };

    const getAvatarText = () => {
        if (user && user.displayName) {
            const initials = user.displayName.split(' ').map(name => name[0]).join('');
            return initials;
        }
        return 'U';
    };

    const handleCartClick = () => {
        if (user) {
            navigate('/cart');
        } else {
            navigate('/login');
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(prev => !prev);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFavorite = () => {
        navigate("/Favorite")
    }

    const drawerItems = (
        <Box sx={{ width: 250 }}>
            <List>
                <ListItem button onClick={() => handleNavigate('/')}>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => handleNavigate('/bookList')}>
                    <ListItemText primary="Books" />
                </ListItem>
                <ListItem button onClick={() => handleNavigate('/about')}>
                    <ListItemText primary="About" />
                </ListItem>
                <ListItem button onClick={() => handleNavigate('/contact')}>
                    <ListItemText primary="Contact" />
                </ListItem>
                {user && (
                    <ListItem button onClick={() => handleNavigate('/addBook')}>
                        <ListItemText primary="Add Book" />
                    </ListItem>
                )}
                {user && (
                    <>
                        <Divider />
                        <ListItem button onClick={handleProfile}>
                            <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem button onClick={handleAccount}>
                            <ListItemText primary="Account" />
                        </ListItem>
                        <ListItem button onClick={handleSignOut}>
                            <ListItemText primary="Sign Out" />
                        </ListItem>
                    </>
                )}
                {!user && (
                    <ListItem button onClick={handleLogin}>
                        <ListItemText primary="Sign Up" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#222', padding: '0 16px' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Logo and Menu Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isMediumOrLess && (
                            <IconButton color="inherit" onClick={toggleDrawer} sx={{ display: { xs: 'block', md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h6" component="div" sx={{ color: 'white', ml: 2 }}>
                           <Link to={"/"}>BookStore</Link> 
                        </Typography>
                    </Box>

                    {/* Menu Items for larger screens */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
                        <Button color="inherit" sx={{ mx: 1 }} onClick={() => handleNavigate('/')}>Home</Button>
                        <Button color="inherit" sx={{ mx: 1 }} onClick={() => handleNavigate('/bookList')}>Books</Button>
                        <Button color="inherit" sx={{ mx: 1 }} onClick={() => handleNavigate('/about')}>About</Button>
                        <Button color="inherit" sx={{ mx: 1 }} onClick={() => handleNavigate('/contact')}>Contact</Button>
                        {user && (
                            <Button color="inherit" sx={{ mx: 1 }} onClick={() => handleNavigate('/addBook')}>Add Book</Button>
                        )}
                    </Box>

                    {/* Right Side Buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" sx={{ mx: -2 }} onClick={handleFavorite}>
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton color="inherit" sx={{ mx: 1 }} onClick={handleCartClick}>
                            <Badge badgeContent={cartItemCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                        {user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    alt={user.displayName || 'User'}
                                    src={user.photoURL || ''}
                                    sx={{
                                        bgcolor: user.photoURL ? 'transparent' : 'secondary.main',
                                        color: user.photoURL ? 'transparent' : 'white',
                                        width: 30,
                                        height: 30,
                                        fontSize: 16,
                                    }}
                                    onClick={handleMenuClick}
                                >
                                    {user.photoURL ? null : getAvatarText()}
                                </Avatar>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    sx={{ mt: '12px', }}
                                >
                                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                    <MenuItem onClick={handleAccount}>Account</MenuItem>
                                    <MenuItem onClick={handleOrdes}>Orders</MenuItem>
                                    <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                                </Menu>
                        </Box>
                        ) : (
                            <Button color="inherit" onClick={handleLogin}>Sign Up</Button>
                        )}
                        
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for smaller and medium screens */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                {drawerItems}
            </Drawer>
        </>
    );
};

export default Navbar;
