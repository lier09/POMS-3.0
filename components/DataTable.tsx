
import React from 'react';
import type { RawPsqiData } from '../types';

interface DataTableProps {
  data: RawPsqiData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-slate-500">No data to display.</p>;
    }

    const headers = Object.keys(data[0]);

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Extracted Raw Data</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    {header.replace('q', 'Q ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                                {headers.map((header) => (
                                    <td key={`${rowIndex}-${header}`} className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                                        {row[header as keyof RawPsqiData]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-slate-500 mt-2">Please review the extracted data. If it looks correct, proceed to calculate the scores.</p>
        </div>
    );
};

export default DataTable;
