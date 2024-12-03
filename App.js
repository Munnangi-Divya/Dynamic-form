
import React, { useState, useEffect } from 'react';
import './App.css'

const App = () => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState('');
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);

  // Simulated API responses
  const apiResponses = {
    userInformation: {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    addressInformation: {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        { name: "state", type: "dropdown", label: "State", options: ["California", "Texas", "New York"], required: true },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    paymentInformation: {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  // Fetch form fields based on selection
  useEffect(() => {
    if (formType) {
      setFormFields(apiResponses[formType]?.fields || []);
      setFormData({});
      setErrors({});
      setProgress(0);
    }
  }, [formType]);

  // Handle field value changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `* ${field.label} is required *`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (error) => {
    error.preventDefault();
    if (validateForm()) {
      setSubmittedData((prev) => [...prev, formData]);
      alert("Form submitted successfully!");
      setFormData({});
      setProgress(0);
    }
  };

  // Update progress
  useEffect(() => {
    const requiredFields = formFields.filter((field) => field.required);
    const completedFields = requiredFields.filter((field) => formData[field.name]);
    setProgress((completedFields.length / requiredFields.length) * 100 || 0);
  }, [formData, formFields]);

  // Handle editing data
  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle deleting data
  const handleDelete = (index) => {
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
    alert("Entry deleted successfully.");
  };

  return (
    <div className="main-container">
      <h1 className="heading">Dynamic Form</h1>

      {/* Form Type Selector */}
      <label htmlFor="formType">Select Form Type:  </label>
      <select className="selection-type"
        id="formType"
        value={formType}
        onChange={(error) => setFormType(error.target.value)}
      >
        <option value="">- Select -</option>
        <option value="userInformation">User Information</option>
        <option value="addressInformation">Address Information</option>
        <option value="paymentInformation">Payment Information</option>
      </select>

     { /* Dynamic Form */}
      {formType && (
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "dropdown" ? (
                <select className="container1"
                  id={field.name}
                  value={formData [field.name] || ""}
                  onChange={(error) => handleChange(field.name, error.target.value)}
                >
                  <option value="">- Select -</option>
                  {field.options.map((option) => (
                    <option classNme="option" key={option}  value={option}>
                       {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input className="input"
                  placeholder="Enter"
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(error) => handleChange(field.name, error.target.value)}
                />
              )}
              {errors[field.name] && (
                <span className="error">{errors[field.name]}</span>
              )}
            </div>
          ))}
          <button className="sub" type="submit">Submit</button>
        </form>
      )}

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Submitted Data Table */}
      {submittedData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(submittedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {Object.values(data).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
