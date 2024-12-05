import React, { useEffect, useState } from 'react';
import styles from '../styles/Rooms.module.css';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);

    // filter
    const [min_price, setMinPrice] = useState(20);
    const [max_price, setMaxPrice] = useState(100);
    const [min_size, setMinSize] = useState(20);
    const [max_size, setMaxSize] = useState(60);
    const [min_available, setMinAvailable] = useState(1);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [withAC, setWithAC] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get('room/room-all-details/');
                setRooms(response.data.data || []);
            } catch (error) {
                alert(error);
            }

        };
        fetchRooms();
    }, []);

    function handleClick(room_id) {
        navigate(`/rooms/${room_id}`);
    }

    async function filterRooms(e) {
        e.preventDefault();

        const filters = {
            minPrice: min_price,
            maxPrice: max_price,
            minSize: min_size,
            maxSize: max_size,
            minAvailable: min_available,
            withAC: withAC,
        };

        const response = await api.get('room/filter-rooms/', { params: filters });
        setRooms(response.data.data || []);
    }

    function handleReset(e) {
        e.preventDefault();
        window.location.reload();
    }

    return (
        <div className={styles.roomsContainer}>
            <h2>Available Rooms</h2>
            <button className={styles.toggleFilterButton} onClick={() => setFilterVisible(!isFilterVisible)}>
                {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
            </button>

            {
                isFilterVisible && (
                    <form className={styles.filterForm} onSubmit={filterRooms} onReset={handleReset}>
                        <div className={styles.sliderContainer}>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={min_price}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className={styles.slider}
                            />
                            <p>Min. Price: <span>{min_price}</span>$</p>
                        </div>
                        <div className={styles.sliderContainer}>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={max_price}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className={styles.slider}
                            />
                            <p>Max. Price: <span>{max_price}</span>$</p>
                        </div>
                        <div className={styles.sliderContainer}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={min_size}
                                onChange={(e) => setMinSize(e.target.value)}
                                className={styles.slider}
                            />
                            <p>Min. Room Size: <span>{min_size}</span> sq.ft</p>
                        </div>
                        <div className={styles.sliderContainer}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={max_size}
                                onChange={(e) => setMaxSize(e.target.value)}
                                className={styles.slider}
                            />
                            <p>Max. Room Size: <span>{max_size}</span> sq.ft</p>
                        </div>
                        <div className={styles.sliderContainer}>
                            <input
                                type="number"
                                min="0"
                                value={min_available}
                                onChange={(e) => setMinAvailable(e.target.value)}
                                className={styles.numberInput}
                            />
                            <p>Min. Available Rooms: <span>{min_available}</span></p>
                        </div>
                        <label htmlFor="ac">
                            With AC
                            <input type="checkbox" id="ac" checked={withAC} onChange={() => setWithAC(!withAC)} />
                        </label>
                        <div className={styles.filterButtons}>
                            <input type="submit" value="Filter" onClick={filterRooms} />
                            <input type="reset" value="Clear Filters" />
                        </div>
                    </form>
                )
            }

            <div className={styles.roomCards}>
                {
                    rooms.length != 0 ? rooms.map((room) => (
                        <div key={room.id} className={styles.roomCard}>
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
                    )) : <h1>No Rooms Found For That Filters</h1>
                }
            </div>
        </div >
    );
};

export default Rooms;
