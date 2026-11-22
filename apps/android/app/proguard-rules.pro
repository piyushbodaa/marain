# Marain R8 / ProGuard keep rules

# Preserve Kotlin metadata and annotations required by kotlinx.serialization and Compose
-keepattributes *Annotation*, InnerClasses, Signature, EnclosingMethod
-keep class kotlin.Metadata { *; }

# Keep kotlinx.serialization runtime and generated serializers
-keep,includedescriptorclasses class kotlinx.serialization.** { *; }
-dontwarn kotlinx.serialization.**

# Keep all @Serializable models, Companion objects, and generated $$serializer classes
-keepclassmembers class * {
    @kotlinx.serialization.Serializable <fields>;
}
-keep,includedescriptorclasses class **$$serializer {
    *;
}
-keepclassmembers class * {
    *** Companion;
}
-keepclasseswithmembers class * {
    public <init>(...);
    kotlinx.serialization.KSerializer serializer(...);
}

# Explicitly keep Marain data & curriculum models (and enums) used in JSON assets & SharedPreferences
-keep,includedescriptorclasses class app.marain.learn.data.** { *; }
-keepclassmembers enum app.marain.learn.data.** {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep AndroidX ViewModel constructors instantiated reflectively by viewModels()
-keepclassmembers class * extends androidx.lifecycle.AndroidViewModel {
    public <init>(android.app.Application);
}
-keepclassmembers class * extends androidx.lifecycle.ViewModel {
    public <init>(...);
}
