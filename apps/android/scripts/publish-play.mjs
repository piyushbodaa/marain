#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ANDROID_DIR = path.resolve(__dirname, "..");
export const REPO_ROOT = path.resolve(ANDROID_DIR, "..", "..");
export const GRADLE_PATH = path.join(ANDROID_DIR, "app", "build.gradle.kts");
export const AAB_PATH = path.join(
  ANDROID_DIR,
  "app",
  "build",
  "outputs",
  "bundle",
  "release",
  "app-release.aab",
);
export const DEFAULT_KEY_PATH = path.join(ANDROID_DIR, "play-service-account.json");
export const DEFAULT_PACKAGE_NAME = "app.marain.learn";
export const DEFAULT_TOKEN_URI = "https://oauth2.googleapis.com/token";
export const PLAY_SCOPE = "https://www.googleapis.com/auth/androidpublisher";
export const PLAY_API_BASE = "https://androidpublisher.googleapis.com/androidpublisher/v3";
export const PLAY_UPLOAD_BASE = "https://androidpublisher.googleapis.com/upload/androidpublisher/v3";
export const MAX_RELEASE_NOTES_LENGTH = 500;
export const VALID_TRACKS = new Set(["internal", "alpha", "beta", "production"]);
export const VALID_STATUSES = new Set(["completed", "draft"]);

const USAGE = `Marain Google Play Developer API v3 Uploader (zero-dependency)

Usage:
  ./publish-internal.sh [options]
  node apps/android/scripts/publish-play.mjs [options]

Options:
  --track <name>          Release track: internal (default), alpha, beta, production
  --notes "<text>"        en-US release notes (max ${MAX_RELEASE_NOTES_LENGTH} chars; default generated)
  --bump                  Auto-increment versionCode in apps/android/app/build.gradle.kts
  --version-name <X.Y.Z>  Update versionName in apps/android/app/build.gradle.kts
  --skip-build            Upload existing signed app-release.aab without rebuilding
  --key <path>            Service account JSON path (default: $PLAY_SERVICE_ACCOUNT_JSON
                          or apps/android/play-service-account.json)
  --status <state>        Release status: completed (default) or draft
  --dry-run               Validate config, version, notes, key (if present), and AAB,
                          and print planned API steps without making network calls
  -h, --help              Show this help message

Examples:
  ./publish-internal.sh --dry-run --skip-build --notes "v1.2.0 internal test"
  ./publish-internal.sh --skip-build --notes "v1.2.0 — Initial internal test release"
  ./publish-internal.sh --bump --notes "v1.2.1 — Bug fixes and polish"
  ./publish-internal.sh --skip-build --status draft --notes "v1.2.0 draft upload"
`;

export function parseArgs(argv) {
  const opts = {
    track: "internal",
    notes: null,
    bump: false,
    versionName: null,
    skipBuild: false,
    key: null,
    status: "completed",
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    let flag = arg;
    let inlineVal = null;

    if (arg.startsWith("--") && arg.includes("=")) {
      const idx = arg.indexOf("=");
      flag = arg.slice(0, idx);
      inlineVal = arg.slice(idx + 1);
    }

    const readValue = (name) => {
      if (inlineVal !== null) return inlineVal;
      if (i + 1 >= argv.length) {
        throw new Error(`Missing value for ${name}`);
      }
      return argv[++i];
    };

    switch (flag) {
      case "-h":
      case "--help":
        opts.help = true;
        break;
      case "--track":
        opts.track = readValue("--track");
        break;
      case "--notes":
        opts.notes = readValue("--notes");
        break;
      case "--bump":
        if (inlineVal !== null) {
          throw new Error("--bump does not accept a value");
        }
        opts.bump = true;
        break;
      case "--version-name":
        opts.versionName = readValue("--version-name");
        break;
      case "--skip-build":
        if (inlineVal !== null) {
          throw new Error("--skip-build does not accept a value");
        }
        opts.skipBuild = true;
        break;
      case "--key":
        opts.key = readValue("--key");
        break;
      case "--status":
        opts.status = readValue("--status");
        break;
      case "--dry-run":
        if (inlineVal !== null) {
          throw new Error("--dry-run does not accept a value");
        }
        opts.dryRun = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}\nRun with --help to see supported options.`);
    }
  }

  if (!VALID_TRACKS.has(opts.track)) {
    throw new Error(
      `Invalid --track "${opts.track}". Must be one of: ${[...VALID_TRACKS].join(", ")}.`,
    );
  }
  if (!VALID_STATUSES.has(opts.status)) {
    throw new Error(
      `Invalid --status "${opts.status}". Must be one of: ${[...VALID_STATUSES].join(", ")}.`,
    );
  }
  if (opts.versionName !== null) {
    if (!opts.versionName.trim()) {
      throw new Error("--version-name cannot be empty.");
    }
    if (/[\r\n"\\]/.test(opts.versionName)) {
      throw new Error("--version-name cannot contain quotes, backslashes, or newlines.");
    }
  }

  return opts;
}

export function validateReleaseNotes(notes) {
  if (typeof notes !== "string" || notes.trim().length === 0) {
    throw new Error("Release notes cannot be empty.");
  }
  if (notes.length > MAX_RELEASE_NOTES_LENGTH) {
    throw new Error(
      `Release notes exceed Google Play's ${MAX_RELEASE_NOTES_LENGTH}-character limit ` +
        `(${notes.length}/${MAX_RELEASE_NOTES_LENGTH} characters). Shorten --notes and retry.`,
    );
  }
  return notes;
}

