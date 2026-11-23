package app.marain.learn.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import app.marain.learn.ui.theme.LocalMarainColors

sealed interface MarkdownBlock {
  data class Paragraph(val text: String) : MarkdownBlock
  data class CodeBlock(val language: String?, val code: String) : MarkdownBlock
}

object InlineMarkdown {

  fun parse(
    text: String,
    codeBackground: Color = Color(0x1F0F766E),
    codeColor: Color = Color(0xFF0F766E),
  ): AnnotatedString = buildAnnotatedString {
    appendInline(
      input = text,
      builder = this,
      codeStyle = SpanStyle(
        fontFamily = FontFamily.Monospace,
        background = codeBackground,
        color = codeColor,
        fontSize = 0.90.em,
      ),
    )
  }

  fun splitBlocks(text: String): List<MarkdownBlock> {
    if (!text.contains("```")) {
      return text.split("\n\n")
        .map { it.trim() }
        .filter { it.isNotEmpty() }
        .map { MarkdownBlock.Paragraph(it) }
    }

    val blocks = mutableListOf<MarkdownBlock>()
    val fenceRegex = Regex("```([a-zA-Z0-9_-]*)\\s*\\n([\\s\\S]*?)```")
    var cursor = 0

    for (match in fenceRegex.findAll(text)) {
      if (match.range.first > cursor) {
        val before = text.substring(cursor, match.range.first)
        before.split("\n\n")
          .map { it.trim() }
          .filter { it.isNotEmpty() }
          .forEach { blocks.add(MarkdownBlock.Paragraph(it)) }
      }
      val lang = match.groupValues[1].trim().ifEmpty { null }
      val code = match.groupValues[2].trimEnd('\n', '\r')
      blocks.add(MarkdownBlock.CodeBlock(language = lang, code = code))
      cursor = match.range.last + 1
    }

    if (cursor < text.length) {
      val tail = text.substring(cursor)
      tail.split("\n\n")
        .map { it.trim() }
        .filter { it.isNotEmpty() }
        .forEach { blocks.add(MarkdownBlock.Paragraph(it)) }
    }

    return blocks
  }

  private fun appendInline(
    input: String,
    builder: AnnotatedString.Builder,
    codeStyle: SpanStyle,
  ) {
    var i = 0
    val n = input.length

    while (i < n) {
      // 1. Inline code: `...`
      if (input[i] == '`') {
        val close = input.indexOf('`', startIndex = i + 1)
        if (close > i + 1) {
          val codeContent = input.substring(i + 1, close)
          val start = builder.length
          builder.append(codeContent)
          builder.addStyle(codeStyle, start, builder.length)
          i = close + 1
          continue
        }
      }

      // 2. Bold: **...** (supports nested `code` or *italic*)
      if (i + 1 < n && input[i] == '*' && input[i + 1] == '*') {
        val close = findClosingDoubleStar(input, i + 2)
        if (close > i + 2) {
          val inner = input.substring(i + 2, close)
          val start = builder.length
          appendInline(inner, builder, codeStyle)
          builder.addStyle(SpanStyle(fontWeight = FontWeight.Bold), start, builder.length)
          i = close + 2
          continue
        }
      }

      // 3. Italic: *...* (must not start with whitespace so arithmetic like "2 * 3" stays literal)
      if (input[i] == '*' && i + 1 < n && !input[i + 1].isWhitespace() && input[i + 1] != '*') {
        val close = findClosingSingleStar(input, i + 1)
        if (close > i + 1) {
          val inner = input.substring(i + 1, close)
          val start = builder.length
          appendInline(inner, builder, codeStyle)
          builder.addStyle(SpanStyle(fontStyle = FontStyle.Italic), start, builder.length)
          i = close + 1
          continue
        }
      }

      builder.append(input[i])
      i += 1
    }
  }

  private fun findClosingDoubleStar(input: String, start: Int): Int {
    var idx = start
    while (idx + 1 < input.length) {
      if (input[idx] == '*' && input[idx + 1] == '*') {
        return idx
      }
      idx += 1
    }
    return -1
  }

  private fun findClosingSingleStar(input: String, start: Int): Int {
    var idx = start
    while (idx < input.length) {
      if (input[idx] == '`') {
        val closeCode = input.indexOf('`', idx + 1)
        if (closeCode > idx) {
          idx = closeCode + 1
          continue
        }
      }
      if (input[idx] == '*') {
        val isDouble = (idx + 1 < input.length && input[idx + 1] == '*')
        if (!isDouble && idx > start && !input[idx - 1].isWhitespace()) {
          return idx
        }
      }
      idx += 1
    }
    return -1
  }
}

@Composable
fun rememberMarkdown(
  text: String,
  codeColor: Color = MaterialTheme.colorScheme.primary,
  codeBackground: Color = codeColor.copy(alpha = 0.11f),
): AnnotatedString {
  return remember(text, codeBackground, codeColor) {
    InlineMarkdown.parse(
      text = text,
      codeBackground = codeBackground,
      codeColor = codeColor,
    )
  }
}

@Composable
fun RichMarkdownBody(
  text: String,
  style: TextStyle,
  color: Color,
  modifier: Modifier = Modifier,
) {
  val varsity = LocalMarainColors.current
  val blocks = remember(text) { InlineMarkdown.splitBlocks(text) }

  Column(
    modifier = modifier,
    verticalArrangement = Arrangement.spacedBy(10.dp),
  ) {
    blocks.forEach { block ->
      when (block) {
        is MarkdownBlock.Paragraph -> {
          Text(
            text = rememberMarkdown(block.text),
            style = style,
            color = color,
          )
        }

        is MarkdownBlock.CodeBlock -> {
          Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            color = MaterialTheme.colorScheme.surfaceVariant,
            border = BorderStroke(1.dp, varsity.cardBorder),
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(12.dp),
              verticalArrangement = Arrangement.spacedBy(3.dp),
            ) {
              if (!block.language.isNullOrBlank()) {
                Text(
                  text = block.language.uppercase(),
                  style = MaterialTheme.typography.labelSmall,
                  color = MaterialTheme.colorScheme.onSurfaceVariant,
                  modifier = Modifier.padding(bottom = 4.dp),
                )
              }
              val isDiff = block.language.equals("diff", ignoreCase = true)
              block.code.lines().forEach { line ->
                val lineColor = when {
                  isDiff && line.startsWith("+") -> varsity.correctAccent
                  isDiff && line.startsWith("-") -> varsity.wrongAccent
                  else -> MaterialTheme.colorScheme.onSurface
                }
                Text(
                  text = line,
                  style = MaterialTheme.typography.bodySmall.copy(
                    fontFamily = FontFamily.Monospace,
                  ),
                  color = lineColor,
                )
              }
            }
          }
        }
      }
    }
  }
}
