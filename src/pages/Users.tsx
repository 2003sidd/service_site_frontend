import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import type { User } from '../types';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import { toggleUserAccount, getUsers, upsertUser } from '../services/user.service';
import DataNotFound from './NoDataFound';
import Toast from '../utility/toast';
import * as Yup from 'Yup'
import Loader from '../components/UI/Loader';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemPerPage, SetItemPerPage] = useState(10);
  // const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);


  const [formData, setFormData] = useState<User>({
    _id: '',
    name: '',
    email: '',
    number: '',
    password: '',
    isActive: false
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    number?: string;
  }>({});

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, itemPerPage]);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getUsers({ index: page, top: itemPerPage });

      if (data.data.total > 0) {
        setUsers(data.data.users);
        setTotalPages(Math.ceil(data.data.total / itemPerPage));
      } else {
        setUsers([]);
        setTotalPages(1);
      }

      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  //form validation
  const validationSchema = Yup.object({
    name: Yup.string().transform(value => value.trim()).required("user name is required"),
    email: Yup.string().transform(value => value.trim())
      .required("user email is required")
      .email("invalid email format"),
    number: Yup.string().transform(value => value.trim())
      .matches(/^\d{10}$/, "number must be 10 digits")
      .required("user number is required"),
    password: Yup.string().transform(value => value.trim())
      .required("user password is required")
      .min(8, "password must be at least 8 charaters")
      .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
        "Password must contain at least one number,lowercase,uppercase or symbol")
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false })
      const data = await upsertUser(formData);
      if (data.data) {
        fetchUsers()
        closeModal();
        if (editingUser) {
          Toast.success("User Updated Successfully!");
        } else {
          Toast.success("User Added Successfully!");
        }
      } else {
        Toast.error(data.message)
      }
    } catch (err) {


      if (err instanceof Yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        if (editingUser) {
          Toast.error("Failed to Update User!");
        } else {
          Toast.error("Failed to Add User!");
        }
      }
    }
  };

  const handleDelete = async (id: string, active: Boolean) => {
    if (window.confirm(active ? 'Are you sure you want to delete this user?' : "Are you sure you want to activate this user")) {
      try {
        // await userAPI.deleteUser(id);
        const data = await toggleUserAccount(id);
        if (data.data) {
          fetchUsers()
          if (active) {
            Toast.success("User Deleted Successfully!");
          } else {
            Toast.success("User Activate Successfully!");
          }
        } else {
          // show error
          Toast.error("Something went wrong");
        }
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        Toast.error("Failed to Delete User!")

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
    setErrors({});
  };

  // const filteredUsers = users.filter(user =>
  //   user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   user.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );



  return (
    <div className="space-y-6 ">
      <div className="flex flex-col px-6 py-4 sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </section>
        <Button className="bg-[var(--primary-color)]" onClick={() => openModal()}>
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

      {loading ? <Loader /> :
        <>
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
                        {new Date(user?.createdAt!!).toLocaleDateString()}
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
                            onClick={() => handleDelete(user._id!!, user.isActive)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            {user.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
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

          {Array.isArray(users) && users.length == 0 && <div>
            <DataNotFound />
          </div>}

        </>

      }

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
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}

          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Number"
            type="text"
            placeholder="Enter your number"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            error={errors.number}
          />

          <div className='relative'>
            <Input
              name="Password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />
            <button
              type="button"
              className="absolute right-3 top-9 h-4 w-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>



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


      {users.length > 0 && (
        <div className="flex justify-end mr-8 items-center mt-4 space-x-2">
          <div >
            <span className='mx-2'>
              No. of page

            </span>
            <select className='p-[6px] rounded-lg bg-gray-200' name="page" id="page" onChange={(event) => { SetItemPerPage((event?.target.value) as unknown as number) }}>
              <option selected value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <Button
            variant="secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-900">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}



    </div>
  );
};

export default Users;

