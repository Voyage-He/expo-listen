//package expo.modules.audio_player
//
//class AudioPlayer {
//    override fun load() {
//        // 在插件加载时将实例传递给 AudioService
//        AudioService.setPluginInstance(this)
//    }

//    @PluginMethod
//    fun play(call: PluginCall) {
//        val url: String = call.getString("url")
//        if (url == null || url.isEmpty()) {
//            call.reject("URL cannot be empty")
//            return
//        }
//
//        // 启动前台服务
//        val context: android.content.Context = getContext()
//        val serviceIntent = android.content.Intent(context, AudioService::class.java)
//        serviceIntent.setAction("PLAY")
//        serviceIntent.putExtra("url", url)
//        androidx.core.content.ContextCompat.startForegroundService(context, serviceIntent)
//
//        call.resolve()
//    }
//
//    fun sendEventToFrontend(eventName: String?, data: JSObject?) {
//        notifyListeners(eventName, data)
//    }
//
//    @PluginMethod
//    fun pause(call: PluginCall) {
//        val context: android.content.Context = getContext()
//        val serviceIntent = android.content.Intent(context, AudioService::class.java)
//        serviceIntent.setAction("PAUSE")
//        androidx.core.content.ContextCompat.startForegroundService(context, serviceIntent)
//
//        call.resolve()
//    }
//
//    @PluginMethod
//    fun resume(call: PluginCall) {
//        val context: android.content.Context = getContext()
//        val serviceIntent = android.content.Intent(context, AudioService::class.java)
//        serviceIntent.setAction("RESUME")
//        androidx.core.content.ContextCompat.startForegroundService(context, serviceIntent)
//
//        call.resolve()
//    }
//
//    @PluginMethod
//    fun seekTo(call: PluginCall) {
//        val position: String = call.getString("position")
//        if (position == null || position.isEmpty()) {
//            call.reject("seek position cannot be empty")
//            return
//        }
//
//        val context: android.content.Context = getContext()
//        val serviceIntent = android.content.Intent(context, AudioService::class.java)
//        serviceIntent.setAction("SEEK_TO")
//        serviceIntent.putExtra("position", position)
//        androidx.core.content.ContextCompat.startForegroundService(context, serviceIntent)
//
//        call.resolve()
//    }
//
//    @PluginMethod
//    fun stop(call: PluginCall) {
//        // 停止服务
//        val context: android.content.Context = getContext()
//        val serviceIntent = android.content.Intent(context, AudioService::class.java)
//        context.stopService(serviceIntent)
//
//        call.resolve()
//    }
//}