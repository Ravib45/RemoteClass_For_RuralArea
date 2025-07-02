// client/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header-container">
            <div className="header-left">
                <Link to="/" className="header-logo-link">
                    <img src="/excel-logo.svg" alt="Excel Logo" className="header-logo" />
                    <span className="header-title">Excel Analytics Platform</span>
                </Link>
            </div>
            <div className="header-right">
                <span style={{ fontSize: '1.2em' }}>🔍</span>
                <span style={{ fontSize: '1.2em' }}>🔔</span>
                <img src="/user-avatar.png" alt="User Avatar" className="user-avatar" />
            </div>
        </header>
    );
}

export default Header;