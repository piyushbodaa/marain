package app.marain.learn.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.BookmarkBorder
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Quiz
import androidx.compose.material.icons.rounded.TextFields
import androidx.compose.material.icons.rounded.Verified
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.NextStepAfterChapter
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Callout
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.data.model.GlossaryTerm
import app.marain.learn.ui.components.GlossaryTermBottomSheet
import app.marain.learn.ui.components.ReadingAppearanceBottomSheet
import app.marain.learn.ui.components.RichMarkdownBody
import app.marain.learn.ui.components.TactileButton
import app.marain.learn.ui.components.rememberMarkdown
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily
import app.marain.learn.ui.theme.editorialUnitPalette

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ChapterReaderScreen(
  curriculum: Curriculum,
  module: CurriculumModule,
  chapter: Chapter,
  progress: UserProgress,
  onBack: () -> Unit,
  onChapterOpened: (String) -> Unit,
  onMarkChapterRead: (String) -> Unit,
  onToggleBookmark: (String) -> Unit,
  onStartQuiz: (String) -> Unit,
  onStartMasteryCheck: (String) -> Unit,
  onNavigateToChapter: (String) -> Unit,
  onSelectReadingTheme: (ReadingTheme) -> Unit,
  onSelectFontScale: (FontScaleOption) -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val unitPalette = editorialUnitPalette(module.number, isDark = marain.isDark)
  val scrollState = rememberScrollState()
  val readProgress by remember {
    derivedStateOf {
      if (scrollState.maxValue <= 0) 0f
      else (scrollState.value.toFloat() / scrollState.maxValue.toFloat()).coerceIn(0f, 1f)
    }
  }

  var activeGlossaryTerm by remember { mutableStateOf<GlossaryTerm?>(null) }
  var showAppearanceSheet by remember { mutableStateOf(false) }

  val isRead = chapter.id in progress.completedChapterIds
  val isMastered = ProgressEngine.isChapterMastered(progress, chapter)
  val hasFailedAttempt = !isMastered && chapter.id in progress.attemptedQuizChapterIds
  val bestQuizScore = progress.quizBestScores[chapter.id]
  val isBookmarked = chapter.id in progress.bookmarkedChapterIds

  val glossaryTerms = remember(chapter.id, curriculum) {
    chapter.glossaryTermIds.mapNotNull { curriculum.findGlossaryTerm(it) }.distinctBy { it.id }
  }
  val previousChapter = remember(chapter.id, curriculum) {
    ProgressEngine.previousChapterBefore(chapter.id, curriculum)
  }
  val nextStep = remember(chapter.id, progress, curriculum) {
    ProgressEngine.nextStepAfterChapter(chapter.id, progress, curriculum)
  }

  LaunchedEffect(chapter.id) {
    onChapterOpened(chapter.id)
    scrollState.scrollTo(0)
  }

  Scaffold(
    modifier = modifier.fillMaxSize(),
    containerColor = MaterialTheme.colorScheme.background,
    topBar = {
      Column {
        TopAppBar(
          title = {
            Text(
              text = "Unit ${module.number} · Lesson ${chapter.number}",
              style = MaterialTheme.typography.titleSmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
              maxLines = 1,
              overflow = TextOverflow.Ellipsis,
            )
          },
          navigationIcon = {
            IconButton(onClick = onBack) {
              Icon(
                imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                contentDescription = "Back",
              )
            }
          },
          actions = {
            IconButton(onClick = { showAppearanceSheet = true }) {
              Icon(
                imageVector = Icons.Rounded.TextFields,
                contentDescription = "Reading appearance",
              )
            }
            IconButton(onClick = { onToggleBookmark(chapter.id) }) {
              Icon(
                imageVector = if (isBookmarked) Icons.Rounded.Bookmark else Icons.Rounded.BookmarkBorder,
                contentDescription = if (isBookmarked) "Remove bookmark" else "Bookmark lesson",
                tint = if (isBookmarked) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onBackground,
              )
            }
          },
          colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background,
            titleContentColor = MaterialTheme.colorScheme.onBackground,
            navigationIconContentColor = MaterialTheme.colorScheme.onBackground,
            actionIconContentColor = MaterialTheme.colorScheme.onBackground,
          ),
        )
        LinearProgressIndicator(
          progress = { readProgress },
          modifier = Modifier
            .fillMaxWidth()
            .height(2.5.dp),
          color = unitPalette.accent,
          trackColor = marain.hairlineDivider,
        )
      }
    },
  ) { innerPadding ->
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
        .verticalScroll(scrollState)
        .padding(horizontal = 22.dp, vertical = 22.dp),
      verticalArrangement = Arrangement.spacedBy(22.dp),
    ) {
      // Editorial Masthead & Clean Metadata Strip
      Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        val statusSuffix = when {
          isMastered -> " · MASTERED"
          hasFailedAttempt -> " · CHECK NEEDED"
          isRead -> " · READ"
          else -> ""
        }
        Text(
          text = "UNIT ${module.number} · ${chapter.readMinutes} MIN READ$statusSuffix",
          fontFamily = PlusJakartaSansFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 11.sp,
          letterSpacing = 0.9.sp,
          color = unitPalette.accent,
        )

        Text(
          text = rememberMarkdown(chapter.title),
          style = MaterialTheme.typography.displaySmall,
          color = MaterialTheme.colorScheme.onBackground,
        )

        Text(
          text = rememberMarkdown(chapter.summary),
          style = MaterialTheme.typography.bodyLarge,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
      }

      // Editorial Left-Bar Pull-Quote for Everyday Analogy
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .height(IntrinsicSize.Min)
          .clip(RoundedCornerShape(10.dp))
          .background(marain.analogyContainer),
      ) {
        Box(
          modifier = Modifier
            .width(3.dp)
            .fillMaxHeight()
            .background(unitPalette.accent),
        )
        Column(
          modifier = Modifier
            .weight(1f)
            .padding(horizontal = 16.dp, vertical = 15.dp),
          verticalArrangement = Arrangement.spacedBy(7.dp),
        ) {
          Text(
            text = "EVERYDAY ANALOGY",
            style = MaterialTheme.typography.labelSmall,
            color = unitPalette.accent,
          )
          Text(
            text = rememberMarkdown(chapter.analogy.title),
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurface,
          )
          RichMarkdownBody(
            text = chapter.analogy.body,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurface,
          )
        }
      }

      // Magazine-grade Editorial Sections (100% phone self-contained)
      chapter.sections.forEachIndexed { index, section ->
        Column(verticalArrangement = Arrangement.spacedBy(11.dp)) {
          if (index > 0) {
            HorizontalDivider(
              thickness = 1.dp,
              color = marain.hairlineDivider,
              modifier = Modifier.padding(bottom = 6.dp),
            )
          }
          Text(
            text = rememberMarkdown(section.heading),
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onBackground,
          )

          RichMarkdownBody(
            text = section.body,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurface,
          )

          section.callout?.let { callout ->
            Spacer(modifier = Modifier.height(2.dp))
            EditorialCalloutStrip(callout = callout)
          }
        }
      }

      // Crisp 1.dp Hairline Phrasebook Chips
      if (glossaryTerms.isNotEmpty()) {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
          HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
          Text(
            text = "KEY PHRASES — TAP TO DECODE",
            style = MaterialTheme.typography.labelSmall,
            color = marain.inkMuted,
          )
          FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
          ) {
            glossaryTerms.forEach { term ->
              Surface(
                modifier = Modifier
                  .clip(RoundedCornerShape(8.dp))
                  .clickable { activeGlossaryTerm = term },
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, marain.cardBorder),
              ) {
                Text(
                  text = term.term,
                  style = MaterialTheme.typography.labelMedium,
                  color = MaterialTheme.colorScheme.primary,
                  modifier = Modifier.padding(horizontal = 11.dp, vertical = 7.dp),
                )
              }
            }
          }
        }
      }

      // Understated Editorial Key Takeaways Card
      if (chapter.keyTakeaways.isNotEmpty()) {
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
          ) {
            Text(
              text = "Key Takeaways",
              style = MaterialTheme.typography.headlineSmall,
              color = MaterialTheme.colorScheme.onSurface,
            )
            chapter.keyTakeaways.forEach { takeaway ->
              Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.Top,
              ) {
                Icon(
                  imageVector = Icons.Rounded.Check,
                  contentDescription = null,
                  tint = MaterialTheme.colorScheme.primary,
                  modifier = Modifier
                    .padding(top = 4.dp)
                    .size(16.dp),
                )
                Text(
                  text = rememberMarkdown(takeaway),
                  style = MaterialTheme.typography.bodyMedium,
                  color = MaterialTheme.colorScheme.onSurface,
                  modifier = Modifier.weight(1f),
                )
              }
            }
          }
        }
      }

      // Chunky Tactile 3D Practice Check CTA (high-contrast white text on unit fill in all themes)
      Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        TactileButton(
          onClick = { onStartQuiz(chapter.id) },
          fillColor = unitPalette.fill,
          lipColor = unitPalette.lip,
          contentColor = unitPalette.onFill,
          modifier = Modifier.fillMaxWidth(),
        ) {
          Icon(
            imageVector = Icons.Rounded.Quiz,
            contentDescription = null,
            modifier = Modifier.size(19.dp),
          )
          Spacer(modifier = Modifier.width(8.dp))
          val ctaLabel = when {
            isMastered && bestQuizScore != null -> "Practice Check Again (Best: $bestQuizScore/${chapter.quiz.size})"
            hasFailedAttempt -> "Retry Practice Check (Need ≥${ProgressEngine.LESSON_PASS_PERCENT}%)"
            else -> "Check Your Understanding (${chapter.quiz.size} Qs)"
          }
          Text(
            text = ctaLabel,
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.Bold,
          )
        }

        if (!isRead) {
          OutlinedButton(
            onClick = { onMarkChapterRead(chapter.id) },
            modifier = Modifier
              .fillMaxWidth()
              .height(46.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, marain.cardBorder),
            colors = ButtonDefaults.outlinedButtonColors(
              contentColor = MaterialTheme.colorScheme.onSurface,
            ),
          ) {
            Text(
              text = "Mark Lesson as Read (+${ProgressEngine.READ_CHAPTER_XP} Practice XP)",
              style = MaterialTheme.typography.labelMedium,
            )
          }
        }
      }

      // Clean Previous / Next Chapter (or Unit Mastery Check at end of unit) Navigation
      HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
      ) {
        if (previousChapter != null) {
          OutlinedButton(
            onClick = { onNavigateToChapter(previousChapter.id) },
            modifier = Modifier.weight(1f),
            shape = RoundedCornerShape(10.dp),
            border = BorderStroke(1.dp, marain.cardBorder),
            colors = ButtonDefaults.outlinedButtonColors(
              contentColor = MaterialTheme.colorScheme.onSurface,
            ),
          ) {
            Icon(
              imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
              contentDescription = null,
              modifier = Modifier.size(16.dp),
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
              text = "Previous",
              maxLines = 1,
              overflow = TextOverflow.Ellipsis,
            )
          }
        } else {
          Spacer(modifier = Modifier.weight(1f))
        }

        when (nextStep) {
          is NextStepAfterChapter.UnitMasteryCheck -> {
            OutlinedButton(
              onClick = { onStartMasteryCheck(nextStep.module.id) },
              modifier = Modifier.weight(1f),
              shape = RoundedCornerShape(10.dp),
              border = BorderStroke(1.dp, unitPalette.accent),
              colors = ButtonDefaults.outlinedButtonColors(
                contentColor = unitPalette.accent,
              ),
            ) {
              Icon(
                imageVector = Icons.Rounded.Verified,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
              )
              Spacer(modifier = Modifier.width(6.dp))
              Text(
                text = "Mastery Check",
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
              )
            }
          }
          is NextStepAfterChapter.NextLesson -> {
            OutlinedButton(
              onClick = { onNavigateToChapter(nextStep.chapter.id) },
              modifier = Modifier.weight(1f),
              shape = RoundedCornerShape(10.dp),
              border = BorderStroke(1.dp, marain.cardBorder),
              colors = ButtonDefaults.outlinedButtonColors(
                contentColor = MaterialTheme.colorScheme.onSurface,
              ),
            ) {
              Text(
                text = "Next Lesson",
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
              )
              Spacer(modifier = Modifier.width(6.dp))
              Icon(
                imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
              )
            }
          }
          is NextStepAfterChapter.CourseComplete -> {
            Spacer(modifier = Modifier.weight(1f))
          }
        }
      }

      Spacer(modifier = Modifier.height(16.dp))
    }
  }

  activeGlossaryTerm?.let { term ->
    GlossaryTermBottomSheet(
      term = term,
      onDismiss = { activeGlossaryTerm = null },
    )
  }

  if (showAppearanceSheet) {
    ReadingAppearanceBottomSheet(
      selectedTheme = progress.readingTheme,
      selectedFontScale = progress.fontScale,
      onSelectTheme = onSelectReadingTheme,
      onSelectFontScale = onSelectFontScale,
      onDismiss = { showAppearanceSheet = false },
    )
  }
}

