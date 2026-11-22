package app.marain.learn.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.ExpandLess
import androidx.compose.material.icons.rounded.ExpandMore
import androidx.compose.material.icons.rounded.Replay
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.marain.learn.data.PhraseMasteryOutcome
import app.marain.learn.data.ProgressEngine
import app.marain.learn.data.model.GlossaryTerm
import app.marain.learn.ui.components.EditorialProgressBar
import app.marain.learn.ui.components.TactileButton
import app.marain.learn.ui.components.categoryDisplayLabel
import app.marain.learn.ui.components.rememberMarkdown
import app.marain.learn.ui.theme.LocalMarainColors
import app.marain.learn.ui.theme.PlusJakartaSansFontFamily

private val PHRASEBOOK_CATEGORIES = listOf(
  "all",
  "foundations",
  "tokens",
  "money",
  "agents",
  "cli",
  "building",
)

private enum class PhrasebookMode(val label: String) {
  BROWSE("Browse"),
  FLASHCARDS("Flashcards"),
}

@Composable
fun PhrasebookScreen(
  glossary: List<GlossaryTerm>,
  masteredPhraseIds: Set<String>,
  onMarkPhraseMastered: (String) -> PhraseMasteryOutcome,
  modifier: Modifier = Modifier,
) {
  val marain = LocalMarainColors.current
  var mode by rememberSaveable { mutableStateOf(PhrasebookMode.BROWSE) }
  var query by rememberSaveable { mutableStateOf("") }
  var selectedCategory by rememberSaveable { mutableStateOf("all") }
  var expandedIds by remember { mutableStateOf(setOf<String>()) }

  val categoryFiltered = remember(glossary, selectedCategory) {
    glossary.filter { term ->
      selectedCategory == "all" || term.category.equals(selectedCategory, ignoreCase = true)
    }
  }

  val browseTerms = remember(categoryFiltered, query) {
    val trimmed = query.trim().lowercase()
    categoryFiltered
      .filter { term ->
        trimmed.isEmpty() ||
          term.term.lowercase().contains(trimmed) ||
          term.shortDef.lowercase().contains(trimmed) ||
          term.analogy.lowercase().contains(trimmed) ||
          term.example.lowercase().contains(trimmed)
      }
      .sortedBy { it.term.lowercase() }
  }

  Column(modifier = modifier.fillMaxSize()) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp)
        .padding(top = 16.dp, bottom = 12.dp),
      verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
      // Clean Editorial Header
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Bottom,
      ) {
        Text(
          text = "Phrasebook",
          style = MaterialTheme.typography.displaySmall,
          color = MaterialTheme.colorScheme.onBackground,
        )
        Text(
          text = "${masteredPhraseIds.size} of ${glossary.size} mastered",
          style = MaterialTheme.typography.labelMedium,
          color = marain.inkMuted,
          modifier = Modifier.padding(bottom = 5.dp),
        )
      }

      // Minimalist Segmented Toggle (Warm track + crisp white thumb)
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
        border = BorderStroke(1.dp, marain.cardBorder),
      ) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(3.dp),
          horizontalArrangement = Arrangement.spacedBy(4.dp),
        ) {
          PhrasebookMode.entries.forEach { tabMode ->
            val selected = tabMode == mode
            Surface(
              modifier = Modifier
                .weight(1f)
                .clip(RoundedCornerShape(9.dp))
                .clickable { mode = tabMode },
              shape = RoundedCornerShape(9.dp),
              color = if (selected) MaterialTheme.colorScheme.surface else Color.Transparent,
              border = if (selected) BorderStroke(1.dp, marain.cardBorder) else null,
            ) {
              Box(
                modifier = Modifier.padding(vertical = 9.dp),
                contentAlignment = Alignment.Center,
              ) {
                Text(
                  text = tabMode.label,
                  style = MaterialTheme.typography.labelLarge,
                  fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
                  color = if (selected) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                )
              }
            }
          }
        }
      }

      // Clean Horizontal Category Chips
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(7.dp),
      ) {
        PHRASEBOOK_CATEGORIES.forEach { category ->
          val selected = selectedCategory == category
          Surface(
            modifier = Modifier
              .clip(RoundedCornerShape(8.dp))
              .clickable { selectedCategory = category },
            shape = RoundedCornerShape(8.dp),
            color = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface,
            border = if (selected) null else BorderStroke(1.dp, marain.cardBorder),
          ) {
            Text(
              text = categoryDisplayLabel(category),
              style = MaterialTheme.typography.labelMedium,
              color = if (selected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
            )
          }
        }
      }
    }

    when (mode) {
      PhrasebookMode.BROWSE -> {
        Column(modifier = Modifier.fillMaxSize()) {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 20.dp)
              .padding(bottom = 8.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
          ) {
            OutlinedTextField(
              value = query,
              onValueChange = { query = it },
              modifier = Modifier.fillMaxWidth(),
              singleLine = true,
              shape = RoundedCornerShape(12.dp),
              placeholder = {
                Text(
                  text = "Search tokens, API keys, MCP, Claude CLI…",
                  style = MaterialTheme.typography.bodyMedium,
                  color = marain.inkMuted,
                )
              },
              leadingIcon = {
                Icon(
                  imageVector = Icons.Rounded.Search,
                  contentDescription = "Search",
                  tint = marain.inkMuted,
                  modifier = Modifier.size(20.dp),
                )
              },
              trailingIcon = {
                if (query.isNotEmpty()) {
                  IconButton(onClick = { query = "" }) {
                    Icon(
                      imageVector = Icons.Rounded.Close,
                      contentDescription = "Clear search",
                      modifier = Modifier.size(18.dp),
                    )
                  }
                }
              },
              colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = marain.cardBorder,
              ),
            )
          }

          if (browseTerms.isEmpty()) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 40.dp),
              horizontalAlignment = Alignment.CenterHorizontally,
              verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
              Text(
                text = "No matching phrases",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
              )
              Text(
                text = "Try searching for \"token\", \"model\", \"agent\", or reset your filter.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
              )
              OutlinedButton(
                onClick = {
                  query = ""
                  selectedCategory = "all"
                },
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, marain.cardBorder),
              ) {
                Text("Reset filters")
              }
            }
          } else {
            LazyColumn(
              modifier = Modifier.fillMaxSize(),
              contentPadding = PaddingValues(horizontal = 20.dp, vertical = 6.dp),
              verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
              items(items = browseTerms, key = { it.id }) { term ->
                val isExpanded = term.id in expandedIds
                EditorialPhraseCard(
                  term = term,
                  expanded = isExpanded,
                  isMastered = term.id in masteredPhraseIds,
                  onToggle = {
                    expandedIds = if (isExpanded) expandedIds - term.id else expandedIds + term.id
                  },
                )
              }
              item(key = "phrasebook_footer_spacer") {
                Spacer(modifier = Modifier.height(16.dp))
              }
            }
          }
        }
      }

      PhrasebookMode.FLASHCARDS -> {
        FlashcardsDeckView(
          terms = categoryFiltered,
          masteredPhraseIds = masteredPhraseIds,
          categoryKey = selectedCategory,
          onMarkMastered = onMarkPhraseMastered,
        )
      }
    }
  }
}

