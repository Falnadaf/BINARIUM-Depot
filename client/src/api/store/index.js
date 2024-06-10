import { getRequest, deleteRequest, postRequest } from ".."

const getAllStores = () => {
    return getRequest('/api/store/get-all')
}

const getStoreById = (_id) => {
    return getRequest(`/api/store/get?_id=${_id}`)
}

const deleteStore = (_id) => {
    return deleteRequest(`/api/store/delete/${_id}`)
}

const addStore = (body) => {
    return postRequest('/api/store/add', body)
}


export {
    getAllStores,
    deleteStore,
    addStore,
    getStoreById
}