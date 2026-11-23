package app.marain.learn.data

import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.roundToInt

object ProgressEngine {
  const val READ_CHAPTER_XP = 10
  const val CORRECT_ANSWER_XP = 5
  const val LESSON_PASS_BONUS_XP = 10
  const val PERFECT_QUIZ_BONUS_XP = 10
  const val COMBO_BONUS_XP = 5
  const val FLASHCARD_MASTERY_XP = 5
  const val DEFAULT_MASTERY_XP_REWARD = 40
  const val DAILY_GOAL_XP = 50
  const val MAX_HEARTS = 5
  const val LESSON_PASS_PERCENT = 67
  const val DEFAULT_MASTERY_PASS_THRESHOLD = 0.75

  /**
   * Full mastery-gated CEFR ladder.
   * Learners start at A0 (Newcomer) and unlock A1..C2 strictly by passing Unit Mastery Checks.
   * Practice XP (reading, flashcards, drills) never unlocks fluency tiers by itself.
   */
  val fluencyTiers: List<FluencyRankTier> = listOf(
    FluencyRankTier(
      level = 0,
      cefrCode = "A0",
      title = "Newcomer",
      requiredMasteredUnits = 0,
      requirementSummary = "Starting level",
      canDoStatement = "Beginning your AI fluency path",
    ),
    FluencyRankTier(
      level = 1,
      cefrCode = "A1",
      title = "First Contact",
      requiredMasteredUnits = 1,
      requirementSummary = "Master 1 unit",
      canDoStatement = "Explain how AI predicts text and spot hallucinations",
    ),
    FluencyRankTier(
      level = 2,
      cefrCode = "A2",
      title = "Signal Listener",
      requiredMasteredUnits = 2,
      requirementSummary = "Master 2 units",
      canDoStatement = "Manage tokens, context windows, and clear prompts",
    ),
    FluencyRankTier(
      level = 3,
      cefrCode = "B1",
      title = "Key Bearer",
      requiredMasteredUnits = 3,
      requirementSummary = "Master 3 units",
      canDoStatement = "Protect API keys, set spending caps, and estimate costs",
    ),
    FluencyRankTier(
      level = 4,
      cefrCode = "B2",
      title = "Terminal Speaker",
      requiredMasteredUnits = 5,
      requirementSummary = "Master 5 units",
      canDoStatement = "Work safely with AI agents, tools, and coding CLIs",
    ),
    FluencyRankTier(
      level = 5,
      cefrCode = "C1",
      title = "Web Shaper",
      requiredMasteredUnits = 6,
      requirementSummary = "Master 6 units",
      canDoStatement = "Plan, verify, and ship real websites with AI",
    ),
    FluencyRankTier(
      level = 6,
      cefrCode = "C2",
      title = "Fluent Builder",
      requiredMasteredUnits = 7,
      requirementSummary = "Master all 7 units",
      canDoStatement = "Build, verify, and ship complete apps with AI",
    ),
  )

  /** Earned CEFR fluency milestones (A1 through C2), excluding the A0 starting state. */
  val cefrMilestoneTiers: List<FluencyRankTier> = fluencyTiers.filter { it.level > 0 }

