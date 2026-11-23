package app.marain.learn.ui.screens

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import app.marain.learn.data.MasteryCheckOutcome
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Analogy
import app.marain.learn.data.model.Callout
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.ChapterSection
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.data.model.GlossaryTerm
import app.marain.learn.data.model.MasteryCheck
import app.marain.learn.data.model.QuizQuestion
import app.marain.learn.ui.theme.MarainTheme

private const val PREVIEW_TODAY = 20_500L

private fun previewCurriculum(): Curriculum {
  val unit1Chapters = listOf(
    Chapter(
      id = "ch-1-1",
      moduleId = "mod-1-what-is-ai",
      number = 1,
      title = "Prediction, Not Magic",
      readMinutes = 1,
      xpReward = 25,
      summary = "Why modern AI predicts likely next tokens instead of consulting a database of verified facts.",
      analogy = Analogy(
        title = "A Fast Pattern-Completer",
        body = "Imagine an assistant who has read millions of manuals and finishes your sentence based on what usually fits next — not by checking a live encyclopedia.",
      ),
      sections = listOf(
        ChapterSection(
          heading = "How an LLM writes a reply",
          body = "A **Large Language Model (LLM)** generates text one piece (`token`) at a time. At every step it scores what is most plausible given your prompt.",
          callout = Callout(
            type = "myth",
            title = "Confidence is not accuracy",
            body = "A smooth, authoritative answer only means the words fit a familiar pattern. Always verify high-stakes facts or numbers.",
          ),
        ),
        ChapterSection(
          heading = "When to trust, when to verify",
          body = "Use AI for drafting, summarizing, and brainstorming. Verify dates, legal clauses, medical claims, and exact citations against primary sources.",
          callout = Callout(
            type = "tip",
            title = "Give concrete context",
            body = "Paste the exact source paragraph or constraints you want checked instead of asking open-ended trivia from memory.",
          ),
        ),
      ),
      keyTakeaways = listOf(
        "LLMs predict plausible next tokens rather than looking up guaranteed truths.",
        "Polished phrasing does not guarantee factual accuracy.",
        "Providing source text sharply reduces guesswork.",
      ),
      glossaryTermIds = listOf("llm", "token", "hallucination"),
      relatedLabId = null,
      quiz = listOf(
        QuizQuestion(
          id = "q-1-1-1",
          type = "multiple_choice",
          question = "You ask an AI for a specific court ruling from last year and it replies with a clean case citation. What is the safest first step?",
          options = listOf(
            "Verify the case name and ruling in an official legal database",
            "Trust it because the case number format looks standard",
            "Ask the same chat once more and accept it if it agrees",
            "Assume the model searched the live court archive automatically",
          ),
          correctIndex = 0,
          explanation = "Because LLMs predict plausible text patterns, fabricated citations often look completely formatted. Always check primary sources.",
        ),
      ),
    ),
    Chapter(
      id = "ch-1-2",
      moduleId = "mod-1-what-is-ai",
      number = 2,
      title = "Why AI Hallucinates",
      readMinutes = 2,
      xpReward = 25,
      summary = "How gap-filling causes confident mistakes and how to catch them on the spot.",
      analogy = Analogy(title = "Improv Partner", body = "When stuck, an improv actor invents a plausible line rather than stopping the scene."),
      sections = listOf(ChapterSection(heading = "Plausible over factual", body = "Models optimize for fluent continuations.")),
      keyTakeaways = listOf("Verify specific names, quotes, and numbers."),
      glossaryTermIds = listOf("hallucination"),
      relatedLabId = null,
      quiz = listOf(
        QuizQuestion(
          id = "q-1-2-1",
          type = "true_false",
          question = "Asking an AI 'Are you sure?' reliably fixes hallucinations.",
          options = listOf("True", "False"),
          correctIndex = 1,
          explanation = "Models can double down or flip arbitrarily without an external source.",
        ),
      ),
    ),
    Chapter(
      id = "ch-1-3",
      moduleId = "mod-1-what-is-ai",
      number = 3,
      title = "Context Beats Clever Tricks",
      readMinutes = 1,
      xpReward = 25,
      summary = "Give clear goal, audience, and constraints instead of magic prompt formulas.",
      analogy = Analogy(title = "Clear Design Brief", body = "A sharp brief beats vague wishes every time."),
      sections = listOf(ChapterSection(heading = "State the constraints", body = "Name audience, tone, and format up front.")),
      keyTakeaways = listOf("Specific context beats secret prompt hacks."),
      glossaryTermIds = listOf("prompt"),
      relatedLabId = null,
      quiz = listOf(
        QuizQuestion(
          id = "q-1-3-1",
          type = "multiple_choice",
          question = "Which prompt yields a more reliable draft?",
          options = listOf(
            "State audience, key facts, and length limit",
            "Add 'think extra hard' without details",
            "Use all caps so the model prioritizes accuracy",
            "Keep the prompt to three vague words",
          ),
          correctIndex = 0,
          explanation = "Concrete facts and constraints narrow the prediction space.",
        ),
      ),
    ),
    Chapter(
      id = "ch-1-4",
      moduleId = "mod-1-what-is-ai",
      number = 4,
      title = "Choosing the Right Workflow",
      readMinutes = 1,
      xpReward = 25,
      summary = "Know when AI shines and when a calculator or search engine is better.",
      analogy = Analogy(title = "Right Tool on the Bench", body = "You don't use a paintbrush to tighten a bolt."),
      sections = listOf(ChapterSection(heading = "Match tool to task", body = "Use AI for synthesis and drafts, deterministic tools for exact math.")),
      keyTakeaways = listOf("Pair AI with deterministic checks for critical work."),
      glossaryTermIds = listOf("llm"),
      relatedLabId = null,
      quiz = listOf(
        QuizQuestion(
          id = "q-1-4-1",
          type = "multiple_choice",
          question = "Which task is safest to delegate to an LLM first?",
          options = listOf(
            "Summarizing meeting notes you paste in",
            "Calculating final tax liability without verification",
            "Generating legal filings with unverified case law",
            "Storing raw production passwords in chat history",
          ),
          correctIndex = 0,
          explanation = "Summarizing pasted source text is grounded in what you supplied.",
        ),
      ),
    ),
  )

  val unit1Mastery = MasteryCheck(
    id = "mc-1-what-is-ai",
    title = "Unit 1 Mastery Check",
    subtitle = "4 practical scenarios proving you understand prediction, hallucinations, and context.",
    passThreshold = 0.75,
    xpReward = 40,
    estimatedMinutes = 2,
    questions = listOf(
      QuizQuestion(
        id = "mc-1-q1",
        type = "multiple_choice",
        question = "A teammate pastes a confident AI-generated summary of a 2026 policy change without attaching the policy PDF. What is the biggest risk?",
        options = listOf(
          "The model may have filled gaps with plausible-sounding details",
          "The summary will always be shorter than the original document",
          "AI models refuse to summarize dates after 2024",
          "The tone will be too informal for an internal memo",
        ),
        correctIndex = 0,
        explanation = "Without source text in context, LLMs predict plausible phrasing rather than checking an authoritative record.",
      ),
      QuizQuestion(
        id = "mc-1-q2",
        type = "multiple_choice",
        question = "Which change most improves an AI answer about your company's refund rules?",
        options = listOf(
          "Paste the exact refund policy text into the prompt",
          "Ask the model to promise not to make mistakes",
          "Rephrase the question in shorter fragments",
          "Start a new chat and ask the identical prompt twice",
        ),
        correctIndex = 0,
        explanation = "Grounding the model with the actual policy text gives it verified facts to work from.",
      ),
      QuizQuestion(
        id = "mc-1-q3",
        type = "multiple_choice",
        question = "Why does an LLM sometimes invent a realistic-looking book title or URL?",
        options = listOf(
          "It predicts likely word patterns rather than retrieving verified entries",
          "It deliberately hides sources to conserve memory",
          "Its internet browser timed out midway through loading",
          "The user forgot to include polite phrasing",
        ),
        correctIndex = 0,
        explanation = "Next-token prediction produces fluent formats even when no real source backs them.",
      ),
      QuizQuestion(
        id = "mc-1-q4",
        type = "multiple_choice",
        question = "You need exact quarterly totals from a 400-row expense sheet. What is the best workflow?",
        options = listOf(
          "Compute totals with spreadsheet formulas, then use AI to draft the narrative",
          "Paste raw numbers into chat and trust the mental math",
          "Ask AI to estimate totals from the first ten rows",
          "Have AI rewrite the rows before summing them by hand",
        ),
        correctIndex = 0,
        explanation = "Use deterministic tools for exact arithmetic and LLMs for synthesis and clear writing.",
      ),
    ),
  )

  val unit1 = CurriculumModule(
    id = "mod-1-what-is-ai",
    number = 1,
    title = "How AI Actually Works",
    subtitle = "Prediction, hallucinations, and clear context — 5 min phone-only",
    icon = "brain",
    accentHex = "#1B4D3E",
    estimatedMinutes = 5,
    recommendedLabId = null,
    chapters = unit1Chapters,
    masteryCheck = unit1Mastery,
  )

  val unit2 = CurriculumModule(
    id = "mod-2-tokens-context",
    number = 2,
    title = "Tokens & Context Windows",
    subtitle = "Working memory, chunking, and why long chats drift",
    icon = "token",
    accentHex = "#1E40AF",
    estimatedMinutes = 12,
    recommendedLabId = null,
    chapters = listOf(
      unit1Chapters.first().copy(
        id = "ch-2-1",
        moduleId = "mod-2-tokens-context",
        number = 1,
        title = "What Is a Token?",
        readMinutes = 3,
      ),
    ),
    masteryCheck = unit1Mastery.copy(id = "mc-2-tokens", title = "Unit 2 Mastery Check"),
  )

  return Curriculum(
    version = "2.0.0",
    appName = "Marain",
    tagline = "The Language of AI",
    modules = listOf(unit1, unit2),
    glossary = listOf(
      GlossaryTerm(
        id = "llm",
        term = "LLM",
        shortDef = "Large Language Model — a neural network trained to predict likely next tokens.",
        analogy = "A voracious reader predicting the most helpful continuation.",
        category = "foundations",
        example = "Claude and GPT are LLMs.",
      ),
      GlossaryTerm(
        id = "token",
        term = "Token",
        shortDef = "A small chunk of text (roughly ¾ of an English word) that models read and write.",
        analogy = "Syllable tiles in a word game.",
        category = "tokens",
        example = "1,000 words is roughly 1,300 tokens.",
      ),
      GlossaryTerm(
        id = "hallucination",
        term = "Hallucination",
        shortDef = "Fluent, confident output that is factually wrong or fabricated.",
        analogy = "An improv actor filling a blank with a believable invention.",
        category = "foundations",
        example = "Inventing a realistic citation for a paper that does not exist.",
      ),
      GlossaryTerm(
        id = "prompt",
        term = "Prompt",
        shortDef = "The instructions and context you send to an AI model.",
        analogy = "The brief you hand a collaborator before they begin.",
        category = "foundations",
        example = "Summarize these notes in three bullets for our design review.",
      ),
    ),
    labs = emptyList(),
  )
}

