import React, { useEffect, useState ,useCallback} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Nabar';
import Signup from './Signup';
import AddDataComp from './AddDataComp';
import debounce from 'lodash.debounce'
const AdminControl = () => {
    const [value, setValue] = useState([]);
    const [run, setRun] = useState(true);
    const [check, setCheck] = useState(true)
    const [email, setEmail] = useState('');
    const [fullname, setFullName] = useState('')
    const [passsword, setPassword] = useState('');
    const [edit, setEdit] = useState(true);
    const [idCheck, setIdCheck] = useState('');
    const [addData, setAddData] = useState(false);
    const [value1, setValue1] = useState({})
    const [drop, setDrop] = useState({ "category": "Actor" });
    const [filter, setFilter] = useState();
    const [fitlerDrop, setFilterDrop] = useState();
    const [status, setStatus] = useState();
    const [editupdate, setEditUpdate] = useState(false);
    const [categoryid, setCategoryId] = useState("");
    const [emailError, setEmailError] = useState("")
    const [fullnameError, setFullNameError] = useState("")
    const [categoryError, setCategoryError] = useState("")
    const [search, setSerach] = useState();
    const [controlSerach,setControlSearch]=useState()
    const location = useLocation();
    console.log("This is the value from the admin Control page", location)
    useEffect(() => {
        const token = sessionStorage.getItem('auth-token');
        console.log("Value of filter", filter)
        axios.get(`https://assignment-vrv.vercel.app/filter/${filter}`, token && {
            headers: {
                "auth-token":
                    token
            },
        })
            .then(result => {
                console.log("Result after submit", result)
                setValue(result.data)
            })
    }, [filter])

    useEffect(() => {
        const token = sessionStorage.getItem('auth-token');

        axios.get('https://assignment-vrv.vercel.app/', token && {
            headers: {
                "auth-token":
                    token
            },
        })
            .then(result => {
                setValue(() => setValue(result.data));
                console.log("Result", result)
            }).catch(err => {
                console.log(err)
            })

    }, [run, check, status, editupdate])
    const showAllData = () => {
        console.log("All Data")
        const token = sessionStorage.getItem('auth-token');

        axios.get('https://assignment-vrv.vercel.app/', token && {
            headers: {
                "auth-token":
                    token
            },
        })
            .then(result => {
                setValue(() => setValue(result.data));
                console.log("Result", result)
            }).catch(err => {
                console.log(err)
            })

    }
    useEffect(async () => {
        try {
            console.log("hello sign")
            const dropval = await axios.get('https://assignment-vrv.vercel.app/dropdownvalue')
            const storeddrop = dropval.data
            setDrop(storeddrop)
            setFilterDrop(storeddrop)
            console.log("The Value of drop", drop)
        } catch (er) {
            console.log(er)
        }
    }, [])
    const deleteValue = async (id) => {

        try {
            axios.patch(`https://assignment-vrv.vercel.app/deactive/${id}`)
                .then(result => {
                    if (result.status === 200) {
                        setStatus(false)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }
    const activeValue = async (id) => {

        try {
            axios.patch(`https://assignment-vrv.vercel.app/active/${id}`)
                .then(result => {
                    if (result.status === 200) {
                        setStatus(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }
    const Edit = (id, email) => {
        console.log("Let's set", id)
        setEmail(() => setEmail(email))
        setIdCheck(() => setIdCheck(id));
        setEdit((prev) => !prev)
    }
    const upDate = async (id) => {
        setEmailError("");
        // setPasswordError("");
        setFullNameError("");
        setCategoryError("")
        try {
            console.log("Working..")
            const token = sessionStorage.getItem('auth-token');
            const port = 'https://assignment-vrv.vercel.app/user-details';
            const res = await axios.patch(`${port}/${id}`, { "email": email, "fullname": fullname, "category": categoryid }, token && {
                headers: {
                    "auth-token":
                        token
                },
            });
            setEmail("")
            setFullName("")
            setCheck((prev) => !prev)
            setEdit((prev) => !prev)
            setEditUpdate(!editupdate)
            setEmailError("");
            setFullNameError("");
            setCategoryError("")
            const data1 = await res;
            console.log("Admin Control thing....!!", data1)
            setIdCheck('')
        } catch (err) {
            console.log("Duplicate update Error", { err });
            if (err.response.data.err.hasOwnProperty("path")) {
                setCategoryError("Select Category");
            } else {
                if (err.response.data.err.hasOwnProperty("code") && err.response.data.err.code === 11000) {
                    setEmailError("Email is already Registered")
                } else {

                    if (err.response.data.err.errors.hasOwnProperty("fullname")) {

                        setFullNameError(err.response.data.err.errors.fullname.message)
                    }
                    if (err.response.data.err.errors.hasOwnProperty("email")) {

                        setEmailError(err.response.data.err.errors.email.message)
                    }
                    // if (err.response.data.err.errors.hasOwnProperty("password")) {

                    //     setPasswordError(err.response.data.err.errors.password.message)
                    // }
                }
            }
        }
    }

    const newData = () => {
        setAddData(!addData)
    }


    useEffect(() => {
        const token = sessionStorage.getItem("auth-token")
        axios.post(`https://assignment-vrv.vercel.app/${search}`, token && {
            headers: {
                "auth-token":
                    token
            },
        }).then(result => {
            setValue(() => setValue(result.data));
            console.log("Result", result)
        }).catch(err => {
            console.log({ err })
            axios.get('https://assignment-vrv.vercel.app/', token && {
                headers: {
                    "auth-token":
                        token
                },
            })
                .then(result => {
                    setValue(() => setValue(result.data));
                    console.log("Result", result)
                }).catch(err => {
                    console.log(err)
                })
        })
        console.log("search value in ", search)
    }, [controlSerach])
    const debounceSave = useCallback(debounce((nextValue) => setControlSearch(nextValue), 1000), [])
    
    const serachFun = (e) => {
        e.preventDefault();
        
    }
    const handleSearch=(text)=>{
        setSerach(text)
        debounceSave(text)
    }
    // return (
    //     <>
    //         <Navbar />
    //         <>
    //             <center><h1>Admin Dashboard</h1></center>
    //             <center><button onClick={newData} className="m-2 p-2 btn btn-warning">{addData ? 'Hide' : 'Add New Data'}</button></center>
    //             <center>
    //                 <form onSubmit={serachFun}>
    //                     <input type="text"
    //                         placeholder="Enter name to Search.."
    //                         name="search"
    //                         value={search}
    //                         onChange={(e) => {
    //                             handleSearch(e.target.value)}}
    //                     />
    //                     <input type="submit" />
    //                 </form>
    //             </center>
    //             {addData ? <AddDataComp heading="Add New Data" button="Add" /> : null}
    //             <center> <button onClick={showAllData} className="btn btn-danger m-2 p-2">All Data</button></center>
    //             <select
    //                 className="dropdown mt-2 container-fluid p-2 bg-primary d-flex m-auto w-50"
    //                 onChange={(e) => setFilter(e.target.value)} name="category">
    //                 {fitlerDrop && fitlerDrop.map((val, index) => {
    //                     return (
    //                         <option value={val._id} className="bg-white">{val.category}</option>)
    //                 })}
    //             </select>
    //             {value && value.map((val, index) => {
    //                 return (
    //                     <>
    //                         {val.role === 0 ? <div key={index}>
    //                             {edit ? <>
    //                                 <center ><span>Name:</span><p className={val.active ? 'text-danger' : 'line'}>{val.fullname}</p></center>
    //                                 <center><span>Email :</span><p className={val.active ? 'text-danger' : 'line'}>{val.email}</p></center>
    //                                 <center><span>Category :</span><p className={val.active ? 'text-danger' : 'line'}>{val.category.category}</p></center>
    //                             </> : <>{idCheck === val._id ?
    //                                 <>
    //                                     <center><label>Email id:</label></center>
    //                                     <input defaultValue={val.email} value={email} onChange={(e) => {
    //                                         setEmail(e.target.value)
    //                                         console.log(e.target.value)
    //                                     }}
    //                                         className="form-width form-control"
    //                                     />
    //                                     <center><div class="text-danger">{emailError}</div></center>

    //                                     <center><label>Full Name:</label></center>

    //                                     <input defaultValue={val.fullname} value={fullname} onChange={(e) => {
    //                                         setFullName(e.target.value)
    //                                         console.log(e.target.value)
    //                                     }}
    //                                         className="form-width form-control"
    //                                         required
    //                                     />
    //                                     <center><div class="text-danger">{fullnameError}</div></center>

    //                                     <br />
    //                                     <select
    //                                         className="dropdown mt-2 container-fluid p-2 bg-primary d-flex m-auto w-50"
    //                                         onChange={(e) => setCategoryId(e.target.value)} name="category">
    //                                         {fitlerDrop && fitlerDrop.map((val, index) => {
    //                                             return (
    //                                                 <option value={val._id} className="bg-white">{val.category}</option>)
    //                                         })}
    //                                     </select>
    //                                     <center><div class="text-danger">{categoryError}</div></center>

    //                                 </> : <>

    //                                     <center><p>{val.fullname}</p></center>
    //                                     <center><p>{val.email}</p></center>

    //                                 </>}</>}
    //                             <center>
    //                                 {val.active ? <button onClick={() => deleteValue(val._id)} className="btn btn-primary mt-2 mr-2">Deactivate User</button>
    //                                     : <button onClick={() => activeValue(val._id)} className="btn btn-primary mt-2 mr-2">Activate User</button>}


    //                                 {edit ? <button onClick={() => Edit(val._id, val.email)} className="btn btn-primary mt-2" disabled={val.active ?
    //                                     false : true}>Edit</button> : <>{idCheck === val._id
    //                                         ? <button onClick={() => upDate(val._id)} className="btn btn-primary mt-2 " disabled={val.active
    //                                             ? false : true}>upDate</button> : <button onClick={() => Edit(val._id)} disabled={val.active
    //                                                 ? false : true} className="btn btn-primary mt-2">Edit</button>} </>}
    //                             </center>
    //                         </div> : ''
    //                         }
    //                     </>
    //                 )
    //             })}
    //         </>
    //     </>
    // )
    return (
        <>
          <Navbar />
          <center>
            <h1>Admin Dashboard</h1>
          </center>
          <center>
            <button onClick={newData} className="m-2 p-2 btn btn-warning">
              {addData ? 'Hide' : 'Add New Data'}
            </button>
          </center>
          <center>
            <form onSubmit={serachFun}>
              <input
                type="text"
                placeholder="Enter name to Search.."
                name="search"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="form-control w-50"
              />
              {/* <input type="submit" className="btn btn-primary" /> */}
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
            name="category"
          >
            {fitlerDrop &&
              fitlerDrop.map((val, index) => (
                <option key={index} value={val._id} className="bg-white">
                  {val.category}
                </option>
              ))}
          </select>
      
          <div className="row p-3">
            {value &&
              value.map((val, index) => (
                <div key={index} className="col-md-4 mb-3">
                  {val.role === 0 && (
                    <div className="card p-3 shadow-sm" style={{ borderRadius: '10px' }}>
                      <center>
                        <h5 className="card-title">{val.fullname}</h5>
                        <p className="card-text">Email: {val.email}</p>
                        <p className="card-text">Category: {val.category.category}</p>
                      </center>
      
                      <div className="text-center">
                        {val.active ? (
                          <button
                            onClick={() => deleteValue(val._id)}
                            className="btn btn-danger m-2"
                          >
                            Deactivate User
                          </button>
                        ) : (
                          <button
                            onClick={() => activeValue(val._id)}
                            className="btn btn-success m-2"
                          >
                            Activate User
                          </button>
                        )}
      
                        {edit ? (
                          <button
                            onClick={() => Edit(val._id, val.email)}
                            className="btn btn-warning m-2"
                            disabled={!val.active}
                          >
                            Edit
                          </button>
                        ) : (
                          <>
                            {idCheck === val._id ? (
                              <button
                                onClick={() => upDate(val._id)}
                                className="btn btn-primary m-2"
                                disabled={!val.active}
                              >
                                Update
                              </button>
                            ) : (
                              <button
                                onClick={() => Edit(val._id)}
                                disabled={!val.active}
                                className="btn btn-primary m-2"
                              >
                                Edit
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      );
      
      
    
    // Supporting Components
    const UserDetail = ({ label, value, active }) => (
        <center>
            <span>{label}:</span>
            <p className={active ? 'text-danger' : 'line'}>{value}</p>
        </center>
    );
    
    const EditForm = ({ email, fullname, category, setEmail, setFullName, setCategoryId, emailError, fullnameError, categoryError, fitlerDrop }) => (
        <div>
            <center>
                <label>Email id:</label>
                <input
                    defaultValue={email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                />
                <div className="text-danger">{emailError}</div>
    
                <label>Full Name:</label>
                <input
                    defaultValue={fullname}
                    value={fullname}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-control"
                    required
                />
                <div className="text-danger">{fullnameError}</div>
    
                <select
                    className="dropdown form-control mt-2"
                    onChange={(e) => setCategoryId(e.target.value)}
                    value={category}
                >
                    {fitlerDrop && fitlerDrop.map((val, index) => (
                        <option key={index} value={val._id}>
                            {val.category}
                        </option>
                    ))}
                </select>
                <div className="text-danger">{categoryError}</div>
            </center>
        </div>
    );
    
}
export default AdminControl;