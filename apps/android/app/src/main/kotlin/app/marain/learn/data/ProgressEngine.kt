package app.marain.learn.data

import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import kotlin.math.max
import kotlin.math.roundToInt

object ProgressEngine {
  const val READ_CHAPTER_XP = 10
  const val PERFECT_QUIZ_BONUS_XP = 10
  const val COMBO_BONUS_XP = 5
  const val FLASHCARD_MASTERY_XP = 5
  const val DAILY_GOAL_XP = 50
  const val MAX_HEARTS = 5

  val fluencyTiers: List<FluencyRankTier> = listOf(
    FluencyRankTier(level = 1, cefrCode = "A1", title = "First Contact", minXp = 0, nextLevelXp = 100),
    FluencyRankTier(level = 2, cefrCode = "A2", title = "Signal Listener", minXp = 100, nextLevelXp = 250),
    FluencyRankTier(level = 3, cefrCode = "B1", title = "Key Bearer", minXp = 250, nextLevelXp = 450),
    FluencyRankTier(level = 4, cefrCode = "B2", title = "Terminal Speaker", minXp = 450, nextLevelXp = 650),
    FluencyRankTier(level = 5, cefrCode = "C1", title = "Web Shaper", minXp = 650, nextLevelXp = 850),
    FluencyRankTier(level = 6, cefrCode = "C2", title = "Fluent Builder", minXp = 850, nextLevelXp = null),
  )

  fun fluencyRankForXp(totalXp: Int): FluencyRankProgress {
    val safeXp = max(0, totalXp)
    val tier = fluencyTiers.lastOrNull { safeXp >= it.minXp } ?: fluencyTiers.first()
    val nextXp = tier.nextLevelXp
    if (nextXp == null) {
      return FluencyRankProgress(
        currentTier = tier,
        xpInCurrentTier = safeXp - tier.minXp,
        xpNeededForNextTier = 0,
        progressFraction = 1f,
      )
    }
    val span = max(1, nextXp - tier.minXp)
    val gained = (safeXp - tier.minXp).coerceIn(0, span)
    return FluencyRankProgress(
      currentTier = tier,
      xpInCurrentTier = gained,
      xpNeededForNextTier = max(0, nextXp - safeXp),
      progressFraction = gained.toFloat() / span.toFloat(),
    )
  }

  fun completeOnboarding(state: UserProgress): UserProgress =
    state.copy(hasCompletedOnboarding = true)

  fun resetOnboarding(state: UserProgress): UserProgress =
    state.copy(hasCompletedOnboarding = false)

  fun markChapterOpened(state: UserProgress, chapterId: String): UserProgress =
    state.copy(lastOpenedChapterId = chapterId)

  fun markChapterRead(
    state: UserProgress,
    chapterId: String,
    todayEpochDay: Long,
  ): UserProgress {
    val alreadyRead = chapterId in state.completedChapterIds
    val bonusXp = if (alreadyRead) 0 else READ_CHAPTER_XP
    val withActivity = applyXpAndStreak(state, bonusXp, todayEpochDay)
    return withActivity.copy(
      completedChapterIds = state.completedChapterIds + chapterId,
      lastOpenedChapterId = chapterId,
    )
  }

  fun recordQuizResult(
    state: UserProgress,
    chapterId: String,
    correctCount: Int,
    totalQuestions: Int,
    chapterXpReward: Int,
    todayEpochDay: Long,
    maxCombo: Int = 0,
  ): QuizCompletionOutcome {
    val clampedTotal = max(1, totalQuestions)
    val clampedCorrect = correctCount.coerceIn(0, clampedTotal)
    val clampedCombo = maxCombo.coerceIn(0, clampedCorrect)
    val accuracyPercent = ((clampedCorrect.toDouble() / clampedTotal.toDouble()) * 100.0).roundToInt()
    val isPerfect = clampedCorrect == clampedTotal
    val isFirstCompletion = chapterId !in state.completedQuizChapterIds
    val previousBest = state.quizBestScores[chapterId] ?: 0
    val wasAlreadyPerfect = previousBest >= clampedTotal && !isFirstCompletion

    val baseXp = when {
      isFirstCompletion && clampedCorrect * 2 >= clampedTotal -> max(10, chapterXpReward)
      isFirstCompletion -> max(10, chapterXpReward / 2)
      else -> 0
    }
    val perfectBonus = if (isPerfect && !wasAlreadyPerfect) PERFECT_QUIZ_BONUS_XP else 0
    val comboBonus = if (clampedCombo >= 2 && (isFirstCompletion || clampedCombo > state.bestQuizCombo)) {
      COMBO_BONUS_XP
    } else {
      0
    }
    val readBonus = if (chapterId !in state.completedChapterIds) READ_CHAPTER_XP else 0
    val earnedXp = baseXp + perfectBonus + comboBonus + readBonus

    val withActivity = applyXpAndStreak(state, earnedXp, todayEpochDay)
    val updated = withActivity.copy(
      completedChapterIds = state.completedChapterIds + chapterId,
      completedQuizChapterIds = state.completedQuizChapterIds + chapterId,
      quizBestScores = state.quizBestScores + (chapterId to max(previousBest, clampedCorrect)),
      quizTotalAnswered = state.quizTotalAnswered + clampedTotal,
      quizTotalCorrect = state.quizTotalCorrect + clampedCorrect,
      bestQuizCombo = max(state.bestQuizCombo, clampedCombo),
      lastOpenedChapterId = chapterId,
    )

    return QuizCompletionOutcome(
      updatedProgress = updated,
      xpEarned = earnedXp,
      comboBonusXp = comboBonus,
      maxCombo = clampedCombo,
      isFirstQuizCompletion = isFirstCompletion,
      isPerfectScore = isPerfect,
      correctCount = clampedCorrect,
      totalQuestions = clampedTotal,
      accuracyPercent = accuracyPercent,
      updatedStreakDays = updated.currentStreakDays,
    )
  }