export function parseGradleConfig(gradleText) {
  const appIdMatch = gradleText.match(/\bapplicationId\s*=\s*"([^"]+)"/);
  const codeMatch = gradleText.match(/\bversionCode\s*=\s*(\d+)/);
  const nameMatch = gradleText.match(/\bversionName\s*=\s*"([^"]+)"/);

  if (!codeMatch) {
    throw new Error("Could not parse versionCode from build.gradle.kts");
  }
  if (!nameMatch) {
    throw new Error("Could not parse versionName from build.gradle.kts");
  }

  return {
    packageName: appIdMatch ? appIdMatch[1] : DEFAULT_PACKAGE_NAME,
    versionCode: Number.parseInt(codeMatch[1], 10),
    versionName: nameMatch[1],
  };
}

export function updateGradleVersionText(gradleText, { versionCode, versionName }) {
  let updated = gradleText;

  if (versionCode !== undefined) {
    const codeRegex = /(\bversionCode\s*=\s*)(\d+)/;
    if (!codeRegex.test(updated)) {
      throw new Error("Could not locate versionCode in build.gradle.kts to update.");
    }
    updated = updated.replace(codeRegex, `$1${versionCode}`);
  }

  if (versionName !== undefined) {
    const nameRegex = /(\bversionName\s*=\s*")([^"]+)(")/;
    if (!nameRegex.test(updated)) {
      throw new Error("Could not locate versionName in build.gradle.kts to update.");
    }
    updated = updated.replace(nameRegex, `$1${versionName}$3`);
  }

  return updated;
}

export function resolveKeySpec(keyArg, env = process.env) {
  const raw = keyArg ?? env.PLAY_SERVICE_ACCOUNT_JSON ?? null;
  if (raw && raw.trim().startsWith("{")) {
    return {
      source: keyArg ? "--key (inline JSON)" : "PLAY_SERVICE_ACCOUNT_JSON (inline JSON)",
      inlineJson: raw,
      filePath: null,
    };
  }
  if (raw && raw.trim().length > 0) {
    return {
      source: keyArg ? "--key" : "PLAY_SERVICE_ACCOUNT_JSON",
      inlineJson: null,
      filePath: path.resolve(process.cwd(), raw),
    };
  }
  return {
    source: "default",
    inlineJson: null,
    filePath: DEFAULT_KEY_PATH,
  };
}

export function validateServiceAccountKeyObject(obj, label = "service account key") {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error(`Invalid ${label}: expected a JSON object.`);
  }
  if (obj.type && obj.type !== "service_account") {
    throw new Error(
      `Invalid ${label}: expected "type": "service_account", got "${obj.type}".`,
    );
  }
  if (typeof obj.client_email !== "string" || !obj.client_email.includes("@")) {
    throw new Error(`Invalid ${label}: missing or malformed "client_email".`);
  }
  if (typeof obj.private_key !== "string" || !obj.private_key.includes("PRIVATE KEY")) {
    throw new Error(`Invalid ${label}: missing or malformed PEM "private_key".`);
  }

  // Validate PEM structure using Node crypto without exposing key material.
  try {
    crypto.createPrivateKey(obj.private_key);
  } catch (err) {
    throw new Error(
      `Invalid ${label}: "private_key" could not be parsed as a valid private key (${err.message}).`,
    );
  }

  const tokenUri =
    typeof obj.token_uri === "string" && obj.token_uri.trim().length > 0
      ? obj.token_uri.trim()
      : DEFAULT_TOKEN_URI;

  return {
    client_email: obj.client_email.trim(),
    private_key: obj.private_key,
    token_uri: tokenUri,
    project_id: typeof obj.project_id === "string" ? obj.project_id : null,
  };
}

