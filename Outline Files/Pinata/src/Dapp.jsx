import { useState } from "react";

function Dapp() {
  const [selectedFile, setSelectedFile] = useState("");
  const [cid, setCid] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      resolveImageUrl(gatewayUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const resolveImageUrl = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        setImageUrl(response.url);
      } else {
        console.error("Failed to resolve image URL:", response.statusText);
      }
    } catch (error) {
      console.error("Error resolving image URL:", error);
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
        </>
      )}
    </>
    // <>
    //   <label className="form-label"> Choose File</label>
    //   <input type="file" onChange={changeHandler} />
    //   <button onClick={handleSubmission}>Submit</button>
    //   {cid && (
    //     <img
    //       src={`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`}
    //       alt="ipfs image"
    //     />
    //   )}
    //   <img
    //     src="http://bafybeihedd76a4xevckrkjouepn3dntugasbfyxzdpny4islnwd7gkkg2u.ipfs.localhost:8080/"
    //     alt="cant't load"
    //     style={{ width: 100 }}
    //   />
    // </>
  );
}

export default Dapp;
