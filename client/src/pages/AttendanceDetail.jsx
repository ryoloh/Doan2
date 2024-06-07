import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment-timezone';

export default function AttendanceDetail() {
    const { currentUser } = useSelector(state => state.user);
    const [user, setUser] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [data, setData] = useState([
        {
            title: '',
            start: '', // Thay thế bằng thuộc tính thực tế trong dữ liệu của bạn
            end: '',   // Thay thế bằng thuộc tính thực tế trong dữ liệu của bạn
        },
        {
            title: '',
            start: '', // Thay thế bằng thuộc tính thực tế trong dữ liệu của bạn
            end: '',   // Thay thế bằng thuộc tính thực tế trong dữ liệu của bạn
        },
    ]);

    const navigate = useNavigate();
    const userId = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user/attendance-detail/${userId.id}`);
                const data = await response.json();

                if (!response.ok || data.success === false) {
                    console.error(data.message || 'User not found');
                    setError(data.message || 'User not found');
                    return;
                }

                setUser(data);
            } catch (error) {
                console.error(error);
                setError('Error fetching user data');
            }
        };

        const fetchAttendanceData = async () => {
            try {
                const response = await fetch(`/api/user/get-attendance-info/${userId.id}`);
                const responseData = await response.json();

                if (response.ok) {
                    if (responseData.success !== false) {
                        console.log('hddh: ', responseData);

                        // Tạo mảng events với dữ liệu chấm công vào làm và tan làm (nếu có)
                        const events = [];

                        // Xử lý sự kiện chấm công vào làm
                        if (responseData.attendanceIn) {
                            responseData.attendanceIn.forEach((attendanceInEvent) => {
                                const timeInLog = attendanceInEvent.TimeIn;
                                console.log('attendanceInEvent: ', attendanceInEvent);
                                const timeIn = new Date(timeInLog.slice(0, -1))
                                console.log('timeIn: ', timeIn);
                                const isLate = timeIn.getHours() > 8;

                                events.push({
                                    title: isLate ? 'Trễ' : 'Checkin',
                                    start: timeIn,
                                    end: timeIn,
                                    color: isLate ? 'red' : 'green', // Màu sắc cho sự kiện chấm công vào làm
                                });
                            });
                        }

                        // Xử lý sự kiện chấm công tan làm
                        if (responseData.attendanceOut) {
                            responseData.attendanceOut.forEach((attendanceOutEvent) => {
                                const timeOutLog = attendanceOutEvent.TimeOut;
                                console.log('attendanceOutEvent: ', attendanceOutEvent);
                                const timeOut = new Date(timeOutLog.slice(0, -1))
                                const isEarly = timeOut.getHours() < 17;

                                events.push({
                                    title: isEarly ? 'Sớm' : 'Checkout',
                                    start: timeOut,
                                    end: timeOut,
                                    color: isEarly ? 'red' : 'green', // Màu sắc cho sự kiện chấm công tan làm
                                });
                            });
                        }

                        // Sử dụng events cho FullCalendar
                        setData(events);
                    } else {
                        console.error(responseData.message || 'Lỗi khi lấy dữ liệu chấm công');
                        // Nếu có lỗi, giữ nguyên data hiện tại
                    }
                } else {
                    console.error('Lỗi khi lấy dữ liệu chấm công');
                    // Nếu có lỗi, giữ nguyên data hiện tại
                }
            } catch (error) {
                console.error(error);
                // Nếu có lỗi, giữ nguyên data hiện tại
            }
        };











        fetchUserData();
        fetchAttendanceData();
    }, [userId]);

    const handleEventClick = (info) => {
        // Xử lý khi người dùng nhấp vào một sự kiện
        console.log('Event click', info.event);
        // Hiển thị thông tin chi tiết sự kiện (ví dụ: modal)
    };

    return (
        <Fragment>
            <div className="max-w-sm mx-auto mt-32 z-50"></div>
            <div className='w-1/6 float-left mt-2 ml-2 flex' >
                <button className="bg-gray-700 w-1/2 py-2 ml-20 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate('/manage')}>
                    Go Back
                </button>
            </div>
            <div className='w-2/3 float-left ml-2 mr-2'>
                <div className="flex flex-col">
                    <span>{attendanceData.status}</span>
                    <span>{attendanceData.TimeIn}</span>
                    <span>{attendanceData.BiometricMethod}</span>
                </div>

                <div className="max-w-screen-lg mx-auto mt-8">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek" // Chọn chế độ xem theo tuần với giờ
                        events={data}
                        headerToolbar={{
                            start: 'today prev,next',
                            center: 'title',
                            end: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        themeSystem="bootstrap"
                        buttonText={{
                            today: 'Today',
                            month: 'Month',
                            week: 'Week',
                            day: 'Day',
                            listWeek: 'List Week',
                            listMonth: 'List Month',
                            listYear: 'List Year',
                        }}
                        dayMaxEvents={true}
                        eventColor="#4caf50"
                        eventTextColor="#fff"
                        height="auto"
                        className="bg-white rounded-lg shadow-md p-4"
                    />
                </div>
            </div>
        </Fragment>
    );
}
