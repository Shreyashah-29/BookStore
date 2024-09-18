import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/Card'
import { useFirebase } from '../Context/Firebase'
import { useNavigate } from 'react-router-dom'

const BookCard = ({ bookName, authorName, description, price, imageURL, id }) => {
    const firebase = useFirebase();
    const [imageUrl, setImageUrl] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchImageUrl = async () => {
            if (imageURL) {
                try {
                    const url = await firebase.getImageURL(imageURL);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Error fetching image URL:", error);
                }
            } else {
                console.warn("No image path provided.");
            }
        };
        fetchImageUrl();
    }, [imageURL, firebase]);

    return (
        <Card>
        {imageUrl ? (
            <Card.Img variant="top" src={imageUrl} alt={bookName} />
        ) : (
            <Card.Img variant="top" src="placeholder-image-url" alt={bookName} />
        )}
        <Card.Body>
            <Card.Title>{bookName}</Card.Title>
            <Card.Text>{authorName}</Card.Text>
            <Card.Text>{description}</Card.Text>
            <Card.Text>${price}</Card.Text>
            <Button onClick={() => navigate(`/book/view/${id}`)} variant="primary">View</Button>
        </Card.Body>
    </Card>
    );
}
export default BookCard