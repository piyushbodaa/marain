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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.BookmarkBorder
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Star
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
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.ui.components.EditorialProgressBar
import app.marain.learn.ui.components.rememberMarkdown
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.LoraFontFamily
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily
import app.marain.learn.ui.theme.editorialUnitPalette

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ModuleDetailScreen(
  module: CurriculumModule,
  progress: UserProgress,
  onBack: () -> Unit,
  onOpenChapter: (String) -> Unit,
  onToggleBookmark: (String) -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val palette = editorialUnitPalette(module.number)
  val orderedChapters = module.chapters.sortedBy { it.number }
  val masteredCount = orderedChapters.count { it.id in progress.completedQuizChapterIds }
  val fraction = if (orderedChapters.isNotEmpty()) {
    masteredCount.toFloat() / orderedChapters.size.toFloat()
  } else {
    0f
  }

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
          ),
        )
        HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)
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
            Text(
              text = "UNIT ${module.number} · ${orderedChapters.size} LESSONS · ~${module.estimatedMinutes} MIN",
              fontFamily = PlusJakartaSansFontFamily,
              fontWeight = FontWeight.Bold,
              fontSize = 11.sp,
              letterSpacing = 0.8.sp,
              color = Color.White.copy(alpha = 0.78f),
            )

            Text(
              text = rememberMarkdown(module.title),
              fontFamily = LoraFontFamily,
              fontWeight = FontWeight.Bold,
              fontSize = 24.sp,
              lineHeight = 31.sp,
              letterSpacing = (-0.4).sp,
              color = Color.White,
            )

            Text(
              text = rememberMarkdown(module.subtitle),
              style = MaterialTheme.typography.bodyMedium,
              color = Color.White.copy(alpha = 0.86f),
            )

            Spacer(modifier = Modifier.height(2.dp))

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
              ) {
                Text(
                  text = "Unit mastery",
                  style = MaterialTheme.typography.bodySmall,
                  color = Color.White.copy(alpha = 0.78f),
                )
                Text(
                  text = "$masteredCount of ${orderedChapters.size} mastered",
                  style = MaterialTheme.typography.labelMedium,
                  color = Color.White,
                )
              }
              EditorialProgressBar(
                progress = fraction,
                fillColor = Color.White,
                height = 5.dp,
                trackColor = Color.White.copy(alpha = 0.24f),
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
                HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)
              }
              GuidebookLessonRow(
                chapter = chapter,
                unitColor = palette.fill,
                isRead = chapter.id in progress.completedChapterIds,
                isQuizDone = chapter.id in progress.completedQuizChapterIds,
                bestQuizScore = progress.quizBestScores[chapter.id],
                isBookmarked = chapter.id in progress.bookmarkedChapterIds,
                onOpen = { onOpenChapter(chapter.id) },
                onToggleBookmark = { onToggleBookmark(chapter.id) },
              )
            }
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
private fun GuidebookLessonRow(
  chapter: Chapter,
  unitColor: Color,
  isRead: Boolean,
  isQuizDone: Boolean,
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
    // Clean circular status marker
    Box(
      modifier = Modifier
        .padding(top = 2.dp)
        .size(32.dp)
        .clip(CircleShape)
        .background(
          when {
            isQuizDone -> marain.masteredGold
            isRead -> unitColor
            else -> MaterialTheme.colorScheme.surfaceVariant
          },
        ),
      contentAlignment = Alignment.Center,
    ) {
      when {
        isQuizDone -> Icon(
          imageVector = Icons.Rounded.Star,
          contentDescription = "Mastered",
          tint = Color.White,
          modifier = Modifier.size(16.dp),
        )
        isRead -> Icon(
          imageVector = Icons.Rounded.Check,
          contentDescription = "Read",
          tint = Color.White,
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
      val meta = buildString {
        append("${chapter.readMinutes} min · +${chapter.xpReward} XP")
        if (isQuizDone && bestQuizScore != null) {
          append(" · Best $bestQuizScore/${chapter.quiz.size}")
        } else if (isRead) {
          append(" · Drill ready")
        }
      }
      Text(
        text = meta,
        style = MaterialTheme.typography.labelSmall,
        color = if (isQuizDone) marain.streakAccent else marain.inkMuted,
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