  fun fluencyRank(state: UserProgress, curriculum: Curriculum): FluencyRankProgress {
    val orderedModules = curriculum.orderedModules()
    val totalUnits = orderedModules.size
    val totalLessons = curriculum.totalChapters
    val masteredUnits = orderedModules.count { isUnitMastered(state, it) }
    val masteredLessons = curriculum.allChaptersOrdered().count { isChapterMastered(state, it) }

    val currentTier = fluencyTiers.lastOrNull { masteredUnits >= it.requiredMasteredUnits }
      ?: fluencyTiers.first()
    val nextTier = fluencyTiers.firstOrNull { it.level > currentTier.level }

    if (nextTier == null) {
      return FluencyRankProgress(
        currentTier = currentTier,
        nextTier = null,
        masteredUnitsCount = masteredUnits,
        totalUnitsCount = totalUnits,
        masteredLessonsCount = masteredLessons,
        totalLessonsCount = totalLessons,
        unitsRemainingForNextTier = 0,
        progressFraction = 1f,
        nextRequirementLabel = "All $totalUnits units mastered · ${currentTier.cefrCode} Fluency reached",
      )
    }

    val unitsRemaining = max(0, nextTier.requiredMasteredUnits - masteredUnits)
    val spanUnits = max(1, nextTier.requiredMasteredUnits - currentTier.requiredMasteredUnits)
    val wholeUnitsInSpan = (masteredUnits - currentTier.requiredMasteredUnits).coerceAtLeast(0)
    val nextUnmasteredModule = orderedModules.firstOrNull { !isUnitMastered(state, it) }

    val partialUnitProgress = if (nextUnmasteredModule != null) {
      val chaptersCount = nextUnmasteredModule.chapters.size
      val hasCheck = nextUnmasteredModule.masteryCheck?.questions?.isNotEmpty() == true
      val totalSteps = chaptersCount + if (hasCheck) 1 else 0
      val masteredSteps = nextUnmasteredModule.chapters.count { isChapterMastered(state, it) }
      if (totalSteps > 0) {
        (masteredSteps.toFloat() / totalSteps.toFloat()).coerceIn(0f, 0.9f)
      } else {
        0f
      }
    } else {
      0f
    }

    val fraction = ((wholeUnitsInSpan.toFloat() + partialUnitProgress) / spanUnits.toFloat())
      .coerceIn(0f, 0.95f)

    val requirementLabel = when {
      unitsRemaining == 1 && nextUnmasteredModule != null -> {
        val passPct = nextUnmasteredModule.masteryCheck?.passingScorePercent
          ?: (DEFAULT_MASTERY_PASS_THRESHOLD * 100.0).roundToInt()
        if (isUnitLessonsMastered(state, nextUnmasteredModule)) {
          "Ready: Pass Unit ${nextUnmasteredModule.number} Mastery Check (≥$passPct%) to reach ${nextTier.cefrCode}"
        } else {
          "Pass Unit ${nextUnmasteredModule.number} Mastery Check (≥$passPct%) to reach ${nextTier.cefrCode}"
        }
      }
      unitsRemaining == 1 -> "Master 1 more unit to reach ${nextTier.cefrCode}"
      else -> "Master $unitsRemaining more units to reach ${nextTier.cefrCode}"
    }

    return FluencyRankProgress(
      currentTier = currentTier,
      nextTier = nextTier,
      masteredUnitsCount = masteredUnits,
      totalUnitsCount = totalUnits,
      masteredLessonsCount = masteredLessons,
      totalLessonsCount = totalLessons,
      unitsRemainingForNextTier = unitsRemaining,
      progressFraction = fraction,
      nextRequirementLabel = requirementLabel,
    )
  }

  fun completeOnboarding(state: UserProgress): UserProgress =
    state.copy(hasCompletedOnboarding = true)

  fun resetOnboarding(state: UserProgress): UserProgress =
    state.copy(hasCompletedOnboarding = false)

  fun isFreshLearner(state: UserProgress): Boolean =
    state.completedChapterIds.isEmpty() &&
      state.completedQuizChapterIds.isEmpty() &&
      state.attemptedQuizChapterIds.isEmpty() &&
      state.passedMasteryModuleIds.isEmpty()

  fun shouldAutoLaunchFirstLesson(state: UserProgress): Boolean =
    state.lastOpenedChapterId == null && isFreshLearner(state)

  fun firstLessonChapterId(curriculum: Curriculum): String? =
    curriculum.allChaptersOrdered().firstOrNull()?.id

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

  /**
   * Records a lesson practice check result.
   * - Zero XP is awarded for wrong answers.
   * - Modest XP (CORRECT_ANSWER_XP) is awarded only for newly improved correct answers.
   * - Lesson mastery & pass bonus XP require achieving >= LESSON_PASS_PERCENT (67%).
   * - Failed attempts NEVER add the chapter to completedQuizChapterIds and NEVER auto-mark it read.
   */
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
    val passed = accuracyPercent >= LESSON_PASS_PERCENT
    val isPerfect = clampedCorrect == clampedTotal

