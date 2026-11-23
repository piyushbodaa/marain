package app.marain.learn.ui.screens

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.automirrored.rounded.MenuBook
import androidx.compose.material.icons.rounded.Bolt
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.EmojiEvents
import androidx.compose.material.icons.rounded.LocalFireDepartment
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Quiz
import androidx.compose.material.icons.rounded.Replay
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material.icons.rounded.Verified
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.FluencyRankProgress
import app.marain.learn.data.NextLearningAction
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.UnitMasteryStatus
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.Curriculum
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

private val PATH_OFFSETS_DP = listOf(0, 56, 0, -56, 0)
private val NODE_STEP_HEIGHT = 154.dp
private val NODE_TOP_INSET = 42.dp
private val NODE_BUTTON_SIZE = 72.dp

@Composable
fun PathScreen(
  curriculum: Curriculum,
  progress: UserProgress,
  todayEpochDay: Long,
  onOpenGuidebook: (String) -> Unit,
  onOpenChapter: (String) -> Unit,
  onOpenMasteryCheck: (String) -> Unit,
  onOpenProgress: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val effectiveStreak = ProgressEngine.effectiveStreakDays(progress, todayEpochDay)
  val rankProgress = ProgressEngine.fluencyRank(progress, curriculum)
  val nextAction = ProgressEngine.nextLearningAction(progress, curriculum)
  val todayXp = ProgressEngine.todayXpEarned(progress, todayEpochDay)
  val dailyFraction = ProgressEngine.dailyGoalFraction(progress, todayEpochDay)
  val dailyGoalHit = ProgressEngine.isDailyGoalReached(progress, todayEpochDay)
  val orderedUnits = curriculum.orderedModules()

  val activeChapterId = (nextAction as? NextLearningAction.OpenLesson)?.chapterId
  val activeMasteryModuleId = (nextAction as? NextLearningAction.OpenUnitMasteryCheck)?.moduleId

  Column(modifier = modifier.fillMaxSize()) {
    // 1. Compact Borderless Editorial Top Header
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .height(52.dp)
        .padding(horizontal = 20.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically,
    ) {
      Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(9.dp),
      ) {
        Text(
          text = curriculum.appName,
          fontFamily = LoraFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 22.sp,
          letterSpacing = (-0.5).sp,
          color = MaterialTheme.colorScheme.onBackground,
        )
        Surface(
          modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .clickable(onClick = onOpenProgress),
          shape = RoundedCornerShape(6.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Text(
            text = rankProgress.currentTier.cefrCode,
            fontFamily = PlusJakartaSansFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 11.sp,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp),
          )
        }
      }

      // Clean inline tabular stats: Streak, Practice XP, Mastered Units
      Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp),
      ) {
        HeaderInlineStat(
          icon = Icons.Rounded.LocalFireDepartment,
          value = "$effectiveStreak",
          tint = marain.streakAccent,
          contentDescription = "Streak days",
        )
        HeaderInlineStat(
          icon = Icons.Rounded.Bolt,
          value = "${progress.totalXp}",
          tint = MaterialTheme.colorScheme.primary,
          contentDescription = "Practice XP",
        )
        HeaderInlineStat(
          icon = Icons.Rounded.Verified,
          value = "${rankProgress.masteredUnitsCount}/${rankProgress.totalUnitsCount}",
          tint = marain.masteredGold,
          contentDescription = "Units mastered",
        )
      }
    }
    HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)

    // Scrollable Path Feed
    LazyColumn(
      modifier = Modifier.fillMaxSize(),
      contentPadding = PaddingValues(bottom = 28.dp),
    ) {
      // 2. Unmistakable Primary Hero Action Card — opens next lesson or mastery check DIRECTLY
      if (nextAction != null) {
        item(key = "primary_hero_action") {
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 20.dp)
              .padding(top = 16.dp, bottom = 6.dp),
          ) {
            PrimaryNextActionHeroCard(
              action = nextAction,
              rankProgress = rankProgress,
              onTriggerAction = {
                when (nextAction) {
                  is NextLearningAction.OpenLesson -> onOpenChapter(nextAction.chapterId)
                  is NextLearningAction.OpenUnitMasteryCheck -> onOpenMasteryCheck(nextAction.moduleId)
                  is NextLearningAction.AllMastered -> onOpenChapter(nextAction.reviewChapterId)
                }
              },
              onOpenProgress = onOpenProgress,
            )
          }
        }
      }

      // 3. Slim Borderless Daily Practice Strip (explicitly distinct from Fluency Mastery)
      item(key = "daily_goal_strip") {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 10.dp),
          verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Text(
              text = if (dailyGoalHit) "Today's practice goal hit" else "Today's practice",
              style = MaterialTheme.typography.bodySmall,
              fontWeight = FontWeight.Medium,
              color = if (dailyGoalHit) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
              text = "$todayXp / ${ProgressEngine.DAILY_GOAL_XP} Practice XP",
              style = MaterialTheme.typography.labelMedium,
              fontWeight = FontWeight.Bold,
              color = MaterialTheme.colorScheme.onBackground,
            )
          }
          EditorialProgressBar(
            progress = dailyFraction,
            fillColor = MaterialTheme.colorScheme.primary,
            height = 4.dp,
            trackColor = marain.hairlineDivider,
          )
        }
      }

      // 4. 7 Editorial Units + Stepping-Stone Paths + Unit Mastery Check Capstone Nodes
      orderedUnits.forEach { unit ->
        val palette = editorialUnitPalette(unit.number, isDark = marain.isDark)
        val unitStatus = ProgressEngine.unitMasteryStatus(progress, unit)
        val orderedChapters = unit.chapters.sortedBy { it.number }

        item(key = "unit_banner_${unit.id}") {
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 20.dp)
              .padding(top = 8.dp, bottom = 6.dp),
          ) {
            EditorialUnitBanner(
              unit = unit,
              unitStatus = unitStatus,
              palette = palette,
              onOpenGuidebook = { onOpenGuidebook(unit.id) },
            )
          }
        }

        item(key = "unit_path_${unit.id}") {
          UnitCurvedPathSection(
            unit = unit,
            chapters = orderedChapters,
            unitStatus = unitStatus,
            palette = palette,
            progress = progress,
            activeChapterId = activeChapterId,
            isMasteryCheckActive = unit.id == activeMasteryModuleId,
            onOpenChapter = onOpenChapter,
            onOpenMasteryCheck = { onOpenMasteryCheck(unit.id) },
          )
        }
      }
    }
  }
}

