// toast.js
import { toast } from 'react-toastify';

const Toast = {
    success(message: string) {
        // console.log("Error is", message)
        toast.success(message)
    },
    
    error(message: string) {
        // console.log("Error is", message)
        toast.error(message)
    }

};

export default Toast;
