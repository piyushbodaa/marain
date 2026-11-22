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
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Curriculum
import app.marain.learn.ui.components.EditorialProgressBar
import app.marain.learn.ui.components.ReadingAppearanceControls
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily
import app.marain.learn.ui.theme.editorialUnitPalette

@Composable
fun ProgressScreen(
  curriculum: Curriculum,
  progress: UserProgress,
  todayEpochDay: Long,
  onSelectReadingTheme: (ReadingTheme) -> Unit,
  onSelectFontScale: (FontScaleOption) -> Unit,
  onReplayIntroStory: () -> Unit,
  onOpenPrivacyPolicy: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val rankProgress = ProgressEngine.fluencyRankForXp(progress.totalXp)
  val effectiveStreak = ProgressEngine.effectiveStreakDays(progress, todayEpochDay)
  val todayXp = ProgressEngine.todayXpEarned(progress, todayEpochDay)
  val dailyFraction = ProgressEngine.dailyGoalFraction(progress, todayEpochDay)
  val dailyGoalHit = ProgressEngine.isDailyGoalReached(progress, todayEpochDay)
  val modulesCompleted = ProgressEngine.completedModulesCount(progress, curriculum)
  val chaptersRead = curriculum.allChaptersOrdered().count { it.id in progress.completedChapterIds }
  val accuracy = ProgressEngine.quizAccuracyPercent(progress)
  val orderedModules = curriculum.modules.sortedBy { it.number }
  val milestones = ProgressEngine.milestones(progress, curriculum, todayEpochDay)

  LazyColumn(
    modifier = modifier.fillMaxSize(),
    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
    verticalArrangement = Arrangement.spacedBy(18.dp),
  ) {
    item(key = "progress_header") {
      Text(
        text = "Progress",
        style = MaterialTheme.typography.displaySmall,
        color = MaterialTheme.colorScheme.onBackground,
      )
    }

    // Unified CEFR Rank + Daily Goal Card (clean hairline, zero pill clutter)
    item(key = "cefr_summary") {
      Surface(
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, marain.cardBorder),
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(18.dp),
          verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp),
          ) {
            Box(
              modifier = Modifier
                .size(52.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(MaterialTheme.colorScheme.primary),
              contentAlignment = Alignment.Center,
            ) {
              Text(
                text = rankProgress.currentTier.cefrCode,
                fontFamily = PlusJakartaSansFontFamily,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 20.sp,
                color = MaterialTheme.colorScheme.onPrimary,
              )
            }

            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
              Text(
                text = "MARAIN FLUENCY",
                style = MaterialTheme.typography.labelSmall,
                color = marain.inkMuted,
              )
              Text(
                text = rankProgress.currentTier.title,
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.onSurface,
              )
            }
          }

          Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            val nextTier = ProgressEngine.fluencyTiers.getOrNull(rankProgress.currentTier.level)
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
            ) {
              Text(
                text = if (nextTier != null) "Next: ${nextTier.cefrCode} ${nextTier.title}" else "C2 Fluency Reached",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
              )
              Text(
                text = "${progress.totalXp} XP",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurface,
              )
            }
            EditorialProgressBar(
              progress = rankProgress.progressFraction,
              fillColor = MaterialTheme.colorScheme.primary,
              height = 5.dp,
              trackColor = marain.cardBorder,
            )
          }

          HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)

          Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
            ) {
              Text(
                text = if (dailyGoalHit) "Today's goal complete" else "Today's daily goal",
                style = MaterialTheme.typography.bodySmall,
                color = if (dailyGoalHit) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
              )
              Text(
                text = "$todayXp / ${ProgressEngine.DAILY_GOAL_XP} XP",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurface,
              )
            }
            EditorialProgressBar(
              progress = dailyFraction,
              fillColor = MaterialTheme.colorScheme.primary,
              height = 5.dp,
              trackColor = marain.cardBorder,
            )
          }
        }
      }
    }

    // Crisp 2x3 Hairline Metrics Grid (zero pastel icon boxes)
    item(key = "metrics_table") {
      Surface(
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, marain.cardBorder),
      ) {
        Column(modifier = Modifier.fillMaxWidth()) {
          Row(modifier = Modifier.fillMaxWidth()) {
            StatGridCell(
              value = "${effectiveStreak}d",
              label = "Streak",
              sublabel = "Best ${progress.longestStreakDays}d",
              accentColor = marain.streakAccent,
              modifier = Modifier.weight(1f),
            )
            VerticalHairline(marain.cardBorder)
            StatGridCell(
              value = "${progress.totalXp}",
              label = "Total XP",
              sublabel = "Best ${progress.bestQuizCombo}x",
              accentColor = MaterialTheme.colorScheme.primary,
              modifier = Modifier.weight(1f),
            )
            VerticalHairline(marain.cardBorder)
            StatGridCell(
              value = "$modulesCompleted/${curriculum.modules.size}",
              label = "Units",
              sublabel = "Completed",
              accentColor = MaterialTheme.colorScheme.onSurface,
              modifier = Modifier.weight(1f),
            )
          }

          HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)

          Row(modifier = Modifier.fillMaxWidth()) {
            StatGridCell(
              value = "$chaptersRead/${curriculum.totalChapters}",
              label = "Read",
              sublabel = "${progress.bookmarkedChapterIds.size} saved",
              accentColor = MaterialTheme.colorScheme.onSurface,
              modifier = Modifier.weight(1f),
            )
            VerticalHairline(marain.cardBorder)
            StatGridCell(
              value = "${progress.masteredPhraseIds.size}/${curriculum.glossary.size}",
              label = "Phrases",
              sublabel = "Mastered",
              accentColor = MaterialTheme.colorScheme.primary,
              modifier = Modifier.weight(1f),
            )
            VerticalHairline(marain.cardBorder)
            StatGridCell(
              value = if (progress.quizTotalAnswered > 0) "$accuracy%" else "—",
              label = "Accuracy",
              sublabel = "${progress.quizTotalAnswered} drills",
              accentColor = MaterialTheme.colorScheme.onSurface,
              modifier = Modifier.weight(1f),
            )
          }
        }
      }
    }

    // CEFR A1 -> C2 Progression Track
    item(key = "cefr_track") {
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
          text = "CEFR FLUENCY TRACK",
          style = MaterialTheme.typography.labelSmall,
          color = marain.inkMuted,
        )
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(modifier = Modifier.fillMaxWidth()) {
            ProgressEngine.fluencyTiers.forEachIndexed { idx, tier ->
              val unlocked = progress.totalXp >= tier.minXp
              val isCurrent = tier.cefrCode == rankProgress.currentTier.cefrCode
              if (idx > 0) {
                HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)
              }
              Row(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
              ) {
                Box(
                  modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(
                      when {
                        isCurrent -> MaterialTheme.colorScheme.primary
                        unlocked -> MaterialTheme.colorScheme.primaryContainer
                        else -> MaterialTheme.colorScheme.surfaceVariant
                      },
                    ),
                  contentAlignment = Alignment.Center,
                ) {
                  Text(
                    text = tier.cefrCode,
                    fontFamily = PlusJakartaSansFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp,
                    color = when {
                      isCurrent -> MaterialTheme.colorScheme.onPrimary
                      unlocked -> MaterialTheme.colorScheme.primary
                      else -> marain.inkMuted
                    },
                  )
                }

                Text(
                  text = tier.title,
                  style = MaterialTheme.typography.bodyMedium,
                  fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Medium,
                  color = if (unlocked) MaterialTheme.colorScheme.onSurface else marain.inkMuted,
                  modifier = Modifier.weight(1f),
                )

                if (unlocked) {
                  Icon(
                    imageVector = Icons.Rounded.Check,
                    contentDescription = "Unlocked",
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(17.dp),
                  )
                } else {
                  Text(
                    text = "${tier.minXp} XP",
                    style = MaterialTheme.typography.bodySmall,
                    color = marain.inkMuted,
                  )
                }
              }
            }
          }
        }
      }
    }

    // Understated Milestones List
    item(key = "milestones_section") {
      val unlockedCount = milestones.count { it.unlocked }
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
        ) {
          Text(
            text = "MILESTONES",
            style = MaterialTheme.typography.labelSmall,
            color = marain.inkMuted,
          )
          Text(
            text = "$unlockedCount / ${milestones.size}",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.primary,
          )
        }
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(modifier = Modifier.fillMaxWidth()) {
            milestones.forEachIndexed { idx, milestone ->
              if (idx > 0) {
                HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)
              }
              Row(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
              ) {
                Box(
                  modifier = Modifier
                    .size(24.dp)
                    .clip(CircleShape)
                    .background(if (milestone.unlocked) marain.masteredGold else MaterialTheme.colorScheme.surfaceVariant),
                  contentAlignment = Alignment.Center,
                ) {
                  if (milestone.unlocked) {
                    Icon(
                      imageVector = Icons.Rounded.Check,
                      contentDescription = "Unlocked",
                      tint = Color.White,
                      modifier = Modifier.size(14.dp),
                    )
                  }
                }
                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(1.dp)) {
                  Text(
                    text = milestone.title,
                    style = MaterialTheme.typography.titleSmall,
                    color = if (milestone.unlocked) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                  )
                  Text(
                    text = milestone.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = marain.inkMuted,
                  )
                }
                Text(
                  text = milestone.progressLabel,
                  style = MaterialTheme.typography.labelSmall,
                  color = if (milestone.unlocked) marain.streakAccent else marain.inkMuted,
                )
              }
            }
          }
        }
      }
    }

    // Unit Mastery Breakdown
    item(key = "unit_mastery") {
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
          text = "UNIT MASTERY",
          style = MaterialTheme.typography.labelSmall,
          color = marain.inkMuted,
        )
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
          ) {
            orderedModules.forEach { module ->
              val done = module.chapters.count { it.id in progress.completedQuizChapterIds }
              val total = module.chapters.size
              val frac = if (total > 0) done.toFloat() / total.toFloat() else 0f
              val unitColor = editorialUnitPalette(module.number).fill
              Column(verticalArrangement = Arrangement.spacedBy(5.dp)) {
                Row(
                  modifier = Modifier.fillMaxWidth(),
                  horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                  Text(
                    text = "${module.number}. ${module.title}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.weight(1f),
                  )
                  Text(
                    text = "$done/$total",
                    style = MaterialTheme.typography.labelMedium,
                    color = marain.inkMuted,
                  )
                }
                EditorialProgressBar(
                  progress = frac,
                  fillColor = unitColor,
                  height = 4.dp,
                  trackColor = marain.cardBorder,
                )
              }
            }
          }
        }
      }
    }

    // Reading Appearance Controls
    item(key = "reading_appearance") {
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
          text = "READING APPEARANCE",
          style = MaterialTheme.typography.labelSmall,
          color = marain.inkMuted,
        )
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          ReadingAppearanceControls(
            selectedTheme = progress.readingTheme,
            selectedFontScale = progress.fontScale,
            onSelectTheme = onSelectReadingTheme,
            onSelectFontScale = onSelectFontScale,
            showPreviewText = true,
            modifier = Modifier.padding(16.dp),
          )
        }
      }
    }

    // Settings Links (Privacy & Local Data + Replay Intro Story)
    item(key = "settings_links") {
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
          text = "PRIVACY & APP",
          style = MaterialTheme.typography.labelSmall,
          color = marain.inkMuted,
        )
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(modifier = Modifier.fillMaxWidth()) {
            Row(
              modifier = Modifier
                .fillMaxWidth()
                .clickable(onClick = onOpenPrivacyPolicy)
                .padding(horizontal = 16.dp, vertical = 14.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween,
            ) {
              Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(1.dp)) {
                Text(
                  text = "Privacy & Local Data",
                  style = MaterialTheme.typography.titleSmall,
                  color = MaterialTheme.colorScheme.onSurface,
                )
                Text(
                  text = "100% offline · Cloud backup & transfer disabled",
                  style = MaterialTheme.typography.bodySmall,
                  color = marain.inkMuted,
                )
              }
              Icon(
                imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
                contentDescription = "Open Privacy Policy",
                tint = marain.inkMuted,
                modifier = Modifier.size(18.dp),
              )
            }

            HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)

            Row(
              modifier = Modifier
                .fillMaxWidth()
                .clickable(onClick = onReplayIntroStory)
                .padding(horizontal = 16.dp, vertical = 14.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween,
            ) {
              Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(1.dp)) {
                Text(
                  text = "Replay Intro Story",
                  style = MaterialTheme.typography.titleSmall,
                  color = MaterialTheme.colorScheme.onSurface,
                )
                Text(
                  text = "Revisit the 3-slide Learn Marain introduction",
                  style = MaterialTheme.typography.bodySmall,
                  color = marain.inkMuted,
                )
              }
              Icon(
                imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
                contentDescription = "Replay intro",
                tint = marain.inkMuted,
                modifier = Modifier.size(18.dp),
              )
            }
          }
        }
      }
    }

    item(key = "progress_bottom_spacer") {
      Spacer(modifier = Modifier.height(14.dp))
    }
  }
}

@Composable
private fun StatGridCell(
  value: String,
  label: String,
  sublabel: String,
  accentColor: Color,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  Column(
    modifier = modifier.padding(horizontal = 10.dp, vertical = 14.dp),
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.spacedBy(2.dp),
  ) {
    Text(
      text = value,
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.ExtraBold,
      fontSize = 18.sp,
      color = accentColor,
    )
    Text(
      text = label,
      style = MaterialTheme.typography.labelMedium,
      color = MaterialTheme.colorScheme.onSurface,
    )
    Text(
      text = sublabel,
      style = MaterialTheme.typography.bodySmall,
      color = marain.inkMuted,
    )
  }
}

@Composable
private fun VerticalHairline(color: Color) {
  Box(
    modifier = Modifier
      .width(1.dp)
      .height(74.dp)
      .background(color),
  )
}