@Composable
private fun PrimaryNextActionHeroCard(
  action: NextLearningAction,
  rankProgress: FluencyRankProgress,
  onTriggerAction: () -> Unit,
  onOpenProgress: () -> Unit,
) {
  val marain = LocalMarainColors.current
  val unitPalette = editorialUnitPalette(action.moduleNumber, isDark = marain.isDark)
  val isMasteryCheck = action is NextLearningAction.OpenUnitMasteryCheck

  val eyebrow = when (action) {
    is NextLearningAction.OpenLesson -> {
      if (action.isFirstLesson) "START HERE · UNIT 1" else "UP NEXT · UNIT ${action.moduleNumber}"
    }
    is NextLearningAction.OpenUnitMasteryCheck -> "MASTERY CHECK READY · UNIT ${action.moduleNumber}"
    is NextLearningAction.AllMastered -> "C2 FLUENCY COMPLETE"
  }

  Surface(
    shape = RoundedCornerShape(16.dp),
    color = MaterialTheme.colorScheme.surface,
    border = BorderStroke(1.5.dp, if (isMasteryCheck) unitPalette.accent else marain.cardBorder),
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(18.dp),
      verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
      ) {
        Text(
          text = eyebrow,
          fontFamily = PlusJakartaSansFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 11.sp,
          letterSpacing = 0.8.sp,
          color = unitPalette.accent,
        )
        Text(
          text = "${rankProgress.currentTier.cefrCode} · ${rankProgress.currentTier.title}",
          style = MaterialTheme.typography.labelSmall,
          color = marain.inkMuted,
        )
      }

      Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
          text = rememberMarkdown(action.title),
          style = MaterialTheme.typography.headlineSmall,
          color = MaterialTheme.colorScheme.onSurface,
        )
        Text(
          text = action.subtitle,
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
      }

      TactileButton(
        onClick = onTriggerAction,
        fillColor = unitPalette.fill,
        lipColor = unitPalette.lip,
        contentColor = unitPalette.onFill,
        modifier = Modifier.fillMaxWidth(),
      ) {
        Icon(
          imageVector = if (isMasteryCheck) Icons.Rounded.Verified else Icons.Rounded.PlayArrow,
          contentDescription = null,
          modifier = Modifier.size(20.dp),
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
          text = action.ctaLabel,
          style = MaterialTheme.typography.labelLarge,
          fontWeight = FontWeight.Bold,
        )
        Spacer(modifier = Modifier.width(6.dp))
        Icon(
          imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
          contentDescription = null,
          modifier = Modifier.size(18.dp),
        )
      }

      // Clear Mastery Milestone Criteria Strip
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .clip(RoundedCornerShape(8.dp))
          .clickable(onClick = onOpenProgress)
          .padding(top = 2.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
      ) {
        Icon(
          imageVector = Icons.Rounded.EmojiEvents,
          contentDescription = null,
          tint = marain.streakAccent,
          modifier = Modifier.size(16.dp),
        )
        Text(
          text = rankProgress.nextRequirementLabel,
          style = MaterialTheme.typography.bodySmall,
          fontWeight = FontWeight.Medium,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
          modifier = Modifier.weight(1f),
        )
      }
    }
  }
}

