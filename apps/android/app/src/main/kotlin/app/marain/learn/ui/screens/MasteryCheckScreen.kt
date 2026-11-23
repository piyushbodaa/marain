package app.marain.learn.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Cancel
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.EmojiEvents
import androidx.compose.material.icons.rounded.Replay
import androidx.compose.material.icons.rounded.Verified
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.MasteryCheckOutcome
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.Curriculum
import app.marain.learn.data.model.CurriculumModule
import app.marain.learn.data.model.MasteryCheck
import app.marain.learn.data.model.QuizQuestion
import app.marain.learn.ui.components.TactileButton
import app.marain.learn.ui.components.rememberMarkdown
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily
import app.marain.learn.ui.theme.editorialUnitPalette

@Composable
fun MasteryCheckScreen(
  curriculum: Curriculum,
  module: CurriculumModule,
  onClose: () -> Unit,
  onCompleteMasteryCheck: (correctCount: Int, totalQuestions: Int) -> MasteryCheckOutcome,
  onContinueToNextLesson: (String) -> Unit,
  onReviewModule: (String) -> Unit,
  onOpenProgress: () -> Unit,
  modifier: Modifier = Modifier,
  initialOutcome: MasteryCheckOutcome? = null,
) {
  val marain = LocalMarainColors.current
  val unitPalette = editorialUnitPalette(module.number, isDark = marain.isDark)
  val masteryCheck = module.masteryCheck
  val questions = masteryCheck?.questions.orEmpty()

  var currentIndex by remember(module.id) { mutableIntStateOf(0) }
  var selectedOption by remember(module.id) { mutableStateOf<Int?>(null) }
  var hasChecked by remember(module.id) { mutableStateOf(false) }
  var correctCount by remember(module.id) { mutableIntStateOf(0) }
  val resultsPerQuestion = remember(module.id) { mutableStateListOf<Boolean>() }
  val missedQuestions = remember(module.id) { mutableStateListOf<QuizQuestion>() }
  var outcome by remember(module.id) { mutableStateOf(initialOutcome) }

  val nextUnit = remember(module.id, curriculum) {
    curriculum.orderedModules().firstOrNull { it.number > module.number }
  }
  val nextUnitFirstChapter: Chapter? = remember(nextUnit) {
    nextUnit?.chapters?.minByOrNull { it.number }
  }

  val finishedOutcome = outcome
  if (finishedOutcome != null && masteryCheck != null) {
    MasteryCheckResultScreen(
      module = module,
      masteryCheck = masteryCheck,
      outcome = finishedOutcome,
      missedQuestions = missedQuestions.toList(),
      nextUnit = nextUnit,
      nextUnitFirstChapter = nextUnitFirstChapter,
      onContinueToNextLesson = onContinueToNextLesson,
      onReviewModule = { onReviewModule(module.id) },
      onOpenProgress = onOpenProgress,
      onBackToPath = onClose,
      onRetry = {
        currentIndex = 0
        selectedOption = null
        hasChecked = false
        correctCount = 0
        resultsPerQuestion.clear()
        missedQuestions.clear()
        outcome = null
      },
      modifier = modifier,
    )
    return
  }

  if (masteryCheck == null || questions.isEmpty()) {
    onClose()
    return
  }

  val question = questions[currentIndex]
  val isSelectedCorrect = selectedOption == question.correctIndex

  fun advanceOrFinish() {
    if (currentIndex + 1 < questions.size) {
      currentIndex += 1
      selectedOption = null
      hasChecked = false
    } else {
      outcome = onCompleteMasteryCheck(correctCount, questions.size)
    }
  }

  Scaffold(
    modifier = modifier.fillMaxSize(),
    containerColor = MaterialTheme.colorScheme.background,
    topBar = {
      Column {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .padding(horizontal = 12.dp, vertical = 10.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          IconButton(onClick = onClose) {
            Icon(
              imageVector = Icons.Rounded.Close,
              contentDescription = "Close mastery check",
              tint = MaterialTheme.colorScheme.onBackground,
            )
          }

          // Segmented progress track reflecting exact right/wrong mastery check status
          Row(
            modifier = Modifier.weight(1f),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
          ) {
            questions.indices.forEach { idx ->
              val segmentColor = when {
                idx < resultsPerQuestion.size -> {
                  if (resultsPerQuestion[idx]) marain.correctAccent else marain.wrongAccent
                }
                idx == currentIndex -> unitPalette.accent
                else -> marain.cardBorder
              }
              Box(
                modifier = Modifier
                  .weight(1f)
                  .height(8.dp)
                  .clip(RoundedCornerShape(999.dp))
                  .background(segmentColor),
              )
            }
          }

          Surface(
            modifier = Modifier.padding(end = 8.dp),
            shape = RoundedCornerShape(8.dp),
            color = MaterialTheme.colorScheme.surface,
            border = BorderStroke(1.dp, marain.cardBorder),
          ) {
            Text(
              text = "Pass ${masteryCheck.minCorrectToPass}/${questions.size}",
              fontFamily = PlusJakartaSansFontFamily,
              fontWeight = FontWeight.Bold,
              fontSize = 11.5.sp,
              color = MaterialTheme.colorScheme.onSurface,
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            )
          }
        }
      }
    },
    bottomBar = {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .background(MaterialTheme.colorScheme.background)
          .navigationBarsPadding(),
      ) {
        AnimatedVisibility(
          visible = hasChecked,
          enter = slideInVertically(initialOffsetY = { it / 2 }) + fadeIn(),
        ) {
          val bannerBg = if (isSelectedCorrect) marain.correctContainer else marain.wrongContainer
          val bannerInk = if (isSelectedCorrect) marain.onCorrectContainer else marain.onWrongContainer
          val bannerAccent = if (isSelectedCorrect) marain.correctAccent else marain.wrongAccent
          val bannerLip = if (isSelectedCorrect) marain.correctLip else marain.wrongLip
          val bannerButtonInk = if (isSelectedCorrect) marain.onCorrectAccent else marain.onWrongAccent

          Surface(
            modifier = Modifier.fillMaxWidth(),
            color = bannerBg,
          ) {
            Column(modifier = Modifier.fillMaxWidth()) {
              HorizontalDivider(thickness = 1.dp, color = bannerAccent)
              Column(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(horizontal = 20.dp, vertical = 18.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
              ) {
                Row(
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                  Icon(
                    imageVector = if (isSelectedCorrect) Icons.Rounded.CheckCircle else Icons.Rounded.Cancel,
                    contentDescription = null,
                    tint = bannerAccent,
                    modifier = Modifier.size(22.dp),
                  )
                  Text(
                    text = if (isSelectedCorrect) "Correct" else "Not quite",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = bannerInk,
                  )
                }

                Text(
                  text = rememberMarkdown(question.explanation, codeColor = bannerInk),
                  style = MaterialTheme.typography.bodyMedium,
                  color = bannerInk,
                )

                TactileButton(
                  onClick = { advanceOrFinish() },
                  fillColor = bannerAccent,
                  lipColor = bannerLip,
                  contentColor = bannerButtonInk,
                  modifier = Modifier.fillMaxWidth(),
                ) {
                  Text(
                    text = if (currentIndex + 1 < questions.size) "Next Question" else "See Mastery Result",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                  )
                }
              }
            }
          }
        }

        if (!hasChecked) {
          Column(modifier = Modifier.fillMaxWidth()) {
            HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
            Box(
              modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 14.dp),
            ) {
              TactileButton(
                onClick = {
                  val chosen = selectedOption ?: return@TactileButton
                  val right = chosen == question.correctIndex
                  if (right) {
                    correctCount += 1
                  } else {
                    missedQuestions.add(question)
                  }
                  resultsPerQuestion.add(right)
                  hasChecked = true
                },
                enabled = selectedOption != null,
                fillColor = unitPalette.fill,
                lipColor = unitPalette.lip,
                contentColor = unitPalette.onFill,
                modifier = Modifier.fillMaxWidth(),
              ) {
                Text(
                  text = "Check Answer",
                  style = MaterialTheme.typography.labelLarge,
                  fontWeight = FontWeight.Bold,
                )
              }
            }
          }
        }
      }
    },
  ) { innerPadding ->
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
        .verticalScroll(rememberScrollState())
        .padding(horizontal = 20.dp, vertical = 12.dp),
      verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
      ) {
        Text(
          text = "UNIT ${module.number} MASTERY CHECK · Q${currentIndex + 1} OF ${questions.size}",
          style = MaterialTheme.typography.labelSmall,
          color = unitPalette.accent,
        )
        Text(
          text = "$correctCount right",
          style = MaterialTheme.typography.labelMedium,
          color = marain.inkMuted,
        )
      }

      Text(
        text = rememberMarkdown(question.question),
        style = MaterialTheme.typography.headlineMedium,
        color = MaterialTheme.colorScheme.onBackground,
      )

      Spacer(modifier = Modifier.height(2.dp))

      Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        question.options.forEachIndexed { idx, optionText ->
          MasteryOptionCard(
            letter = ('A' + idx).toString(),
            optionText = optionText,
            isChosen = selectedOption == idx,
            isCorrectOption = idx == question.correctIndex,
            hasChecked = hasChecked,
            onClick = { selectedOption = idx },
          )
        }
      }

      Spacer(modifier = Modifier.height(16.dp))
    }
  }
}

