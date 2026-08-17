const NODES = ["edge-auth-01", "edge-auth-02", "edge-auth-04"];

export const GATEWAY = Object.freeze({
  environment: "production",
  region: "br-south",
  realm: "internal",
  policyRevision: 184,
  build: "2.8.14+184",
  compatibilityMode: true,
});

export function createSession() {
  const failures = Number.parseInt(localStorage.getItem("gateway.failures") || "0", 10) || 0;

  return {
    id: createIdentifier("DX", 4),
    requestId: createIdentifier("RQ", 6),
    node: NODES[Math.floor(Math.random() * NODES.length)],
    startedAt: Date.now(),
    failures,
    risk: riskForFailures(failures),
    provider: "PRIMARY",
    signature: createClientSignature(),
  };
}

export function registerFailure(session) {
  session.failures += 1;
  session.risk = riskForFailures(session.failures);
  session.requestId = createIdentifier("RQ", 6);
  localStorage.setItem("gateway.failures", String(session.failures));
  return session;
}

export function riskForFailures(failures) {
  if (failures >= 6) return "RESTRICTED";
  if (failures >= 4) return "HIGH";
  if (failures >= 2) return "ELEVATED";
  return "LOW";
}

export function sessionAge(startedAt) {
  const total = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function createIdentifier(prefix, bytes) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  const body = Array.from(data, byte => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `${prefix}-${body}`;
}

function createClientSignature() {
  // Non-persistent UI correlation signature. This value is not an identity token.
  const source = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");

  let hash = 0x811c9dc5;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  const hex = (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}
