// GitHub OAuth for the Decap CMS editor at seunghoojin.com/admin/.
//
// GitHub Pages serves only static files, so the OAuth "client secret" step
// runs here, in a Cloudflare Worker:
//
//   1. /auth      Decap opens this in a popup. We send the browser to GitHub's
//                 consent page with a random `state`, kept in a cookie.
//   2. /callback  GitHub sends the browser back with a `code`. We check the
//                 state, exchange the code for a token with the client secret,
//                 and hand the token to the editor window with postMessage,
//                 but only if that window is on an allowed origin.
//
// The token goes from GitHub to the author's browser; it is never stored here.
//
// Settings (wrangler.toml and `wrangler secret put`):
//   GITHUB_CLIENT_ID      the OAuth App's client ID (a plain variable)
//   GITHUB_CLIENT_SECRET  the OAuth App's client secret (a secret)
//   ALLOWED_ORIGINS       comma-separated origins of the editor, for example
//                         "https://seunghoojin.com"
//   GITHUB_SCOPE          optional, default "public_repo"

const AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const TOKEN_URL = "https://github.com/login/oauth/access_token";
const STATE_COOKIE = "decap_oauth_state";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
    if (url.pathname === "/auth") return start(url, env);
    if (url.pathname === "/callback") return callback(request, url, env);
    return new Response("Not found", { status: 404 });
  },
};

function start(url, env) {
  const provider = url.searchParams.get("provider") || "github";
  if (provider !== "github") return popup(env, "error", { message: "Only GitHub sign-in is supported." });
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return popup(env, "error", { message: "The sign-in service is not configured yet." });
  }

  const state = randomState();
  const target = new URL(AUTHORIZE_URL);
  target.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  target.searchParams.set("redirect_uri", `${url.origin}/callback`);
  target.searchParams.set("scope", env.GITHUB_SCOPE || "public_repo");
  target.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: target.toString(),
      "Set-Cookie": `${STATE_COOKIE}=${state}; Path=/callback; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
      "Cache-Control": "no-store",
    },
  });
}

async function callback(request, url, env) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expected = readCookie(request.headers.get("Cookie"), STATE_COOKIE);

  if (url.searchParams.get("error")) {
    return popup(env, "error", { message: url.searchParams.get("error_description") || "Sign-in was cancelled." });
  }
  if (!code || !state || !expected || state !== expected) {
    return popup(env, "error", { message: "The sign-in could not be verified. Please try again." });
  }

  let data;
  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "seunghoojin-cms-auth",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/callback`,
      }),
    });
    data = await res.json();
  } catch {
    return popup(env, "error", { message: "GitHub could not be reached. Please try again." });
  }

  if (!data.access_token) {
    return popup(env, "error", { message: data.error_description || "GitHub did not return a token." });
  }
  return popup(env, "success", { token: data.access_token, provider: "github" });
}

// The page shown in the popup. It follows Decap's handshake: announce itself
// to the editor window, wait for the editor's reply, and answer that origin,
// if it is allowed, with the result.
function popup(env, status, content) {
  const origins = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  // Escape "<" so nothing in the message can close the script element.
  const js = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Signing in</title></head>
<body>
<p>${status === "success" ? "Signed in. This window will close." : "Sign-in did not finish. You can close this window and try again."}</p>
<script>
(function () {
  var origins = ${js(origins)};
  var message = ${js(message)};
  function receive(e) {
    if (origins.indexOf(e.origin) === -1) return;
    window.removeEventListener("message", receive);
    window.opener.postMessage(message, e.origin);
  }
  if (!window.opener) return;
  window.addEventListener("message", receive);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      // The state is single use.
      "Set-Cookie": `${STATE_COOKIE}=; Path=/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
      "Referrer-Policy": "no-referrer",
    },
  });
}

function randomState() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function readCookie(header, name) {
  for (const part of String(header || "").split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return "";
}
