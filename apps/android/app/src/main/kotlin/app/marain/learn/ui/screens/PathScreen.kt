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
import androidx.compose.material.icons.automirrored.rounded.MenuBook
import androidx.compose.material.icons.rounded.Bolt
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.LocalFireDepartment
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Quiz
import androidx.compose.material.icons.rounded.Star
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
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.ui.components.EditorialProgressBar
import app.marain.learn.ui.components.rememberMarkdown
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.LoraFontFamily
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily
import app.marain.learn.ui.theme.UnitEditorialPalette
import app.marain.learn.ui.theme.editorialUnitPalette

private val PATH_OFFSETS_DP = listOf(0, 56, 0, -56)
private val NODE_STEP_HEIGHT = 152.dp
private val NODE_TOP_INSET = 42.dp
private val NODE_BUTTON_SIZE = 72.dp

@Composable
fun PathScreen(
  curriculum: Curriculum,
  progress: UserProgress,
  todayEpochDay: Long,
  onOpenGuidebook: (String) -> Unit,
  onOpenChapter: (String) -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val effectiveStreak = ProgressEngine.effectiveStreakDays(progress, todayEpochDay)
  val rankProgress = ProgressEngine.fluencyRankForXp(progress.totalXp)
  val todayXp = ProgressEngine.todayXpEarned(progress, todayEpochDay)
  val dailyFraction = ProgressEngine.dailyGoalFraction(progress, todayEpochDay)
  val dailyGoalHit = ProgressEngine.isDailyGoalReached(progress, todayEpochDay)
  val activeChapterId = ProgressEngine.nextActiveChapter(progress, curriculum)?.id
  val orderedUnits = curriculum.modules.sortedBy { it.number }

  Column(modifier = modifier.fillMaxSize()) {
    // 1. Compact Borderless Top Header (NO card box, NO pastel pill soup)
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
          shape = RoundedCornerShape(6.dp),
          color = Color.Transparent,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Text(
            text = rankProgress.currentTier.cefrCode,
            fontFamily = PlusJakartaSansFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 11.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
          )
        }
      }

      // Clean inline tabular stats directly on header bar
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
          contentDescription = "Total XP",
        )
        HeaderInlineStat(
          icon = Icons.Rounded.Favorite,
          value = "${ProgressEngine.MAX_HEARTS}",
          tint = marain.heartAccent,
          contentDescription = "Hearts",
        )
      }
    }
    HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)

    // Scrollable Path Feed
    LazyColumn(
      modifier = Modifier.fillMaxSize(),
      contentPadding = PaddingValues(bottom = 24.dp),
    ) {
      // 2. Slim Borderless Daily Goal Strip (NO card wrapper)
      item(key = "daily_goal_strip") {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
          verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Text(
              text = if (dailyGoalHit) "Today's goal complete" else "Today's goal",
              style = MaterialTheme.typography.bodySmall,
              fontWeight = FontWeight.Medium,
              color = if (dailyGoalHit) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
              text = "$todayXp / ${ProgressEngine.DAILY_GOAL_XP} XP",
              style = MaterialTheme.typography.labelMedium,
              fontWeight = FontWeight.Bold,
              color = MaterialTheme.colorScheme.onBackground,
            )
          }
          EditorialProgressBar(
            progress = dailyFraction,
            fillColor = MaterialTheme.colorScheme.primary,
            height = 4.dp,
            trackColor = marain.cardBorder,
          )
        }
      }

      // 3. 7 Editorial Units + Smooth Curved Bezier Tactile Stepping-Stone Paths
      orderedUnits.forEach { unit ->
        val palette = editorialUnitPalette(unit.number)
        val completedInUnit = unit.chapters.count { it.id in progress.completedQuizChapterIds }
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
              palette = palette,
              completedCount = completedInUnit,
              onOpenGuidebook = { onOpenGuidebook(unit.id) },
            )
          }
        }

        item(key = "unit_path_${unit.id}") {
          UnitCurvedPathSection(
            chapters = orderedChapters,
            palette = palette,
            progress = progress,
            activeChapterId = activeChapterId,
            onOpenChapter = onOpenChapter,
          )
        }
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
  palette: UnitEditorialPalette,
  completedCount: Int,
  onOpenGuidebook: () -> Unit,
) {
  val total = unit.chapters.size
  // Tactile banner with crisp 4.dp darker bottom lip
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
          text = "UNIT ${unit.number} · $completedCount OF $total",
          fontFamily = PlusJakartaSansFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 11.sp,
          letterSpacing = 0.8.sp,
          color = Color.White.copy(alpha = 0.78f),
        )
        Text(
          text = rememberMarkdown(unit.title),
          fontFamily = LoraFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 19.sp,
          lineHeight = 24.sp,
          letterSpacing = (-0.3).sp,
          color = Color.White,
        )
        Text(
          text = rememberMarkdown(unit.subtitle),
          style = MaterialTheme.typography.bodySmall,
          color = Color.White.copy(alpha = 0.80f),
          maxLines = 1,
          overflow = TextOverflow.Ellipsis,
        )
      }

      // Clean circular 44.dp Guidebook icon button — zero clunky box border
      Box(
        modifier = Modifier
          .size(44.dp)
          .clip(CircleShape)
          .background(Color.White.copy(alpha = 0.14f))
          .clickable(onClick = onOpenGuidebook),
        contentAlignment = Alignment.Center,
      ) {
        Icon(
          imageVector = Icons.AutoMirrored.Rounded.MenuBook,
          contentDescription = "Open Unit ${unit.number} Guidebook",
          tint = Color.White,
          modifier = Modifier.size(20.dp),
        )
      }
    }
  }
}

