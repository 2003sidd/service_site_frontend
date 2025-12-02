import { EyeIcon, Search } from "lucide-react";
import Input from "../components/UI/Input";
import { useEffect, useMemo, useState } from "react";
import DataNotFound from "./NoDataFound";
import { getNewRequests } from "../services/user.service";
import type { ServiceRequestInterface } from "../types/responseTypes/serviceResponse";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import Loader from "../components/UI/Loader";
// import {debounce} from "lodash"
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { debounce } from "lodash";
import Toast from "../utility/toast";

const NewServices: React.FC = () => {

    const navigate = useNavigate()
    const { logout } = useAuth();



    const [newService, SetNewService] = useState<ServiceRequestInterface[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemPerPage, SetItemPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchServiceRequest(currentPage);
    }, [currentPage, search]);

    // Debounced function
    const debouncedSearch = useMemo(() => {
        const fn = debounce((value: string) => {
            setSearch(value);
            setCurrentPage(1);
        }, 1000);

        return fn;
    }, []);

    // Handle input changes
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        debouncedSearch.cancel();

        debouncedSearch(value);
    };



    function navigateToDetail(id: string) {
        navigate(`/serviceRequestDetail/${id}`)
    }

    async function fetchServiceRequest(page = 1) {
        try {
            setLoading(true)
            const newService = await getNewRequests({ index: page, top: itemPerPage, searchBy: search });

            if (newService && newService.data != null && newService.data.data != null && newService.data.data.length > 0) {
                SetNewService(newService.data.data)
                let temp = Math.ceil(newService.data.total / itemPerPage);
                setTotalPages(temp)
            } else {
                SetNewService(null)
                setTotalPages(0)
                Toast.error(newService.message)
            }
        } catch (error) {
            // First, ensure the error is an AxiosError
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
        } finally {
            setLoading(false)

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
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <hr className="text-gray-300" />

            {loading ? <Loader /> : <>
                {/* Users Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Service ID
                                    </th>
                                    <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3  text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Sub-Service
                                    </th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
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

                                            <div className="text-sm font-medium text-gray-900">{serviceData.uuid}</div>
                                        </td>
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
                                                {serviceData.subServiceName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                {serviceData.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => { navigateToDetail(serviceData._id) }}
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

                {newService != null && newService.length > 0 && (
                    <div className="flex justify-end mr-8 items-center mt-4 space-x-2">
                        <div >
                            <span className='mx-2'>
                                No. of page

                            </span>
                            <select value={itemPerPage} className='p-[6px] rounded-lg bg-gray-200' name="page" id="page" onChange={(event) => { SetItemPerPage((event?.target.value) as unknown as number) }}>
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

            </>}

        </div >
    )
}

export default NewServices; 
