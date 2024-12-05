import React, { useEffect, useState } from 'react';
import styles from '../styles/BookingHistory.module.css';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            const response = await fetch('/api/bookings'); // Adjust API endpoint as needed
            const data = await response.json();
            setBookings(data);
        };

        fetchBookingHistory();
    }, []);

    return (
        <div className={styles.historyContainer}>
            <h2>Your Booking History</h2>
            {bookings.length > 0 ? (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.id}>
                            Room Type: {booking.room.type}, Check-in: {booking.check_in}, Total: ${booking.total_payment}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
};

export default BookingHistory;
