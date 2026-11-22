package app.marain.learn.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat
import app.marain.learn.data.FontScaleOption
import app.marain.learn.data.ReadingTheme

private val LightColorScheme = lightColorScheme(
  primary = LightPrimary,
  onPrimary = LightOnPrimary,
  primaryContainer = LightPrimaryContainer,
  onPrimaryContainer = LightOnPrimaryContainer,
  secondary = LightSecondary,
  onSecondary = LightOnSecondary,
  background = LightBackground,
  onBackground = LightOnBackground,
  surface = LightSurface,
  onSurface = LightOnSurface,
  surfaceVariant = LightSurfaceVariant,
  onSurfaceVariant = LightOnSurfaceVariant,
  outline = LightOutline,
  outlineVariant = LightOutlineVariant,
)

private val SepiaColorScheme = lightColorScheme(
  primary = SepiaPrimary,
  onPrimary = SepiaOnPrimary,
  primaryContainer = SepiaPrimaryContainer,
  onPrimaryContainer = SepiaOnPrimaryContainer,
  secondary = SepiaSecondary,
  onSecondary = SepiaOnSecondary,
  background = SepiaBackground,
  onBackground = SepiaOnBackground,
  surface = SepiaSurface,
  onSurface = SepiaOnSurface,
  surfaceVariant = SepiaSurfaceVariant,
  onSurfaceVariant = SepiaOnSurfaceVariant,
  outline = SepiaOutline,
  outlineVariant = SepiaOutlineVariant,
)

private val DarkColorScheme = darkColorScheme(
  primary = DarkPrimary,
  onPrimary = DarkOnPrimary,
  primaryContainer = DarkPrimaryContainer,
  onPrimaryContainer = DarkOnPrimaryContainer,
  secondary = DarkSecondary,
  onSecondary = DarkOnSecondary,
  background = DarkBackground,
  onBackground = DarkOnBackground,
  surface = DarkSurface,
  onSurface = DarkOnSurface,
  surfaceVariant = DarkSurfaceVariant,
  onSurfaceVariant = DarkOnSurfaceVariant,
  outline = DarkOutline,
  outlineVariant = DarkOutlineVariant,
)

@Composable
fun MarainTheme(
  readingTheme: ReadingTheme = ReadingTheme.LIGHT,
  fontScale: FontScaleOption = FontScaleOption.MEDIUM,
  content: @Composable () -> Unit,
) {
  val colorScheme = when (readingTheme) {
    ReadingTheme.LIGHT -> LightColorScheme
    ReadingTheme.SEPIA -> SepiaColorScheme
    ReadingTheme.DARK -> DarkColorScheme
  }
  val extendedColors = when (readingTheme) {
    ReadingTheme.LIGHT -> LightMarainColors
    ReadingTheme.SEPIA -> SepiaMarainColors
    ReadingTheme.DARK -> DarkMarainColors
  }
  val isDark = readingTheme == ReadingTheme.DARK

  val view = LocalView.current
  if (!view.isInEditMode) {
    SideEffect {
      val window = (view.context as? Activity)?.window
      if (window != null) {
        val controller = WindowCompat.getInsetsController(window, view)
        controller.isAppearanceLightStatusBars = !isDark
        controller.isAppearanceLightNavigationBars = !isDark
      }
    }
  }

  CompositionLocalProvider(LocalMarainColors provides extendedColors) {
    MaterialTheme(
      colorScheme = colorScheme,
      typography = marainTypography(fontScale.multiplier),
      content = content,
    )
  }
}
