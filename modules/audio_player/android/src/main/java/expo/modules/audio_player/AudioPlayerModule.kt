package expo.modules.audio_player

import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import expo.modules.kotlin.Promise;
import android.Manifest;
import android.os.Build;
import androidx.core.app.ActivityCompat
import android.content.Context;
import androidx.core.content.ContextCompat;
import android.content.pm.PackageManager;

class AudioPlayerModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('AudioPlayer')` in JavaScript.
    Name("AudioPlayer")

    OnCreate {
      requestPermission()
      setModuleInstance();
    }

    // Defines event names that the module can send to JavaScript.
    Events(
      "onPlaybackStateChange",
      "onPositionUpdate",
      "onDurationChange"
    )

    AsyncFunction("play") { url: String, promise: Promise ->
      Log.d("play", url)
      if (url.isEmpty()) {
        Log.e("play", "no url")
        promise.reject("audio player", "url cant be empty", null)
      } else {
        Log.e("play", url)
        notifyService("PLAY", url, null)
        promise.resolve()
      }
    }

    AsyncFunction("pause") { promise: Promise ->
      notifyService("PAUSE", null, null)
      promise.resolve()
    }

    AsyncFunction("resume") { promise: Promise ->
      notifyService("RESUME", null, null)
      promise.resolve()
    }

    AsyncFunction("seek") { position: Int, promise: Promise ->
      if (position < 0) {
        promise.reject("audio player", "seek position wrong", null);
        return@AsyncFunction
      }
      notifyService("SEEK", null, position)
      promise.resolve()
    }
  }

  private fun requestPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) { // Android 13+
      val notificationPermission = Manifest.permission.POST_NOTIFICATIONS
      if (ContextCompat.checkSelfPermission(appContext.reactContext!!, notificationPermission) != PackageManager.PERMISSION_GRANTED) {
        ActivityCompat.requestPermissions(
          appContext.currentActivity!!,
          arrayOf(notificationPermission),
          NOTIFICATION_PERMISSION_REQUEST_CODE
        )
      }
    }
  }

  private fun notifyService(command: String, url: String?, position: Int?) {
    // time unit millisecond
    val context: Context? = appContext.reactContext
    val serviceIntent = android.content.Intent(context, AudioService::class.java)
    serviceIntent.setAction(command)

    if (url!=null) {
      serviceIntent.putExtra("url", url)
    }
    if (position !=null) {
      serviceIntent.putExtra("position", position)
    }

    ContextCompat.startForegroundService(context!!, serviceIntent)
  }

  private fun setModuleInstance() {
    AudioService.setPluginInstance(this);
  }

  companion object {
    private const val NOTIFICATION_PERMISSION_REQUEST_CODE = 1001
  }
}
