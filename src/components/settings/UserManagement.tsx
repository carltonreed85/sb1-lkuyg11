import React, { useState } from 'react';
import { ChevronLeft, Plus, Mail, User, Shield, X, Check } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface UserManagementProps {
  onBack: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  active: boolean;
}

export default function UserManagement({ onBack }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@referralmd.com',
      role: 'admin',
      active: true,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@referralmd.com',
      role: 'user',
      active: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'user',
    active: true,
  });

  const handleAddUser = async () => {
    const user: User = {
      id: Math.random().toString(),
      ...newUser,
    };
    setUsers([...users, user]);

    try {
      // In a real application, this would be an API call
      console.log('Sending welcome email to:', user.email, {
        subject: 'Welcome to Referral MD - Set Up Your Account',
        body: `
          Hello ${user.name},
          
          You've been invited to join Referral MD. Please click the link below to set up your account:
          
          [Account Setup Link]
          
          This link will expire in 24 hours.
          
          Best regards,
          The Referral MD Team
        `
      });
      
      alert('User added successfully. A welcome email has been sent.');
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      alert('User added but failed to send welcome email. Please try resending the invitation.');
    }

    setShowAddForm(false);
    setNewUser({ name: '', email: '', role: 'user', active: true });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="btn-primary"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${
                        user.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {user.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}