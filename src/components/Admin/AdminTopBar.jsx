import {
  Menu,
  Search,
  Bell,
} from "lucide-react";



export default function AdminTopbar({
  onMenuToggle,
  title = "Dashboard",
  subtitle = "Manage your portfolio conversations",
}) {

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

          <div className="admin-topbar-profile">

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

          </div>

        </div>

      </div>

    </header>
  );
}
