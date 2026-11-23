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
import androidx.compose.material.icons.rounded.Verified
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
  onOpenUnitGuidebook: (String) -> Unit,
  onOpenMasteryCheck: (String) -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val rankProgress = ProgressEngine.fluencyRank(progress, curriculum)
  val effectiveStreak = ProgressEngine.effectiveStreakDays(progress, todayEpochDay)
  val todayXp = ProgressEngine.todayXpEarned(progress, todayEpochDay)
  val dailyFraction = ProgressEngine.dailyGoalFraction(progress, todayEpochDay)
  val dailyGoalHit = ProgressEngine.isDailyGoalReached(progress, todayEpochDay)
  val accuracy = ProgressEngine.quizAccuracyPercent(progress)
  val orderedModules = curriculum.orderedModules()
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

    // 1. Mastery-Gated Fluency Card (strictly separated from Practice XP)
    item(key = "fluency_mastery_summary") {
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
                .size(54.dp)
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
                text = "FLUENCY LEVEL · EARNED BY MASTERY",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary,
              )
              Text(
                text = rankProgress.currentTier.title,
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.onSurface,
              )
              Text(
                text = rankProgress.currentTier.canDoStatement,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
              )
            }
          }

          Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically,
            ) {
              Text(
                text = rankProgress.nextRequirementLabel,
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.weight(1f),
              )
              Spacer(modifier = Modifier.width(8.dp))
              Text(
                text = "${rankProgress.masteredUnitsCount}/${rankProgress.totalUnitsCount} units",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary,
              )
            }
            EditorialProgressBar(
              progress = rankProgress.progressFraction,
              fillColor = MaterialTheme.colorScheme.primary,
              height = 5.dp,
              trackColor = marain.hairlineDivider,
            )
          }
        }
      }
    }

    // 2. Daily Practice Habit Card (explicitly frames XP as practice habit, never fluency level)
    item(key = "practice_habit_card") {
      Surface(
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, marain.cardBorder),
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(18.dp),
          verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Text(
              text = "DAILY PRACTICE HABIT",
              style = MaterialTheme.typography.labelSmall,
              color = marain.inkMuted,
            )
            Text(
              text = "${progress.totalXp} Practice XP total",
              style = MaterialTheme.typography.labelMedium,
              color = MaterialTheme.colorScheme.onSurface,
            )
          }

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Text(
              text = if (dailyGoalHit) "Today's practice goal hit" else "Today's practice goal",
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
            trackColor = marain.hairlineDivider,
          )

          Text(
            text = "Practice XP tracks study consistency from reading, flashcards, and correct answers. Fluency milestones (A1–C2) only unlock when you pass Unit Mastery Checks.",
            style = MaterialTheme.typography.bodySmall,
            color = marain.inkMuted,
          )
        }
      }
    }

    // 3. Crisp 2x3 Hairline Metrics Grid
    item(key = "metrics_table") {
      Surface(
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, marain.cardBorder),
      ) {
        Column(modifier = Modifier.fillMaxWidth()) {
          Row(modifier = Modifier.fillMaxWidth()) {
            StatGridCell(
              value = "${rankProgress.masteredUnitsCount}/${rankProgress.totalUnitsCount}",
              label = "Units",
              sublabel = "Mastered",
              accentColor = marain.masteredGold,
              modifier = Modifier.weight(1f),
            )
            VerticalHairline(marain.hairlineDivider)
            StatGridCell(
              value = "${rankProgress.masteredLessonsCount}/${rankProgress.totalLessonsCount}",
              label = "Lessons",
              sublabel = "Passed",
              accentColor = MaterialTheme.colorScheme.primary,
              modifier = Modifier.weight(1f),
            )
            VerticalHairline(marain.hairlineDivider)
            StatGridCell(
              value = if (progress.quizTotalAnswered > 0) "$accuracy%" else "—",
              label = "Accuracy",
              sublabel = "${progress.quizTotalAnswered} Qs",
              accentColor = MaterialTheme.colorScheme.onSurface,
              modifier = Modifier.weight(1f),
            )
          }

          HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)

          Row(modifier = Modifier.fillMaxWidth()) {
            StatGridCell(
              value = "${effectiveStreak}d",
              label = "Streak",
              sublabel = "Best ${progress.longestStreakDays}d",
              accentColor = marain.streakAccent,
              modifier = Modifier.weight(1f),
            )
            VerticalHairline(marain.hairlineDivider)
            StatGridCell(
              value = "${progress.totalXp}",
              label = "Practice XP",
              sublabel = "Best ${progress.bestQuizCombo}x",
              accentColor = MaterialTheme.colorScheme.primary,
              modifier = Modifier.weight(1f),
            )
            VerticalHairline(marain.hairlineDivider)
            StatGridCell(
              value = "${progress.masteredPhraseIds.size}/${curriculum.glossary.size}",
              label = "Phrases",
              sublabel = "Reviewed",
              accentColor = MaterialTheme.colorScheme.onSurface,
              modifier = Modifier.weight(1f),
            )
          }
        }
      }
    }

    // 4. CEFR A1 -> C2 Mastery-Gated Fluency Track
    item(key = "cefr_track") {
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
          text = "FLUENCY MILESTONES (UNLOCKED BY MASTERY)",
          style = MaterialTheme.typography.labelSmall,
          color = marain.inkMuted,
        )
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(modifier = Modifier.fillMaxWidth()) {
            ProgressEngine.cefrMilestoneTiers.forEachIndexed { idx, tier ->
              val unlocked = rankProgress.isTierUnlocked(tier)
              val isCurrent = tier.cefrCode == rankProgress.currentTier.cefrCode
              if (idx > 0) {
                HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
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
                    .size(30.dp)
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
                      unlocked -> MaterialTheme.colorScheme.onPrimaryContainer
                      else -> MaterialTheme.colorScheme.onSurfaceVariant
                    },
                  )
                }

                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                  Text(
                    text = tier.title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.SemiBold,
                    color = if (unlocked) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                  )
                  Text(
                    text = tier.canDoStatement,
                    style = MaterialTheme.typography.bodySmall,
                    color = marain.inkMuted,
                  )
                }

                if (unlocked) {
                  Icon(
                    imageVector = Icons.Rounded.Check,
                    contentDescription = "Unlocked",
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(18.dp),
                  )
                } else {
                  Text(
                    text = tier.requirementSummary,
                    style = MaterialTheme.typography.labelSmall,
                    color = marain.inkMuted,
                  )
                }
              }
            }
          }
        }
      }
    }

    // 5. Unit Mastery Breakdown (clickable to take Mastery Check or review unit)
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
            verticalArrangement = Arrangement.spacedBy(14.dp),
          ) {
            orderedModules.forEach { module ->
              val status = ProgressEngine.unitMasteryStatus(progress, module)
              val unitAccent = editorialUnitPalette(module.number, isDark = marain.isDark).accent
              Column(
                modifier = Modifier
                  .fillMaxWidth()
                  .clip(RoundedCornerShape(8.dp))
                  .clickable {
                    if (status.isMasteryCheckReady) {
                      onOpenMasteryCheck(module.id)
                    } else {
                      onOpenUnitGuidebook(module.id)
                    }
                  },
                verticalArrangement = Arrangement.spacedBy(6.dp),
              ) {
                Row(
                  modifier = Modifier.fillMaxWidth(),
                  horizontalArrangement = Arrangement.SpaceBetween,
                  verticalAlignment = Alignment.CenterVertically,
                ) {
                  Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                  ) {
                    if (status.isUnitMastered) {
                      Icon(
                        imageVector = Icons.Rounded.Verified,
                        contentDescription = "Mastered",
                        tint = marain.masteredGold,
                        modifier = Modifier.size(16.dp),
                      )
                    }
                    Text(
                      text = "${module.number}. ${module.title}",
                      style = MaterialTheme.typography.bodyMedium,
                      fontWeight = if (status.isMasteryCheckReady) FontWeight.SemiBold else FontWeight.Normal,
                      color = MaterialTheme.colorScheme.onSurface,
                    )
                  }
                  Spacer(modifier = Modifier.width(8.dp))
                  val statusText = when {
                    status.isUnitMastered && status.masteryBestPercent != null -> "Mastered · ${status.masteryBestPercent}%"
                    status.isUnitMastered -> "Mastered"
                    status.isMasteryCheckReady -> "Take Check"
                    else -> "${status.masteredLessonsCount}/${status.totalLessonsCount} lessons"
                  }
                  Text(
                    text = statusText,
                    style = MaterialTheme.typography.labelSmall,
                    color = when {
                      status.isUnitMastered -> marain.streakAccent
                      status.isMasteryCheckReady -> unitAccent
                      else -> marain.inkMuted
                    },
                  )
                }
                EditorialProgressBar(
                  progress = status.progressFraction,
                  fillColor = if (status.isUnitMastered) marain.masteredGold else unitAccent,
                  height = 4.dp,
                  trackColor = marain.hairlineDivider,
                )
              }
            }
          }
        }
      }
    }

    // 6. Milestones List
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
                HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
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
                      tint = marain.onMasteredGold,
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

    // 7. Reading Appearance Controls
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

    // 8. Settings Links (Privacy & Local Data + Replay Intro Story)
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

            HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)

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
