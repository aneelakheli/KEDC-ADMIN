import { toast } from "react-toastify";

export default function notify(text:string, type:string)
{
    switch(type){
        case "error":
            toast.error(text);
            break;
        case "success":
            toast.success(text);
            break;
        case "warn":
            toast.warn(text);
        case "info":
            toast.info(text);
        default:
    }
}