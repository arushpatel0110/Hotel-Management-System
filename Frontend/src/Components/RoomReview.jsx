// RoomReview.jsx
import React, { useState } from 'react';
import styles from '../styles/RoomReview.module.css';

const RoomReview = () => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle review submission
    };

    return (
        <div className={styles.reviewContainer}>
            <h2>Leave a Review</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Your review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className={styles.reviewInput}
                />
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className={styles.reviewInput}
                />
                <button type="submit" className={styles.reviewButton}>Submit Review</button>
            </form>
        </div>
    );
};

export default RoomReview;
