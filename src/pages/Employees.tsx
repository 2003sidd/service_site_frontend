import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Employee } from '../types';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import { deleteEmployee, getEmployee, upsertEmployee } from '../services/employee.service';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  // const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      // const data = await employeeAPI.getEmployees();
      // setEmployees(data);

      const data = await getEmployee({ index: 1, top: 10 })
      console.log("data is", data.data)
      if (data.data.total > 0) {
        setEmployees(data.data.users)
      } else {

      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // if (editingEmployee) {
      //   await employeeAPI.updateEmployee(editingEmployee.id, formData);
      // } else {
      //   await employeeAPI.createEmployee(formData);
      // }
      const data = await upsertEmployee(formData)
      if (data.data) {
        fetchEmployees();
        closeModal();
      } else {

      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        // await employeeAPI.deleteEmployee(id);
        const data = await deleteEmployee(id);

        if (data.data) {
          fetchEmployees();
        } else {

        }
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
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
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col px-6 py-4 sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage company employees and their information</p>
        </section>
        <Button className="bg-green-500" onClick={() => openModal()}>
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
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

      {/* Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              type="text"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter service description..."
            />
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
    </div>
  );
};

export default Employees;