import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assignServiceRequest, getServiceRequestById, getTechnician } from "../services/user.service";
import type { ServiceRequestInterface } from "../types/responseTypes/serviceResponse";
import Select from "react-select"
import type { TechnicianResponse } from "../types/responseTypes/TechnicianRespons";
import Toast from "../utility/toast";
import type { ServiceAssign } from "../types/requestTypes/serviceAssign.interface";
import { PhoneIcon } from "lucide-react";
import type { AxiosError } from "axios";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ServiceDetail: React.FC = () => {
    const { logout } = useAuth();

    const { id } = useParams();
    const [newService, setnewService] = useState<ServiceRequestInterface | null>(null);
    const [technician, setTechnician] = useState<TechnicianResponse[] | null>(null);

    const [selectedOption, setSelectedOption] = useState<any>(null);
    const navigate = useNavigate()
    const handleChange = (option: any) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        fetchServiceDetail();
        fetchTechnician()
    }, []);

    const technicianOptions = technician?.map(t => ({
        value: t._id,
        label: t.name,
    }));

    async function fetchTechnician() {
        try {
            const data = await getTechnician();
            if (data.data) {
                setTechnician(data.data)
            } else {
                setTechnician(null)
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
        }
    }

    async function assignRequest() {
        try {


            if (selectedOption && selectedOption.value && newService) {
                let payload: ServiceAssign = {
                    _id: newService?._id,
                    employeeId: selectedOption.value
                }
                const data = await assignServiceRequest(payload);
                if (data.data) {
                    Toast.success(data.message);
                    navigate(-1)
                } else {
                    Toast.error(data.message)
                    Toast.error(data.message ? data.message : "Something went wrong")


                }
            } else {
                Toast.error("Please select a technician before proceeding.");

            }
        } catch (error: any) {
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
            Toast.error(error);

        }

    }
    async function fetchServiceDetail() {
        try {
            if (id) {
                const data = await getServiceRequestById(id);
                if (data.data) {
                    setnewService(data.data)
                } else {
                    setnewService(null)
                    Toast.error(data.message ? data.message : "Something went wrong")
                }

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
        }
    }
    return (
        <div className="bg-gray-100 rounded-2xl m-2 p-4">
            {(!newService?.assignmentRequest && !newService?.assignTo) && <div className=" mr-8 mb-2">
                <div className=" flex justify-end  items-center">

                    <p className="font-semibold mx-2">Select Technician - </p>
                    <Select
                        className="w-100"
                        value={selectedOption}
                        onChange={handleChange}
                        options={technicianOptions}
                        isSearchable
                    />
                </div>
                <div className="flex my-2 justify-end">
                    <button onClick={assignRequest} className="bg-[var(--primary-color)] text-white px-4 py-1 rounded hover:bg-[#15191eeb]  transistion-all duration-200">Assign Request</button>
                </div>
            </div>}

            <div className="flex flex-col md:flex-row justify-between mx-4 gap-4 ">



                <div className="bg-white flex-grow p-4">
                    <h2 className="font-semibold text-lg">Requested User</h2>
                    <div className="mx-1">

                        <div className="flex gap-1 p-1">
                            <p className="font-semibold flew-grow">Name - <span className="font-normal">{newService?.name}</span></p>
                        </div>
                        <div className="flex gap-1 p-1">
                            <p className="font-semibold flew-grow">Number - <span className="font-normal">{newService?.number}</span></p>
                        </div>
                        <div className="flex gap-1 p-1">
                            <p className="font-semibold flew-grow">Email - <span className="font-normal">{newService?.email}</span></p>
                        </div>
                    </div>
                </div>
                {/* <div className="bg-white flex-grow p-4">
                    <h2 className="font-semibold text-lg"> User</h2>
                    <div className="mx-1">

                        <div className="flex gap-1 p-1">
                            <p className="font-semibold flew-grow">Name - <span className="font-normal">{newService?.customer?.name}</span></p>
                        </div>
                        <div className="flex gap-1 p-1">
                            <p className="font-semibold flew-grow">Number - <span className="font-normal">{newService?.customer?.number}</span></p>
                        </div>
                        <div className="flex gap-1 p-1">
                            <p className="font-semibold flew-grow">Email - <span className="font-normal">{newService?.customer?.email}</span></p>
                        </div>
                    </div>
                </div> */}

            </div>

            <div className="mt-4 bg-white p-4 mx-4">

                <div className="flex justify-between mx-3">
                    <h2 className="font-semibold text-lg">Requested Service</h2>
                    <h3 className="font-semibold text-lg">Status - <button className="bg-[var(--primary-color)] text-white px-4 py-1 rounded-lg">{newService?.status}</button></h3>
                </div>
                <div className="mx-1 flex flex-col gap-1 ">
                    <p className="font-semibold p-2">Service - <span className="font-normal">{newService?.serviceId.name}</span> </p>
                    <p className="bg-gray-100 font-semibold p-2">Sub-Service - <span className="font-normal">{newService?.subServiceName}</span> </p>
                    <p className="font-semibold p-2">Description - <span className="font-normal">{newService?.description}</span> </p>
                    <p className="bg-gray-100 p-2 font-semibold">Address - <span className="font-normal">{newService?.address}</span> </p>
                    <p className="font-semibold p-2">Amount - <span className="font-normal"> &#8377; {newService?.amount}</span> </p>
                    {newService?.assignTo && <p className="font-semibold bg-gray-100 p-2">Assign To - <span className="font-normal"> {newService?.assignTo.name} (<PhoneIcon className="inline h-4 p-0" />{newService?.assignTo.number})</span> </p>}
                    {newService?.assignmentRequest && <p className="font-semibold bg-gray-100 p-2">Assign Request - <span className="font-normal"> {newService?.assignmentRequest.name} ( <PhoneIcon className="inline h-4 p-0" />{newService?.assignmentRequest.number})</span> </p>}
                    {newService?.comment && <p className="font-semibold  p-2">Comment - <span className="font-normal"> {newService?.comment} </span> </p>}
                </div>


            </div>
        </div>
    )
}

export default ServiceDetail