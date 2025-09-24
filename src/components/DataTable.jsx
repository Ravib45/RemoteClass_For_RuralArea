// // client/src/components/DataTable.jsx
// import React from 'react';

// const DataTable = ({ data }) => {
//     if (!data || data.length === 0) {
//         return <p className="text-gray-500 text-center">No data uploaded yet</p>;
//     }

//     return (
//         <div className="overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
//             <table className="w-full table-auto border-collapse">
//                 <thead>
//                     <tr className="bg-gray-200 dark:bg-gray-700 text-left">
//                         <th className="p-2 text-black dark:text-white">Name</th>
//                         <th className="p-2 text-black dark:text-white">Value</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.map((row, i) => (
//                         <tr key={i} className="border-b border-gray-300 dark:border-gray-700">
//                             <td className="p-2 text-black dark:text-white">{row.name}</td>
//                             <td className="p-2 text-black dark:text-white">{row.value}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DataTable;
