package app.marain.learn.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// Light — Warm Editorial Paper (Zerodha Varsity × Apple Design Restraint)
// Every text pair >= 4.5:1 (WCAG AA); every interactive border/control >= 3.0:1.
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
val LightOnSurfaceVariant = Color(0xFF4F4D47)
val LightInkMuted = Color(0xFF625F57)
val LightOutline = Color(0xFF878379)
val LightOutlineVariant = Color(0xFF8E8A80)
val LightHairlineDivider = Color(0xFFE3E0D8)

// Warm Sepia — Long-form Book Reading Paper
val SepiaBackground = Color(0xFFF4ECD8)
val SepiaSurface = Color(0xFFFAF3E3)
val SepiaSurfaceVariant = Color(0xFFEAE0C8)
val SepiaPrimary = Color(0xFF1B4D3E)
val SepiaPrimaryLip = Color(0xFF11352A)
val SepiaOnPrimary = Color(0xFFFAF6EC)
val SepiaPrimaryContainer = Color(0xFFDFEAE3)
val SepiaOnPrimaryContainer = Color(0xFF11352A)
val SepiaSecondary = Color(0xFF7D3F14)
val SepiaOnSecondary = Color(0xFFFFFFFF)
val SepiaOnBackground = Color(0xFF2B2218)
val SepiaOnSurface = Color(0xFF2B2218)
val SepiaOnSurfaceVariant = Color(0xFF524436)
val SepiaInkMuted = Color(0xFF615140)
val SepiaOutline = Color(0xFF83745C)
val SepiaOutlineVariant = Color(0xFF8A7B62)
val SepiaHairlineDivider = Color(0xFFDDD0B5)

// Dark — True Warm Obsidian (WCAG AA verified across surfaces, muted ink, borders, and accents)
val DarkBackground = Color(0xFF101214)
val DarkSurface = Color(0xFF181B1F)
val DarkSurfaceVariant = Color(0xFF22272E)
val DarkPrimary = Color(0xFF58C49E)
val DarkPrimaryLip = Color(0xFF2D8266)
val DarkOnPrimary = Color(0xFF061F17)
val DarkPrimaryContainer = Color(0xFF162C24)
val DarkOnPrimaryContainer = Color(0xFFD4F4E7)
val DarkSecondary = Color(0xFF8AB4FF)
val DarkOnSecondary = Color(0xFF081A3D)
val DarkOnBackground = Color(0xFFF3F1EC)
val DarkOnSurface = Color(0xFFF3F1EC)
val DarkOnSurfaceVariant = Color(0xFFC2BEB5)
val DarkInkMuted = Color(0xFFA5A198)
val DarkOutline = Color(0xFF6E7684)
val DarkOutlineVariant = Color(0xFF616A78)
val DarkHairlineDivider = Color(0xFF2E343D)

@Immutable
data class UnitEditorialPalette(
  val fill: Color,
  val lip: Color,
  val accent: Color,
  val subtleTint: Color,
  val onFill: Color = Color.White,
  val onFillMuted: Color = Color.White.copy(alpha = 0.92f),
)

/**
 * 7 cohesive, mature editorial unit colors with matched tactile 3D bottom lips.
 * Provides both banner/node fills (with crisp white onFill text >= 4.5:1) and
 * theme-aware [UnitEditorialPalette.accent] inks (>= 4.5:1 on light, sepia, and dark surfaces).
 */
