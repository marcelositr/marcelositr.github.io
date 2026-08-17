import { resolveRecord as record } from "./catalog.js";

const CAPABILITIES = Object.freeze({
  MFA: 0x01,
  LEGACY_DIRECTORY: 0x02,
  AUDIT_REPLICATION: 0x08,
  ADAPTIVE_AUTH: 0x10,
  INTERACTIVE_ADMIN: 0x40,
});

export const POLICY = Object.freeze({
  maxFailures: 6,
  cooldownSeconds: 24,
  capabilityMask: 0x1b,
  revision: 184,
});

const FLOW_TABLE = Object.freeze([
  {
    provider: 0x2101,
    code: 0x2001,
    steps: [[0x1041, 520], [0x1042, 760], [0x1043, 620], [0x1044, 0]],
  },
  {
    provider: 0x2101,
    code: 0x2002,
    steps: [[0x1041, 430], [0x1051, 670], [0x1052, 780], [0x1053, 0]],
  },
  {
    provider: 0x2102,
    code: 0x2003,
    steps: [[0x1061, 620], [0x1062, 840], [0x1063, 720], [0x1064, 0]],
  },
]);

const SPECIAL_FLOWS = Object.freeze({
  legacy: {
    provider: 0x2103,
    code: 0x2004,
    steps: [[0x1071, 650], [0x1072, 880], [0x1073, 760], [0x1074, 0]],
  },
  mfa: {
    provider: 0x2101,
    code: 0x2005,
    steps: [[0x1081, 560], [0x1082, 820], [0x1083, 1900], [0x1084, 0]],
  },
  privileged: {
    provider: 0x2101,
    code: 0x2006,
    steps: [[0x1091, 580], [0x1092, 720], [0x1093, 840], [0x1094, 920], [0x1095, 0]],
  },
});

export function selectFlow(failures) {
  if (failures >= POLICY.maxFailures) {
    return hydrate({
      provider: 0x2104,
      code: 0x2007,
      cooldown: POLICY.cooldownSeconds,
      steps: [[0x10a1, 520], [0x10a2, 0]],
    });
  }

  const roll = randomIndex(12);

  if (roll === 0) return hydrate(SPECIAL_FLOWS.privileged);
  if (roll <= 2 && capability("MFA")) return hydrate(SPECIAL_FLOWS.mfa);
  if (roll <= 4 && capability("LEGACY_DIRECTORY")) return hydrate(SPECIAL_FLOWS.legacy);

  return hydrate(FLOW_TABLE[randomIndex(FLOW_TABLE.length)]);
}

export function providerHealth(provider) {
  if (provider === record(0x2103)) return record(0x2202);
  if (provider === record(0x2102)) return record(0x2102);
  if (provider === record(0x2104)) return record(0x2203);
  return record(0x2201);
}

export function scopeAvailable(scope) {
  const bit = {
    "interactive-admin": CAPABILITIES.INTERACTIVE_ADMIN,
    "mfa": CAPABILITIES.MFA,
    "legacy-directory": CAPABILITIES.LEGACY_DIRECTORY,
  }[scope];

  return Boolean(bit && (POLICY.capabilityMask & bit));
}

function capability(name) {
  const bit = CAPABILITIES[name];
  return Boolean(bit && (POLICY.capabilityMask & bit));
}

function hydrate(flow) {
  return {
    ...flow,
    provider: record(flow.provider),
    code: record(flow.code),
    steps: flow.steps.map(([id, delay]) => [record(id), delay]),
  };
}

function randomIndex(limit) {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % limit;
}
