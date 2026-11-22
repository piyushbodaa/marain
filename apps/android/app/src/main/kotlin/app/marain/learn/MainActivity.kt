package app.marain.learn

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import app.marain.learn.ui.MarainApp
import app.marain.learn.ui.MarainViewModel
import app.marain.learn.ui.theme.MarainTheme

class MainActivity : ComponentActivity() {
  private val viewModel: MarainViewModel by viewModels()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    enableEdgeToEdge()
    setContent {
      val progress by viewModel.progress.collectAsStateWithLifecycle()
      MarainTheme(
        readingTheme = progress.readingTheme,
        fontScale = progress.fontScale,
      ) {
        Surface(
          modifier = Modifier.fillMaxSize(),
          color = MaterialTheme.colorScheme.background,
        ) {
          MarainApp(
            curriculum = viewModel.curriculum,
            progress = progress,
            todayEpochDay = viewModel.todayEpochDay(),
            onCompleteOnboarding = viewModel::onCompleteOnboarding,
            onReplayOnboarding = viewModel::onReplayOnboarding,
            onChapterOpened = viewModel::onChapterOpened,
            onMarkChapterRead = viewModel::onMarkChapterRead,
            onQuizCompleted = viewModel::onQuizCompleted,
            onMarkPhraseMastered = viewModel::onMarkPhraseMastered,
            onToggleBookmark = viewModel::onToggleBookmark,
            onSelectReadingTheme = viewModel::onSelectReadingTheme,
            onSelectFontScale = viewModel::onSelectFontScale,
          )
        }
      }
    }
  }
}