export function loadServiceAccountKey(keySpec, { allowMissing = false } = {}) {
  if (keySpec.inlineJson !== null) {
    let parsed;
    try {
      parsed = JSON.parse(keySpec.inlineJson);
    } catch (err) {
      throw new Error(`Failed to parse ${keySpec.source} as JSON: ${err.message}`);
    }
    return {
      present: true,
      location: keySpec.source,
      key: validateServiceAccountKeyObject(parsed, keySpec.source),
    };
  }

  if (!fs.existsSync(keySpec.filePath)) {
    if (allowMissing) {
      return { present: false, location: keySpec.filePath, key: null };
    }
    throw new Error(
      `Service account key not found at: ${keySpec.filePath}\n` +
        `Place your Google Play service account JSON key at apps/android/play-service-account.json ` +
        `(gitignored), pass --key <path>, or set PLAY_SERVICE_ACCOUNT_JSON.`,
    );
  }

  const rawText = fs.readFileSync(keySpec.filePath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    throw new Error(`Failed to parse service account key at ${keySpec.filePath}: ${err.message}`);
  }

  return {
    present: true,
    location: keySpec.filePath,
    key: validateServiceAccountKeyObject(parsed, keySpec.filePath),
  };
}

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createServiceAccountJwt(
  serviceAccount,
  { scope = PLAY_SCOPE, nowSec = Math.floor(Date.now() / 1000), ttlSec = 3600 } = {},
) {
  const tokenUri = serviceAccount.token_uri || DEFAULT_TOKEN_URI;
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope,
    aud: tokenUri,
    iat: nowSec,
    exp: nowSec + ttlSec,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key);

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

async function exchangeJwtForAccessToken(serviceAccount) {
  const tokenUri = serviceAccount.token_uri || DEFAULT_TOKEN_URI;
  const jwt = createServiceAccountJwt(serviceAccount);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const rawText = await res.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!res.ok || !data?.access_token) {
    const detail = data?.error_description || data?.error || rawText || `HTTP ${res.status}`;
    const err = new Error(`OAuth2 token exchange failed (${res.status}): ${detail}`);
    err.httpStatus = res.status;
    err.apiMessage = detail;
    err.stage = "oauth";
    throw err;
  }

  return data.access_token;
}

async function playApiRequest(url, { method = "GET", accessToken, headers = {}, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
    body,
  });

  const rawText = await res.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const apiMessage =
      data?.error?.message ||
      (Array.isArray(data?.error?.errors) && data.error.errors[0]?.message) ||
      rawText ||
      `HTTP ${res.status}`;
    const err = new Error(`Google Play API error (${res.status}): ${apiMessage}`);
    err.httpStatus = res.status;
    err.apiMessage = apiMessage;
    err.apiBody = data;
    throw err;
  }

  return data;
}

