import { FaSearch } from 'react-icons/fa';
import { HiOutlineUser } from 'react-icons/hi';
import { IoIosLogOut } from 'react-icons/io'
import { AiFillWarning } from 'react-icons/ai'
import { TfiHelpAlt } from 'react-icons/tfi'
import { AiOutlineMenu } from 'react-icons/ai'
import { AiOutlineClose } from 'react-icons/ai'
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { useState } from "react";
import { Menu, X } from 'lucide-react';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import Button from './Button';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [functionForm, setFunctionForm] = useState(false);
    const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [responsiveOpen, setResponsiveOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false);

    const handleShowSignOutConfirmation = () => {
        setShowSignOutConfirmation(!showSignOutConfirmation);
        setFunctionForm(!functionForm)
    }

    const handleHideSignOutConfirmation = () => {
        setShowSignOutConfirmation(!showSignOutConfirmation);
        setFunctionForm(false);
    }

    const handleClick = () => {
        setFunctionForm(!functionForm);
    };

    const handleSignOut = async () => {
        dispatch(signOutUserStart());
        try {
            const res = await fetch(`/api/auth/signout`);
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess(data));
            setShowSignOutConfirmation(!showSignOutConfirmation);
            navigate('/');

        } catch (error) {
            dispatch(signOutUserFailure(data.message));
        }
    }

    const handleClickResponsive = () => {
        setResponsiveOpen(!responsiveOpen);
        console.log(responsiveOpen)
    }

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const shouldHaveBackground = scrollPosition > 0;
        setIsScrolled(shouldHaveBackground);
    };

    window.addEventListener('scroll', handleScroll);

    return (
        <div className="fixed w-full top-0 left-0 z-10">

            <div className={`fixed w-full top-0 left-0 z-10 p-3 md:flex mb-6 items-center justify-between ${isScrolled ? 'bg-slate-200 bg-opacity-80 backdrop-filter backdrop-blur-xl transition-all duration-300' : ''}`}>
                <div className="font-bold cursor-pointer flex items-center text-gray-600 ml-5">
                    <Link to="/">

                        <span className="text-xl mr-1 pt-2 text-slate-700">Attendance</span>
                        <span className="text-xl text-violet-700">System</span>

                    </Link>
                </div>
                {showSignOutConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center transition duration-300">
                        <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                        <div className="modal-container bg-white w-96 h-46 rounded-lg shadow-lg z-50 overflow-hidden transition duration-300">
                            <div>
                                <AiFillWarning className='text-red-700 self-center text-4xl font-semibold mx-auto mt-2' />
                                <h5 className="text-center p-1 text-red-800 font-semibold" id="exampleModalLabel">Sign Out Confirmation</h5>
                            </div>
                            <div className="text-center p-1 text-slate-600 font-semibold">
                                <p>Are you sure you want to sign out?</p>
                            </div>
                            <div className="flex justify-between mx-10 my-3">
                                <button onClick={handleSignOut} className="w-32 p-1 rounded-3xl bg-red-700 text-white">Confirm</button>
                                <button onClick={handleHideSignOutConfirmation} className="w-32 p-2 rounded-3xl bg-slate-700 text-white">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <form className="bg-white p-2 rounded-3xl items-center hidden md:flex sm:ml-12">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="hidden md:flex bg-transparent focus:outline-none w-2 sm:w-80 ml-2"
                    />
                    <div className="sm:flex hidden bg-purple-600 p-2 rounded-2xl hover:bg-purple-700 transition duration-300">
                        <FaSearch className="text-white " />
                    </div>
                </form>
                <div onClick={handleClickResponsive}>
                    {responsiveOpen ? (
                        <AiOutlineClose className='text-2xl absolute right-10 top-9 cursor-pointer md:hidden' />
                    ) : (
                        <AiOutlineMenu className='text-2xl absolute right-10 top-9 cursor-pointer md:hidden' />

                    )}
                </div>

                <ul className={`md:flex md:items-center mr-5 gap-3 md:pb-0 pb-12 absolute md:static bg-transparent md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${responsiveOpen ? 'top-20' : 'top-[-490px]'}`}>
                    <NavLink to="/" className='self-center' onClick={() => setResponsiveOpen(false)}>
                        <li className=" text-slate-500 font-semibold md:ml-8 ml-5 md:my-0 my-7 hover:text-gray-400 duration-500">
                            Home
                        </li>
                    </NavLink>
                    <Link to="/about" className='self-center' onClick={() => setResponsiveOpen(false)}>
                        <li className="  text-slate-500 font-semibold md:ml-8 ml-5 md:my-0 my-7 hover:text-gray-400 duration-500">
                            About
                        </li>
                    </Link>
                    <Link to="/manage" className='self-center' onClick={() => setResponsiveOpen(false)}>
                        {currentUser && currentUser.role === 'admin' && (
                            <li className="  text-slate-500 font-semibold md:ml-8 ml-5 md:my-0 my-7 hover:text-gray-400 duration-500">
                                Manage
                            </li>
                        )}
                    </Link>
                    <Link to="/attendance-info" className='self-center' onClick={() => setResponsiveOpen(false)}>
                        {currentUser && currentUser.role === 'employee' && (
                            <li className="  text-slate-500 font-semibold md:ml-8 ml-5 md:my-0 my-7 hover:text-gray-400 duration-500">
                                Attendance Info
                            </li>
                        )}
                    </Link>
                    {currentUser ? (
                        <div className="relative group top-3">
                            <img
                                onClick={handleClick}
                                className="rounded-full h-7 w-7 ml-5 mb-4 object-cover cursor-pointer hover:scale-105 duration-500 hidden sm:flex"
                                src={currentUser.avatar}
                                alt="profile"
                            />
                            {functionForm && (
                                <div className="absolute right-1 w-60 mt-10 flex flex-col bg-white rounded-lg shadow-lg opacity-100 group-hover:opacity-100 transition-all duration-500 ease-in">
                                    <Link onClick={() => setFunctionForm(false)} to="/profile" className="flex items-center m-1 p-2 font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 hover:rounded-md transition-all duration-300 ease-in">
                                        <HiOutlineUser className='mr-2' />
                                        My profile
                                    </Link>
                                    <span className="flex items-center m-1 p-2 font-semibold text-slate-600 cursor-pointer hover:text-slate-900 hover:bg-slate-200 hover:rounded-md transition-all duration-300 ease-in">
                                        <TfiHelpAlt className='mr-2' />
                                        Help center
                                    </span>
                                    <span onClick={handleShowSignOutConfirmation} className="flex items-center m-1 text-red-600 p-2 cursor-pointer hover:text-red-900 font-semibold hover:bg-red-100 hover:rounded-md transition-all duration-300 ease-in">
                                        <IoIosLogOut className='mr-2' />
                                        Sign out
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/profile">
                            <li className="border-2 border-purple-600 text-purple-600 rounded-lg pl-5 pr-5 pt-1 pb-1 hover:bg-purple-800 hover:text-white hover:border-purple-800 transition duration-300">Sign In</li>
                        </Link>
                    )}
                    {/* <Button>
                        Read More
                    </Button> */}
                </ul>
            </div>


        </div>


    );
}