  fun markPhraseMastered(
    state: UserProgress,
    termId: String,
    todayEpochDay: Long,
  ): PhraseMasteryOutcome {
    val isNew = termId !in state.masteredPhraseIds
    val xp = if (isNew) FLASHCARD_MASTERY_XP else 0
    val withActivity = if (isNew) {
      applyXpAndStreak(state, xp, todayEpochDay)
    } else {
      state
    }
    val updated = withActivity.copy(
      masteredPhraseIds = state.masteredPhraseIds + termId,
    )
    return PhraseMasteryOutcome(
      updatedProgress = updated,
      xpEarned = xp,
      isNewlyMastered = isNew,
    )
  }

  fun nextHeartsAfterAnswer(currentHearts: Int, wasCorrect: Boolean): Int =
    if (wasCorrect) currentHearts.coerceIn(0, MAX_HEARTS)
    else (currentHearts - 1).coerceAtLeast(0)

  fun toggleBookmark(state: UserProgress, chapterId: String): UserProgress {
    val updated = if (chapterId in state.bookmarkedChapterIds) {
      state.bookmarkedChapterIds - chapterId
    } else {
      state.bookmarkedChapterIds + chapterId
    }
    return state.copy(bookmarkedChapterIds = updated)
  }

  fun setReadingTheme(state: UserProgress, theme: ReadingTheme): UserProgress =
    state.copy(readingTheme = theme)

  fun setFontScale(state: UserProgress, scale: FontScaleOption): UserProgress =
    state.copy(fontScale = scale)

  fun todayXpEarned(state: UserProgress, todayEpochDay: Long): Int =
    if (state.dailyXpEpochDay == todayEpochDay) max(0, state.dailyXpEarned) else 0

  fun dailyGoalFraction(state: UserProgress, todayEpochDay: Long): Float =
    (todayXpEarned(state, todayEpochDay).toFloat() / DAILY_GOAL_XP.toFloat()).coerceIn(0f, 1f)

  fun isDailyGoalReached(state: UserProgress, todayEpochDay: Long): Boolean =
    todayXpEarned(state, todayEpochDay) >= DAILY_GOAL_XP

  fun effectiveStreakDays(state: UserProgress, todayEpochDay: Long): Int {
    val last = state.lastActivityEpochDay ?: return 0
    return if (todayEpochDay - last <= 1L && last <= todayEpochDay) {
      state.currentStreakDays
    } else {
      0
    }
  }

  fun quizAccuracyPercent(state: UserProgress): Int {
    if (state.quizTotalAnswered <= 0) return 0
    return ((state.quizTotalCorrect.toDouble() / state.quizTotalAnswered.toDouble()) * 100.0)
      .roundToInt()
      .coerceIn(0, 100)
  }

  fun isChapterMastered(state: UserProgress, chapterId: String): Boolean =
    chapterId in state.completedChapterIds && chapterId in state.completedQuizChapterIds

  fun isChapterCompleted(state: UserProgress, chapterId: String): Boolean =
    chapterId in state.completedChapterIds || chapterId in state.completedQuizChapterIds

  fun completedChaptersInModule(state: UserProgress, module: CurriculumModule): Int =
    module.chapters.count { isChapterCompleted(state, it.id) }

  fun completedModulesCount(state: UserProgress, curriculum: Curriculum): Int =
    curriculum.modules.count { module ->
      module.chapters.isNotEmpty() && module.chapters.all { isChapterCompleted(state, it.id) }
    }

  fun overallProgressFraction(state: UserProgress, curriculum: Curriculum): Float {
    val total = curriculum.totalChapters
    if (total <= 0) return 0f
    val completed = curriculum.allChaptersOrdered().count { isChapterCompleted(state, it.id) }
    return (completed.toFloat() / total.toFloat()).coerceIn(0f, 1f)
  }

