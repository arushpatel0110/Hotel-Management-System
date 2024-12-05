import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Review.module.css';
import api from '../api';

const Review = () => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [roomsNames, setRoomsNames] = useState([]);
    const [comment, setComment] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(1);

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        const fetchRoomInstances = async () => {
            try {
                const response = await api.get('room/get-rooms-name/');
                setRoomsNames(response.data.data || []);
            } catch (error) {
                console.error('Error fetching room names:', error);
            }
        };
        fetchRoomInstances();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_API_URL}reviews/`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleAddReview = async () => {
        try {
            const data = { rating, comment, room_id: selectedRoom };
            await api.post(`${import.meta.env.VITE_API_URL}reviews/add/`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchReviews();
            setRating(5);
            setComment('');
            alert('Review added successfully');
        } catch (error) {
            console.error('Error adding review:', error);
            alert('Error adding review');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Reviews</h2>
            <ul className={styles.reviewList}>
                {
                    reviews.map((review, index) => (
                        <li key={index} className={styles.reviewItem}>
                            <strong>Rating:</strong> {review.rating}/5 <br />
                            <strong>Room Type : </strong> {review.room_type} <br />
                            <strong>Comment:</strong> {review.comment || 'No comment'} <br />
                            <strong>Date : </strong> {review.date} <br />
                            <hr />
                        </li>
                    ))}
            </ul>

            <h3>Add a Review</h3>
            <div className={styles.formGroup}>
                <label htmlFor="roomInstance">Room Instance:</label>
                <select
                    id="roomInstance"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className={styles.bookingInput}
                    required
                >
                    <option value="" disabled hidden>Select Room Instance</option>
                    {
                        roomsNames.map((instance) => (
                            <option key={instance.id} value={instance.id}>
                                {instance.type}
                            </option>
                        ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Rating: </label>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Comment: </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
            <button onClick={handleAddReview}>Submit Review</button>
        </div>
    );
};

export default Review;
