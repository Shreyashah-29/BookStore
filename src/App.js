import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
// import { AnimatePresence } from 'framer-motion';
// import Books from './pages/Books';
// import About from './pages/About';
// import Contact from './pages/Contact';
import Profile from './Pages/Profile';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import Register from './Pages/Register'
import AddBook from './Pages/AddBook';
import BooksList from './Pages/BookList';
import BookDetail from './Pages/BookDetail';
import Footer from './Pages/Footer';
import AddToCart from './Pages/AddToCart';
import Account from './Pages/Account';
import EditBook from './Pages/EditBook';
import Favorite from './Pages/Favorite';
import CheckOut from './Pages/Checkout';
import Order from './Pages/Order';


function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<h1>Hello</h1>} />
                <Route path="/about" element={<h1>Hello</h1>} />
                <Route path="/contact" element={<h1>Hello</h1>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/addBook" element={<AddBook />} />
                <Route path="/bookList" element={<BooksList />} />
                <Route path="/book/:id" element={<BookDetail />} />
                <Route path="/cart" element={<AddToCart />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/account" element={<Account />} />
                <Route path="/editBook/:id" element={<EditBook />} />
                <Route path="/checkout" element={<CheckOut />} />
                <Route path="/orders" element={<Order />} />

                {/* other routes... */}
            </Routes>

            <Footer />
        </>
    );
}

export default App;
