import "./style.css";
import { useState, Fragment, useRef, useEffect } from "react";
import { addProduct } from "../../api/product";
import { getAllStores } from "../../api/store";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const Index = ({
  uniqueBarcodeValue,
  setOpenAddItem,
  setIsItemAdded,
  storeDetails,
}) => {
  const [open, setOpen] = useState(true);
  const [stores, setStores] = useState([]);
  const [networkStatus, setNetworkStatus] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    manufacturing_year: "",
    generation: "",
    store: {
      store_id: storeDetails?.store_id ? storeDetails.store_id : "",
      store_name: storeDetails?.store_name ? storeDetails.store_name : "",
    },
    condition: "working", // Default to true (Working)
    images: [],
    barcode: uniqueBarcodeValue,
  });
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setNetworkStatus(navigator.onLine);
    getAllStores()
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "store") {
      const [store_id, store_name] = value.split(",");

      setFormData((prevData) => ({
        ...prevData,
        store: { store_id, store_name },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: [...prevData[name], ...files],
    }));
  };

  // Update handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!networkStatus) {
      localStorage.setItem("itemData", JSON.stringify(formData));
      setIsItemAdded(true);
      toast.success("Item Added Successfully", { autoClose: 1500 });
      setOpen(false);
      setOpenAddItem(false);
      return;
    }
    const formDataWithImages = new FormData();
    // Iterate over formData and append each key-value pair to formDataWithImages
    for (const [key, value] of Object.entries(formData)) {
      if (key === "images") {
        // Append each image to the "images" key
        value.forEach((image) => {
          formDataWithImages.append("images", image);
        });
      } else if (key === "store") {
        formDataWithImages.append("store", JSON.stringify(value));
      } else {
        formDataWithImages.append(key, value);
      }
    }

    addProduct(formDataWithImages)
      .then(() => {
        setIsItemAdded(true);
        toast.success("Item Added Successfully", { autoClose: 1500 });
      })
      .catch((err) => toast.error(err.message, { autoClose: 1500 }));

    setOpen(false);
    setOpenAddItem(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {
          setOpen(false);
          setOpenAddItem(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col justify-center items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600 inline-block mr-1"
                      aria-hidden="true"
                    />
                    Add Item
                  </Dialog.Title>
                  <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    <div className="relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <label
                        htmlFor="name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Item Name
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="manufacturer"
                        id="manufacturer"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={formData.manufacturer}
                        onChange={handleInputChange}
                        required
                      />
                      <label
                        htmlFor="manufacturer"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Manufacturer
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="manufacturing_year"
                        id="manufacturing_year"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={formData.manufacturing_year}
                        onChange={handleInputChange}
                        required
                      />
                      <label
                        htmlFor="manufacturing_year"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Year of Manufacturing
                      </label>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="generation"
                          id="generation"
                          className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={formData.generation}
                          onChange={handleInputChange}
                          required
                        />
                        <label
                          htmlFor="generation"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Generation
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        {storeDetails ? (
                          <Fragment>
                            <input
                              type="text"
                              name="store"
                              id="store"
                              className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              disabled={storeDetails ? true : false}
                              value={
                                storeDetails
                                  ? storeDetails.store_name
                                  : `${formData.store.store_id},${formData.store.store_name}`
                              }
                              required
                            />
                            <label
                              htmlFor="store"
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Store
                            </label>
                          </Fragment>
                        ) : (
                          <div className="relative">
                            <select
                              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="store"
                              name="store"
                              value={
                                formData.store
                                  ? `${formData.store.store_id},${formData.store.store_name}`
                                  : ""
                              }
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select Store</option>
                              {stores.map((store) => (
                                <option
                                  key={store._id}
                                  value={`${store._id},${store.store_name}`}
                                >
                                  {store.store_name}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <div className="flex">
                        <div className="flex items-center me-4">
                          <input
                            id="condtion1"
                            type="radio"
                            name="condition"
                            value="working"
                            onChange={handleInputChange}
                            defaultChecked
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-50 focus:ring-2"
                          />
                          <label
                            htmlFor="condtion1"
                            className="ms-2 text-sm font-medium text-gray-500"
                          >
                            Working
                          </label>
                        </div>
                        <div className="flex items-center me-4">
                          <input
                            id="condition2"
                            type="radio"
                            name="condition"
                            value="defective"
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                          />
                          <label
                            htmlFor="condition"
                            className="ms-2 text-sm font-medium text-gray-500"
                          >
                            Defective
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <input
                        type="file"
                        name="images"
                        id="images"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent appearance-none focus:outline-none focus:ring-0 peer"
                        onChange={(e) => handleImageChange(e)}
                        multiple
                        required
                      />
                      <label
                        htmlFor="images"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Images
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="barcode"
                        id="barcode"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        readOnly
                        value={uniqueBarcodeValue}
                      />
                      <label
                        htmlFor="barcode"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Barcode
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="text-gray-900 bg-white hover:bg-gray-50 ms-2 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center border border-gray-300"
                      onClick={() => {
                        setOpenAddItem(false);
                        setOpen(false);
                      }}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

Index.propTypes = {
  uniqueBarcodeValue: PropTypes.string,
  setOpenAddItem: PropTypes.func,
  setIsItemAdded: PropTypes.func,
  storeDetails: PropTypes.object,
};

export default Index;
