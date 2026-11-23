package app.marain.learn

import app.marain.learn.data.CurriculumParser
import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.NextLearningAction
import app.marain.learn.data.NextStepAfterChapter
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Analogy
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.ChapterSection
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.data.model.MasteryCheck
import app.marain.learn.data.model.QuizQuestion
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ProgressEngineTest {

  private fun sampleCurriculum(
    moduleCount: Int = 2,
    chaptersPerModule: Int = 2,
    masteryQuestionsPerModule: Int = 4,
    passThreshold: Double = 0.75,
  ): Curriculum {
    fun chapter(id: String, moduleId: String, number: Int, xp: Int = 25) = Chapter(
      id = id,
      moduleId = moduleId,
      number = number,
      title = "Chapter $number",
      readMinutes = 2,
      xpReward = xp,
      summary = "Summary $id",
      analogy = Analogy("Analogy", "Body"),
      sections = listOf(ChapterSection("Heading", "Body")),
      keyTakeaways = listOf("Takeaway"),
      glossaryTermIds = emptyList(),
      quiz = listOf(
        QuizQuestion("q-$id-1", "multiple_choice", "Q1?", listOf("A", "B", "C", "D"), 0, "Because A"),
        QuizQuestion("q-$id-2", "true_false", "Q2?", listOf("True", "False"), 1, "Because False"),
        QuizQuestion("q-$id-3", "spot_mistake", "Q3?", listOf("X", "Y", "Z", "W"), 0, "Because X"),
      ),
    )

    val modules = (1..moduleCount).map { modNum ->
      val modId = "mod-$modNum"
      val chapters = (1..chaptersPerModule).map { chNum ->
        chapter("ch-$modNum-$chNum", modId, chNum)
      }
      val mcQuestions = (1..masteryQuestionsPerModule).map { qIdx ->
        QuizQuestion(
          id = "mc-$modNum-q$qIdx",
          type = "multiple_choice",
          question = "Mastery Q$qIdx for Unit $modNum?",
          options = listOf("Opt A", "Opt B", "Opt C", "Opt D"),
          correctIndex = qIdx % 4,
          explanation = "Explanation $qIdx",
        )
      }
      CurriculumModule(
        id = modId,
        number = modNum,
        title = "Module $modNum",
        subtitle = "Sub $modNum",
        icon = "brain",
        accentHex = "#10B981",
        estimatedMinutes = 5,
        recommendedLabId = null,
        chapters = chapters,
        masteryCheck = MasteryCheck(
          id = "mc-$modNum",
          title = "Unit $modNum Mastery Check",
          subtitle = "Demonstrate Unit $modNum mastery",
          passThreshold = passThreshold,
          xpReward = 40,
          estimatedMinutes = 2,
          questions = mcQuestions,
        ),
      )
    }

    return Curriculum(
      version = "2.0.0",
      appName = "Marain",
      tagline = "From Zero to Fluent in AI",
      modules = modules,
      glossary = emptyList(),
      labs = emptyList(),
    )
  }

  @Test
  fun auditExploit_readAllFlashcardsAllWrongQuizzes_earnsZeroWrongXpAndZeroFluencyAdvancement() {
    val stream = javaClass.classLoader!!.getResourceAsStream("curriculum.json")
    assertNotNull("Expected bundled curriculum.json asset", stream)
    val curriculum = CurriculumParser.parse(stream!!)

    val day1 = 20_500L
    var state = UserProgress()

    // 1. Read EVERY single chapter across all 7 units
    val allChapters = curriculum.allChaptersOrdered()
    allChapters.forEach { chapter ->
      state = ProgressEngine.markChapterRead(state, chapter.id, day1)
    }
    val expectedReadXp = allChapters.size * ProgressEngine.READ_CHAPTER_XP

    // 2. Flip/master EVERY single glossary flashcard
    curriculum.glossary.forEach { term ->
      state = ProgressEngine.markPhraseMastered(state, term.id, day1).updatedProgress
    }
    val expectedFlashcardXp = curriculum.glossary.size * ProgressEngine.FLASHCARD_MASTERY_XP
    val xpBeforeWrongAnswers = state.totalXp
    assertEquals(expectedReadXp + expectedFlashcardXp, xpBeforeWrongAnswers)

    // 3. Answer EVERY single chapter quiz question WRONG (0 correct)
    allChapters.forEach { chapter ->
      val outcome = ProgressEngine.recordQuizResult(
        state = state,
        chapterId = chapter.id,
        correctCount = 0,
        totalQuestions = chapter.quiz.size,
        chapterXpReward = chapter.xpReward,
        todayEpochDay = day1,
        maxCombo = 0,
      )
      assertFalse("0-correct quiz must NOT pass for ${chapter.id}", outcome.passed)
      assertEquals("0-correct quiz must award 0 XP for ${chapter.id}", 0, outcome.xpEarned)
      state = outcome.updatedProgress
    }

    // 4. Answer EVERY single unit mastery check question WRONG (0 correct)
    curriculum.orderedModules().forEach { module ->
      val qCount = module.masteryCheck?.questions?.size ?: 4
      val mcOutcome = ProgressEngine.recordMasteryCheckResult(
        state = state,
        module = module,
        correctCount = 0,
        totalQuestions = qCount,
        curriculum = curriculum,
        todayEpochDay = day1,
      )
      assertFalse("0-correct mastery check must NOT pass for ${module.id}", mcOutcome.passed)
      assertEquals("0-correct mastery check must award 0 XP for ${module.id}", 0, mcOutcome.xpEarned)
      assertFalse("0-correct mastery check must NOT unlock a tier", mcOutcome.unlockedNewTier)
      state = mcOutcome.updatedProgress
    }

    // Verify ZERO XP earned from wrong answers
    assertEquals(xpBeforeWrongAnswers, state.totalXp)
    assertEquals(0, ProgressEngine.quizAccuracyPercent(state))

    // Verify ZERO mastery recorded
    assertTrue("No chapters may be mastered at 0% accuracy", state.completedQuizChapterIds.isEmpty())
    assertTrue("No units may be mastered at 0% accuracy", state.passedMasteryModuleIds.isEmpty())
    assertEquals(0, ProgressEngine.masteredLessonsCount(state, curriculum))
    assertEquals(0, ProgressEngine.completedModulesCount(state, curriculum))
    assertEquals(0f, ProgressEngine.overallProgressFraction(state, curriculum), 0.0001f)

    // Verify ZERO fluency tier advancement (stays at A0 Newcomer, never reaches A1, A2, or C2)
    val rank = ProgressEngine.fluencyRank(state, curriculum)
    assertEquals("A0", rank.currentTier.cefrCode)
    assertEquals("Newcomer", rank.currentTier.title)
    assertEquals(0, rank.currentTier.level)
    assertEquals(0f, rank.progressFraction, 0.0001f)
    assertEquals("A1", rank.nextTier?.cefrCode)
    ProgressEngine.cefrMilestoneTiers.forEach { tier ->
      assertFalse("CEFR tier ${tier.cefrCode} must stay locked at 0% mastery", rank.isTierUnlocked(tier))
    }

    // Even with massive XP (10,000 XP), fluency remains strictly gated by mastery
    val inflatedXpRank = ProgressEngine.fluencyRank(state.copy(totalXp = 10_000), curriculum)
    assertEquals("A0", inflatedXpRank.currentTier.cefrCode)
    assertEquals(0f, inflatedXpRank.progressFraction, 0.0001f)

    // Mastery milestones must stay locked
    val milestones = ProgressEngine.milestones(state, curriculum, day1)
    assertFalse(milestones.first { it.id == "first_drill" }.unlocked)
    assertFalse(milestones.first { it.id == "combo_streak" }.unlocked)
    assertFalse(milestones.first { it.id == "unit_finisher" }.unlocked)
    assertFalse(milestones.first { it.id == "fluent_builder" }.unlocked)
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
  fun recordQuizResult_zeroXpForWrongAnswers_requiresPassThresholdAndPreventsFarming() {
    val day1 = 20_000L
    val initial = UserProgress()

    // 0 of 3 correct -> FAIL, 0 XP, NOT mastered, NOT marked read, no streak earned
    val zeroOutcome = ProgressEngine.recordQuizResult(
      state = initial,
      chapterId = "ch-1-1",
      correctCount = 0,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 0,
    )
    assertFalse(zeroOutcome.passed)
    assertFalse(zeroOutcome.isFirstQuizCompletion)
    assertEquals(0, zeroOutcome.xpEarned)
    assertEquals(0, zeroOutcome.updatedProgress.currentStreakDays)
    assertFalse(ProgressEngine.isChapterMastered(zeroOutcome.updatedProgress, "ch-1-1"))
    assertFalse("ch-1-1" in zeroOutcome.updatedProgress.completedChapterIds)
    assertTrue("ch-1-1" in zeroOutcome.updatedProgress.attemptedQuizChapterIds)

    // 1 of 3 correct (33% < 67%) -> FAIL, only 5 XP for the 1 correct answer, NOT mastered
    val oneOutcome = ProgressEngine.recordQuizResult(
      state = zeroOutcome.updatedProgress,
      chapterId = "ch-1-1",
      correctCount = 1,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 1,
    )
    assertFalse(oneOutcome.passed)
    assertEquals(ProgressEngine.CORRECT_ANSWER_XP, oneOutcome.xpEarned)
    assertFalse(ProgressEngine.isChapterMastered(oneOutcome.updatedProgress, "ch-1-1"))
    assertEquals(1, oneOutcome.updatedProgress.quizBestScores["ch-1-1"])

    // Repeating 1 of 3 correct -> 0 XP (no XP farming)
    val repeatFail = ProgressEngine.recordQuizResult(
      state = oneOutcome.updatedProgress,
      chapterId = "ch-1-1",
      correctCount = 1,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 1,
    )
    assertFalse(repeatFail.passed)
    assertEquals(0, repeatFail.xpEarned)

    // 2 of 3 correct (67% >= 67%) with 2x combo -> PASS!
    // newlyImprovedCorrect=1 (+5) + passBonus (30 - 15 = 15) + combo (5) + readBonus (10) = 35 XP
    val passOutcome = ProgressEngine.recordQuizResult(
      state = repeatFail.updatedProgress,
      chapterId = "ch-1-1",
      correctCount = 2,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 2,
    )
    assertTrue(passOutcome.passed)
    assertTrue(passOutcome.isFirstQuizCompletion)
    assertFalse(passOutcome.isPerfectScore)
    assertEquals(ProgressEngine.COMBO_BONUS_XP, passOutcome.comboBonusXp)
    assertEquals(35, passOutcome.xpEarned)
    assertEquals(67, passOutcome.accuracyPercent)
    assertTrue(ProgressEngine.isChapterMastered(passOutcome.updatedProgress, "ch-1-1"))
    assertTrue("ch-1-1" in passOutcome.updatedProgress.completedChapterIds)

    // 3 of 3 perfect with new best 3x combo -> newlyImprovedCorrect=1 (+5) + perfectBonus (10) + comboBonus (5) = 20 XP -> crosses 50 XP daily goal!
    val perfectOutcome = ProgressEngine.recordQuizResult(
      state = passOutcome.updatedProgress,
      chapterId = "ch-1-1",
      correctCount = 3,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 3,
    )
    assertTrue(perfectOutcome.passed)
    assertFalse(perfectOutcome.isFirstQuizCompletion)
    assertTrue(perfectOutcome.isPerfectScore)
    assertEquals(
      ProgressEngine.CORRECT_ANSWER_XP + ProgressEngine.PERFECT_QUIZ_BONUS_XP + ProgressEngine.COMBO_BONUS_XP,
      perfectOutcome.xpEarned,
    )
    assertEquals(3, perfectOutcome.updatedProgress.quizBestScores["ch-1-1"])
    assertEquals(100, perfectOutcome.updatedProgress.quizBestPercents["ch-1-1"])
    assertTrue(ProgressEngine.isDailyGoalReached(perfectOutcome.updatedProgress, day1))

    // Repeat perfect -> 0 duplicate XP
    val repeatPerfect = ProgressEngine.recordQuizResult(
      state = perfectOutcome.updatedProgress,
      chapterId = "ch-1-1",
      correctCount = 3,
      totalQuestions = 3,
      chapterXpReward = 30,
      todayEpochDay = day1,
      maxCombo = 3,
    )
    assertEquals(0, repeatPerfect.xpEarned)
  }

  @Test
  fun recordMasteryCheckResult_enforcesThresholdsRetryAndTierUnlock() {
    val curriculum = sampleCurriculum(moduleCount = 7, chaptersPerModule = 2, masteryQuestionsPerModule = 4, passThreshold = 0.75)
    val unit1 = curriculum.modules[0]
    val day1 = 20_100L
    var state = UserProgress()

    // 2/4 (50% < 75%) -> FAIL, 0 XP, stays A0
    val failOutcome = ProgressEngine.recordMasteryCheckResult(
      state = state,
      module = unit1,
      correctCount = 2,
      totalQuestions = 4,
      curriculum = curriculum,
      todayEpochDay = day1,
    )
    assertFalse(failOutcome.passed)
    assertFalse(failOutcome.isFirstPass)
    assertFalse(failOutcome.unlockedNewTier)
    assertEquals(3, failOutcome.minCorrectToPass)
    assertEquals(75, failOutcome.passingScorePercent)
    assertEquals(0, failOutcome.xpEarned)
    assertEquals("A0", failOutcome.newTier.cefrCode)
    assertFalse(ProgressEngine.isUnitMastered(failOutcome.updatedProgress, unit1))
    assertEquals(1, failOutcome.updatedProgress.masteryAttemptCounts[unit1.id])
    state = failOutcome.updatedProgress

    // Retry: 3/4 (75% >= 75%) -> PASS! Earns 40 XP and unlocks A1 First Contact!
    val passOutcome = ProgressEngine.recordMasteryCheckResult(
      state = state,
      module = unit1,
      correctCount = 3,
      totalQuestions = 4,
      curriculum = curriculum,
      todayEpochDay = day1,
    )
    assertTrue(passOutcome.passed)
    assertTrue(passOutcome.isFirstPass)
    assertFalse(passOutcome.isPerfectScore)
    assertEquals(40, passOutcome.xpEarned)
    assertTrue(passOutcome.unlockedNewTier)
    assertEquals("A0", passOutcome.previousTier.cefrCode)
    assertEquals("A1", passOutcome.newTier.cefrCode)
    assertTrue(ProgressEngine.isUnitMastered(passOutcome.updatedProgress, unit1))
    assertEquals(2, passOutcome.updatedProgress.masteryAttemptCounts[unit1.id])
    state = passOutcome.updatedProgress

    // Retry: 4/4 perfect -> earns only PERFECT_QUIZ_BONUS_XP (10 XP), no duplicate base XP
    val perfectRetry = ProgressEngine.recordMasteryCheckResult(
      state = state,
      module = unit1,
      correctCount = 4,
      totalQuestions = 4,
      curriculum = curriculum,
      todayEpochDay = day1,
    )
    assertTrue(perfectRetry.passed)
    assertFalse(perfectRetry.isFirstPass)
    assertTrue(perfectRetry.isPerfectScore)
    assertEquals(ProgressEngine.PERFECT_QUIZ_BONUS_XP, perfectRetry.xpEarned)
    assertFalse(perfectRetry.unlockedNewTier)
    state = perfectRetry.updatedProgress

    // Repeat perfect -> 0 XP
    val duplicatePerfect = ProgressEngine.recordMasteryCheckResult(
      state = state,
      module = unit1,
      correctCount = 4,
      totalQuestions = 4,
      curriculum = curriculum,
      todayEpochDay = day1,
    )
    assertEquals(0, duplicatePerfect.xpEarned)

    // Subsequent low practice retry does NOT revoke earned unit mastery
    val lowPracticeRetry = ProgressEngine.recordMasteryCheckResult(
      state = state,
      module = unit1,
      correctCount = 1,
      totalQuestions = 4,
      curriculum = curriculum,
      todayEpochDay = day1,
    )
    assertFalse(lowPracticeRetry.passed)
    assertEquals(0, lowPracticeRetry.xpEarned)
    assertTrue(ProgressEngine.isUnitMastered(lowPracticeRetry.updatedProgress, unit1))

    // Also check 5-question mastery check with 0.75 threshold requires 4/5 (ceil(3.75) = 4)
    val fiveQuestionCurriculum = sampleCurriculum(moduleCount = 1, chaptersPerModule = 1, masteryQuestionsPerModule = 5, passThreshold = 0.75)
    val fiveMod = fiveQuestionCurriculum.modules[0]
    assertEquals(4, fiveMod.masteryCheck!!.minCorrectToPass)
    assertFalse(
      ProgressEngine.recordMasteryCheckResult(UserProgress(), fiveMod, 3, 5, fiveQuestionCurriculum, day1).passed,
    )
    assertTrue(
      ProgressEngine.recordMasteryCheckResult(UserProgress(), fiveMod, 4, 5, fiveQuestionCurriculum, day1).passed,
    )
  }

  @Test
  fun masteryBasedCefrProgression_advancesA0ThroughC2StrictlyViaUnitMastery() {
    val curriculum = sampleCurriculum(moduleCount = 7, chaptersPerModule = 2, masteryQuestionsPerModule = 4)
    val day1 = 20_200L
    var state = UserProgress()

    // Starter tier is A0 Newcomer
    val initialRank = ProgressEngine.fluencyRank(state, curriculum)
    assertEquals("A0", initialRank.currentTier.cefrCode)
    assertEquals(0f, initialRank.progressFraction, 0.001f)

    // Passing Unit 1's lessons WITHOUT passing Unit 1 Mastery Check gives partial progress, stays A0
    curriculum.modules[0].chapters.forEach { ch ->
      state = ProgressEngine.recordQuizResult(state, ch.id, 3, 3, 25, day1, maxCombo = 3).updatedProgress
    }
    val awaitingMcRank = ProgressEngine.fluencyRank(state, curriculum)
    assertEquals("A0", awaitingMcRank.currentTier.cefrCode)
    assertEquals(2f / 3f, awaitingMcRank.progressFraction, 0.01f)
    assertTrue(awaitingMcRank.nextRequirementLabel.contains("Unit 1 Mastery Check"))
    assertTrue(awaitingMcRank.nextRequirementLabel.contains("A1"))

    // Pass Mastery Checks 1..7 and verify exact tier ladder
    val expectedCodesByUnitCount = mapOf(
      1 to "A1",
      2 to "A2",
      3 to "B1",
      4 to "B1", // B2 requires 5 mastered units
      5 to "B2",
      6 to "C1",
      7 to "C2",
    )

    curriculum.orderedModules().forEachIndexed { idx, mod ->
      val outcome = ProgressEngine.recordMasteryCheckResult(state, mod, 4, 4, curriculum, day1)
      assertTrue(outcome.passed)
      state = outcome.updatedProgress
      val rank = ProgressEngine.fluencyRank(state, curriculum)
      val unitsDone = idx + 1
      assertEquals("Unexpected CEFR code at $unitsDone mastered units", expectedCodesByUnitCount[unitsDone], rank.currentTier.cefrCode)
    }

    val c2Rank = ProgressEngine.fluencyRank(state, curriculum)
    assertEquals("C2", c2Rank.currentTier.cefrCode)
    assertEquals("Fluent Builder", c2Rank.currentTier.title)
    assertEquals(1f, c2Rank.progressFraction, 0.001f)
    assertNull(c2Rank.nextTier)
    assertTrue(ProgressEngine.milestones(state, curriculum, day1).first { it.id == "fluent_builder" }.unlocked)
  }

  @Test
  fun nextLearningActionAndNextStep_resolvesFirstLaunchMidUnitMasteryCheckAndPostUnit() {
    val curriculum = sampleCurriculum(moduleCount = 2, chaptersPerModule = 2, masteryQuestionsPerModule = 4)
    val day1 = 20_300L
    var state = UserProgress()

    // 1. Fresh install -> should auto-launch first lesson directly
    assertTrue(ProgressEngine.shouldAutoLaunchFirstLesson(state))
    assertEquals("ch-1-1", ProgressEngine.firstLessonChapterId(curriculum))
    val firstAction = ProgressEngine.nextLearningAction(state, curriculum) as NextLearningAction.OpenLesson
    assertEquals("ch-1-1", firstAction.chapterId)
    assertEquals("Start Lesson 1", firstAction.ctaLabel)
    assertTrue(firstAction.isFirstLesson)
    assertFalse(firstAction.isReadAwaitingQuiz)

    // 2. Peeking at Lesson 2 must NOT skip Lesson 1
    state = ProgressEngine.markChapterOpened(state, "ch-1-2")
    assertFalse(ProgressEngine.shouldAutoLaunchFirstLesson(state))
    assertEquals("ch-1-1", (ProgressEngine.nextLearningAction(state, curriculum) as NextLearningAction.OpenLesson).chapterId)

    // 3. Reading Lesson 1 without passing check keeps Lesson 1 active with practice CTA
    state = ProgressEngine.markChapterRead(state, "ch-1-1", day1)
    val afterRead = ProgressEngine.nextLearningAction(state, curriculum) as NextLearningAction.OpenLesson
    assertEquals("ch-1-1", afterRead.chapterId)
    assertTrue(afterRead.isReadAwaitingQuiz)
    assertEquals("Practice Lesson 1", afterRead.ctaLabel)

    // 4. Failing Lesson 1 check (1/3) keeps Lesson 1 active with retry CTA
    state = ProgressEngine.recordQuizResult(state, "ch-1-1", 1, 3, 25, day1, 1).updatedProgress
    val afterFail = ProgressEngine.nextLearningAction(state, curriculum) as NextLearningAction.OpenLesson
    assertEquals("ch-1-1", afterFail.chapterId)
    assertEquals("Retry Lesson 1", afterFail.ctaLabel)

    // 5. Passing Lesson 1 check (2/3) advances to Lesson 2
    state = ProgressEngine.recordQuizResult(state, "ch-1-1", 2, 3, 25, day1, 2).updatedProgress
    val afterPass1 = ProgressEngine.nextLearningAction(state, curriculum) as NextLearningAction.OpenLesson
    assertEquals("ch-1-2", afterPass1.chapterId)
    assertEquals("Continue Lesson", afterPass1.ctaLabel)
    val stepAfter1 = ProgressEngine.nextStepAfterChapter("ch-1-1", state, curriculum) as NextStepAfterChapter.NextLesson
    assertEquals("ch-1-2", stepAfter1.chapter.id)

    // 6. Passing Lesson 2 (last chapter of Unit 1) routes straight into Unit 1 Mastery Check!
    state = ProgressEngine.recordQuizResult(state, "ch-1-2", 3, 3, 25, day1, 3).updatedProgress
    val unit1Status = ProgressEngine.unitMasteryStatus(state, curriculum.modules[0])
    assertTrue(unit1Status.allLessonsMastered)
    assertTrue(unit1Status.isMasteryCheckReady)
    assertFalse(unit1Status.isUnitMastered)

    val stepAfterUnit1Last = ProgressEngine.nextStepAfterChapter("ch-1-2", state, curriculum) as NextStepAfterChapter.UnitMasteryCheck
    assertEquals("mod-1", stepAfterUnit1Last.module.id)

    val mcAction = ProgressEngine.nextLearningAction(state, curriculum) as NextLearningAction.OpenUnitMasteryCheck
    assertEquals("mod-1", mcAction.moduleId)
    assertEquals("Take Unit 1 Mastery Check", mcAction.ctaLabel)
    assertEquals("A1", mcAction.unlocksCefrCode)

    // 7. Failing Unit 1 Mastery Check keeps Unit 1 Mastery Check as the next action
    state = ProgressEngine.recordMasteryCheckResult(state, curriculum.modules[0], 2, 4, curriculum, day1).updatedProgress
    assertTrue(ProgressEngine.nextLearningAction(state, curriculum) is NextLearningAction.OpenUnitMasteryCheck)

    // 8. Passing Unit 1 Mastery Check advances directly to Unit 2, Lesson 1
    state = ProgressEngine.recordMasteryCheckResult(state, curriculum.modules[0], 3, 4, curriculum, day1).updatedProgress
    val unit2Action = ProgressEngine.nextLearningAction(state, curriculum) as NextLearningAction.OpenLesson
    assertEquals("ch-2-1", unit2Action.chapterId)
    assertEquals("mod-2", unit2Action.moduleId)

    // 9. Mastering Unit 2 lessons + Unit 2 Mastery Check reaches AllMastered
    state = ProgressEngine.recordQuizResult(state, "ch-2-1", 3, 3, 25, day1, 3).updatedProgress
    state = ProgressEngine.recordQuizResult(state, "ch-2-2", 3, 3, 25, day1, 3).updatedProgress
    state = ProgressEngine.recordMasteryCheckResult(state, curriculum.modules[1], 4, 4, curriculum, day1).updatedProgress
    val doneAction = ProgressEngine.nextLearningAction(state, curriculum)
    assertTrue(doneAction is NextLearningAction.AllMastered)
  }

  @Test
  fun legacyZeroScoreQuizRecord_isNotTreatedAsMastered() {
    val curriculum = sampleCurriculum(moduleCount = 1, chaptersPerModule = 1)
    val chapter = curriculum.modules[0].chapters[0]
    // Simulates a v1.1.0 record where a 0/3 failure was erroneously saved in completedQuizChapterIds
    val legacyExploitedState = UserProgress(
      completedChapterIds = setOf(chapter.id),
      completedQuizChapterIds = setOf(chapter.id),
      quizBestScores = mapOf(chapter.id to 0),
    )
    assertFalse(ProgressEngine.isChapterMastered(legacyExploitedState, chapter))

    // Valid v1.1.0 record with 3/3 score remains mastered
    val legacyValidState = legacyExploitedState.copy(quizBestScores = mapOf(chapter.id to 3))
    assertTrue(ProgressEngine.isChapterMastered(legacyValidState, chapter))
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
  fun onboardingBookmarksAppearanceAndChapterNavigation_workAccurately() {
    val curriculum = sampleCurriculum(moduleCount = 2, chaptersPerModule = 2)
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

    assertNull(ProgressEngine.previousChapterBefore("ch-1-1", curriculum))
    assertEquals("ch-1-2", ProgressEngine.nextChapterAfter("ch-1-1", curriculum)?.id)
    assertEquals("ch-2-1", ProgressEngine.nextChapterAfter("ch-1-2", curriculum)?.id)
    assertEquals("ch-2-2", ProgressEngine.nextChapterAfter("ch-2-1", curriculum)?.id)
    assertNull(ProgressEngine.nextChapterAfter("ch-2-2", curriculum))
  }
}
