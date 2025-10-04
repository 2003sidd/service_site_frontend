import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Settings, 
  LogOut,
  Menu,
  X,
  ReceiptText,
  BookLock,
  BookOpenText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: Settings, label: 'Dashboard' },
    { path: '/newRequest', icon: Settings, label: 'New Request' },
    { path: '/request', icon: Settings, label: 'Requests' },
    { path: '/services', icon: Briefcase, label: 'Services' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/employees', icon: UserPlus, label: 'Employees' },
    // { path: '/aboutUs', icon: BookOpenText  , label: 'About Us' },
    // { path: '/termAndCond', icon: ReceiptText, label: 'Terms and Conditions' },
    // { path: '/privacyPolicy', icon: BookLock , label: 'Privacy Policy' },

  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={` 
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        <div className="flex flex-col h-full ">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b ">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium bg-green-500 py-3 uppercase px-5 mr-2 rounded-4xl">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 text-gray-800 font-semibold px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-500 text-white'
                          : ' hover:bg-gray-100'
                      }`
                    }
                    onClick={() => window.innerWidth < 1024 && onToggle()}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;