    val wasAlreadyPassed = isChapterMastered(state, chapterId)
    val isFirstPass = passed && !wasAlreadyPassed
    val previousBest = state.quizBestScores[chapterId] ?: 0
    val previousBestPercent = state.quizBestPercents[chapterId] ?: 0
    val wasAlreadyPerfect = previousBest >= clampedTotal && wasAlreadyPassed

    val newlyImprovedCorrect = max(0, clampedCorrect - previousBest)
    val correctAnswerXp = newlyImprovedCorrect * CORRECT_ANSWER_XP
    val passBonusXp = if (isFirstPass) {
      max(LESSON_PASS_BONUS_XP, chapterXpReward - clampedTotal * CORRECT_ANSWER_XP)
    } else {
      0
    }
    val perfectBonus = if (isPerfect && !wasAlreadyPerfect) PERFECT_QUIZ_BONUS_XP else 0
    val comboBonus = if (passed && clampedCombo >= 2 && (isFirstPass || clampedCombo > state.bestQuizCombo)) {
      COMBO_BONUS_XP
    } else {
      0
    }
    val readBonus = if (passed && chapterId !in state.completedChapterIds) READ_CHAPTER_XP else 0
    val earnedXp = correctAnswerXp + passBonusXp + perfectBonus + comboBonus + readBonus

    val withActivity = if (earnedXp > 0 || passed) {
      applyXpAndStreak(state, earnedXp, todayEpochDay)
    } else {
      state
    }

    val updatedCompletedChapters = if (passed) {
      state.completedChapterIds + chapterId
    } else {
      state.completedChapterIds
    }
    val updatedCompletedQuizChapters = if (passed) {
      state.completedQuizChapterIds + chapterId
    } else {
      state.completedQuizChapterIds
    }

