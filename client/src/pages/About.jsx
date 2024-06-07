import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, Fragment } from "react"
import homeImage from '../assets/images/home-page.jpg';

export default function Report() {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // Thực hiện một HTTP request để lấy danh sách người dùng từ server
        fetch('/api/user/get-user')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));
    }, []);

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
            navigate('/manage')
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }
    return (
        <Fragment>
            {/* <div
                className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${homeImage})` }}
            />
            <div className="max-w-sm mx-auto mt-32 z-50"></div >
            <div className='w-1/6 float-left mt-2 ml-2 flex'>
            </ div>
            <form className="flex flex-col w-full z-50">
                <div className='mr-20 ml-20 flex flex-col bg-slate-50 bg-opacity-40 backdrop-filter backdrop-blur-2xl rounded shadow-lg mt-3 z-50'>
                    <h1 className="text-2xl mt-3 font-semibold text-center text-violet-700">LOGIN</h1>
                    <div className='flex flex-col float-left justify-center my-3 w-1/2 mx-auto text-sm text-slate-500   ml-2 mr-2 sm:flex hover:text-violet-500 hover:text-lg duration-500 sm:justify-between sm:gap-2'>
                        <span className='flex float-left ml-1 hover:text-violet-500'>Username</span>
                        <input type="text" placeholder='username...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 hover:text-sm hover:border-2 duration-500' />
                    </div>
                    <div className='flex flex-col float-left justify-center w-1/2 mx-auto text-sm text-slate-500   ml-2 mr-2 sm:flex hover:text-violet-500 hover:text-lg duration-500 sm:justify-between sm:gap-2'>
                        <span className='flex float-left ml-1 hover:text-violet-500'>Password</span>
                        <input type="text" placeholder='password...' className='border-1 border-violet-400 rounded-xl bg-transparent pl-2 p-2 hover:border-violet-600 hover:text-violet-500 hover:text-sm hover:border-2 duration-500' />
                    </div>
                    <div className='flex flex-col float-left justify-center mt-2 w-1/2 mx-auto text-sm text-slate-500  ml-2 mr-2 sm:flex  sm:justify-between sm:gap-2'>
                        <span className='ml-1 text-slate-600 font-semibold hover:text-violet-800 duartion-500'>Forget Password?</span>
                    </div>
                    <div className='flex flex-col float-left justify-center mt-3 w-1/2 mx-auto text-sm text-slate-500  ml-2 mr-2 sm:flex  sm:justify-between sm:gap-2'>
                        <button className='bg-violet-600 rounded-xl text-white pl-2 p-2 hover:bg-violet-800 hover:scale-105 hover:shadow-md duration-500'>Sign in</button>
                    </div>
                    <div className='flex flex-row float-left justify-center mb-5 mt-3 w-1/2 mx-auto text-sm text-slate-500  ml-2 mr-2 sm:flex  sm:justify-between sm:gap-2'>
                        <span className=' text-slate-500 pl-2 p-2 hover:text-violet-600 duration-500'>Haven't an account?</span>
                    </div>
                </div>
            </form> */}



        </Fragment >
    )
}
