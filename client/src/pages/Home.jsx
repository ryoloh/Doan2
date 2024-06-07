import React from 'react';
import homeImage from '../assets/images/home-page.jpg';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

const Home = () => {
    const navigate = useNavigate()

    const { currentUser } = useSelector(state => state.user);
    console.log(currentUser)

    return (
        <div className=" h-screen mt-30 flex flex-row items-center justify-center relative">
            {currentUser ? (
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${homeImage})` }}
                />
            ) : (
                <>
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${homeImage})` }}
                    />
                    <div className="z-10 w-1/2 flex flex-col gap-4 justify-center text-purple-900">
                        <div className="flex flex-col h-full">
                            <h1 className="text-4xl text-center mt-32 font-bold mb-4">
                                Attendance System
                            </h1>
                            <h3 className="text-xl text-center">Effortless Time Tracking</h3>
                            <h3 className="text-xl text-center mb-4">Exceptional Results.</h3>
                            <div className="flex mt-3 gap-4 justify-center">
                                <Link to="/sign-up">
                                    <button className="bg-purple-600 h-10 w-24 rounded-full font-semibold text-slate-100 hover:text-slate-100 hover:shadow-lg hover:bg-purple-800 duration-500">
                                        Sign up
                                    </button>
                                </Link>
                                <Link to="/sign-in">
                                    <button className="h-10 w-24 rounded-full border-2 border-purple-800 text-purple-800 hover:bg-purple-800 hover:border-purple-800 hover:shadow-lg hover:text-white duration-500">
                                        Sign in
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
