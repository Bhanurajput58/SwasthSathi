import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import EditUserModal from '../../components/EditUserModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      const response = await fetch(`http://localhost:5000/api/admin/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user._id !== userToDelete._id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  const handleSave = async (editedUser) => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedUser)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      await fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  if (loading) return <div className="admin-container">Loading...</div>;
  if (error) return <div className="admin-container">Error: {error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="back-to-dashboard" onClick={() => navigate('/admin')}>
          <FaArrowLeft />
          Back
        </button>
        <h1>Manage Users</h1>
      </div>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user._id} className="user-card-users">
            <div className="user-info-users">
              <h3>{user.name}</h3>
              <div className="user-detail"><strong>Email:</strong> {user.email}</div>
              <div className="user-detail"><strong>Role:</strong> {user.role}</div>
              <div className="user-detail"><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="user-actions">
              <a
                className="view-details-button"
                href={`mailto:${user.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                SEND EMAIL
              </a>
              <button className="assign-doctor-button" onClick={() => handleDeleteClick(user)}>
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        userName={userToDelete?.name}
      />
    </div>
  );
};

export default ManageUsers; 