package app.marain.learn.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoStories
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.EmojiEvents
import androidx.compose.material.icons.rounded.Explore
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.MasteryCheckOutcome
import app.marain.learn.data.PhraseMasteryOutcome
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.QuizCompletionOutcome
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Curriculum
import app.marain.learn.ui.screens.ChapterQuizScreen
import app.marain.learn.ui.screens.ChapterReaderScreen
import app.marain.learn.ui.screens.MasteryCheckScreen
import app.marain.learn.ui.screens.ModuleDetailScreen
import app.marain.learn.ui.screens.PathScreen
import app.marain.learn.ui.screens.PhrasebookScreen
import app.marain.learn.ui.screens.PrivacyPolicyScreen
import app.marain.learn.ui.screens.ProgressScreen
import app.marain.learn.ui.screens.SavedScreen
import app.marain.learn.ui.screens.WelcomeStoryScreen
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily

enum class TopTab(val label: String, val icon: ImageVector) {
  PATH("Path", Icons.Rounded.Explore),
  PHRASEBOOK("Phrasebook", Icons.Rounded.AutoStories),
  SAVED("Saved", Icons.Rounded.Bookmark),
  PROGRESS("Progress", Icons.Rounded.EmojiEvents),
}

sealed interface DetailRoute {
  data class ModuleDetail(val moduleId: String) : DetailRoute
  data class ChapterReader(val chapterId: String) : DetailRoute
  data class ChapterQuiz(val chapterId: String) : DetailRoute
  data class UnitMasteryCheck(val moduleId: String) : DetailRoute
  data object PrivacyPolicy : DetailRoute
}

