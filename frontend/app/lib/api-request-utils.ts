import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api-v1/";

//custom axios instence, //api.get('/home')
const api = axios.create({
    baseURL: BASE_URL, 
    headers: {
        'Content-Type': 'application/json', 
    }
})

// to modify the request object before send -- https://axios-http.com/docs/interceptors
api.interceptors.request.use((reqObj) => {

    const token = localStorage.getItem('token');
    if(token) reqObj.headers.Authorization = `Bearer ${token}`;
    return reqObj;

}, (error) => Promise.reject(error)); 

// or handling responses or errors
api.interceptors.response.use((resObj) => resObj, (err) => {
    // Unauthorized
    if(err?.response?.status === 401){
        localStorage.removeItem('token');
        // will handle this custom event if user unauthorized or ttoken expires
        window.dispatchEvent(new Event('force-logout'));
    }

    return Promise.reject(err);
})  


// to post data, (any data, generic funtion), no need handle error, we have already handled it in interceptors
const postData = async<Type>(url: string, data: unknown):Promise<Type> => {
    const res = await api.post(url, data);
    return res.data;
}

const getData = async<Type>(url: string):Promise<Type> => {
    const res = await api.get(url);
    return res.data;
}

const updateData = async<Type>(url: string, data: unknown):Promise<Type> => {
    const res = await api.put(url, data);
    return res.data;
}

const deleteData = async<Type>(url: string):Promise<Type> => {
    const res = await api.delete(url);
    return res.data;
}

export {
    postData, getData, updateData, deleteData
}