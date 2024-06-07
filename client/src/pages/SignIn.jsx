import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import homeImage from '../assets/images/home-page.jpg';
import OAuth from '../components/OAuth';

export default function SignIn() {
    const [formData, setFormData] = useState({})
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart())
            const res = await fetch('/api/auth/signin', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data)
            if (data.success === false) {
                dispatch(signInFailure(data.message))
                return;
            }
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            dispatch(signInFailure(data.message))
        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-20 mb-4'></h1>
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${homeImage})` }}
            />
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='mr-20 ml-20 flex flex-col bg-slate-50 bg-opacity-40 backdrop-filter backdrop-blur-2xl rounded shadow-lg mt-3 z-50'>
                    <h1 className="text-2xl mt-3 font-semibold text-center text-violet-700">LOGIN</h1>
                    <div className='flex flex-col float-left justify-center my-3 ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                        <span className='flex float-left ml-1 hover:text-violet-500'>Email</span>
                        <input type="text" onChange={handleChange} id='email' placeholder='email...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-800 hover:text-violet-500 hover:text-sm hover:border-2 duration-500' />
                    </div>
                    <div className='flex flex-col float-left justify-center ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                        <span className='flex float-left ml-1 hover:text-violet-500'>Password</span>
                        <input type="password" onChange={handleChange} id='password' placeholder='password...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-800 hover:text-violet-500 hover:text-sm hover:border-2 duration-500' />
                    </div>
                    {/* <div className='flex flex-col float-left justify-center mt-2 w-1/2 mx-auto text-sm text-slate-500  ml-2 mr-2 sm:flex  sm:justify-between sm:gap-2'>
                        <span className='ml-1 text-slate-600 font-semibold hover:text-violet-800 duartion-500'>Forget Password?</span>
                    </div> */}
                    <div className='flex flex-col float-left justify-center mt-3 ml-10 mr-10 text-sm text-slate-500 sm:flex  sm:justify-between sm:gap-2'>
                        <button disabled={loading} className='bg-violet-600 rounded-xl mt-3 text-white pl-2 p-2 hover:bg-violet-800 hover:scale-105 hover:shadow-md duration-500'>
                            {loading ? 'Loading...' : 'Sign In'}
                        </button>
                        <OAuth />

                    </div>
                    <div className='flex flex-row float-left mb-5 mt-3 mx-auto text-sm text-slate-500  ml-2 mr-2 sm:flex sm:gap-2'>
                        <span className=' text-slate-500 hover:text-violet-600 duration-500'>Don't have an account?</span>
                        <Link to="/sign-up">
                            <span className='text-violet-600'>Sign up</span>
                        </Link>
                    </div>
                </div>


            </form>
            {/* <div className='flex gap-2 mt-4'>
                <p>Don't have an account?</p>
                <Link to="/sign-up">
                    <span className='text-blue-500'>Sign up</span>
                </Link>
            </div> */}
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>

    )
}
