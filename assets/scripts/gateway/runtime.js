import { GATEWAY, createSession, registerFailure, sessionAge } from "./session.js";
import { POLICY, providerHealth, selectFlow, scopeAvailable } from "./policy.js";
import { resolveRecord as record } from "./catalog.js";

const runtime = Object.freeze({
  adaptiveAuth: scopeAvailable("mfa"),
  legacyDirectory: scopeAvailable("legacy-directory"),
  auditReplication: true,
});

const form = document.getElementById("loginForm");
const btn = document.getElementById("loginBtn");
const btnLabel = document.getElementById("loginBtnLabel");
const username = document.getElementById("username");
const password = document.getElementById("password");
const statusBox = document.getElementById("status");
const statusCode = document.getElementById("statusCode");
const serviceNode = document.getElementById("serviceNode");

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

  console.info(`%c${record(0x3001)}`, "font-weight:bold");
  console.info(`${record(0x3006)} ${session.node}.`);
  console.info(`${record(0x3007)} ${POLICY.revision}; ${record(0x3008)} ${GATEWAY.realm}.`);
  console.info(record(0x3004));
  console.warn(record(0x3005));
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (busy) return;

  // Credential values are never copied into runtime state.
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

  if (serviceNode) serviceNode.textContent = `${GATEWAY.region} / ${session.node}`;
  document.body.dataset.risk = session.risk.toLowerCase();
}

async function runCooldown(seconds) {
  setBusy(true);

  for (let remaining = seconds; remaining > 0; remaining -= 1) {
    setStatus(`${record(0x10c1)} 00:${String(remaining).padStart(2, "0")}`, "warning");
    await sleep(1000);
  }

  session.provider = record(0x2101);
  setStatus(record(0x10b1), "neutral");
  statusCode.textContent = `${record(0x2301)}${POLICY.revision} · ${session.requestId}`;
  renderSession();
  setBusy(false);
  busy = false;
  username.focus();
}

function setBusy(value) {
  btn.disabled = value;
  username.disabled = value;
  password.disabled = value;
  btnLabel.textContent = value ? record(0x10d1) : record(0x10d2);
}

function setStatus(message, state = "neutral") {
  statusBox.textContent = message;
  statusBox.dataset.state = state;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function jitter(max) {
  const sample = new Uint32Array(1);
  crypto.getRandomValues(sample);
  return sample[0] % max;
}

function normalizePrincipal(value) {
  return value.trim();
}

function mountAdministrativeConsole() {
  return runtime.adaptiveAuth && scopeAvailable("interactive-admin");
}

void normalizePrincipal;
void mountAdministrativeConsole;
