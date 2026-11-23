package app.marain.learn.data

import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.CurriculumModule
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
  /** Chapters whose lesson practice check was PASSED (>= LESSON_PASS_PERCENT). */
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
  // Mastery-tracking extensions (defaulted for full v1.1.0 backward compatibility):
  val quizBestPercents: Map<String, Int> = emptyMap(),
  val attemptedQuizChapterIds: Set<String> = emptySet(),
  val passedMasteryModuleIds: Set<String> = emptySet(),
  val masteryBestScores: Map<String, Int> = emptyMap(),
  val masteryBestPercents: Map<String, Int> = emptyMap(),
  val masteryAttemptCounts: Map<String, Int> = emptyMap(),
)

data class FluencyRankTier(
  val level: Int,
  val cefrCode: String,
  val title: String,
  val requiredMasteredUnits: Int,
  val requirementSummary: String,
  val canDoStatement: String,
)

data class FluencyRankProgress(
  val currentTier: FluencyRankTier,
  val nextTier: FluencyRankTier?,
  val masteredUnitsCount: Int,
  val totalUnitsCount: Int,
  val masteredLessonsCount: Int,
  val totalLessonsCount: Int,
  val unitsRemainingForNextTier: Int,
  val progressFraction: Float,
  val nextRequirementLabel: String,
) {
  fun isTierUnlocked(tier: FluencyRankTier): Boolean =
    masteredUnitsCount >= tier.requiredMasteredUnits
}

data class UnitMasteryStatus(
  val moduleId: String,
  val moduleNumber: Int,
  val masteredLessonsCount: Int,
  val readLessonsCount: Int,
  val totalLessonsCount: Int,
  val allLessonsMastered: Boolean,
  val hasMasteryCheck: Boolean,
  val isMasteryCheckReady: Boolean,
  val isMasteryCheckPassed: Boolean,
  val masteryBestScore: Int?,
  val masteryTotalQuestions: Int,
  val masteryBestPercent: Int?,
  val isUnitMastered: Boolean,
  val progressFraction: Float,
)

data class QuizCompletionOutcome(
  val updatedProgress: UserProgress,
  val xpEarned: Int,
  val comboBonusXp: Int,
  val maxCombo: Int,
  val isFirstQuizCompletion: Boolean,
  val isPerfectScore: Boolean,
  val passed: Boolean,
  val passingScorePercent: Int,
  val correctCount: Int,
  val totalQuestions: Int,
  val accuracyPercent: Int,
  val updatedStreakDays: Int,
)

data class MasteryCheckOutcome(
  val moduleId: String,
  val moduleNumber: Int,
  val updatedProgress: UserProgress,
  val passed: Boolean,
  val isFirstPass: Boolean,
  val isPerfectScore: Boolean,
  val correctCount: Int,
  val totalQuestions: Int,
  val minCorrectToPass: Int,
  val accuracyPercent: Int,
  val passingScorePercent: Int,
  val xpEarned: Int,
  val updatedStreakDays: Int,
  val previousTier: FluencyRankTier,
  val newTier: FluencyRankTier,
  val unlockedNewTier: Boolean,
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

sealed interface NextLearningAction {
  val ctaLabel: String
  val title: String
  val subtitle: String
  val moduleId: String
  val moduleNumber: Int

  data class OpenLesson(
    override val moduleId: String,
    override val moduleNumber: Int,
    val chapterId: String,
    val chapterNumber: Int,
    override val ctaLabel: String,
    override val title: String,
    override val subtitle: String,
    val isFirstLesson: Boolean,
    val isReadAwaitingQuiz: Boolean,
  ) : NextLearningAction

  data class OpenUnitMasteryCheck(
    override val moduleId: String,
    override val moduleNumber: Int,
    override val ctaLabel: String,
    override val title: String,
    override val subtitle: String,
    val passingScorePercent: Int,
    val minCorrectToPass: Int,
    val questionCount: Int,
    val unlocksCefrCode: String?,
  ) : NextLearningAction

  data class AllMastered(
    override val moduleId: String,
    override val moduleNumber: Int,
    val reviewChapterId: String,
    override val ctaLabel: String,
    override val title: String,
    override val subtitle: String,
  ) : NextLearningAction
}

sealed interface NextStepAfterChapter {
  data class NextLesson(val chapter: Chapter) : NextStepAfterChapter
  data class UnitMasteryCheck(val module: CurriculumModule) : NextStepAfterChapter
  data class CourseComplete(val lastModule: CurriculumModule) : NextStepAfterChapter
}
