import { useState } from "react";

const Form = function () {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [jsonDisplay, setJsonDisplay] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData, null, 2);
    setJsonDisplay(JSON.parse(jsonData));
    //downloadJSON(jsonData);
  };

  const downloadJSON = (jsonData) => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formData.json";
    a.click();
    URL.revokeObjectURL(url);
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
      {jsonDisplay && (
        <div>
          <h2>JSON data: </h2>
          <pre>{jsonDisplay.message}</pre>
        </div>
      )}
    </div>
  );
};

export default Form;