@Composable
private fun FlashcardsDeckView(
  terms: List<GlossaryTerm>,
  masteredPhraseIds: Set<String>,
  categoryKey: String,
  onMarkMastered: (String) -> PhraseMasteryOutcome,
) {
  val marain = LocalMarainColors.current
  val initialDeck = remember(categoryKey, terms) {
    val unmastered = terms.filter { it.id !in masteredPhraseIds }
    val mastered = terms.filter { it.id in masteredPhraseIds }
    unmastered + mastered
  }
  var deck by remember(categoryKey, terms) { mutableStateOf(initialDeck) }
  var cardIndex by remember(categoryKey, terms) { mutableIntStateOf(0) }
  var isFlipped by remember(categoryKey, terms) { mutableStateOf(false) }
  var lastFeedback by remember(categoryKey) { mutableStateOf<String?>(null) }

  if (deck.isEmpty()) {
    Box(
      modifier = Modifier
        .fillMaxSize()
        .padding(24.dp),
      contentAlignment = Alignment.Center,
    ) {
      Text(
        text = "No phrases in this category.",
        style = MaterialTheme.typography.bodyLarge,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
      )
    }
    return
  }

  val safeIndex = cardIndex.coerceIn(0, deck.lastIndex)
  val currentTerm = deck[safeIndex]
  val isAlreadyMastered = currentTerm.id in masteredPhraseIds
  val masteredInCategory = terms.count { it.id in masteredPhraseIds }
  val masteryFraction = if (terms.isNotEmpty()) masteredInCategory.toFloat() / terms.size.toFloat() else 0f

  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(horizontal = 20.dp, vertical = 6.dp),
    verticalArrangement = Arrangement.spacedBy(14.dp),
  ) {
    // Slim deck progress bar
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
      ) {
        Text(
          text = "Card ${safeIndex + 1} of ${deck.size}",
          style = MaterialTheme.typography.bodySmall,
          color = marain.inkMuted,
        )
        Text(
          text = "$masteredInCategory / ${terms.size} mastered",
          style = MaterialTheme.typography.labelMedium,
          color = MaterialTheme.colorScheme.primary,
        )
      }
      EditorialProgressBar(
        progress = masteryFraction,
        fillColor = MaterialTheme.colorScheme.primary,
        height = 4.dp,
        trackColor = marain.cardBorder,
      )
    }

    lastFeedback?.let { feedback ->
      Text(
        text = feedback,
        style = MaterialTheme.typography.labelMedium,
        color = MaterialTheme.colorScheme.primary,
      )
    }

    // Tactile 3D Flip Flashcard (crisp 4.dp bottom lip)
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .clip(RoundedCornerShape(18.dp))
        .background(if (isFlipped) MaterialTheme.colorScheme.primary else marain.neutralLip)
        .padding(bottom = 4.dp)
        .clickable { isFlipped = !isFlipped },
    ) {
      Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(
          width = 1.5.dp,
          color = if (isFlipped) MaterialTheme.colorScheme.primary else marain.cardBorder,
        ),
      ) {
        AnimatedContent(
          targetState = Pair(currentTerm.id, isFlipped),
          label = "flashcardFlip",
        ) { (_, flipped) ->
          if (!flipped) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 52.dp),
              horizontalAlignment = Alignment.CenterHorizontally,
              verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
              val tag = if (isAlreadyMastered) {
                "${categoryDisplayLabel(currentTerm.category).uppercase()} · MASTERED"
              } else {
                categoryDisplayLabel(currentTerm.category).uppercase()
              }
              Text(
                text = tag,
                style = MaterialTheme.typography.labelSmall,
                color = if (isAlreadyMastered) marain.streakAccent else MaterialTheme.colorScheme.primary,
              )

              Text(
                text = currentTerm.term,
                style = MaterialTheme.typography.displaySmall,
                color = MaterialTheme.colorScheme.onSurface,
                textAlign = TextAlign.Center,
              )

              Spacer(modifier = Modifier.height(6.dp))

              Text(
                text = "Tap to reveal meaning",
                style = MaterialTheme.typography.labelMedium,
                color = marain.inkMuted,
              )
            }
          } else {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
              verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
              ) {
                Text(
                  text = currentTerm.term,
                  style = MaterialTheme.typography.headlineSmall,
                  color = MaterialTheme.colorScheme.primary,
                  modifier = Modifier.weight(1f),
                )
                Text(
                  text = "Tap to flip",
                  style = MaterialTheme.typography.labelSmall,
                  color = marain.inkMuted,
                )
              }

              Text(
                text = rememberMarkdown(currentTerm.shortDef),
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface,
              )

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
                    .padding(12.dp),
                  verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                  Text(
                    text = "EVERYDAY ANALOGY",
                    style = MaterialTheme.typography.labelSmall,
                    color = marain.analogyAccent,
                  )
                  Text(
                    text = rememberMarkdown(currentTerm.analogy),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                  )
                }
              }

              if (currentTerm.example.isNotBlank()) {
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
                      .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(3.dp),
                  ) {
                    Text(
                      text = "EXAMPLE",
                      style = MaterialTheme.typography.labelSmall,
                      color = marain.exampleAccent,
                    )
                    Text(
                      text = rememberMarkdown(currentTerm.example),
                      style = MaterialTheme.typography.bodyMedium,
                      color = MaterialTheme.colorScheme.onSurface,
                    )
                  }
                }
              }
            }
          }
        }
      }
    }

    // Crisp Action Row: Review Again | Tactile Got It (+5 XP)
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(10.dp),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      OutlinedButton(
        onClick = {
          val rest = deck.toMutableList().apply { removeAt(safeIndex) }
          rest.add(currentTerm)
          deck = rest
          cardIndex = safeIndex.coerceAtMost(rest.lastIndex)
          isFlipped = false
          lastFeedback = "Queued \"${currentTerm.term}\" for another look."
        },
        modifier = Modifier
          .weight(0.85f)
          .height(52.dp),
        shape = RoundedCornerShape(14.dp),
        border = BorderStroke(1.dp, marain.cardBorder),
      ) {
        Icon(
          imageVector = Icons.Rounded.Replay,
          contentDescription = null,
          modifier = Modifier.size(16.dp),
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text("Review Again", maxLines = 1)
      }

      TactileButton(
        onClick = {
          val result = onMarkMastered(currentTerm.id)
          lastFeedback = if (result.isNewlyMastered) {
            "Mastered \"${currentTerm.term}\" (+${result.xpEarned} XP)"
          } else {
            "Reviewed \"${currentTerm.term}\""
          }
          cardIndex = (safeIndex + 1) % deck.size
          isFlipped = false
        },
        modifier = Modifier.weight(1f),
        height = 48.dp,
      ) {
        Icon(
          imageVector = Icons.Rounded.Check,
          contentDescription = null,
          modifier = Modifier.size(17.dp),
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
          text = if (isAlreadyMastered) "Got It" else "Got It (+${ProgressEngine.FLASHCARD_MASTERY_XP} XP)",
          style = MaterialTheme.typography.labelLarge,
          fontWeight = FontWeight.Bold,
          maxLines = 1,
        )
      }
    }

    Spacer(modifier = Modifier.height(14.dp))
  }
}