private fun previewProgressReadyForMastery(theme: ReadingTheme): UserProgress = UserProgress(
  completedChapterIds = setOf("ch-1-1", "ch-1-2", "ch-1-3", "ch-1-4"),
  completedQuizChapterIds = setOf("ch-1-1", "ch-1-2", "ch-1-3", "ch-1-4"),
  quizBestScores = mapOf("ch-1-1" to 1, "ch-1-2" to 1, "ch-1-3" to 1, "ch-1-4" to 1),
  quizBestPercents = mapOf("ch-1-1" to 100, "ch-1-2" to 100, "ch-1-3" to 100, "ch-1-4" to 100),
  attemptedQuizChapterIds = setOf("ch-1-1", "ch-1-2", "ch-1-3", "ch-1-4"),
  quizTotalAnswered = 12,
  quizTotalCorrect = 11,
  totalXp = 145,
  dailyXpEarned = 35,
  dailyXpEpochDay = PREVIEW_TODAY,
  currentStreakDays = 3,
  longestStreakDays = 5,
  lastActivityEpochDay = PREVIEW_TODAY,
  bestQuizCombo = 4,
  masteredPhraseIds = setOf("llm", "token"),
  hasCompletedOnboarding = true,
  readingTheme = theme,
)

private fun previewProgressFresh(theme: ReadingTheme): UserProgress = UserProgress(
  hasCompletedOnboarding = true,
  readingTheme = theme,
)

