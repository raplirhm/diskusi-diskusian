import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Don't render anything if the modal is not open

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(); // Close the modal if the overlay is clicked
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick} // Attach click event to overlay
        >
            <div className="">
                {children}
            </div>
        </div>
    );
};

export default Modal;
