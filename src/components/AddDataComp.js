import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const AddDataComp = ({ heading, button }) => {
  const [change, setChange] = useState(false);
  const [value, setValue] = useState({});
  const [drop, setDrop] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullnameError, setFullNameError] = useState("");

  const handleChange = (key, value) => {
    setValue((prev) => ({ ...prev, [key]: value }));
  };
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setEmailError("");
    setFullNameError("");
    console.log(value);

    try {
      const res = await axios.post(
        "https://assignment-vrv.vercel.app/api/signup/",
        value
      );
      if (res.status === 201) {
        setValue({ category: "Actor" });
        setChange(!change);
        history.push("/login");
        alert("Data Added Successfully");
      }
    } catch (err) {
      if (
        err.response?.data?.err?.hasOwnProperty("code") &&
        err.response.data.err.code === 11000
      ) {
        setEmailError("Email is already registered");
      } else {
        const errors = err.response?.data?.err?.errors || {};
        if (errors.fullname) setFullNameError(errors.fullname.message);
        if (errors.email) setEmailError(errors.email.message);
        if (errors.password) setPasswordError(errors.password.message);
      }
    }
  };

  useEffect(() => {
    const fetchDropdownValues = async () => {
      try {
        const dropval = await axios.get(
          "https://assignment-vrv.vercel.app/api/dropdownvalue"
        );
        setDrop(dropval.data);
      } catch (er) {
        console.error(er);
      }
    };
    fetchDropdownValues();
  }, [change]);

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
        <center>
          <h2 className="text-primary mb-4">{heading}</h2>
        </center>

        <div className="form-group">
          <label htmlFor="fullname" className="font-weight-bold">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            value={value.fullname || ""}
            onChange={(e) => handleChange("fullname", e.target.value)}
            className={`form-control ${fullnameError ? "is-invalid" : ""}`}
            placeholder="Enter full name"
          />
          {fullnameError && (
            <div className="invalid-feedback">{fullnameError}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="font-weight-bold">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={value.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`form-control ${emailError ? "is-invalid" : ""}`}
            placeholder="Enter email address"
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="font-weight-bold">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={value.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`form-control ${passwordError ? "is-invalid" : ""}`}
            placeholder="Enter password"
          />
          {passwordError && (
            <div className="invalid-feedback">{passwordError}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category" className="font-weight-bold">
            Category
          </label>
          <select
            name="category"
            className="form-control"
            value={value.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {drop.map((val, index) => (
              <option key={index} value={val._id}>
                {val.category}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <button className="btn btn-primary mt-3">{button}</button>
        </div>
      </form>
    </div>
  );
};

export default AddDataComp;
