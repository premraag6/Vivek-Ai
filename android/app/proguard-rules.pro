# Proguard rules for Vivek AI
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.vivekai.assistant.** { *; }
