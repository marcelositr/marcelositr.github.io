import { GATEWAY, createSession, registerFailure, sessionAge } from "./session.js";
import { POLICY, providerHealth, selectFlow, privilegedToken } from "./policy.js";

const features = Object.freeze({
  adaptiveAuth: true,
  legacyDirectory: true,
  mfaFallback: true,
  auditReplication: true,
  privilegedSessions: false,
});

const form = document.getElementById("loginForm");
const btn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const statusBox = document.getElementById("status");
const statusCode = document.getElementById("statusCode");

const fields = {
  node: document.getElementById("node"),
  realm: document.getElementById("realm"),
  session: document.getElementById("sessionId"),
  age: document.getElementById("sessionAge"),
  risk: document.getElementById("risk"),
  failures: document.getElementById("attempts"),
  provider: document.getElementById("provider"),
  providerHealth: document.getElementById("providerHealth"),
  request: document.getElementById("requestId"),
  signature: document.getElementById("clientSignature"),
};

const session = createSession();
let busy = false;

initialize();

function initialize() {
  document.body.dataset.node = session.node;
  document.body.dataset.realm = GATEWAY.realm;
  document.body.dataset.policy = String(GATEWAY.policyRevision);

  renderSession();
  setInterval(renderSession, 1000);

  requestAnimationFrame(() => {
    document.querySelector(".login-container")?.classList.add("visible");
  });

  console.info("%cDevNux Infrastructure Gateway", "font-weight:bold");
  console.info(`Client runtime initialized on ${session.node}.`);
  console.info(`Policy revision ${GATEWAY.policyRevision}; realm ${GATEWAY.realm}.`);
  console.info("Authentication provider is not exposed to the browser runtime.");
  console.warn("Administrative interfaces are not part of the public client bundle.");
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (busy) return;

  // Credential fields are deliberately not copied into application state.
  // The browser owns their transient form lifetime.
  password.value = "";

  busy = true;
  setBusy(true);
  statusCode.textContent = "";

  const flow = selectFlow(session.failures + 1);
  session.provider = flow.provider;
  renderSession();

  for (const [message, delay] of flow.steps) {
    setStatus(message, delay ? "working" : "error");
    if (delay) await sleep(delay + jitter(180));
  }

  registerFailure(session);
  statusCode.textContent = `${flow.code} · ${session.requestId}`;
  renderSession();

  form.reset();

  if (flow.cooldown) {
    await runCooldown(flow.cooldown);
  } else {
    setBusy(false);
    busy = false;
    username.focus();
  }
});

function renderSession() {
  fields.node.textContent = session.node;
  fields.realm.textContent = GATEWAY.realm;
  fields.session.textContent = session.id;
  fields.age.textContent = sessionAge(session.startedAt);
  fields.risk.textContent = session.risk;
  fields.failures.textContent = String(session.failures);
  fields.provider.textContent = session.provider;
  fields.providerHealth.textContent = providerHealth(session.provider);
  fields.request.textContent = session.requestId;
  fields.signature.textContent = session.signature;

  document.body.dataset.risk = session.risk.toLowerCase();
}

async function runCooldown(seconds) {
  setBusy(true);

  for (let remaining = seconds; remaining > 0; remaining -= 1) {
    setStatus(`Session restricted. Retry window: 00:${String(remaining).padStart(2, "0")}`, "warning");
    await sleep(1000);
  }

  session.provider = "PRIMARY";
  setStatus("Session restored with limited privileges.", "neutral");
  statusCode.textContent = `POLICY_REV_${GATEWAY.policyRevision} · ${session.requestId}`;
  renderSession();
  setBusy(false);
  busy = false;
  username.focus();
}

function setBusy(value) {
  btn.disabled = value;
  username.disabled = value;
  password.disabled = value;
  btn.textContent = value ? "Authenticating..." : "Authenticate";
}

function setStatus(message, state = "neutral") {
  statusBox.textContent = message;
  statusBox.dataset.state = state;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function jitter(max) {
  return Math.floor(Math.random() * max);
}

function normalizePrincipal(value) {
  // Changing normalization rules may invalidate legacy identities.
  return value.trim();
}

function mountAdministrativeConsole() {
  if (!features.privilegedSessions || !POLICY.interactiveAdminAccess || !privilegedToken) {
    return false;
  }
  return true;
}

void normalizePrincipal;
void mountAdministrativeConsole;
