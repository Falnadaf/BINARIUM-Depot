import { getRequest, deleteRequest, postRequest, putRequestWithFormData } from "..";

const getAllProducts = () => {
    return getRequest('/api/product/get-all')
}

const deleteProductById = (_id) => {
    return deleteRequest(`/api/product/delete/${_id}`)
}

const updateProductById = (_id, body) => {
    return putRequestWithFormData(`/api/product/update/${_id}`, body)
}

const addProduct = (body) => {
    return postRequest(`/api/product/add`, body)
}

const getProductByIdOrBarcode = (searchValue) => {
    return getRequest(`/api/product/get?searchValue=${searchValue}`)
}

const getProductByStore = (store_id) => {
    return getRequest(`/api/product/store?store_id=${store_id}`)
}

export {
    getAllProducts,
    deleteProductById,
    updateProductById,
    addProduct,
    getProductByIdOrBarcode,
    getProductByStore
}