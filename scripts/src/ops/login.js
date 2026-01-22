const readlineSync = require("readline-sync");
const { makeApiCall, safePromise, getBaseUrl } = require("../utils");
const constants = require("../constants");
const fs = require("fs");
const path = require("path");

(async () => {
  regionIndex = readlineSync.keyInSelect(
    constants.CS_REGIONS.map((region) => region.name),
    "Please select Contentstack region",
  );
  if (regionIndex === -1) {
    console.info("No region selected...");
    return;
  }

  const region = constants.CS_REGIONS[regionIndex].value;
  const csBaseUrl = getBaseUrl(region);

  const email = readlineSync.question("Email: ");
  const password = readlineSync.question("Password: ", {
    hideEchoBack: true,
  });

  // Step 1: Try login without OTP
  let authtoken, userOrgs;
  const [loginError, loginData] = await safePromise(
    makeApiCall({
      url: `${csBaseUrl}/v3/user-session`,
      method: "POST",
      //   headers: { "Content-Type": "application/json" },
      data: { user: { email, password } },
      printError: false,
    }),
    "Login failed.",
    false,
  );

  if (loginData?.user) {
    authtoken = loginData.user.authtoken;
    userOrgs = loginData.user.organizations;
  }

  // Step 2: If 2FA required
  if (loginError?.error_code === 294) {
    authIndex = readlineSync.keyInSelect(
      constants.AUTHENTICATORS.map((auth) => auth.name),
      "Please select an authenticator",
    );
    if (authIndex === -1) {
      console.info("No authenticator selected...");
      return;
    }

    if (constants.AUTHENTICATORS[authIndex].value === "sms") {
      const [smsError] = await safePromise(
        makeApiCall({
          url: `${csBaseUrl}/v3/user/request_token_sms`,
          method: "POST",
          data: {
            user: { email, password },
          },
        }),
        "Error while requesting SMS 2FA token.",
      );

      if (!smsError)
        console.info("SMS 2FA token requested. Please check your phone.");
    }

    const tfa_token = readlineSync.question(
      constants.AUTHENTICATORS[authIndex].value === "sms"
        ? "Enter the 2FA code sent to your phone: "
        : "Enter the 2FA code generated on your authenticator app: ",
    );

    const [retryError, retryData] = await safePromise(
      makeApiCall({
        url: `${csBaseUrl}/v3/user-session`,
        method: "POST",
        data: {
          user: { email, password, tfa_token },
        },
      }),
      "Two-Factor Authentication verification failed.",
    );

    if (retryError) return;

    authtoken = retryData.user.authtoken;
    userOrgs = retryData.user.organizations;
  } else {
    console.error(
      "Looks like your email or password is invalid. Please try again or reset your password.",
    );
    return;
  }

  fs.writeFileSync(
    path.join(__dirname, "../../settings/credentials.json"),
    JSON.stringify({ region, authtoken, userOrgs }, null, 2),
  );
  console.info("Login's Authtoken saved Locally.");
})();
