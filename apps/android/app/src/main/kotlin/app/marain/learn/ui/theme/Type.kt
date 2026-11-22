package app.marain.learn.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import app.marain.learn.R

val LoraFontFamily = FontFamily(
  Font(R.font.lora_regular, FontWeight.Normal),
  Font(R.font.lora_medium, FontWeight.Medium),
  Font(R.font.lora_semibold, FontWeight.SemiBold),
  Font(R.font.lora_bold, FontWeight.Bold),
)

val PlusJakartaSansFontFamily = FontFamily(
  Font(R.font.plus_jakarta_sans_regular, FontWeight.Normal),
  Font(R.font.plus_jakarta_sans_medium, FontWeight.Medium),
  Font(R.font.plus_jakarta_sans_semibold, FontWeight.SemiBold),
  Font(R.font.plus_jakarta_sans_bold, FontWeight.Bold),
  Font(R.font.plus_jakarta_sans_extrabold, FontWeight.ExtraBold),
)

fun marainTypography(scale: Float = 1.0f): Typography {
  fun Float.s() = (this * scale).sp

  return Typography(
    displaySmall = TextStyle(
      fontFamily = LoraFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 28f.s(),
      lineHeight = 36f.s(),
      letterSpacing = (-0.5).sp,
    ),
    headlineMedium = TextStyle(
      fontFamily = LoraFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 24f.s(),
      lineHeight = 32f.s(),
      letterSpacing = (-0.4).sp,
    ),
    headlineSmall = TextStyle(
      fontFamily = LoraFontFamily,
      fontWeight = FontWeight.SemiBold,
      fontSize = 20f.s(),
      lineHeight = 28f.s(),
      letterSpacing = (-0.25).sp,
    ),
    titleLarge = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 18f.s(),
      lineHeight = 24f.s(),
      letterSpacing = (-0.2).sp,
    ),
    titleMedium = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.SemiBold,
      fontSize = 16f.s(),
      lineHeight = 22f.s(),
      letterSpacing = (-0.1).sp,
    ),
    titleSmall = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.SemiBold,
      fontSize = 14f.s(),
      lineHeight = 20f.s(),
    ),
    bodyLarge = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Normal,
      fontSize = 16f.s(),
      lineHeight = 26f.s(),
    ),
    bodyMedium = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Normal,
      fontSize = 14.5f.s(),
      lineHeight = 23f.s(),
    ),
    bodySmall = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Normal,
      fontSize = 12.5f.s(),
      lineHeight = 18f.s(),
    ),
    labelLarge = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.SemiBold,
      fontSize = 14f.s(),
      lineHeight = 18f.s(),
    ),
    labelMedium = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.SemiBold,
      fontSize = 12f.s(),
      lineHeight = 16f.s(),
      letterSpacing = 0.2.sp,
    ),
    labelSmall = TextStyle(
      fontFamily = PlusJakartaSansFontFamily,
      fontWeight = FontWeight.Bold,
      fontSize = 11f.s(),
      lineHeight = 14f.s(),
      letterSpacing = 0.7.sp,
    ),
  )
}
