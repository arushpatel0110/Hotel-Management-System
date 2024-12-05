// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import logo from '../assets/logo.jpg';

const Header = ({ login, logout }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>
                <div className={styles.logo_container}>
                    <Link to="/">
                        <img src={logo} className={styles.logo} alt="Logo" style={{ maxWidth: '120px' }} />
                    </Link>
                    <button className={styles.hamburger} onClick={toggleMenu}>
                        <span>➕</span>
                    </button>
                </div>
                <ul className={`${styles.navList} ${isMobileMenuOpen ? styles.showMenu : ''}`}>
                    <li><Link to="/rooms" className={styles.navLink}>Rooms</Link></li>
                    <li><Link to="/bookings" className={styles.navLink}>Bookings</Link></li>
                    <li><Link to="/reviews" className={styles.navLink}>Reviews</Link></li>
                    {
                        !login ?
                            <>
                                <li><Link to="/login" className={styles.navLink}>Login</Link></li>
                                <li><Link to="/signup" className={styles.navLink}>Signup</Link></li>
                            </> :
                            <li onClick={logout} className={styles.navLink} id='logout'>Logout</li>
                    }
                </ul>
            </nav>
        </header>
    );
};

export default Header;