    val updated = withActivity.copy(
      completedChapterIds = updatedCompletedChapters,
      completedQuizChapterIds = updatedCompletedQuizChapters,
      attemptedQuizChapterIds = state.attemptedQuizChapterIds + chapterId,
      quizBestScores = state.quizBestScores + (chapterId to max(previousBest, clampedCorrect)),
      quizBestPercents = state.quizBestPercents + (chapterId to max(previousBestPercent, accuracyPercent)),
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
      isFirstQuizCompletion = isFirstPass,
      isPerfectScore = isPerfect,
      passed = passed,
      passingScorePercent = LESSON_PASS_PERCENT,
      correctCount = clampedCorrect,
      totalQuestions = clampedTotal,
      accuracyPercent = accuracyPercent,
      updatedStreakDays = updated.currentStreakDays,
    )
  }

  /**
   * Records a Unit Mastery Check attempt.
   * - Requires meeting the unit's passThreshold (e.g. >= 75%, 3/4 or 4/5) to pass and master the unit.
   * - Zero XP is awarded on a failed attempt.
   * - Passing unlocks unit mastery and can advance the learner's CEFR Fluency Tier.
   */
  fun recordMasteryCheckResult(
    state: UserProgress,
    module: CurriculumModule,
    correctCount: Int,
    totalQuestions: Int,
    curriculum: Curriculum,
    todayEpochDay: Long,
  ): MasteryCheckOutcome {
    val masteryCheck = module.masteryCheck
    val threshold = (masteryCheck?.passThreshold ?: DEFAULT_MASTERY_PASS_THRESHOLD).coerceIn(0.0, 1.0)
    val passingScorePercent = (threshold * 100.0).roundToInt()
    val clampedTotal = max(1, totalQuestions)
    val clampedCorrect = correctCount.coerceIn(0, clampedTotal)
    val minCorrectToPass = ceil(clampedTotal * threshold - 1e-9).toInt().coerceIn(1, clampedTotal)
    val accuracyPercent = ((clampedCorrect.toDouble() / clampedTotal.toDouble()) * 100.0).roundToInt()
    val passed = clampedCorrect >= minCorrectToPass
    val isPerfect = clampedCorrect == clampedTotal

    val previousTier = fluencyRank(state, curriculum).currentTier
    val wasAlreadyPassed = module.id in state.passedMasteryModuleIds
    val isFirstPass = passed && !wasAlreadyPassed
    val previousBestScore = state.masteryBestScores[module.id] ?: 0
    val previousBestPercent = state.masteryBestPercents[module.id] ?: 0
    val wasAlreadyPerfect = previousBestScore >= clampedTotal && wasAlreadyPassed

    val masteryXp = masteryCheck?.xpReward ?: DEFAULT_MASTERY_XP_REWARD
    val earnedXp = when {
      isFirstPass && isPerfect -> masteryXp + PERFECT_QUIZ_BONUS_XP
      isFirstPass -> masteryXp
      passed && isPerfect && !wasAlreadyPerfect -> PERFECT_QUIZ_BONUS_XP
      else -> 0
    }

    val withActivity = if (passed || earnedXp > 0) {
      applyXpAndStreak(state, earnedXp, todayEpochDay)
    } else {
      state
    }

    val updatedPassedModules = if (passed) {
      state.passedMasteryModuleIds + module.id
    } else {
      state.passedMasteryModuleIds
    }
    val nextAttempts = (state.masteryAttemptCounts[module.id] ?: 0) + 1

    val updated = withActivity.copy(
      passedMasteryModuleIds = updatedPassedModules,
      masteryBestScores = state.masteryBestScores + (module.id to max(previousBestScore, clampedCorrect)),
      masteryBestPercents = state.masteryBestPercents + (module.id to max(previousBestPercent, accuracyPercent)),
      masteryAttemptCounts = state.masteryAttemptCounts + (module.id to nextAttempts),
      quizTotalAnswered = state.quizTotalAnswered + clampedTotal,
      quizTotalCorrect = state.quizTotalCorrect + clampedCorrect,
    )

    val newTier = fluencyRank(updated, curriculum).currentTier

    return MasteryCheckOutcome(
      moduleId = module.id,
      moduleNumber = module.number,
      updatedProgress = updated,
      passed = passed,
      isFirstPass = isFirstPass,
      isPerfectScore = isPerfect,
      correctCount = clampedCorrect,
      totalQuestions = clampedTotal,
      minCorrectToPass = minCorrectToPass,
      accuracyPercent = accuracyPercent,
      passingScorePercent = passingScorePercent,
      xpEarned = earnedXp,
      updatedStreakDays = updated.currentStreakDays,
      previousTier = previousTier,
      newTier = newTier,
      unlockedNewTier = newTier.level > previousTier.level,
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

  fun bestQuizPercentForChapter(state: UserProgress, chapter: Chapter): Int? {
    state.quizBestPercents[chapter.id]?.let { return it }
    val bestScore = state.quizBestScores[chapter.id] ?: return null
    val total = chapter.quiz.size
    if (total <= 0) return null
    return ((bestScore.coerceIn(0, total).toDouble() / total.toDouble()) * 100.0).roundToInt()
  }

  fun isChapterRead(state: UserProgress, chapterId: String): Boolean =
    chapterId in state.completedChapterIds

  fun isChapterMastered(state: UserProgress, chapterId: String): Boolean {
    if (chapterId !in state.completedQuizChapterIds) return false
    val recordedPercent = state.quizBestPercents[chapterId]
    return recordedPercent == null || recordedPercent >= LESSON_PASS_PERCENT
  }

  fun isChapterMastered(state: UserProgress, chapter: Chapter): Boolean {
    if (chapter.id !in state.completedQuizChapterIds) return false
    val bestPercent = bestQuizPercentForChapter(state, chapter)
    return bestPercent == null || bestPercent >= LESSON_PASS_PERCENT
  }

  fun isChapterCompleted(state: UserProgress, chapterId: String): Boolean =
    isChapterMastered(state, chapterId)

  fun isUnitLessonsMastered(state: UserProgress, module: CurriculumModule): Boolean =
    module.chapters.isNotEmpty() && module.chapters.all { isChapterMastered(state, it) }

  fun isUnitMasteryCheckPassed(state: UserProgress, moduleId: String): Boolean =
    moduleId in state.passedMasteryModuleIds

  fun isUnitMastered(state: UserProgress, module: CurriculumModule): Boolean {
    val hasMasteryCheck = module.masteryCheck?.questions?.isNotEmpty() == true
    return if (hasMasteryCheck) {
      module.id in state.passedMasteryModuleIds
    } else {
      isUnitLessonsMastered(state, module)
    }
  }

  fun unitMasteryStatus(state: UserProgress, module: CurriculumModule): UnitMasteryStatus {
    val totalLessons = module.chapters.size
    val masteredLessons = module.chapters.count { isChapterMastered(state, it) }
    val readLessons = module.chapters.count { it.id in state.completedChapterIds }
    val allLessonsMastered = totalLessons > 0 && masteredLessons == totalLessons
    val masteryCheck = module.masteryCheck
    val hasMasteryCheck = masteryCheck?.questions?.isNotEmpty() == true
    val isMasteryPassed = module.id in state.passedMasteryModuleIds
    val isUnitMastered = isUnitMastered(state, module)
    val totalSteps = totalLessons + if (hasMasteryCheck) 1 else 0
    val completedSteps = masteredLessons + if (hasMasteryCheck && isMasteryPassed) 1 else 0
    val fraction = if (totalSteps > 0) {
      (completedSteps.toFloat() / totalSteps.toFloat()).coerceIn(0f, 1f)
    } else {
      0f
    }

    return UnitMasteryStatus(
      moduleId = module.id,
      moduleNumber = module.number,
      masteredLessonsCount = masteredLessons,
      readLessonsCount = readLessons,
      totalLessonsCount = totalLessons,
      allLessonsMastered = allLessonsMastered,
      hasMasteryCheck = hasMasteryCheck,
      isMasteryCheckReady = hasMasteryCheck && allLessonsMastered && !isMasteryPassed,
      isMasteryCheckPassed = isMasteryPassed,
      masteryBestScore = state.masteryBestScores[module.id],
      masteryTotalQuestions = masteryCheck?.questions?.size ?: 0,
      masteryBestPercent = state.masteryBestPercents[module.id],
      isUnitMastered = isUnitMastered,
      progressFraction = fraction,
    )
  }

  fun completedChaptersInModule(state: UserProgress, module: CurriculumModule): Int =
    module.chapters.count { isChapterMastered(state, it) }

  fun masteredUnitsCount(state: UserProgress, curriculum: Curriculum): Int =
    curriculum.modules.count { isUnitMastered(state, it) }

  fun completedModulesCount(state: UserProgress, curriculum: Curriculum): Int =
    masteredUnitsCount(state, curriculum)

  fun masteredLessonsCount(state: UserProgress, curriculum: Curriculum): Int =
    curriculum.allChaptersOrdered().count { isChapterMastered(state, it) }

  fun overallProgressFraction(state: UserProgress, curriculum: Curriculum): Float {
    val ordered = curriculum.orderedModules()
    var totalSteps = 0
    var masteredSteps = 0
    ordered.forEach { module ->
      totalSteps += module.chapters.size
      masteredSteps += module.chapters.count { isChapterMastered(state, it) }
      if (module.masteryCheck?.questions?.isNotEmpty() == true) {
        totalSteps += 1
        if (module.id in state.passedMasteryModuleIds) {
          masteredSteps += 1
        }
      }
    }
    if (totalSteps <= 0) return 0f
    return (masteredSteps.toFloat() / totalSteps.toFloat()).coerceIn(0f, 1f)
  }

  /**
   * Resolves the single clearest next action for the learner:
   * - Fresh learner -> Start Lesson 1 (Unit 1, Lesson 1) directly.
   * - Mid-unit -> Continue directly into the next unmastered lesson.
   * - End of unit -> Take Unit X Mastery Check directly once all unit lessons are mastered.
   * - All units mastered -> AllMastered state pointing to review.
   */
  fun nextLearningAction(state: UserProgress, curriculum: Curriculum): NextLearningAction? {
    val orderedModules = curriculum.orderedModules()
    if (orderedModules.isEmpty()) return null

    val firstOrderedChapter = curriculum.allChaptersOrdered().firstOrNull()
    val fresh = isFreshLearner(state)
    val currentMasteredUnits = masteredUnitsCount(state, curriculum)

    for (module in orderedModules) {
      if (isUnitMastered(state, module)) continue

      val orderedChapters = module.chapters.sortedBy { it.number }
      val nextUnmasteredChapter = orderedChapters.firstOrNull { !isChapterMastered(state, it) }
      if (nextUnmasteredChapter != null) {
        val isFirst = fresh && nextUnmasteredChapter.id == firstOrderedChapter?.id
        val isReadAwaitingQuiz = nextUnmasteredChapter.id in state.completedChapterIds ||
          nextUnmasteredChapter.id in state.attemptedQuizChapterIds
        val hasFailedAttempt = nextUnmasteredChapter.id in state.attemptedQuizChapterIds
        val ctaLabel = when {
          isFirst -> "Start Lesson 1"
          hasFailedAttempt -> "Retry Lesson ${nextUnmasteredChapter.number}"
          isReadAwaitingQuiz -> "Practice Lesson ${nextUnmasteredChapter.number}"
          else -> "Continue Lesson"
        }
        val subtitle = buildString {
          append("Unit ${module.number} · Lesson ${nextUnmasteredChapter.number}")
          append(" · ${nextUnmasteredChapter.readMinutes} min")
          if (hasFailedAttempt) {
            append(" · Pass check (≥$LESSON_PASS_PERCENT%)")
          } else if (isReadAwaitingQuiz) {
            append(" · Practice check ready")
          }
        }
        return NextLearningAction.OpenLesson(
          moduleId = module.id,
          moduleNumber = module.number,
          chapterId = nextUnmasteredChapter.id,
          chapterNumber = nextUnmasteredChapter.number,
          ctaLabel = ctaLabel,
          title = nextUnmasteredChapter.title,
          subtitle = subtitle,
          isFirstLesson = isFirst,
          isReadAwaitingQuiz = isReadAwaitingQuiz,
        )
      }

      val masteryCheck = module.masteryCheck
      if (masteryCheck != null && masteryCheck.questions.isNotEmpty() && !isUnitMastered(state, module)) {
        val projectedMastered = currentMasteredUnits + 1
        val currentTier = fluencyTiers.lastOrNull { currentMasteredUnits >= it.requiredMasteredUnits }
          ?: fluencyTiers.first()
        val projectedTier = fluencyTiers.lastOrNull { projectedMastered >= it.requiredMasteredUnits }
          ?: fluencyTiers.first()
        val unlocksCode = if (projectedTier.level > currentTier.level) projectedTier.cefrCode else null
        val passPct = masteryCheck.passingScorePercent
        val subtitle = buildString {
          append("${masteryCheck.questions.size} questions · ${masteryCheck.estimatedMinutes} min")
          append(" · ≥$passPct% to master Unit ${module.number}")
          if (unlocksCode != null) {
            append(" & earn $unlocksCode")
          }
        }
        return NextLearningAction.OpenUnitMasteryCheck(
          moduleId = module.id,
          moduleNumber = module.number,
          ctaLabel = "Take Unit ${module.number} Mastery Check",
          title = masteryCheck.title,
          subtitle = subtitle,
          passingScorePercent = passPct,
          minCorrectToPass = masteryCheck.minCorrectToPass,
          questionCount = masteryCheck.questions.size,
          unlocksCefrCode = unlocksCode,
        )
      }
    }

    val fallbackModule = orderedModules.first()
    val fallbackChapter = firstOrderedChapter ?: return null
    return NextLearningAction.AllMastered(
      moduleId = fallbackModule.id,
      moduleNumber = fallbackModule.number,
      reviewChapterId = fallbackChapter.id,
      ctaLabel = "Review Unit 1",
      title = "All ${orderedModules.size} Units Mastered",
      subtitle = "C2 Fluent Builder · Revisit any lesson or mastery check anytime",
    )
  }

  /**
   * Resolves what comes immediately after finishing a lesson's practice check:
   * - Next lesson in the same unit
   * - This unit's Mastery Check if that was the final lesson in the unit and the check isn't passed yet
   * - First lesson of the next unit (or CourseComplete)
   */
  fun nextStepAfterChapter(
    chapterId: String,
    state: UserProgress,
    curriculum: Curriculum,
  ): NextStepAfterChapter {
    val module = curriculum.findModuleForChapter(chapterId)
    if (module != null) {
      val orderedInModule = module.chapters.sortedBy { it.number }
      val indexInModule = orderedInModule.indexOfFirst { it.id == chapterId }
      if (indexInModule >= 0 && indexInModule + 1 < orderedInModule.size) {
        return NextStepAfterChapter.NextLesson(orderedInModule[indexInModule + 1])
      }
      val masteryCheck = module.masteryCheck
      if (masteryCheck != null && masteryCheck.questions.isNotEmpty() && !isUnitMastered(state, module)) {
        return NextStepAfterChapter.UnitMasteryCheck(module)
      }
    }

    val nextAcrossCurriculum = nextChapterAfter(chapterId, curriculum)
    if (nextAcrossCurriculum != null) {
      return NextStepAfterChapter.NextLesson(nextAcrossCurriculum)
    }

    val lastModule = module ?: curriculum.orderedModules().last()
    return NextStepAfterChapter.CourseComplete(lastModule)
  }

  fun nextActiveChapter(state: UserProgress, curriculum: Curriculum): Chapter? {
    val orderedModules = curriculum.orderedModules()
    for (module in orderedModules) {
      if (isUnitMastered(state, module)) continue
      val nextInUnit = module.chapters.sortedBy { it.number }.firstOrNull { !isChapterMastered(state, it) }
      if (nextInUnit != null) return nextInUnit
    }
    val ordered = curriculum.allChaptersOrdered()
    if (ordered.isEmpty()) return null
    return ordered.firstOrNull { !isChapterMastered(state, it) } ?: ordered.first()
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
    val totalUnits = curriculum.modules.size
    val masteredUnits = masteredUnitsCount(state, curriculum)
    val masteredLessons = masteredLessonsCount(state, curriculum)
    val todayXp = todayXpEarned(state, todayEpochDay)
    val phrases = state.masteredPhraseIds.size
    val bestStreak = max(state.longestStreakDays, effectiveStreakDays(state, todayEpochDay))
    val rank = fluencyRank(state, curriculum).currentTier

    return listOf(
      FluencyMilestone(
        id = "first_drill",
        title = "First Lesson Mastered",
        description = "Pass your first lesson practice check (≥$LESSON_PASS_PERCENT%)",
        unlocked = masteredLessons >= 1,
        progressLabel = "${minOf(masteredLessons, 1)}/1",
      ),
      FluencyMilestone(
        id = "daily_goal",
        title = "Daily Practice Goal",
        description = "Earn $DAILY_GOAL_XP practice XP in a single day",
        unlocked = todayXp >= DAILY_GOAL_XP,
        progressLabel = "${minOf(todayXp, DAILY_GOAL_XP)}/$DAILY_GOAL_XP XP",
      ),
      FluencyMilestone(
        id = "combo_streak",
        title = "Sharp Recall",
        description = "Answer 3 check questions right in a row",
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
        title = "First Unit Mastered",
        description = "Pass any Unit Mastery Check to earn A1",
        unlocked = masteredUnits >= 1,
        progressLabel = "${minOf(masteredUnits, 1)}/1",
      ),
      FluencyMilestone(
        id = "fluent_builder",
        title = "C2 Fluent Builder",
        description = "Pass all $totalUnits Unit Mastery Checks",
        unlocked = rank.cefrCode == "C2",
        progressLabel = "${minOf(masteredUnits, totalUnits)}/$totalUnits units",
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
