package app.marain.learn.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.BookmarkBorder
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.ui.components.TactileButton
import app.marain.learn.ui.components.rememberMarkdown
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.editorialUnitPalette

@Composable
fun SavedScreen(
  curriculum: Curriculum,
  progress: UserProgress,
  onOpenChapter: (String) -> Unit,
  onToggleBookmark: (String) -> Unit,
  onBrowseModules: () -> Unit,
  onOpenPrivacyPolicy: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val savedPairs = curriculum.allChaptersOrdered()
    .filter { it.id in progress.bookmarkedChapterIds }
    .mapNotNull { chapter ->
      curriculum.findModule(chapter.moduleId)?.let { module -> module to chapter }
    }

  LazyColumn(
    modifier = modifier.fillMaxSize(),
    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
    verticalArrangement = Arrangement.spacedBy(18.dp),
  ) {
    item(key = "saved_header") {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Bottom,
      ) {
        Text(
          text = "Saved",
          style = MaterialTheme.typography.displaySmall,
          color = MaterialTheme.colorScheme.onBackground,
        )
        Text(
          text = "${savedPairs.size} bookmarked",
          style = MaterialTheme.typography.labelMedium,
          color = marain.inkMuted,
          modifier = Modifier.padding(bottom = 5.dp),
        )
      }
    }

    if (savedPairs.isEmpty()) {
      item(key = "empty_saved") {
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 20.dp, vertical = 28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(10.dp),
          ) {
            Icon(
              imageVector = Icons.Rounded.BookmarkBorder,
              contentDescription = null,
              tint = marain.inkMuted,
              modifier = Modifier.size(30.dp),
            )
            Text(
              text = "No saved chapters yet",
              style = MaterialTheme.typography.titleMedium,
              color = MaterialTheme.colorScheme.onSurface,
            )
            Text(
              text = "Tap the bookmark icon while reading any chapter to build your personal offline cheat sheet.",
              style = MaterialTheme.typography.bodyMedium,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.height(6.dp))
            TactileButton(
              onClick = onBrowseModules,
              modifier = Modifier.fillMaxWidth(),
              height = 46.dp,
            ) {
              Text(
                text = "Explore Learning Path",
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold,
              )
            }
          }
        }
      }
    } else {
      item(key = "saved_list_surface") {
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(modifier = Modifier.fillMaxWidth()) {
            savedPairs.forEachIndexed { idx, (module, chapter) ->
              if (idx > 0) {
                HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
              }
              SavedChapterRow(
                module = module,
                chapter = chapter,
                isMastered = chapter.id in progress.completedQuizChapterIds,
                onOpen = { onOpenChapter(chapter.id) },
                onRemoveBookmark = { onToggleBookmark(chapter.id) },
              )
            }
          }
        }
      }
    }

    // Understated Offline-First AI Manual Callout (Editorial left-bar — zero card-on-card clutter)
    item(key = "offline_manual_callout") {
      val totalQuizzes = curriculum.allChaptersOrdered().sumOf { it.quiz.size }
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .height(IntrinsicSize.Min)
          .clip(RoundedCornerShape(12.dp))
          .background(marain.analogyContainer),
      ) {
        Box(
          modifier = Modifier
            .width(3.dp)
            .fillMaxHeight()
            .background(MaterialTheme.colorScheme.primary),
        )
        Column(
          modifier = Modifier
            .weight(1f)
            .padding(16.dp),
          verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
          Text(
            text = "OFFLINE-FIRST AI MANUAL",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.primary,
          )
          Text(
            text = "Learn anywhere, zero account required.",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurface,
          )
          Text(
            text = "All ${curriculum.modules.size} units, ${curriculum.totalChapters} chapters, $totalQuizzes practice drills, and ${curriculum.glossary.size} Phrasebook entries live right on your device. No login, no ads, and cloud backup & device transfer are disabled so your progress stays strictly local.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
          )
          Spacer(modifier = Modifier.height(4.dp))
          Row(
            modifier = Modifier
              .clip(RoundedCornerShape(8.dp))
              .clickable(onClick = onOpenPrivacyPolicy)
              .padding(vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp),
          ) {
            Text(
              text = "Read Privacy Policy",
              style = MaterialTheme.typography.labelMedium,
              fontWeight = FontWeight.Bold,
              color = MaterialTheme.colorScheme.primary,
            )
            Icon(
              imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
              contentDescription = null,
              tint = MaterialTheme.colorScheme.primary,
              modifier = Modifier.size(15.dp),
            )
          }
        }
      }
    }

    item(key = "saved_bottom_spacer") {
      Spacer(modifier = Modifier.height(12.dp))
    }
  }
}

@Composable
private fun SavedChapterRow(
  module: CurriculumModule,
  chapter: Chapter,
  isMastered: Boolean,
  onOpen: () -> Unit,
  onRemoveBookmark: () -> Unit,
) {
  val marain = LocalMarainColors.current
  val unitAccent = editorialUnitPalette(module.number, isDark = marain.isDark).accent

  Row(
    modifier = Modifier
      .fillMaxWidth()
      .clickable(onClick = onOpen)
      .padding(horizontal = 16.dp, vertical = 14.dp),
    horizontalArrangement = Arrangement.spacedBy(12.dp),
    verticalAlignment = Alignment.Top,
  ) {
    Column(
      modifier = Modifier.weight(1f),
      verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
      val status = if (isMastered) " · MASTERED" else ""
      Text(
        text = "UNIT ${module.number} · LESSON ${chapter.number}$status",
        style = MaterialTheme.typography.labelSmall,
        color = unitAccent,
      )
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
      Text(
        text = "${chapter.readMinutes} min read",
        style = MaterialTheme.typography.labelSmall,
        color = marain.inkMuted,
      )
    }

    IconButton(
      onClick = onRemoveBookmark,
      modifier = Modifier.size(32.dp),
    ) {
      Icon(
        imageVector = Icons.Rounded.Bookmark,
        contentDescription = "Remove bookmark",
        tint = MaterialTheme.colorScheme.primary,
        modifier = Modifier.size(20.dp),
      )
    }
  }
}
