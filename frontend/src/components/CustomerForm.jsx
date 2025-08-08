import { useState } from "react";
import axios from "axios";

export default function CustomerForm() {
  const [form, setForm] = useState({
    SEARCHNAME: "",
    NAME: "",
    TITLE: "",
    IS_COMPANY: 0,
    FIRSTNAME: "",
    COMPANY_ID: 0,
    CLASSIFICATION: "",
    STREET1: "",
    STREET2: "",
    STREET3: "",
    POSTALCODE: "",
    CITY: "",
    PHONE: "",
    EMAIL: "",
    SALUTATION: "",
    CONTACT: ""
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://backend:5000/api/customers", form);
      setStatus("Kunde erfolgreich gespeichert.");
    } catch (error) {
      console.error(error);
      setStatus("Fehler beim Speichern.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Kunde erfassen</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="col-span-1">
            <label className="block text-sm font-medium mb-1" htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type={typeof value === "number" ? "number" : "text"}
              value={value}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        ))}
        <div className="col-span-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Speichern</button>
        </div>
        {status && <p className="col-span-2 mt-4 text-sm">{status}</p>}
      </form>
    </div>
  );
}