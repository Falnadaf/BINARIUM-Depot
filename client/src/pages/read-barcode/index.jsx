// import { useState } from "react";
import Html5QrcodePlugin from "./read";
import { useNavigate } from "react-router-dom";
// import ResultContainerPlugin from "./result";

const Index = () => {
  const navigate = useNavigate();
  //   const [decodedResults, setDecodedResults] = useState([]);
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    // setDecodedResults((prev) => [...prev, decodedResult]);
    navigate(`/${decodedText}`);
  };

  return (
    <div>
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
      {/* <ResultContainerPlugin decodedResults={decodedResults} /> */}
    </div>
  );
};

export default Index;
