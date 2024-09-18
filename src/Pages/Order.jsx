// /* service cloud.firestore {
//   match /databases/{database}/documents {
//     match /orders/{orderId} {
//       allow read: if request.auth != null && request.auth.uid == resource.data.userId;
//       // Other rules...
//     }
//   }
// } */

import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Divider } from '@mui/material';
import { useFirebase } from '../Context/Firebase';
import { collection, query, where, getDocs, orderBy, getFirestore } from 'firebase/firestore';

const Order = () => {
    const { user } = useFirebase();
    const [orders, setOrders] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                try {
                    const ordersQuery = query(
                        collection(db, 'orders'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const querySnapshot = await getDocs(ordersQuery);

                    const fetchedOrders = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setOrders(fetchedOrders);
                } catch (error) {
                    console.error('Error fetching orders: ', error);
                }
            }
        };

        fetchOrders();
    }, [db, user]);

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Order History
            </Typography>
            {orders.length > 0 ? (
                orders.map(order => (
                    <Card key={order.id} sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Order ID: {order.id}</Typography>
                            <Typography variant="body1">Order Date: {new Date(order.createdAt.toDate()).toLocaleDateString()}</Typography>
                            <Typography variant="body1">
                                Estimated Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate.toDate()).toLocaleDateString() : 'Pending'}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            {/* Ensure cartBooks is defined and is an array */}
                            {(order.cartBooks || []).map((book, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body2"><b>Book Name:</b> {book.title}</Typography>
                                    <Typography variant="body2"><b>Quantity:</b> {book.quantity}</Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography variant="body1">No orders found</Typography>
            )}
        </Container>
    );
};

export default Order;