@Preview(name = "Path - Dark (Hero Start CTA)", widthDp = 412, heightDp = 892, showBackground = true)
@Composable
fun PathScreenDarkPreview() {
  val curriculum = previewCurriculum()
  MarainTheme(readingTheme = ReadingTheme.DARK) {
    Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
      PathScreen(
        curriculum = curriculum,
        progress = previewProgressFresh(ReadingTheme.DARK),
        todayEpochDay = PREVIEW_TODAY,
        onOpenGuidebook = {},
        onOpenChapter = {},
        onOpenMasteryCheck = {},
        onOpenProgress = {},
      )
    }
  }
}

@Preview(name = "Path - Light (Mastery Ready CTA)", widthDp = 412, heightDp = 892, showBackground = true)
@Composable
fun PathScreenLightPreview() {
  val curriculum = previewCurriculum()
  MarainTheme(readingTheme = ReadingTheme.LIGHT) {
    Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
      PathScreen(
        curriculum = curriculum,
        progress = previewProgressReadyForMastery(ReadingTheme.LIGHT),
        todayEpochDay = PREVIEW_TODAY,
        onOpenGuidebook = {},
        onOpenChapter = {},
        onOpenMasteryCheck = {},
        onOpenProgress = {},
      )
    }
  }
}

@Preview(name = "Unit 1 Lesson - Dark", widthDp = 412, heightDp = 892, showBackground = true)
@Composable
fun ChapterReaderDarkPreview() {
  val curriculum = previewCurriculum()
  val module = curriculum.modules.first()
  val chapter = module.chapters.first()
  MarainTheme(readingTheme = ReadingTheme.DARK) {
    ChapterReaderScreen(
      curriculum = curriculum,
      module = module,
      chapter = chapter,
      progress = previewProgressFresh(ReadingTheme.DARK),
      onBack = {},
      onChapterOpened = {},
      onMarkChapterRead = {},
      onToggleBookmark = {},
      onStartQuiz = {},
      onStartMasteryCheck = {},
      onNavigateToChapter = {},
      onSelectReadingTheme = {},
      onSelectFontScale = {},
    )
  }
}

