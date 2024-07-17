import { useState } from "react";

function Dapp() {
  const [selectedFile, setSelectedFile] = useState("");
  const [cid, setCid] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [jsonFetched, setJsonFetched] = useState(null);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
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
      setCid(resData.IpfsHash);
      console.log(resData);

      // Construct the image URL and resolve it
      const gatewayUrl = `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${
        resData.IpfsHash
      }`;
      setImageUrl(gatewayUrl);

      // Fetch the JSON data from the resolved URL
      const dataResponse = await fetch(gatewayUrl);
      if (dataResponse.ok) {
        const jsonData = await dataResponse.json();
        setJsonFetched(jsonData);
      } else {
        console.error("Failed to fetch JSON data:", dataResponse.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <label className="form-label"> Choose File</label>
      <input type="file" onChange={changeHandler} />
      <button onClick={handleSubmission}>Submit</button>
      {cid && (
        <>
          <p>CID: {cid}</p>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="IPFS image"
              onError={(e) => {
                console.error("Image failed to load:", e);
              }}
            />
          ) : (
            <p>Loading image...</p>
          )}
          {jsonFetched && <pre>{JSON.stringify(jsonFetched, null, 2)}</pre>}
        </>
      )}
    </>
  );
}

export default Dapp;
