import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);

  return (
    <aside className="app-sidebar sticky" id="sidebar">
      

      <div className="main-sidebar" id="sidebar-scroll">
        <nav className="main-menu-container nav nav-pills flex-column sub-open">
          <ul className="main-menu">
            {/* Main Category */}
            <li className="slide__category">
              <span className="category-name">Main</span>
            </li>

            {/* Dashboard Menu */}
            <li className={`slide has-sub ${isDashboardOpen ? "open" : ""}`}>
              <button
                className="side-menu__item"
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <i className="ri-arrow-down-s-line side-menu__angle"></i>
                <i className="ri-home-line side-menu__icon"></i>
                <span className="side-menu__label">Home</span>
              </button>
              <ul className="slide-menu child1" style={{ display: isDashboardOpen ? "block" : "none" }}>
                
                
                <li className="slide">
                  <Link to="/sales" className="side-menu__item">
                    Dashboard
                  </Link>
                </li>

                <li className="slide">
                  <Link to="/profile" className="side-menu__item">
                    Profile
                  </Link>
                </li>
              </ul>
            </li>

            {/* Pages Category */}
            <li className="slide__category">
Pages            </li>

            {/* Pages Menu */}
            <li className={`slide has-sub ${isPagesOpen ? "open" : ""}`}>
              <button
                className="side-menu__item"
                onClick={() => setIsPagesOpen(!isPagesOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <i className="ri-arrow-down-s-line side-menu__angle"></i>
                <i className="ri-file-list-line side-menu__icon"></i>
                <span className="side-menu__label">Projects</span>
              </button>
              <ul className="slide-menu child1" style={{ display: isPagesOpen ? "block" : "none" }}>
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
                  <Link to="/ProjectDash" className="side-menu__item">
                  Project dashboard
                            </Link>
                  <Link to="/archieve" className="side-menu__item">
                  Projects Archieve 
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

  );
};

export default Sidebar;