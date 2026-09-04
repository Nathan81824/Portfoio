import { useEffect, useState } from "react";

import {
  MessageCircle,
  Users,
  Trash2,
  LogOut,
  X,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { supabase } from "../../javascript/supabase/supabaseClient";



export default function AdminSidebar({
  selectedConversation,
  onSelectConversation,
  onLogout,
  mobileOpen,
  onCloseMobile,
}) {

  /* =========================================================
     STATE
  ========================================================= */

  const [conversations, setConversations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [deletingAll, setDeletingAll] = useState(false);

  const [deleteModal, setDeleteModal] = useState(null);


  /* =========================================================
     FETCH CONVERSATIONS
  ========================================================= */

  const fetchConversations = async () => {

    try {

      setLoading(true);

      setError("");


      const {
        data,
        error: fetchError,
      } = await supabase
        .from("conversations")
        .select(`
          id,
          visitor_name,
          visitor_email,
          created_at
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );


      if (fetchError) {
        throw fetchError;
      }


      setConversations(
        data || []
      );

    } catch (err) {

      console.error(
        "Failed to load conversations:",
        err
      );

      setError(
        "Unable to load conversations."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    fetchConversations();

  }, []);


  /* =========================================================
     REALTIME CONVERSATIONS
  ========================================================= */

  useEffect(() => {

    const channel =
      supabase
        .channel(
          "admin-conversations"
        )

        /* ===================================================
           INSERT
        =================================================== */

        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "conversations",
          },
          (payload) => {

            setConversations(
              (current) => [

                payload.new,

                ...current.filter(
                  (conversation) =>
                    conversation.id !==
                    payload.new.id
                ),

              ]
            );

          }
        )

        /* ===================================================
           UPDATE
        =================================================== */

        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "conversations",
          },
          (payload) => {

            setConversations(
              (current) =>
                current.map(
                  (conversation) =>
                    conversation.id ===
                    payload.new.id

                      ? payload.new

                      : conversation
                )
            );

          }
        )

        /* ===================================================
           DELETE
        =================================================== */

        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "conversations",
          },
          (payload) => {

            setConversations(
              (current) =>
                current.filter(
                  (conversation) =>
                    conversation.id !==
                    payload.old.id
                )
            );

          }
        )

        .subscribe();


    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, []);


  /* =========================================================
     OPEN SINGLE DELETE MODAL
  ========================================================= */

  const openDeleteConversationModal = (
    conversation
  ) => {

    if (
      !conversation ||
      deletingId ||
      deletingAll
    ) {
      return;
    }


    setDeleteModal({
      type: "conversation",
      conversation,
    });

  };


  /* =========================================================
     OPEN DELETE ALL MODAL
  ========================================================= */

  const openDeleteAllModal = () => {

    if (
      conversations.length === 0 ||
      deletingAll ||
      deletingId
    ) {
      return;
    }


    setDeleteModal({
      type: "all",
    });

  };


  /* =========================================================
     CLOSE DELETE MODAL
  ========================================================= */

  const closeDeleteModal = () => {

    if (
      deletingId ||
      deletingAll
    ) {
      return;
    }


    setDeleteModal(null);

  };


  /* =========================================================
     DELETE ONE CONVERSATION
  ========================================================= */

  const handleDeleteConversation =
    async () => {

      const conversation =
        deleteModal?.conversation;


      if (
        !conversation?.id ||
        deletingId ||
        deletingAll
      ) {
        return;
      }


      try {

        setDeletingId(
          conversation.id
        );

        setError("");


        /* ===================================================
           DELETE MESSAGES FIRST
        =================================================== */

        const {
          error: messagesError,
        } = await supabase
          .from("messages")
          .delete()
          .eq(
            "conversation_id",
            conversation.id
          );


        if (messagesError) {
          throw messagesError;
        }


        /* ===================================================
           DELETE CONVERSATION
        =================================================== */

        const {
          data: deletedConversation,
          error: conversationError,
        } = await supabase
          .from("conversations")
          .delete()
          .eq(
            "id",
            conversation.id
          )
          .select("id");


        if (conversationError) {
          throw conversationError;
        }


        if (
          !deletedConversation ||
          deletedConversation.length === 0
        ) {

          throw new Error(
            "Conversation could not be deleted."
          );

        }


        /* ===================================================
           REMOVE FROM LOCAL STATE
        =================================================== */

        setConversations(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                conversation.id
            )
        );


        /* ===================================================
           CLEAR SELECTED CONVERSATION
        =================================================== */

        if (
          selectedConversation?.id ===
          conversation.id
        ) {

          onSelectConversation(
            null
          );

        }


        /* ===================================================
           CLOSE MODAL
        =================================================== */

        setDeleteModal(null);

      } catch (err) {

        console.error(
          "Delete conversation error:",
          err
        );

        setError(
          err.message ||
          "Failed to delete conversation."
        );

      } finally {

        setDeletingId(null);

      }

    };


  /* =========================================================
     DELETE ALL CONVERSATIONS
  ========================================================= */

  const handleDeleteAll =
    async () => {

      if (
        deletingAll ||
        deletingId ||
        conversations.length === 0
      ) {
        return;
      }


      try {

        setDeletingAll(true);

        setError("");


        /* ===================================================
           DELETE ALL MESSAGES
        =================================================== */

        const {
          error: messagesError,
        } = await supabase
          .from("messages")
          .delete()
          .not(
            "id",
            "is",
            null
          );


        if (messagesError) {
          throw messagesError;
        }


        /* ===================================================
           DELETE ALL CONVERSATIONS
        =================================================== */

        const {
          data: deletedConversations,
          error: conversationsError,
        } = await supabase
          .from("conversations")
          .delete()
          .not(
            "id",
            "is",
            null
          )
          .select("id");


        if (conversationsError) {
          throw conversationsError;
        }


        /* ===================================================
           VERIFY DELETION
        =================================================== */

        const {
          data: remainingConversations,
          error: verifyError,
        } = await supabase
          .from("conversations")
          .select("id");


        if (verifyError) {
          throw verifyError;
        }


        if (
          remainingConversations &&
          remainingConversations.length > 0
        ) {

          throw new Error(
            "Some conversations could not be deleted."
          );

        }


        /* ===================================================
           CLEAR UI
        =================================================== */

        setConversations([]);

        onSelectConversation(null);

        setDeleteModal(null);


        console.log(
          `Deleted ${
            deletedConversations?.length || 0
          } conversations.`
        );

      } catch (err) {

        console.error(
          "Delete all conversations error:",
          err
        );

        setError(
          err.message ||
          "Failed to delete all conversations."
        );

      } finally {

        setDeletingAll(false);

      }

    };


  /* =========================================================
     SELECT CONVERSATION
  ========================================================= */

  const handleSelectConversation = (
    conversation
  ) => {

    if (
      !conversation ||
      deletingId ||
      deletingAll
    ) {
      return;
    }


    onSelectConversation(
      conversation
    );


    onCloseMobile?.();

  };


  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {

    return (

      <aside
        className={`admin-sidebar ${
          mobileOpen
            ? "open"
            : ""
        }`}
      >

        <div className="admin-sidebar-content">

          <div className="admin-sidebar-loading">

            <RefreshCw
              size={20}
              className="admin-sidebar-spin"
            />

            <span>
              Loading conversations...
            </span>

          </div>

        </div>

      </aside>

    );

  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`admin-sidebar ${
          mobileOpen
            ? "open"
            : ""
        }`}
      >

        {/* ===================================================
            MOBILE BACKDROP
        =================================================== */}

        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={onCloseMobile}
        />


        {/* ===================================================
            SIDEBAR CONTENT
        =================================================== */}

        <div className="admin-sidebar-content">


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="admin-sidebar-header">

            <div>

              <span className="admin-sidebar-label">
                MESSAGES
              </span>

              <h2>
                Conversations
              </h2>

            </div>


            <div className="admin-sidebar-header-actions">

              {/* DELETE ALL */}

              <button
                type="button"
                className="admin-sidebar-delete-all"
                onClick={
                  openDeleteAllModal
                }
                disabled={
                  conversations.length === 0 ||
                  deletingAll ||
                  deletingId
                }
                aria-label="Delete all conversations"
                title="Delete all conversations"
              >

                <Trash2
                  size={17}
                  strokeWidth={1.8}
                />

              </button>


              {/* MOBILE CLOSE */}

              <button
                type="button"
                className="admin-sidebar-mobile-close"
                onClick={onCloseMobile}
                aria-label="Close sidebar"
              >

                <X
                  size={19}
                  strokeWidth={1.8}
                />

              </button>

            </div>

          </header>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="admin-sidebar-error">

              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={
                  fetchConversations
                }
                aria-label="Retry loading conversations"
              >
                <RefreshCw
                  size={14}
                />
              </button>

            </div>

          )}


          {/* =================================================
              CONVERSATIONS
          ================================================= */}

          <section
            className="admin-sidebar-conversations"
          >

            {/* =================================================
                COUNT
            ================================================= */}

            <div
              className="
                admin-sidebar-conversations-header
              "
            >

              <span>
                ALL CONVERSATIONS
              </span>

              <strong>
                {conversations.length}
              </strong>

            </div>


            {/* =================================================
                LIST
            ================================================= */}

            <div
              className="
                admin-sidebar-conversations-list
              "
            >

              {conversations.length === 0 ? (

                <div className="admin-sidebar-empty">

                  <Users
                    size={25}
                    strokeWidth={1.5}
                  />

                  <p>
                    No conversations yet.
                  </p>

                  <span>
                    Visitor messages will
                    appear here.
                  </span>

                </div>

              ) : (

                conversations.map(
                  (conversation) => {

                    const isSelected =
                      selectedConversation?.id ===
                      conversation.id;

                    const isDeleting =
                      deletingId ===
                      conversation.id;


                    return (

                      <div
                        key={
                          conversation.id
                        }
                        className="
                          admin-sidebar-conversation-wrapper
                        "
                      >

                        {/* =====================================
                            CONVERSATION BUTTON
                        ===================================== */}

                        <button
                          type="button"
                          className={`
                            admin-sidebar-conversation
                            ${
                              isSelected
                                ? "active"
                                : ""
                            }
                          `}
                          onClick={() =>
                            handleSelectConversation(
                              conversation
                            )
                          }
                          disabled={
                            isDeleting ||
                            deletingAll
                          }
                        >

                          <div
                            className="
                              admin-sidebar-conversation-avatar
                            "
                          >

                            <MessageCircle
                              size={17}
                              strokeWidth={1.7}
                            />

                          </div>


                          <div
                            className="
                              admin-sidebar-conversation-info
                            "
                          >

                            <strong>
                              {
                                conversation.visitor_name ||
                                "Visitor"
                              }
                            </strong>

                            <span>
                              {
                                conversation.visitor_email ||
                                "No email"
                              }
                            </span>

                          </div>

                        </button>


                        {/* =====================================
                            DELETE BUTTON
                        ===================================== */}

                        <button
                          type="button"
                          className="
                            admin-sidebar-delete
                          "
                          onClick={() =>
                            openDeleteConversationModal(
                              conversation
                            )
                          }
                          disabled={
                            isDeleting ||
                            deletingAll
                          }
                          aria-label={
                            `Delete ${
                              conversation.visitor_name ||
                              "conversation"
                            }`
                          }
                          title="Delete conversation"
                        >

                          {isDeleting ? (

                            <RefreshCw
                              size={15}
                              className="
                                admin-sidebar-spin
                              "
                            />

                          ) : (

                            <Trash2
                              size={15}
                              strokeWidth={1.8}
                            />

                          )}

                        </button>

                      </div>

                    );

                  }
                )

              )}

            </div>

          </section>


          {/* =================================================
              FOOTER
          ================================================= */}

          <footer
            className="admin-sidebar-footer"
          >

            <div
              className="
                admin-sidebar-status
              "
            >

              <span
                className="
                  admin-sidebar-status-dot
                "
              />

              <span>
                Live connection
              </span>

            </div>


            <button
              type="button"
              className="admin-sidebar-logout"
              onClick={onLogout}
            >

              <LogOut
                size={16}
                strokeWidth={1.8}
              />

              <span>
                Logout
              </span>

            </button>

          </footer>

        </div>

      </aside>


      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteModal && (

        <div
          className="admin-delete-overlay"
          role="presentation"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget &&
              !deletingId &&
              !deletingAll
            ) {

              closeDeleteModal();

            }

          }}
        >

          <div
            className="admin-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >

            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              type="button"
              className="admin-delete-close"
              onClick={
                closeDeleteModal
              }
              disabled={
                deletingId ||
                deletingAll
              }
              aria-label="Close confirmation"
            >

              <X
                size={18}
                strokeWidth={1.8}
              />

            </button>


            {/* =================================================
                WARNING ICON
            ================================================= */}

            <div className="admin-delete-icon">

              <AlertTriangle
                size={24}
                strokeWidth={1.7}
              />

            </div>


            {/* =================================================
                TITLE
            ================================================= */}

            <h2 id="delete-modal-title">

              {deleteModal.type ===
              "all"

                ? "Delete all conversations?"

                : "Delete conversation?"}

            </h2>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p>

              {deleteModal.type ===
              "all"

                ? `This will permanently remove all ${
                    conversations.length
                  } conversations and their messages.`

                : `This will permanently delete ${
                    deleteModal.conversation
                      ?.visitor_name ||
                    "this conversation"
                  } and all of its messages.`}

            </p>


            {/* =================================================
                WARNING
            ================================================= */}

            <div className="admin-delete-warning">

              <AlertTriangle
                size={15}
                strokeWidth={1.8}
              />

              <span>
                This action cannot be undone.
              </span>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="admin-delete-actions">

              {/* CANCEL */}

              <button
                type="button"
                className="
                  admin-delete-cancel
                "
                onClick={
                  closeDeleteModal
                }
                disabled={
                  deletingId ||
                  deletingAll
                }
              >

                Cancel

              </button>


              {/* CONFIRM */}

              <button
                type="button"
                className="
                  admin-delete-confirm
                "
                onClick={
                  deleteModal.type ===
                  "all"

                    ? handleDeleteAll

                    : handleDeleteConversation
                }
                disabled={
                  deletingId ||
                  deletingAll
                }
              >

                {(deletingId ||
                  deletingAll) ? (

                  <>

                    <RefreshCw
                      size={15}
                      className="
                        admin-sidebar-spin
                      "
                    />

                    <span>
                      Deleting...
                    </span>

                  </>

                ) : (

                  <>

                    <Trash2
                      size={15}
                      strokeWidth={1.8}
                    />

                    <span>
                      {
                        deleteModal.type ===
                        "all"

                          ? "Delete All"

                          : "Delete"
                      }
                    </span>

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}