export function buildActionableErrorHint(err, context = {}) {
  const status = err?.httpStatus;
  const msg = String(err?.apiMessage || err?.message || "");
  const lower = msg.toLowerCase();
  const hints = [];

  if (lower.includes("draft") && (lower.includes("only releases") || lower.includes("draft app"))) {
    hints.push(
      `This app is still in "draft" state on Google Play. Re-run with --status draft:\n` +
        `  ./publish-internal.sh --skip-build --status draft --notes "${(context.notes || "Internal test release").replace(/"/g, '\\"')}"`,
    );
  }

  if (
    status === 403 ||
    lower.includes("permission") ||
    lower.includes("not have sufficient permissions") ||
    lower.includes("forbidden")
  ) {
    const email = context.clientEmail || "<service-account-email>";
    hints.push(
      `403 Permission Denied troubleshooting:\n` +
        `  1. In Google Play Console -> Users and permissions, invite ${email} and grant\n` +
        `     "View app information" + "Release to testing tracks" (or Release manager) on ${context.packageName || DEFAULT_PACKAGE_NAME}.\n` +
        `  2. Ensure "Google Play Android Developer API" (androidpublisher.googleapis.com) is enabled in the GCP project.\n` +
        `  3. Known Google Play quirk: newly granted service account permissions can take up to 24-48h to propagate.\n` +
        `     Tip: making a tiny edit (e.g. re-saving the app description) in Play Console often forces immediate sync.`,
    );
  }

  if (
    status === 404 ||
    lower.includes("package not found") ||
    lower.includes("application not found")
  ) {
    hints.push(
      `Package "${context.packageName || DEFAULT_PACKAGE_NAME}" was not found in Google Play Console.\n` +
        `Google Play requires creating the app and uploading the VERY FIRST .aab manually in Play Console\n` +
        `once before the Play Developer API can upload subsequent releases.`,
    );
  }

  if (
    lower.includes("version code") &&
    (lower.includes("already been used") ||
      lower.includes("already exists") ||
      lower.includes("must be greater"))
  ) {
    hints.push(
      `This versionCode has already been uploaded to Google Play.\n` +
        `Re-run with --bump (without --skip-build) to increment versionCode and rebuild:\n` +
        `  ./publish-internal.sh --bump --notes "..."`,
    );
  }

  if (lower.includes("signed") || lower.includes("certificate") || lower.includes("fingerprint")) {
    hints.push(
      `Signing key mismatch: verify apps/android/keystore.properties and apps/android/marain-upload.jks\n` +
        `match the upload key certificate registered in Play Console -> Setup -> App integrity.`,
    );
  }

  if (err?.stage === "oauth" || lower.includes("invalid_grant") || lower.includes("invalid_jwt")) {
    hints.push(
      `OAuth2 JWT error: check system clock sync (date -u) and confirm the service account key\n` +
        `has not been disabled or deleted in Google Cloud IAM.`,
    );
  }

  return hints;
}

