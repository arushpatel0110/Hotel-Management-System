import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import img1 from '../assets/Carousel1.jpg'
import img2 from '../assets/Carousel2.jpg'
import img3 from '../assets/Carousel3.jpg'
import img4 from '../assets/Carousel4.jpg'
import img5 from '../assets/Carousel5.jpg'
import img6 from '../assets/Carousel6.jpg'
import img7 from '../assets/Carousel7.jpg'

const Home = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };

    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get('room/room-all-details/');
                setRooms(response.data.data || []);
            } catch (error) { }

        };
        fetchRooms();
    }, []);

    function handleClick(room_id) {
        navigate(`/rooms/${room_id}`);
    }

    return (
        <div className={styles.home}>

            <Slider {...settings} className={styles.carousel}>
                <img src={img1} alt="Hotel 1" className={styles.carouselImage} />
                <img src={img2} alt="Hotel 2" className={styles.carouselImage} />
                <img src={img3} alt="Hotel 3" className={styles.carouselImage} />
                <img src={img4} alt="Hotel 4" className={styles.carouselImage} />
                <img src={img5} alt="Hotel 5" className={styles.carouselImage} />
                <img src={img6} alt="Hotel 6" className={styles.carouselImage} />
                <img src={img7} alt="Hotel 7" className={styles.carouselImage} />
            </Slider>

            <div className={styles.videoContainer}>
                <iframe
                    className={styles.video}
                    src="https://www.youtube.com/embed/H3YRXv04RUI?si=FWJidf_j5LT3WqNo&amp;"
                    title="Hotel Tour"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                    aria-controls='0'
                    allowFullScreen={false}
                ></iframe>
            </div>

            <div className={styles.roomsSection}>
                <h2>Popular Room Types</h2>
                <div className={styles.roomCards}>
                    {
                        rooms.length != 0 ? rooms.map((room, index) => (
                            index <= 2 && <div key={room.id} className={styles.roomCard}>
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${room.image}`}
                                    alt={room.type}
                                    className={styles.roomImage}
                                />
                                <h3>{room.type}</h3>
                                <p>${room.price} per night</p>
                                <p>{room.description}</p>
                                <p>Room Size : {room.size} sq. ft.</p>
                                <p>Available Rooms : {room.available_rooms}</p>
                                <p>Include AC : {room.withAC ? 'Yes' : 'No'} </p>
                                <button className={styles.roomButton} onClick={() => handleClick(room.id)}>View Details</button>
                            </div>
                        )) : <h1>Login To See The Popular Rooms...</h1>
                    }
                </div>
            </div>
        </div>
    );
};

export default Home;