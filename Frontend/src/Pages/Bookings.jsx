import React, { useState, useEffect } from 'react';
import styles from '../styles/Bookings.module.css';
import { useNavigate } from 'react-router-dom'
import api from '../api';

const Bookings = () => {
    const [roomInstances, setRoomInstances] = useState([]);
    const [selectedRoomInstance, setSelectedRoomInstance] = useState('');

    const [roomCount, setRoomCount] = useState(1);

    const [roomNumbers, setRoomNumbers] = useState([]);
    const [selectedRoomNumbers, setSelectedRoomNumbers] = useState([]);

    const [extraBedCounts, setExtraBedCounts] = useState([]);

    const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
    const [checkOut, setCheckOut] = useState('');

    const [daysCount, setDaysCount] = useState(1);

    const [addOns, setAddOns] = useState({});

    const [phoneNumber, setPhoneNumber] = useState('');

    const [maxExtraBed, setMaxExtraBed] = useState(0);
    const [extraBedPrice, setExtraBedPrice] = useState(0);
    const [roomPrice, setRoomPrice] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomInstances = async () => {
            try {
                const response = await api.get('room/get-rooms-name/');
                setRoomInstances(response.data.data || []);
            } catch (error) {
                console.error('Error fetching room names:', error);
            }
        };
        fetchRoomInstances();
    }, []);

    useEffect(() => {
        const fetchRoomNumbers = async () => {
            try {
                const response1 = await api.get(`room/get-available-rooms/${selectedRoomInstance}/`);
                setRoomNumbers(response1.data.data || []);
                const response2 = await api.get(`room/get-charges-details/${selectedRoomInstance}/`);
                setRoomPrice(response2.data.data.room_charge)
                setMaxExtraBed(response2.data.data.extra_bed_count)
                setExtraBedPrice(response2.data.data.extra_bed_charge)
            } catch (error) {
                console.error('Error fetching room numbers:', error);
            }
        };
        if (selectedRoomInstance) {
            fetchRoomNumbers();
        }
    }, [selectedRoomInstance]);

    useEffect(() => {
        if (daysCount && checkIn) {
            const newCheckOut = calculateCheckOutDate(daysCount);
            setCheckOut(newCheckOut);
        }
    }, [daysCount, checkIn]);

    const calculateCheckOutDate = (days) => {
        if (!checkIn) return '';
        const checkInDate = new Date(checkIn);
        checkInDate.setDate(checkInDate.getDate() + parseInt(days, 10));
        return checkInDate.toISOString().split('T')[0];
    };

    const handleRoomNumberChange = (index, value) => {
        const updatedSelectedRooms = [...selectedRoomNumbers];
        updatedSelectedRooms[index] = value;
        setSelectedRoomNumbers(updatedSelectedRooms);
    };

    const handleExtraBedCountChange = (index, value) => {
        console.log(value);
        if (value >= 0 && value <= maxExtraBed) {
            const updatedExtraBedCounts = [...extraBedCounts];
            updatedExtraBedCounts[index] = value;
            setExtraBedCounts(updatedExtraBedCounts);
        }
    };

    const getAvailableRoomOptions = (index) => {
        const alreadySelectedNumbers = selectedRoomNumbers.filter((_, i) => i !== index);
        return roomNumbers.filter((number) => !alreadySelectedNumbers.includes(number));
    };

    const handleRoomCountChange = (e) => {
        const newRoomCount = e.target.value;
        if (newRoomCount <= roomNumbers.length && newRoomCount >= 1)
            setRoomCount(newRoomCount);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookingDetails = {
            room_instance: selectedRoomInstance,
            check_in: checkIn,
            daysCount: daysCount,
            check_out: checkOut,
            phone_number: phoneNumber,
            add_ons: addOns,
            rooms: selectedRoomNumbers.map((roomNumber, index) => (
                {
                    room_number: roomNumber,
                    extra_beds: extraBedCounts[index] || 0,
                }
            )),
        };
        console.log(bookingDetails);

        try {
            const response = await api.post('create-booking/', bookingDetails);
            if (response.data.success) {
                alert(`Booking Successfull And Total Payment Is : ${response.data.payment}`)
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    return (
        <div className={styles.bookingContainer}>
            <h2>Book a Room</h2>
            <form onSubmit={handleSubmit} className={styles.bookingForm}>
                <label htmlFor="roomInstance">Room Instance:</label>
                <select
                    id="roomInstance"
                    value={selectedRoomInstance}
                    onChange={(e) => setSelectedRoomInstance(e.target.value)}
                    className={styles.bookingInput}
                    required
                >
                    <option value="" disabled hidden>Select Room Instance</option>
                    {
                        roomInstances.map((instance) => (
                            <option key={instance.id} value={instance.id}>
                                {instance.type}
                            </option>
                        ))}
                </select>

                <p>Price Of Room : $({roomPrice}) Per Room</p>
                <p>Max. ({maxExtraBed}) Extra Bed/s Per Room</p>
                <p>$({extraBedPrice}) For Each Extra Bed</p>

                <label htmlFor="roomCount">Number of Rooms: ({roomNumbers.length} Available )</label>
                <input
                    type="number"
                    id="roomCount"
                    min="1"
                    max={roomNumbers.length}
                    value={roomCount}
                    onChange={handleRoomCountChange}
                    className={styles.bookingInput}
                    required
                />
                {
                    Array.from({ length: roomCount }).map((_, index) => (
                        <div key={index}>
                            <label htmlFor={`roomNumber-${index}`}>Room Number {index + 1}:</label>
                            <select
                                id={`roomNumber-${index}`}
                                value={selectedRoomNumbers[index] || ''}
                                onChange={(e) => handleRoomNumberChange(index, e.target.value)}
                                className={styles.bookingInput}
                                required
                            >
                                <option value="" disabled hidden>Select Room Number</option>
                                {
                                    getAvailableRoomOptions(index).map((number, idx) => (
                                        <option key={idx} value={number}>
                                            {number}
                                        </option>
                                    ))
                                }
                            </select>

                            <label htmlFor={`extraBed-${index}`}>Extra Beds:</label>
                            <input
                                type="number"
                                id={`extraBed-${index}`}
                                min="0"
                                value={extraBedCounts[index] || 0}
                                onChange={(e) => handleExtraBedCountChange(index, e.target.value)}
                                className={styles.bookingInput}
                            />
                        </div>
                    ))
                }

                {roomCount % 2 == 1 && <div></div>}
                <label htmlFor="checkIn">Check-In Date:</label>
                <input
                    type="date"
                    id="checkIn"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={styles.bookingInput}
                    required
                    min={new Date().toISOString().split('T')[0]}
                />

                <label htmlFor="daysCount">Number of Days:</label>
                <input
                    type="number"
                    id="daysCount"
                    min="1"
                    value={daysCount}
                    onChange={(e) => setDaysCount(e.target.value)}
                    className={styles.bookingInput}
                    required
                />

                <label htmlFor="checkOut">Check-Out Date:</label>
                <input
                    type="date"
                    id="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={styles.bookingInput}
                    required
                    disabled
                />

                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={styles.bookingInput}
                    required
                />

                <h3>Add-Ons:</h3>
                <div className={styles.addOnContainer}>
                    <label>
                        <input
                            type="checkbox"
                            name="breakfast"
                            checked={addOns.breakfast || false}
                            onChange={(e) =>
                                setAddOns({ ...addOns, [e.target.name]: e.target.checked })
                            }
                        />
                        Breakfast
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="airportTransfer"
                            checked={addOns.airportTransfer || false}
                            onChange={(e) =>
                                setAddOns({ ...addOns, [e.target.name]: e.target.checked })
                            }
                        />
                        Airport Transfer
                    </label>
                </div>

                <button type="submit" className={styles.bookingButton}>
                    Confirm Booking
                </button>
            </form>
        </div>
    );
};

export default Bookings;
