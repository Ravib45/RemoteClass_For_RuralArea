// client/src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';


function Layout() {
    return (
        <div className="layout-container">
            <Header />
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;