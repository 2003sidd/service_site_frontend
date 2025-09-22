import axiosInstance from './AxiosInstance'

// Define the response type for a generic API request
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Utility function for GET request
export const get = async <T>(url: string, config: object = {}): Promise<T> => {
  // try {
    const response: ApiResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  // } catch (error) {
  //   console.error('API GET request error:', error);
  //   throw error;
  // }
};

// Utility function for POST request
export const post = async <T, U>(
  url: string,
  data: T,
  config: object = {}
): Promise<U> => {
  try {
    const response: ApiResponse<U> = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error('API POST request error:', error);
    throw error;
  }
};

// Utility function for PUT request
export const put = async <T, U>(
  url: string,
  data: T,
  config: object = {}
): Promise<U> => {
  try {
    const response: ApiResponse<U> = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    console.error('API PUT request error:', error);
    throw error;
  }
};

// Utility function for DELETE request
export const del = async <T>(
  url: string,
  config: object = {}
): Promise<T> => {
  try {
    const response: ApiResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    console.error('API DELETE request error:', error);
    throw error;
  }
};




// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     // Mock login - in real app, this would be a proper API call
//     const response = await api.post('/posts', credentials); // Using posts endpoint as mock
    
//     // Mock successful login response
//     const mockUser = {
//       id: '1',
//       name: 'Admin User',
//       email: credentials.email,
//       role: 'admin'
//     };
    
//     const mockToken = 'mock-jwt-token-' + Date.now();
    
//     return {
//       data: {
//         user: mockUser,
//         token: mockToken
//       }
//     };
//   },
  
//   logout: () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//   }
// };

// export const userAPI = {
//   getUsers: async (): Promise<User[]> => {
//     const response = await api.get('/users');
//     return response.data.map((user: any) => ({
//       id: user.id.toString(),
//       name: user.name,
//       email: user.email,
//       role: Math.random() > 0.5 ? 'admin' : 'user',
//       status: Math.random() > 0.3 ? 'active' : 'inactive',
//       createdAt: new Date().toISOString()
//     }));
//   },
  
//   createUser: async (userData: Omit<User, 'id' | 'createdAt'>) => {
//     const response = await api.post('/users', userData);
//     return {
//       ...response.data,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString()
//     };
//   },
  
//   updateUser: async (id: string, userData: Partial<User>) => {
//     const response = await api.put(`/users/${id}`, userData);
//     return response.data;
//   },
  
//   deleteUser: async (id: string) => {
//     await api.delete(`/users/${id}`);
//   }
// };

// export const employeeAPI = {
//   getEmployees: async (): Promise<Employee[]> => {
//     const response = await api.get('/users');
//     return response.data.map((emp: any) => ({
//       id: emp.id.toString(),
//       name: emp.name,
//       email: emp.email,
//       position: ['Developer', 'Designer', 'Manager', 'Analyst'][Math.floor(Math.random() * 4)],
//       department: ['IT', 'HR', 'Finance', 'Marketing'][Math.floor(Math.random() * 4)],
//       salary: Math.floor(Math.random() * 50000) + 30000,
//       joinDate: new Date().toISOString(),
//       status: Math.random() > 0.2 ? 'active' : 'inactive'
//     }));
//   },
  
//   createEmployee: async (employeeData: Omit<Employee, 'id'>) => {
//     const response = await api.post('/users', employeeData);
//     return {
//       ...response.data,
//       id: Date.now().toString()
//     };
//   },
  
//   updateEmployee: async (id: string, employeeData: Partial<Employee>) => {
//     const response = await api.put(`/users/${id}`, employeeData);
//     return response.data;
//   },
  
//   deleteEmployee: async (id: string) => {
//     await api.delete(`/users/${id}`);
//   }
// };

// export const serviceAPI = {
//   getServices: async (): Promise<Service[]> => {
//     const response = await api.get('/posts');
//     return response.data.slice(0, 10).map((service: any) => ({
//       id: service.id.toString(),
//       name: service.title,
//       description: service.body,
//       price: Math.floor(Math.random() * 500) + 50,
//       category: ['Web Development', 'Mobile App', 'Design', 'Consulting'][Math.floor(Math.random() * 4)],
//       status: Math.random() > 0.2 ? 'active' : 'inactive',
//       createdAt: new Date().toISOString()
//     }));
//   },
  
//   createService: async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
//     const response = await api.post('/posts', serviceData);
//     return {
//       ...response.data,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString()
//     };
//   },
  
//   updateService: async (id: string, serviceData: Partial<Service>) => {
//     const response = await api.put(`/posts/${id}`, serviceData);
//     return response.data;
//   },
  
//   deleteService: async (id: string) => {
//     await api.delete(`/posts/${id}`);
//   }
// };

// export default api;