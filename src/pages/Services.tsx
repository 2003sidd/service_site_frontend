import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import { getService, serviceCreation, toggleServiceview } from '../services/user.service';
import type { ServiceRequest } from '../types/requestTypes/serviceRequest.interface';
import Toast from '../utility/toast';

const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRequest | null>(null);
  const [formData, setFormData] = useState<ServiceRequest>({
    _id: '',
    name: '',
    description: '',
    services: [
      { price: '', name: '' } // initial pricing field
    ],
    isActive: true as true | false
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [
        ...prev.services,
        { name: '', price: '' } // new blank service
      ]
    }));
  };



  const handleSerNameChange = (index: number, value: string) => {
    const updatedPricing = formData.services.map((service, i) =>
      i === index ? { ...service, name: value } : { ...service }
    );

    setFormData(prev => ({
      ...prev,
      services: updatedPricing
    }));
  };


  const handleSerPriceChange = (index: number, value: string) => {
    const trimmedValue = value.trim();
    const parsed = parseFloat(trimmedValue);

    const isValid = trimmedValue !== '' && !isNaN(parsed) && isFinite(parsed);

    const updatedPricing = formData.services.map((service, i) => {
      if (i === index) {
        return {
          ...service,
          price: isValid ? value : ''
        };
      }
      return { ...service };
    });

    if (!isValid) {
      console.log('Invalid price input');
    }

    setFormData(prev => ({
      ...prev,
      services: updatedPricing
    }));
  };


  const fetchServices = async () => {
    try {
      const data = await getService();
      if(data.data){
        setServices(data.data)

      }

    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // if (editingService) {
      //   await serviceAPI.updateService(editingService.id, formData);
      // } else {
      //   await serviceAPI.createService(formData);
      // }
      console.log("form si", formData);
      const data = await serviceCreation(formData);
      if (data.data) {
        fetchServices();
        closeModal();
        Toast.success("Service added successfully!"); 
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        // await serviceAPI.deleteService(id);
        const data = await toggleServiceview(id);
        if (data.data) {
          fetchServices();
        } else {

        }
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const openModal = (service?: ServiceRequest) => {
    if (service) {
      setEditingService(service);
      setFormData({
        _id: service._id,
        name: service.name,
        description: service.description,
        services: service.services,
        isActive: service.isActive
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        services: [{ price: '', name: '' }],

        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
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
      <div className="flex p-6 my-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage company services and offerings</p>
        </section>

        <Button className="bg-green-500" onClick={() => openModal()}>
          <Plus size={16} className="mr-2" />
          Add Service
        </Button>
      </div>

      {/* Search
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div> */}
      <hr className="text-gray-300 my-4" />
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-2">
        {Array.isArray(services) && services.map((service) => (
          <div key={service._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-3">{service.description}</p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => openModal(service)}
                    className="text-primary-600 hover:text-primary-900 p-1"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(service._id!!)}
                    className="text-red-600 hover:text-red-900 p-1">
                    {service.isActive ? <Eye /> : <EyeOff />}

                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>

                  {Array.isArray(services) && service.services.length > 0 && service.services.map((data, index) => (
                    <div key={index} className='flex justify-between font-semibold'>
                      {data.name}    <span className='mx-2 grow font-normal'> - &#8377; {data.price}</span>
                    </div>
                  ))

                  }
                </div>

                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${service.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

          {Array.isArray(services) && services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No services found matching your search.</p>
        </div>
      )}

      {/* Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Name"
            type="text"
            required
            placeholder="Enter service name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter service description..."
            />
          </div>

          <div className='bg-gray-100 p-4 rounded max-h-[400px] overflow-y-auto'>
            <h2 className='my-[6px] font-semibold text-lg'>Sub - Services</h2>
            {formData.services.map((p, index) => (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <Input
                  label="Name"
                  type="text"
                  required
                  className='bg-white'
                  value={p.name}
                  placeholder=""
                  onChange={(e) => handleSerNameChange(index, e.target.value)}
                />
                <section className='flex items-end justify-center gap-4'>

                  <Input
                    label="Price (&#8377;)"
                    type="text"
                    required
                    className='bg-white'
                    value={p.price}
                    onChange={(e) => handleSerPriceChange(index, e.target.value)}
                  />
                  {index != 0 &&
                    <span onClick={() => { removeService(index) }} className='bg-red-400 p-2 text-white rounded-xl'>-</span>

                  }
                </section>
              </div>
            ))}
            <div className='text-end' >
              <span className='bg-yellow-300 py-1 px-4 rounded-lg mt-2 font-semibold cursor-pointer' onClick={addService}>Add</span>

            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.isActive ? "true" : "false"}  // Display true/false as strings for select
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })} // Convert string to boolean
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <Button className='bg-green-500' type="submit">
              {editingService ? 'Update' : 'Create'} Service
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

export default Services;