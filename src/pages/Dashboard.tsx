import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Briefcase, NotebookText } from 'lucide-react';
import { getDashBoardData } from '../services/user.service';
import type { DashboardResponse } from '../types/responseTypes/dashbiardResponse.';
import { useNavigate } from 'react-router-dom';
import { setNavigator } from '../services/navigationService';
import Loader from '../components/UI/Loader';

const Dashboard: React.FC = () => {
  

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);
  const [dashBoarddata, setDashBoardData] = useState<DashboardResponse | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await getDashBoardData();
      if (data.data) {
        setDashBoardData(data.data)
      }
    } catch (error) {

    } finally {
      setLoading(false)

    }
  }

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div className="space-y-6 p-4">
      <section>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening.</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900"> {dashBoarddata?.userCount && dashBoarddata.userCount >= 0 ? dashBoarddata.userCount : "N/A"}
              </p>

            </div>
            <div className={`p-3 rounded-full bg-blue-500`}>
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Technician</p>
              <p className="text-2xl font-bold text-gray-900">{dashBoarddata?.employeeCount ? dashBoarddata.employeeCount : "N/A"}</p>

            </div>
            <div className={`p-3 rounded-full bg-green-500`}>
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services</p>
              <p className="text-2xl font-bold text-gray-900">{dashBoarddata?.serviceCount && dashBoarddata.serviceCount >= 0 ? dashBoarddata.serviceCount : "N/A"}</p>

            </div>
            <div className={`p-3 rounded-full bg-purple-500`}>
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services request</p>
              <p className="text-2xl font-bold text-gray-900">{dashBoarddata?.serviceRequestCount && dashBoarddata.serviceRequestCount >= 0 ? dashBoarddata.serviceRequestCount : "N/A"}</p>

            </div>
            <div className={`p-3 rounded-full bg-yellow-500`}>
              <NotebookText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>


      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Array.isArray(dashBoarddata?.user) && dashBoarddata.user.length > 0 && dashBoarddata?.user.map((item, key) => (
                <div key={key} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-400 text-white uppercase rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{item.name[key]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">Recent Service Requests</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Array.isArray(dashBoarddata?.serviceRequest) && dashBoarddata.serviceRequest.length > 0 && dashBoarddata?.serviceRequest.map((item, key) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.serviceId.name}</p>
                    <p className="text-xs text-gray-500">{item.subServiceName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900"> &#8377; {item.amount}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;