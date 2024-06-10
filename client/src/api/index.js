import axios from "axios"
import { BACKEND_URL } from "../config"

const axiosInstance = axios.create({ baseURL: BACKEND_URL })

const getRequest = (API, body) => axiosInstance.get(API, body)
const postRequest = (API, body) => axiosInstance.post(API, body)
const putRequest = (API, body) => axiosInstance.put(API, body)
const putRequestWithFormData = (API, formData) => axiosInstance.put(API, formData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
});
const deleteRequest = (API, body) => axiosInstance.delete(API, body)

export { getRequest, postRequest, putRequest, deleteRequest, putRequestWithFormData }