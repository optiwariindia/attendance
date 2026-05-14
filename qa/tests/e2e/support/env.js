function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for this test`);
  }
  return value;
}

function credentials(prefix) {
  return {
    username: process.env[`${prefix}_USERNAME`],
    password: process.env[`${prefix}_PASSWORD`],
  };
}

function hasCredentials(prefix) {
  const creds = credentials(prefix);
  return Boolean(creds.username && creds.password);
}

module.exports = {
  credentials,
  hasCredentials,
  requiredEnv,
  allowMutation: process.env.E2E_ALLOW_MUTATION === "true",
};
