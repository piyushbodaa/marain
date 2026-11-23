package app.marain.learn.data

data class PrivacyPolicySection(
  val heading: String,
  val paragraphs: List<String>,
  val bullets: List<String> = emptyList(),
)

/**
 * Offline in-app Privacy Policy content aligned with https://marain.fun/privacy
 * and accurately describing Marain's local-only storage & disabled cloud/D2D backups.
 */
object PrivacyPolicyContent {
  const val TITLE = "Privacy Policy for Marain"
  const val EFFECTIVE_DATE = "November 23, 2026"
  const val PACKAGE_ID = "app.marain.learn"
  const val DEVELOPER = "Piyush Bodaa"
  const val WEBSITE_URL = "https://marain.fun"
  const val WEB_URL = "https://marain.fun/privacy"
  const val DEVELOPER_URL = "https://piyushbodaa.com"

  const val SUMMARY =
    "Marain is a 100% offline Android educational app. It requests no internet permission, requires no account, shows no ads, includes no analytics or tracking SDKs, disables Android cloud backup and device-to-device transfer, and never collects, transmits, sells, or shares any personal or device data."

  val sections: List<PrivacyPolicySection> = listOf(
    PrivacyPolicySection(
      heading = "1. Zero Data Collection",
      paragraphs = listOf(
        "Marain (app.marain.learn), developed by Piyush Bodaa (https://piyushbodaa.com), is designed from the ground up to work completely offline on your Android device.",
      ),
      bullets = listOf(
        "No account or sign-in: You never provide your name, email address, phone number, or login credentials.",
        "No personal or device data collected: We do not collect, transmit, store on remote servers, sell, or share any personal information, identifiers, location data, or usage telemetry.",
        "No advertisements: Marain contains zero ads, zero advertising IDs (AD_ID), and zero ad SDKs.",
        "No third-party analytics or crash reporters: Marain bundles zero tracking, telemetry, or crash-reporting libraries.",
      ),
    ),
    PrivacyPolicySection(
      heading = "2. Local-Only Storage & Backup Controls",
      paragraphs = listOf(
        "To remember your learning progress between sessions, Marain stores your app state strictly locally on your device inside a single private SharedPreferences file (marain_learn_prefs.xml). No other databases, external files, or network caches are created.",
      ),
      bullets = listOf(
        "Completed lessons, practice drill scores, Unit Mastery Check results, best combos, and unlocked milestones.",
        "Mastery-based CEFR fluency milestones (A0–C2), practice XP, daily 50 XP goal progress, and learning streaks.",
        "Mastered Phrasebook flashcards, saved chapter bookmarks, and onboarding completion state.",
        "Reading appearance preferences (Light Paper / Warm Sepia / Dark Obsidian theme and S / M / L font scale).",
        "Cloud backup & device-to-device transfer disabled: Marain explicitly sets allowBackup=\"false\" and excludes all storage domains from both Android cloud backup and device-to-device transfer so your local data never leaves this device.",
      ),
    ),
    PrivacyPolicySection(
      heading = "3. Erasing Your Data",
      paragraphs = listOf(
        "Your learning state stays exclusively on this device. You can erase all local Marain data permanently at any time by clearing app storage in Android Settings (Apps → Marain → Storage → Clear storage) or by uninstalling Marain.",
      ),
    ),
    PrivacyPolicySection(
      heading = "4. Permissions & Offline Design",
      paragraphs = listOf(
        "All 7 units, 28 chapters, 84 practice drills, and 50 Phrasebook entries are bundled directly inside the app. Marain does not request android.permission.INTERNET, advertising ID permissions, or access to your camera, microphone, contacts, location, or external storage.",
      ),
    ),
    PrivacyPolicySection(
      heading = "5. Children's Privacy",
      paragraphs = listOf(
        "Marain is safe for learners of all ages. Because the app operates completely offline and collects zero personal information from any user, we do not knowingly collect any personal data from children under 13 (or the equivalent minimum age in your jurisdiction).",
      ),
    ),
    PrivacyPolicySection(
      heading = "6. Policy Updates & Contact",
      paragraphs = listOf(
        "If Marain ever introduces optional online features in a future release, this Privacy Policy will be updated clearly before those changes take effect, along with a new effective date.",
        "Questions about Marain (app.marain.learn)? Reach developer Piyush Bodaa via https://piyushbodaa.com. Website: https://marain.fun · Online copy: https://marain.fun/privacy.",
      ),
    ),
  )
}
