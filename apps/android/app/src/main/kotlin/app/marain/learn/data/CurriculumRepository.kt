package app.marain.learn.data

import android.content.Context
import app.marain.learn.data.model.Curriculum
import kotlinx.serialization.json.Json
import java.io.InputStream

object CurriculumParser {
  private val json = Json {
    ignoreUnknownKeys = true
    explicitNulls = false
  }

  fun parse(rawJson: String): Curriculum = json.decodeFromString(Curriculum.serializer(), rawJson)

  fun parse(inputStream: InputStream): Curriculum =
    inputStream.bufferedReader(Charsets.UTF_8).use { reader ->
      parse(reader.readText())
    }
}

class CurriculumRepository(private val context: Context) {
  @Volatile
  private var cached: Curriculum? = null

  fun loadCurriculum(): Curriculum {
    cached?.let { return it }
    val parsed = context.assets.open(ASSET_FILE_NAME).use { stream ->
      CurriculumParser.parse(stream)
    }
    cached = parsed
    return parsed
  }

  companion object {
    const val ASSET_FILE_NAME = "curriculum.json"
  }
}