  fun nextActiveChapter(state: UserProgress, curriculum: Curriculum): Chapter? {
    val ordered = curriculum.allChaptersOrdered()
    if (ordered.isEmpty()) return null
    return ordered.firstOrNull { it.id !in state.completedQuizChapterIds } ?: ordered.first()
  }

  fun nextRecommendedChapter(state: UserProgress, curriculum: Curriculum): Chapter? =
    nextActiveChapter(state, curriculum)

  fun nextChapterAfter(chapterId: String, curriculum: Curriculum): Chapter? {
    val ordered = curriculum.allChaptersOrdered()
    val index = ordered.indexOfFirst { it.id == chapterId }
    if (index < 0 || index + 1 >= ordered.size) return null
    return ordered[index + 1]
  }

  fun previousChapterBefore(chapterId: String, curriculum: Curriculum): Chapter? {
    val ordered = curriculum.allChaptersOrdered()
    val index = ordered.indexOfFirst { it.id == chapterId }
    if (index <= 0) return null
    return ordered[index - 1]
  }

  fun milestones(
    state: UserProgress,
    curriculum: Curriculum,
    todayEpochDay: Long,
  ): List<FluencyMilestone> {
    val unitsDone = completedModulesCount(state, curriculum)
    val todayXp = todayXpEarned(state, todayEpochDay)
    val phrases = state.masteredPhraseIds.size
    val quizzesDone = state.completedQuizChapterIds.size
    val bestStreak = max(state.longestStreakDays, effectiveStreakDays(state, todayEpochDay))
    val rank = fluencyRankForXp(state.totalXp).currentTier

    return listOf(
      FluencyMilestone(
        id = "first_drill",
        title = "First Marain Drill",
        description = "Complete your first practice drill",
        unlocked = quizzesDone >= 1,
        progressLabel = "${minOf(quizzesDone, 1)}/1",
      ),
      FluencyMilestone(
        id = "daily_goal",
        title = "Daily Goal Hit",
        description = "Earn $DAILY_GOAL_XP XP in a single day",
        unlocked = todayXp >= DAILY_GOAL_XP,
        progressLabel = "${minOf(todayXp, DAILY_GOAL_XP)}/$DAILY_GOAL_XP XP",
      ),
      FluencyMilestone(
        id = "combo_streak",
        title = "Combo Speaker",
        description = "Answer 3 drill questions in a row",
        unlocked = state.bestQuizCombo >= 3,
        progressLabel = "${minOf(state.bestQuizCombo, 3)}/3",
      ),
      FluencyMilestone(
        id = "phrase_collector",
        title = "Phrasebook Builder",
        description = "Master 5 AI phrases in Flashcards",
        unlocked = phrases >= 5,
        progressLabel = "${minOf(phrases, 5)}/5",
      ),
      FluencyMilestone(
        id = "streak_keeper",
        title = "3-Day Habit",
        description = "Keep a 3-day learning streak",
        unlocked = bestStreak >= 3,
        progressLabel = "${minOf(bestStreak, 3)}/3d",
      ),
      FluencyMilestone(
        id = "unit_finisher",
        title = "Unit Finisher",
        description = "Complete all 4 lessons in any unit",
        unlocked = unitsDone >= 1,
        progressLabel = "${minOf(unitsDone, 1)}/1",
      ),
      FluencyMilestone(
        id = "fluent_builder",
        title = "C2 Fluent Builder",
        description = "Reach 850+ XP across Marain",
        unlocked = rank.cefrCode == "C2",
        progressLabel = "${minOf(state.totalXp, 850)}/850 XP",
      ),
    )
  }

  private fun applyXpAndStreak(
    state: UserProgress,
    xpToAdd: Int,
    todayEpochDay: Long,
  ): UserProgress {
    val last = state.lastActivityEpochDay
    val newStreak = when {
      last == null -> 1
      last == todayEpochDay -> max(1, state.currentStreakDays)
      last == todayEpochDay - 1L -> max(1, state.currentStreakDays) + 1
      last < todayEpochDay - 1L -> 1
      else -> max(1, state.currentStreakDays)
    }
    val prevTodayXp = if (state.dailyXpEpochDay == todayEpochDay) max(0, state.dailyXpEarned) else 0
    return state.copy(
      totalXp = state.totalXp + max(0, xpToAdd),
      dailyXpEarned = prevTodayXp + max(0, xpToAdd),
      dailyXpEpochDay = todayEpochDay,
      currentStreakDays = newStreak,
      longestStreakDays = max(state.longestStreakDays, newStreak),
      lastActivityEpochDay = max(last ?: todayEpochDay, todayEpochDay),
    )
  }
}
