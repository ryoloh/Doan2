import { useSelector, useDispatch } from "react-redux"
import { app } from '../firebase'
import { AiFillWarning } from 'react-icons/ai'
import { useRef, useState, useEffect, Fragment } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap";

export default function Profile() {
    const fileRef = useRef(null)
    const navigate = useNavigate();
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    // const [formPassword, setFormPassword] = useState(''); // State để lưu trạng thái của ô nhập mật khẩu
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);

    const dispatch = useDispatch();
    console.log(formData)

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress))
            },

            //Callback function when we have errors
            (error) => {
                setFileUploadError(true)
            },
            //Callback function when the uploading is successful
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then
                    ((downloadURL) =>
                        setFormData({
                            ...formData, avatar: downloadURL
                        })
                    )
            }
        );
    }

    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.id]: e.target.value });
    //     console.log(formData);
    // };


    // const handleEnterPassword = (e) => {
    //     setFormData({ ...formData, [e.target.id]: e.target.value });
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         dispatch(updateUserStart());
    //         const res = await fetch(`/api/user/update/${currentUser.userID}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(formData)
    //         })
    //         const data = await res.json();
    //         if (data.success == false) {
    //             dispatch(updateUserFailure(data.message))
    //             return;
    //         }
    //         dispatch(updateUserSuccess(data));
    //         setUpdateSuccess(true)
    //         console.log(loading)
    //     } catch (error) {
    //         dispatch(updateUserFailure(error.message))
    //     }
    // }

    const handleShowSignOutConfirmation = () => {
        setShowSignOutConfirmation(true)
        console.log(showSignOutConfirmation)
    }

    const handleHideSignOutConfirmation = () => {
        setShowSignOutConfirmation(false)
        console.log(showSignOutConfirmation)
    }


    const handleSignOut = async () => {
        dispatch(signOutUserStart())
        try {
            const res = await fetch(`/api/auth/signout`);
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message))
                return;
            }
            dispatch(signOutUserSuccess(data))
        } catch (error) {
            dispatch(signOutUserFailure(data.message))
        }
    }
    return (
        <Fragment>
            <div className="max-w-sm mx-auto mt-32 z-50"></div >
            <div className='w-1/6 float-left mt-3 ml-24 flex' >
                <button className="bg-gray-700 w-1/2 py-2 ml-20 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </ div>
            {showSignOutConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                    <div className=" modal-container bg-white w-96 h-46 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div>
                            <AiFillWarning className='text-red-700 self-center text-4xl font-semibold mx-auto mt-2' />
                            <h5 className="text-center p-1 text-red-800 font-semibold" id="exampleModalLabel">Sign Out Confirmation</h5>
                        </div>
                        <div className="text-center p-1 text-slate-600 font-semibold">
                            <p>Are you sure you want to sign out?</p>
                        </div>
                        <div className=" flex justify-between mx-10 my-3">
                            <button onClick={handleSignOut} className="w-32 p-1 rounded-3xl bg-red-700 text-white">Confirm</button>
                            <button onClick={() => setShowSignOutConfirmation(true)} className="w-32 p-2 rounded-3xl bg-slate-700 text-white">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <form className="flex flex-col w-4/6">
                <div className="my-3 mr-10 flex flex-row justify-center bg-white h-1/4 p-4 rounded-lg shadow-lg text-slate-600 gap-3">
                    <div className=' rounded justify-center flex border w-1/3'>
                        <div className='flex flex-col'>
                            <div className='flex justify-center h-1/6'>
                                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
                                <img onClick={() => fileRef.current.click()}
                                    src={formData.avatar || currentUser.avatar}
                                    alt="profile picture"
                                    className='h-full mt-3 rounded-full' />
                                <p className="text-sm self-center">
                                    {fileUploadError ?
                                        (
                                            <span className="text-red-700"> Error image upload! (Image must be less then 2 MB!)</span>
                                        ) : filePerc > 0 && filePerc < 100 ?
                                            (
                                                <span className="text-slate-700"> {`Uploading ${filePerc}%`}</span>
                                            ) : filePerc === 100 ?
                                                (
                                                    <span className="text-green-700">Image successfully uploaded!</span>
                                                ) :
                                                ("")
                                    }
                                </p>
                            </div>

                            <div className='mt-4'>
                                <div class="flex flex-col dark:bg-gray-800 dark:border-gray-700">
                                    <label className='text-sm ml-1 mb-1 mx-2 font-bold text-violet-900'>Username</label>
                                    <input disabled defaultValue={currentUser.username} id="username" scope="row" class="px-6 py-2 border mb-2 mx-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />

                                    <label className='text-sm ml-1 mb-1 mx-2 font-bold text-violet-900'>Email</label>
                                    <input disabled defaultValue={currentUser.email} id="email" class="px-6 py-2 border mb-2 mx-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />

                                </div>
                            </div>
                            <div className="flex justify-between mt-3">
                                {/* <span onClick={handleShowDeleteConfirmation} className="text-red-600 cursor-pointer hover:text-red-900 font-semibold">Delete account</span> */}
                                <span onClick={handleShowSignOutConfirmation} className="text-red-600 cursor-pointer p-2 rounded hover:text-red-900 font-semibold hover:bg-red-200 duration-500">Sign out</span>
                            </div>
                            <p className="text-red-700 mt-1">{error ? error : ''}</p>
                            <p className="text-green-700 mt-1">{updateSuccess ? "User is updated successfully!" : ''}</p>
                        </div>
                    </div>
                    <div className='flex flex-col float-right gap-2 w-2/3 rounded border p-3'>
                        <h2 className="text-3xl text-center font-bold">User Profile</h2>
                        <div className="flex flex-col gap-3 ml-2">
                            <div className="flex flex-col">
                                <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Phone number</label>
                                <input disabled defaultValue={currentUser.phonenumber} id="phonenumber" placeholder="phone number..." className="px-6 py-2 border mb-2 rounded font-medium text-sm dark:text-white" />

                                <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Address</label>
                                <input disabled defaultValue={currentUser.address} id="address" placeholder="..." className="px-6 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />

                                <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Department</label>
                                <input disabled defaultValue={currentUser.department} id="department" placeholder="Department" className="px-6 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </Fragment >
    )
}
