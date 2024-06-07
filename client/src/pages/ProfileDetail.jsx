import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { IoMdFingerPrint } from "react-icons/io";
import { FaIdCard } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { AiFillWarning } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';


const ProfileDetail = () => {
    const userId = useParams();
    const dispatch = useDispatch()

    const [user, setUser] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [fingerprint, setFingerPrint] = useState(null);
    const [rfid, setRfid] = useState(null);

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

                const biometricsByMethod = data.biometrics.reduce((acc, biometric) => {
                    const { method } = biometric;
                    acc[method] = acc[method] || [];
                    acc[method].push(biometric);
                    return acc;
                }, {});

                setFingerPrint(biometricsByMethod.fingerprint || []);
                setRfid(biometricsByMethod.RFID || []);
            } catch (error) {
                console.error(error);
            }
        };

        // Gọi hàm fetchUserData khi userId.id thay đổi hoặc component được mount
        fetchUserData();

        // Thiết lập interval để fetch dữ liệu mỗi 5 giây (hoặc bất kỳ khoảng thời gian nào bạn muốn)
        const intervalId = setInterval(() => {
            fetchUserData();
        }, 5000);

        // Cleanup: Dừng interval khi component bị hủy
        return () => clearInterval(intervalId);
    }, [userId.id]); // Theo dõi sự thay đổi của userId.id

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        console.log(formData);
    };

    const handleShowDeleteConfirmation = (e) => {
        e.preventDefault();
        setShowDeleteConfirmation(true)
    }

    const handleUpdateUser = async () => {
        try {
            dispatch(updateUserStart());

            // Thêm userID vào formData
            const updatedFormData = {
                ...formData,
                userID: user.userID
            };

            console.log('Request body with userID:', JSON.stringify(updatedFormData));

            const res = await fetch(`/api/user/update/${user.userID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFormData)
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                toast.error(`Update failed: ${data.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                return;
            }
            dispatch(updateUserSuccess(data));
            // Use toast.success for a success message
            toast.success('Update successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            // Reload trang sau khi xóa thành công
            window.location.reload();

            console.log("Update Success After Dispatch:", updateSuccess);
        } catch (error) {
            dispatch(updateUserFailure(error.userID));

            // Use toast.error for an error message
            toast.error(`Update failed: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        console.log("Delete User ID:", user.userID);

        try {
            const res = await fetch(`/api/user/delete/${user.userID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            if (data.success === false) {
                toast.error(`Delete failed: ${data.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                return;
            }
            // Use toast.success for a success message
            toast.success('Delete successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            navigate('/manage');
        } catch (error) {
            toast.error(`Delete failed: ${error.message}`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };

    const handleGetBiometric = async ({ userId, method }) => {
        try {
            const response = await fetch(`/api/user/current-userid/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, method }),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status code: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response: ", data); // You can handle the response data here

            // Use toast.success for a success message
            toast.success('Request successful!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
                onClose: () => {
                    // Reload the page after closing the toast
                    window.location.reload();
                },
            });

        } catch (error) {
            console.error('Error:', error);
            // Use toast.error for an error message
            toast.error('An error occurred while fetching biometric data.', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        }
    };

    const handleDeleteBiometric = async ({ userId, method }) => {
        try {
            const response = await fetch(`/api/user/delete-biometric/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, method }),
            });

            if (response.ok) {
                const data = await response.json();
                // Use toast.success for a success message
                toast.success('Delete successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    onClose: () => {
                        console.log("Response:", data);
                        // Reload the page after a successful delete
                        window.location.reload();
                    },
                });
            } else {
                // Handle non-ok response (e.g., show an error message)
                const errorData = await response.json();
                console.error('Delete failed:', errorData.message);
                toast.error(`Delete failed: ${errorData.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            // Handle fetch error
            console.error('Fetch error:', error);
            toast.error('An error occurred while deleting biometric data.', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        }
    };

    return (
        <>
            <div className='w-44 flex float-left mt-24' >
                <button className="bg-gray-700 w-full py-2 ml-20 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
            {showDeleteConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                    <div className=" modal-container bg-white w-96 h-46 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div>
                            <AiFillWarning className='text-red-700 self-center text-4xl font-semibold mx-auto mt-2' />
                            <h5 className="text-center p-1 text-red-800 font-semibold" id="exampleModalLabel">Delete Confirmation</h5>
                        </div>
                        <div className="text-center p-1 text-slate-600 font-semibold">
                            <p>Are you sure you want to delete this account?</p>
                        </div>
                        <div className=" flex justify-between mx-10 my-3">
                            <button onClick={(e) => handleDeleteUser(e)} className="w-32 p-1 rounded-3xl bg-red-700 text-white">Confirm</button>
                            <button onClick={() => setShowDeleteConfirmation(false)} className="w-32 p-2 rounded-3xl bg-slate-700 text-white">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <form className="flex h-1/2 flex-col">
                <div className="mx-4 mt-24 flex flex-row justify-center bg-white p-4 rounded-lg shadow-lg text-slate-600 gap-3">
                    <div className='w-1/3 rounded-md justify-center flex border'>
                        <div className='flex flex-col w-full mx-4'>
                            <div className='flex justify-center h-1/6'>
                                <img src={user.avatar} alt="profile avatar" className='h-full mt-3 rounded-full' />
                            </div>

                            <div className='mt-4 w-full'>
                                <tr class="flex flex-col dark:bg-gray-800 dark:border-gray-700">
                                    <th className='w-2/3 text-sm mx-2 text-violet-900'>Username</th>
                                    <td scope="row" class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white">
                                        {user.username}
                                    </td>
                                    <th className='w-2/3 text-sm mx-2 text-violet-900'>Email</th>
                                    <input onChange={handleChange} defaultValue={user.email} id="email" placeholder="email..." class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />
                                    <th className='w-2/3 text-sm mx-2 text-violet-900'>Role</th>
                                    <input onChange={handleChange} defaultValue={user.role} id="role" placeholder="role..." class="px-2 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />

                                    <div className='flex flex-row justify-between'>
                                        <div className='flex w-2/3' >
                                            <button onClick={(e) => handleShowDeleteConfirmation(e)} className="w-1/2 flex justify-center items-center bg-red-500 py-2 shadow-xl rounded-lg text-white hover:bg-red-800 duration-500">
                                                <FaRegTrashAlt />
                                            </button>
                                        </div>
                                        <div className='flex w-2/3 justify-end' >
                                            <button onClick={handleUpdateUser} className="w-1/2 flex justify-center items-center bg-green-600 py-2 shadow-xl rounded-lg text-white hover:bg-green-800 duration-500">
                                                <FaCheck />
                                            </button>
                                        </div>

                                    </div>
                                    {updateSuccess && (
                                        <span class="mt-4 text-green-600">Update successfully!</span>
                                    )}
                                </tr>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col float-right gap-2 w-2/3 rounded border p-3'>
                        <h2 className="text-3xl text-center font-bold">User Profile</h2>
                        <div className="flex flex-col float-left gap-3 ml-2">
                            <div className="flex flex-col gap-3 ml-2">
                                <div className="flex flex-col">
                                    <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Phone number</label>
                                    <input onChange={handleChange} defaultValue={user.phonenumber} id="phonenumber" placeholder="phone number..." className="px-6 py-2 border mb-2 rounded font-medium text-sm dark:text-white" />

                                    <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Address</label>
                                    <input onChange={handleChange} defaultValue={user.address} id="address" placeholder="..." className="px-6 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />

                                    <label className='text-sm ml-1 mb-1 font-bold text-violet-900'>Department</label>
                                    <input onChange={handleChange} defaultValue={user.department} id="department" placeholder="Department" className="px-6 py-2 border mb-2 rounded font-medium text-sm whitespace-nowrap dark:text-white" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-row'>
                                    <IoMdFingerPrint className='w-6 h-6 text-gray-500' />
                                    <th className='text-sm mx-2 text-violet-900'>Fingerprint</th>
                                </div>

                                {fingerprint && fingerprint.length > 0 ? (
                                    <div className='flex flex-row items-center'>
                                        <td className="w-1/2 px-2 py-2 border-1 border-green-600 bg-green-100 rounded font-medium text-sm text-green-600 whitespace-nowrap dark:text-white">Đã có dữ liệu</td>
                                        <div className='flex self-center text-center'>
                                            <button onClick={() => handleGetBiometric({ userId: user.userID, method: 'fingerprint' })} className='p-2 h-9 w-16 justify-center items-center ml-2 flex rounded-md text-center text-white bg-green-600 hover:bg-green-900 hover:scale-105 duration-500'>
                                                Update
                                            </button>
                                        </div>
                                        <div className='flex self-center items-center text-center gap-2'>
                                            <button onClick={() => handleDeleteBiometric({ userId: user.userID, method: 'fingerprint' })} className='p-2 h-9 w-16 justify-center items-center ml-2 flex rounded-md text-center text-white bg-red-600 hover:bg-red-900 hover:scale-105 duration-500'>
                                                <span>Delete</span>
                                            </button>
                                            {deleteSuccess && (
                                                <span className='text-md text-green-600'>Delete succeed!</span>
                                            )}
                                        </div>


                                    </div>
                                ) : (
                                    // Ngược lại, hiển thị chuỗi "Chưa có"
                                    <div className='flex flex-row items-center'>
                                        <td className="w-1/2 px-2 py-2 border-1 border-red-600 bg-red-100 rounded font-medium text-sm text-left text-red-600 whitespace-nowrap dark:text-white">Chưa có dữ liệu</td>
                                        <Link onClick={() => handleGetBiometric({ userId: user.userID, method: 'fingerprint' })} className='flex self-center items-center text-center'>
                                            <button className='p-2 h-9 w-12 justify-center items-center ml-2 flex rounded-md text-center text-white bg-green-600 hover:bg-green-900 hover:scale-105 duration-500'>
                                                <FaPlus />
                                            </button>
                                        </Link>
                                    </div>
                                )}

                                <div className='flex flex-row'>
                                    <FaIdCard className='w-6 h-6 text-gray-500' />
                                    <th className='text-sm mx-2 text-violet-900'>RFID</th>
                                </div>
                                {rfid && rfid.length > 0 ? (
                                    // Nếu card tồn tại và có dữ liệu, hiển thị nội dung tương ứng
                                    <div className='flex flex-row items-center'>
                                        <td className="w-1/2 px-2 py-2 border-1 border-green-600 bg-green-100 rounded font-medium text-sm text-left text-green-600 whitespace-nowrap dark:text-white">Đã có dữ liệu</td>
                                        <Link onClick={() => handleGetBiometric({ userId: user.userID, method: 'RFID' })} className='flex self-center text-center'>
                                            <button className='p-2 h-9 w-16 justify-center items-center ml-2 flex rounded-md text-center text-white bg-green-600 hover:bg-green-900 hover:scale-105 duration-500'>
                                                Update
                                            </button>
                                        </Link>
                                        <Link onClick={() => handleDeleteBiometric({ userId: user.userID, method: 'RFID' })} className='flex self-center text-center'>
                                            <button className='p-2 h-9 w-16 justify-center items-center ml-2 flex rounded-md text-center text-white bg-red-600 hover:bg-red-900 hover:scale-105 duration-500'>
                                                Delete
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    // Ngược lại, hiển thị chuỗi "Chưa có dữ liệu"
                                    <div className='flex flex-row items-center'>
                                        <td className="w-1/2 px-2 py-2 border-1 border-red-600 bg-red-100 rounded font-medium text-sm text-left text-red-600 whitespace-nowrap dark:text-white">Chưa có dữ liệu</td>
                                        <Link onClick={() => handleGetBiometric({ userId: user.userID, method: 'RFID' })} className='flex self-center text-center'>
                                            <button className='p-2 h-9 w-12 justify-center items-center ml-2 flex rounded-md text-center text-white bg-green-600 hover:bg-green-900 hover:scale-105 duration-500'>
                                                <FaPlus />
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    );
};

export default ProfileDetail;
