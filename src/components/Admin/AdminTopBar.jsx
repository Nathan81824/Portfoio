import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  Bell,
  BarChart3,
  X,
  User,
  Settings,
  LogOut,
  Moon,
} from "lucide-react";

export default function AdminTopbar({
  onMenuToggle,
  title = "Dashboard",
  subtitle = "Manage your portfolio conversations",
}) {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const analyticsRef = useRef(null);
  const profileRef = useRef(null);

  /* =========================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        analyticsRef.current &&
        !analyticsRef.current.contains(event.target)
      ) {
        setAnalyticsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     PAGE VISIT DATA
     TEMPORARY VALUES
     WILL BE CONNECTED TO SUPABASE
  ========================================================= */

  const pageVisits = [
    {
      page: "Home",
      visits: 120,
    },
    {
      page: "About",
      visits: 45,
    },
    {
      page: "Skills",
      visits: 38,
    },
    {
      page: "Projects",
      visits: 82,
    },
    {
      page: "Contact",
      visits: 21,
    },
  ];

  const totalVisits = pageVisits.reduce(
    (total, page) => total + page.visits,
    0
  );

  /* =========================================================
     ANALYTICS TOGGLE
  ========================================================= */

  const handleAnalyticsToggle = () => {
    setAnalyticsOpen((current) => !current);
    setProfileOpen(false);
  };

  /* =========================================================
     PROFILE TOGGLE
  ========================================================= */

  const handleProfileToggle = () => {
    setProfileOpen((current) => !current);
    setAnalyticsOpen(false);
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="admin-topbar-left">

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            className="admin-topbar-menu"
            onClick={onMenuToggle}
            aria-label="Open admin sidebar"
          >
            <Menu
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="admin-topbar-title">

            <span className="admin-topbar-label">
              ADMIN
            </span>

            <h1>
              {title}
            </h1>

            <p>
              {subtitle}
            </p>

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="admin-topbar-right">

          {/* =================================================
              SEARCH BUTTON
          ================================================= */}

          <button
            type="button"
            className="admin-topbar-search"
            aria-label="Search conversations"
          >
            <Search
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <div
            className="admin-topbar-analytics"
            ref={analyticsRef}
          >

            <button
              type="button"
              className={`admin-topbar-analytics-button ${
                analyticsOpen ? "is-active" : ""
              }`}
              onClick={handleAnalyticsToggle}
              aria-label="View page analytics"
              aria-expanded={analyticsOpen}
            >
              {analyticsOpen ? (
                <X
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <BarChart3
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}
            </button>

            {analyticsOpen && (
              <div className="admin-analytics-dropdown">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="admin-analytics-header">

                  <span>
                    ANALYTICS
                  </span>

                  <h2>
                    Page Visits
                  </h2>

                  <p>
                    Portfolio traffic overview
                  </p>

                </div>

                {/* =================================================
                    TOTAL VISITS
                ================================================= */}

                <div className="admin-analytics-total">

                  <div>
                    <span>
                      Total Visits
                    </span>

                    <strong>
                      {totalVisits}
                    </strong>
                  </div>

                  <BarChart3
                    size={20}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                </div>

                {/* =================================================
                    PAGE VISITS
                ================================================= */}

                <div className="admin-analytics-pages">

                  {pageVisits.map((item) => (
                    <div
                      className="admin-analytics-page"
                      key={item.page}
                    >
                      <span>
                        {item.page}
                      </span>

                      <strong>
                        {item.visits}
                      </strong>
                    </div>
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              NOTIFICATION BUTTON
          ================================================= */}

          <button
            type="button"
            className="admin-topbar-notification"
            aria-label="Notifications"
          >
            <Bell
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span
              className="admin-topbar-notification-dot"
              aria-hidden="true"
            />
          </button>

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            className="admin-topbar-profile-wrapper"
            ref={profileRef}
          >

            <button
              type="button"
              className={`admin-topbar-profile ${
                profileOpen ? "is-active" : ""
              }`}
              onClick={handleProfileToggle}
              aria-label="Open administrator profile menu"
              aria-expanded={profileOpen}
            >

              <div className="admin-topbar-profile-info">

                <strong>
                  Nathan
                </strong>

                <span>
                  Administrator
                </span>

              </div>

              <div
                className="admin-topbar-avatar"
                aria-hidden="true"
              >
                N
              </div>

            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {profileOpen && (
              <div className="admin-profile-dropdown">

                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="admin-profile-dropdown-header">

                  <div className="admin-profile-dropdown-avatar">
                    N
                  </div>

                  <div>

                    <strong>
                      Nathan
                    </strong>

                    <span>
                      Administrator
                    </span>

                  </div>

                </div>

                {/* =================================================
                    MENU
                ================================================= */}

                <div className="admin-profile-dropdown-menu">

                  <button
                    type="button"
                    className="admin-profile-dropdown-item"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    <User
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>
                      Account
                    </span>
                  </button>

                  <button
                    type="button"
                    className="admin-profile-dropdown-item"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    <Settings
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>
                      Settings
                    </span>
                  </button>

                  <button
                    type="button"
                    className="admin-profile-dropdown-item"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    <Moon
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>
                      Theme
                    </span>
                  </button>

                </div>

                {/* =================================================
                    LOGOUT
                ================================================= */}

                <div className="admin-profile-dropdown-footer">

                  <button
                    type="button"
                    className="admin-profile-dropdown-logout"
                  >
                    <LogOut
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>
                      Logout
                    </span>
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}