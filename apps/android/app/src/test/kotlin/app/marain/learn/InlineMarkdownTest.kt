package app.marain.learn

import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import app.marain.learn.data.CurriculumParser
import app.marain.learn.ui.components.InlineMarkdown
import app.marain.learn.ui.components.MarkdownBlock
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class InlineMarkdownTest {

  @Test
  fun parse_stylesBoldItalicCodeAndNestedBoldCodeCleanly() {
    val input = "Use **`CLAUDE.md`** for *standing rules* and `Esc` to stop **loops**."
    val parsed = InlineMarkdown.parse(input)

    assertEquals("Use CLAUDE.md for standing rules and Esc to stop loops.", parsed.text)
    assertFalse("Should not contain raw **", parsed.text.contains("**"))
    assertFalse("Should not contain raw backticks", parsed.text.contains("`"))

    // Verify CLAUDE.md has both Bold and Monospace spans
    val claudeStart = parsed.text.indexOf("CLAUDE.md")
    val claudeEnd = claudeStart + "CLAUDE.md".length
    val claudeSpans = parsed.spanStyles.filter { it.start <= claudeStart && it.end >= claudeEnd }
    assertTrue("CLAUDE.md should be bold", claudeSpans.any { it.item.fontWeight == FontWeight.Bold })
    assertTrue("CLAUDE.md should be monospace", claudeSpans.any { it.item.fontFamily == FontFamily.Monospace })

    // Verify standing rules is italic
    val italicStart = parsed.text.indexOf("standing rules")
    val italicEnd = italicStart + "standing rules".length
    assertTrue(
      "standing rules should be italic",
      parsed.spanStyles.any { it.start == italicStart && it.end == italicEnd && it.item.fontStyle == FontStyle.Italic },
    )

    // Verify Esc is monospace
    val escStart = parsed.text.indexOf("Esc")
    val escEnd = escStart + "Esc".length
    assertTrue(
      "Esc should be monospace",
      parsed.spanStyles.any { it.start == escStart && it.end == escEnd && it.item.fontFamily == FontFamily.Monospace },
    )
  }

  @Test
  fun parse_preservesArithmeticAsterisks() {
    val input = "Cost is 2 * 3 = 6 cents per request."
    val parsed = InlineMarkdown.parse(input)
    assertEquals(input, parsed.text)
    assertTrue(parsed.spanStyles.isEmpty())
  }

  @Test
  fun splitBlocks_extractsFencedCodeBlocksAndTrailingParagraphs() {
    val input = """
      ```diff
      - <h1>Old</h1>
      + <h1>New</h1>
      ```
      Red = removed. Green = added.
    """.trimIndent()

    val blocks = InlineMarkdown.splitBlocks(input)
    assertEquals(2, blocks.size)
    val codeBlock = blocks[0] as MarkdownBlock.CodeBlock
    assertEquals("diff", codeBlock.language)
    assertTrue(codeBlock.code.contains("+ <h1>New</h1>"))
    val trailing = blocks[1] as MarkdownBlock.Paragraph
    assertEquals("Red = removed. Green = added.", trailing.text)
  }

  @Test
  fun curriculumAsset_rendersZeroRawMarkdownMarkersAcrossAllEntries() {
    val stream = javaClass.classLoader!!.getResourceAsStream("curriculum.json")
    assertNotNull(stream)
    val curriculum = CurriculumParser.parse(stream!!)

    fun assertCleanInline(label: String, raw: String) {
      val rendered = InlineMarkdown.parse(raw).text
      assertFalse("Raw '**' leaked in $label: $rendered", rendered.contains("**"))
      assertFalse("Raw backtick leaked in $label: $rendered", rendered.contains("`"))
    }

    fun assertCleanBlocks(label: String, raw: String) {
      val blocks = InlineMarkdown.splitBlocks(raw)
      assertTrue("Expected at least one block in $label", blocks.isNotEmpty())
      blocks.forEach { block ->
        if (block is MarkdownBlock.Paragraph) {
          assertCleanInline(label, block.text)
          assertFalse("Raw code fence leaked in $label", block.text.contains("```"))
        }
      }
    }

    curriculum.modules.forEach { mod ->
      assertCleanInline("module ${mod.id} title", mod.title)
      assertCleanInline("module ${mod.id} subtitle", mod.subtitle)
      mod.masteryCheck?.let { mc ->
        assertCleanInline("masteryCheck ${mc.id} title", mc.title)
        assertCleanInline("masteryCheck ${mc.id} subtitle", mc.subtitle)
        mc.questions.forEach { q ->
          assertCleanInline("masteryCheck ${mc.id} question ${q.id}", q.question)
          assertCleanInline("masteryCheck ${mc.id} explanation ${q.id}", q.explanation)
          q.options.forEachIndexed { idx, opt ->
            assertCleanInline("masteryCheck ${mc.id} ${q.id} option[$idx]", opt)
          }
        }
      }
      mod.chapters.forEach { ch ->
        assertCleanInline("chapter ${ch.id} title", ch.title)
        assertCleanInline("chapter ${ch.id} summary", ch.summary)
        assertCleanInline("chapter ${ch.id} analogy.title", ch.analogy.title)
        assertCleanBlocks("chapter ${ch.id} analogy.body", ch.analogy.body)
        ch.sections.forEachIndexed { idx, sec ->
          assertCleanInline("chapter ${ch.id} section[$idx].heading", sec.heading)
          assertCleanBlocks("chapter ${ch.id} section[$idx].body", sec.body)
          sec.callout?.let { c ->
            assertCleanInline("chapter ${ch.id} callout[$idx].title", c.title)
            assertCleanBlocks("chapter ${ch.id} callout[$idx].body", c.body)
          }
        }
        ch.keyTakeaways.forEachIndexed { idx, k ->
          assertCleanInline("chapter ${ch.id} takeaway[$idx]", k)
        }
        ch.quiz.forEach { q ->
          assertCleanInline("quiz ${q.id} question", q.question)
          assertCleanInline("quiz ${q.id} explanation", q.explanation)
          q.options.forEachIndexed { idx, opt ->
            assertCleanInline("quiz ${q.id} option[$idx]", opt)
          }
        }
      }
    }

    curriculum.glossary.forEach { g ->
      assertCleanInline("glossary ${g.id} shortDef", g.shortDef)
      assertCleanInline("glossary ${g.id} analogy", g.analogy)
      assertCleanInline("glossary ${g.id} example", g.example)
    }
  }
}