@Composable
private fun EditorialCalloutStrip(callout: Callout) {
  val marain = LocalMarainColors.current
  val (accent, tint, label) = when (callout.type.lowercase().trim()) {
    "myth" -> Triple(marain.mythAccent, marain.mythContainer, "MYTH BUSTER")
    "example" -> Triple(marain.exampleAccent, marain.exampleContainer, "EXAMPLE")
    "warning" -> Triple(marain.warningAccent, marain.warningContainer, "WATCH OUT")
    else -> Triple(marain.tipAccent, marain.tipContainer, "PRO TIP")
  }

  Row(
    modifier = Modifier
      .fillMaxWidth()
      .height(IntrinsicSize.Min)
      .clip(RoundedCornerShape(10.dp))
      .background(tint),
  ) {
    Box(
      modifier = Modifier
        .width(3.dp)
        .fillMaxHeight()
        .background(accent),
    )
    Column(
      modifier = Modifier
        .weight(1f)
        .padding(horizontal = 14.dp, vertical = 13.dp),
      verticalArrangement = Arrangement.spacedBy(5.dp),
    ) {
      Text(
        text = label,
        style = MaterialTheme.typography.labelSmall,
        color = accent,
      )
      if (callout.title.isNotBlank()) {
        Text(
          text = rememberMarkdown(callout.title),
          style = MaterialTheme.typography.titleSmall,
          color = MaterialTheme.colorScheme.onSurface,
        )
      }
      RichMarkdownBody(
        text = callout.body,
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurface,
      )
    }
  }
}
