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
    const [events, setEvents] = useState([]);
    const [birthdayEvents, setBirthdayEvents] = useState([]);
    const [holidayEvents, setHolidayEvents] = useState([]);
    const [otherEvents, setOtherEvents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const calendarRef = useRef(null);

  // Initialize events
  useEffect(() => {
    // Dark mode detection
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    const handler = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addListener(handler);
    const curYear = moment().format('YYYY');
    const curMonth = moment().format('MM');

    // Calendar Events
    const calendarEvents = {
      id: 1,
      events: [
        {
          id: '1',
          start: `${curYear}-${curMonth}-02`,
          end: `${curYear}-${curMonth}-03`,
          title: 'Spruko Meetup',
          className: "bg-secondary-transparent",
          description: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary'
        },
        {
          id: '2',
          start: `${curYear}-${curMonth}-17`,
          end: `${curYear}-${curMonth}-17`,
          title: 'Design Review',
          className: "bg-info-transparent",
          description: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary'
        },
        {
          id: '3',
          start: `${curYear}-${curMonth}-13`,
          end: `${curYear}-${curMonth}-13`,
          title: 'Lifestyle Conference',
          className: "bg-primary-transparent",
          description: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary'
        }
      ]
    };

    // Birthday Events
    const bdayEvents = {
      id: 2,
      className: "bg-info-transparent",
      textColor: '#fff',
      events: [
        {
          id: '7',
          start: `${curYear}-${curMonth}-04`,
          end: `${curYear}-${curMonth}-04`,
          title: 'Harcates Birthday',
          description: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary'
        },
        {
          id: '8',
          start: `${curYear}-${curMonth}-28`,
          end: `${curYear}-${curMonth}-28`,
          title: 'Bunnysin\'s Birthday',
          description: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary'
        }
      ]
    };

    // Holiday Events
    const hdayEvents = {
      id: 3,
      className: "bg-danger-transparent",
      textColor: '#fff',
      events: [
        {
          id: '10',
          start: `${curYear}-${curMonth}-05`,
          end: `${curYear}-${curMonth}-08`,
          title: 'Festival Day'
        },
        {
          id: '11',
          start: `${curYear}-${curMonth}-18`,
          end: `${curYear}-${curMonth}-19`,
          title: 'Memorial Day'
        },
        {
          id: '12',
          start: `${curYear}-${curMonth}-25`,
          end: `${curYear}-${curMonth}-26`,
          title: 'Diwali'
        }
      ]
    };

    // Other Events
    const othEvents = {
      id: 4,
      className: "bg-info-transparent",
      textColor: '#fff',
      events: [
        {
          id: '13',
          start: `${curYear}-${curMonth}-07`,
          end: `${curYear}-${curMonth}-09`,
          title: 'My Rest Day'
        },
        {
          id: '13',
          start: `${curYear}-${curMonth}-29`,
          end: `${curYear}-${curMonth}-31`,
          title: 'My Rest Day'
        }
      ]
    };

    // Activities
    const actList = [
      {
        date: 'Tuesday, Feb 5, 2024',
        time: '10:00AM - 11:00AM',
        description: 'Discussion with team on project updates.'
      },
      {
        date: 'Monday, Jan 2, 2023',
        status: 'Completed',
        description: 'Review and finalize budget proposal.'
      },
      {
        date: 'Thursday, Mar 8, 2024',
        status: 'Reminder',
        description: 'Prepare presentation slides for client meeting.'
      },
      {
        date: 'Friday, Apr 12, 2024',
        time: '2:00PM - 4:00PM',
        description: 'Training session on new software tools.'
      }
    ];

    setEvents(calendarEvents.events);
    setBirthdayEvents(bdayEvents.events);
    setHolidayEvents(hdayEvents.events);
    setOtherEvents(othEvents.events);
    setActivities(actList);
    setIsLoading(false);

    // Initialize tooltips and popovers
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });

    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl);
    });

    setIsLoading(false);

    return () => darkModeMediaQuery.removeListener(handler);

  }, []);


  const handleEventReceive = (eventInfo) => {
    const newEvent = {
      id: createEventId(),
      title: eventInfo.event.title,
      start: eventInfo.event.startStr,
      end: eventInfo.event.endStr || moment(eventInfo.event.startStr).add(1, 'hour').toISOString(),
      className: eventInfo.event.classNames[0] || 'bg-primary-transparent',
      durationEditable: true, // Permet de modifier la durée
      startEditable: true,   // Permet de modifier le début
      allDay: true           // Rend l'événement sur toute la journée
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  const handleEventResize = (resizeInfo) => {
    // Mettez à jour votre état avec la nouvelle durée
    const updatedEvents = allEvents.map(event => {
      if (event.id === resizeInfo.event.id) {
        return {
          ...event,
          start: resizeInfo.event.startStr,
          end: resizeInfo.event.endStr
        };
      }
      return event;
    });
    
    // Mettez à jour l'état global si nécessaire
    // (adaptez selon comment vous gérez vos événements)
    setEvents(updatedEvents.filter(e => events.some(ev => ev.id === e.id)));
    setBirthdayEvents(updatedEvents.filter(e => birthdayEvents.some(ev => ev.id === e.id)));
    // ... autres catégories d'événements
  };

  useEffect(() => {
    let draggable;
    if (!isLoading) {
      const containerEl = document.getElementById('external-events');
      if (containerEl) {
        new Draggable(containerEl, {
          itemSelector: '.fc-event',
          eventData: function(eventEl) {
            return {
              title: eventEl.innerText,
              className: eventEl.getAttribute('data-class'),
              duration: '1:00', // Durée initiale
              durationEditable: true,
              startEditable: true,
              allDay: true
            };
          }
        });
      }
    }
    return () => {
      if (draggable) {
        draggable.destroy();
      }
    };
  }, [isLoading]);

  const handleEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  };

  const handleDateSelect = (selectInfo) => {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        className: 'bg-primary-transparent'
      });
    }
  };

  const createEventId = () => {
    return String(Date.now());
  };

  const allEvents = [
    ...events,
    ...birthdayEvents,
    ...holidayEvents,
    ...otherEvents
  ];

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
        <title>Full Calendar</title>
      </Helmet>

        <div className="container-fluid">
          {/* Page Header */}
          <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol className="breadcrumb mb-1">
                  <li className="breadcrumb-item"><a href="javascript:void(0);">Apps</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Full Calendar</li>
                </ol>
              </nav>
              <h1 className="page-title fw-medium fs-18 mb-0">Full Calendar</h1>
            </div>
            <div className="btn-list">
              <button className="btn btn-white btn-wave" data-bs-toggle="tooltip" title="Filter events">
                <i className="ri-filter-3-line align-middle me-1 lh-1"></i> Filter
              </button>
              <button className="btn btn-primary btn-wave me-0" data-bs-toggle="tooltip" title="Share calendar">
                <i className="ri-share-forward-line me-1"></i> Share
              </button>
            </div>
          </div>
          {/* End Page Header */}

          <div className="row">
            <div className="col-xl-9">
              <div className="card custom-card">
                <div className="card-header">
                  <div className="card-title">Full Calendar</div>
                </div>
                <div className="card-body">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                  }}
                  editable={true}
                  selectable={true}
                  droppable={true}
                  eventResizableFromStart={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  events={allEvents}
                  eventClick={handleEventClick}
                  select={handleDateSelect}
                  eventDurationEditable={true}
                  eventReceive={handleEventReceive}
                  eventResize={handleEventResize}
                  height="auto"
                />
                </div>
              </div>
            </div>
            
            <div className="col-xl-3">
              {/* All Events Card */}
              <div className="card custom-card">
                <div className="card-header justify-content-between">
                  <div className="card-title">All Events</div>
                  <button className="btn btn-primary btn-wave">
                    <i className="ri-add-line align-middle me-1 fw-medium d-inline-block"></i>
                    Create New Event
                  </button>
                </div>
                <div className="card-body p-0">
                  <div id="external-events" className="mb-0 p-3 list-unstyled column-list">
                    {events.map((event, index) => (
                      <div 
                        key={`event-${index}`}
                        className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event mb-1 ${event.className}`}
                        data-class={event.className}
                      >
                        <div className="fc-event-main">{event.title}</div>
                      </div>
                    ))}
                    {birthdayEvents.map((event, index) => (
                      <div 
                        key={`bday-${index}`}
                        className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event mb-1 bg-primary1-transparent"
                        data-class="bg-primary1-transparent"
                      >
                        <div className="fc-event-main text-primary1">{event.title}</div>
                      </div>
                    ))}
                    {holidayEvents.map((event, index) => (
                      <div 
                        key={`holiday-${index}`}
                        className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event mb-1 bg-primary2-transparent"
                        data-class="bg-primary2-transparent text-primary2"
                      >
                        <div className="fc-event-main text-primary2">{event.title}</div>
                      </div>
                    ))}
                    {otherEvents.map((event, index) => (
                      <div 
                        key={`other-${index}`}
                        className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event mb-1 bg-primary3-transparent"
                        data-class="bg-primary3-transparent text-primary3"
                      >
                        <div className="fc-event-main text-primary3">{event.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Activity Card */}
              <div className="card custom-card">
                <div className="card-header justify-content-between pb-1">
                  <div className="card-title">Activity :</div>
                  <button className="btn btn-primary-light btn-sm btn-wave">View All</button>
                </div>
                <div className="card-body p-0">
                  <div className="p-3 border-bottom" id="full-calendar-activity">
                    <SimpleBar style={{ maxHeight: '300px' }} autoHide={true}>
                      <ul className="list-unstyled mb-0 fullcalendar-events-activity">
                        {activities.map((activity, index) => (
                          <li key={`activity-${index}`} className="mb-3">
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                              <p className="mb-1 fw-medium">{activity.date}</p>
                              {activity.time && (
                                <span className="badge bg-light text-default mb-1">{activity.time}</span>
                              )}
                              {activity.status && (
                                <span className={`badge ${
                                  activity.status === 'Completed' ? 'bg-success' : 
                                  activity.status === 'Reminder' ? 'bg-warning-transparent' : 
                                  'bg-danger-transparent'
                                } mb-1`}>
                                  {activity.status}
                                </span>
                              )}
                            </div>
                            <p className="mb-0 text-muted fs-12">{activity.description}</p>
                          </li>
                        ))}
                      </ul>
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