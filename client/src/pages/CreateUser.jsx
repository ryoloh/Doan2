import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { IoIosAddCircleOutline } from 'react-icons/io'
import { AiOutlineSetting } from 'react-icons/ai'
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineDocumentReport } from "react-icons/hi";
import homeImage from '../assets/images/home-page.jpg';

export default function CreateUser() {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.user);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await fetch('/api/auth/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data)
            if (data.success === false) {
                setLoading(false)
                setError(data.message)
                return;
            }
            setLoading(false)
            setError(null)

            // Lấy userID từ response hoặc từ data trả về từ server
            const userID = data.userID; // Thay thế bằng phương thức lấy userID tương ứng

            // Định tuyến về trang profile-detail với userID
            history.push(`/profile-detail/${userID}`);
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }

    return (
        <>
            <div className="flex mx-auto mt-16 justify-between gap-4">
                <div className='w-1/6 sm:inline border-r-2'>
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
                        <span className='flex-row gap-2 w-44 text-md font-semibold bg-slate-300 md:flex items-center p-2 text-center rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
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
                <div className='w-5/6 h-full flex p-3 flex-col max-w-lg mx-auto z-0'>
                    <form onSubmit={handleSubmit} className='flex flex-col w-3/4 gap-4'>
                        <div className='flex flex-col bg-slate-50 bg-opacity-40 backdrop-filter backdrop-blur-2xl rounded shadow-lg mt-3'>
                            <h1 className="text-2xl mt-1 font-semibold text-center text-violet-700">Register</h1>
                            <div className='flex flex-col float-left justify-center my-1 ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                                <span className='flex float-left ml-1 hover:text-violet-500'>Username</span>
                                <input type="text" onChange={handleChange} id='username' placeholder='username...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 hover:border-2 duration-500' />
                            </div>
                            <div className='flex flex-col float-left justify-center my-1 ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                                <span className='flex float-left ml-1 hover:text-violet-500'>Email</span>
                                <input type="text" onChange={handleChange} id='email' placeholder='email...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 hover:border-2 duration-500' />
                            </div>
                            <div className='flex flex-col float-left justify-center my-1 ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                                <span className='flex float-left ml-1 hover:text-violet-500'>Password</span>
                                <input type="password" onChange={handleChange} id='password' placeholder='password...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 hover:border-2 duration-500' />
                            </div>
                            <div className='flex flex-col float-left justify-center my-1 ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                                <span className='flex float-left ml-1 hover:text-violet-500'>Phonenumber</span>
                                <input type="text" onChange={handleChange} id='phonenumber' placeholder='phonenumber...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 hover:border-2 duration-500' />
                            </div>
                            <div className='flex flex-col float-left justify-center my-1 ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                                <span className='flex float-left ml-1 hover:text-violet-500'>Department</span>
                                <input type="text" onChange={handleChange} id='department' placeholder='department...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 hover:border-2 duration-500' />
                            </div>

                            <div className='flex flex-col float-left justify-center ml-10 mr-10 mb-4 text-sm text-slate-500 sm:flex  sm:justify-between sm:gap-2'>
                                <button disabled={loading} className='bg-violet-600 rounded-xl mt-3 text-white pl-2 p-2 hover:bg-violet-800 hover:scale-105 hover:shadow-md duration-500'>
                                    {loading ? 'Loading...' : 'Submit'}
                                </button>

                            </div>
                        </div>
                    </form>
                    {error && <p className="text-red-500 mt-5">{error}</p>}
                </div>
            </div>
        </>
    )
}
