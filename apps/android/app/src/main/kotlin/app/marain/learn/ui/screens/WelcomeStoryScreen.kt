package app.marain.learn.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
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
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.ProgressEngine
import app.marain.learn.ui.components.TactileButton
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.LoraFontFamily
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily

@Composable
fun WelcomeStoryScreen(
  onFinish: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  var page by rememberSaveable { mutableIntStateOf(0) }
  val totalSlides = 3

  Surface(
    modifier = modifier.fillMaxSize(),
    color = MaterialTheme.colorScheme.background,
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .statusBarsPadding()
        .navigationBarsPadding()
        .padding(horizontal = 24.dp, vertical = 16.dp),
    ) {
      // Minimal Editorial Top Row
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
      ) {
        Text(
          text = "Marain",
          fontFamily = LoraFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 20.sp,
          letterSpacing = (-0.4).sp,
          color = MaterialTheme.colorScheme.onBackground,
        )

        if (page < totalSlides - 1) {
          TextButton(onClick = onFinish) {
            Text(
              text = "Skip",
              style = MaterialTheme.typography.labelLarge,
              color = marain.inkMuted,
            )
          }
        }
      }

      // Editorial Slide Body
      Box(
        modifier = Modifier
          .weight(1f)
          .fillMaxWidth()
          .verticalScroll(rememberScrollState()),
        contentAlignment = Alignment.CenterStart,
      ) {
        AnimatedContent(targetState = page, label = "welcomeSlide") { currentSlide ->
          when (currentSlide) {
            0 -> SlideOneNewLanguage()
            1 -> SlideTwoFluencyLadder()
            else -> SlideThreeEditorialMethod()
          }
        }
      }

      // Subtle Progress Dots
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 18.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
      ) {
        repeat(totalSlides) { idx ->
          val active = idx == page
          Box(
            modifier = Modifier
              .padding(horizontal = 4.dp)
              .height(6.dp)
              .width(if (active) 24.dp else 6.dp)
              .clip(RoundedCornerShape(999.dp))
              .background(if (active) MaterialTheme.colorScheme.primary else marain.cardBorder),
          )
        }
      }

      // Chunky Tactile Primary CTA — opens Lesson 1 directly
      TactileButton(
        onClick = {
          if (page < totalSlides - 1) page += 1 else onFinish()
        },
        modifier = Modifier.fillMaxWidth(),
      ) {
        Text(
          text = if (page < totalSlides - 1) "Continue" else "Start Lesson 1",
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
  }
}

@Composable
fun MarainMonogramBadge(
  size: Dp = 38.dp,
  modifier: Modifier = Modifier,
) {
  Surface(
    modifier = modifier.size(size),
    shape = RoundedCornerShape(10.dp),
    color = MaterialTheme.colorScheme.primary,
  ) {
    Box(contentAlignment = Alignment.Center) {
      Text(
        text = "M",
        fontFamily = LoraFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = (size.value * 0.48f).sp,
        color = MaterialTheme.colorScheme.onPrimary,
      )
    }
  }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun SlideOneNewLanguage() {
  val marain = LocalMarainColors.current
  val words = listOf("LLMs", "tokens", "context window", "API keys", "harnesses", "MCP", "Claude Code")

  Column(
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 12.dp),
    verticalArrangement = Arrangement.spacedBy(20.dp),
  ) {
    Text(
      text = "01 / 03",
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 12.sp,
      letterSpacing = 1.2.sp,
      color = MaterialTheme.colorScheme.primary,
    )

    Text(
      text = "Everyone around you suddenly speaks a new language.",
      fontFamily = LoraFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 30.sp,
      lineHeight = 38.sp,
      letterSpacing = (-0.5).sp,
      color = MaterialTheme.colorScheme.onBackground,
    )

    FlowRow(
      horizontalArrangement = Arrangement.spacedBy(8.dp),
      verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
      words.forEach { term ->
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Text(
            text = term,
            fontFamily = FontFamily.Monospace,
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(horizontal = 11.dp, vertical = 7.dp),
          )
        }
      }
    }

    Text(
      text = "It's time you became fluent. Marain teaches the real concepts behind modern AI in plain English, without assuming any technical background.",
      style = MaterialTheme.typography.bodyLarge,
      color = MaterialTheme.colorScheme.onSurfaceVariant,
    )
  }
}

