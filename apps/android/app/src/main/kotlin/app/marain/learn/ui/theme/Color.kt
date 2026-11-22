package app.marain.learn.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// Light — Warm Editorial Paper (Zerodha Varsity × Apple Design Restraint)
val LightBackground = Color(0xFFFAF9F5)
val LightSurface = Color(0xFFFFFFFF)
val LightSurfaceVariant = Color(0xFFF1EEE8)
val LightPrimary = Color(0xFF1B4D3E)
val LightPrimaryLip = Color(0xFF11352A)
val LightOnPrimary = Color(0xFFFAF9F5)
val LightPrimaryContainer = Color(0xFFEAF2EF)
val LightOnPrimaryContainer = Color(0xFF11352A)
val LightSecondary = Color(0xFF1E40AF)
val LightOnSecondary = Color(0xFFFFFFFF)
val LightOnBackground = Color(0xFF141413)
val LightOnSurface = Color(0xFF141413)
val LightOnSurfaceVariant = Color(0xFF5E5C56)
val LightInkMuted = Color(0xFF8E8B82)
val LightOutline = Color(0xFFD8D4CB)
val LightOutlineVariant = Color(0xFFE6E3DC)

// Warm Sepia — Long-form Book Reading Paper
val SepiaBackground = Color(0xFFF4ECD8)
val SepiaSurface = Color(0xFFFAF3E3)
val SepiaSurfaceVariant = Color(0xFFEAE0C8)
val SepiaPrimary = Color(0xFF1B4D3E)
val SepiaPrimaryLip = Color(0xFF11352A)
val SepiaOnPrimary = Color(0xFFFAF6EC)
val SepiaPrimaryContainer = Color(0xFFDFEAE3)
val SepiaOnPrimaryContainer = Color(0xFF11352A)
val SepiaSecondary = Color(0xFF8C4A1C)
val SepiaOnSecondary = Color(0xFFFFFFFF)
val SepiaOnBackground = Color(0xFF2B2218)
val SepiaOnSurface = Color(0xFF2B2218)
val SepiaOnSurfaceVariant = Color(0xFF635443)
val SepiaInkMuted = Color(0xFF8B7A66)
val SepiaOutline = Color(0xFFD4C5A8)
val SepiaOutlineVariant = Color(0xFFE2D6BC)

// Dark — True Warm Obsidian
val DarkBackground = Color(0xFF101214)
val DarkSurface = Color(0xFF181B1F)
val DarkSurfaceVariant = Color(0xFF21252B)
val DarkPrimary = Color(0xFF4DA687)
val DarkPrimaryLip = Color(0xFF2B6F57)
val DarkOnPrimary = Color(0xFF0A1F18)
val DarkPrimaryContainer = Color(0xFF192B24)
val DarkOnPrimaryContainer = Color(0xFFC2E6D8)
val DarkSecondary = Color(0xFF6B93E8)
val DarkOnSecondary = Color(0xFF0A1B3D)
val DarkOnBackground = Color(0xFFF2F0EA)
val DarkOnSurface = Color(0xFFF2F0EA)
val DarkOnSurfaceVariant = Color(0xFFA8A49B)
val DarkInkMuted = Color(0xFF75726B)
val DarkOutline = Color(0xFF343942)
val DarkOutlineVariant = Color(0xFF272B32)

@Immutable
data class UnitEditorialPalette(
  val fill: Color,
  val lip: Color,
  val subtleTint: Color,
)

/**
 * 7 cohesive, mature editorial unit colors with matched tactile 3D bottom lips.
 * Intentionally avoids garish neon mint or pastel rainbow palettes.
 */
fun editorialUnitPalette(unitNumber: Int): UnitEditorialPalette = when (unitNumber) {
  1 -> UnitEditorialPalette(fill = Color(0xFF1B4D3E), lip = Color(0xFF11352A), subtleTint = Color(0xFFEAF2EF))
  2 -> UnitEditorialPalette(fill = Color(0xFF1E40AF), lip = Color(0xFF142B78), subtleTint = Color(0xFFEDF1FB))
  3 -> UnitEditorialPalette(fill = Color(0xFFB45309), lip = Color(0xFF823904), subtleTint = Color(0xFFFBF3EB))
  4 -> UnitEditorialPalette(fill = Color(0xFF5B21B6), lip = Color(0xFF3E1480), subtleTint = Color(0xFFF2EEFB))
  5 -> UnitEditorialPalette(fill = Color(0xFF9D174D), lip = Color(0xFF6E0E35), subtleTint = Color(0xFFF9EEF2))
  6 -> UnitEditorialPalette(fill = Color(0xFF0F5A6E), lip = Color(0xFF093D4B), subtleTint = Color(0xFFEBF4F6))
  else -> UnitEditorialPalette(fill = Color(0xFF3F2E21), lip = Color(0xFF281C13), subtleTint = Color(0xFFF3EFEA))
}

