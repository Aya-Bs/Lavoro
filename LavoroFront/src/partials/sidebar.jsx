import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ userRole }) => {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
  const [isTeamsMenuOpen, setIsTeamsMenuOpen] = useState(false);

  const getMenuItems = () => {
    switch(userRole) {
      case 'Developer':
        return (
          <>
            <li className="slide__category">
              <span className="category-name">Main</span>
            </li>
            <li className="slide">
              <Link to="/profile" className="side-menu__item">
                <i className="ri-user-line side-menu__icon"></i>
                <span className="side-menu__label">Profile</span>
              </Link>
            </li>

            <li className="slide__category">
              <span className="category-name">Performance</span>
            </li>
            <li className="slide">
              <Link to="/best-performer" className="side-menu__item">
                <i className="ri-award-line side-menu__icon"></i>
                <span className="side-menu__label">Meilleur Performeur</span>
              </Link>
            </li>
          </>
        );

      case 'Project Manager':
        return (
          <>
            <li className="slide__category">
              <span className="category-name">Main</span>
            </li>
            <li className={`slide has-sub ${isMainMenuOpen ? "open" : ""}`}>
              <button
                className="side-menu__item"
                onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <i className="ri-arrow-down-s-line side-menu__angle"></i>
                <i className="ri-home-line side-menu__icon"></i>
                <span className="side-menu__label">Main</span>
              </button>
              <ul className="slide-menu child1" style={{ display: isMainMenuOpen ? "block" : "none" }}>
                <li className="slide">
                  <Link to="/profile" className="side-menu__item">
                    Profile
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/ProjectDash" className="side-menu__item">
                    Project dashboard
                  </Link>
                </li>

              </ul>
            </li>

            <li className="slide__category">
              <span className="category-name">Projects</span>
            </li>

            <li className={`slide has-sub ${isProjectsMenuOpen ? "open" : ""}`}>
              <button
                className="side-menu__item"
                onClick={() => setIsProjectsMenuOpen(!isProjectsMenuOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <i className="ri-arrow-down-s-line side-menu__angle"></i>
                <i className="ri-file-list-line side-menu__icon"></i>
                <span className="side-menu__label">Projects</span>
              </button>
              <ul className="slide-menu child1" style={{ display: isProjectsMenuOpen ? "block" : "none" }}>
                <li className="slide">
                  <Link to="/createPro" className="side-menu__item">
                    Create Project
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/listPro" className="side-menu__item">
                    Projects List
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/archieve" className="side-menu__item">
                    Projects Archive
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/ProjectProgress" className="side-menu__item">
                    Projects Progress
                  </Link>
                </li>
              </ul>
            </li>

            {/* Teams section - Maintenant comme section séparée */}
            <li className="slide__category">
              <span className="category-name">Teams</span>
            </li>

            <li className={`slide has-sub ${isTeamsMenuOpen ? "open" : ""}`}>
              <button
                className="side-menu__item"
                onClick={() => setIsTeamsMenuOpen(!isTeamsMenuOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <i className="ri-arrow-down-s-line side-menu__angle"></i>
                <i className="ri-team-line side-menu__icon"></i>
                <span className="side-menu__label">Teams</span>
              </button>
              <ul className="slide-menu child1" style={{ display: isTeamsMenuOpen ? "block" : "none" }}>
                <li className="slide">
                  <Link to="/createTeam" className="side-menu__item">
                    Create Team
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/listTeams" className="side-menu__item">
                    Teams List
                  </Link>
                </li>
              </ul>
            </li>

            <li className="slide__category">
              <span className="category-name">Performance</span>
            </li>
            <li className="slide">
              <Link to="/best-performer" className="side-menu__item">
                <i className="ri-award-line side-menu__icon"></i>
                <span className="side-menu__label">Meilleur Performeur</span>
              </Link>
            </li>
          </>
        );

      case 'Team Manager':
        return (
          <>
            <li className="slide__category">
              <span className="category-name">Main</span>
            </li>
            <li className="slide">
              <Link to="/profile" className="side-menu__item">
                <i className="ri-user-line side-menu__icon"></i>
                <span className="side-menu__label">Profile</span>
              </Link>
            </li>

            <li className="slide__category">
              <span className="category-name">Projects</span>
            </li>
            <li className="slide">
              <Link to="/listPro" className="side-menu__item">
                <i className="ri-file-list-line side-menu__icon"></i>
                <span className="side-menu__label">Projects List</span>
              </Link>
            </li>

            <li className="slide__category">
              <span className="category-name">Performance</span>
            </li>
            <li className="slide">
              <Link to="/best-performer" className="side-menu__item">
                <i className="ri-award-line side-menu__icon"></i>
                <span className="side-menu__label">Meilleur Performeur</span>
              </Link>
            </li>
          </>
        );




      case 'Admin':
        return (
          <>

<li className="slide">
              <Link to="/admin-dashboard" className="side-menu__item">
                <i className="ri-user-line side-menu__icon"></i>
                <span className="side-menu__label">Admin</span>
              </Link>
            </li>
            <li className="slide__category">
              <span className="category-name">Main</span>
            </li>
            <li className={`slide has-sub ${isMainMenuOpen ? "open" : ""}`}>
              <button
                className="side-menu__item"
                onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <i className="ri-arrow-down-s-line side-menu__angle"></i>
                <i className="ri-home-line side-menu__icon"></i>
                <span className="side-menu__label">Main</span>
              </button>
              <ul className="slide-menu child1" style={{ display: isMainMenuOpen ? "block" : "none" }}>
                <li className="slide">
                  <Link to="/profile" className="side-menu__item">
                    Profile
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/ProjectDash" className="side-menu__item">
                    Project dashboard
                  </Link>
                </li>

              </ul>
            </li>

            <li className="slide__category">
              <span className="category-name">Projects</span>
            </li>
            <li className={`slide has-sub ${isProjectsMenuOpen ? "open" : ""}`}>
              <button
                className="side-menu__item"
                onClick={() => setIsProjectsMenuOpen(!isProjectsMenuOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <i className="ri-arrow-down-s-line side-menu__angle"></i>
                <i className="ri-file-list-line side-menu__icon"></i>
                <span className="side-menu__label">Projects</span>
              </button>
              <ul className="slide-menu child1" style={{ display: isProjectsMenuOpen ? "block" : "none" }}>
                <li className="slide">
                  <Link to="/createPro" className="side-menu__item">
                    Create Project
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/listPro" className="side-menu__item">
                    Projects List
                  </Link>
                </li>

                <li className="slide">
                  <Link to="/archieve" className="side-menu__item">
                    Projects Archive
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/ProjectProgress" className="side-menu__item">
                    Projects Progress
                  </Link>
                </li>
              </ul>
            </li>

            {/* Teams section pour Admin */}
            <li className="slide__category">
              <span className="category-name">Teams</span>
            </li>

            <li className={`slide has-sub ${isTeamsMenuOpen ? "open" : ""}`}>
              <button
                className="side-menu__item"
                onClick={() => setIsTeamsMenuOpen(!isTeamsMenuOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <i className="ri-arrow-down-s-line side-menu__angle"></i>
                <i className="ri-team-line side-menu__icon"></i>
                <span className="side-menu__label">Teams</span>
              </button>
              <ul className="slide-menu child1" style={{ display: isTeamsMenuOpen ? "block" : "none" }}>
                <li className="slide">
                  <Link to="/createTeam" className="side-menu__item">
                    Create Team
                  </Link>
                </li>
                <li className="slide">
                  <Link to="/listTeams" className="side-menu__item">
                    Teams List
                  </Link>
                </li>
              </ul>
            </li>

            <li className="slide__category">
              <span className="category-name">Performance</span>
            </li>
            <li className="slide">
              <Link to="/best-performer" className="side-menu__item">
                <i className="ri-award-line side-menu__icon"></i>
                <span className="side-menu__label">Meilleur Performeur</span>
              </Link>
            </li>
          </>

        );

      // Add more roles as needed
      default:
        return (
          <li className="slide">
            <Link to="/profile" className="side-menu__item">
              <i className="ri-user-line side-menu__icon"></i>
              <span className="side-menu__label">Profile</span>
            </Link>
          </li>
        );
    }
  };


  return (
<aside className="app-sidebar sticky" id="sidebar">
<div className="main-sidebar-header">
    <img src="/public/logo.png" alt="logo" className="desktop-white" style ={{ width: "145px", height: "120px" }} />

</div>

<div className="main-sidebar" id="sidebar-scroll">
<nav className="main-menu-container nav nav-pills flex-column sub-open">
      <ul className="main-menu">
        {getMenuItems()}
      </ul>
    </nav>

</div>
</aside>
  );
};

export default Sidebar;