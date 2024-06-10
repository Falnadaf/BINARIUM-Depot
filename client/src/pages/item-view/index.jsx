import "./style.css";
import { useEffect, useRef, useState, Fragment } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getProductByIdOrBarcode,
  deleteProductById,
  updateProductById,
} from "../../api/product";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { BACKEND_URL } from "../../config";
import { toast } from "react-toastify";

const Index = () => {
  const [productDetail, setProductDetail] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    manufacturing_year: "",
    generation: "",
    store: "",
    condition: "working", // Default to working
    images: [],
  });
  const { state } = useLocation();
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();
  const { itemId } = useParams();
  useEffect(() => {
    state?.productDetails
      ? setProductDetail(state?.productDetails)
      : getProductByIdOrBarcode(itemId || state?.uniqueBarcodeValue)
          .then((res) => setProductDetail(res.data))
          .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: [...prevData[name], ...files],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataWithImages = new FormData();
    console.log(formData);
    // Iterate over formData and append each key-value pair to formDataWithImages
    for (const [key, value] of Object.entries(formData)) {
      if (key === "images") {
        // Append each image to the "images" key
        value.forEach((image) => {
          formDataWithImages.append("images", image);
        });
      } else {
        formDataWithImages.append(key, value);
      }
    }

    // Convert FormData to an object for easy printing
    updateProductById(productDetail._id, formDataWithImages)
      .then((res) => {
        setProductDetail(res.data);
        toast.success("Item Updated Successfully", { autoClose: 1500 });
      })
      .catch((err) => toast.error(err.message, { autoClose: 1500 }));

    setOpen(false);
  };

  return (
    <section className="py-11 text-black">
      <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 md:w-1/2 ">
            <div className="top-0 z-50 overflow-hidden ">
              <div className="relative mb-6 lg:mb-10 lg:h-2/4 ">
                <img
                  src={`${BACKEND_URL}/uploads/${productDetail?.images[0]?.originalname}`}
                  alt="item img"
                  className="object-cover w-full lg:h-full"
                />
              </div>
              <div className="flex-wrap hidden md:flex ">
                {productDetail?.images.length &&
                  productDetail.images.map((image, index) => (
                    <div key={index} className="w-1/2 p-2 sm:w-1/4">
                      <a
                        href="/"
                        className="block border border-blue-300 dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300"
                      >
                        <img
                          src={`${BACKEND_URL}/uploads/${image.originalname}`}
                          alt="item img"
                          className="object-cover w-full lg:h-25"
                        />
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 ">
            <div className="lg:pl-20">
              <div className="mb-8 ">
                <span className="text-lg font-medium text-rose-500 ">
                  {productDetail?.condition === "true"
                    ? "Working"
                    : "Defective"}
                </span>
                <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold md:text-4xl">
                  {productDetail?.name}
                </h2>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <tbody>
                    <tr className="bg-white cursor-pointer hover:bg-gray-50">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Manufacturer
                      </th>
                      <td className="px-6 py-4">
                        {productDetail?.manufacturer}
                      </td>
                    </tr>
                    <tr className="bg-white cursor-pointer hover:bg-gray-50">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Year of Manufacturing
                      </th>
                      <td className="px-6 py-4">
                        {productDetail?.manufacturing_year}
                      </td>
                    </tr>
                    <tr className="bg-white cursor-pointer hover:bg-gray-50">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        generation
                      </th>
                      <td className="px-6 py-4">{productDetail?.generation}</td>
                    </tr>
                    <tr className="bg-white cursor-pointer hover:bg-gray-50">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Store
                      </th>
                      <td className="px-6 py-4">
                        {productDetail?.store?.store_name}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center -mx-4 ">
                <div className="w-full px-4 mb-4 lg:w-1/2 lg:mb-0">
                  <button
                    onClick={() => setOpen(true)}
                    className="flex items-center justify-center w-full p-4 text-blue-500 border border-blue-500 rounded-md  00 hover:bg-blue-600 hover:border-blue-600 hover:text-gray-100 dark-blue-700 ay-300"
                  >
                    Update
                  </button>
                </div>
                <div className="w-full px-4 mb-4 lg:mb-0 lg:w-1/2">
                  <button
                    onClick={() => {
                      deleteProductById(productDetail._id)
                        .then((res) => {
                          console.log(res);
                          navigate("/collection");
                        })
                        .catch((err) => console.log(err));
                    }}
                    className="flex items-center justify-center w-full p-4 text-red-500 border border-red-500 rounded-md  00 hover:bg-red-600 hover:border-red-600 hover:text-gray-100 dark-red-700 ay-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                      Update Item
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
                        />
                        <label
                          htmlFor="name"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Item Name
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="manufacturer"
                          id="manufacturer"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={formData.manufacturer}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="manufacturer"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Manufacturer
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="manufacturing_year"
                          id="manufacturing_year"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={formData.manufacturing_year}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="manufacturing_year"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            value={formData.generation}
                            onChange={handleInputChange}
                          />
                          <label
                            htmlFor="generation"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Generation
                          </label>
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
                        />
                        <label
                          htmlFor="images"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Images
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </section>
  );
};

export default Index;
