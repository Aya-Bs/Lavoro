import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

const UpcomingDeadlinesCarousel = () => {
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/upcomingDl');
        
        // Safely handle the response data
        const projects = response.data?.data || [];
        setUpcomingProjects(projects);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching upcoming projects:', err);
        setError(err.message || 'Failed to load upcoming deadlines');
        setLoading(false);
      }
    };

    fetchUpcomingProjects();
  }, []);

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Normalize to end of day
    
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  };
  
  const handleSendReminder = async (projectId, endDate) => {
    const daysRemaining = getDaysRemaining(endDate);
    
    if (daysRemaining > 14) {
      Swal.fire({
        icon: 'error',
        title: 'Too Early',
        text: `This project's deadline is in ${daysRemaining} days`,
        footer: 'Reminders can only be sent for deadlines within 2 weeks'
      });
      return;
    }
  
    try {
      await axios.post(`http://localhost:3000/admin/remind/${projectId}`);
      Swal.fire('Success!', 'Reminder sent to manager', 'success');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to send', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'primary';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center py-4">Loading upcoming deadlines...</div>;
  if (error) return <div className="text-center py-4 text-danger">Error: {error}</div>;

  return (
    <div className="col-xl-12">
      <div className="swiper swiper-basic swiper-initialized swiper-horizontal swiper-backface-hidden">
        <div className="swiper-wrapper">
          {upcomingProjects.length > 0 ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={'auto'}
              className="swiper-container"
            >
              {upcomingProjects.map((project) => (
                <SwiperSlide key={project._id} className="swiper-slide" style={{ width: '300px' }}>
                  <div className="card custom-card overflow-hidden">
                    <div className="card-body">
                      <div className="d-flex gap-2 flex-wrap align-items-start justify-content-between">
                        <div className="d-flex flex-fill align-items-center">
                          <div className="me-2">
                            <span className={`avatar avatar-rounded bg-${getPriorityColor(project.priority)}-transparent p-2 avatar-sm`}>
                              <i className={`bi bi-calendar-event text-${getPriorityColor(project.priority)}`}></i>
                            </span>
                          </div>
                          <div className="">
                            <span className="d-block text-default fs-14 fw-semibold">{project.name}</span>
                            <span className="d-block text-muted fs-12">{project.client}</span>
                          </div>
                        </div>
                        <div className="fs-12 text-end">
                          <span className="d-block text-muted">Status</span>
                          <span className="d-block fw-medium fs-14">{project.status}</span>
                        </div>
                      </div>
                      <div className="d-flex flex-fill align-items-end gap-2 justify-content-between mt-3">
                        <div>
                          <span className="d-block text-muted">End Date:</span>
                          <span className="d-block ms-auto fs-15 fw-medium">
                            {formatDate(project.end_date)}
                            <i className={`ri-arrow-up-s-fill text-${project.status === 'In Progress' ? 'warning' : 'success'} lh-1 align-middle fs-20 ms-1`}></i>
                          </span>
                        </div>
                        <div>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSendReminder(project._id)}
                          >
                            <i className="bi bi-envelope me-1"></i> Remind
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="swiper-slide" style={{ width: '100%' }}>
              <div className="card custom-card overflow-hidden">
                <div className="card-body text-center py-4">
                  <i className="bi bi-check2-circle fs-3 text-success"></i>
                  <p className="mt-2 mb-0">No projects ending in the next two weeks</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingDeadlinesCarousel;