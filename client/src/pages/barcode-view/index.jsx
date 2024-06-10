import "./style.css";
import { Fragment, useRef, useState, useMemo } from "react";
import createBarcode from "../../assets/images/create-barcode.png";
import readBarcode from "../../assets/images/read-barcode.png";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import AddItemModal from "../add-item-modal";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode";
// import { HOST_URL } from "../../config";

const dashboardContent = [
  {
    icon: createBarcode,
    title: "New",
    barcodeType: "create",
  },
  {
    icon: readBarcode,
    title: "Read",
    barcodeType: "read",
  },
];

const Index = () => {
  const [barcodeType, setBarcodeType] = useState(null);
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();
  const cancelButtonRef = useRef(null);
  const uniqueBarcodeValue = useMemo(() => uuidv4().substring(0, 12), []);
  const handleSetBarcodeTypeClick = (barcodeType) => {
    setBarcodeType(barcodeType);
    setOpen(true);
    barcodeType === "create"
      ? toast.success("Barcode Created Successfully", { autoClose: 1500 })
      : null;
  };
  console.log(uniqueBarcodeValue);
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="section-dashboard flex flex-col justify-center items-center">
      <h1 className="font-mono section-dashboard__heading mb-10 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
        Create The Barcode
      </h1>
      <div className="section-dashboard__content">
        <div className="flex items-center max-[1024px]:justify-center max-[1024px]:flex-wrap">
          {dashboardContent.map((item, index) =>
            item.barcodeType === "read" && isItemAdded ? (
              <div
                onClick={() => handleSetBarcodeTypeClick(item.barcodeType)}
                key={index}
                className="bg-sky-100 p-5 mx-10 transform rounded-xl shadow-xl transition duration-300 hover:scale-105 flex flex-col items-center max-[486px]:mb-5 cursor-pointer"
              >
                <img
                  className="w-32 h-auto rounded-3xl p-4 border-4 border-gray-300"
                  src={item.icon}
                  alt="Card Image"
                />
                <div className="mt-5 flex items-center">
                  <h2 className="font-mono font-bold text-2xl uppercase">
                    {item.title}
                  </h2>
                </div>
              </div>
            ) : item.barcodeType === "create" ? (
              <div
                onClick={() => handleSetBarcodeTypeClick(item.barcodeType)}
                key={index}
                className="bg-sky-100 p-5 mx-10 transform rounded-xl shadow-xl transition duration-300 hover:scale-105 flex flex-col items-center max-[486px]:mb-5 cursor-pointer"
              >
                <img
                  className="w-32 h-auto rounded-3xl p-4 border-4 border-gray-300"
                  src={item.icon}
                  alt="Card Image"
                />
                <div className="mt-5 flex items-center">
                  <h2 className="font-mono font-bold text-2xl uppercase">
                    {item.title}
                  </h2>
                </div>
              </div>
            ) : null
          )}
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
                      {barcodeType === "create"
                        ? "Barcode Created"
                        : "Barcode Readed"}
                    </Dialog.Title>
                    {barcodeType === "create" ? (
                      <canvas
                        id="barcode-canvas"
                        ref={(canvasRef) => {
                          if (barcodeType === "create" && canvasRef) {
                            QRCode.toCanvas(
                              canvasRef,
                              `${uniqueBarcodeValue}`,
                              function (error) {
                                if (error) console.error(error);
                                console.log("QR Code generated successfully");
                              }
                            );
                          }
                        }}
                      ></canvas>
                    ) : (
                      <div className="mt-5">
                        <p className="text-red-600">
                          Barcode Value -{" "}
                          <span className="font-bold">
                            {uniqueBarcodeValue}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {barcodeType === "create" ? (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={() => {
                          setOpen(false);
                          setOpenAddItem(true);
                        }}
                        ref={cancelButtonRef}
                      >
                        Add Item
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={() =>
                          navigate(`/item`, {
                            state: { uniqueBarcodeValue },
                          })
                        }
                        ref={cancelButtonRef}
                      >
                        Show Item
                      </button>
                    )}
                    <button
                      type="button"
                      className="mt-3 ms-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-500 sm:mt-0 sm:w-auto"
                      onClick={handlePrint}
                      ref={cancelButtonRef}
                    >
                      Print
                    </button>
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
      {openAddItem && (
        <AddItemModal
          uniqueBarcodeValue={uniqueBarcodeValue}
          setOpenAddItem={setOpenAddItem}
          setIsItemAdded={setIsItemAdded}
          storeDetails={state?.storeDetails}
        />
      )}
    </div>
  );
};

export default Index;
