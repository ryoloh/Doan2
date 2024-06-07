import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io'
import { AiOutlineSetting } from 'react-icons/ai'
import { BiSolidUser } from 'react-icons/bi'
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { AiFillWarning } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice';

import { DatePicker } from 'antd';
import moment from 'moment'

const { RangePicker } = DatePicker

export default function Manage() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Sử dụng hook useNavigate để chuyển hướng
    const { currentUser, loading, error } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [amountUser, setAmountUser] = useState(0)
    const [usersToday, setUsersToday] = useState(0)
    const [formData, setFormData] = useState({})
    const [password, setPassword] = useState({})
    const [dates, setDates] = useState([])
    const [userIDToDelete, setUserIDToDelete] = useState()
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    console.log(dates)

    useEffect(() => {
        // Thực hiện một HTTP request để lấy danh sách người dùng từ server
        fetch('/api/user/get-user')
            .then((response) => response.json())
            .then((data) => setUsers(data.users))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetch('/api/user/amount-user')
            .then((response) => response.json())
            .then((data) => {
                setAmountUser(data.totalUsers);
                setUsersToday(data.uniqueUsersToday)
                console.log('Data from API:', data);
            })
            .catch((error) => console.error(error));
    }, []); // Thêm [] để đảm bảo useEffect chỉ chạy một lần sau khi component mount

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        console.log("Check user ID:", formData);
    };

    const handleInputPassword = (e) => {
        setPassword({ ...password, [e.target.id]: e.target.value });
        console.log("Check password:", password);
    }

    const handleClickDeleteUser = (userID) => {
        console.log(userID)
        setUserIDToDelete(userID)
        setDeleteConfirmation(!deleteConfirmation)
    }

    const handleDeleteUser = async (userIDToDelete) => {
        console.log(userIDToDelete);
        try {
            setDeleteConfirmation(false);
            const res = await fetch(`/api/user/delete/${userIDToDelete}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.success === false) {
                return;
            }
            // Reload trang sau khi xóa thành công
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="flex mx-auto mt-16 justify-between gap-4">
            <div className=' w-1/6 sm:inline border-r-2'>
                <div className='fixed flex flex-col ml-2 text-left w-44 justify-center gap-2 transition duration-300 mt-12'>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold bg-slate-300 md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <LuLayoutDashboard />
                        <Link to="/manage" className='self-center'>
                            {currentUser && currentUser.role === 'admin' && (
                                <p className='hidden sm:flex'>
                                    Dashboard
                                </p>
                            )}
                        </Link>
                    </span>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <HiOutlineDocumentReport />
                        <Link to="/report" className='self-center'>
                            {currentUser && currentUser.role === 'admin' && (
                                <p className='hidden sm:flex'>
                                    Report
                                </p>
                            )}
                        </Link>
                    </span>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <AiOutlineSetting />
                        <p className='hidden sm:flex'>
                            Setting
                        </p>
                    </span>
                    <span className='flex-row gap-2 w-44 text-md font-semibold md:flex items-center p-2 text-center rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <IoIosAddCircleOutline />
                        <Link to="/create-user" className='self-center'>
                            {currentUser && currentUser.role === 'admin' && (
                                <p className='hidden sm:flex'>
                                    Add Employee
                                </p>
                            )}
                        </Link>
                    </span>
                </div>
            </div>

            <div className="text-center w-5/6 mt-4 flex justify-center">
                <div className='text-center w-full'>
                    <h1 className='font-semibold flex p-3 text-3xl font-sans text-slate-500'>Overview</h1>
                    <div className='flex items-center ml-5'>
                        {/* <h2 className='flex float-left font-semibold text-lg text-slate-500'>Filter by:</h2>
                        <RangePicker className='flex ml-4 p-2 rounded-lg hover:border-violet-500 duration-500'
                            onChange={(values) => {
                                setDates(values.map(item => {
                                    return moment(item).format('DD-MM-YYYY')
                                }))
                            }}
                        /> */}
                        <h2 className='flex float-left font-semibold text-lg text-slate-500'>Search:</h2>
                        <form className='flex flex-row bg-white rounded-full p-1 ml-4 border-gray-300 border-1 hover:border-violet-500 duration-500'>
                            <input type="text" onChange={handleChange} id='userID' placeholder='employee id...' className='flex ml-4 p-1 bg-transparent rounded-lg outline-none  hover:border-violet-500 duration-500 ' />
                            <Link to={`/employee-info/${formData.userID}`} className='flex self-center text-center'>
                                <button className='p-2 ml-2 w-8 flex justify-end rounded-full text-center text-white bg-violet-600 hover:bg-violet-900 hover:scale-105 duration-500'>
                                    <IoSearch className='text-white font-bold' />
                                </button>
                            </Link>
                        </form>
                    </div>
                    <div className='flex flex-row p-4 h-48 gap-4 mb-2 mt-6'>
                        <div className='w-1/5 h-full bg-violet-600 text-white shadow-2xl flex rounded-2xl hover:bg-violet-800 duration-500 flex-col'>
                            <span className='flex font-sans font-semibold ml-3 mt-2 float-left'>
                                <BiSolidUser className='mr-2 flex justify-center items-center my-auto' />
                                Total Users
                            </span>
                            <span className=' flex font-semibold font-sans text-4xl float-left ml-10 mt-2'>{amountUser}</span>
                        </div>
                        <div className='w-1/5 h-full bg-violet-600 text-white shadow-2xl flex rounded-2xl hover:bg-violet-800 duration-500 flex-col'>
                            <span className='flex font-sans font-semibold ml-3 mt-2 float-left'>
                                <BiSolidUser className='mr-2 flex justify-center items-center my-auto' />
                                Current Users
                            </span>
                            <span className=' flex font-semibold font-sans text-4xl float-left ml-8 mt-2'>{usersToday}</span>
                        </div>
                    </div>
                    {deleteConfirmation && (
                        <div className="fixed inset-0 flex items-center justify-center transition duration-300">
                            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                            <div className="modal-container bg-white w-96 h-46 rounded-lg shadow-lg z-50 overflow-hidden transition duration-300">
                                <div>
                                    <AiFillWarning className='text-red-700 self-center text-4xl font-semibold mx-auto mt-2' />
                                    <h5 className="text-center p-1 text-red-800 font-semibold" id="exampleModalLabel">Delete Confirmation</h5>
                                </div>
                                <div className="flex justify-between mx-10 my-3">
                                    <button onClick={() => handleDeleteUser(userIDToDelete)} className="w-32 p-1 rounded-3xl bg-red-700 text-white">Confirm</button>
                                    <button onClick={() => setDeleteConfirmation(false)} className="w-32 p-2 rounded-3xl bg-slate-700 text-white">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className=' m-2'>
                        <h1 className='flex mt-1'></h1>
                        <div className='border-1 border-slate-300 rounded-lg my-3 p-3 text-lg font-bold sm:flex sm:items-center sm:justify-between sm:gap-2'>
                            <div className='sm:w-1/3 flex float-left ml-3'>
                                <p className='text-center flex float-left sm:text-left'>Username</p>
                            </div>
                            <div className='sm:w-2/5 flex'>
                                <p className='text-center sm:text-left'>Email</p>
                            </div>
                            <div className='sm:w-1/5 flex float-left'>
                                <p className='text-center sm:text-left'>Role</p>
                            </div>
                            <div className='sm:w-1/5 flex justify-center ml-3'>
                                <p className="text-slate-800 md:my-0 my-7 pl-2 pr-2 text-center duration-500">
                                    Detail
                                </p>
                            </div>
                            {/* <div className='sm:w-1/5 flex justify-center ml-3'>
                                <p className="text-slate-800 md:my-0 my-7 pl-2 pr-2 text-center duration-500">
                                    Action
                                </p>
                            </div> */}
                        </div>
                        {users.map((user) => (
                            <div className='bg-slate-300 rounded bg-opacity-30 my-3 p-3 mr-2 sm:flex font-light text-md sm:items-center sm:justify-between sm:gap-2'>
                                <div className='sm:w-2/5 flex flex-row float-left gap-2'>
                                    <FaUserCircle className='flex text-violet-600 w-8 h-8 rounded-full shadow-xl' />
                                    <p className='w-full text-left sm:text-left'>{user.username}</p>
                                </div>
                                <div className='sm:w-2/5 flex float-left'>
                                    <p className='text-center sm:text-left'>{user.email}</p>
                                </div>
                                <div className='sm:w-1/5  flex float-left ml-10'>
                                    <p className='text-center sm:text-left'>{user.role}</p>
                                </div>
                                <div className='sm:w-1/5 flex justify-center ml-10'>
                                    <Link to={`/profile-detail/${user.userID}`} className='flex self-center text-center'>
                                        <button className='p-2 ml-2 w-8 flex justify-end rounded-full text-center text-white bg-violet-600 hover:bg-violet-900 hover:scale-125 duration-500'>
                                            <IoIosArrowForward />
                                        </button>
                                    </Link>
                                </div>
                                {/* <div className='sm:w-1/5 flex justify-center ml-10'>
                                    <Link className='flex self-center text-center' onClick={() => handleClickDeleteUser(user.userID)}>
                                        <button className='p-2 ml-2 w-8 flex justify-end rounded-full text-center text-white bg-red-700 hover:bg-red-900 hover:scale-125 duration-500'>
                                            <MdDelete />
                                        </button>
                                    </Link>
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