@Composable
private fun HeaderInlineStat(
  icon: ImageVector,
  value: String,
  tint: Color,
  contentDescription: String,
) {
  Row(
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(3.dp),
  ) {
    Icon(
      imageVector = icon,
      contentDescription = contentDescription,
      tint = tint,
      modifier = Modifier.size(17.dp),
    )
    Text(
      text = value,
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 13.5.sp,
      color = MaterialTheme.colorScheme.onBackground,
    )
  }
}

@Composable
private fun EditorialUnitBanner(
  unit: CurriculumModule,
  unitStatus: UnitMasteryStatus,
  palette: UnitEditorialPalette,
  onOpenGuidebook: () -> Unit,
) {
  val statusTag = when {
    unitStatus.isUnitMastered -> " · MASTERED"
    unitStatus.isMasteryCheckReady -> " · CHECK READY"
    unit.isPhoneOnly -> " · ~${unit.estimatedMinutes} MIN"
    else -> ""
  }

  Box(
    modifier = Modifier
      .fillMaxWidth()
      .clip(RoundedCornerShape(16.dp))
      .background(palette.lip)
      .padding(bottom = 4.dp),
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .clip(RoundedCornerShape(16.dp))
        .background(palette.fill)
        .padding(horizontal = 18.dp, vertical = 16.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
      Column(
        modifier = Modifier.weight(1f),
        verticalArrangement = Arrangement.spacedBy(3.dp),
      ) {
        Text(
          text = "UNIT ${unit.number} · ${unitStatus.masteredLessonsCount} OF ${unitStatus.totalLessonsCount}$statusTag",
          fontFamily = PlusJakartaSansFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 11.sp,
          letterSpacing = 0.8.sp,
          color = palette.onFillMuted,
        )
        Text(
          text = rememberMarkdown(unit.title, codeColor = palette.onFill),
          fontFamily = LoraFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 19.sp,
          lineHeight = 24.sp,
          letterSpacing = (-0.3).sp,
          color = palette.onFill,
        )
        Text(
          text = rememberMarkdown(unit.subtitle, codeColor = palette.onFill),
          style = MaterialTheme.typography.bodySmall,
          color = palette.onFillMuted,
          maxLines = 1,
          overflow = TextOverflow.Ellipsis,
        )
      }

      Box(
        modifier = Modifier
          .size(44.dp)
          .clip(CircleShape)
          .background(Color.White.copy(alpha = 0.16f))
          .clickable(onClick = onOpenGuidebook),
        contentAlignment = Alignment.Center,
      ) {
        Icon(
          imageVector = Icons.AutoMirrored.Rounded.MenuBook,
          contentDescription = "Open Unit ${unit.number} Guidebook",
          tint = palette.onFill,
          modifier = Modifier.size(20.dp),
        )
      }
    }
  }
}

