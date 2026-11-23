package app.marain.learn.data.model

import kotlinx.serialization.Serializable
import kotlin.math.ceil
import kotlin.math.roundToInt

@Serializable
data class Curriculum(
  val version: String,
  val appName: String,
  val tagline: String,
  val modules: List<CurriculumModule>,
  val glossary: List<GlossaryTerm>,
  val labs: List<LabInfo>,
) {
  val totalChapters: Int
    get() = modules.sumOf { it.chapters.size }

  fun orderedModules(): List<CurriculumModule> =
    modules.sortedBy { it.number }

  fun findModule(moduleId: String): CurriculumModule? =
    modules.firstOrNull { it.id == moduleId }

  fun findChapter(chapterId: String): Chapter? =
    modules.asSequence().flatMap { it.chapters.asSequence() }.firstOrNull { it.id == chapterId }

  fun findModuleForChapter(chapterId: String): CurriculumModule? =
    modules.firstOrNull { module -> module.chapters.any { it.id == chapterId } }

  fun findGlossaryTerm(termId: String): GlossaryTerm? =
    glossary.firstOrNull { it.id == termId }

  fun findLab(labId: String?): LabInfo? =
    if (labId == null) null else labs.firstOrNull { it.id == labId }

  fun allChaptersOrdered(): List<Chapter> =
    modules.sortedBy { it.number }.flatMap { mod -> mod.chapters.sortedBy { it.number } }
}

@Serializable
data class MasteryCheck(
  val id: String,
  val title: String,
  val subtitle: String = "",
  val passThreshold: Double = 0.75,
  val xpReward: Int = 40,
  val estimatedMinutes: Int = 2,
  val questions: List<QuizQuestion> = emptyList(),
) {
  val passingScorePercent: Int
    get() = (passThreshold.coerceIn(0.0, 1.0) * 100.0).roundToInt()

  val minCorrectToPass: Int
    get() = if (questions.isEmpty()) {
      0
    } else {
      ceil(questions.size * passThreshold.coerceIn(0.0, 1.0) - 1e-9).toInt().coerceIn(1, questions.size)
    }
}

@Serializable
data class CurriculumModule(
  val id: String,
  val number: Int,
  val title: String,
  val subtitle: String,
  val icon: String,
  val accentHex: String,
  val estimatedMinutes: Int,
  val recommendedLabId: String? = null,
  val chapters: List<Chapter>,
  val masteryCheck: MasteryCheck? = null,
) {
  val isPhoneOnly: Boolean
    get() = recommendedLabId == null && chapters.all { it.relatedLabId == null }
}

@Serializable
data class Chapter(
  val id: String,
  val moduleId: String,
  val number: Int,
  val title: String,
  val readMinutes: Int,
  val xpReward: Int,
  val summary: String,
  val analogy: Analogy,
  val sections: List<ChapterSection>,
  val keyTakeaways: List<String>,
  val glossaryTermIds: List<String>,
  val relatedLabId: String? = null,
  val quiz: List<QuizQuestion>,
)

@Serializable
data class Analogy(
  val title: String,
  val body: String,
)

@Serializable
data class ChapterSection(
  val heading: String,
  val body: String,
  val callout: Callout? = null,
)

@Serializable
data class Callout(
  val type: String,
  val title: String,
  val body: String,
)

@Serializable
data class QuizQuestion(
  val id: String,
  val type: String,
  val question: String,
  val options: List<String>,
  val correctIndex: Int,
  val explanation: String,
)

@Serializable
data class GlossaryTerm(
  val id: String,
  val term: String,
  val shortDef: String,
  val analogy: String,
  val category: String,
  val example: String,
)

@Serializable
data class LabInfo(
  val id: String,
  val title: String,
  val subtitle: String,
  val difficulty: String,
  val estimatedMinutes: Int,
  val xpReward: Int,
  val moduleId: String,
  val description: String,
  val desktopOnly: Boolean = false,
)
