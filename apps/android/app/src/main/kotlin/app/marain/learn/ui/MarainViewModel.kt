package app.marain.learn.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import app.marain.learn.data.CurriculumRepository
import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.PhraseMasteryOutcome
import app.marain.learn.data.ProgressRepository
import app.marain.learn.data.QuizCompletionOutcome
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Curriculum
import kotlinx.coroutines.flow.StateFlow

class MarainViewModel(application: Application) : AndroidViewModel(application) {
  private val curriculumRepository = CurriculumRepository(application.applicationContext)
  private val progressRepository = ProgressRepository(application.applicationContext)

  val curriculum: Curriculum = curriculumRepository.loadCurriculum()
  val progress: StateFlow<UserProgress> = progressRepository.progress

  fun todayEpochDay(): Long = progressRepository.currentEpochDay()

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