@Composable
private fun UnitCurvedPathSection(
  unit: CurriculumModule,
  chapters: List<Chapter>,
  unitStatus: UnitMasteryStatus,
  palette: UnitEditorialPalette,
  progress: UserProgress,
  activeChapterId: String?,
  isMasteryCheckActive: Boolean,
  onOpenChapter: (String) -> Unit,
  onOpenMasteryCheck: () -> Unit,
) {
  val marain = LocalMarainColors.current
  val masteryCheck = unit.masteryCheck?.takeIf { it.questions.isNotEmpty() }
  val totalNodes = chapters.size + if (masteryCheck != null) 1 else 0
  val totalHeight = NODE_TOP_INSET + NODE_STEP_HEIGHT * totalNodes

  BoxWithConstraints(
    modifier = Modifier
      .fillMaxWidth()
      .height(totalHeight),
  ) {
    val containerWidth = maxWidth
    val centerX = containerWidth / 2
    val trailColor = marain.cardBorder

    // Smooth cubic Bezier dashed trail linking consecutive node centers (lessons -> mastery check)
    Canvas(modifier = Modifier.fillMaxSize()) {
      val cxPx = size.width / 2f
      val nodeRadiusPx = (NODE_BUTTON_SIZE / 2).toPx()
      val topInsetPx = NODE_TOP_INSET.toPx()
      val stepHeightPx = NODE_STEP_HEIGHT.toPx()

      for (i in 0 until totalNodes - 1) {
        val x1 = cxPx + PATH_OFFSETS_DP[i % PATH_OFFSETS_DP.size].dp.toPx()
        val y1 = topInsetPx + i * stepHeightPx + nodeRadiusPx
        val x2 = cxPx + PATH_OFFSETS_DP[(i + 1) % PATH_OFFSETS_DP.size].dp.toPx()
        val y2 = topInsetPx + (i + 1) * stepHeightPx + nodeRadiusPx

        val isSegmentDone = i < chapters.size && ProgressEngine.isChapterMastered(progress, chapters[i])
        val strokeColor = if (isSegmentDone) palette.accent else trailColor

        val midY = (y1 + y2) / 2f
        val path = Path().apply {
          moveTo(x1, y1)
          cubicTo(x1, midY, x2, midY, x2, y2)
        }
        drawPath(
          path = path,
          color = strokeColor,
          style = Stroke(
            width = 3.dp.toPx(),
            cap = StrokeCap.Round,
            pathEffect = PathEffect.dashPathEffect(floatArrayOf(12f, 12f), 0f),
          ),
        )
      }
    }

    // Lesson Stepping-Stone Nodes
    chapters.forEachIndexed { idx, chapter ->
      val offsetX = PATH_OFFSETS_DP[idx % PATH_OFFSETS_DP.size].dp
      val nodeTopY = NODE_TOP_INSET + NODE_STEP_HEIGHT * idx
      val isMastered = ProgressEngine.isChapterMastered(progress, chapter)
      val hasFailedAttempt = !isMastered && chapter.id in progress.attemptedQuizChapterIds
      val isReadOnly = !isMastered && !hasFailedAttempt && chapter.id in progress.completedChapterIds
      val isActive = chapter.id == activeChapterId
      val bestScore = progress.quizBestScores[chapter.id]

      TactilePathNode(
        chapter = chapter,
        palette = palette,
        isMastered = isMastered,
        hasFailedAttempt = hasFailedAttempt,
        isReadOnly = isReadOnly,
        isActive = isActive,
        bestScore = bestScore,
        onClick = { onOpenChapter(chapter.id) },
        modifier = Modifier
          .width(208.dp)
          .offset(
            x = centerX + offsetX - 104.dp,
            y = nodeTopY - 38.dp,
          ),
      )
    }

    // Unit Mastery Check Capstone Node
    if (masteryCheck != null) {
      val idx = chapters.size
      val offsetX = PATH_OFFSETS_DP[idx % PATH_OFFSETS_DP.size].dp
      val nodeTopY = NODE_TOP_INSET + NODE_STEP_HEIGHT * idx

      TactileMasteryCheckNode(
        unitNumber = unit.number,
        masteryCheck = masteryCheck,
        unitStatus = unitStatus,
        palette = palette,
        isActive = isMasteryCheckActive,
        onClick = onOpenMasteryCheck,
        modifier = Modifier
          .width(220.dp)
          .offset(
            x = centerX + offsetX - 110.dp,
            y = nodeTopY - 38.dp,
          ),
      )
    }
  }
}

