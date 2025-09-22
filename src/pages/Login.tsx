import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { loginAdmins } from '../services/user.service';
import type { loginRequest } from '../types/requestTypes/loginRequest.interface';

const Login: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // const response = await authAPI.login(formData);
      // login(response.data.user, response.data.token);
      let obj: loginRequest = {
        email: formData.email,
        password: formData.password,
        type: 0
      };
      const data = await loginAdmins(obj);
      if(data.data.jwt){
        login(data.data.employee, data.data.jwt)
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex GAP-4 bg-gray-50">
      <img className='hidden lg:block flex-grow object-fit' src="https://tse4.mm.bing.net/th/id/OIP.BeA86kY5KYsxeloGD2oHKgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
      <div className='flex justify-center items-center flex-grow'>

        <div className="max-w-md w-full space-y-8 bg-white p-6  shadow-2xl">
          <section>
            <div className="mx-auto h-6 w-12 flex items-center justify-center rounded-full bg-primary-100">
              <Lock className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Service On Site
            </h2>
            <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
            </h2>
            <p className="mt-2 text-center text-md text-gray-600">
              Sign in to Admin Panel
            </p>
          </section>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  required
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                />
                <Lock className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-9 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600"
              loading={loading}
              size="lg"
            >
              Sign In
            </Button>


          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;