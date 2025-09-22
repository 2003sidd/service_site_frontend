import React, { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <>
      <div className="absolute top-0 w-full h-full opacity-75 bg-gray-200" >
      </div>

      <div className=" absolute z-100 w-full  h-full inset-0 flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center block sm:p-0">
        {/* <div 
          className="fixed inset-0 transition-opacity "
        /> */}

        <div className={`
          inline-block w-[500px] xl:w-full  ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle 
          transition-all transform bg-white shadow-xl rounded-lg
        `}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-900">
              {title}
            </h3>
            <button
              className="p-1 rounded-md bg-red-500 hover:bg-gray-300"
            >
              <X size={20}
                onClick={onClose}
              />
            </button>
          </div>

          <div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;