@Preview(name = "Unit 1 Lesson - Light", widthDp = 412, heightDp = 892, showBackground = true)
@Composable
fun ChapterReaderLightPreview() {
  val curriculum = previewCurriculum()
  val module = curriculum.modules.first()
  val chapter = module.chapters.first()
  MarainTheme(readingTheme = ReadingTheme.LIGHT) {
    ChapterReaderScreen(
      curriculum = curriculum,
      module = module,
      chapter = chapter,
      progress = previewProgressFresh(ReadingTheme.LIGHT),
      onBack = {},
      onChapterOpened = {},
      onMarkChapterRead = {},
      onToggleBookmark = {},
      onStartQuiz = {},
      onStartMasteryCheck = {},
      onNavigateToChapter = {},
      onSelectReadingTheme = {},
      onSelectFontScale = {},
    )
  }
}

@Preview(name = "Mastery Check Question - Dark", widthDp = 412, heightDp = 892, showBackground = true)
@Composable
fun MasteryCheckDarkPreview() {
  val curriculum = previewCurriculum()
  val module = curriculum.modules.first()
  MarainTheme(readingTheme = ReadingTheme.DARK) {
    MasteryCheckScreen(
      curriculum = curriculum,
      module = module,
      onClose = {},
      onCompleteMasteryCheck = { c, t ->
        ProgressEngine.recordMasteryCheckResult(
          state = previewProgressReadyForMastery(ReadingTheme.DARK),
          module = module,
          correctCount = c,
          totalQuestions = t,
          curriculum = curriculum,
          todayEpochDay = PREVIEW_TODAY,
        )
      },
      onContinueToNextLesson = {},
      onReviewModule = {},
      onOpenProgress = {},
    )
  }
}

