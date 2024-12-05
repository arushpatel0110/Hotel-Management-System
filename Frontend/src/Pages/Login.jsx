import React, { useState } from 'react';
import styles from '../styles/Auth.module.css';
import axios from 'axios';
import { SET_ACCESS_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (!email || !password) {
                setError('Please fill in all fields');
                return;
            }
            const response = await axios.post('http://127.0.0.1:8000/auth/login/', { email, password });
            if (response.status == 200) {
                SET_ACCESS_TOKEN(response.data.token);
                setLogin(true);
                navigate('/');
            }
        } catch (error) {
            setError(error.response.data.message)
        }
    };

    return (
        <div className={styles.authContainer}>
            <h2>Login</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.authInput}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.authInput}
                />
                <button type="submit" className={styles.authButton}>Login</button>
            </form>
        </div>
    );
};

export default Login;