@Composable
private fun TactilePathNode(
  chapter: Chapter,
  palette: UnitEditorialPalette,
  isMastered: Boolean,
  hasFailedAttempt: Boolean,
  isReadOnly: Boolean,
  isActive: Boolean,
  bestScore: Int?,
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val interaction = remember { MutableInteractionSource() }
  val isPressed by interaction.collectIsPressedAsState()

  val infinite = rememberInfiniteTransition(label = "activeHalo")
  val haloScale by infinite.animateFloat(
    initialValue = 1.0f,
    targetValue = 1.12f,
    animationSpec = infiniteRepeatable(
      animation = tween(durationMillis = 1350, easing = FastOutSlowInEasing),
      repeatMode = RepeatMode.Reverse,
    ),
    label = "halo",
  )

  val lipDepth = if (isActive || isMastered) 6.dp else 4.dp
  val pressShift by animateDpAsState(
    targetValue = if (isPressed) lipDepth - 1.dp else 0.dp,
    animationSpec = tween(durationMillis = 70),
    label = "nodePress",
  )

  val faceColor = when {
    isMastered -> marain.masteredGold
    isActive || isReadOnly -> palette.fill
    hasFailedAttempt -> marain.wrongContainer
    else -> MaterialTheme.colorScheme.surface
  }
  val lipColor = when {
    isMastered -> marain.masteredGoldLip
    isActive || isReadOnly -> palette.lip
    hasFailedAttempt -> marain.wrongAccent
    else -> marain.neutralLip
  }

  Column(
    modifier = modifier,
    horizontalAlignment = Alignment.CenterHorizontally,
  ) {
    Box(
      modifier = Modifier.height(34.dp),
      contentAlignment = Alignment.BottomCenter,
    ) {
      if (isActive) {
        ActiveTooltipBadge(
          label = when {
            hasFailedAttempt -> "RETRY"
            isReadOnly -> "CHECK"
            else -> "START"
          },
          accentColor = palette.accent,
        )
      }
    }

    Spacer(modifier = Modifier.height(4.dp))

    Box(
      modifier = Modifier.size(NODE_BUTTON_SIZE + 10.dp),
      contentAlignment = Alignment.Center,
    ) {
      if (isActive) {
        Box(
          modifier = Modifier
            .size(NODE_BUTTON_SIZE + 8.dp)
            .scale(haloScale)
            .clip(CircleShape)
            .border(width = 2.5.dp, color = palette.accent.copy(alpha = 0.45f), shape = CircleShape),
        )
      }

      Box(
        modifier = Modifier
          .size(width = NODE_BUTTON_SIZE, height = NODE_BUTTON_SIZE + lipDepth)
          .clickable(
            interactionSource = interaction,
            indication = null,
            onClick = onClick,
          ),
      ) {
        Box(
          modifier = Modifier
            .size(NODE_BUTTON_SIZE)
            .align(Alignment.BottomCenter)
            .clip(CircleShape)
            .background(lipColor),
        )

        Surface(
          modifier = Modifier
            .size(NODE_BUTTON_SIZE)
            .padding(top = pressShift),
          shape = CircleShape,
          color = faceColor,
          border = when {
            hasFailedAttempt -> BorderStroke(2.dp, marain.wrongAccent)
            !isMastered && !isActive && !isReadOnly -> BorderStroke(2.dp, marain.cardBorder)
            else -> null
          },
        ) {
          Box(contentAlignment = Alignment.Center) {
            when {
              isMastered -> Icon(
                imageVector = Icons.Rounded.Star,
                contentDescription = "Mastered lesson",
                tint = marain.onMasteredGold,
                modifier = Modifier.size(30.dp),
              )
              hasFailedAttempt -> Icon(
                imageVector = Icons.Rounded.Replay,
                contentDescription = "Retry practice check",
                tint = marain.wrongAccent,
                modifier = Modifier.size(28.dp),
              )
              isActive && isReadOnly -> Icon(
                imageVector = Icons.Rounded.Quiz,
                contentDescription = "Take practice check",
                tint = palette.onFill,
                modifier = Modifier.size(27.dp),
              )
              isActive -> Icon(
                imageVector = Icons.Rounded.PlayArrow,
                contentDescription = "Start lesson",
                tint = palette.onFill,
                modifier = Modifier.size(34.dp),
              )
              isReadOnly -> Icon(
                imageVector = Icons.Rounded.Check,
                contentDescription = "Chapter read",
                tint = palette.onFill,
                modifier = Modifier.size(28.dp),
              )
              else -> Text(
                text = chapter.number.toString(),
                fontFamily = PlusJakartaSansFontFamily,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 20.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
              )
            }
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(6.dp))

    val (caption, captionColor) = when {
      isMastered && bestScore != null -> "Mastered · $bestScore/${chapter.quiz.size}" to marain.streakAccent
      isMastered -> "Mastered" to marain.streakAccent
      hasFailedAttempt -> "Retry check (≥${ProgressEngine.LESSON_PASS_PERCENT}%)" to marain.wrongAccent
      isReadOnly -> "Read · Check ready" to palette.accent
      else -> "${chapter.readMinutes} min read" to marain.inkMuted
    }
    Column(
      modifier = Modifier
        .clip(RoundedCornerShape(8.dp))
        .background(MaterialTheme.colorScheme.background.copy(alpha = 0.94f))
        .padding(horizontal = 8.dp, vertical = 3.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
      Text(
        text = rememberMarkdown(chapter.title),
        fontFamily = PlusJakartaSansFontFamily,
        fontWeight = if (isActive) FontWeight.Bold else FontWeight.SemiBold,
        fontSize = 13.sp,
        lineHeight = 17.sp,
        color = if (isActive || isMastered) MaterialTheme.colorScheme.onBackground else MaterialTheme.colorScheme.onSurface,
        textAlign = TextAlign.Center,
        maxLines = 2,
        overflow = TextOverflow.Ellipsis,
      )

      Text(
        text = caption,
        fontFamily = PlusJakartaSansFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 11.5.sp,
        color = captionColor,
        textAlign = TextAlign.Center,
      )
    }
  }
}

@Composable
private fun TactileMasteryCheckNode(
  unitNumber: Int,
  masteryCheck: MasteryCheck,
  unitStatus: UnitMasteryStatus,
  palette: UnitEditorialPalette,
  isActive: Boolean,
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val interaction = remember { MutableInteractionSource() }
  val isPressed by interaction.collectIsPressedAsState()

  val infinite = rememberInfiniteTransition(label = "masteryHalo")
  val haloScale by infinite.animateFloat(
    initialValue = 1.0f,
    targetValue = 1.10f,
    animationSpec = infiniteRepeatable(
      animation = tween(durationMillis = 1350, easing = FastOutSlowInEasing),
      repeatMode = RepeatMode.Reverse,
    ),
    label = "masteryHaloScale",
  )

  val isPassed = unitStatus.isMasteryCheckPassed
  val isReady = unitStatus.isMasteryCheckReady || isActive
  val lipDepth = if (isPassed || isReady) 6.dp else 4.dp
  val pressShift by animateDpAsState(
    targetValue = if (isPressed) lipDepth - 1.dp else 0.dp,
    animationSpec = tween(durationMillis = 70),
    label = "masteryNodePress",
  )

  val faceColor = when {
    isPassed -> marain.masteredGold
    isReady -> palette.fill
    else -> MaterialTheme.colorScheme.surface
  }
  val lipColor = when {
    isPassed -> marain.masteredGoldLip
    isReady -> palette.lip
    else -> marain.neutralLip
  }

  Column(
    modifier = modifier,
    horizontalAlignment = Alignment.CenterHorizontally,
  ) {
    Box(
      modifier = Modifier.height(34.dp),
      contentAlignment = Alignment.BottomCenter,
    ) {
      if (isReady && !isPassed) {
        ActiveTooltipBadge(
          label = "MASTERY CHECK",
          accentColor = palette.accent,
        )
      }
    }

    Spacer(modifier = Modifier.height(4.dp))

    Box(
      modifier = Modifier.size(NODE_BUTTON_SIZE + 10.dp),
      contentAlignment = Alignment.Center,
    ) {
      if (isReady && !isPassed) {
        Box(
          modifier = Modifier
            .size(NODE_BUTTON_SIZE + 8.dp)
            .scale(haloScale)
            .clip(RoundedCornerShape(24.dp))
            .border(
              width = 2.5.dp,
              color = palette.accent.copy(alpha = 0.50f),
              shape = RoundedCornerShape(24.dp),
            ),
        )
      }

      Box(
        modifier = Modifier
          .size(width = NODE_BUTTON_SIZE, height = NODE_BUTTON_SIZE + lipDepth)
          .clickable(
            interactionSource = interaction,
            indication = null,
            onClick = onClick,
          ),
      ) {
        Box(
          modifier = Modifier
            .size(NODE_BUTTON_SIZE)
            .align(Alignment.BottomCenter)
            .clip(RoundedCornerShape(22.dp))
            .background(lipColor),
        )

        Surface(
          modifier = Modifier
            .size(NODE_BUTTON_SIZE)
            .padding(top = pressShift),
          shape = RoundedCornerShape(22.dp),
          color = faceColor,
          border = if (!isPassed && !isReady) {
            BorderStroke(2.dp, marain.cardBorder)
          } else {
            null
          },
        ) {
          Box(contentAlignment = Alignment.Center) {
            Icon(
              imageVector = if (isPassed) Icons.Rounded.Verified else Icons.Rounded.EmojiEvents,
              contentDescription = "Unit $unitNumber Mastery Check",
              tint = when {
                isPassed -> marain.onMasteredGold
                isReady -> palette.onFill
                else -> MaterialTheme.colorScheme.onSurfaceVariant
              },
              modifier = Modifier.size(30.dp),
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(6.dp))

    val (caption, captionColor) = when {
      isPassed && unitStatus.masteryBestPercent != null -> {
        "Mastered · Best ${unitStatus.masteryBestPercent}%" to marain.streakAccent
      }
      isPassed -> "Unit Mastered" to marain.streakAccent
      isReady -> "${masteryCheck.questions.size} Qs · ≥${masteryCheck.passingScorePercent}% to master" to palette.accent
      else -> "${masteryCheck.questions.size} Qs · ≥${masteryCheck.passingScorePercent}% to pass" to marain.inkMuted
    }
    Column(
      modifier = Modifier
        .clip(RoundedCornerShape(8.dp))
        .background(MaterialTheme.colorScheme.background.copy(alpha = 0.94f))
        .padding(horizontal = 8.dp, vertical = 3.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
      Text(
        text = "Unit $unitNumber Mastery Check",
        fontFamily = PlusJakartaSansFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 13.sp,
        lineHeight = 17.sp,
        color = if (isReady || isPassed) MaterialTheme.colorScheme.onBackground else MaterialTheme.colorScheme.onSurface,
        textAlign = TextAlign.Center,
        maxLines = 2,
        overflow = TextOverflow.Ellipsis,
      )

      Text(
        text = caption,
        fontFamily = PlusJakartaSansFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 11.5.sp,
        color = captionColor,
        textAlign = TextAlign.Center,
      )
    }
  }
}

@Composable
private fun ActiveTooltipBadge(
  label: String,
  accentColor: Color,
) {
  val marain = LocalMarainColors.current
  val surfaceColor = MaterialTheme.colorScheme.surface

  Column(horizontalAlignment = Alignment.CenterHorizontally) {
    Surface(
      shape = RoundedCornerShape(8.dp),
      color = surfaceColor,
      border = BorderStroke(1.5.dp, marain.cardBorder),
      shadowElevation = 2.dp,
    ) {
      Text(
        text = label,
        fontFamily = PlusJakartaSansFontFamily,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 11.sp,
        letterSpacing = 0.8.sp,
        color = accentColor,
        modifier = Modifier.padding(horizontal = 12.dp, vertical = 5.dp),
      )
    }
    Canvas(modifier = Modifier.size(width = 12.dp, height = 6.dp)) {
      val triangle = Path().apply {
        moveTo(0f, 0f)
        lineTo(size.width, 0f)
        lineTo(size.width / 2f, size.height)
        close()
      }
      drawPath(path = triangle, color = surfaceColor)
      drawLine(
        color = marain.cardBorder,
        start = Offset(0f, 0f),
        end = Offset(size.width / 2f, size.height),
        strokeWidth = 1.5.dp.toPx(),
      )
      drawLine(
        color = marain.cardBorder,
        start = Offset(size.width, 0f),
        end = Offset(size.width / 2f, size.height),
        strokeWidth = 1.5.dp.toPx(),
      )
    }
  }
}
