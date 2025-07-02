import React from 'react';

const mockData = [
    { id: 1, name: 'Product A', quantity: 50, price: 200 },
    { id: 2, name: 'Product B', quantity: 30, price: 100 },
    { id: 3, name: 'Product C', quantity: 20, price: 150 },
];

const DataTable = () => {
    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.map((item) => (
                        <tr key={item.id} className="border-b border-gray-300 dark:border-gray-700">
                            <td className="p-2">{item.id}</td>
                            <td className="p-2">{item.name}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">₹{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