fun editorialUnitPalette(unitNumber: Int, isDark: Boolean = false): UnitEditorialPalette {
  if (isDark) {
    return when (unitNumber) {
      1 -> UnitEditorialPalette(
        fill = Color(0xFF21785E),
        lip = Color(0xFF144E3D),
        accent = Color(0xFF58C49E),
        subtleTint = Color(0xFF162C24),
      )
      2 -> UnitEditorialPalette(
        fill = Color(0xFF3664DA),
        lip = Color(0xFF214196),
        accent = Color(0xFF8CB2F8),
        subtleTint = Color(0xFF162138),
      )
      3 -> UnitEditorialPalette(
        fill = Color(0xFFA84E0A),
        lip = Color(0xFF743505),
        accent = Color(0xFFF2B649),
        subtleTint = Color(0xFF2B2012),
      )
      4 -> UnitEditorialPalette(
        fill = Color(0xFF7C42E0),
        lip = Color(0xFF53289E),
        accent = Color(0xFFC29DFF),
        subtleTint = Color(0xFF221933),
      )
      5 -> UnitEditorialPalette(
        fill = Color(0xFFC02966),
        lip = Color(0xFF871945),
        accent = Color(0xFFF486B2),
        subtleTint = Color(0xFF2F1722),
      )
      6 -> UnitEditorialPalette(
        fill = Color(0xFF15758D),
        lip = Color(0xFF0C4D5E),
        accent = Color(0xFF5DC7DE),
        subtleTint = Color(0xFF14272D),
      )
      else -> UnitEditorialPalette(
        fill = Color(0xFF865E40),
        lip = Color(0xFF5B3F29),
        accent = Color(0xFFD9B08E),
        subtleTint = Color(0xFF261E18),
      )
    }
  }

  return when (unitNumber) {
    1 -> UnitEditorialPalette(
      fill = Color(0xFF1B4D3E),
      lip = Color(0xFF11352A),
      accent = Color(0xFF1B4D3E),
      subtleTint = Color(0xFFEAF2EF),
    )
    2 -> UnitEditorialPalette(
      fill = Color(0xFF1E40AF),
      lip = Color(0xFF142B78),
      accent = Color(0xFF1E40AF),
      subtleTint = Color(0xFFEDF1FB),
    )
    3 -> UnitEditorialPalette(
      fill = Color(0xFF9A4306),
      lip = Color(0xFF6E2E03),
      accent = Color(0xFF9A4306),
      subtleTint = Color(0xFFFBF3EB),
    )
    4 -> UnitEditorialPalette(
      fill = Color(0xFF5B21B6),
      lip = Color(0xFF3E1480),
      accent = Color(0xFF5B21B6),
      subtleTint = Color(0xFFF2EEFB),
    )
    5 -> UnitEditorialPalette(
      fill = Color(0xFF9D174D),
      lip = Color(0xFF6E0E35),
      accent = Color(0xFF9D174D),
      subtleTint = Color(0xFFF9EEF2),
    )
    6 -> UnitEditorialPalette(
      fill = Color(0xFF0F5A6E),
      lip = Color(0xFF093D4B),
      accent = Color(0xFF0F5A6E),
      subtleTint = Color(0xFFEBF4F6),
    )
    else -> UnitEditorialPalette(
      fill = Color(0xFF4A3525),
      lip = Color(0xFF2E2015),
      accent = Color(0xFF4A3525),
      subtleTint = Color(0xFFF3EFEA),
    )
  }
}

@Immutable
data class MarainExtendedColors(
  val isDark: Boolean,
  val cardBorder: Color,
  val hairlineDivider: Color,
  val inkMuted: Color,
  val primaryLip: Color,
  val neutralLip: Color,
  val masteredGold: Color,
  val masteredGoldLip: Color,
  val onMasteredGold: Color,
  val streakAccent: Color,
  val streakContainer: Color,
  val xpAccent: Color,
  val xpContainer: Color,
  val heartAccent: Color,
  val correctAccent: Color,
  val correctLip: Color,
  val onCorrectAccent: Color,
  val correctContainer: Color,
  val onCorrectContainer: Color,
  val wrongAccent: Color,
  val wrongLip: Color,
  val onWrongAccent: Color,
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
  isDark = false,
  cardBorder = LightOutlineVariant,
  hairlineDivider = LightHairlineDivider,
  inkMuted = LightInkMuted,
  primaryLip = LightPrimaryLip,
  neutralLip = Color(0xFFC4BFB4),
  masteredGold = Color(0xFFA45D06),
  masteredGoldLip = Color(0xFF784203),
  onMasteredGold = Color(0xFFFFFFFF),
  streakAccent = Color(0xFF945200),
  streakContainer = Color(0xFFF8F1E3),
  xpAccent = Color(0xFF1B4D3E),
  xpContainer = Color(0xFFEAF2EF),
  heartAccent = Color(0xFFB82924),
  correctAccent = Color(0xFF166547),
  correctLip = Color(0xFF0E4530),
  onCorrectAccent = Color(0xFFFFFFFF),
  correctContainer = Color(0xFFEEF7F3),
  onCorrectContainer = Color(0xFF0F3B2B),
  wrongAccent = Color(0xFFB82924),
  wrongLip = Color(0xFF851B18),
  onWrongAccent = Color(0xFFFFFFFF),
  wrongContainer = Color(0xFFFDF1F0),
  onWrongContainer = Color(0xFF7A1C18),
  tipAccent = Color(0xFF1B4D3E),
  tipContainer = Color(0xFFF1F5F3),
  mythAccent = Color(0xFF9A4306),
  mythContainer = Color(0xFFFBF6EE),
  exampleAccent = Color(0xFF1E40AF),
  exampleContainer = Color(0xFFF2F5FC),
  warningAccent = Color(0xFFB82924),
  warningContainer = Color(0xFFFDF3F2),
  analogyAccent = Color(0xFF1B4D3E),
  analogyContainer = Color(0xFFF3F1EB),
)

