import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from './Nabar';
import AddDataComp from './AddDataComp';
import debounce from 'lodash.debounce';

const AdminControl = () => {
  const [value, setValue] = useState([]);
  const [run, setRun] = useState(true);
  const [check, setCheck] = useState(true);
  const [email, setEmail] = useState('');
  const [fullname, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [edit, setEdit] = useState(true);
  const [idCheck, setIdCheck] = useState('');
  const [addData, setAddData] = useState(false);
  const [drop, setDrop] = useState([]);
  const [filter, setFilter] = useState('');
  const [fitlerDrop, setFilterDrop] = useState([]);
  const [status, setStatus] = useState();
  const [editUpdate, setEditUpdate] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fullnameError, setFullNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [search, setSearch] = useState('');
  const [controlSearch, setControlSearch] = useState('');

  const debounceSave = useCallback(
    debounce((nextValue) => setControlSearch(nextValue), 1000),
    []
  );

  useEffect(() => {
    const token = sessionStorage.getItem('auth-token');
    axios
      .get(`https://assignment-vrv.vercel.app/api/filter/${filter}`, {
        headers: {
          'auth-token': token || '',
        },
      })
      .then((result) => {
        setValue(result.data);
      });
  }, [filter]);

  useEffect(() => {
    const token = sessionStorage.getItem('auth-token');
    axios
      .get('https://assignment-vrv.vercel.app/api/', {
        headers: {
          'auth-token': token || '',
        },
      })
      .then((result) => {
        setValue(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [run, check, status, editUpdate]);

  const showAllData = () => {
    const token = sessionStorage.getItem('auth-token');
    axios
      .get('https://assignment-vrv.vercel.app/api/', {
        headers: {
          'auth-token': token || '',
        },
      })
      .then((result) => {
        setValue(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get('https://assignment-vrv.vercel.app/api/dropdownvalue')
      .then((dropval) => {
        setDrop(dropval.data);
        setFilterDrop(dropval.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteValue = async (id) => {
    try {
      axios.patch(`https://assignment-vrv.vercel.app/api/deactive/${id}`).then((result) => {
        if (result.status === 200) {
          setStatus(false);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const activeValue = async (id) => {
    try {
      axios.patch(`https://assignment-vrv.vercel.app/api/active/${id}`).then((result) => {
        if (result.status === 200) {
          setStatus(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const Edit = (id, email, fullname, category) => {
    setEmail(email);
    setFullName(fullname);
    setCategoryId(category._id);
    setIdCheck(id);
    setEdit(false);
  };

  const upDate = async (id) => {
    setEmailError('');
    setFullNameError('');
    setCategoryError('');
    try {
      const token = sessionStorage.getItem('auth-token');
      const port = 'https://assignment-vrv.vercel.app/api/user-details';
      const res = await axios.patch(
        `${port}/${id}`,
        { email, fullname, category: categoryId },
        {
          headers: {
            'auth-token': token || '',
          },
        }
      );
      setEmail('');
      setFullName('');
      setCategoryId('');
      setCheck(!check);
      setEdit(true);
      setEditUpdate(!editUpdate);
      setIdCheck('');
    } catch (err) {
      console.log(err);
      if (err.response?.data?.err?.code === 11000) {
        setEmailError('Email is already Registered');
      } else {
        const errors = err.response?.data?.err?.errors;
        if (errors?.fullname) setFullNameError(errors.fullname.message);
        if (errors?.email) setEmailError(errors.email.message);
        if (errors?.category) setCategoryError('Select a valid category');
      }
    }
  };

  const newData = () => {
    setAddData(!addData);
  };

  const handleSearch = (text) => {
    setSearch(text);
    debounceSave(text);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <center>
          <h1>Admin Dashboard</h1>
          <button onClick={newData} className="m-2 p-2 btn btn-warning">
            {addData ? 'Hide' : 'Add New Data'}
          </button>
        </center>

        <center>
          <form onSubmit={(e) => e.preventDefault()} className="mb-3">
            <input
              type="text"
              placeholder="Enter name to Search.."
              name="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="form-control w-50"
            />
          </form>
        </center>

        {addData && <AddDataComp heading="Add New Data" button="Add" />}

        <center>
          <button onClick={showAllData} className="btn btn-danger m-2 p-2">
            All Data
          </button>
        </center>

        <select
          className="dropdown mt-2 container-fluid p-2 bg-primary d-flex m-auto w-50"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="" disabled selected>
            Select a category
          </option>
          {fitlerDrop.map((val, index) => (
            <option key={index} value={val._id}>
              {val.category}
            </option>
          ))}
        </select>

        <div className="row p-3">
          {value.map((val, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm" style={{ borderRadius: '10px' }}>
                {idCheck === val._id && !edit ? (
                  <>
                    <label>Email ID:</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control mb-2"
                    />
                    <div className="text-danger">{emailError}</div>

                    <label>Full Name:</label>
                    <input
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-control mb-2"
                    />
                    <div className="text-danger">{fullnameError}</div>

                    <select
                      className="form-control mb-2"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {fitlerDrop.map((opt, idx) => (
                        <option key={idx} value={opt._id}>
                          {opt.category}
                        </option>
                      ))}
                    </select>
                    <div className="text-danger">{categoryError}</div>
                  </>
                ) : (
                  <>
                    <p>{val.fullname}</p>
                    <p>{val.email}</p>
                    <p>Category: {val.category.category}</p>
                  </>
                )}

                <div className="text-center">
                  {val.active ? (
                    <button onClick={() => deleteValue(val._id)} className="btn btn-danger m-2">
                      Deactivate User
                    </button>
                  ) : (
                    <button onClick={() => activeValue(val._id)} className="btn btn-success m-2">
                      Activate User
                    </button>
                  )}

                  {edit ? (
                    <button
                      onClick={() =>
                        Edit(val._id, val.email, val.fullname, val.category)
                      }
                      className="btn btn-warning m-2"
                      disabled={!val.active}
                    >
                      Edit
                    </button>
                  ) : idCheck === val._id ? (
                    <button onClick={() => upDate(val._id)} className="btn btn-primary m-2">
                      Update
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminControl;
