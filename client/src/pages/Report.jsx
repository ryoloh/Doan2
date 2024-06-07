import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io'
import { AiOutlineSetting } from 'react-icons/ai'
import { BiSolidUser } from 'react-icons/bi'
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

import { DatePicker } from 'antd';
// Sử dụng date-fns
import { isSameDay, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import moment from 'moment'

const { RangePicker } = DatePicker

export default function Report() {
    const navigate = useNavigate(); // Sử dụng hook useNavigate để chuyển hướng
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [userCheckIn, setUserCheckIn] = useState([]);
    const [userCheckOut, setUserCheckOut] = useState([]);
    const [amountUser, setAmountUser] = useState(0)
    const [formData, setFormData] = useState(false);
    const [dateRange, setDateRange] = useState([]);
    const [dates, setDates] = useState([])

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = currentDate.getFullYear();

    // Tạo chuỗi ngày tháng năm
    const formattedDate = `${day}/${month}/${year}`;

    console.log(dates)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/user/get-user');
                const data = await response.json();

                setUsers(data.users);
                setUserCheckIn(data.userCheckIn);
                setUserCheckOut(data.userCheckOut);

            } catch (error) {
                console.error(error);
            }
        };

        // Fetch data ngay sau khi component được mount
        fetchData();

        // Thiết lập interval để fetch dữ liệu mỗi 5 giây (hoặc bất kỳ khoảng thời gian nào bạn muốn)
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        // Cleanup: Dừng interval khi component bị hủy
        return () => clearInterval(intervalId);
    }, []); // Dependency array rỗng để chỉ chạy một lần sau khi component được mount

    console.log("check users: ", users);
    console.log("check users checkin: ", userCheckIn);
    console.log("check users checkout: ", userCheckOut);

    // const handleCreateUser = () => {
    //     setShowCreateUserForm(true)
    // }

    useEffect(() => {
        fetch('/api/user/amount-user')
            .then((response) => response.json())
            .then((data) => {
                setAmountUser(data);
                console.log('Data from API:', data);
            })
            .catch((error) => console.error(error));
    }, []); // Thêm [] để đảm bảo useEffect chỉ chạy một lần sau khi component mount

    return (
        <div className="flex mx-auto mt-16 justify-between gap-4">
            <div className=' w-1/6 sm:inline border-r-2'>
                <div className='fixed flex flex-col ml-2 text-left w-44 justify-center gap-2 transition duration-300 mt-12'>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold  md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <LuLayoutDashboard />
                        <Link to="/manage" className='self-center'>
                            {currentUser && currentUser.role === 'admin' && (
                                <p className='hidden sm:flex'>
                                    Dashboard
                                </p>
                            )}
                        </Link>
                    </span>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold bg-slate-300 md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
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

            <div className="text-center w-5/6 mt-5 flex justify-center">
                <div className='text-center mt-2 w-full'>
                    <div className='flex flex-col'>
                        <h1 className='font-bold flex justify-start p-3 text-3xl text-gray-500 font-sans'>Report</h1>
                        <h1 className='font-semibold border rounded-full w-44 h-12 flex justify-center items-center p-3 ml-2 text-xl text-gray-500 font-sans'>{formattedDate}</h1>
                    </div>


                    <div className=' m-2'>
                        <h1 className='flex mt-1'></h1>
                        <div className='border-1 border-slate-300 bg-gray-200 rounded-lg my-3 p-3 text-lg font-bold sm:flex sm:items-center sm:justify-between sm:gap-2'>
                            <div className='sm:w-1/4 flex float-left'>
                                <p className='text-center text-gray-500 sm:text-left'>Username</p>
                            </div>
                            <div className='sm:w-1/3 flex float-left'>
                                <p className='text-center text-gray-500 sm:text-left'>Email</p>
                            </div>
                            <div className='sm:w-1/6 flex float-left'>
                                <p className='text-center text-gray-500 sm:text-left'>Clock in</p>
                            </div>
                            <div className='sm:w-1/6 flex float-left'>
                                <p className='text-center text-gray-500 sm:text-left'>Clock out</p>
                            </div>
                            <div className='w-1/6'>
                                <p className="text-slate-500 md:my-0 my-7 pl-2 pr-2 text-center">
                                    Detail
                                </p>
                            </div>
                        </div>
                        {users.map((user) => {
                            // Biến để lưu trữ giá trị TimeIn tìm được từ mảng userCheckIn
                            console.log("user: ", user);
                            let userCheckInTimeIn = "No data!";
                            let userCheckOutTimeOut = "No data!";
                            let textColorTimeIn = "text-gray-500"; // Mặc định màu chữ là đỏ
                            let textColorTimeOut = "text-gray-500"; // Mặc định màu chữ là đỏ

                            // Kiểm tra xem có bất kỳ bản ghi nào trong userCheckIn có userID khớp với userID của user không
                            const matchingCheckIn = userCheckIn.filter((checkIn) => checkIn.userID == user.userID);
                            console.log("matchingCheckIn: ", matchingCheckIn);
                            const matchingCheckOut = userCheckOut.filter((checkOut) => checkOut.userID == user.userID);
                            console.log("matchingCheckOut: ", matchingCheckOut);

                            matchingCheckIn.forEach((checkInRecord) => {
                                const timeInDate = checkInRecord.TimeIn;
                                console.log("timeInDate (string): ", checkInRecord.TimeIn);

                                // Tạo đối tượng Date từ timeInDate mà không chuyển đổi múi giờ
                                const parsedTimeInDate = new Date(timeInDate.slice(0, -1));
                                console.log("timeInDate (Date): ", parsedTimeInDate);

                                if (isSameDay(parsedTimeInDate, new Date())) {
                                    // Sử dụng options để set múi giờ khi gọi toLocaleTimeString
                                    const timeOptions = {
                                        timeZone: 'Asia/Ho_Chi_Minh', // Thay thế bằng múi giờ mong muốn của bạn, ví dụ: 'Asia/Ho_Chi_Minh'
                                        hour12: false, // Sử dụng định dạng 24 giờ
                                    };

                                    userCheckInTimeIn = parsedTimeInDate.toLocaleTimeString('en-US', timeOptions);
                                    console.log("userCheckInTimeIn: ", userCheckInTimeIn);

                                    const timeInHour = parsedTimeInDate.getHours();
                                    const timeInMinute = parsedTimeInDate.getMinutes();
                                    console.log("timeInMinute: ", timeInMinute);
                                    console.log("timeInHour: ", timeInHour);
                                    if (timeInHour > 8 || (timeInHour === 8 && timeInMinute >= 1)) {
                                        textColorTimeIn = "text-red-700";
                                    }
                                }
                            });

                            // Tương tự cho matchingCheckOut
                            matchingCheckOut.forEach((checkOutRecord) => {
                                const timeOutDate = checkOutRecord.TimeOut;
                                console.log("timeOutDate (string): ", timeOutDate);

                                // Tạo đối tượng Date từ timeOutDate mà không chuyển đổi múi giờ
                                const parsedTimeOutDate = new Date(timeOutDate.slice(0, -1));
                                console.log("timeOutDate (Date): ", parsedTimeOutDate);

                                if (isSameDay(parsedTimeOutDate, new Date())) {
                                    // Sử dụng options để set múi giờ khi gọi toLocaleTimeString
                                    const timeOptions = {
                                        timeZone: 'Asia/Ho_Chi_Minh', // Thay thế bằng múi giờ mong muốn của bạn, ví dụ: 'Asia/Ho_Chi_Minh'
                                        hour12: false, // Sử dụng định dạng 24 giờ
                                    };

                                    userCheckOutTimeOut = parsedTimeOutDate.toLocaleTimeString('en-US', timeOptions);
                                    console.log("userCheckOutTimeOut: ", userCheckOutTimeOut);

                                    const timeOutHour = parsedTimeOutDate.getHours();
                                    const timeOutMinute = parsedTimeOutDate.getMinutes();
                                    if (timeOutHour < 17 || (timeOutHour === 17 && timeOutMinute === 0)) {
                                        textColorTimeOut = "text-red-700";
                                    }
                                }
                            });

                            // Hiển thị thông tin user
                            return (
                                <div key={user.userID} className='border-1 border-slate-300 rounded-lg my-3 p-3 text-lg font-light sm:flex sm:items-center sm:justify-between sm:gap-2'>
                                    <div className='sm:w-1/4 flex float-left'>
                                        <p className='text-center text-gray-700 sm:text-left'>{user.username}</p>
                                    </div>
                                    <div className='sm:w-1/3 flex float-left'>
                                        <p className='text-center text-gray-700 sm:text-left'>{user.email}</p>
                                    </div>
                                    <div className={`sm:w-1/6 flex float-left ${textColorTimeIn}`}>
                                        <p className='text-center sm:text-left'>{userCheckInTimeIn}</p>
                                    </div>
                                    <div className={`sm:w-1/6 flex float-left ${textColorTimeOut}`}>
                                        <p className='text-center sm:text-left'>{userCheckOutTimeOut}</p>
                                    </div>
                                    <div className='sm:w-1/6 flex justify-center'>
                                        <Link to={`/attendance-detail/${user.userID}`} className='flex self-center text-center'>
                                            <button className='p-2 w-8 h-8 flex justify-end rounded-full text-center text-white bg-violet-600 hover:bg-violet-900 hover:scale-125 duration-500'>
                                                <IoIosArrowForward />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        </div>
    );
}