@Composable
fun MarainApp(
  curriculum: Curriculum,
  progress: UserProgress,
  todayEpochDay: Long,
  onCompleteOnboarding: () -> Unit,
  onReplayOnboarding: () -> Unit,
  onChapterOpened: (String) -> Unit,
  onMarkChapterRead: (String) -> Unit,
  onQuizCompleted: (chapterId: String, correct: Int, total: Int, xpReward: Int, maxCombo: Int) -> QuizCompletionOutcome,
  onMasteryCheckCompleted: (moduleId: String, correct: Int, total: Int) -> MasteryCheckOutcome,
  onMarkPhraseMastered: (String) -> PhraseMasteryOutcome,
  onToggleBookmark: (String) -> Unit,
  onSelectReadingTheme: (ReadingTheme) -> Unit,
  onSelectFontScale: (FontScaleOption) -> Unit,
  modifier: Modifier = Modifier,
) {
  var activeTab by rememberSaveable { mutableStateOf(TopTab.PATH) }
  var hasAutoLaunchedFirstLesson by rememberSaveable { mutableStateOf(false) }
  val backStack = remember { mutableStateListOf<DetailRoute>() }

  // Direct-to-Lesson-1 launch for fresh learners (once per fresh session, never traps Back)
  LaunchedEffect(progress.hasCompletedOnboarding) {
    if (
      progress.hasCompletedOnboarding &&
      !hasAutoLaunchedFirstLesson &&
      backStack.isEmpty() &&
      ProgressEngine.shouldAutoLaunchFirstLesson(progress)
    ) {
      val firstLessonId = ProgressEngine.firstLessonChapterId(curriculum)
      if (firstLessonId != null) {
        hasAutoLaunchedFirstLesson = true
        backStack.add(DetailRoute.ChapterReader(firstLessonId))
      }
    }
  }

  if (!progress.hasCompletedOnboarding) {
    WelcomeStoryScreen(
      onFinish = {
        val shouldStartFirstLesson = ProgressEngine.shouldAutoLaunchFirstLesson(progress)
        val firstLessonId = ProgressEngine.firstLessonChapterId(curriculum)
        if (shouldStartFirstLesson && firstLessonId != null) {
          hasAutoLaunchedFirstLesson = true
          backStack.clear()
          backStack.add(DetailRoute.ChapterReader(firstLessonId))
        }
        onCompleteOnboarding()
      },
      modifier = modifier,
    )
    return
  }

  fun popBack() {
    if (backStack.isNotEmpty()) {
      backStack.removeAt(backStack.lastIndex)
    } else if (activeTab != TopTab.PATH) {
      activeTab = TopTab.PATH
    }
  }

  fun openChapterDirectly(chapterId: String) {
    backStack.add(DetailRoute.ChapterReader(chapterId))
  }

  fun openMasteryCheckDirectly(moduleId: String) {
    backStack.add(DetailRoute.UnitMasteryCheck(moduleId))
  }

  BackHandler(enabled = backStack.isNotEmpty() || activeTab != TopTab.PATH) {
    popBack()
  }

  val currentDetail = backStack.lastOrNull()

  if (currentDetail != null) {
    when (currentDetail) {
      is DetailRoute.ModuleDetail -> {
        val module = curriculum.findModule(currentDetail.moduleId)
        if (module != null) {
          ModuleDetailScreen(
            module = module,
            progress = progress,
            onBack = { popBack() },
            onOpenChapter = { chapterId ->
              openChapterDirectly(chapterId)
            },
            onStartMasteryCheck = { moduleId ->
              openMasteryCheckDirectly(moduleId)
            },
            onToggleBookmark = onToggleBookmark,
            modifier = modifier,
          )
        } else {
          popBack()
        }
      }

      is DetailRoute.ChapterReader -> {
        val chapter = curriculum.findChapter(currentDetail.chapterId)
        val module = chapter?.let { curriculum.findModule(it.moduleId) }
        if (chapter != null && module != null) {
          ChapterReaderScreen(
            curriculum = curriculum,
            module = module,
            chapter = chapter,
            progress = progress,
            onBack = { popBack() },
            onChapterOpened = onChapterOpened,
            onMarkChapterRead = onMarkChapterRead,
            onToggleBookmark = onToggleBookmark,
            onStartQuiz = { chapterId ->
              backStack.add(DetailRoute.ChapterQuiz(chapterId))
            },
            onStartMasteryCheck = { moduleId ->
              backStack.add(DetailRoute.UnitMasteryCheck(moduleId))
            },
            onNavigateToChapter = { targetChapterId ->
              backStack[backStack.lastIndex] = DetailRoute.ChapterReader(targetChapterId)
            },
            onSelectReadingTheme = onSelectReadingTheme,
            onSelectFontScale = onSelectFontScale,
            modifier = modifier,
          )
        } else {
          popBack()
        }
      }

      is DetailRoute.ChapterQuiz -> {
        val chapter = curriculum.findChapter(currentDetail.chapterId)
        if (chapter != null) {
          ChapterQuizScreen(
            curriculum = curriculum,
            chapter = chapter,
            onClose = { popBack() },
            onCompleteQuiz = { correct, total, maxCombo ->
              onQuizCompleted(chapter.id, correct, total, chapter.xpReward, maxCombo)
            },
            onNextChapter = { nextChapterId ->
              backStack.removeAt(backStack.lastIndex)
              if (backStack.lastOrNull() is DetailRoute.ChapterReader) {
                backStack[backStack.lastIndex] = DetailRoute.ChapterReader(nextChapterId)
              } else {
                backStack.add(DetailRoute.ChapterReader(nextChapterId))
              }
            },
            onStartMasteryCheck = { moduleId ->
              backStack.removeAt(backStack.lastIndex)
              if (backStack.lastOrNull() is DetailRoute.ChapterReader) {
                backStack.removeAt(backStack.lastIndex)
              }
              backStack.add(DetailRoute.UnitMasteryCheck(moduleId))
            },
            onBackToPath = {
              backStack.clear()
              activeTab = TopTab.PATH
            },
            modifier = modifier,
          )
        } else {
          popBack()
        }
      }

      is DetailRoute.UnitMasteryCheck -> {
        val module = curriculum.findModule(currentDetail.moduleId)
        if (module != null && module.masteryCheck != null) {
          MasteryCheckScreen(
            curriculum = curriculum,
            module = module,
            onClose = { popBack() },
            onCompleteMasteryCheck = { correct, total ->
              onMasteryCheckCompleted(module.id, correct, total)
            },
            onContinueToNextLesson = { nextChapterId ->
              backStack.clear()
              backStack.add(DetailRoute.ChapterReader(nextChapterId))
            },
            onReviewModule = { moduleId ->
              backStack.clear()
              backStack.add(DetailRoute.ModuleDetail(moduleId))
            },
            onOpenProgress = {
              backStack.clear()
              activeTab = TopTab.PROGRESS
            },
            modifier = modifier,
          )
        } else {
          popBack()
        }
      }

      is DetailRoute.PrivacyPolicy -> {
        PrivacyPolicyScreen(
          onBack = { popBack() },
          modifier = modifier,
        )
      }
    }
    return
  }

  Scaffold(
    modifier = modifier.fillMaxSize(),
    containerColor = MaterialTheme.colorScheme.background,
    bottomBar = {
      MarainHairlineBottomBar(
        activeTab = activeTab,
        onSelectTab = { activeTab = it },
      )
    },
  ) { innerPadding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding),
    ) {
      when (activeTab) {
        TopTab.PATH -> PathScreen(
          curriculum = curriculum,
          progress = progress,
          todayEpochDay = todayEpochDay,
          onOpenGuidebook = { moduleId ->
            backStack.add(DetailRoute.ModuleDetail(moduleId))
          },
          onOpenChapter = { chapterId ->
            openChapterDirectly(chapterId)
          },
          onOpenMasteryCheck = { moduleId ->
            openMasteryCheckDirectly(moduleId)
          },
          onOpenProgress = {
            activeTab = TopTab.PROGRESS
          },
        )

        TopTab.PHRASEBOOK -> PhrasebookScreen(
          glossary = curriculum.glossary,
          masteredPhraseIds = progress.masteredPhraseIds,
          onMarkPhraseMastered = onMarkPhraseMastered,
        )

        TopTab.SAVED -> SavedScreen(
          curriculum = curriculum,
          progress = progress,
          onOpenChapter = { chapterId ->
            openChapterDirectly(chapterId)
          },
          onToggleBookmark = onToggleBookmark,
          onBrowseModules = { activeTab = TopTab.PATH },
          onOpenPrivacyPolicy = { backStack.add(DetailRoute.PrivacyPolicy) },
        )

        TopTab.PROGRESS -> ProgressScreen(
          curriculum = curriculum,
          progress = progress,
          todayEpochDay = todayEpochDay,
          onSelectReadingTheme = onSelectReadingTheme,
          onSelectFontScale = onSelectFontScale,
          onReplayIntroStory = onReplayOnboarding,
          onOpenPrivacyPolicy = { backStack.add(DetailRoute.PrivacyPolicy) },
          onOpenUnitGuidebook = { moduleId ->
            backStack.add(DetailRoute.ModuleDetail(moduleId))
          },
          onOpenMasteryCheck = { moduleId ->
            openMasteryCheckDirectly(moduleId)
          },
        )
      }
    }
  }
}

