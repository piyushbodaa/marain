package app.marain.learn.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material.icons.rounded.Build
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Code
import androidx.compose.material.icons.rounded.Devices
import androidx.compose.material.icons.rounded.Key
import androidx.compose.material.icons.rounded.Language
import androidx.compose.material.icons.rounded.Layers
import androidx.compose.material.icons.rounded.Memory
import androidx.compose.material.icons.rounded.PhoneAndroid
import androidx.compose.material.icons.rounded.Psychology
import androidx.compose.material.icons.rounded.RocketLaunch
import androidx.compose.material.icons.rounded.SmartToy
import androidx.compose.material.icons.rounded.Terminal
import androidx.compose.material.icons.rounded.Token
import androidx.compose.material.icons.rounded.Web
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.ReadingTheme
import app.marain.learn.data.model.GlossaryTerm
import app.marain.learn.ui.theme.LocalMarainColors

fun parseAccentColor(hex: String, fallback: Color = Color(0xFF1B4D3E)): Color {
  val cleaned = hex.trim().removePrefix("#")
  return runCatching {
    when (cleaned.length) {
      6 -> Color(("FF$cleaned").toLong(16))
      8 -> Color(cleaned.toLong(16))
      else -> fallback
    }
  }.getOrDefault(fallback)
}

fun moduleIconFor(iconKey: String): ImageVector = when (iconKey.lowercase().trim()) {
  "brain", "psychology", "ai", "spark", "sparkles" -> Icons.Rounded.Psychology
  "layers" -> Icons.Rounded.Layers
  "token", "tokens", "puzzle", "message", "chat", "text" -> Icons.Rounded.Token
  "key", "wallet", "coins", "money", "credit", "credits", "dollar", "billing" -> Icons.Rounded.Key
  "cpu", "memory" -> Icons.Rounded.Memory
  "agent", "agents", "bot", "robot", "harness", "hub", "workflow" -> Icons.Rounded.SmartToy
  "terminal", "cli", "console", "shell", "command" -> Icons.Rounded.Terminal
  "globe" -> Icons.Rounded.Language
  "web", "website", "browser", "layout" -> Icons.Rounded.Web
  "smartphone", "phone", "mobile" -> Icons.Rounded.PhoneAndroid
  "app", "rocket", "launch", "build" -> Icons.Rounded.RocketLaunch
  "code" -> Icons.Rounded.Code
  "devices" -> Icons.Rounded.Devices
  "tools", "wrench" -> Icons.Rounded.Build
  else -> Icons.Rounded.AutoAwesome
}

fun categoryDisplayLabel(category: String): String = when (category.lowercase().trim()) {
  "all" -> "All"
  "foundations" -> "Foundations"
  "tokens" -> "Tokens"
  "money" -> "Money"
  "agents" -> "Agents"
  "cli" -> "CLI"
  "building" -> "Building"
  else -> category.replaceFirstChar { it.uppercase() }
}

/**
 * Chunky Duolingo-style tactile 3D button with a darker solid bottom lip that physically
 * depresses when pressed.
 */
@Composable
fun TactileButton(
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
  enabled: Boolean = true,
  fillColor: Color = MaterialTheme.colorScheme.primary,
  lipColor: Color = LocalMarainColors.current.primaryLip,
  contentColor: Color = MaterialTheme.colorScheme.onPrimary,
  borderColor: Color? = null,
  height: Dp = 52.dp,
  lipDepth: Dp = 4.dp,
  cornerRadius: Dp = 14.dp,
  content: @Composable RowScope.() -> Unit,
) {
  val interactionSource = remember { MutableInteractionSource() }
  val isPressed by interactionSource.collectIsPressedAsState()
  val effectiveFill = if (enabled) fillColor else MaterialTheme.colorScheme.surfaceVariant
  val effectiveLip = if (enabled) lipColor else MaterialTheme.colorScheme.outlineVariant
  val topOffset by animateDpAsState(
    targetValue = if (isPressed && enabled) lipDepth - 1.dp else 0.dp,
    animationSpec = tween(durationMillis = 70),
    label = "tactileBtnOffset",
  )

  Box(
    modifier = modifier
      .height(height + lipDepth)
      .clip(RoundedCornerShape(cornerRadius))
      .clickable(
        interactionSource = interactionSource,
        indication = null,
        enabled = enabled,
        onClick = onClick,
      ),
  ) {
    // Solid darker bottom lip
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(height)
        .align(Alignment.BottomCenter)
        .clip(RoundedCornerShape(cornerRadius))
        .background(effectiveLip),
    )

    // Raised top button face
    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .height(height)
        .padding(top = topOffset),
      shape = RoundedCornerShape(cornerRadius),
      color = effectiveFill,
      contentColor = if (enabled) contentColor else MaterialTheme.colorScheme.onSurfaceVariant,
      border = borderColor?.let { BorderStroke(1.5.dp, it) },
    ) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
        content = content,
      )
    }
  }
}

