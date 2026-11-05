(() => {
  "use strict";

  const config = window.AGOGI_SUPABASE_CONFIG;
  const API = config?.url?.replace(/\/$/, "");
  const KEY = config?.publishableKey;

  if (!API || !KEY) {
    console.warn("AGOGI: Supabase configuration missing.");
    return;
  }

  const STORAGE_KEY = "agogi_auth_session";
  let session = null;
  let mode = "login";

  try {
    session = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  async function request(path, options = {}) {
    const response = await fetch(API + "/auth/v1/" + path, {
      ...options,
      headers: {
        apikey: KEY,
        "Content-Type": "application/json",
        ...(session?.access_token
          ? { Authorization: "Bearer " + session.access_token }
          : {}),
        ...options.headers
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.msg ||
        data.error_description ||
        data.message ||
        data.error ||
        "Something went wrong."
      );
    }

    return data;
  }

  function saveSession(data) {
    if (data?.access_token) {
      session = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }

  async function refreshSession() {
    if (!session?.refresh_token) return;

    try {
      const data = await request("token?grant_type=refresh_token", {
        method: "POST",
        body: JSON.stringify({
          refresh_token: session.refresh_token
        })
      });
      saveSession(data);
    } catch {
      session = null;
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function styles() {
    if (document.getElementById("agogi-auth-style")) return;

    const style = document.createElement("style");
    style.id = "agogi-auth-style";
    style.textContent = `
      #agogi-auth-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: #101714;
        color: #f6f0df;
        overflow-y: auto;
        padding: 55px 22px 35px;
        font-family: system-ui, sans-serif;
      }
      .agogi-auth-card {
        max-width: 420px;
        margin: auto;
      }
      .agogi-auth-brand {
        text-align: center;
        color: #d9b56b;
        font-size: 36px;
        font-weight: 900;
        letter-spacing: 5px;
      }
      .agogi-auth-tagline {
        text-align: center;
        color: #a4aaa2;
        margin: 8px 0 38px;
        letter-spacing: 2px;
        font-size: 12px;
      }
      .agogi-auth-card h2 {
        margin-bottom: 8px;
      }
      .agogi-auth-card p {
        color: #a4aaa2;
      }
      .agogi-auth-card input {
        box-sizing: border-box;
        display: block;
        width: 100%;
        padding: 15px;
        margin: 12px 0;
        background: #1d2923;
        border: 1px solid #425044;
        border-radius: 12px;
        color: white;
        font-size: 16px;
      }
      .agogi-auth-card button {
        width: 100%;
        padding: 15px;
        margin-top: 12px;
        border: 0;
        border-radius: 12px;
        background: #d9b56b;
        color: #101714;
        font-size: 15px;
        font-weight: 800;
        cursor: pointer;
      }
      .agogi-auth-card button.secondary {
        background: transparent;
        color: #d9b56b;
        border: 1px solid #6c654e;
      }
      .agogi-auth-message {
        margin-top: 15px;
        line-height: 1.5;
      }
    `;
    document.head.appendChild(style);
  }

  function close() {
    document.getElementById("agogi-auth-overlay")?.remove();
  }

  function showMessage(message, error = false) {
    const el = document.getElementById("agogi-auth-message");
    if (!el) return;
    el.textContent = message;
    el.style.color = error ? "#ff9b8f" : "#a8d7a6";
  }

  function open(nextMode = "login") {
    mode = nextMode;
    styles();
    close();

    const overlay = document.createElement("div");
    overlay.id = "agogi-auth-overlay";

    const loggedIn = !!session?.access_token;

    overlay.innerHTML = `
      <div class="agogi-auth-card">
        <div class="agogi-auth-brand">AGOGI</div>
        <div class="agogi-auth-tagline">THE ART OF STRENGTH</div>
        <h2>${
          loggedIn ? "Your Account" :
          mode === "signup" ? "Join AGOGI" :
          mode === "reset" ? "Reset Password" :
          "Welcome Back"
        }</h2>
        <p>${
          loggedIn
            ? "You're signed in to AGOGI."
            : "Your strength. Your journey."
        }</p>

        ${loggedIn ? `
          <p>${session.user?.email || ""}</p>
          <button id="agogi-signout">Sign Out</button>
          <button class="secondary" id="agogi-close">
            Return to AGOGI
          </button>
        ` : `
          <form id="agogi-auth-form">
            <input id="agogi-email" type="email"
              placeholder="Email address"
              autocomplete="email" required>
            ${mode !== "reset" ? `
              <input id="agogi-password" type="password"
                placeholder="Password"
                autocomplete="${
                  mode === "signup" ? "new-password" : "current-password"
                }"
                minlength="6" required>
            ` : ""}
            <button type="submit">${
              mode === "signup" ? "Create Account" :
              mode === "reset" ? "Send Reset Email" :
              "Sign In"
            }</button>
          </form>
          <button class="secondary" id="agogi-switch">
            ${mode === "signup"
              ? "Already have an account? Sign In"
              : "Create an Account"}
          </button>
          <button class="secondary" id="agogi-reset">
            ${mode === "reset" ? "Back to Sign In" : "Forgot Password?"}
          </button>
          <button class="secondary" id="agogi-close">
            Return to AGOGI
          </button>
        `}
        <div class="agogi-auth-message"
          id="agogi-auth-message" role="status"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#agogi-close")?.addEventListener("click", close);

    overlay.querySelector("#agogi-switch")?.addEventListener("click", () => {
      open(mode === "signup" ? "login" : "signup");
    });

    overlay.querySelector("#agogi-reset")?.addEventListener("click", () => {
      open(mode === "reset" ? "login" : "reset");
    });

    overlay.querySelector("#agogi-signout")?.addEventListener(
      "click",
      async () => {
        try {
          await request("logout", { method: "POST" });
        } catch {}
        session = null;
        localStorage.removeItem(STORAGE_KEY);
        open("login");
      }
    );

    overlay.querySelector("#agogi-auth-form")?.addEventListener(
      "submit",
      async event => {
        event.preventDefault();

        const email = overlay.querySelector("#agogi-email").value.trim();
        const password = overlay.querySelector("#agogi-password")?.value;
        const button = overlay.querySelector('button[type="submit"]');

        button.disabled = true;
        button.textContent = "Please wait...";

        try {
          if (mode === "signup") {
            const data = await request("signup", {
              method: "POST",
              body: JSON.stringify({ email, password })
            });

            if (data.access_token) {
              saveSession(data);
              open();
            } else {
              showMessage(
                "Check your email to confirm your account, then sign in."
              );
            }
          } else if (mode === "reset") {
            await request("recover", {
              method: "POST",
              body: JSON.stringify({
                email,
                gotrue_meta_security: {}
              })
            });
            showMessage("If the account exists, a reset email will be sent.");
          } else {
            const data = await request("token?grant_type=password", {
              method: "POST",
              body: JSON.stringify({ email, password })
            });
            saveSession(data);
            open();
          }
        } catch (error) {
          showMessage(error.message, true);
        } finally {
          button.disabled = false;
          if (button.textContent === "Please wait...") {
            button.textContent = "Try Again";
          }
        }
      }
    );
  }

  window.AGOGI_AUTH = {
    open,
    close,
    getSession: () => session,
    refreshSession
  };

  refreshSession();
})();