@Composable
private fun EditorialPhraseCard(
  term: GlossaryTerm,
  expanded: Boolean,
  isMastered: Boolean,
  onToggle: () -> Unit,
) {
  val marain = LocalMarainColors.current
  Surface(
    modifier = Modifier
      .fillMaxWidth()
      .clip(RoundedCornerShape(14.dp))
      .clickable(onClick = onToggle),
    shape = RoundedCornerShape(14.dp),
    color = MaterialTheme.colorScheme.surface,
    border = BorderStroke(
      width = 1.dp,
      color = if (expanded) MaterialTheme.colorScheme.primary.copy(alpha = 0.5f) else marain.cardBorder,
    ),
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp),
      verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top,
      ) {
        Column(
          modifier = Modifier.weight(1f),
          verticalArrangement = Arrangement.spacedBy(3.dp),
        ) {
          val meta = if (isMastered) {
            "${categoryDisplayLabel(term.category).uppercase()} · MASTERED"
          } else {
            categoryDisplayLabel(term.category).uppercase()
          }
          Text(
            text = meta,
            fontFamily = PlusJakartaSansFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 10.5.sp,
            letterSpacing = 0.7.sp,
            color = if (isMastered) marain.streakAccent else marain.inkMuted,
          )
          Text(
            text = term.term,
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurface,
          )
        }

        Icon(
          imageVector = if (expanded) Icons.Rounded.ExpandLess else Icons.Rounded.ExpandMore,
          contentDescription = if (expanded) "Collapse" else "Expand",
          tint = marain.inkMuted,
          modifier = Modifier.size(20.dp),
        )
      }

      Text(
        text = rememberMarkdown(term.shortDef),
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
      )

      AnimatedVisibility(
        visible = expanded,
        enter = expandVertically() + fadeIn(),
        exit = shrinkVertically() + fadeOut(),
      ) {
        Column(
          modifier = Modifier.padding(top = 6.dp),
          verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          HorizontalDivider(thickness = 1.dp, color = marain.cardBorder)
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .height(IntrinsicSize.Min)
              .clip(RoundedCornerShape(8.dp))
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
                .padding(12.dp),
              verticalArrangement = Arrangement.spacedBy(3.dp),
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
                .clip(RoundedCornerShape(8.dp))
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
                  .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(3.dp),
              ) {
                Text(
                  text = "EXAMPLE",
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
  }
}
