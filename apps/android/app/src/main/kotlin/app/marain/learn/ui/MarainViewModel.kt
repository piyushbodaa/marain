package app.marain.learn.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import app.marain.learn.data.CurriculumRepository
import app.marain.learn.data.FluencyRankProgress
import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.MasteryCheckOutcome
import app.marain.learn.data.NextLearningAction
import app.marain.learn.data.PhraseMasteryOutcome
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.ProgressRepository
import app.marain.learn.data.QuizCompletionOutcome
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UnitMasteryStatus
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Curriculum
import kotlinx.coroutines.flow.StateFlow

class MarainViewModel(application: Application) : AndroidViewModel(application) {
  private val curriculumRepository = CurriculumRepository(application.applicationContext)
  private val progressRepository = ProgressRepository(application.applicationContext)

  val curriculum: Curriculum = curriculumRepository.loadCurriculum()
  val progress: StateFlow<UserProgress> = progressRepository.progress

  fun todayEpochDay(): Long = progressRepository.currentEpochDay()

  fun fluencyRank(state: UserProgress = progress.value): FluencyRankProgress =
    ProgressEngine.fluencyRank(state, curriculum)

  fun nextLearningAction(state: UserProgress = progress.value): NextLearningAction? =
    ProgressEngine.nextLearningAction(state, curriculum)

  fun firstLessonChapterId(): String? =
    ProgressEngine.firstLessonChapterId(curriculum)

  fun unitMasteryStatus(moduleId: String, state: UserProgress = progress.value): UnitMasteryStatus? =
    curriculum.findModule(moduleId)?.let { ProgressEngine.unitMasteryStatus(state, it) }

  fun onCompleteOnboarding() {
    progressRepository.completeOnboarding()
  }

  fun onReplayOnboarding() {
    progressRepository.resetOnboarding()
  }

  fun onChapterOpened(chapterId: String) {
    progressRepository.markChapterOpened(chapterId)
  }

  fun onMarkChapterRead(chapterId: String) {
    progressRepository.markChapterRead(chapterId)
  }

  fun onQuizCompleted(
    chapterId: String,
    correctCount: Int,
    totalQuestions: Int,
    chapterXpReward: Int,
    maxCombo: Int,
  ): QuizCompletionOutcome = progressRepository.recordQuizResult(
    chapterId = chapterId,
    correctCount = correctCount,
    totalQuestions = totalQuestions,
    chapterXpReward = chapterXpReward,
    maxCombo = maxCombo,
  )

  fun onMasteryCheckCompleted(
    moduleId: String,
    correctCount: Int,
    totalQuestions: Int,
  ): MasteryCheckOutcome {
    val module = requireNotNull(curriculum.findModule(moduleId)) {
      "Unknown curriculum moduleId: $moduleId"
    }
    return progressRepository.recordMasteryCheckResult(
      module = module,
      correctCount = correctCount,
      totalQuestions = totalQuestions,
      curriculum = curriculum,
    )
  }

  fun onMarkPhraseMastered(termId: String): PhraseMasteryOutcome =
    progressRepository.markPhraseMastered(termId)

  fun onToggleBookmark(chapterId: String) {
    progressRepository.toggleBookmark(chapterId)
  }

  fun onSelectReadingTheme(theme: ReadingTheme) {
    progressRepository.setReadingTheme(theme)
  }

  fun onSelectFontScale(scale: FontScaleOption) {
    progressRepository.setFontScale(scale)
  }
}
