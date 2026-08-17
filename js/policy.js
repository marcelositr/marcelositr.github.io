export const POLICY = Object.freeze({
  maxFailures: 6,
  cooldownSeconds: 24,
  requireMFA: true,
  allowLegacyProvider: true,
  interactiveAdminAccess: false,
});

const STANDARD_FAILURES = [
  {
    provider: "PRIMARY",
    code: "ERR_AUTH_POLICY_4032",
    steps: [
      ["Establishing secure session...", 520],
      ["Validating credentials...", 760],
      ["Evaluating access policy...", 620],
      ["Authentication denied.", 0],
    ],
  },
  {
    provider: "PRIMARY",
    code: "ERR_REALM_MISMATCH",
    steps: [
      ["Establishing secure session...", 430],
      ["Resolving identity realm...", 670],
      ["Applying directory policy...", 780],
      ["Unknown principal or invalid credentials.", 0],
    ],
  },
  {
    provider: "FAILOVER",
    code: "ERR_IDP_UNAVAILABLE",
    steps: [
      ["Contacting primary identity provider...", 620],
      ["Primary provider unavailable. Selecting failover...", 840],
      ["Synchronizing authentication context...", 720],
      ["Authentication failed.", 0],
    ],
  },
];

const LEGACY_FLOW = {
  provider: "LDAP_COMPAT",
  code: "ERR_LEGACY_ROTATION_REQUIRED",
  steps: [
    ["Legacy credential signature detected.", 650],
    ["Migrating authentication context...", 880],
    ["Legacy provider accepted authentication context.", 760],
    ["Credential rotation service unavailable.", 0],
  ],
};

const MFA_FLOW = {
  provider: "PRIMARY",
  code: "ERR_MFA_CHALLENGE_EXPIRED",
  steps: [
    ["Primary authentication completed.", 560],
    ["Requesting second factor approval...", 820],
    ["Waiting for authenticator response...", 1900],
    ["MFA challenge expired.", 0],
  ],
};

const PRIVILEGED_FLOW = {
  provider: "PRIMARY",
  code: "ERR_PRIVILEGED_SCOPE_DENIED",
  steps: [
    ["Credentials accepted.", 580],
    ["Loading administrative session...", 720],
    ["Applying privileged access policy...", 840],
    ["Requesting privileged token...", 920],
    ["Privileged token rejected by policy.", 0],
  ],
};

export function selectFlow(failures) {
  if (failures >= POLICY.maxFailures) {
    return {
      provider: "POLICY_ENGINE",
      code: "ERR_SESSION_RESTRICTED",
      cooldown: POLICY.cooldownSeconds,
      steps: [
        ["Adaptive abuse protection triggered.", 520],
        ["Session placed in restricted mode.", 0],
      ],
    };
  }

  const roll = Math.floor(Math.random() * 12);

  if (roll === 0) return PRIVILEGED_FLOW;
  if (roll <= 2) return MFA_FLOW;
  if (roll <= 4) return LEGACY_FLOW;

  return STANDARD_FAILURES[Math.floor(Math.random() * STANDARD_FAILURES.length)];
}

export function providerHealth(provider) {
  switch (provider) {
    case "LDAP_COMPAT":
      return "DEGRADED";
    case "FAILOVER":
      return "FAILOVER";
    case "POLICY_ENGINE":
      return "RESTRICTED";
    default:
      return "ONLINE";
  }
}

/*
 * The gateway has three kinds of users:
 * 1. authorized users
 * 2. unauthorized users
 * 3. people reading this comment hoping there is a password here
 */

export const privilegedToken = null;
