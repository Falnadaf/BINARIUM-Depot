import "./style.css";
import dummyStore from "../../assets/images/store.png";
import { useEffect, useState, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getAllStores, addStore, deleteStore } from "../../api/store";
import { toast } from "react-toastify";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";

const storesPerPage = 4;

const Index = () => {
  const [stores, setStores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [wantAddItem, setWantAddItem] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(true);
  const [storeDetails, setStoreDetails] = useState({
    store_name: "",
    store_id: "",
  });
  const [formData, setFormData] = useState({
    image: "",
    store_name: "",
  });
  const navigate = useNavigate();
  const cancelButtonRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  // Update handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!networkStatus) {
      localStorage.setItem("storeData", JSON.stringify(formData));
      const res = JSON.parse(localStorage.getItem("storeData"));
      setStores([...stores, res]);
      setStoreDetails({
        store_name: res.store_name,
        store_id: res._id,
      });
      setFormData({ image: "", store_name: "" });
      toast.success("Store added successfully", { autoClose: 1500 });
      setWantAddItem(true);
      return;
    }
    const formDataWithImage = new FormData();
    formDataWithImage.append("store_name", formData.store_name);
    formDataWithImage.append("image", formData.image);
    await addStore(formDataWithImage)
      .then((res) => {
        setStores([...stores, res.data]);
        setStoreDetails({
          store_name: res.data.store_name,
          store_id: res.data._id,
        });
        setFormData({ image: "", store_name: "" });
        toast.success("Store added successfully", { autoClose: 1500 });
        setWantAddItem(true);
      })
      .catch((err) => console.log(err));
    // setOpen(false);
  };

  useEffect(() => {
    setNetworkStatus(navigator.onLine);
    if (!networkStatus) {
      const res = JSON.parse(localStorage.getItem("storeData"));
      if (res) {
        setStores(res);
      }
    }
    getAllStores()
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => toast.error(err.response.data.message));
  }, []);

  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = stores.slice(indexOfFirstStore, indexOfLastStore);

  const handleDeleteStore = (_id) => {
    deleteStore(_id)
      .then(() => {
        setStores(stores.filter((store) => store._id !== _id));
        console.log(currentStores.length);
        if (currentStores.length === 1) {
          setCurrentPage(currentPage - 1);
        }
        toast.success("Store deleted successfully", { autoClose: 1500 });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="section-dashboard flex flex-col justify-center items-center my-5">
      <h1 className="font-mono section-dashboard__heading mb-10 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-5xl">
        You have{" "}
        <span className="section-dashboard__heading__child text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          {stores.length}
        </span>{" "}
        stores
      </h1>
      <div className="section-dashboard__content max-[1024px]:w-auto">
        <div className="flex flex-wrap items-center max-[1024px]:justify-center max-[1024px]:flex-wrap">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="py-3">
                  Name
                </th>
                <th scope="col" className="py-3">
                  Total Items
                </th>
                <th scope="col" className="py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStores.map((store) => {
                return (
                  <tr
                    onClick={(e) => {
                      if (
                        !e.target.classList.contains("delete-store-btn") &&
                        !e.target.parentElement.classList.contains(
                          "delete-store-btn"
                        ) &&
                        !e.target.parentElement.parentElement.classList.contains(
                          "delete-store-btn"
                        )
                      ) {
                        // Navigate to the barcode page
                        navigate(`/store/${store._id}`);
                      }
                    }}
                    key={store._id}
                    className="bg-white cursor-pointer hover:bg-gray-50"
                  >
                    <th
                      scope="row"
                      className="flex items-center py-4 text-gray-900 whitespace-nowrap"
                    >
                      <img
                        className="w-12 h-12 rounded-full"
                        src={
                          store?.image?.originalname
                            ? `${BACKEND_URL}/uploads/${store?.image?.originalname}`
                            : dummyStore
                        }
                        alt="store img"
                      />
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {store?.store_name}
                        </div>
                      </div>
                    </th>
                    <td className="py-4">
                      {store?.products?.length ? store?.products?.length : 0}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDeleteStore(store._id)}
                        className="delete-store-btn flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4">
            <div className="flex">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-4 h-10 me-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <svg
                  className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5H1m0 0 4 4M1 5l4-4"
                  />
                </svg>
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastStore >= stores.length}
                className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Next
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
              <button
                onClick={() => setOpen(true)}
                className="ml-3 flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-green-500 rounded-lg hover:bg-green-400"
              >
                Add Store
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add store modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
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
                      {wantAddItem ? "Add Items" : "Add Store"}
                    </Dialog.Title>
                    {wantAddItem ? (
                      <div className="mt-5">
                        <p className="text-red-600">
                          Do you want to add items to this store?
                        </p>
                      </div>
                    ) : (
                      <form
                        className="max-w-md mx-auto"
                        onSubmit={handleSubmit}
                      >
                        <div className="relative z-0 w-full mb-5 group">
                          <input
                            type="text"
                            name="store_name"
                            id="store_name"
                            className="block py-2.5 px-0 w-full text-sm text-gray-500  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=""
                            value={formData.store_name}
                            onChange={handleInputChange}
                            required
                          />
                          <label
                            htmlFor="store_name"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Store Name
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                          <input
                            type="file"
                            name="image"
                            id="image"
                            className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent appearance-none focus:outline-none focus:ring-0 peer"
                            onChange={(e) => handleImageChange(e)}
                          />
                          <label
                            htmlFor="image"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Image
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
                          className="text-gray-900 bg-white hover:bg-gray-50 ms-2 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center border border-gray-300"
                          onClick={() => setOpen(false)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                    {wantAddItem ? (
                      <div className="flex justify-center items-center my-5">
                        <button
                          onClick={() =>
                            navigate("/barcode", { state: { storeDetails } })
                          }
                          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        >
                          Proceed to Add Item
                        </button>
                        <button
                          type="button"
                          className="text-gray-900 bg-white hover:bg-gray-50 ms-2 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center border border-gray-300"
                          onClick={() => {
                            setOpen(false);
                            setWantAddItem(false);
                          }}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Index;
