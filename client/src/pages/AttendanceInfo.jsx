import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function AttendanceDetail() {
    const { currentUser } = useSelector(state => state.user);
    const [user, setUser] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
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

        const fetchEventData = async () => {
            try {
                const response = await fetch(`/api/user/attendance-events/${userId.id}`);
                const data = await response.json();

                if (!response.ok || data.success === false) {
                    console.error(data.message || 'Error fetching events');
                    setError(data.message || 'Error fetching events');
                    return;
                }

                setEvents(data.events);
            } catch (error) {
                console.error(error);
                setError('Error fetching events');
            }
        };

        fetchUserData();
        fetchEventData();
    }, [userId]);

    const handleEventClick = (info) => {
        // Xử lý khi người dùng nhấp vào một sự kiện
        console.log('Event click', info.event);
        alert("hi")
    };

    return (
        <Fragment>
            <div className="max-w-sm mx-auto mt-32 z-50"></div >
            <div className='w-1/6 float-left mt-8 flex' >
                <button className="bg-gray-700 w-1/2 py-2 ml-8 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate('/manage')}>
                    Go Back
                </button>
            </div>
            <div className='w-3/4 float-left'>


                <div className="max-w-screen-lg mx-auto mt-8">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            start: 'today prev,next',
                            center: 'title',
                            end: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        themeSystem="bootstrap"
                        buttonText={{
                            today: 'Today',
                            month: 'Month',
                            week: 'Week',
                            day: 'Day',
                            listWeek: 'List Week',
                            listMonth: 'List Month',
                            listYear: 'List Year'
                        }}
                        dayMaxEvents={true}
                        eventColor="#4caf50"
                        eventTextColor="#fff"
                        height="auto"
                        className="bg-white rounded-lg shadow-md p-4" // Thêm lớp Tailwind CSS cho giao diện hiện đại
                    />
                </div>



            </div>
        </Fragment>
    );
}
