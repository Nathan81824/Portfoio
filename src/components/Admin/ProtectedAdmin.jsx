import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
  supabase,
} from "../../javascript/supabase/supabaseClient";


/* =========================================================
   PROTECTED ADMIN
========================================================= */

export default function ProtectedAdmin({
  children,
}) {

  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  useEffect(() => {

    let mounted = true;


    /* =====================================================
       GET INITIAL SESSION
    ===================================================== */

    const initializeSession =
      async () => {

        try {

          const {
            data,
            error,
          } =
            await supabase.auth.getSession();


          if (!mounted) {
            return;
          }


          if (error) {

            console.error(
              "ProtectedAdmin session error:",
              error
            );

            setSession(null);

          } else {

            setSession(
              data?.session || null
            );

          }

        } catch (error) {

          console.error(
            "ProtectedAdmin initialization error:",
            error
          );

          if (mounted) {

            setSession(null);

          }

        } finally {

          if (mounted) {

            setLoading(false);

          }

        }

      };


    initializeSession();


    /* =====================================================
       AUTH STATE LISTENER
    ===================================================== */

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event, newSession) => {

          if (!mounted) {
            return;
          }


          console.log(
            "ProtectedAdmin auth event:",
            event
          );


          /* ===============================================
             SIGNED IN
          =============================================== */

          if (
            event === "SIGNED_IN"
          ) {

            setSession(
              newSession || null
            );

            return;

          }


          /* ===============================================
             TOKEN REFRESHED
          =============================================== */

          if (
            event === "TOKEN_REFRESHED"
          ) {

            /*
              IMPORTANT:

              Do not call getSession(),
              refreshSession(), or getUser()
              here.

              Supabase has already supplied
              the refreshed session.
            */

            if (newSession) {

              setSession(
                newSession
              );

            }

            return;

          }


          /* ===============================================
             USER UPDATED
          =============================================== */

          if (
            event === "USER_UPDATED"
          ) {

            if (newSession) {

              setSession(
                newSession
              );

            }

            return;

          }


          /* ===============================================
             PASSWORD RECOVERY
          =============================================== */

          if (
            event === "PASSWORD_RECOVERY"
          ) {

            if (newSession) {

              setSession(
                newSession
              );

            }

            return;

          }


          /* ===============================================
             SIGNED OUT
          =============================================== */

          if (
            event === "SIGNED_OUT"
          ) {

            console.warn(
              "ProtectedAdmin: Supabase session ended."
            );

            setSession(null);

          }

        }
      );


    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {

      mounted = false;

      subscription?.unsubscribe();

    };

  }, []);


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <main className="admin-loading">

        <div>
          Checking admin access...
        </div>

      </main>

    );

  }


  /* =========================================================
     NOT AUTHENTICATED
  ========================================================= */

  if (!session) {

    return (

      <Navigate
        to="/admin/login"
        replace
      />

    );

  }


  /* =========================================================
     AUTHENTICATED
  ========================================================= */

  return children;

}