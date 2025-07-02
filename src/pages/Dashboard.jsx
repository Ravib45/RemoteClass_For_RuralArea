import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ChartContainer from '../components/ChartContainer';
import DataTable from '../components/DataTable';
import UploadButton from '../components/UploadButton';

const Dashboard = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                {/* <Navbar /> */}

                {/* Dashboard Content */}
                <main className="p-4 overflow-y-auto flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
                        <UploadButton />
                    </div>

                    <ChartContainer />

                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Data Table</h3>
                        <DataTable />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
