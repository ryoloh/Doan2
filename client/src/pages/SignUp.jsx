import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import homeImage from '../assets/images/home-page.jpg';

export default function SignUp() {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
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
            navigate('/sign-in')
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <div className='p-3 max-w-lg mx-auto'>
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${homeImage})` }}
                />
                <h1 className='text-3xl text-center font-semibold my-20 mb-4'></h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className='mr-20 ml-20 flex flex-col bg-slate-50 bg-opacity-40 backdrop-filter backdrop-blur-2xl rounded shadow-lg mt-3 z-50'>
                        <h1 className="text-2xl mt-3 font-semibold text-center text-violet-700">Register</h1>
                        <div className='flex flex-col float-left justify-center my-3 ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                            <span className='flex float-left ml-1 hover:text-violet-500'>Username</span>
                            <input type="text" onChange={handleChange} id='username' placeholder='username...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 hover:border-2 duration-500' />
                        </div>
                        <div className='flex flex-col float-left justify-center my-3 ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                            <span className='flex float-left ml-1 hover:text-violet-500'>Email</span>
                            <input type="text" onChange={handleChange} id='email' placeholder='email...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 =hover:border-2 duration-500' />
                        </div>
                        <div className='flex flex-col float-left justify-center ml-10 mr-10 text-sm text-slate-500 sm:flex hover:text-violet-500 duration-500 sm:justify-between sm:gap-2'>
                            <span className='flex float-left ml-1 hover:text-violet-500'>Password</span>
                            <input type="password" onChange={handleChange} id='password' placeholder='password...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 =hover:border-2 duration-500' />
                        </div>
                        {/* <div className='flex flex-col float-left justify-center mt-2 w-1/2 mx-auto text-sm text-slate-500  ml-2 mr-2 sm:flex  sm:justify-between sm:gap-2'>
                        <span className='ml-1 text-slate-600 font-semibold hover:text-violet-800 duartion-500'>Forget Password?</span>
                    </div> */}
                        <div className='flex flex-col float-left justify-center mt-3 ml-10 mr-10 text-sm text-slate-500 sm:flex  sm:justify-between sm:gap-2'>
                            <button disabled={loading} className='bg-violet-600 rounded-xl mt-3 text-white pl-2 p-2 hover:bg-violet-800 hover:scale-105 hover:shadow-md duration-500'>
                                {loading ? 'Loading...' : 'Sign Up'}
                            </button>
                            <OAuth />

                        </div>
                        <div className='flex flex-row float-left mb-5 mt-3 mx-auto text-sm text-slate-500  ml-2 mr-2 sm:flex sm:gap-2'>
                            <span className=' text-slate-500 hover:text-violet-600 duration-500'>Have an account?</span>
                            <Link to="/sign-in">
                                <span className='text-violet-600'>Sign in</span>
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
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>

    )
}
