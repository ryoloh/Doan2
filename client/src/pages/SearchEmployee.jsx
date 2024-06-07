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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { useLocation } from 'react-router-dom';

import { DatePicker } from 'antd';
import moment from 'moment'

const { RangePicker } = DatePicker

export default function SearchEmployee() {
    const { currentUser } = useSelector(state => state.user);
    const userId = useParams();
    console.log("Check userIddddddddddd:", userId.id)
    const [user, setUser] = useState(null)


    const [dates, setDates] = useState([])
    console.log(userId)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user/profile-detail/${userId.id}`);
                const data = await response.json();

                if (!response.ok || data.success === false) {
                    console.error(data.message || 'User not found');
                    return;
                }

                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [userId.id]);

    if (!user) {
        return <div>Loading...</div>;
    }



    const handleDeleteUser = () => {
        alert("Delete")
    }

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
                        <h2 className='flex float-left font-semibold text-lg text-slate-500'>Filter by:</h2>
                        <RangePicker className='flex ml-4 p-2 rounded-lg hover:border-violet-500 duration-500'
                            onChange={(values) => {
                                setDates(values.map(item => {
                                    return moment(item).format('DD-MM-YYYY')
                                }))
                            }}
                        />
                    </div>

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
                            <div className='sm:w-1/5 flex justify-center ml-3'>
                                <p className="text-slate-800 md:my-0 my-7 pl-2 pr-2 text-center duration-500">
                                    Action
                                </p>
                            </div>
                        </div>

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
                                <Link className='flex self-center text-center'>
                                    <button className='p-2 ml-2 w-8 flex justify-end rounded-full text-center text-white bg-violet-600 hover:bg-violet-900 hover:scale-125 duration-500'>
                                        <IoIosArrowForward />
                                    </button>
                                </Link>
                            </div>
                            <div className='sm:w-1/5 flex justify-center ml-10'>
                                <Link className='flex self-center text-center'>
                                    <button className='p-2 ml-2 w-8 flex justify-end rounded-full text-center text-white bg-red-700 hover:bg-red-900 hover:scale-125 duration-500'>
                                        <MdDelete />
                                    </button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
