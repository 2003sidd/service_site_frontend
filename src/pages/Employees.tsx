import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import type { Employee } from '../types';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import { deleteEmployee, getEmployee, upsertEmployee } from '../services/employee.service';
import DataNotFound from './NoDataFound';
import Toast from '../utility/toast';
import * as Yup from 'Yup'
import Loader from '../components/UI/Loader';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemPerPage, SetItemPerPage] = useState(10);
  const [filterByRole, setFilterByRole] = useState<string>("All");
  const { logout } = useAuth();

  const [formData, setFormData] = useState<{
    _id: string | null;
    name: string;
    email: string;
    number: string;
    address: string;
    isActive: boolean;
    password: string;
    role: string;
  }>({
    _id: null,
    name: '',
    email: '',
    number: '',
    address: '',
    isActive: true,
    password: '',
    role: ''
  });


  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage, itemPerPage, filterByRole]);


  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    number?: string;
    address?: string;
  }>({});

  const fetchEmployees = async (page = 1) => {
    try {

      setLoading(true)

      const data = await getEmployee({ index: page, top: itemPerPage, filterByRole },)
      if (data.data.total > 0) {
        setEmployees(data.data.users)
      } else {
        setEmployees([])
        setTotalPages(1)
        Toast.error(data.message)
      }
      setCurrentPage(page);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Now that TypeScript knows this is an AxiosError, we can access error.response
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          // Handle API response errors (e.g., 400, 404, 500, etc.)
          if (axiosError.response.status === 401) {

            logout();
          }
        }
      }
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };
  //form validation
  const validationSchema = Yup.object({
    name: Yup.string().transform(value => value.trim()).required("employee name is required"),
    email: Yup.string().transform(value => value.trim())
      .required("employee email is required")
      .email("invalid email format"),
    number: Yup.string()
      .transform(value => value.trim())
      .matches(/^\d{10}$/, "number must be 10 digits")
      .required("employee number is required"),
    password: Yup.string()
      .transform(value => value.trim())
      .required("employee password is required")
      .min(8, "password must be at least 8 charaters")
      .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
        "Password must contain at least one number,lowercase,uppercase or symbol"),
    address: Yup.string()
      .transform(value => value.trim())
      .required("employee address is required")
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false })

      const data = await upsertEmployee(formData)
      if (data.data) {
        closeModal();
        fetchEmployees();
        if (editingEmployee) {
          Toast.success("Employee Updated Successfully!");
        } else {
          Toast.success("Employee Added Successfully!");
        }
      } else {
        toast.error(data.message)
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
        if (editingEmployee) {
          Toast.error("Failed to Update Employee!");
        } else {
          Toast.error("Failed to Add Employee!");
        }
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const data = await deleteEmployee(id);

        if (data.data) {
          fetchEmployees();
          Toast.success(data.message);
        } else {
          Toast.error(data.message)
        }
      } catch (error) {

        if (axios.isAxiosError(error)) {
          // Now that TypeScript knows this is an AxiosError, we can access error.response
          const axiosError = error as AxiosError;

          if (axiosError.response) {
            // Handle API response errors (e.g., 400, 404, 500, etc.)
            if (axiosError.response.status === 401) {

              logout();
            }
          }
        }


        console.error('Error deleting employee:', error);
        Toast.error("Failed to Delete Employee!");
      }
    }
  };

  const openModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        number: employee.number,
        isActive: employee.isActive,
        address: employee.address,
        role: employee.role,
        password: '',
        _id: employee._id,


      });
    } else {
      setEditingEmployee(null);
      setFormData({
        _id: null,
        name: '',
        email: '',
        number: '',
        address: '',
        password: '',
        isActive: true,
        role: "Admin"
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col px-6 py-4 sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage company employees and their information</p>
        </section>
        <Button className="bg-[var(--primary-color)]" onClick={() => openModal()}>
          <Plus size={16} className="mr-2" />
          Add Employee
        </Button>
      </div>

      <hr className="text-gray-300" />

      {/* Search
      <div className="relative max-w-md mx-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div> */}

      {/* Employees Table */}
      {loading ? <Loader /> :
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">

              <div className='my-4 mx-4'>
                <label className='font-semibold'>Role: </label>
                <select
                  onChange={(event) => setFilterByRole(event.target.value)}
                  value={filterByRole}
                  className="font-semibold p-2"
                >
                  <option value="All">All</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                  <option value="Technician">Technician</option>
                </select>

              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Number
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(employees) && employees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4  whitespace-nowrap">
                        <div className="flex items-center justify-center">

                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>

                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {employee.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex justify-center items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
                          {employee.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex justify-center items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
                          {employee?.address}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {employee.role}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-center font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openModal(employee)}
                            className="text-primary-600 hover:text-primary-900 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id!!)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            {employee.isActive ? <Eye /> : <EyeOff />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {Array.isArray(employees) && employees.length == 0 && <div>
            <DataNotFound />
          </div>

          }
        </>
      }


      {/* Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}

              />
            </div>

            <div>
              <Input
                label="Number"
                type="text"
                placeholder="Enter your number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                error={errors.number}
              />
            </div>

            <div className='relative'>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}

              />

              <button
                type="button"
                className="absolute right-3 top-11 h-4 w-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)} >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter service Address..."

            />
            {errors.address && (<p className="font-semibold text-sm text-red-600 mt-[-8px] ps-2 pt-1">{errors.address}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="SuperAdmin">SUPER ADMIN</option>
              <option value="Admin">ADMIN</option>
              <option value="Technician">TECHNICIAN</option>
            </select>
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <Button className="bg-green-500" type="submit">
              {editingEmployee ? 'Update' : 'Create'} Employee
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>


      {employees.length > 0 && (
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

export default Employees;