@Immutable
data class MarainExtendedColors(
  val cardBorder: Color,
  val inkMuted: Color,
  val primaryLip: Color,
  val neutralLip: Color,
  val masteredGold: Color,
  val masteredGoldLip: Color,
  val streakAccent: Color,
  val streakContainer: Color,
  val xpAccent: Color,
  val xpContainer: Color,
  val heartAccent: Color,
  val correctAccent: Color,
  val correctLip: Color,
  val correctContainer: Color,
  val onCorrectContainer: Color,
  val wrongAccent: Color,
  val wrongLip: Color,
  val wrongContainer: Color,
  val onWrongContainer: Color,
  val tipAccent: Color,
  val tipContainer: Color,
  val mythAccent: Color,
  val mythContainer: Color,
  val exampleAccent: Color,
  val exampleContainer: Color,
  val warningAccent: Color,
  val warningContainer: Color,
  val analogyAccent: Color,
  val analogyContainer: Color,
)

val LightMarainColors = MarainExtendedColors(
  cardBorder = LightOutlineVariant,
  inkMuted = LightInkMuted,
  primaryLip = LightPrimaryLip,
  neutralLip = Color(0xFFDAD6CE),
  masteredGold = Color(0xFFD98A1C),
  masteredGoldLip = Color(0xFFA8640B),
  streakAccent = Color(0xFFC27803),
  streakContainer = Color(0xFFF8F1E3),
  xpAccent = Color(0xFF1B4D3E),
  xpContainer = Color(0xFFEAF2EF),
  heartAccent = Color(0xFFC83E37),
  correctAccent = Color(0xFF1B6B4F),
  correctLip = Color(0xFF114A36),
  correctContainer = Color(0xFFEEF7F3),
  onCorrectContainer = Color(0xFF0F3B2B),
  wrongAccent = Color(0xFFC83E37),
  wrongLip = Color(0xFF932722),
  wrongContainer = Color(0xFFFDF1F0),
  onWrongContainer = Color(0xFF7A1C18),
  tipAccent = Color(0xFF1B4D3E),
  tipContainer = Color(0xFFF1F5F3),
  mythAccent = Color(0xFFB45309),
  mythContainer = Color(0xFFFBF6EE),
  exampleAccent = Color(0xFF1E40AF),
  exampleContainer = Color(0xFFF2F5FC),
  warningAccent = Color(0xFFC83E37),
  warningContainer = Color(0xFFFDF3F2),
  analogyAccent = Color(0xFF1B4D3E),
  analogyContainer = Color(0xFFF3F1EB),
)

val SepiaMarainColors = MarainExtendedColors(
  cardBorder = SepiaOutlineVariant,
  inkMuted = SepiaInkMuted,
  primaryLip = SepiaPrimaryLip,
  neutralLip = Color(0xFFD3C3A3),
  masteredGold = Color(0xFFC57B14),
  masteredGoldLip = Color(0xFF965A0A),
  streakAccent = Color(0xFFA96208),
  streakContainer = Color(0xFFF0E3C7),
  xpAccent = Color(0xFF1B4D3E),
  xpContainer = Color(0xFFE1EBE5),
  heartAccent = Color(0xFFB53630),
  correctAccent = Color(0xFF1B6349),
  correctLip = Color(0xFF114231),
  correctContainer = Color(0xFFE4EFE9),
  onCorrectContainer = Color(0xFF103828),
  wrongAccent = Color(0xFFB53630),
  wrongLip = Color(0xFF85221D),
  wrongContainer = Color(0xFFF4E1DC),
  onWrongContainer = Color(0xFF6E1A16),
  tipAccent = Color(0xFF1B4D3E),
  tipContainer = Color(0xFFE7EDE8),
  mythAccent = Color(0xFFA54D0D),
  mythContainer = Color(0xFFF2E6CE),
  exampleAccent = Color(0xFF1E40AF),
  exampleContainer = Color(0xFFE7EBF3),
  warningAccent = Color(0xFFB53630),
  warningContainer = Color(0xFFF3E2DE),
  analogyAccent = Color(0xFF7D441B),
  analogyContainer = Color(0xFFECE1CA),
)

val DarkMarainColors = MarainExtendedColors(
  cardBorder = DarkOutlineVariant,
  inkMuted = DarkInkMuted,
  primaryLip = DarkPrimaryLip,
  neutralLip = Color(0xFF090B0D),
  masteredGold = Color(0xFFE09B32),
  masteredGoldLip = Color(0xFFA36914),
  streakAccent = Color(0xFFE5A235),
  streakContainer = Color(0xFF282114),
  xpAccent = Color(0xFF4DA687),
  xpContainer = Color(0xFF182922),
  heartAccent = Color(0xFFE05A52),
  correctAccent = Color(0xFF3E9E7B),
  correctLip = Color(0xFF256B51),
  correctContainer = Color(0xFF142820),
  onCorrectContainer = Color(0xFFC2EAD9),
  wrongAccent = Color(0xFFE05A52),
  wrongLip = Color(0xFFA3332C),
  wrongContainer = Color(0xFF2C1818),
  onWrongContainer = Color(0xFFF9C8C5),
  tipAccent = Color(0xFF4DA687),
  tipContainer = Color(0xFF16231E),
  mythAccent = Color(0xFFE5A235),
  mythContainer = Color(0xFF261F13),
  exampleAccent = Color(0xFF7BA2F0),
  exampleContainer = Color(0xFF161E2E),
  warningAccent = Color(0xFFE05A52),
  warningContainer = Color(0xFF291717),
  analogyAccent = Color(0xFF4DA687),
  analogyContainer = Color(0xFF1A1E22),
)

val LocalMarainColors = staticCompositionLocalOf { LightMarainColors }
