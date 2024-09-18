import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import { FirebaseProvider } from './Context/Firebase';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import store from './Store/store';
import { Provider } from 'react-redux';


const stripePromise = loadStripe('pk_test_51Py6PWH7Ff9ErCYZtlYWYlgNGv55ECqAMYzysLEHFYsoguSY6JQ03RW2gieEWEROdnQOVK3H4PAqCV1IDEiBiMCL00tIua5DLc');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <Elements stripe={stripePromise}>
          <Provider store={store}>
            <App />
          </Provider>,
        </Elements>
      </FirebaseProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
