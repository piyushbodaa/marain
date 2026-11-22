package app.marain.learn.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.PrivacyPolicyContent
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PrivacyPolicyScreen(
  onBack: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current

  Scaffold(
    modifier = modifier.fillMaxSize(),
    containerColor = MaterialTheme.colorScheme.background,
    topBar = {
      Column {
        TopAppBar(
          title = {
            Text(
              text = "Privacy & Local Data",
              style = MaterialTheme.typography.titleSmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
          },
          navigationIcon = {
            IconButton(onClick = onBack) {
              Icon(
                imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                contentDescription = "Back",
              )
            }
          },
          colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background,
            titleContentColor = MaterialTheme.colorScheme.onBackground,
          ),
        )
        HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)
      }
    },
  ) { innerPadding ->
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
        .verticalScroll(rememberScrollState())
        .padding(horizontal = 22.dp, vertical = 20.dp),
      verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
      // Masthead
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
          text = "100% OFFLINE · LOCAL-ONLY STORAGE",
          fontFamily = PlusJakartaSansFontFamily,
          fontWeight = FontWeight.Bold,
          fontSize = 11.sp,
          letterSpacing = 0.9.sp,
          color = MaterialTheme.colorScheme.primary,
        )
        Text(
          text = PrivacyPolicyContent.TITLE,
          style = MaterialTheme.typography.displaySmall,
          color = MaterialTheme.colorScheme.onBackground,
        )
        Surface(
          shape = RoundedCornerShape(10.dp),
          color = MaterialTheme.colorScheme.surface,
          border = BorderStroke(1.dp, marain.cardBorder),
        ) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 14.dp, vertical = 11.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
          ) {
            Text(
              text = "Effective: ${PrivacyPolicyContent.EFFECTIVE_DATE} · Developer: ${PrivacyPolicyContent.DEVELOPER}",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
              text = "Package: ${PrivacyPolicyContent.PACKAGE_ID}",
              style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
              color = MaterialTheme.colorScheme.onSurface,
            )
          }
        }
      }

      // Plain-English Summary Pull-Quote
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
            .padding(horizontal = 15.dp, vertical = 14.dp),
          verticalArrangement = Arrangement.spacedBy(5.dp),
        ) {
          Text(
            text = "PLAIN-ENGLISH SUMMARY",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.primary,
          )
          Text(
            text = PrivacyPolicyContent.SUMMARY,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface,
          )
        }
      }

      // Policy Sections
      PrivacyPolicyContent.sections.forEachIndexed { idx, section ->
        Column(verticalArrangement = Arrangement.spacedBy(9.dp)) {
          if (idx > 0) {
            HorizontalDivider(
              thickness = 1.dp,
              color = marain.cardBorder,
              modifier = Modifier.padding(bottom = 4.dp),
            )
          }
          Text(
            text = section.heading,
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onBackground,
          )
          section.paragraphs.forEach { paragraph ->
            Text(
              text = paragraph,
              style = MaterialTheme.typography.bodyMedium,
              color = MaterialTheme.colorScheme.onSurface,
            )
          }
          section.bullets.forEach { bullet ->
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
              Text(
                text = "•",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary,
              )
              Text(
                text = bullet,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.weight(1f),
              )
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(16.dp))
    }
  }
}
