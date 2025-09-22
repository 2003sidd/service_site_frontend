import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import type { User } from '../types';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import { deleteUser, getUsers, upsertUser } from '../services/user.service';
import DataNotFound from './NoDataFound';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  // const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    email: '',
    number: '',
    password: '',
    isActive: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers({ index: 1, top: 10 });
      console.log("data from api is", data)
      if (data.data.total > 0) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("user is")
      const data = await upsertUser(formData);
      console.log("created user is", data)
      if (data) {
        fetchUsers()
        closeModal();
      } else {

      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // await userAPI.deleteUser(id);
        const data = await deleteUser(id);
        if (data.data) {
          fetchUsers()
        } else {
          // show error
        }
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: '',
        number: user.number,
        isActive: true
      });
    } else {
      setEditingUser(null);
      setFormData({
        _id: '',
        name: '',
        email: '',
        password: '',
        number: ' ',
        isActive: true

      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("working")
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // const filteredUsers = users.filter(user =>
  //   user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   user.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <div className="flex flex-col px-6 py-4 sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </section>
        <Button className="bg-green-500" onClick={() => openModal()}>
          <Plus size={16} className="mr-2 " />
          Add User
        </Button>
      </div>

      <hr className="text-gray-300" />


      {/* Search
      <div className="relative max-w-md mx-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div> */}

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">

              {Array.isArray(users) && users.map((user, index) => (

                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center whitespace-nowrap">

                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="text-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
                      {user.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex  px-2.5 py-0.5 rounded-full text-xs font-medium ">
                      {user.number}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openModal(user)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id!!)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

              ))
              }
            </tbody>

          </table>
        </div>
      </div>

      {/* User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Number"
            type="text"
            required
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          />


          <Input
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div> */}

          <div className="flex justify-center space-x-3 pt-4">
            <Button type="submit" className='bg-green-500 hover:bg-green-600'>
              {editingUser ? 'Update' : 'Create'} User
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>

          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;