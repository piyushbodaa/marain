package app.marain.learn

import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.PrivacyPolicyContent
import app.marain.learn.data.ProgressRepository
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UserProgress
import kotlinx.serialization.json.Json
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PrivacyAndStorageTest {

  private val json = Json {
    ignoreUnknownKeys = true
    encodeDefaults = true
  }

  @Test
  fun storageContract_preservesV110UserProgressJsonBackwardsCompatibility() {
    assertEquals("marain_learn_prefs", ProgressRepository.PREFS_NAME)
    assertEquals("user_progress_json", ProgressRepository.KEY_PROGRESS_JSON)

    // Simulated persisted payload from Marain v1.1.0 (versionCode = 2)
    val v110Payload = """
      {
        "completedChapterIds": ["ch-1-1"],
        "completedQuizChapterIds": ["ch-1-1"],
        "quizBestScores": {"ch-1-1": 3},
        "quizTotalAnswered": 3,
        "quizTotalCorrect": 3,
        "totalXp": 50,
        "dailyXpEarned": 50,
        "dailyXpEpochDay": 20779,
        "currentStreakDays": 2,
        "longestStreakDays": 2,
        "lastActivityEpochDay": 20779,
        "bestQuizCombo": 3,
        "masteredPhraseIds": ["llm", "token"],
        "bookmarkedChapterIds": ["ch-1-1"],
        "lastOpenedChapterId": "ch-1-1",
        "hasCompletedOnboarding": true,
        "readingTheme": "SEPIA",
        "fontScale": "LARGE"
      }
    """.trimIndent()

    val restored = json.decodeFromString(UserProgress.serializer(), v110Payload)
    assertEquals(setOf("ch-1-1"), restored.completedChapterIds)
    assertEquals(setOf("ch-1-1"), restored.completedQuizChapterIds)
    assertEquals(50, restored.totalXp)
    assertEquals(2, restored.currentStreakDays)
    assertEquals(setOf("llm", "token"), restored.masteredPhraseIds)
    assertEquals(setOf("ch-1-1"), restored.bookmarkedChapterIds)
    assertTrue(restored.hasCompletedOnboarding)
    assertEquals(ReadingTheme.SEPIA, restored.readingTheme)
    assertEquals(FontScaleOption.LARGE, restored.fontScale)

    // New mastery fields default safely when reading v1.1.0 persisted progress
    assertTrue(restored.quizBestPercents.isEmpty())
    assertTrue(restored.attemptedQuizChapterIds.isEmpty())
    assertTrue(restored.passedMasteryModuleIds.isEmpty())
    assertTrue(restored.masteryBestScores.isEmpty())
    assertTrue(restored.masteryBestPercents.isEmpty())
    assertTrue(restored.masteryAttemptCounts.isEmpty())
  }

  @Test
  fun storageContract_roundTripsMasteryCheckProgressFieldsCleanly() {
    val state = UserProgress(
      completedChapterIds = setOf("ch-1-1", "ch-1-2"),
      completedQuizChapterIds = setOf("ch-1-1", "ch-1-2"),
      quizBestScores = mapOf("ch-1-1" to 3, "ch-1-2" to 2),
      quizBestPercents = mapOf("ch-1-1" to 100, "ch-1-2" to 67),
      attemptedQuizChapterIds = setOf("ch-1-1", "ch-1-2", "ch-1-3"),
      passedMasteryModuleIds = setOf("mod-1-what-is-ai"),
      masteryBestScores = mapOf("mod-1-what-is-ai" to 4),
      masteryBestPercents = mapOf("mod-1-what-is-ai" to 100),
      masteryAttemptCounts = mapOf("mod-1-what-is-ai" to 2),
    )

    val encoded = json.encodeToString(UserProgress.serializer(), state)
    val decoded = json.decodeFromString(UserProgress.serializer(), encoded)
    assertEquals(state, decoded)
  }

  @Test
  fun privacyPolicyContent_disclosesOfflineLocalOnlyAndDisabledBackupsCleanly() {
    val combined = buildString {
      appendLine(PrivacyPolicyContent.TITLE)
      appendLine(PrivacyPolicyContent.SUMMARY)
      PrivacyPolicyContent.sections.forEach { s ->
        appendLine(s.heading)
        s.paragraphs.forEach { appendLine(it) }
        s.bullets.forEach { appendLine(it) }
      }
    }

    assertEquals("app.marain.learn", PrivacyPolicyContent.PACKAGE_ID)
    assertTrue(PrivacyPolicyContent.sections.size >= 5)
    assertTrue(combined.contains("100% offline", ignoreCase = true))
    assertTrue(combined.contains("marain_learn_prefs.xml"))
    assertTrue(combined.contains("cloud backup", ignoreCase = true))
    assertTrue(combined.contains("device-to-device", ignoreCase = true))
    assertTrue(combined.contains("android.permission.INTERNET"))
    assertTrue(combined.contains("https://piyushbodaa.com/marain/privacy"))
    assertFalse("Must not reference legacy brand", combined.contains("zero2ai", ignoreCase = true))
  }
}
