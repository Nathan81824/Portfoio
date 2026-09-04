import {
  MessageCircle,
  Users,
  UserRound,
  ShieldCheck,
} from "lucide-react";


/* =========================================================
   ADMIN STATS

   Uses real data passed from AdminChat.jsx.

   Props:
   conversations
   → Conversations loaded from Supabase

   messages
   → Messages loaded from the selected conversation
========================================================= */

export default function AdminStats({
  conversations = [],
  messages = [],
}) {

  /* =======================================================
     TOTAL CONVERSATIONS
  ======================================================= */

  const totalConversations =
    Array.isArray(conversations)
      ? conversations.length
      : 0;


  /* =======================================================
     TOTAL MESSAGES
  ======================================================= */

  const totalMessages =
    Array.isArray(messages)
      ? messages.length
      : 0;


  /* =======================================================
     VISITOR MESSAGES
  ======================================================= */

  const visitorMessages =
    Array.isArray(messages)
      ? messages.filter(
          (item) =>
            item?.sender === "visitor"
        ).length
      : 0;


  /* =======================================================
     ADMIN REPLIES
  ======================================================= */

  const adminReplies =
    Array.isArray(messages)
      ? messages.filter(
          (item) =>
            item?.sender === "admin"
        ).length
      : 0;


  /* =======================================================
     STAT CARDS
  ======================================================= */

  const stats = [

    {
      label: "Conversations",

      value:
        totalConversations,

      icon:
        Users,

    },

    {
      label: "Messages",

      value:
        totalMessages,

      icon:
        MessageCircle,

    },

    {
      label: "Visitor Messages",

      value:
        visitorMessages,

      icon:
        UserRound,

    },

    {
      label: "Your Replies",

      value:
        adminReplies,

      icon:
        ShieldCheck,

    },

  ];


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section
      className="admin-stats"
      aria-label="Chat statistics"
    >

      <div className="admin-stats-header">

        <div>

          <span className="admin-stats-label">
            OVERVIEW
          </span>

          <h2>
            Chat Statistics
          </h2>

        </div>

      </div>


      <div className="admin-stats-grid">

        {stats.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (

            <article
              key={label}
              className="admin-stat-card"
            >

              <div className="admin-stat-icon">

                <Icon
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

              </div>


              <div className="admin-stat-content">

                <span>
                  {label}
                </span>

                <strong>
                  {value}
                </strong>

              </div>

            </article>

          )
        )}

      </div>

    </section>

  );

}
