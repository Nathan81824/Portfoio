import { useState } from "react";

import {
  Lock,
  Mail,
  LogIn,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { supabase } from "../../javascript/supabase/supabaseClient";


/* =========================================================
   ADMIN LOGIN
========================================================= */

export default function AdminLogin() {

  const navigate = useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    /* =====================================================
       VALIDATION
    ===================================================== */

    const cleanEmail =
      email.trim();


    if (!cleanEmail) {

      setError(
        "Please enter your email."
      );

      return;

    }


    if (!password) {

      setError(
        "Please enter your password."
      );

      return;

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    try {

      setLoading(true);


      const {
        data,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword({

          email:
            cleanEmail,

          password,

        });


      /* ===================================================
         LOGIN ERROR
      =================================================== */

      if (loginError) {

        console.error(
          "Admin login error:",
          loginError
        );


        setError(
          loginError.message ||
          "Unable to sign in."
        );


        setPassword("");

        return;

      }


      /* ===================================================
         VERIFY SESSION
      =================================================== */

      if (!data?.session) {

        console.error(
          "Admin login succeeded but no session was returned."
        );


        setError(
          "Login succeeded, but no session was created. Please try again."
        );


        return;

      }


      console.log(
        "Admin login successful."
      );


      /* ===================================================
         REDIRECT
      =================================================== */

      navigate(
        "/admin/chat",
        {
          replace: true,
        }
      );

    } catch (loginError) {

      console.error(
        "Admin login exception:",
        loginError
      );


      setError(
        loginError?.message ||
        "Something went wrong while signing in."
      );


      setPassword("");

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <main className="admin-login">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="admin-login-background"
        aria-hidden="true"
      >

        <span
          className="
            admin-login-glow
            admin-login-glow-one
          "
        />

        <span
          className="
            admin-login-glow
            admin-login-glow-two
          "
        />

      </div>


      {/* ===================================================
          LOGIN CARD
      =================================================== */}

      <section
        className="admin-login-card"
        aria-labelledby="admin-login-title"
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-login-header">

          <div className="admin-login-icon">

            <Lock
              size={22}
              strokeWidth={1.7}
              aria-hidden="true"
            />

          </div>


          <div>

            <p className="admin-login-label">
              PRIVATE AREA
            </p>

            <h1 id="admin-login-title">
              Admin Login
            </h1>

          </div>

        </div>


        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p className="admin-login-description">

          Sign in to manage visitor
          conversations and reply to
          messages.

        </p>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            className="admin-login-error"
            role="alert"
          >

            <AlertCircle
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >

          {/* ===============================================
              EMAIL
          =============================================== */}

          <label
            className="admin-login-field"
          >

            <span>
              Email
            </span>


            <div className="admin-login-input">

              <Mail
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
              />


              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="admin@example.com"
                autoComplete="username"
                disabled={loading}
                required
              />

            </div>

          </label>


          {/* ===============================================
              PASSWORD
          =============================================== */}

          <label
            className="admin-login-field"
          >

            <span>
              Password
            </span>


            <div className="admin-login-input">

              <Lock
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
              />


              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                required
              />

            </div>

          </label>


          {/* ===============================================
              LOGIN BUTTON
          =============================================== */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            {loading ? (

              <>

                <Loader2
                  size={18}
                  className="admin-login-spinner"
                  aria-hidden="true"
                />

                <span>
                  Signing in...
                </span>

              </>

            ) : (

              <>

                <LogIn
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <span>
                  Sign In
                </span>

              </>

            )}

          </button>

        </form>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="admin-login-footer">

          <span>
            PRIVATE ADMIN DASHBOARD
          </span>

        </div>

      </section>

    </main>

  );

}