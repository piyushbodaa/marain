package app.marain.learn

import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Analogy
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.ChapterSection
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.data.model.QuizQuestion
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ProgressEngineTest {

  private fun sampleCurriculum(): Curriculum {
    fun chapter(id: String, moduleId: String, number: Int, xp: Int = 25) = Chapter(
      id = id,
      moduleId = moduleId,
      number = number,
      title = "Chapter $number",
      readMinutes = 4,
      xpReward = xp,
      summary = "Summary $id",
      analogy = Analogy("Analogy", "Body"),
      sections = listOf(ChapterSection("Heading", "Body")),
      keyTakeaways = listOf("Takeaway"),
      glossaryTermIds = emptyList(),
      quiz = listOf(
        QuizQuestion("q-$id-1", "multiple_choice", "Q1?", listOf("A", "B"), 0, "Because A"),
        QuizQuestion("q-$id-2", "true_false", "Q2?", listOf("True", "False"), 1, "Because False"),
        QuizQuestion("q-$id-3", "spot_mistake", "Q3?", listOf("X", "Y"), 0, "Because X"),
      ),
    )

    val mod1 = CurriculumModule(
      id = "mod-1",
      number = 1,
      title = "Module 1",
      subtitle = "Sub 1",
      icon = "brain",
      accentHex = "#10B981",
      estimatedMinutes = 10,
      chapters = listOf(chapter("ch-1-1", "mod-1", 1), chapter("ch-1-2", "mod-1", 2)),
    )
    val mod2 = CurriculumModule(
      id = "mod-2",
      number = 2,
      title = "Module 2",
      subtitle = "Sub 2",
      icon = "token",
      accentHex = "#3B82F6",
      estimatedMinutes = 12,
      chapters = listOf(chapter("ch-2-1", "mod-2", 1)),
    )
    return Curriculum(
      version = "1.0.0",
      appName = "Marain",
      tagline = "From Zero to Fluent in AI",
      modules = listOf(mod1, mod2),
      glossary = emptyList(),
      labs = emptyList(),
    )
  }

  @Test
  fun markChapterRead_awardsXpOnceAndTracksDailyGoal() {
    val day1 = 20_000L
    val initial = UserProgress()

    val afterFirstRead = ProgressEngine.markChapterRead(initial, "ch-1-1", day1)
    assertTrue("ch-1-1" in afterFirstRead.completedChapterIds)
    assertEquals(ProgressEngine.READ_CHAPTER_XP, afterFirstRead.totalXp)
    assertEquals(ProgressEngine.READ_CHAPTER_XP, ProgressEngine.todayXpEarned(afterFirstRead, day1))
    assertEquals(1, afterFirstRead.currentStreakDays)
    assertEquals(1, afterFirstRead.longestStreakDays)

    // Reading the same chapter again does not double-award XP
    val afterSecondRead = ProgressEngine.markChapterRead(afterFirstRead, "ch-1-1", day1)
    assertEquals(ProgressEngine.READ_CHAPTER_XP, afterSecondRead.totalXp)
    assertEquals(ProgressEngine.READ_CHAPTER_XP, ProgressEngine.todayXpEarned(afterSecondRead, day1))

    // Next calendar day resets today's XP counter cleanly
    assertEquals(0, ProgressEngine.todayXpEarned(afterSecondRead, day1 + 1L))
  }

  @Test
  fun recordQuizResult_calculatesXpComboBonusAccuracyAndPreventsFarming() {
    val day1 = 20_000L
    val initial = UserProgress()

    // First attempt: 2 of 3 correct with 2x combo -> readBonus (10) + chapterXp (30) + comboBonus (5) = 45 XP
    val firstOutcome = ProgressEngine.recordQuizResult(
      state = initial,
      chapterId = "ch-1-1",
      correctCount = 2,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 2,
    )
    assertTrue(firstOutcome.isFirstQuizCompletion)
    assertFalse(firstOutcome.isPerfectScore)
    assertEquals(ProgressEngine.COMBO_BONUS_XP, firstOutcome.comboBonusXp)
    assertEquals(30 + ProgressEngine.READ_CHAPTER_XP + ProgressEngine.COMBO_BONUS_XP, firstOutcome.xpEarned)
    assertEquals(67, firstOutcome.accuracyPercent)
    assertEquals(2, firstOutcome.updatedProgress.bestQuizCombo)
    assertFalse(ProgressEngine.isDailyGoalReached(firstOutcome.updatedProgress, day1))

    // Second attempt: 3 of 3 perfect with new best 3x combo -> perfectBonus (10) + comboBonus (5) = 15 XP -> crosses 50 XP daily goal!
    val secondOutcome = ProgressEngine.recordQuizResult(
      state = firstOutcome.updatedProgress,
      chapterId = "ch-1-1",
      correctCount = 3,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 3,
    )
    assertFalse(secondOutcome.isFirstQuizCompletion)
    assertTrue(secondOutcome.isPerfectScore)
    assertEquals(ProgressEngine.PERFECT_QUIZ_BONUS_XP + ProgressEngine.COMBO_BONUS_XP, secondOutcome.xpEarned)
    assertEquals(3, secondOutcome.updatedProgress.quizBestScores["ch-1-1"])
    assertEquals(3, secondOutcome.updatedProgress.bestQuizCombo)
    assertEquals(83, ProgressEngine.quizAccuracyPercent(secondOutcome.updatedProgress))
    assertTrue(ProgressEngine.isDailyGoalReached(secondOutcome.updatedProgress, day1))
    assertEquals(1f, ProgressEngine.dailyGoalFraction(secondOutcome.updatedProgress, day1), 0.001f)

    // Third attempt (already perfect & no new best combo): 0 duplicate XP
    val thirdOutcome = ProgressEngine.recordQuizResult(
      state = secondOutcome.updatedProgress,
      chapterId = "ch-1-1",
      correctCount = 3,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 3,
    )
    assertEquals(0, thirdOutcome.xpEarned)
  }

  @Test
  fun heartsLogic_decrementsOnWrongAnswerAndFloorsAtZero() {
    assertEquals(5, ProgressEngine.nextHeartsAfterAnswer(5, wasCorrect = true))
    assertEquals(4, ProgressEngine.nextHeartsAfterAnswer(5, wasCorrect = false))
    assertEquals(0, ProgressEngine.nextHeartsAfterAnswer(1, wasCorrect = false))
    assertEquals(0, ProgressEngine.nextHeartsAfterAnswer(0, wasCorrect = false))
  }

  @Test
  fun phrasebookFlashcardsMastery_awardsXpOnceAndPersists() {
    val day1 = 500L
    val initial = UserProgress()

    val first = ProgressEngine.markPhraseMastered(initial, "llm", day1)
    assertTrue(first.isNewlyMastered)
    assertEquals(ProgressEngine.FLASHCARD_MASTERY_XP, first.xpEarned)
    assertTrue("llm" in first.updatedProgress.masteredPhraseIds)
    assertEquals(ProgressEngine.FLASHCARD_MASTERY_XP, first.updatedProgress.totalXp)
    assertEquals(ProgressEngine.FLASHCARD_MASTERY_XP, ProgressEngine.todayXpEarned(first.updatedProgress, day1))

    val repeat = ProgressEngine.markPhraseMastered(first.updatedProgress, "llm", day1)
    assertFalse(repeat.isNewlyMastered)
    assertEquals(0, repeat.xpEarned)
    assertEquals(ProgressEngine.FLASHCARD_MASTERY_XP, repeat.updatedProgress.totalXp)
  }

  @Test
  fun streakLogic_incrementsConsecutiveDaysAndResetsAfterGap() {
    var state = UserProgress()
    state = ProgressEngine.markChapterRead(state, "ch-1-1", todayEpochDay = 100L)
    assertEquals(1, state.currentStreakDays)
    assertEquals(1, ProgressEngine.effectiveStreakDays(state, todayEpochDay = 100L))
    assertEquals(1, ProgressEngine.effectiveStreakDays(state, todayEpochDay = 101L))

    state = ProgressEngine.markChapterRead(state, "ch-1-2", todayEpochDay = 101L)
    assertEquals(2, state.currentStreakDays)
    assertEquals(2, state.longestStreakDays)

    assertEquals(0, ProgressEngine.effectiveStreakDays(state, todayEpochDay = 103L))

    state = ProgressEngine.markChapterRead(state, "ch-2-1", todayEpochDay = 103L)
    assertEquals(1, state.currentStreakDays)
    assertEquals(2, state.longestStreakDays)
  }

  @Test
  fun cefrFluencyRanks_progressesThroughA1ToC2Accurately() {
    val a1 = ProgressEngine.fluencyRankForXp(0)
    assertEquals("A1", a1.currentTier.cefrCode)
    assertEquals("First Contact", a1.currentTier.title)
    assertEquals(0.5f, ProgressEngine.fluencyRankForXp(50).progressFraction, 0.001f)

    val a2 = ProgressEngine.fluencyRankForXp(100)
    assertEquals("A2", a2.currentTier.cefrCode)
    assertEquals("Signal Listener", a2.currentTier.title)

    assertEquals("B1", ProgressEngine.fluencyRankForXp(250).currentTier.cefrCode)
    assertEquals("Key Bearer", ProgressEngine.fluencyRankForXp(250).currentTier.title)

    assertEquals("B2", ProgressEngine.fluencyRankForXp(450).currentTier.cefrCode)
    assertEquals("Terminal Speaker", ProgressEngine.fluencyRankForXp(450).currentTier.title)

    assertEquals("C1", ProgressEngine.fluencyRankForXp(650).currentTier.cefrCode)
    assertEquals("Web Shaper", ProgressEngine.fluencyRankForXp(650).currentTier.title)

    val c2 = ProgressEngine.fluencyRankForXp(850)
    assertEquals("C2", c2.currentTier.cefrCode)
    assertEquals("Fluent Builder", c2.currentTier.title)
    assertEquals(1f, c2.progressFraction, 0.001f)
    assertEquals(0, c2.xpNeededForNextTier)
  }

  @Test
  fun onboardingBookmarksAppearanceMilestonesAndNavigationHelpers_workAccurately() {
    val curriculum = sampleCurriculum()
    var state = UserProgress()

    assertFalse(state.hasCompletedOnboarding)
    state = ProgressEngine.completeOnboarding(state)
    assertTrue(state.hasCompletedOnboarding)
    state = ProgressEngine.resetOnboarding(state)
    assertFalse(state.hasCompletedOnboarding)

    state = ProgressEngine.toggleBookmark(state, "ch-1-2")
    assertTrue("ch-1-2" in state.bookmarkedChapterIds)
    state = ProgressEngine.toggleBookmark(state, "ch-1-2")
    assertFalse("ch-1-2" in state.bookmarkedChapterIds)

    state = ProgressEngine.setReadingTheme(state, ReadingTheme.SEPIA)
    state = ProgressEngine.setFontScale(state, FontScaleOption.LARGE)
    assertEquals(ReadingTheme.SEPIA, state.readingTheme)
    assertEquals(FontScaleOption.LARGE, state.fontScale)

    assertEquals("ch-1-1", ProgressEngine.nextRecommendedChapter(state, curriculum)?.id)
    assertEquals(0, ProgressEngine.completedModulesCount(state, curriculum))

    state = ProgressEngine.markChapterRead(state, "ch-1-1", 10L)
    state = ProgressEngine.recordQuizResult(state, "ch-1-1", 3, 3, 25, 10L, maxCombo = 3).updatedProgress
    assertTrue(ProgressEngine.isChapterMastered(state, "ch-1-1"))
    assertEquals("ch-1-2", ProgressEngine.nextRecommendedChapter(state, curriculum)?.id)

    state = ProgressEngine.markChapterRead(state, "ch-1-2", 10L)
    assertEquals(1, ProgressEngine.completedModulesCount(state, curriculum))
    assertEquals(2f / 3f, ProgressEngine.overallProgressFraction(state, curriculum), 0.001f)

    val milestones = ProgressEngine.milestones(state, curriculum, 10L)
    assertTrue(milestones.first { it.id == "first_drill" }.unlocked)
    assertTrue(milestones.first { it.id == "combo_streak" }.unlocked)
    assertTrue(milestones.first { it.id == "unit_finisher" }.unlocked)

    assertNull(ProgressEngine.previousChapterBefore("ch-1-1", curriculum))
    assertEquals("ch-1-2", ProgressEngine.nextChapterAfter("ch-1-1", curriculum)?.id)
    assertEquals("ch-2-1", ProgressEngine.nextChapterAfter("ch-1-2", curriculum)?.id)
    assertNull(ProgressEngine.nextChapterAfter("ch-2-1", curriculum))
  }

  @Test
  fun nextActiveChapter_neverSkipsFirstUncompletedQuizEvenWhenPeekingOrReadOnly() {
    val curriculum = sampleCurriculum()
    var state = UserProgress()

    // Fresh install -> Node 1 (ch-1-1) is active
    assertEquals("ch-1-1", ProgressEngine.nextActiveChapter(state, curriculum)?.id)

    // Peeking at Node 2 (ch-1-2) must NOT skip Node 1
    state = ProgressEngine.markChapterOpened(state, "ch-1-2")
    assertEquals("ch-1-1", ProgressEngine.nextActiveChapter(state, curriculum)?.id)

    // Marking Node 1 as read without finishing its quiz keeps Node 1 active (showing QUIZ badge)
    state = ProgressEngine.markChapterRead(state, "ch-1-1", 10L)
    assertEquals("ch-1-1", ProgressEngine.nextActiveChapter(state, curriculum)?.id)

    // Completing Node 1's quiz advances active node cleanly to Node 2 (ch-1-2)
    state = ProgressEngine.recordQuizResult(state, "ch-1-1", 3, 3, 25, 10L, maxCombo = 3).updatedProgress
    assertEquals("ch-1-2", ProgressEngine.nextActiveChapter(state, curriculum)?.id)
  }
}