val SepiaMarainColors = MarainExtendedColors(
  isDark = false,
  cardBorder = SepiaOutlineVariant,
  hairlineDivider = SepiaHairlineDivider,
  inkMuted = SepiaInkMuted,
  primaryLip = SepiaPrimaryLip,
  neutralLip = Color(0xFFBFAE8E),
  masteredGold = Color(0xFF9A5605),
  masteredGoldLip = Color(0xFF703D03),
  onMasteredGold = Color(0xFFFFFFFF),
  streakAccent = Color(0xFF854800),
  streakContainer = Color(0xFFF0E3C7),
  xpAccent = Color(0xFF1B4D3E),
  xpContainer = Color(0xFFE1EBE5),
  heartAccent = Color(0xFFA82520),
  correctAccent = Color(0xFF165C42),
  correctLip = Color(0xFF0E3E2C),
  onCorrectAccent = Color(0xFFFFFFFF),
  correctContainer = Color(0xFFE4EFE9),
  onCorrectContainer = Color(0xFF103828),
  wrongAccent = Color(0xFFA82520),
  wrongLip = Color(0xFF7A1815),
  onWrongAccent = Color(0xFFFFFFFF),
  wrongContainer = Color(0xFFF4E1DC),
  onWrongContainer = Color(0xFF6E1A16),
  tipAccent = Color(0xFF1B4D3E),
  tipContainer = Color(0xFFE7EDE8),
  mythAccent = Color(0xFF8C3E07),
  mythContainer = Color(0xFFF2E6CE),
  exampleAccent = Color(0xFF1B3B9E),
  exampleContainer = Color(0xFFE7EBF3),
  warningAccent = Color(0xFFA82520),
  warningContainer = Color(0xFFF3E2DE),
  analogyAccent = Color(0xFF733D16),
  analogyContainer = Color(0xFFECE1CA),
)

val DarkMarainColors = MarainExtendedColors(
  isDark = true,
  cardBorder = DarkOutlineVariant,
  hairlineDivider = DarkHairlineDivider,
  inkMuted = DarkInkMuted,
  primaryLip = DarkPrimaryLip,
  neutralLip = Color(0xFF090B0D),
  masteredGold = Color(0xFFEBB44D),
  masteredGoldLip = Color(0xFFA8761A),
  onMasteredGold = Color(0xFF1C1202),
  streakAccent = Color(0xFFF2B649),
  streakContainer = Color(0xFF282114),
  xpAccent = Color(0xFF58C49E),
  xpContainer = Color(0xFF162C24),
  heartAccent = Color(0xFFF4766D),
  correctAccent = Color(0xFF4FC49A),
  correctLip = Color(0xFF298061),
  onCorrectAccent = Color(0xFF062117),
  correctContainer = Color(0xFF132920),
  onCorrectContainer = Color(0xFFC9EFE0),
  wrongAccent = Color(0xFFF4766D),
  wrongLip = Color(0xFFA63A32),
  onWrongAccent = Color(0xFF2B0705),
  wrongContainer = Color(0xFF2E1717),
  onWrongContainer = Color(0xFFFBD0CD),
  tipAccent = Color(0xFF58C49E),
  tipContainer = Color(0xFF15241E),
  mythAccent = Color(0xFFF2B649),
  mythContainer = Color(0xFF261F13),
  exampleAccent = Color(0xFF8CB2F8),
  exampleContainer = Color(0xFF151E2E),
  warningAccent = Color(0xFFF4766D),
  warningContainer = Color(0xFF2B1717),
  analogyAccent = Color(0xFF58C49E),
  analogyContainer = Color(0xFF191E23),
)

val LocalMarainColors = staticCompositionLocalOf { LightMarainColors }
