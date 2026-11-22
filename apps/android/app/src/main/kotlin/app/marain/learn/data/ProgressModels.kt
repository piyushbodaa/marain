package app.marain.learn.data

import kotlinx.serialization.Serializable

@Serializable
enum class ReadingTheme(val label: String) {
  LIGHT("Light"),
  SEPIA("Warm Sepia"),
  DARK("Dark"),
}

@Serializable
enum class FontScaleOption(val shortLabel: String, val label: String, val multiplier: Float) {
  SMALL("S", "Compact", 0.90f),
  MEDIUM("M", "Standard", 1.00f),
  LARGE("L", "Large", 1.16f),
}

@Serializable
data class UserProgress(
  val completedChapterIds: Set<String> = emptySet(),
  val completedQuizChapterIds: Set<String> = emptySet(),
  val quizBestScores: Map<String, Int> = emptyMap(),
  val quizTotalAnswered: Int = 0,
  val quizTotalCorrect: Int = 0,
  val totalXp: Int = 0,
  val dailyXpEarned: Int = 0,
  val dailyXpEpochDay: Long? = null,
  val currentStreakDays: Int = 0,
  val longestStreakDays: Int = 0,
  val lastActivityEpochDay: Long? = null,
  val bestQuizCombo: Int = 0,
  val masteredPhraseIds: Set<String> = emptySet(),
  val bookmarkedChapterIds: Set<String> = emptySet(),
  val lastOpenedChapterId: String? = null,
  val hasCompletedOnboarding: Boolean = false,
  val readingTheme: ReadingTheme = ReadingTheme.LIGHT,
  val fontScale: FontScaleOption = FontScaleOption.MEDIUM,
)

data class FluencyRankTier(
  val level: Int,
  val cefrCode: String,
  val title: String,
  val minXp: Int,
  val nextLevelXp: Int?,
)

data class FluencyRankProgress(
  val currentTier: FluencyRankTier,
  val xpInCurrentTier: Int,
  val xpNeededForNextTier: Int,
  val progressFraction: Float,
)

data class QuizCompletionOutcome(
  val updatedProgress: UserProgress,
  val xpEarned: Int,
  val comboBonusXp: Int,
  val maxCombo: Int,
  val isFirstQuizCompletion: Boolean,
  val isPerfectScore: Boolean,
  val correctCount: Int,
  val totalQuestions: Int,
  val accuracyPercent: Int,
  val updatedStreakDays: Int,
)

data class PhraseMasteryOutcome(
  val updatedProgress: UserProgress,
  val xpEarned: Int,
  val isNewlyMastered: Boolean,
)

data class FluencyMilestone(
  val id: String,
  val title: String,
  val description: String,
  val unlocked: Boolean,
  val progressLabel: String,
)