@Composable
private fun MasteryOptionCard(
  letter: String,
  optionText: String,
  isChosen: Boolean,
  isCorrectOption: Boolean,
  hasChecked: Boolean,
  onClick: () -> Unit,
) {
  val marain = LocalMarainColors.current
  val interaction = remember { MutableInteractionSource() }
  val isPressed by interaction.collectIsPressedAsState()

  val borderColor = when {
    hasChecked && isCorrectOption -> marain.correctAccent
    hasChecked && isChosen && !isCorrectOption -> marain.wrongAccent
    isChosen -> MaterialTheme.colorScheme.primary
    else -> marain.cardBorder
  }
  val lipColor = when {
    hasChecked && isCorrectOption -> marain.correctAccent
    hasChecked && isChosen && !isCorrectOption -> marain.wrongAccent
    isChosen -> MaterialTheme.colorScheme.primary
    else -> marain.neutralLip
  }
  val faceColor = when {
    hasChecked && isCorrectOption -> marain.correctContainer
    hasChecked && isChosen && !isCorrectOption -> marain.wrongContainer
    isChosen -> MaterialTheme.colorScheme.primaryContainer
    else -> MaterialTheme.colorScheme.surface
  }

  val isFlattened = isChosen || isPressed || (hasChecked && isCorrectOption)
  val lipDepth by animateDpAsState(
    targetValue = if (isFlattened) 1.dp else 4.dp,
    animationSpec = tween(durationMillis = 80),
    label = "masteryOptionLip",
  )

  Box(
    modifier = Modifier
      .fillMaxWidth()
      .padding(top = 4.dp - lipDepth)
      .clip(RoundedCornerShape(14.dp))
      .background(lipColor)
      .padding(bottom = lipDepth)
      .clickable(
        interactionSource = interaction,
        indication = null,
        enabled = !hasChecked,
        onClick = onClick,
      ),
  ) {
    Surface(
      modifier = Modifier.fillMaxWidth(),
      shape = RoundedCornerShape(14.dp),
      color = faceColor,
      border = BorderStroke(
        width = if (isChosen || (hasChecked && isCorrectOption)) 1.8.dp else 1.5.dp,
        color = borderColor,
      ),
    ) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 15.dp, vertical = 15.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(13.dp),
      ) {
        Surface(
          modifier = Modifier.size(28.dp),
          shape = RoundedCornerShape(7.dp),
          color = when {
            hasChecked && isCorrectOption -> marain.correctAccent
            hasChecked && isChosen && !isCorrectOption -> marain.wrongAccent
            isChosen -> MaterialTheme.colorScheme.primary
            else -> Color.Transparent
          },
          border = if (!isChosen && !(hasChecked && isCorrectOption)) {
            BorderStroke(1.dp, marain.cardBorder)
          } else {
            null
          },
        ) {
          Box(contentAlignment = Alignment.Center) {
            Text(
              text = letter,
              fontFamily = PlusJakartaSansFontFamily,
              fontWeight = FontWeight.Bold,
              fontSize = 12.5.sp,
              color = when {
                hasChecked && isCorrectOption -> marain.onCorrectAccent
                hasChecked && isChosen && !isCorrectOption -> marain.onWrongAccent
                isChosen -> MaterialTheme.colorScheme.onPrimary
                else -> MaterialTheme.colorScheme.onSurfaceVariant
              },
            )
          }
        }

        Text(
          text = rememberMarkdown(optionText),
          style = MaterialTheme.typography.bodyLarge,
          color = MaterialTheme.colorScheme.onSurface,
          modifier = Modifier.weight(1f),
        )

        if (hasChecked && isCorrectOption) {
          Icon(
            imageVector = Icons.Rounded.CheckCircle,
            contentDescription = "Correct",
            tint = marain.correctAccent,
            modifier = Modifier.size(20.dp),
          )
        } else if (hasChecked && isChosen && !isCorrectOption) {
          Icon(
            imageVector = Icons.Rounded.Cancel,
            contentDescription = "Incorrect",
            tint = marain.wrongAccent,
            modifier = Modifier.size(20.dp),
          )
        }
      }
    }
  }
}

