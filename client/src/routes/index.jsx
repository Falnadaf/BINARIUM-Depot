import { Routes, Route } from "react-router-dom";
import AppHeader from "../layout/app-header";
import AppFooter from "../layout/app-footer";
import Dashboard from "../pages/dashboard";
import Store from "../pages/store";
import ItemsList from "../pages/items-list";
import ItemView from "../pages/item-view";
import ReportView from "../pages/report-view";
import BarcodeView from "../pages/barcode-view";
import ReadItem from "../pages/read-item";
import ReadBarcode from "../pages/read-barcode";

const Index = () => {
  return (
    <div className="flex flex-col h-dvh justify-between">
      <AppHeader />
      <div className="py-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="store" element={<Store />} />
          <Route path="store/:storeId" element={<ItemsList />} />
          <Route path="store/:storeId/item/:itemId" element={<ItemView />} />
          <Route path="collection" element={<ItemsList />} />
          <Route path="collection/:itemId" element={<ItemView />} />
          <Route path="report" element={<ReportView />} />
          <Route path="barcode" element={<BarcodeView />} />
          <Route path="item" element={<ItemView />} />
          <Route path="read-barcode" element={<ReadBarcode />} />
          <Route path=":uniqueBarcodeValue" element={<ReadItem />} />
        </Routes>
      </div>
      <AppFooter />
    </div>
  );
};

export default Index;