function runStep(cmd, args, cwd, label) {
  console.log(`\n==> ${label}`);
  console.log(`    $ ${cmd} ${args.join(" ")}  (cwd: ${cwd})`);
  const res = spawnSync(cmd, args, { cwd, stdio: "inherit" });
  if (res.error) {
    throw new Error(`Failed to start ${cmd}: ${res.error.message}`);
  }
  if (res.status !== 0) {
    throw new Error(`Command failed with exit code ${res.status}: ${cmd} ${args.join(" ")}`);
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB (${bytes.toLocaleString("en-US")} bytes)`;
}

export async function runCli(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);
  if (opts.help) {
    console.log(USAGE);
    return 0;
  }

  if (typeof fetch !== "function") {
    throw new Error(
      `Node.js 18+ with global fetch is required (current version: ${process.version}).`,
    );
  }

  if (!fs.existsSync(GRADLE_PATH)) {
    throw new Error(`Android Gradle file not found at: ${GRADLE_PATH}`);
  }

  const gradleText = fs.readFileSync(GRADLE_PATH, "utf8");
  const current = parseGradleConfig(gradleText);

  if (opts.skipBuild && (opts.bump || opts.versionName !== null)) {
    throw new Error(
      "Cannot combine --skip-build with --bump or --version-name: the existing AAB would still " +
        "contain the old versionCode/versionName. Omit --skip-build to rebuild with the new version.",
    );
  }

  const targetVersionCode = opts.bump ? current.versionCode + 1 : current.versionCode;
  const targetVersionName = opts.versionName ?? current.versionName;
  const defaultNotes = `Marain v${targetVersionName} (${targetVersionCode}) — ${opts.track} track release.`;
  const releaseNotes = validateReleaseNotes(opts.notes ?? defaultNotes);

  const keySpec = resolveKeySpec(opts.key);
  const keyResult = loadServiceAccountKey(keySpec, { allowMissing: opts.dryRun });

  const aabExists = fs.existsSync(AAB_PATH);
  const aabSize = aabExists ? fs.statSync(AAB_PATH).size : 0;

  if (opts.skipBuild) {
    if (!aabExists || aabSize === 0) {
      throw new Error(
        `Signed bundle not found or empty at: ${AAB_PATH}\n` +
          `Omit --skip-build to build it first, or run ./gradlew bundleRelease in apps/android.`,
      );
    }
  }

  const releaseName = `${targetVersionName} (${targetVersionCode})`;
  const editUrl = `${PLAY_API_BASE}/applications/${current.packageName}/edits`;
  const uploadUrl = `${PLAY_UPLOAD_BASE}/applications/${current.packageName}/edits/{editId}/bundles?uploadType=media`;
  const trackUrl = `${PLAY_API_BASE}/applications/${current.packageName}/edits/{editId}/tracks/${opts.track}`;
  const commitUrl = `${PLAY_API_BASE}/applications/${current.packageName}/edits/{editId}:commit`;

  if (opts.dryRun) {
    console.log("Marain Play Uploader — DRY RUN (no files modified, no network calls)");
    console.log("--------------------------------------------------------------------");
    console.log(`Package ID    : ${current.packageName}`);
    console.log(
      `Version       : ${current.versionName} (${current.versionCode})` +
        (opts.bump || opts.versionName
          ? ` -> would update to ${targetVersionName} (${targetVersionCode})`
          : ""),
    );
    console.log(`Track / Status: ${opts.track} / ${opts.status}`);
    console.log(`Release Name  : ${releaseName}`);
    console.log(
      `Release Notes : (${releaseNotes.length}/${MAX_RELEASE_NOTES_LENGTH} chars) ${releaseNotes}`,
    );
    if (keyResult.present) {
      console.log(
        `Service Key   : OK (${keyResult.location}; client_email=${keyResult.key.client_email})`,
      );
    } else {
      console.log(
        `Service Key   : [MISSING] ${keyResult.location} (place gitignored JSON key here or pass --key / PLAY_SERVICE_ACCOUNT_JSON)`,
      );
    }
    if (aabExists) {
      console.log(`AAB Bundle    : FOUND (${formatBytes(aabSize)}) -> ${AAB_PATH}`);
    } else {
      console.log(`AAB Bundle    : NOT BUILT YET (will be created during build step) -> ${AAB_PATH}`);
    }
    const keystoreProps = path.join(ANDROID_DIR, "keystore.properties");
    if (!opts.skipBuild) {
      console.log(
        `Keystore Props: ${fs.existsSync(keystoreProps) ? "FOUND" : "[MISSING]"} -> ${keystoreProps}`,
      );
    }

    console.log("\nPlanned Execution Steps:");
    let step = 1;
    if (opts.bump || opts.versionName) {
      console.log(
        `  ${step++}. Update ${path.relative(REPO_ROOT, GRADLE_PATH)} -> versionName="${targetVersionName}", versionCode=${targetVersionCode}`,
      );
    }
    if (opts.skipBuild) {
      console.log(`  ${step++}. Skip build (--skip-build); reuse ${path.relative(REPO_ROOT, AAB_PATH)}`);
    } else {
      console.log(
        `  ${step++}. Build & verify: npm --prefix packages/curriculum run build && ./sync-curriculum.sh && ./gradlew testDebugUnitTest testReleaseUnitTest bundleRelease --no-daemon`,
      );
    }
    console.log(
      `  ${step++}. Sign RS256 JWT (scope: ${PLAY_SCOPE}) and POST ${keyResult.key?.token_uri || DEFAULT_TOKEN_URI}`,
    );
    console.log(`  ${step++}. POST ${editUrl}  -> editId`);
    console.log(`  ${step++}. POST ${uploadUrl}  (Content-Type: application/octet-stream)`);
    console.log(
      `  ${step++}. PUT  ${trackUrl}  (release="${releaseName}", status="${opts.status}", lang="en-US")`,
    );
    console.log(`  ${step++}. POST ${commitUrl}`);
    console.log("\nDry run validation passed.");
    return 0;
  }

  // Live run
  if (opts.bump || opts.versionName !== null) {
    const updatedGradle = updateGradleVersionText(gradleText, {
      versionCode: opts.bump ? targetVersionCode : undefined,
      versionName: opts.versionName !== null ? targetVersionName : undefined,
    });
    fs.writeFileSync(GRADLE_PATH, updatedGradle, "utf8");
    console.log(
      `Updated ${path.relative(REPO_ROOT, GRADLE_PATH)}: ${current.versionName} (${current.versionCode}) -> ${targetVersionName} (${targetVersionCode})`,
    );
  }

  if (!opts.skipBuild) {
    runStep(
      "npm",
      ["--prefix", path.join(REPO_ROOT, "packages", "curriculum"), "run", "build"],
      REPO_ROOT,
      "Building curriculum bundle",
    );
    runStep("./sync-curriculum.sh", [], ANDROID_DIR, "Syncing curriculum.json into Android assets");
    runStep(
      "./gradlew",
      ["testDebugUnitTest", "testReleaseUnitTest", "bundleRelease", "--no-daemon"],
      ANDROID_DIR,
      "Running unit tests & building signed release AAB",
    );
  }

  if (!fs.existsSync(AAB_PATH)) {
    throw new Error(`Expected signed AAB was not produced at: ${AAB_PATH}`);
  }
  const aabBuffer = fs.readFileSync(AAB_PATH);
  if (aabBuffer.length === 0) {
    throw new Error(`Signed AAB at ${AAB_PATH} is empty (0 bytes).`);
  }

  console.log(`\n==> Publishing ${current.packageName} to Google Play (${opts.track} / ${opts.status})`);
  console.log(`    Bundle        : ${AAB_PATH} (${formatBytes(aabBuffer.length)})`);
  console.log(`    Service Acct  : ${keyResult.key.client_email}`);

  let editId = null;
  let accessToken = null;

  try {
    console.log("  [1/5] Exchanging RS256 service account JWT for OAuth2 access token...");
    accessToken = await exchangeJwtForAccessToken(keyResult.key);

    console.log("  [2/5] Creating Play Developer API edit...");
    const edit = await playApiRequest(editUrl, {
      method: "POST",
      accessToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    editId = edit?.id;
    if (!editId) {
      throw new Error("Play API did not return an edit id.");
    }
    console.log(`        editId = ${editId}`);

    console.log(`  [3/5] Uploading AAB (${formatBytes(aabBuffer.length)})...`);
    const uploaded = await playApiRequest(
      `${PLAY_UPLOAD_BASE}/applications/${current.packageName}/edits/${encodeURIComponent(editId)}/bundles?uploadType=media`,
      {
        method: "POST",
        accessToken,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": String(aabBuffer.length),
        },
        body: aabBuffer,
      },
    );

    const uploadedVersionCode = uploaded?.versionCode ?? targetVersionCode;
    if (String(uploadedVersionCode) !== String(targetVersionCode)) {
      console.warn(
        `        [WARN] Uploaded AAB versionCode (${uploadedVersionCode}) differs from build.gradle.kts (${targetVersionCode}); using ${uploadedVersionCode}.`,
      );
    }
    const finalReleaseName = `${targetVersionName} (${uploadedVersionCode})`;
    console.log(`        Uploaded bundle versionCode = ${uploadedVersionCode}`);

    console.log(`  [4/5] Assigning release "${finalReleaseName}" to track "${opts.track}" (${opts.status})...`);
    await playApiRequest(
      `${PLAY_API_BASE}/applications/${current.packageName}/edits/${encodeURIComponent(editId)}/tracks/${encodeURIComponent(opts.track)}`,
      {
        method: "PUT",
        accessToken,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track: opts.track,
          releases: [
            {
              name: finalReleaseName,
              versionCodes: [String(uploadedVersionCode)],
              status: opts.status,
              releaseNotes: [
                {
                  language: "en-US",
                  text: releaseNotes,
                },
              ],
            },
          ],
        }),
      },
    );

    console.log("  [5/5] Committing edit...");
    await playApiRequest(
      `${PLAY_API_BASE}/applications/${current.packageName}/edits/${encodeURIComponent(editId)}:commit`,
      {
        method: "POST",
        accessToken,
      },
    );

    console.log("\nSUCCESS: Uploaded and committed to Google Play!");
    console.log(`  Package      : ${current.packageName}`);
    console.log(`  Track        : ${opts.track}`);
    console.log(`  Status       : ${opts.status}`);
    console.log(`  Release Name : ${finalReleaseName}`);
    console.log(`  Version Code : ${uploadedVersionCode}`);
    console.log(`  Edit ID      : ${editId}`);
    return 0;
  } catch (err) {
    if (editId && accessToken) {
      try {
        await playApiRequest(
          `${PLAY_API_BASE}/applications/${current.packageName}/edits/${encodeURIComponent(editId)}`,
          { method: "DELETE", accessToken },
        );
      } catch {
        // Best-effort cleanup of uncommitted edit
      }
    }
    const hints = buildActionableErrorHint(err, {
      packageName: current.packageName,
      clientEmail: keyResult.key.client_email,
      notes: releaseNotes,
    });
    console.error(`\nERROR: ${err.message}`);
    for (const hint of hints) {
      console.error(`\nHint:\n${hint}`);
    }
    return 1;
  }
}

function isDirectRun() {
  if (!process.argv[1]) return false;
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(__filename);
  } catch {
    return path.resolve(process.argv[1]) === __filename;
  }
}

if (isDirectRun()) {
  runCli().then(
    (code) => process.exit(code),
    (err) => {
      console.error(`ERROR: ${err.message}`);
      process.exit(1);
    },
  );
}
