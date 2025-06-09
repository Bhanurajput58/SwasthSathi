import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete user "{userName}"?</p>
        <p className="warning-text">This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="action-button gray" onClick={onClose}>
            Cancel
          </button>
          <button className="action-button red" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 