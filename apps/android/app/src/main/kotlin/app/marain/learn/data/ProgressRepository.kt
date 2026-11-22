package app.marain.learn.data

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.json.Json
import java.time.LocalDate

class ProgressRepository(
  context: Context,
  private val todayEpochDayProvider: () -> Long = { LocalDate.now().toEpochDay() },
) {
  private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
  private val json = Json {
    ignoreUnknownKeys = true
    encodeDefaults = true
  }

  private val _progress = MutableStateFlow(loadStoredProgress())
  val progress: StateFlow<UserProgress> = _progress.asStateFlow()

  fun completeOnboarding() {
    update { ProgressEngine.completeOnboarding(it) }
  }

  fun resetOnboarding() {
    update { ProgressEngine.resetOnboarding(it) }
  }

  fun markChapterOpened(chapterId: String) {
    update { ProgressEngine.markChapterOpened(it, chapterId) }
  }

  fun markChapterRead(chapterId: String) {
    val today = todayEpochDayProvider()
    update { ProgressEngine.markChapterRead(it, chapterId, today) }
  }

  fun recordQuizResult(
    chapterId: String,
    correctCount: Int,
    totalQuestions: Int,
    chapterXpReward: Int,
    maxCombo: Int,
  ): QuizCompletionOutcome {
    val today = todayEpochDayProvider()
    val outcome = ProgressEngine.recordQuizResult(
      state = _progress.value,
      chapterId = chapterId,
      correctCount = correctCount,
      totalQuestions = totalQuestions,
      chapterXpReward = chapterXpReward,
      todayEpochDay = today,
      maxCombo = maxCombo,
    )
    persist(outcome.updatedProgress)
    _progress.value = outcome.updatedProgress
    return outcome
  }

  fun markPhraseMastered(termId: String): PhraseMasteryOutcome {
    val today = todayEpochDayProvider()
    val outcome = ProgressEngine.markPhraseMastered(
      state = _progress.value,
      termId = termId,
      todayEpochDay = today,
    )
    persist(outcome.updatedProgress)
    _progress.value = outcome.updatedProgress
    return outcome
  }

  fun toggleBookmark(chapterId: String) {
    update { ProgressEngine.toggleBookmark(it, chapterId) }
  }

  fun setReadingTheme(theme: ReadingTheme) {
    update { ProgressEngine.setReadingTheme(it, theme) }
  }

  fun setFontScale(scale: FontScaleOption) {
    update { ProgressEngine.setFontScale(it, scale) }
  }

  fun currentEpochDay(): Long = todayEpochDayProvider()

  private fun update(transform: (UserProgress) -> UserProgress) {
    val next = transform(_progress.value)
    persist(next)
    _progress.value = next
  }

  private fun loadStoredProgress(): UserProgress {
    val raw = prefs.getString(KEY_PROGRESS_JSON, null) ?: return UserProgress()
    return runCatching {
      json.decodeFromString(UserProgress.serializer(), raw)
    }.getOrDefault(UserProgress())
  }

  private fun persist(state: UserProgress) {
    val encoded = json.encodeToString(UserProgress.serializer(), state)
    prefs.edit().putString(KEY_PROGRESS_JSON, encoded).apply()
  }

  companion object {
    const val PREFS_NAME = "marain_learn_prefs"
    const val KEY_PROGRESS_JSON = "user_progress_json"
  }
}
