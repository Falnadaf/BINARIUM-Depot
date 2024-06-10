import "./style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findProduct } from "../../api/product";

const Index = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    findProduct(searchValue)
      .then((res) => {
        if (res.data) {
          navigate(`/item/${res.data._id}`, {
            state: { productDetails: res.data },
          });
        } else {
          console.log("Product not found");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <form
        onSubmit={handleOnSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="find_item"
          >
            Find Item
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="find_item"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search barcode or item name..."
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Find
          </button>
        </div>
      </form>
    </div>
  );
};

export default Index;