@Composable
fun EditorialProgressBar(
  progress: Float,
  fillColor: Color,
  modifier: Modifier = Modifier,
  height: Dp = 5.dp,
  trackColor: Color = MaterialTheme.colorScheme.surfaceVariant,
) {
  val animated by animateFloatAsState(
    targetValue = progress.coerceIn(0f, 1f),
    animationSpec = tween(durationMillis = 420),
    label = "progressBar",
  )
  Box(
    modifier = modifier
      .fillMaxWidth()
      .height(height)
      .clip(RoundedCornerShape(999.dp))
      .background(trackColor),
  ) {
    if (animated > 0f) {
      Box(
        modifier = Modifier
          .fillMaxWidth(animated)
          .height(height)
          .clip(RoundedCornerShape(999.dp))
          .background(fillColor),
      )
    }
  }
}

@Composable
fun ReadingAppearanceControls(
  selectedTheme: ReadingTheme,
  selectedFontScale: FontScaleOption,
  onSelectTheme: (ReadingTheme) -> Unit,
  onSelectFontScale: (FontScaleOption) -> Unit,
  showPreviewText: Boolean = true,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(16.dp)) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
      Text(
        text = "THEME",
        style = MaterialTheme.typography.labelSmall,
        color = marain.inkMuted,
      )
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
      ) {
        ReadingTheme.entries.forEach { theme ->
          val isSelected = theme == selectedTheme
          val swatchBg = when (theme) {
            ReadingTheme.LIGHT -> Color(0xFFFAF9F5)
            ReadingTheme.SEPIA -> Color(0xFFF4ECD8)
            ReadingTheme.DARK -> Color(0xFF101214)
          }
          val swatchInk = when (theme) {
            ReadingTheme.LIGHT -> Color(0xFF141413)
            ReadingTheme.SEPIA -> Color(0xFF2B2218)
            ReadingTheme.DARK -> Color(0xFFF2F0EA)
          }
          Surface(
            modifier = Modifier
              .weight(1f)
              .clip(RoundedCornerShape(12.dp))
              .clickable { onSelectTheme(theme) },
            shape = RoundedCornerShape(12.dp),
            color = swatchBg,
            border = BorderStroke(
              width = if (isSelected) 2.dp else 1.dp,
              color = if (isSelected) MaterialTheme.colorScheme.primary else marain.cardBorder,
            ),
          ) {
            Column(
              modifier = Modifier.padding(vertical = 12.dp, horizontal = 8.dp),
              horizontalAlignment = Alignment.CenterHorizontally,
              verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
              Box(
                modifier = Modifier
                  .size(22.dp)
                  .clip(CircleShape)
                  .background(
                    if (isSelected) MaterialTheme.colorScheme.primary else swatchInk.copy(alpha = 0.12f),
                  ),
                contentAlignment = Alignment.Center,
              ) {
                if (isSelected) {
                  Icon(
                    imageVector = Icons.Rounded.Check,
                    contentDescription = "Selected",
                    tint = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(14.dp),
                  )
                } else {
                  Text(
                    text = "Aa",
                    style = MaterialTheme.typography.labelSmall,
                    color = swatchInk,
                  )
                }
              }
              Text(
                text = theme.label,
                style = MaterialTheme.typography.labelMedium,
                color = swatchInk,
                maxLines = 1,
              )
            }
          }
        }
      }
    }

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
      Text(
        text = "TEXT SIZE",
        style = MaterialTheme.typography.labelSmall,
        color = marain.inkMuted,
      )
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
        border = BorderStroke(1.dp, marain.cardBorder),
      ) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp),
          horizontalArrangement = Arrangement.spacedBy(4.dp),
        ) {
          FontScaleOption.entries.forEach { option ->
            val isSelected = option == selectedFontScale
            Surface(
              modifier = Modifier
                .weight(1f)
                .clip(RoundedCornerShape(9.dp))
                .clickable { onSelectFontScale(option) },
              shape = RoundedCornerShape(9.dp),
              color = if (isSelected) MaterialTheme.colorScheme.surface else Color.Transparent,
              border = if (isSelected) BorderStroke(1.dp, marain.cardBorder) else null,
            ) {
              Box(
                modifier = Modifier.padding(vertical = 9.dp),
                contentAlignment = Alignment.Center,
              ) {
                Text(
                  text = "${option.shortLabel} · ${option.label}",
                  style = MaterialTheme.typography.labelMedium,
                  fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                  color = if (isSelected) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                )
              }
            }
          }
        }
      }
    }

    if (showPreviewText) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .height(IntrinsicSize.Min)
          .clip(RoundedCornerShape(10.dp))
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
            .padding(horizontal = 14.dp, vertical = 12.dp),
          verticalArrangement = Arrangement.spacedBy(3.dp),
        ) {
          Text(
            text = "READING PREVIEW",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.primary,
          )
          Text(
            text = "Think of an AI model like a super-fast autocomplete that has read billions of books and predicts the next helpful word.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface,
          )
        }
      }
    }
  }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GlossaryTermBottomSheet(
  term: GlossaryTerm,
  onDismiss: () -> Unit,
) {
  val marain = LocalMarainColors.current
  val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
  ModalBottomSheet(
    onDismissRequest = onDismiss,
    sheetState = sheetState,
    containerColor = MaterialTheme.colorScheme.surface,
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 22.dp)
        .padding(bottom = 32.dp),
      verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
      Text(
        text = "${categoryDisplayLabel(term.category).uppercase()} · PHRASEBOOK",
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.primary,
      )

      Text(
        text = term.term,
        style = MaterialTheme.typography.headlineMedium,
        color = MaterialTheme.colorScheme.onSurface,
      )

      Text(
        text = rememberMarkdown(term.shortDef),
        style = MaterialTheme.typography.bodyLarge,
        color = MaterialTheme.colorScheme.onSurface,
      )

      // Editorial left-bar Everyday Analogy
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .height(IntrinsicSize.Min)
          .clip(RoundedCornerShape(10.dp))
          .background(marain.analogyContainer),
      ) {
        Box(
          modifier = Modifier
            .width(3.dp)
            .fillMaxHeight()
            .background(marain.analogyAccent),
        )
        Column(
          modifier = Modifier
            .weight(1f)
            .padding(14.dp),
          verticalArrangement = Arrangement.spacedBy(5.dp),
        ) {
          Text(
            text = "EVERYDAY ANALOGY",
            style = MaterialTheme.typography.labelSmall,
            color = marain.analogyAccent,
          )
          Text(
            text = rememberMarkdown(term.analogy),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface,
          )
        }
      }

      if (term.example.isNotBlank()) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min)
            .clip(RoundedCornerShape(10.dp))
            .background(marain.exampleContainer),
        ) {
          Box(
            modifier = Modifier
              .width(3.dp)
              .fillMaxHeight()
              .background(marain.exampleAccent),
          )
          Column(
            modifier = Modifier
              .weight(1f)
              .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
          ) {
            Text(
              text = "REAL EXAMPLE",
              style = MaterialTheme.typography.labelSmall,
              color = marain.exampleAccent,
            )
            Text(
              text = rememberMarkdown(term.example),
              style = MaterialTheme.typography.bodyMedium,
              color = MaterialTheme.colorScheme.onSurface,
            )
          }
        }
      }
    }
  }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReadingAppearanceBottomSheet(
  selectedTheme: ReadingTheme,
  selectedFontScale: FontScaleOption,
  onSelectTheme: (ReadingTheme) -> Unit,
  onSelectFontScale: (FontScaleOption) -> Unit,
  onDismiss: () -> Unit,
) {
  val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
  ModalBottomSheet(
    onDismissRequest = onDismiss,
    sheetState = sheetState,
    containerColor = MaterialTheme.colorScheme.surface,
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 22.dp)
        .padding(bottom = 32.dp),
      verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
      Text(
        text = "Reading Appearance",
        style = MaterialTheme.typography.titleLarge,
        color = MaterialTheme.colorScheme.onSurface,
      )
      HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
      ReadingAppearanceControls(
        selectedTheme = selectedTheme,
        selectedFontScale = selectedFontScale,
        onSelectTheme = onSelectTheme,
        onSelectFontScale = onSelectFontScale,
        showPreviewText = true,
      )
    }
  }
}
