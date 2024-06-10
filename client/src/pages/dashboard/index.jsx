import "./style.css";
import store from "../../assets/images/store.png";
import collection from "../../assets/images/collection.png";
import report from "../../assets/images/report.png";
import barcode from "../../assets/images/barcode.png";
import addItem from "../../assets/images/add-item.png";
import { Link } from "react-router-dom";

const dashboardContent = [
  {
    icon: store,
    title: "Store",
    path: "/store",
  },
  {
    icon: collection,
    title: "Collection",
    path: "/collection",
  },
  {
    icon: report,
    title: "Report",
    path: "/report",
  },
  {
    icon: addItem,
    title: "Add Item",
    path: "/barcode",
  },
  {
    icon: barcode,
    title: "Read Barcode",
    path: "/read-barcode",
  },
];

const Index = () => {
  return (
    <div className="section-dashboard flex flex-col justify-center items-center">
  
      <div className="section-dashboard__content">
        <div className="flex items-center max-[1024px]:justify-center max-[1024px]:flex-wrap">
          {dashboardContent.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="bg-sky-100 p-5 mx-10 transform rounded-xl shadow-xl transition duration-300 hover:scale-105 flex flex-col items-center max-[486px]:mb-5"
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
            </Link>
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