@Composable
private fun SlideTwoFluencyLadder() {
  val marain = LocalMarainColors.current

  Column(
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 12.dp),
    verticalArrangement = Arrangement.spacedBy(18.dp),
  ) {
    Text(
      text = "02 / 03",
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 12.sp,
      letterSpacing = 1.2.sp,
      color = MaterialTheme.colorScheme.primary,
    )

    Text(
      text = "Earn fluency by proving understanding.",
      fontFamily = LoraFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 30.sp,
      lineHeight = 38.sp,
      letterSpacing = (-0.5).sp,
      color = MaterialTheme.colorScheme.onBackground,
    )

    Text(
      text = "Five minutes on your phone takes you through Unit 1. Pass each short Unit Mastery Check to unlock A1 through C2 — never just by tapping for points.",
      style = MaterialTheme.typography.bodyLarge,
      color = MaterialTheme.colorScheme.onSurfaceVariant,
    )

    Surface(
      shape = RoundedCornerShape(14.dp),
      color = MaterialTheme.colorScheme.surface,
      border = BorderStroke(1.dp, marain.cardBorder),
    ) {
      Column(modifier = Modifier.fillMaxWidth()) {
        ProgressEngine.cefrMilestoneTiers.forEachIndexed { idx, tier ->
          if (idx > 0) {
            HorizontalDivider(thickness = 1.dp, color = marain.hairlineDivider)
          }
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 16.dp, vertical = 11.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
          ) {
            Text(
              text = tier.cefrCode,
              fontFamily = PlusJakartaSansFontFamily,
              fontWeight = FontWeight.ExtraBold,
              fontSize = 13.sp,
              color = if (idx == 0) MaterialTheme.colorScheme.primary else marain.inkMuted,
              modifier = Modifier.width(26.dp),
            )
            Text(
              text = tier.title,
              style = MaterialTheme.typography.titleSmall,
              color = MaterialTheme.colorScheme.onSurface,
              modifier = Modifier.weight(1f),
            )
            Text(
              text = tier.requirementSummary,
              style = MaterialTheme.typography.bodySmall,
              color = marain.inkMuted,
            )
          }
        }
      }
    }
  }
}

@Composable
private fun SlideThreeEditorialMethod() {
  val marain = LocalMarainColors.current

  Column(
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 12.dp),
    verticalArrangement = Arrangement.spacedBy(18.dp),
  ) {
    Text(
      text = "03 / 03",
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 12.sp,
      letterSpacing = 1.2.sp,
      color = MaterialTheme.colorScheme.primary,
    )

    Text(
      text = "Read like Varsity. Verify like a craftsperson.",
      fontFamily = LoraFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 30.sp,
      lineHeight = 38.sp,
      letterSpacing = (-0.5).sp,
      color = MaterialTheme.colorScheme.onBackground,
    )

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
      WelcomeFeatureRow(
        index = "01",
        title = "Phone-First Editorial Chapters",
        body = "Clear everyday analogies, myth busters, and Light, Warm Sepia, or high-contrast Dark reading modes.",
        border = marain.cardBorder,
      )
      WelcomeFeatureRow(
        index = "02",
        title = "Real Understanding & Mastery Checks",
        body = "Realistic scenario questions after every lesson, plus a short Mastery Check to prove each unit.",
        border = marain.cardBorder,
      )
      WelcomeFeatureRow(
        index = "03",
        title = "50-Word Offline AI Phrasebook",
        body = "Searchable dictionary and tap-to-flip flashcards — 100% offline, zero accounts, zero leaderboards.",
        border = marain.cardBorder,
      )
    }
  }
}

@Composable
private fun WelcomeFeatureRow(
  index: String,
  title: String,
  body: String,
  border: androidx.compose.ui.graphics.Color,
) {
  Surface(
    modifier = Modifier.fillMaxWidth(),
    shape = RoundedCornerShape(10.dp),
    color = MaterialTheme.colorScheme.surface,
    border = BorderStroke(1.dp, border),
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .height(IntrinsicSize.Min),
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
          .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(3.dp),
      ) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
          Text(
            text = index,
            fontFamily = PlusJakartaSansFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 11.sp,
            color = MaterialTheme.colorScheme.primary,
          )
          Text(
            text = title,
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.onSurface,
          )
        }
        Text(
          text = body,
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
      }
    }
  }
}