@Preview(name = "Mastery Check Passed A1 - Dark", widthDp = 412, heightDp = 892, showBackground = true)
@Composable
fun MasteryCheckPassedDarkPreview() {
  val curriculum = previewCurriculum()
  val module = curriculum.modules.first()
  val passedOutcome: MasteryCheckOutcome = ProgressEngine.recordMasteryCheckResult(
    state = previewProgressReadyForMastery(ReadingTheme.DARK),
    module = module,
    correctCount = 4,
    totalQuestions = 4,
    curriculum = curriculum,
    todayEpochDay = PREVIEW_TODAY,
  )
  MarainTheme(readingTheme = ReadingTheme.DARK) {
    MasteryCheckScreen(
      curriculum = curriculum,
      module = module,
      onClose = {},
      onCompleteMasteryCheck = { _, _ -> passedOutcome },
      onContinueToNextLesson = {},
      onReviewModule = {},
      onOpenProgress = {},
      initialOutcome = passedOutcome,
    )
  }
}

@Preview(name = "Progress - Dark (Mastery vs Practice XP)", widthDp = 412, heightDp = 892, showBackground = true)
@Composable
fun ProgressScreenDarkPreview() {
  val curriculum = previewCurriculum()
  MarainTheme(readingTheme = ReadingTheme.DARK) {
    Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
      ProgressScreen(
        curriculum = curriculum,
        progress = previewProgressReadyForMastery(ReadingTheme.DARK),
        todayEpochDay = PREVIEW_TODAY,
        onSelectReadingTheme = {},
        onSelectFontScale = {},
        onReplayIntroStory = {},
        onOpenPrivacyPolicy = {},
        onOpenUnitGuidebook = {},
        onOpenMasteryCheck = {},
      )
    }
  }
}

@Preview(name = "Progress - Light (A1 Unlocked)", widthDp = 412, heightDp = 892, showBackground = true)
@Composable
fun ProgressScreenLightPreview() {
  val curriculum = previewCurriculum()
  val masteredProgress = previewProgressReadyForMastery(ReadingTheme.LIGHT).copy(
    passedMasteryModuleIds = setOf("mod-1-what-is-ai"),
    masteryBestScores = mapOf("mod-1-what-is-ai" to 4),
    masteryBestPercents = mapOf("mod-1-what-is-ai" to 100),
  )
  MarainTheme(readingTheme = ReadingTheme.LIGHT) {
    Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
      ProgressScreen(
        curriculum = curriculum,
        progress = masteredProgress,
        todayEpochDay = PREVIEW_TODAY,
        onSelectReadingTheme = {},
        onSelectFontScale = {},
        onReplayIntroStory = {},
        onOpenPrivacyPolicy = {},
        onOpenUnitGuidebook = {},
        onOpenMasteryCheck = {},
      )
    }
  }
}
