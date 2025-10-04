import {  EyeIcon, Search } from "lucide-react";
import Input from "../components/UI/Input";
import { useEffect, useState } from "react";
import DataNotFound from "./NoDataFound";
import { getServiceRequest } from "../services/user.service";
import type { ServiceRequestInterface } from "../types/responseTypes/serviceResponse";
import { useNavigate } from "react-router-dom";

const NewServices: React.FC = () => {

    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('');
    const [newService, SetNewService] = useState<ServiceRequestInterface[] | null>(null);

    useEffect(() => {
        fetchServiceRequest();
    }, [])

    function navigateToDetail(id:string){
        navigate(`/serviceRequestDetail/${id}`)
    }

    async function fetchServiceRequest() {
        try {
            const newService = await getServiceRequest();
            if (newService && newService.data != null && newService.data.length >= 0) {
                SetNewService(newService.data)
            }

        } catch (error) {

        }
    }


    return (
        <div className="space-y-6 ">
            <div className="flex flex-col px-6 py-4 sm:flex-row sm:items-center sm:justify-between gap-4">
                <section>
                    <h1 className="text-2xl font-bold text-gray-900">New Service Request</h1>
                    <p className="text-gray-600">Service Request not assigned to Technician</p>
                </section>

            </div>

            <div className="relative max-w-md mx-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                    type="text"
                    placeholder="Search New Service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <hr className="text-gray-300" />

            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Sub-Service
                                </th>
                                <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Address
                                </th>
                                <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">

                            {Array.isArray(newService) && newService.map((serviceData, index) => (

                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-center whitespace-nowrap">

                                        <div className="text-sm font-medium text-gray-900">{serviceData.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <span className="text-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
                                            {serviceData.serviceId.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {serviceData.serviceId.services.find(element => element._id == serviceData.subServiceId)?.name || 'Service not found'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                                        {serviceData.address}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                            onClick={()=>{navigateToDetail(serviceData._id)}}
                                                className="text-primary-600 hover:text-primary-900 p-1"
                                            >
                                                <EyeIcon size={16} />
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



            {(!newService || (Array.isArray(newService) && newService.length == 0)) && <div>
                <DataNotFound />
            </div>}


        </div >
    )
}

export default NewServices; 