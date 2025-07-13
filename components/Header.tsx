
import React from 'react';
import { MoonIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
        <MoonIcon className="h-8 w-8 text-indigo-600" />
        <h1 className="ml-3 text-2xl font-bold text-slate-800 tracking-tight">
          PSQI Score Calculator
        </h1>
      </div>
    </header>
  );
};

export default Header;
