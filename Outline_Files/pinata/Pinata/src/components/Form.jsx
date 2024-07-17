import { useState } from "react";

const Form = function () {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [jsonDisplay, setJsonDisplay] = useState("");
  const [data, setData] = useState("");
  const [jsonCid, setJsonCid] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const downloadJSON = async (jsonData) => {
    try {
      const blob = new Blob([jsonData], { type: "application/json" });
      const formData = new FormData();
      formData.append("file", blob, "formData.json");

      const metadata = JSON.stringify({
        name: "JSON Metadata",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const resData = await res.json();
      setJsonCid(resData.IpfsHash);
      console.log("JSON CID:", resData.IpfsHash);
    } catch (error) {
      console.log("Error uploading JSON to IPFS:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData, null, 2);
    // setJsonDisplay(JSON.parse(jsonData));
    await downloadJSON(jsonData);
    fetchJSON(jsonCid);
  };

  const fetchJSON = async function (jsonCid) {
    const gatewayUrl = `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${jsonCid}`;
    const dataResponse = await fetch(gatewayUrl);
    if (dataResponse.ok) {
      const jsonData = await dataResponse.json();
      setData(jsonData);
    } else {
      console.error("Failed to fetch JSON data:", dataResponse.statusText);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {data && (
        <>
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default Form;