@Composable
internal fun MasteryCheckResultScreen(
  module: CurriculumModule,
  masteryCheck: MasteryCheck,
  outcome: MasteryCheckOutcome,
  missedQuestions: List<QuizQuestion>,
  nextUnit: CurriculumModule?,
  nextUnitFirstChapter: Chapter?,
  onContinueToNextLesson: (String) -> Unit,
  onReviewModule: () -> Unit,
  onOpenProgress: () -> Unit,
  onBackToPath: () -> Unit,
  onRetry: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val unitPalette = editorialUnitPalette(module.number, isDark = marain.isDark)

  Surface(
    modifier = modifier.fillMaxSize(),
    color = MaterialTheme.colorScheme.background,
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
        .statusBarsPadding()
        .padding(horizontal = 24.dp, vertical = 28.dp)
        .navigationBarsPadding(),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
      Spacer(modifier = Modifier.height(6.dp))

      // Mastery Result Emblem
      Surface(
        modifier = Modifier.size(74.dp),
        shape = RoundedCornerShape(22.dp),
        color = if (outcome.passed) marain.masteredGold else marain.wrongContainer,
        border = if (outcome.passed) null else BorderStroke(1.5.dp, marain.wrongAccent),
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(
            imageVector = if (outcome.passed) Icons.Rounded.Verified else Icons.Rounded.Replay,
            contentDescription = null,
            tint = if (outcome.passed) marain.onMasteredGold else marain.wrongAccent,
            modifier = Modifier.size(38.dp),
          )
        }
      }

      Text(
        text = if (outcome.passed) {
          "UNIT ${module.number} MASTERED · ${outcome.accuracyPercent}%"
        } else {
          "MASTERY CHECK · NEED ≥${outcome.passingScorePercent}%"
        },
        style = MaterialTheme.typography.labelSmall,
        color = if (outcome.passed) marain.streakAccent else marain.wrongAccent,
      )

      Text(
        text = if (outcome.passed) {
          "Unit ${module.number} mastered."
        } else {
          "Not mastered yet."
        },
        style = MaterialTheme.typography.displaySmall,
        color = MaterialTheme.colorScheme.onBackground,
        textAlign = TextAlign.Center,
      )

      Text(
        text = if (outcome.passed) {
          "You proved your understanding of \"${module.title}\" with ${outcome.correctCount}/${outcome.totalQuestions} correct."
        } else {
          "You got ${outcome.correctCount}/${outcome.totalQuestions} (${outcome.accuracyPercent}%). Score at least ${outcome.minCorrectToPass}/${outcome.totalQuestions} (${outcome.passingScorePercent}%) to master Unit ${module.number}."
        },
        style = MaterialTheme.typography.bodyLarge,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        textAlign = TextAlign.Center,
      )

      // Fluency Milestone Unlock Callout (only when a new CEFR tier was genuinely unlocked)
      if (outcome.passed && outcome.unlockedNewTier) {
        Surface(
          modifier = Modifier.fillMaxWidth(),
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.primaryContainer,
          border = BorderStroke(1.5.dp, MaterialTheme.colorScheme.primary),
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
                .size(48.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(MaterialTheme.colorScheme.primary),
              contentAlignment = Alignment.Center,
            ) {
              Text(
                text = outcome.newTier.cefrCode,
                fontFamily = PlusJakartaSansFontFamily,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 18.sp,
                color = MaterialTheme.colorScheme.onPrimary,
              )
            }
            Column(
              modifier = Modifier.weight(1f),
              verticalArrangement = Arrangement.spacedBy(3.dp),
            ) {
              Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(5.dp),
              ) {
                Icon(
                  imageVector = Icons.Rounded.EmojiEvents,
                  contentDescription = null,
                  tint = MaterialTheme.colorScheme.onPrimaryContainer,
                  modifier = Modifier.size(15.dp),
                )
                Text(
                  text = "FLUENCY MILESTONE UNLOCKED",
                  style = MaterialTheme.typography.labelSmall,
                  color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
              }
              Text(
                text = "${outcome.newTier.cefrCode} · ${outcome.newTier.title}",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
              )
              Text(
                text = outcome.newTier.canDoStatement,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
              )
            }
          }
        }
      }

      // 3-Column Score Breakdown Strip
      Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, marain.cardBorder),
      ) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          MasteryMetricCell(
            value = "${outcome.correctCount}/${outcome.totalQuestions}",
            label = "SCORE",
            valueColor = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.weight(1f),
          )
          Box(
            modifier = Modifier
              .width(1.dp)
              .height(38.dp)
              .background(marain.hairlineDivider),
          )
          MasteryMetricCell(
            value = if (outcome.passed) "Passed" else "${outcome.accuracyPercent}%",
            label = "NEED ≥${outcome.passingScorePercent}%",
            valueColor = if (outcome.passed) marain.correctAccent else marain.wrongAccent,
            modifier = Modifier.weight(1f),
          )
          Box(
            modifier = Modifier
              .width(1.dp)
              .height(38.dp)
              .background(marain.hairlineDivider),
          )
          MasteryMetricCell(
            value = "+${outcome.xpEarned}",
            label = "PRACTICE XP",
            valueColor = MaterialTheme.colorScheme.primary,
            modifier = Modifier.weight(1f),
          )
        }
      }

      // Missed Questions Concept Recap (helps learners close exact gaps before retrying)
      if (missedQuestions.isNotEmpty()) {
        Surface(
          modifier = Modifier.fillMaxWidth(),
          shape = RoundedCornerShape(14.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
          ) {
            Text(
              text = "CONCEPTS TO REVIEW (${missedQuestions.size})",
              style = MaterialTheme.typography.labelSmall,
              color = marain.inkMuted,
            )
            missedQuestions.forEachIndexed { idx, missed ->
              if (idx > 0) {
                HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
              }
              Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                  text = rememberMarkdown(missed.question),
                  style = MaterialTheme.typography.titleSmall,
                  color = MaterialTheme.colorScheme.onSurface,
                )
                Text(
                  text = rememberMarkdown(missed.explanation),
                  style = MaterialTheme.typography.bodySmall,
                  color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
              }
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(6.dp))

      // Primary & Secondary CTAs
      if (outcome.passed) {
        if (nextUnit != null && nextUnitFirstChapter != null) {
          TactileButton(
            onClick = { onContinueToNextLesson(nextUnitFirstChapter.id) },
            fillColor = unitPalette.fill,
            lipColor = unitPalette.lip,
            contentColor = unitPalette.onFill,
            modifier = Modifier.fillMaxWidth(),
          ) {
            Text(
              text = rememberMarkdown(
                "Unit ${nextUnit.number}: ${nextUnitFirstChapter.title}",
                codeColor = unitPalette.onFill,
              ),
              style = MaterialTheme.typography.labelLarge,
              fontWeight = FontWeight.Bold,
              maxLines = 1,
              overflow = TextOverflow.Ellipsis,
              modifier = Modifier.weight(1f, fill = false),
            )
            Spacer(modifier = Modifier.width(6.dp))
            Icon(
              imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
              contentDescription = null,
              modifier = Modifier.size(18.dp),
            )
          }
        } else {
          TactileButton(
            onClick = onOpenProgress,
            modifier = Modifier.fillMaxWidth(),
          ) {
            Text(
              text = "View ${outcome.newTier.cefrCode} Fluency Progress",
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
        }

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          OutlinedButton(
            onClick = onRetry,
            modifier = Modifier
              .weight(1f)
              .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, marain.cardBorder),
            colors = ButtonDefaults.outlinedButtonColors(
              contentColor = MaterialTheme.colorScheme.onSurface,
            ),
          ) {
            Icon(
              imageVector = Icons.Rounded.Replay,
              contentDescription = null,
              modifier = Modifier.size(16.dp),
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text("Retake")
          }
          OutlinedButton(
            onClick = onBackToPath,
            modifier = Modifier
              .weight(1f)
              .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, marain.cardBorder),
            colors = ButtonDefaults.outlinedButtonColors(
              contentColor = MaterialTheme.colorScheme.onSurface,
            ),
          ) {
            Text("Back to Path")
          }
        }
      } else {
        TactileButton(
          onClick = onRetry,
          fillColor = unitPalette.fill,
          lipColor = unitPalette.lip,
          contentColor = unitPalette.onFill,
          modifier = Modifier.fillMaxWidth(),
        ) {
          Icon(
            imageVector = Icons.Rounded.Replay,
            contentDescription = null,
            modifier = Modifier.size(18.dp),
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "Try Mastery Check Again",
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.Bold,
          )
        }

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          OutlinedButton(
            onClick = onReviewModule,
            modifier = Modifier
              .weight(1f)
              .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, marain.cardBorder),
            colors = ButtonDefaults.outlinedButtonColors(
              contentColor = MaterialTheme.colorScheme.onSurface,
            ),
          ) {
            Text("Review Unit ${module.number}", maxLines = 1, overflow = TextOverflow.Ellipsis)
          }
          OutlinedButton(
            onClick = onBackToPath,
            modifier = Modifier
              .weight(1f)
              .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, marain.cardBorder),
            colors = ButtonDefaults.outlinedButtonColors(
              contentColor = MaterialTheme.colorScheme.onSurface,
            ),
          ) {
            Text("Back to Path")
          }
        }
      }
    }
  }
}

@Composable
private fun MasteryMetricCell(
  value: String,
  label: String,
  valueColor: Color,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  Column(
    modifier = modifier,
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.spacedBy(3.dp),
  ) {
    Text(
      text = value,
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.ExtraBold,
      fontSize = 19.sp,
      color = valueColor,
    )
    Text(
      text = label,
      style = MaterialTheme.typography.labelSmall,
      color = marain.inkMuted,
    )
  }
}
