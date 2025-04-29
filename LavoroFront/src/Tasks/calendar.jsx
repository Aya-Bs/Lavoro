import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Helmet } from 'react-helmet';
import { Tooltip, Popover } from 'bootstrap';
import { Draggable } from '@fullcalendar/interaction';

const Calendar = () => {
    const [tasks, setTasks]  = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const calendarRef = useRef(null);

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`http://localhost:3000/tasks/getTasksList/67ffe3356322c74c455340ad`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    setTasks(data.data);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Dark mode detection
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);
        const handler = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addListener(handler);

        // Initialize tooltips and popovers
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));

        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map((popoverTriggerEl) => new Popover(popoverTriggerEl));

        return () => darkModeMediaQuery.removeListener(handler);
    }, []);

    // Transform tasks to calendar events with correct date ranges
    const transformTasksToEvents = (tasks) => {
        return tasks.map(task => {
            let className = '';
            let color = '';
            
            if (task.status === 'In Progress') {
                className = 'bg-warning-transparent';
                color = 'orange';
            } else if (task.status === 'Completed') {
                className = 'bg-success-transparent';
                color = 'green';
            } else if (task.status === 'Not Started') {
                if (task.priority === 'High') {
                    className = 'bg-danger-transparent';
                    color = 'red';
                } else if (task.priority === 'Medium') {
                    className = 'bg-info-transparent';
                    color = 'blue';
                } else {
                    className = 'bg-secondary-transparent';
                    color = 'gray';
                }
            }

            // Parse dates
            const startDate = task.start_date ? new Date(task.start_date) : null;
            const endDate = task.deadline ? new Date(task.deadline) : null;

            // Determine event dates
            let eventStart, eventEnd;
            
            if (startDate && endDate) {
                // Use the full range between start date and deadline
                eventStart = moment.min(moment(startDate), moment(endDate));
                eventEnd = moment.max(moment(startDate), moment(endDate)).add(1, 'day');
            } else if (startDate) {
                // Only start date available - show as single day
                eventStart = moment(startDate);
                eventEnd = moment(startDate).add(1, 'day');
            } else if (endDate) {
                // Only deadline available - show as single day
                eventStart = moment(endDate);
                eventEnd = moment(endDate).add(1, 'day');
            } else {
                // No dates available - use today
                eventStart = moment();
                eventEnd = moment().add(1, 'day');
            }

            return {
                id: task._id,
                title: task.title,
                start: eventStart.toISOString(),
                end: eventEnd.toISOString(),
                className,
                color,
                extendedProps: {
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    projectId: task.project_id,
                    tags: task.tags,
                    startDate: startDate ? startDate.toLocaleDateString() : 'Not set',
                    deadline: endDate ? endDate.toLocaleDateString() : 'Not set'
                },
                allDay: true
            };
        });
    };

    const handleEventClick = (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
            clickInfo.event.remove();
        }
    };

    const handleDateSelect = (selectInfo) => {
        const title = prompt('Please enter a new title for your event');
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: String(Date.now()),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
                className: 'bg-primary-transparent'
            });
        }
    };

    const allEvents = transformTasksToEvents(tasks);

    if (isLoading) {
        return (
            <div id="loader" className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`page ${isDarkMode ? 'dark-mode' : ''}`}>
            <Helmet>
                <title>Task Calendar</title>
            </Helmet>

            <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
                    <div>
                        <nav>
                            <ol className="breadcrumb mb-1">
                                <li className="breadcrumb-item"><a href="javascript:void(0);">Apps</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Task Calendar</li>
                            </ol>
                        </nav>
                        <h1 className="page-title fw-medium fs-18 mb-0">Task Calendar</h1>
                    </div>
                    <div className="btn-list">
                        <button className="btn btn-white btn-wave" data-bs-toggle="tooltip" title="Filter tasks">
                            <i className="ri-filter-3-line align-middle me-1 lh-1"></i> Filter
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-9">
                        <div className="card custom-card">
                            <div className="card-header">
                                <div className="card-title">Task Timeline</div>
                            </div>
                            <div className="card-body">
                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                    }}
                                    editable={true}
                                    selectable={true}
                                    events={allEvents}
                                    eventClick={handleEventClick}
                                    select={handleDateSelect}
                                    height="auto"
                                    eventDisplay="block"
                                    displayEventTime={false}
                                    dayMaxEventRows={true}
                                    eventMinHeight={30}
                                    eventContent={(arg) => (
                                        <div className="fc-event-content">
                                            <div className="fc-event-title">{arg.event.title}</div>
                                            <div className="fc-event-status">
                                                {arg.event.extendedProps.status}
                                            </div>
                                        </div>
                                    )}
                                    eventDidMount={(arg) => {
                                        new Tooltip(arg.el, {
                                            title: `
                                                <strong>${arg.event.title}</strong><br/>
                                                <em>${arg.event.extendedProps.description || 'No description'}</em><br/>
                                                <strong>Status:</strong> ${arg.event.extendedProps.status}<br/>
                                                <strong>Priority:</strong> ${arg.event.extendedProps.priority}<br/>
                                                <strong>Start:</strong> ${arg.event.extendedProps.startDate}<br/>
                                                <strong>Deadline:</strong> ${arg.event.extendedProps.deadline}<br/>
                                                ${arg.event.extendedProps.tags ? '<strong>Tags:</strong> ' + arg.event.extendedProps.tags.join(', ') : ''}
                                            `,
                                            html: true,
                                            placement: 'top',
                                            trigger: 'hover',
                                            container: 'body'
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-xl-3">
                        <div className="card custom-card">
                            <div className="card-header justify-content-between">
                                <div className="card-title">My Tasks</div>
                            </div>
                            <div className="card-body p-0">
                                <div className="p-3">
                                    <SimpleBar style={{ maxHeight: '400px' }} autoHide={true}>
                                        {tasks.map((task, index) => {
                                            let className = '';
                                            if (task.status === 'In Progress') {
                                                className = 'bg-warning-transparent';
                                            } else if (task.status === 'Completed') {
                                                className = 'bg-success-transparent';
                                            } else if (task.priority === 'High') {
                                                className = 'bg-danger-transparent';
                                            } else if (task.priority === 'Medium') {
                                                className = 'bg-info-transparent';
                                            } else {
                                                className = 'bg-secondary-transparent';
                                            }

                                            const startDate = task.start_date ? new Date(task.start_date) : null;
                                            const deadline = task.deadline ? new Date(task.deadline) : null;

                                            return (
                                                <div key={`task-${index}`} className={`mb-3 p-2 rounded-2 ${className}`}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h6 className="mb-0">{task.title}</h6>
                                                        <span className={`badge ${
                                                            task.status === 'In Progress' ? 'bg-warning' : 
                                                            task.status === 'Completed' ? 'bg-success' : 
                                                            'bg-info'
                                                        }`}>
                                                            {task.status}
                                                        </span>
                                                    </div>
                                                    {task.description && (
                                                        <p className="mb-1 text-muted fs-12">{task.description}</p>
                                                    )}
                                                    <div className="d-flex justify-content-between fs-12">
                                                        <span>Start: {startDate ? startDate.toLocaleDateString() : 'Not set'}</span>
                                                        <span>Deadline: {deadline ? deadline.toLocaleDateString() : 'Not set'}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </SimpleBar>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;