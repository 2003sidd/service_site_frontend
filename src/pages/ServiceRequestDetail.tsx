import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceRequestById } from "../services/user.service";
import type { ServiceRequestInterface } from "../types/responseTypes/serviceResponse";

const ServiceDetail: React.FC = () => {
    const { id } = useParams();
    const [newService, setnewService] = useState<ServiceRequestInterface | null>(null);


    useEffect(() => {
        fetchServiceDetail();
    }, [])

    async function fetchServiceDetail() {
        try {
            if (id) {
                const data = await getServiceRequestById(id);
                if (data.data) {
                    setnewService(data.data)
                }

            }
        } catch (error) {

        }
    }
    return (
        <div className="bg-gray-100 rounded-2xl m-2 p-4">
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
                <div className="bg-white flex-grow p-4">
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
                </div>

            </div>

            <div className="mt-4 bg-white p-4 mx-4">

                <h2 className="font-semibold text-lg">Requested Service</h2>
                <div className="mx-1 flex flex-col gap-1 ">
                    <p className="font-semibold p-2">Service - <span className="font-normal">{newService?.serviceId.name}</span> </p>
                    <p className="bg-gray-100 font-semibold p-2">Sub-Service - <span className="font-normal">{newService?.serviceId.services.find(element => element._id == newService.subServiceId)?.name}</span> </p>
                    <p className="font-semibold p-2">Description - <span className="font-normal">{newService?.description}</span> </p>
                    <p className="bg-gray-100 p-2 font-semibold">Address - <span className="font-normal">{newService?.address}</span> </p>
                    <p className="font-semibold p-2">Amount - <span className="font-normal"> &#8377; {newService?.amount}</span> </p>
                </div>


            </div>
        </div>
    )
}

export default ServiceDetail