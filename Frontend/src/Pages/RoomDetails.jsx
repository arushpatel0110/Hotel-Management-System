import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/RoomDetails.module.css';
import api from '../api';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            const response = await api.get(`room/room-details/${id}/`);
            console.log(response.data.data);

            if (response.status === 200)
                setRoom(response.data.data);
        };

        fetchRoomDetails();
    }, [id]);

    if (!room) return <div className={styles.loading}>Loading...</div>;

    function handleClick() {
        navigate('/bookings');
    }

    return (
        <div className={styles.detailsContainer}>
            <h2 className={styles.roomTitle}>{room.type} Room</h2>
            <div className={styles.imageContainer}>
                <img src={`${import.meta.env.VITE_API_URL}${room.image1}`} alt={room.type} className={styles.roomImage} />
                <img src={`${import.meta.env.VITE_API_URL}${room.image2}`} alt={room.type} className={styles.roomImage} />
                <img src={`${import.meta.env.VITE_API_URL}${room.image3}`} alt={room.type} className={styles.roomImage} />
                <img src={`${import.meta.env.VITE_API_URL}${room.image4}`} alt={room.type} className={styles.roomImage} />
            </div>
            <p className={styles.description}>Description : {room.description}</p>
            <div className={styles.detailsSection}>
                <p>Price: <span className={styles.price}>${room.price}</span> per night</p>
                <p>Extra Beds: <span>{room.extra_bed_capacity}</span></p>
                <p>Cost of 1 Extra Bed: <span className={styles.price}>${room.extra_cost}</span></p>
                <p>Room Size: <span>{room.size} sq.ft</span></p>
                <p>Available Rooms: <span>{room.available_rooms}</span></p>
                <p>Includes AC: <span>{room.include_ac ? 'Yes' : 'No'}</span></p>
            </div>
            <button className={styles.bookNowButton} onClick={handleClick}>Book Now</button>
        </div>
    );
};

export default RoomDetails;
