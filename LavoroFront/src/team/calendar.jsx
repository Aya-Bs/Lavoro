import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Initialize the localizer for the calendar
const localizer = momentLocalizer(moment);

function FullCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  // Sample events data
  const events = [
    {
      title: "Spruko Meetup",
      start: new Date(2025, 3, 2),
      end: new Date(2025, 3, 2),
      className: "bg-purple-600",
    },
    {
      title: "Harcates Birthday",
      start: new Date(2025, 3, 3),
      end: new Date(2025, 3, 3),
      className: "bg-blue-500",
    },
    {
      title: "Music Festival",
      start: new Date(2025, 3, 3),
      end: new Date(2025, 3, 3),
      className: "bg-green-500",
    },
    {
      title: "Festival Day",
      start: new Date(2025, 3, 4),
      end: new Date(2025, 3, 4),
      className: "bg-red-500",
    },
    {
      title: "Music Festival",
      start: new Date(2025, 3, 6),
      end: new Date(2025, 3, 6),
      className: "bg-green-500",
    },
    {
      title: "Festival Day",
      start: new Date(2025, 3, 6),
      end: new Date(2025, 3, 6),
      className: "bg-red-500",
    },
    {
      title: "My Rest Day",
      start: new Date(2025, 3, 7),
      end: new Date(2025, 3, 7),
      className: "bg-blue-500",
    },
    {
      title: "Lifestyle Conference",
      start: new Date(2025, 3, 13),
      end: new Date(2025, 3, 13),
      className: "bg-indigo-500",
    },
    {
      title: "Design Review",
      start: new Date(2025, 3, 17),
      end: new Date(2025, 3, 17),
      className: "bg-blue-500",
    },
    {
      title: "Memorial Day",
      start: new Date(2025, 3, 18),
      end: new Date(2025, 3, 18),
      className: "bg-red-500",
    },
    {
      title: "Team Weekly Brownbag",
      start: new Date(2025, 3, 21),
      end: new Date(2025, 3, 21),
      className: "bg-yellow-500",
    },
    {
      title: "Attend Lea's Wedding",
      start: new Date(2025, 3, 23),
      end: new Date(2025, 3, 23),
      className: "bg-green-500",
    },
    {
      title: "Diwali",
      start: new Date(2025, 3, 24),
      end: new Date(2025, 3, 24),
      className: "bg-red-500",
    },
    {
      title: "Bunnysin's Birthday",
      start: new Date(2025, 3, 27),
      end: new Date(2025, 3, 27),
      className: "bg-blue-500",
    },
    {
      title: "My Rest Day",
      start: new Date(2025, 3, 28),
      end: new Date(2025, 3, 28),
      className: "bg-blue-500",
    },
    {
      title: "Lee shin's Birthday",
      start: new Date(2025, 3, 30),
      end: new Date(2025, 3, 30),
      className: "bg-blue-500",
    },
  ];

  // Event categories
  const eventCategories = [
    { name: "Calendar Events", color: "event-primary" },
    { name: "Birthday Events", color: "event-pink" },
    { name: "Holiday Calendar", color: "event-purple" },
    { name: "Office Events", color: "event-orange" },
    { name: "Other Events", color: "event-gray" },
    { name: "Festival Events", color: "event-red" },
    { name: "Timeline Events", color: "event-green" },
    { name: "Others Events", color: "event-blue" },
  ];

  // Activity data
  const activities = [
    {
      date: "Tuesday, Feb 5, 2024",
      time: "10:00AM - 11:00AM",
      description: "Discussion with team on project updates.",
      status: { type: "time", label: "10:00AM - 11:00AM" },
    },
    {
      date: "Monday, Jan 2, 2023",
      time: "",
      description: "Review and finalize budget proposal.",
      status: { type: "completed", label: "Completed" },
    },
    {
      date: "Thursday, Mar 8, 2024",
      time: "",
      description: "Prepare presentation slides for client meeting.",
      status: { type: "reminder", label: "Reminder" },
    },
    {
      date: "Friday, Apr 12, 2024",
      time: "2:00PM - 4:00PM",
      description: "Training session on new software tools.",
      status: { type: "time", label: "2:00PM - 4:00PM" },
    },
    {
      date: "Saturday, Mar 16, 2024",
      time: "",
      description: "Submit quarterly report to management.",
      status: { type: "due", label: "Due Date" },
    },
  ];

  const getStatusClass = (type) => {
    switch (type) {
      case "completed":
        return "badge-success";
      case "reminder":
        return "badge-warning";
      case "due":
        return "badge-danger";
      default:
        return "badge-light";
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="breadcrumb-container">
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="#">Apps</a></li>
              <li className="breadcrumb-item active">Full Calendar</li>
            </ol>
          </nav>
          <h1 className="page-title">Full Calendar</h1>
        </div>
        <div className="btn-list">
          <button className="btn btn-white">
            <i className="ri-filter-3-line"></i> Filter
          </button>
          <button className="btn btn-primary">
            <i className="ri-share-forward-line"></i> Share
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="row">
          {/* Calendar Section */}
          <div className="col-xl-9">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Full Calendar</div>
              </div>
              <div className="card-body">
                <div className="calendar-controls">
                  <div className="calendar-nav">
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setCurrentDate(moment(currentDate).subtract(1, "month").toDate())}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setCurrentDate(moment(currentDate).add(1, "month").toDate())}
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      today
                    </button>
                  </div>
                  
                  <h2 className="calendar-title">{moment(currentDate).format("MMMM YYYY")}</h2>
                  
                  <div className="calendar-views">
                    <button 
                      className={`btn btn-sm ${view === "month" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setView("month")}
                    >
                      month
                    </button>
                    <button 
                      className={`btn btn-sm ${view === "week" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setView("week")}
                    >
                      week
                    </button>
                    <button 
                      className={`btn btn-sm ${view === "day" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setView("day")}
                    >
                      day
                    </button>
                    <button 
                      className={`btn btn-sm ${view === "agenda" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => setView("agenda")}
                    >
                      list
                    </button>
                  </div>
                </div>

                <div className="calendar-container">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={setView}
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    eventPropGetter={(event) => ({
                      className: event.className,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-xl-3">
            {/* All Events */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">All Events</div>
                <button className="btn btn-primary">
                  <i className="ri-add-line"></i> Create New Event
                </button>
              </div>
              <div className="card-body">
                <ul id="external-events" className="event-list">
                  {eventCategories.map((category, index) => (
                    <li key={index} className={`event-item ${category.color}`}>
                      <div className="event-content">{category.name}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Activity */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Activity :</div>
                <button className="btn btn-link">View All</button>
              </div>
              <div className="card-body">
                <ul className="activity-list">
                  {activities.map((activity, index) => (
                    <li key={index} className="activity-item">
                      <div className="activity-header">
                        <p className="activity-date">{activity.date}</p>
                        <span className={`badge ${getStatusClass(activity.status.type)}`}>
                          {activity.status.label}
                        </span>
                      </div>
                      <p className="activity-description">{activity.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullCalendar;