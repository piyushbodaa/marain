package app.marain.learn.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.BookmarkBorder
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.EmojiEvents
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Replay
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material.icons.rounded.Verified
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.UnitMasteryStatus
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.data.model.MasteryCheck
import app.marain.learn.ui.components.EditorialProgressBar
import app.marain.learn.ui.components.TactileButton
import app.marain.learn.ui.components.rememberMarkdown
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.LoraFontFamily
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily
import app.marain.learn.ui.theme.UnitEditorialPalette
import app.marain.learn.ui.theme.editorialUnitPalette

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ModuleDetailScreen(
  module: CurriculumModule,
  progress: UserProgress,
  onBack: () -> Unit,
  onOpenChapter: (String) -> Unit,
  onStartMasteryCheck: (String) -> Unit,
  onToggleBookmark: (String) -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val palette = editorialUnitPalette(module.number, isDark = marain.isDark)
  val orderedChapters = module.chapters.sortedBy { it.number }
  val unitStatus = ProgressEngine.unitMasteryStatus(progress, module)
  val nextLessonInUnit = orderedChapters.firstOrNull { !ProgressEngine.isChapterMastered(progress, it) }
  val masteryCheck = module.masteryCheck?.takeIf { it.questions.isNotEmpty() }

  Scaffold(
    modifier = modifier.fillMaxSize(),
    containerColor = MaterialTheme.colorScheme.background,
    topBar = {
      Column {
        TopAppBar(
          title = {
            Text(
              text = "Unit ${module.number} Guidebook",
              style = MaterialTheme.typography.titleSmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
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
          colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background,
            titleContentColor = MaterialTheme.colorScheme.onBackground,
            navigationIconContentColor = MaterialTheme.colorScheme.onBackground,
            actionIconContentColor = MaterialTheme.colorScheme.onBackground,
          ),
        )
        HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
      }
    },
  ) { innerPadding ->
    LazyColumn(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding),
      contentPadding = PaddingValues(horizontal = 20.dp, vertical = 18.dp),
      verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
      // Tactile Editorial Unit Hero Banner
      item(key = "unit_hero") {
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(palette.lip)
            .padding(bottom = 4.dp),
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .clip(RoundedCornerShape(16.dp))
              .background(palette.fill)
              .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
          ) {
            val phoneTag = if (module.isPhoneOnly) " · PHONE-ONLY" else ""
            Text(
              text = "UNIT ${module.number} · ${orderedChapters.size} LESSONS · ~${module.estimatedMinutes} MIN$phoneTag",
              fontFamily = PlusJakartaSansFontFamily,
              fontWeight = FontWeight.Bold,
              fontSize = 11.sp,
              letterSpacing = 0.8.sp,
              color = palette.onFillMuted,
            )

            Text(
              text = rememberMarkdown(module.title, codeColor = palette.onFill),
              fontFamily = LoraFontFamily,
              fontWeight = FontWeight.Bold,
              fontSize = 24.sp,
              lineHeight = 31.sp,
              letterSpacing = (-0.4).sp,
              color = palette.onFill,
            )

            Text(
              text = rememberMarkdown(module.subtitle, codeColor = palette.onFill),
              style = MaterialTheme.typography.bodyMedium,
              color = palette.onFillMuted,
            )

            Spacer(modifier = Modifier.height(2.dp))

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
              ) {
                Text(
                  text = if (unitStatus.isUnitMastered) "Unit mastered" else "Unit progress",
                  style = MaterialTheme.typography.bodySmall,
                  color = palette.onFillMuted,
                )
                val statusLabel = when {
                  unitStatus.isUnitMastered && unitStatus.masteryBestPercent != null -> {
                    "Check passed · ${unitStatus.masteryBestPercent}%"
                  }
                  unitStatus.isMasteryCheckReady -> "Mastery Check ready"
                  else -> "${unitStatus.masteredLessonsCount} of ${unitStatus.totalLessonsCount} lessons"
                }
                Text(
                  text = statusLabel,
                  style = MaterialTheme.typography.labelMedium,
                  color = palette.onFill,
                )
              }
              EditorialProgressBar(
                progress = unitStatus.progressFraction,
                fillColor = palette.onFill,
                height = 5.dp,
                trackColor = Color.White.copy(alpha = 0.28f),
              )
            }
          }
        }
      }

      // Direct Next Action CTA inside the Unit Guidebook
      item(key = "unit_direct_cta") {
        when {
          nextLessonInUnit != null -> {
            TactileButton(
              onClick = { onOpenChapter(nextLessonInUnit.id) },
              fillColor = palette.fill,
              lipColor = palette.lip,
              contentColor = palette.onFill,
              modifier = Modifier.fillMaxWidth(),
            ) {
              Icon(
                imageVector = Icons.Rounded.PlayArrow,
                contentDescription = null,
                modifier = Modifier.size(20.dp),
              )
              Spacer(modifier = Modifier.width(6.dp))
              Text(
                text = if (unitStatus.masteredLessonsCount == 0) {
                  "Start Lesson ${nextLessonInUnit.number}: ${nextLessonInUnit.title}"
                } else {
                  "Continue Lesson ${nextLessonInUnit.number}: ${nextLessonInUnit.title}"
                },
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f, fill = false),
              )
            }
          }
          masteryCheck != null -> {
            TactileButton(
              onClick = { onStartMasteryCheck(module.id) },
              fillColor = palette.fill,
              lipColor = palette.lip,
              contentColor = palette.onFill,
              modifier = Modifier.fillMaxWidth(),
            ) {
              Icon(
                imageVector = Icons.Rounded.Verified,
                contentDescription = null,
                modifier = Modifier.size(19.dp),
              )
              Spacer(modifier = Modifier.width(8.dp))
              Text(
                text = if (unitStatus.isMasteryCheckPassed) {
                  "Retake Unit ${module.number} Mastery Check"
                } else {
                  "Take Unit ${module.number} Mastery Check"
                },
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold,
              )
            }
          }
        }
      }

      item(key = "lessons_heading") {
        Text(
          text = "LESSONS IN THIS UNIT",
          style = MaterialTheme.typography.labelSmall,
          color = marain.inkMuted,
          modifier = Modifier.padding(top = 4.dp),
        )
      }

      // Clean Hairline Lesson Rows inside one crisp editorial list surface
      item(key = "lessons_list_surface") {
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(modifier = Modifier.fillMaxWidth()) {
            orderedChapters.forEachIndexed { idx, chapter ->
              if (idx > 0) {
                HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
              }
              val isMastered = ProgressEngine.isChapterMastered(progress, chapter)
              val hasFailedAttempt = !isMastered && chapter.id in progress.attemptedQuizChapterIds
              GuidebookLessonRow(
                chapter = chapter,
                palette = palette,
                isRead = chapter.id in progress.completedChapterIds,
                isMastered = isMastered,
                hasFailedAttempt = hasFailedAttempt,
                bestQuizScore = progress.quizBestScores[chapter.id],
                isBookmarked = chapter.id in progress.bookmarkedChapterIds,
                onOpen = { onOpenChapter(chapter.id) },
                onToggleBookmark = { onToggleBookmark(chapter.id) },
              )
            }
          }
        }
      }

      // Unit Mastery Check Card (distinct, clear mastery gate for this unit)
      if (masteryCheck != null) {
        item(key = "unit_mastery_check_section") {
          Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
              text = "UNIT MASTERY CHECK",
              style = MaterialTheme.typography.labelSmall,
              color = marain.inkMuted,
              modifier = Modifier.padding(top = 4.dp),
            )
            UnitMasteryCheckCard(
              unitNumber = module.number,
              masteryCheck = masteryCheck,
              unitStatus = unitStatus,
              palette = palette,
              onStartMasteryCheck = { onStartMasteryCheck(module.id) },
            )
          }
        }
      }

      item(key = "guidebook_bottom_spacer") {
        Spacer(modifier = Modifier.height(16.dp))
      }
    }
  }
}

@Composable
private fun UnitMasteryCheckCard(
  unitNumber: Int,
  masteryCheck: MasteryCheck,
  unitStatus: UnitMasteryStatus,
  palette: UnitEditorialPalette,
  onStartMasteryCheck: () -> Unit,
) {
  val marain = LocalMarainColors.current
  Surface(
    modifier = Modifier
      .fillMaxWidth()
      .clip(RoundedCornerShape(14.dp))
      .clickable(onClick = onStartMasteryCheck),
    shape = RoundedCornerShape(14.dp),
    color = MaterialTheme.colorScheme.surface,
    border = BorderStroke(
      width = if (unitStatus.isMasteryCheckReady) 1.5.dp else 1.dp,
      color = if (unitStatus.isMasteryCheckReady) palette.accent else marain.cardBorder,
    ),
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
      Box(
        modifier = Modifier
          .size(44.dp)
          .clip(RoundedCornerShape(12.dp))
          .background(
            when {
              unitStatus.isMasteryCheckPassed -> marain.masteredGold
              unitStatus.isMasteryCheckReady -> palette.fill
              else -> MaterialTheme.colorScheme.surfaceVariant
            },
          ),
        contentAlignment = Alignment.Center,
      ) {
        Icon(
          imageVector = if (unitStatus.isMasteryCheckPassed) Icons.Rounded.Verified else Icons.Rounded.EmojiEvents,
          contentDescription = null,
          tint = when {
            unitStatus.isMasteryCheckPassed -> marain.onMasteredGold
            unitStatus.isMasteryCheckReady -> palette.onFill
            else -> MaterialTheme.colorScheme.onSurfaceVariant
          },
          modifier = Modifier.size(22.dp),
        )
      }

      Column(
        modifier = Modifier.weight(1f),
        verticalArrangement = Arrangement.spacedBy(3.dp),
      ) {
        Text(
          text = masteryCheck.title,
          style = MaterialTheme.typography.titleMedium,
          color = MaterialTheme.colorScheme.onSurface,
        )
        val desc = if (masteryCheck.subtitle.isNotBlank()) {
          masteryCheck.subtitle
        } else {
          "Prove your understanding of Unit $unitNumber to unlock unit mastery."
        }
        Text(
          text = desc,
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        val meta = when {
          unitStatus.isMasteryCheckPassed && unitStatus.masteryBestScore != null -> {
            "Passed · Best ${unitStatus.masteryBestScore}/${masteryCheck.questions.size} (${unitStatus.masteryBestPercent ?: 100}%)"
          }
          unitStatus.masteryBestScore != null -> {
            "Best ${unitStatus.masteryBestScore}/${masteryCheck.questions.size} · Need ${masteryCheck.minCorrectToPass}/${masteryCheck.questions.size} (≥${masteryCheck.passingScorePercent}%)"
          }
          else -> {
            "${masteryCheck.questions.size} questions · ~${masteryCheck.estimatedMinutes} min · ≥${masteryCheck.passingScorePercent}% to pass"
          }
        }
        Text(
          text = meta,
          style = MaterialTheme.typography.labelSmall,
          color = when {
            unitStatus.isMasteryCheckPassed -> marain.streakAccent
            unitStatus.isMasteryCheckReady -> palette.accent
            else -> marain.inkMuted
          },
        )
      }

      Icon(
        imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
        contentDescription = "Start mastery check",
        tint = if (unitStatus.isMasteryCheckReady) palette.accent else marain.inkMuted,
        modifier = Modifier.size(18.dp),
      )
    }
  }
}

@Composable
private fun GuidebookLessonRow(
  chapter: Chapter,
  palette: UnitEditorialPalette,
  isRead: Boolean,
  isMastered: Boolean,
  hasFailedAttempt: Boolean,
  bestQuizScore: Int?,
  isBookmarked: Boolean,
  onOpen: () -> Unit,
  onToggleBookmark: () -> Unit,
) {
  val marain = LocalMarainColors.current

  Row(
    modifier = Modifier
      .fillMaxWidth()
      .clickable(onClick = onOpen)
      .padding(horizontal = 16.dp, vertical = 15.dp),
    horizontalArrangement = Arrangement.spacedBy(13.dp),
    verticalAlignment = Alignment.Top,
  ) {
    Box(
      modifier = Modifier
        .padding(top = 2.dp)
        .size(32.dp)
        .clip(CircleShape)
        .background(
          when {
            isMastered -> marain.masteredGold
            hasFailedAttempt -> marain.wrongContainer
            isRead -> palette.fill
            else -> MaterialTheme.colorScheme.surfaceVariant
          },
        ),
      contentAlignment = Alignment.Center,
    ) {
      when {
        isMastered -> Icon(
          imageVector = Icons.Rounded.Star,
          contentDescription = "Mastered",
          tint = marain.onMasteredGold,
          modifier = Modifier.size(16.dp),
        )
        hasFailedAttempt -> Icon(
          imageVector = Icons.Rounded.Replay,
          contentDescription = "Retry practice check",
          tint = marain.wrongAccent,
          modifier = Modifier.size(16.dp),
        )
        isRead -> Icon(
          imageVector = Icons.Rounded.Check,
          contentDescription = "Read",
          tint = palette.onFill,
          modifier = Modifier.size(16.dp),
        )
        else -> Text(
          text = chapter.number.toString(),
          style = MaterialTheme.typography.labelLarge,
          fontWeight = FontWeight.Bold,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
      }
    }

    Column(
      modifier = Modifier.weight(1f),
      verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
      Text(
        text = rememberMarkdown(chapter.title),
        style = MaterialTheme.typography.titleMedium,
        color = MaterialTheme.colorScheme.onSurface,
      )
      Text(
        text = rememberMarkdown(chapter.summary),
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        maxLines = 2,
        overflow = TextOverflow.Ellipsis,
      )
      val (meta, metaColor) = when {
        isMastered && bestQuizScore != null -> {
          "${chapter.readMinutes} min · Mastered ($bestQuizScore/${chapter.quiz.size})" to marain.streakAccent
        }
        isMastered -> "${chapter.readMinutes} min · Mastered" to marain.streakAccent
        hasFailedAttempt -> {
          "${chapter.readMinutes} min · Retry check (need ≥${ProgressEngine.LESSON_PASS_PERCENT}%)" to marain.wrongAccent
        }
        isRead -> "${chapter.readMinutes} min · Practice check ready" to palette.accent
        else -> "${chapter.readMinutes} min read" to marain.inkMuted
      }
      Text(
        text = meta,
        style = MaterialTheme.typography.labelSmall,
        color = metaColor,
      )
    }

    IconButton(
      onClick = onToggleBookmark,
      modifier = Modifier.size(32.dp),
    ) {
      Icon(
        imageVector = if (isBookmarked) Icons.Rounded.Bookmark else Icons.Rounded.BookmarkBorder,
        contentDescription = if (isBookmarked) "Remove bookmark" else "Bookmark lesson",
        tint = if (isBookmarked) MaterialTheme.colorScheme.primary else marain.inkMuted,
        modifier = Modifier.size(20.dp),
      )
    }
  }
}
