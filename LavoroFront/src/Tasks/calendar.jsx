"use client"

import { useState, useEffect, useRef } from "react"
import moment from "moment"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { Tooltip, Popover } from "bootstrap"
import { Draggable } from "@fullcalendar/interaction"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Calendar = () => {
  const [allTasks, setAllTasks] = useState([])
  const [calendarTasks, setCalendarTasks] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const calendarRef = useRef(null)
  const draggableRef = useRef(null)
  const navigate = useNavigate()

  // Service intégré pour les tâches
  const taskService = {
    getTasksList: async (userId) => {
      const token = localStorage.getItem("token")
      const response = await axios.get(`http://localhost:3000/tasks/getTasksList/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      return response.data
    },
    updateTaskCalendarDates: async (taskId, start, end, userId) => {
      const token = localStorage.getItem("token")
      const data = { start, end, userId }
      if (start !== undefined) data.start = start
      if (end !== undefined) data.end = end

      const response = await axios.put(`http://localhost:3000/tasks/updateCalendarDates/${taskId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      return response.data
    },
  }

  // Fetch tasks from API
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No token found")
        }

        const userResponse = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })

        if (userResponse.data) {
          setUser(userResponse.data)

          const tasksResponse = await taskService.getTasksList(userResponse.data._id)
          if (tasksResponse.success) {
            const tasks = tasksResponse.data

            // Pour les managers: utiliser start_date/deadline pour le calendrier
            // Pour les développeurs: utiliser calendar_dates pour le calendrier
            if (userResponse.data.role === "team_manager") {
              setCalendarTasks(tasks.filter((task) => task.start_date || task.deadline))
              setAllTasks(tasks.filter((task) => !task.start_date && !task.deadline))
            } else {
              setCalendarTasks(tasks.filter((task) => task.calendar_dates?.start))
              setAllTasks(tasks.filter((task) => !task.calendar_dates?.start))
            }
          }
        } else {
          navigate("/signin")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/signin")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndTasks()
  }, [navigate])

  // Initialize draggable and dark mode
  useEffect(() => {
    if (!isLoading && user) {
      const containerEl = document.getElementById("external-events")
      if (containerEl) {
        draggableRef.current = new Draggable(containerEl, {
          itemSelector: ".fc-event",
          eventData: (eventEl) => {
            const taskId = eventEl.getAttribute("data-task-id")
            const task = allTasks.find((t) => t._id === taskId)

            // Pour les managers: utiliser start_date/deadline comme dates par défaut
            // Pour les développeurs: utiliser la date actuelle comme date par défaut
            let start, end

            if (user.role === "team_manager") {
              start = task.start_date ? new Date(task.start_date) : new Date()
              end = task.deadline ? new Date(task.deadline) : moment(start).add(1, "day").toDate()
            } else {
              start = new Date()
              end = moment(start).add(1, "day").toDate()
            }

            return {
              id: taskId,
              title: task.title,
              start: start,
              end: end,
              className: getTaskClassName(task),
              color: getTaskColor(task),
              extendedProps: {
                ...task,
                isCalendarEvent: false,
              },
              allDay: true,
            }
          },
        })
      }

      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      setIsDarkMode(darkModeMediaQuery.matches)
      const handler = (e) => setIsDarkMode(e.matches)
      darkModeMediaQuery.addListener(handler)

      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))

      const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      popoverTriggerList.map((popoverTriggerEl) => new Popover(popoverTriggerEl))

      return () => {
        darkModeMediaQuery.removeListener(handler)
        if (draggableRef.current) {
          draggableRef.current.destroy()
        }
      }
    }
  }, [isLoading, allTasks, user])

  // Appliquer directement les styles au DOM lorsque isDarkMode change
  useEffect(() => {
    if (calendarRef.current) {
      const calendarEl = calendarRef.current.elRef.current
      if (calendarEl) {
        const headerCells = calendarEl.querySelectorAll(".fc-col-header, .fc-col-header-cell")
        const headerTexts = calendarEl.querySelectorAll(".fc-col-header-cell-cushion")

        if (isDarkMode) {
          headerCells.forEach((cell) => {
            cell.style.backgroundColor = "#121212"
            cell.style.borderColor = "rgba(255, 255, 255, 0.2)"
          })

          headerTexts.forEach((text) => {
            text.style.color = "#ffffff"
          })
        } else {
          headerCells.forEach((cell) => {
            cell.style.backgroundColor = "#ffffff"
            cell.style.borderColor = "#ddd"
          })

          headerTexts.forEach((text) => {
            text.style.color = "#212529"
          })
        }
      }
    }
  }, [isDarkMode, calendarTasks]) // Dépend aussi de calendarTasks pour s'assurer que le calendrier est rendu

  const getTaskClassName = (task) => {
    if (task.status === "In Progress") {
      return "bg-warning-transparent"
    } else if (task.status === "Done") {
      return "bg-success-transparent"
    } else if (task.status === "Not Started") {
      if (task.priority === "High") {
        return "bg-danger-transparent"
      } else if (task.priority === "Medium") {
        return "bg-info-transparent"
      } else {
        return "bg-secondary-transparent"
      }
    }
    return "bg-primary-transparent"
  }

  const getTaskColor = (task) => {
    if (task.status === "In Progress") {
      return "orange"
    } else if (task.status === "Done") {
      return "green"
    } else if (task.status === "Not Started") {
      if (task.priority === "High") {
        return "red"
      } else if (task.priority === "Medium") {
        return "blue"
      } else {
        return "gray"
      }
    }
    return "blue"
  }

  const transformTasksToEvents = (tasks) => {
    return tasks.map((task) => {
      // Pour les managers: utiliser start_date/deadline
      // Pour les développeurs: utiliser calendar_dates
      let eventStart, eventEnd

      if (user?.role === "Team Manager") {
        const startDate = task.start_date
        const endDate = task.deadline

        if (startDate && endDate) {
          eventStart = moment.min(moment(startDate), moment(endDate))
          eventEnd = moment.max(moment(startDate), moment(endDate)).add(1, "day")
        } else if (startDate) {
          eventStart = moment(startDate)
          eventEnd = moment(startDate).add(1, "day")
        } else if (endDate) {
          eventStart = moment(endDate)
          eventEnd = moment(endDate).add(1, "day")
        } else {
          eventStart = moment()
          eventEnd = moment().add(1, "day")
        }
      } else {
        // Développeurs
        const startDate = task.calendar_dates?.start
        const endDate = task.calendar_dates?.end

        if (startDate && endDate) {
          eventStart = moment(startDate)
          eventEnd = moment(endDate)
        } else if (startDate) {
          eventStart = moment(startDate)
          eventEnd = moment(startDate).add(1, "day")
        } else if (endDate) {
          eventStart = moment(endDate)
          eventEnd = moment(endDate).add(1, "day")
        } else {
          eventStart = moment()
          eventEnd = moment().add(1, "day")
        }
      }

      return {
        id: task._id,
        title: task.title,
        start: eventStart.toISOString(),
        end: eventEnd.toISOString(),
        className: getTaskClassName(task),
        color: getTaskColor(task),
        extendedProps: {
          ...task,
          realStartDate: task.start_date ? new Date(task.start_date).toLocaleDateString() : "Not set",
          realDeadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "Not set",
          isCalendarEvent: !!task.calendar_dates,
          userRole: user?.role,
        },
        allDay: true,
      }
    })
  }

  const handleEventReceive = async (eventInfo) => {
    const taskId = eventInfo.event.id
    const task = allTasks.find((t) => t._id === taskId)

    if (task && user) {
      try {
        let start, end

        if (user.role === "team_manager") {
          // Pour les managers, mettre à jour start_date et deadline
          start = new Date(eventInfo.event.start)
          end = eventInfo.event.end ? new Date(eventInfo.event.end) : moment(start).add(1, "day").toDate()

          await taskService.updateTaskCalendarDates(taskId, start, end, user._id)

          const updatedTask = {
            ...task,
            start_date: start,
            deadline: end,
          }
          setCalendarTasks((prev) => [...prev, updatedTask])
        } else {
          // Pour les développeurs, utiliser la durée originale de la tâche si elle existe
          const originalDuration =
            task.deadline && task.start_date ? moment(task.deadline).diff(moment(task.start_date), "days") : 1 // Durée par défaut de 1 jour si non spécifiée

          start = new Date(eventInfo.event.start)
          end = moment(start).add(originalDuration, "days").toDate()

          await taskService.updateTaskCalendarDates(taskId, start, end, user._id)

          const updatedTask = {
            ...task,
            calendar_dates: { start, end },
          }
          setCalendarTasks((prev) => [...prev, updatedTask])
        }

        setAllTasks((prev) => prev.filter((t) => t._id !== taskId))
      } catch (error) {
        console.error("Error updating calendar dates:", error)
        eventInfo.event.remove()
      }
    }
  }

  const handleEventClick = async (clickInfo) => {
    const taskId = clickInfo.event.id
    const task = calendarTasks.find((t) => t._id === taskId)

    if (task && user) {
      try {
        // Envoyer null pour supprimer les dates
        await taskService.updateTaskCalendarDates(taskId, null, null, user._id)

        // Créer une copie de la tâche sans les dates
        let taskWithoutDates

        if (user.role === "team_manager") {
          const { start_date, deadline, ...rest } = task
          taskWithoutDates = rest
        } else {
          const { calendar_dates, ...rest } = task
          taskWithoutDates = rest
        }

        // Mettre à jour les états
        setAllTasks((prev) => [...prev, taskWithoutDates])
        setCalendarTasks((prev) => prev.filter((t) => t._id !== taskId))

        // Supprimer l'événement du calendrier
        clickInfo.event.remove()
      } catch (error) {
        console.error("Error removing task from calendar:", error)
        alert("Failed to remove task from calendar")
      }
    }
  }

  const handleEventChange = async (changeInfo) => {
    const taskId = changeInfo.event.id
    const task = calendarTasks.find((t) => t._id === taskId)
    const userRole = changeInfo.event.extendedProps.userRole

    if (!task || !userRole) {
      changeInfo.revert()
      return
    }

    try {
      // 1. Préparer les dates
      const oldStart = new Date(changeInfo.oldEvent.start)
      const oldEnd = changeInfo.oldEvent.end
        ? new Date(changeInfo.oldEvent.end)
        : moment(oldStart).add(1, "day").toDate()

      const newStart = new Date(changeInfo.event.start)
      const newEnd = changeInfo.event.end ? new Date(changeInfo.event.end) : moment(newStart).add(1, "day").toDate()

      // 2. Déterminer ce qui a changé
      const startChanged = oldStart.getTime() !== newStart.getTime()
      const endChanged = oldEnd.getTime() !== newEnd.getTime()

      // 3. Validation conditionnelle
      if (userRole === "developer") {
        // Pour les développeurs, vérifier par rapport aux dates principales
        if (task.start_date && newStart < new Date(task.start_date)) {
          alert("Cannot set calendar date before the task start date")
          changeInfo.revert()
          return
        }

        if (task.deadline && newEnd > new Date(task.deadline)) {
          alert("Cannot set calendar date after the task deadline")
          changeInfo.revert()
          return
        }
      }

      // 4. Préparer les données de mise à jour
      const updateData = {}

      if (userRole === "team_manager") {
        // Mettre à jour les dates principales
        if (startChanged) updateData.start = newStart
        if (endChanged) updateData.end = newEnd
      } else {
        // Mettre à jour les dates du calendrier
        if (startChanged) updateData.start = newStart
        if (endChanged) updateData.end = newEnd
      }

      // 5. Envoyer la requête
      await taskService.updateTaskCalendarDates(taskId, updateData.start, updateData.end, user._id)

      // 6. Mettre à jour l'état local
      const updatedTasks = calendarTasks.map((t) => {
        if (t._id === taskId) {
          if (userRole === "team_manager") {
            return {
              ...t,
              start_date: startChanged ? newStart : t.start_date,
              deadline: endChanged ? newEnd : t.deadline,
            }
          } else {
            return {
              ...t,
              calendar_dates: {
                start: startChanged ? newStart : t.calendar_dates?.start,
                end: endChanged ? newEnd : t.calendar_dates?.end,
              },
            }
          }
        }
        return t
      })

      setCalendarTasks(updatedTasks)
    } catch (error) {
      console.error("Error updating calendar dates:", error)
      alert(error.response?.data?.error || "Failed to update dates")
      changeInfo.revert()
    }
  }

  const allEvents = transformTasksToEvents(calendarTasks)

  if (isLoading) {
    return (
      <div id="loader" className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`page ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
          <div>
            <nav>
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item">
                  <a href="javascript:void(0);">Apps</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Task Calendar
                </li>
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
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  editable={true}
                  selectable={true}
                  droppable={true}
                  events={allEvents}
                  eventClick={handleEventClick}
                  eventDrop={handleEventChange}
                  eventResize={handleEventChange}
                  eventReceive={handleEventReceive}
                  height="auto"
                  eventDisplay="block"
                  displayEventTime={false}
                  dayMaxEventRows={true}
                  eventMinHeight={30}
                  eventContent={(arg) => (
                    <div className="fc-event-content">
                      <div className="fc-event-title">{arg.event.title}</div>
                      <div className="fc-event-status">{arg.event.extendedProps.status}</div>
                    </div>
                  )}
                  eventDidMount={(arg) => {
                    const tooltip = new Tooltip(arg.el, {
                      title: `
                                            <strong>${arg.event.title}</strong><br/>
                                            <em>${arg.event.extendedProps.description || "No description"}</em><br/>
                                            <strong>Status:</strong> ${arg.event.extendedProps.status}<br/>
                                            <strong>Priority:</strong> ${arg.event.extendedProps.priority}<br/>
                                            <strong>Real Start:</strong> ${arg.event.extendedProps.realStartDate}<br/>
                                            <strong>Real Deadline:</strong> ${arg.event.extendedProps.realDeadline}<br/>
                                            <strong>Displayed Dates:</strong> ${new Date(arg.event.start).toLocaleDateString()} - ${new Date(arg.event.end).toLocaleDateString()}<br/>
                                            ${arg.event.extendedProps.tags ? "<strong>Tags:</strong> " + arg.event.extendedProps.tags.join(", ") : ""}
                                        `,
                      html: true,
                      placement: "top",
                      trigger: "manual",
                      container: "body",
                    })

                    const showTooltip = () => tooltip.show()
                    const hideTooltip = () => tooltip.hide()
                    const handleDocumentClick = (e) => {
                      if (!arg.el.contains(e.target)) {
                        hideTooltip()
                      }
                    }

                    arg.el.addEventListener("mouseenter", showTooltip)
                    arg.el.addEventListener("mouseleave", hideTooltip)
                    document.addEventListener("click", handleDocumentClick)

                    // Cleanup
                    return () => {
                      arg.el.removeEventListener("mouseenter", showTooltip)
                      arg.el.removeEventListener("mouseleave", hideTooltip)
                      document.removeEventListener("click", handleDocumentClick)
                      tooltip.dispose()
                    }
                  }}
                  datesSet={() => {
                    // Force l'application des styles après chaque changement de vue
                    setTimeout(() => {
                      if (calendarRef.current) {
                        const calendarEl = calendarRef.current.elRef.current
                        if (calendarEl) {
                          const headerCells = calendarEl.querySelectorAll(".fc-col-header, .fc-col-header-cell")
                          const headerTexts = calendarEl.querySelectorAll(".fc-col-header-cell-cushion")

                          if (isDarkMode) {
                            headerCells.forEach((cell) => {
                              cell.style.backgroundColor = "#121212"
                              cell.style.borderColor = "rgba(255, 255, 255, 0.2)"
                            })

                            headerTexts.forEach((text) => {
                              text.style.color = "#ffffff"
                            })
                          } else {
                            headerCells.forEach((cell) => {
                              cell.style.backgroundColor = "#ffffff"
                              cell.style.borderColor = "#ddd"
                            })

                            headerTexts.forEach((text) => {
                              text.style.color = "#212529"
                            })
                          }
                        }
                      }
                    }, 0)
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
                <div id="external-events" className="mb-0 p-3 list-unstyled column-list">
                  <h6 className="mb-2 fw-semibold">Available Tasks</h6>
                  {allTasks.map((task, index) => (
                    <div
                      key={`task-${index}`}
                      className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event mb-1 ${getTaskClassName(task)}`}
                      data-class={getTaskClassName(task)}
                      data-task-id={task._id}
                    >
                      <div className="fc-event-main">{task.title}</div>
                      <div className="fc-event-dates">
                        {task.start_date && new Date(task.start_date).toLocaleDateString()}
                        {task.deadline && ` - ${new Date(task.deadline).toLocaleDateString()}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card custom-card">
              <div className="card-header justify-content-between pb-1">
                <div className="card-title">Activity</div>
              </div>
              <div className="card-body p-0">
                <div className="p-3 border-bottom" id="full-calendar-activity">
                  <SimpleBar style={{ maxHeight: "300px" }} autoHide={true}>
                    <ul className="list-unstyled mb-0 fullcalendar-events-activity">
                      {calendarTasks.slice(0, 5).map((task, index) => (
                        <li key={`task-activity-${index}`} className="mb-3">
                          <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <p className="mb-1 fw-medium">
                              {user?.role === "team_manager"
                                ? `Due: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}`
                                : `Scheduled: ${task.calendar_dates?.start ? new Date(task.calendar_dates.start).toLocaleDateString() : "Not scheduled"}`}
                            </p>
                            <span
                              className={`badge ${
                                task.status === "In Progress"
                                  ? "bg-warning"
                                  : task.status === "Completed"
                                    ? "bg-success"
                                    : "bg-info"
                              } mb-1`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <p className="mb-0 text-muted fs-12">{task.title}</p>
                          {task.description && <p className="mb-0 text-muted fs-11">{task.description}</p>}
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
  )
}

export default Calendar
