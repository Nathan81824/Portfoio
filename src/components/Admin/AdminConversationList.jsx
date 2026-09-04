import { useState } from "react";

import {
  MessageCircle,
  User,
  Mail,
  Loader2,
  Search,
} from "lucide-react";


/* =========================================================
   ADMIN CONVERSATION LIST

   Props:

   conversations
   → Conversations loaded from Supabase

   selectedConversation
   → Currently selected conversation

   loading
   → Loading state

   onSelect
   → Called when the admin selects a conversation
========================================================= */

export default function AdminConversationList({
  conversations = [],
  selectedConversation = null,
  loading = false,
  onSelect,
}) {

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");


  /* =======================================================
     FILTER CONVERSATIONS
  ======================================================= */

  const filteredConversations =
    conversations.filter(
      (conversation) => {

        const visitorName =
          conversation?.visitor_name ||
          "";

        return visitorName
          .toLowerCase()
          .includes(
            search.trim().toLowerCase()
          );

      }
    );


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <aside className="admin-conversation-list">

        <div className="admin-conversation-header">

          <div>

            <span>
              INBOX
            </span>

            <strong>
              Loading...
            </strong>

          </div>

        </div>


        <div className="admin-conversation-loading">

          <Loader2
            size={20}
            className="admin-conversation-spin"
            aria-hidden="true"
          />

          <span>
            Loading conversations...
          </span>

        </div>

      </aside>

    );

  }


  /* =======================================================
     EMPTY
  ======================================================= */

  if (!conversations.length) {

    return (

      <aside className="admin-conversation-list">

        <div className="admin-conversation-header">

          <div>

            <span>
              INBOX
            </span>

            <strong>
              0
            </strong>

          </div>

        </div>


        <div className="admin-conversation-empty">

          <div className="admin-conversation-empty-icon">

            <MessageCircle
              size={24}
              aria-hidden="true"
            />

          </div>


          <h3>
            No conversations
          </h3>


          <p>
            When a visitor sends you a
            message, it will appear here.
          </p>

        </div>

      </aside>

    );

  }


  /* =======================================================
     CONVERSATIONS
  ======================================================= */

  return (

    <aside className="admin-conversation-list">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="admin-conversation-header">

        <div>

          <span>
            INBOX
          </span>

          <strong>
            {conversations.length}
          </strong>

        </div>

      </div>


      {/* ===================================================
          SEARCH
      =================================================== */}

      <div className="admin-conversation-search">

        <Search
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search username..."
          aria-label="Search conversations by username"
        />

        {search && (
          <button
            type="button"
            className="admin-conversation-search-clear"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

      </div>


      {/* ===================================================
          SEARCH RESULTS / LIST
      =================================================== */}

      <div className="admin-conversations">

        {filteredConversations.length > 0 ? (

          filteredConversations.map(
            (conversation) => {

              const active =
                selectedConversation?.id ===
                conversation.id;


              const visitorName =
                conversation?.visitor_name ||
                "Visitor";


              const visitorEmail =
                conversation?.visitor_email ||
                "No email";


              return (

                <button
                  key={
                    conversation.id
                  }

                  type="button"

                  className={
                    active
                      ? "admin-conversation active"
                      : "admin-conversation"
                  }

                  onClick={() => {

                    if (
                      typeof onSelect ===
                      "function"
                    ) {

                      onSelect(
                        conversation
                      );

                    }

                  }}

                  aria-pressed={
                    active
                  }
                >

                  {/* =========================================
                      AVATAR
                  ========================================== */}

                  <div className="admin-conversation-avatar">

                    <User
                      size={17}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                  </div>


                  {/* =========================================
                      INFORMATION
                  ========================================== */}

                  <div className="admin-conversation-info">

                    <strong>
                      {visitorName}
                    </strong>


                    <span>

                      <Mail
                        size={12}
                        aria-hidden="true"
                      />

                      {visitorEmail}

                    </span>

                  </div>


                  {/* =========================================
                      STATUS
                  ========================================== */}

                  <span
                    className="admin-conversation-status"
                    aria-hidden="true"
                  />

                </button>

              );

            }
          )

        ) : (

          /* =================================================
             NO SEARCH RESULTS
          ================================================= */

          <div className="admin-conversation-no-results">

            <Search
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span>
              No results found
            </span>

          </div>

        )}

      </div>

    </aside>

  );

}