/**
 * Custom crisp hairline bottom navigation bar — pure surface, 1.dp top divider, zero
 * default Material 3 oval blob pills.
 */
@Composable
private fun MarainHairlineBottomBar(
  activeTab: TopTab,
  onSelectTab: (TopTab) -> Unit,
) {
  val marain = LocalMarainColors.current
  Surface(
    modifier = Modifier.fillMaxWidth(),
    color = MaterialTheme.colorScheme.surface,
    tonalElevation = 0.dp,
  ) {
    Column(modifier = Modifier.navigationBarsPadding()) {
      HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .height(62.dp)
          .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
      ) {
        TopTab.entries.forEach { tab ->
          val selected = tab == activeTab
          val tint = if (selected) MaterialTheme.colorScheme.primary else marain.inkMuted
          val interaction = remember { MutableInteractionSource() }

          Box(
            modifier = Modifier
              .weight(1f)
              .height(62.dp)
              .clickable(
                interactionSource = interaction,
                indication = null,
                onClick = { onSelectTab(tab) },
              ),
            contentAlignment = Alignment.Center,
          ) {
            if (selected) {
              Box(
                modifier = Modifier
                  .align(Alignment.TopCenter)
                  .width(24.dp)
                  .height(2.5.dp)
                  .clip(RoundedCornerShape(bottomStart = 2.dp, bottomEnd = 2.dp))
                  .background(MaterialTheme.colorScheme.primary),
              )
            }

            Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              verticalArrangement = Arrangement.spacedBy(3.dp),
            ) {
              Icon(
                imageVector = tab.icon,
                contentDescription = tab.label,
                tint = tint,
                modifier = Modifier.size(22.dp),
              )
              Text(
                text = tab.label,
                fontFamily = PlusJakartaSansFontFamily,
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
                fontSize = 11.sp,
                lineHeight = 14.sp,
                color = tint,
                maxLines = 1,
              )
            }
          }
        }
      }
    }
  }
}
