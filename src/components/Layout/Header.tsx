import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-[var(--primary-color)] shadow-sm text-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-[var(--hover-color)]"
          >
            <Menu size={20} />
          </button>
          
          <div className="hidden md:flex text-xl justify-center items-center space-x-2 rounded-lg px-3 py-2">
            {/* <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-64"
            /> */}
            <h2 className="font-bold text-center flex-grow">Service On Site</h2>
          </div>
        </div>

        {/* <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-md hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;