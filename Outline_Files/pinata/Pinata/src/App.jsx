import { useState } from "react";
import { Form, ConnectWallet, MyForm } from "./components";
import Dapp from "./Dapp.jsx";

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  const getAddress = function (value) {
    console.log("yo" + value);
    setWalletAddress(value);
  };

  return (
    <>
      <h1>{walletAddress && <>Wallet Address: {walletAddress}</>}</h1>
      <h1>Fetching</h1>
      <Dapp />
      <h1>Connect Wallet section</h1>
      <ConnectWallet onValueChange={getAddress} />

      <h1>Form section</h1>
      <Form />
      <h1>Docs Section</h1>
      <MyForm />
    </>
  );
}

export default App;
