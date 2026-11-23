package app.marain.learn

import app.marain.learn.data.CurriculumParser
import app.marain.learn.data.model.QuizQuestion
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class CurriculumParsingTest {

  @Test
  fun curriculumAsset_parsesAllModulesChaptersMasteryChecksAndBalancedOptionsCleanly() {
    val rawJson = javaClass.classLoader!!.getResourceAsStream("curriculum.json").let { stream ->
      assertNotNull("Expected bundled asset curriculum.json in app/src/main/assets/", stream)
      stream!!.bufferedReader(Charsets.UTF_8).use { it.readText() }
    }
    assertFalse(
      "Legacy brand 'Zero2AI' must not appear anywhere in bundled curriculum.json",
      rawJson.contains("zero2ai", ignoreCase = true),
    )

    val curriculum = CurriculumParser.parse(rawJson)

    assertTrue("version must not be blank", curriculum.version.isNotBlank())
    assertEquals("appName must be Marain", "Marain", curriculum.appName)
    assertEquals("tagline must match Marain tagline", "From Zero to Fluent in AI", curriculum.tagline)

    assertEquals("Expected exactly 7 modules", 7, curriculum.modules.size)
    assertTrue("Expected at least 28 chapters, found ${curriculum.totalChapters}", curriculum.totalChapters >= 28)
    assertTrue("Expected at least 40 glossary terms, found ${curriculum.glossary.size}", curriculum.glossary.size >= 40)
    assertTrue("Expected at least 6 labs, found ${curriculum.labs.size}", curriculum.labs.size >= 6)

    val glossaryIds = curriculum.glossary.map { it.id }.toSet()
    assertEquals("Glossary term IDs must be unique", curriculum.glossary.size, glossaryIds.size)

    val labIds = curriculum.labs.map { it.id }.toSet()
    assertEquals("Lab IDs must be unique", curriculum.labs.size, labIds.size)

    val validCategories = setOf("foundations", "tokens", "money", "agents", "cli", "building")
    curriculum.glossary.forEach { term ->
      assertTrue("Glossary term missing title: ${term.id}", term.term.isNotBlank())
      assertTrue("Glossary term missing shortDef: ${term.id}", term.shortDef.isNotBlank())
      assertTrue("Glossary term missing analogy: ${term.id}", term.analogy.isNotBlank())
      assertTrue("Glossary term missing example: ${term.id}", term.example.isNotBlank())
      assertTrue(
        "Unexpected glossary category '${term.category}' for ${term.id}",
        term.category.lowercase() in validCategories,
      )
    }

    val seenModuleIds = mutableSetOf<String>()
    val seenChapterIds = mutableSetOf<String>()
    val seenMasteryCheckIds = mutableSetOf<String>()
    val allFourOptionQuestions = mutableListOf<QuizQuestion>()
    val validQuestionTypes = setOf("multiple_choice", "true_false", "spot_mistake")
    val validCalloutTypes = setOf("tip", "myth", "example", "warning")
    val hexRegex = Regex("^#[0-9A-Fa-f]{6}$")

    fun validateQuestion(q: QuizQuestion, seenIds: MutableSet<String>, ownerLabel: String) {
      assertTrue("Duplicate quiz id ${q.id} in $ownerLabel", seenIds.add(q.id))
      assertTrue("Invalid quiz type '${q.type}' in ${q.id}", q.type.lowercase() in validQuestionTypes)
      assertTrue("Question text blank in ${q.id}", q.question.isNotBlank())
      assertTrue("Quiz ${q.id} must have >= 2 options", q.options.size >= 2)
      assertTrue("correctIndex ${q.correctIndex} out of bounds in ${q.id}", q.correctIndex in q.options.indices)
      assertFalse("Option text cannot be blank in ${q.id}", q.options.any { it.isBlank() })
      assertTrue("Explanation blank in ${q.id}", q.explanation.isNotBlank())
      if (q.options.size == 4) {
        allFourOptionQuestions.add(q)
      }
    }

    curriculum.modules.forEachIndexed { idx, module ->
      assertTrue("Duplicate module id: ${module.id}", seenModuleIds.add(module.id))
      assertEquals("Modules should be numbered sequentially", idx + 1, module.number)
      assertTrue("Module title blank: ${module.id}", module.title.isNotBlank())
      assertTrue("Module subtitle blank: ${module.id}", module.subtitle.isNotBlank())
      assertTrue("Module icon blank: ${module.id}", module.icon.isNotBlank())
      assertTrue("Invalid accentHex '${module.accentHex}' on ${module.id}", hexRegex.matches(module.accentHex))
      assertTrue("Module estimatedMinutes must be positive: ${module.id}", module.estimatedMinutes > 0)
      module.recommendedLabId?.let { labId ->
        assertTrue("Unknown recommendedLabId '$labId' on ${module.id}", labId in labIds)
      }
      assertTrue("Module ${module.id} must have >= 4 chapters", module.chapters.size >= 4)

      // Validate Unit Mastery Check on every module
      val masteryCheck = module.masteryCheck
      assertNotNull("Module ${module.id} must define a masteryCheck", masteryCheck)
      masteryCheck!!
      assertTrue("Duplicate masteryCheck id: ${masteryCheck.id}", seenMasteryCheckIds.add(masteryCheck.id))
      assertTrue("MasteryCheck title blank on ${module.id}", masteryCheck.title.isNotBlank())
      assertTrue("MasteryCheck passThreshold out of expected range on ${module.id}", masteryCheck.passThreshold in 0.70..0.95)
      assertTrue("MasteryCheck xpReward must be positive on ${module.id}", masteryCheck.xpReward > 0)
      assertTrue("MasteryCheck estimatedMinutes must be positive on ${module.id}", masteryCheck.estimatedMinutes > 0)
      assertTrue("MasteryCheck on ${module.id} must have >= 4 questions", masteryCheck.questions.size >= 4)
      val seenMcQuizIds = mutableSetOf<String>()
      masteryCheck.questions.forEach { q ->
        validateQuestion(q, seenMcQuizIds, "masteryCheck ${masteryCheck.id}")
      }

      module.chapters.forEach { chapter ->
        assertTrue("Duplicate chapter id: ${chapter.id}", seenChapterIds.add(chapter.id))
        assertEquals("Chapter moduleId mismatch on ${chapter.id}", module.id, chapter.moduleId)
        assertTrue("Chapter title blank: ${chapter.id}", chapter.title.isNotBlank())
        assertTrue("Chapter summary blank: ${chapter.id}", chapter.summary.isNotBlank())
        assertTrue("Chapter readMinutes must be > 0: ${chapter.id}", chapter.readMinutes > 0)
        assertTrue("Chapter xpReward must be > 0: ${chapter.id}", chapter.xpReward > 0)
        assertTrue("Analogy title blank: ${chapter.id}", chapter.analogy.title.isNotBlank())
        assertTrue("Analogy body blank: ${chapter.id}", chapter.analogy.body.isNotBlank())
        assertTrue("Chapter ${chapter.id} must have >= 3 sections", chapter.sections.size >= 3)
        assertTrue("Chapter ${chapter.id} must have >= 3 keyTakeaways", chapter.keyTakeaways.size >= 3)
        assertTrue("Chapter ${chapter.id} must have >= 3 quiz questions", chapter.quiz.size >= 3)

        chapter.sections.forEach { section ->
          assertTrue("Section heading blank in ${chapter.id}", section.heading.isNotBlank())
          assertTrue("Section body blank in ${chapter.id}", section.body.isNotBlank())
          section.callout?.let { callout ->
            assertTrue(
              "Invalid callout type '${callout.type}' in ${chapter.id}",
              callout.type.lowercase() in validCalloutTypes,
            )
            assertTrue("Callout body blank in ${chapter.id}", callout.body.isNotBlank())
          }
        }

        chapter.glossaryTermIds.forEach { termId ->
          assertTrue("Unresolved glossaryTermId '$termId' in ${chapter.id}", termId in glossaryIds)
        }

        chapter.relatedLabId?.let { labId ->
          assertTrue("Unresolved relatedLabId '$labId' in ${chapter.id}", labId in labIds)
        }

        val seenQuizIds = mutableSetOf<String>()
        chapter.quiz.forEach { q ->
          validateQuestion(q, seenQuizIds, "chapter ${chapter.id}")
        }
      }
    }

    // Unit 1 must be a tight, phone-only experience with zero desktop-lab pointers
    val unit1 = curriculum.orderedModules().first()
    assertEquals(1, unit1.number)
    assertNull("Unit 1 must not point to a desktop recommendedLabId", unit1.recommendedLabId)
    assertTrue("Unit 1 must be phone-only", unit1.isPhoneOnly)
    assertTrue("Unit 1 estimatedMinutes should be <= 6 for a crisp ~5-min flow", unit1.estimatedMinutes <= 6)
    unit1.chapters.forEach { ch ->
      assertNull("Unit 1 chapter ${ch.id} must not point to a desktop lab", ch.relatedLabId)
    }

    // Guard against answer-length bias: strictly longest option must NOT be correct > 35% of 4-option questions
    assertTrue("Expected at least 56 four-option questions", allFourOptionQuestions.size >= 56)
    val strictlyLongestCorrect = allFourOptionQuestions.count { q ->
      val correctLen = q.options[q.correctIndex].length
      q.options.indices.all { i -> i == q.correctIndex || correctLen > q.options[i].length }
    }
    val longestRatio = strictlyLongestCorrect.toDouble() / allFourOptionQuestions.size.toDouble()
    assertTrue(
      "Answer-length bias detected: strictly longest option is correct in $strictlyLongestCorrect/${allFourOptionQuestions.size} (${(longestRatio * 100).toInt()}%, max allowed 35%)",
      longestRatio <= 0.35,
    )
  }
}
