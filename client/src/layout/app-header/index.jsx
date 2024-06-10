import { Link } from "react-router-dom";
import "./style.css";
import { Disclosure } from "@headlessui/react";

const Index = () => {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-28 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <img
                className="h-20 w-auto"
                src="/logo.svg?color=indigo&shade=500"
                alt="Binarium"
              />
            </Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-4">
            <span className="text-7xl text-sky-200">Binarium</span>
            <span className="text-7xl text-cyan-300">Depot</span>
          </div>
        </div>
      
      </div>
    </Disclosure>
  );
};

export default Index;
