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
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.LocalFireDepartment
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
import app.marain.learn.data.NextStepAfterChapter
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.QuizCompletionOutcome
import app.marain.learn.data.UserProgress
import app.marain.learn.data.model.Chapter
import app.marain.learn.data.model.Curriculum
import app.marain.learn.ui.components.TactileButton
import app.marain.learn.ui.components.rememberMarkdown
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily
import app.marain.learn.ui.theme.editorialUnitPalette

@Composable
fun ChapterQuizScreen(
  curriculum: Curriculum,
  chapter: Chapter,
  onClose: () -> Unit,
  onCompleteQuiz: (correctCount: Int, totalQuestions: Int, maxCombo: Int) -> QuizCompletionOutcome,
  onNextChapter: (String) -> Unit,
  onStartMasteryCheck: (String) -> Unit,
  onBackToPath: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val questions = chapter.quiz
  var currentIndex by remember(chapter.id) { mutableIntStateOf(0) }
  var selectedOption by remember(chapter.id) { mutableStateOf<Int?>(null) }
  var hasChecked by remember(chapter.id) { mutableStateOf(false) }
  var correctCount by remember(chapter.id) { mutableIntStateOf(0) }
  var hearts by remember(chapter.id) { mutableIntStateOf(ProgressEngine.MAX_HEARTS) }
  var currentCombo by remember(chapter.id) { mutableIntStateOf(0) }
  var maxCombo by remember(chapter.id) { mutableIntStateOf(0) }
  var outcome by remember(chapter.id) { mutableStateOf<QuizCompletionOutcome?>(null) }

  val finishedOutcome = outcome
  if (finishedOutcome != null || questions.isEmpty()) {
    val resolvedOutcome = finishedOutcome ?: QuizCompletionOutcome(
      updatedProgress = UserProgress(),
      xpEarned = 0,
      comboBonusXp = 0,
      maxCombo = 0,
      isFirstQuizCompletion = false,
      isPerfectScore = true,
      passed = true,
      passingScorePercent = ProgressEngine.LESSON_PASS_PERCENT,
      correctCount = 0,
      totalQuestions = 0,
      accuracyPercent = 100,
      updatedStreakDays = 1,
    )
    val nextStep = remember(chapter.id, resolvedOutcome.updatedProgress, curriculum) {
      ProgressEngine.nextStepAfterChapter(chapter.id, resolvedOutcome.updatedProgress, curriculum)
    }

    QuizCelebrationScreen(
      curriculum = curriculum,
      chapter = chapter,
      outcome = resolvedOutcome,
      nextStep = nextStep,
      onNextChapter = onNextChapter,
      onStartMasteryCheck = onStartMasteryCheck,
      onBackToPath = onBackToPath,
      onReviewChapter = onClose,
      onRetake = {
        currentIndex = 0
        selectedOption = null
        hasChecked = false
        correctCount = 0
        hearts = ProgressEngine.MAX_HEARTS
        currentCombo = 0
        maxCombo = 0
        outcome = null
      },
      modifier = modifier,
    )
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
      outcome = onCompleteQuiz(correctCount, questions.size, maxCombo)
    }
  }

  Scaffold(
    modifier = modifier.fillMaxSize(),
    containerColor = MaterialTheme.colorScheme.background,
    topBar = {
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
            contentDescription = "Close practice check",
            tint = MaterialTheme.colorScheme.onBackground,
          )
        }

        // Sleek segmented progress bar
        Row(
          modifier = Modifier.weight(1f),
          horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
          questions.indices.forEach { idx ->
            val segmentColor = when {
              idx < currentIndex -> MaterialTheme.colorScheme.primary
              idx == currentIndex && hasChecked -> if (isSelectedCorrect) marain.correctAccent else marain.wrongAccent
              idx == currentIndex -> MaterialTheme.colorScheme.primary.copy(alpha = 0.65f)
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

        Row(
          modifier = Modifier.padding(end = 8.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(4.dp),
        ) {
          Icon(
            imageVector = Icons.Rounded.Favorite,
            contentDescription = "Hearts remaining",
            tint = marain.heartAccent,
            modifier = Modifier.size(18.dp),
          )
          Text(
            text = "$hearts",
            fontFamily = PlusJakartaSansFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onBackground,
          )
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
                  val titleText = when {
                    isSelectedCorrect && currentCombo >= 2 -> "Correct · $currentCombo in a row!"
                    isSelectedCorrect -> "Correct"
                    hearts == 0 -> "Out of hearts — free recharge ready"
                    else -> "Not quite"
                  }
                  Text(
                    text = titleText,
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
                  onClick = {
                    if (hearts == 0) {
                      hearts = ProgressEngine.MAX_HEARTS
                    }
                    advanceOrFinish()
                  },
                  fillColor = bannerAccent,
                  lipColor = bannerLip,
                  contentColor = bannerButtonInk,
                  modifier = Modifier.fillMaxWidth(),
                ) {
                  val buttonLabel = when {
                    hearts == 0 -> "Recharge Hearts & Continue"
                    currentIndex + 1 < questions.size -> "Continue"
                    else -> "See Results"
                  }
                  Text(
                    text = buttonLabel,
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
                    currentCombo += 1
                    if (currentCombo > maxCombo) maxCombo = currentCombo
                  } else {
                    currentCombo = 0
                    hearts = ProgressEngine.nextHeartsAfterAnswer(hearts, wasCorrect = false)
                  }
                  hasChecked = true
                },
                enabled = selectedOption != null,
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
      val typeLabel = when (question.type.lowercase().trim()) {
        "true_false" -> "MYTH BUSTER"
        "spot_mistake" -> "SPOT THE MISTAKE"
        else -> "PRACTICE CHECK"
      }

      Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
      ) {
        Text(
          text = typeLabel,
          style = MaterialTheme.typography.labelSmall,
          color = MaterialTheme.colorScheme.primary,
        )
        Text(
          text = "·",
          style = MaterialTheme.typography.labelSmall,
          color = marain.inkMuted,
        )
        Text(
          text = rememberMarkdown(chapter.title),
          style = MaterialTheme.typography.bodySmall,
          color = marain.inkMuted,
          maxLines = 1,
          overflow = TextOverflow.Ellipsis,
          modifier = Modifier.weight(1f),
        )
        if (currentCombo >= 2) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(3.dp),
          ) {
            Icon(
              imageVector = Icons.Rounded.LocalFireDepartment,
              contentDescription = null,
              tint = marain.streakAccent,
              modifier = Modifier.size(15.dp),
            )
            Text(
              text = "${currentCombo}x",
              fontFamily = PlusJakartaSansFontFamily,
              fontWeight = FontWeight.ExtraBold,
              fontSize = 12.sp,
              color = marain.streakAccent,
            )
          }
        }
      }

      Text(
        text = rememberMarkdown(question.question),
        style = MaterialTheme.typography.headlineMedium,
        color = MaterialTheme.colorScheme.onBackground,
      )

      Spacer(modifier = Modifier.height(2.dp))

      Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        question.options.forEachIndexed { idx, optionText ->
          TactileQuizOptionCard(
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
private fun TactileQuizOptionCard(
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
    label = "optionLip",
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
private fun QuizCelebrationScreen(
  curriculum: Curriculum,
  chapter: Chapter,
  outcome: QuizCompletionOutcome,
  nextStep: NextStepAfterChapter,
  onNextChapter: (String) -> Unit,
  onStartMasteryCheck: (String) -> Unit,
  onBackToPath: () -> Unit,
  onReviewChapter: () -> Unit,
  onRetake: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  val rankProgress = ProgressEngine.fluencyRank(outcome.updatedProgress, curriculum)
  val rank = rankProgress.currentTier
  val headline = when {
    outcome.isPerfectScore -> "Lesson mastered."
    outcome.passed -> "Lesson passed."
    else -> "Not mastered yet."
  }
  val subtext = when {
    outcome.isPerfectScore -> "Every question right on \"${chapter.title}\"."
    outcome.passed -> "You scored ${outcome.accuracyPercent}% on \"${chapter.title}\" (≥${outcome.passingScorePercent}% required)."
    else -> "Score at least ${outcome.passingScorePercent}% to master \"${chapter.title}\". Review the concepts and try again — wrong answers earn 0 XP."
  }

  Surface(
    modifier = modifier.fillMaxSize(),
    color = MaterialTheme.colorScheme.background,
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
        .statusBarsPadding()
        .padding(horizontal = 24.dp, vertical = 32.dp)
        .navigationBarsPadding(),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.Center,
    ) {
      Surface(
        modifier = Modifier.size(74.dp),
        shape = RoundedCornerShape(22.dp),
        color = when {
          outcome.isPerfectScore -> marain.masteredGold
          outcome.passed -> MaterialTheme.colorScheme.primary
          else -> marain.wrongContainer
        },
        border = if (!outcome.passed) BorderStroke(1.5.dp, marain.wrongAccent) else null,
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(
            imageVector = if (outcome.passed) Icons.Rounded.Check else Icons.Rounded.Replay,
            contentDescription = null,
            tint = when {
              outcome.isPerfectScore -> marain.onMasteredGold
              outcome.passed -> MaterialTheme.colorScheme.onPrimary
              else -> marain.wrongAccent
            },
            modifier = Modifier.size(38.dp),
          )
        }
      }

      Spacer(modifier = Modifier.height(18.dp))

      Text(
        text = "${rank.cefrCode} · ${rank.title.uppercase()}",
        style = MaterialTheme.typography.labelSmall,
        color = if (outcome.passed) MaterialTheme.colorScheme.primary else marain.wrongAccent,
      )

      Spacer(modifier = Modifier.height(8.dp))

      Text(
        text = headline,
        style = MaterialTheme.typography.displaySmall,
        color = MaterialTheme.colorScheme.onBackground,
        textAlign = TextAlign.Center,
      )

      Spacer(modifier = Modifier.height(8.dp))

      Text(
        text = rememberMarkdown(subtext),
        style = MaterialTheme.typography.bodyLarge,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        textAlign = TextAlign.Center,
      )

      if (outcome.comboBonusXp > 0) {
        Spacer(modifier = Modifier.height(10.dp))
        Text(
          text = "${outcome.maxCombo}x combo bonus (+${outcome.comboBonusXp} Practice XP)",
          style = MaterialTheme.typography.labelMedium,
          color = marain.streakAccent,
        )
      }

      Spacer(modifier = Modifier.height(24.dp))

      // Crisp 3-column hairline metrics strip
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
          CelebrationStatCell(
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
          CelebrationStatCell(
            value = "+${outcome.xpEarned}",
            label = "PRACTICE XP",
            valueColor = MaterialTheme.colorScheme.primary,
            modifier = Modifier.weight(1f),
          )
          Box(
            modifier = Modifier
              .width(1.dp)
              .height(38.dp)
              .background(marain.hairlineDivider),
          )
          CelebrationStatCell(
            value = "${outcome.accuracyPercent}%",
            label = if (outcome.passed) "PASSED" else "NEED ≥${outcome.passingScorePercent}%",
            valueColor = if (outcome.passed) marain.correctAccent else marain.wrongAccent,
            modifier = Modifier.weight(1f),
          )
        }
      }

      Spacer(modifier = Modifier.height(28.dp))

      if (!outcome.passed) {
        // Failed check -> primary CTA is Retry so mastery stays meaningful
        TactileButton(
          onClick = onRetake,
          modifier = Modifier.fillMaxWidth(),
        ) {
          Icon(
            imageVector = Icons.Rounded.Replay,
            contentDescription = null,
            modifier = Modifier.size(18.dp),
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "Retry Practice Check",
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.Bold,
          )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          OutlinedButton(
            onClick = onReviewChapter,
            modifier = Modifier
              .weight(1f)
              .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, marain.cardBorder),
            colors = ButtonDefaults.outlinedButtonColors(
              contentColor = MaterialTheme.colorScheme.onSurface,
            ),
          ) {
            Text("Review Lesson")
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
        // Passed check -> seamless flow to Next Lesson OR Unit Mastery Check!
        when (nextStep) {
          is NextStepAfterChapter.UnitMasteryCheck -> {
            val unitPalette = editorialUnitPalette(nextStep.module.number, isDark = marain.isDark)
            val passPct = nextStep.module.masteryCheck?.passingScorePercent ?: 75
            Text(
              text = "Ready for Unit ${nextStep.module.number} Mastery Check (≥$passPct% to master this unit)",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
              textAlign = TextAlign.Center,
              modifier = Modifier.padding(bottom = 12.dp),
            )
            TactileButton(
              onClick = { onStartMasteryCheck(nextStep.module.id) },
              fillColor = unitPalette.fill,
              lipColor = unitPalette.lip,
              contentColor = unitPalette.onFill,
              modifier = Modifier.fillMaxWidth(),
            ) {
              Icon(
                imageVector = Icons.Rounded.Verified,
                contentDescription = null,
                modifier = Modifier.size(19.dp),
              )
              Spacer(modifier = Modifier.width(8.dp))
              Text(
                text = "Take Unit ${nextStep.module.number} Mastery Check",
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

          is NextStepAfterChapter.NextLesson -> {
            TactileButton(
              onClick = { onNextChapter(nextStep.chapter.id) },
              modifier = Modifier.fillMaxWidth(),
            ) {
              Text(
                text = rememberMarkdown(
                  "Next: ${nextStep.chapter.title}",
                  codeColor = MaterialTheme.colorScheme.onPrimary,
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
          }

          is NextStepAfterChapter.CourseComplete -> {
            TactileButton(
              onClick = onBackToPath,
              modifier = Modifier.fillMaxWidth(),
            ) {
              Text(
                text = "Back to Learning Path",
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold,
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          OutlinedButton(
            onClick = onRetake,
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
            Text("Retry Check")
          }

          OutlinedButton(
            onClick = onReviewChapter,
            modifier = Modifier
              .weight(1f)
              .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, marain.cardBorder),
            colors = ButtonDefaults.outlinedButtonColors(
              contentColor = MaterialTheme.colorScheme.onSurface,
            ),
          ) {
            Text("Review Lesson")
          }
        }
      }
    }
  }
}

@Composable
private fun CelebrationStatCell(
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
      fontSize = 20.sp,
      color = valueColor,
    )
    Text(
      text = label,
      style = MaterialTheme.typography.labelSmall,
      color = marain.inkMuted,
    )
  }
}