@Composable
private fun UnitCurvedPathSection(
  chapters: List<Chapter>,
  palette: UnitEditorialPalette,
  progress: UserProgress,
  activeChapterId: String?,
  onOpenChapter: (String) -> Unit,
) {
  val marain = LocalMarainColors.current
  val totalHeight = NODE_TOP_INSET + NODE_STEP_HEIGHT * chapters.size

  BoxWithConstraints(
    modifier = Modifier
      .fillMaxWidth()
      .height(totalHeight),
  ) {
    val containerWidth = maxWidth
    val centerX = containerWidth / 2
    val trailColor = marain.cardBorder

    // Smooth cubic Bezier dashed trail linking consecutive node centers
    Canvas(modifier = Modifier.fillMaxSize()) {
      val cxPx = size.width / 2f
      val nodeRadiusPx = (NODE_BUTTON_SIZE / 2).toPx()
      val topInsetPx = NODE_TOP_INSET.toPx()
      val stepHeightPx = NODE_STEP_HEIGHT.toPx()

      for (i in 0 until chapters.lastIndex) {
        val x1 = cxPx + PATH_OFFSETS_DP[i % PATH_OFFSETS_DP.size].dp.toPx()
        val y1 = topInsetPx + i * stepHeightPx + nodeRadiusPx
        val x2 = cxPx + PATH_OFFSETS_DP[(i + 1) % PATH_OFFSETS_DP.size].dp.toPx()
        val y2 = topInsetPx + (i + 1) * stepHeightPx + nodeRadiusPx

        val isSegmentDone = chapters[i].id in progress.completedQuizChapterIds
        val strokeColor = if (isSegmentDone) palette.fill.copy(alpha = 0.45f) else trailColor

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

    // Tactile 3D Stepping-Stone Lesson Nodes
    chapters.forEachIndexed { idx, chapter ->
      val offsetX = PATH_OFFSETS_DP[idx % PATH_OFFSETS_DP.size].dp
      val nodeTopY = NODE_TOP_INSET + NODE_STEP_HEIGHT * idx
      val isMastered = chapter.id in progress.completedQuizChapterIds
      val isReadOnly = !isMastered && chapter.id in progress.completedChapterIds
      val isActive = chapter.id == activeChapterId

      TactilePathNode(
        chapter = chapter,
        palette = palette,
        isMastered = isMastered,
        isReadOnly = isReadOnly,
        isActive = isActive,
        onClick = { onOpenChapter(chapter.id) },
        modifier = Modifier
          .width(204.dp)
          .offset(
            x = centerX + offsetX - 102.dp,
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
  isReadOnly: Boolean,
  isActive: Boolean,
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
    isActive -> palette.fill
    isReadOnly -> palette.fill.copy(alpha = 0.88f)
    else -> MaterialTheme.colorScheme.surface
  }
  val lipColor = when {
    isMastered -> marain.masteredGoldLip
    isActive || isReadOnly -> palette.lip
    else -> marain.neutralLip
  }

  Column(
    modifier = modifier,
    horizontalAlignment = Alignment.CenterHorizontally,
  ) {
    // Tooltip slot (fixed 34.dp height so node circle always lands cleanly at exact Bezier anchor)
    Box(
      modifier = Modifier.height(34.dp),
      contentAlignment = Alignment.BottomCenter,
    ) {
      if (isActive) {
        ActiveTooltipBadge(
          label = if (isReadOnly) "QUIZ" else "START",
          accentColor = palette.fill,
        )
      }
    }

    Spacer(modifier = Modifier.height(4.dp))

    // Chunky 72.dp 3D tactile circular button
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
            .border(width = 2.5.dp, color = palette.fill.copy(alpha = 0.28f), shape = CircleShape),
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
        // Solid darker 3D bottom lip
        Box(
          modifier = Modifier
            .size(NODE_BUTTON_SIZE)
            .align(Alignment.BottomCenter)
            .clip(CircleShape)
            .background(lipColor),
        )

        // Raised tactile circle face
        Surface(
          modifier = Modifier
            .size(NODE_BUTTON_SIZE)
            .padding(top = pressShift),
          shape = CircleShape,
          color = faceColor,
          border = if (!isMastered && !isActive && !isReadOnly) {
            BorderStroke(2.dp, marain.cardBorder)
          } else {
            null
          },
        ) {
          Box(contentAlignment = Alignment.Center) {
            when {
              isMastered -> Icon(
                imageVector = Icons.Rounded.Star,
                contentDescription = "Mastered lesson",
                tint = Color.White,
                modifier = Modifier.size(30.dp),
              )
              isActive && isReadOnly -> Icon(
                imageVector = Icons.Rounded.Quiz,
                contentDescription = "Take practice drill",
                tint = Color.White,
                modifier = Modifier.size(27.dp),
              )
              isActive -> Icon(
                imageVector = Icons.Rounded.PlayArrow,
                contentDescription = "Start lesson",
                tint = Color.White,
                modifier = Modifier.size(34.dp),
              )
              isReadOnly -> Icon(
                imageVector = Icons.Rounded.Check,
                contentDescription = "Chapter read",
                tint = Color.White,
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
      modifier = Modifier.padding(horizontal = 6.dp),
    )

    Spacer(modifier = Modifier.height(2.dp))

    val caption = when {
      isMastered -> "Mastered · ${chapter.xpReward} XP"
      isReadOnly -> "Read · Drill ready"
      else -> "${chapter.readMinutes} min · ${chapter.xpReward} XP"
    }
    Text(
      text = caption,
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Medium,
      fontSize = 11.5.sp,
      color = if (isMastered) marain.streakAccent else marain.inkMuted,
      textAlign = TextAlign.Center,
    )
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
    // Crisp downward triangle pointer pointing cleanly at active button
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
