
import {
  User,
  Mail,
} from "lucide-react";

import "./AdminConversationItem.css";


/* =========================================================
   ADMIN CONVERSATION ITEM

   Represents ONE client/conversation inside the inbox.

   Props:
   conversation
   → One conversation from Supabase

   active
   → Whether this conversation is selected

   onSelect
   → Selects this conversation
========================================================= */

export default function AdminConversationItem({
  conversation,
  active = false,
  onSelect,
}) {

  /* =======================================================
     SAFETY
  ======================================================= */

  if (!conversation) {
    return null;
  }


  /* =======================================================
     VISITOR INFORMATION
  ======================================================= */

  const visitorName =
    conversation.visitor_name ||
    "Visitor";


  const visitorEmail =
    conversation.visitor_email ||
    "No email";


  /* =======================================================
     SELECT
  ======================================================= */

  const handleSelect = () => {

    if (
      typeof onSelect ===
      "function"
    ) {

      onSelect(
        conversation
      );

    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <button
      type="button"

      className={
        active
          ? "admin-conversation-item active"
          : "admin-conversation-item"
      }

      onClick={handleSelect}

      aria-pressed={active}

    >

      {/* ===================================================
          AVATAR
      =================================================== */}

      <div className="admin-conversation-item-avatar">

        <User
          size={17}
          strokeWidth={1.8}
          aria-hidden="true"
        />

      </div>


      {/* ===================================================
          INFORMATION
      =================================================== */}

      <div className="admin-conversation-item-info">

        <strong>
          {visitorName}
        </strong>


        <span>

          <Mail
            size={12}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          {visitorEmail}

        </span>

      </div>


      {/* ===================================================
          STATUS
      =================================================== */}

      <span
        className="admin-conversation-item-status"
        aria-hidden="true"
      />

    </button>

  );

}
