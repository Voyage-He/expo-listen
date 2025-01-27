package expo.modules.audio_player

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.R;
import android.util.Log

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.os.bundleOf
import expo.modules.kotlin.types.Enumerable
import java.io.IOException;

class AudioService : Service() {
    private var mediaPlayer: MediaPlayer? = null
    private val positionUpdateHandler = Handler()
    private var positionUpdateTask: Runnable? = null

    override fun onCreate() {
        super.onCreate()
        Log.e("audioservice", "onCreate")
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        Log.e("audio_service", "onStartCommand")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // 检查是否已授予通知权限
            if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) {
                // 如果未授予权限，则停止服务
                stopSelf()
                return START_NOT_STICKY
            }
        }

        val action = intent.action
        val url = intent.getStringExtra("url")
        val position = intent.getIntExtra("position", 0)

        if ("PAUSE" == action) {
            pause()
        }
        if ("RESUME" == action) {
            resume()
        }
        if ("SEEK" == action) {
            seek(position)
        }
        if ("PLAY" == action) {
            play(url)
        }
        if (!isRunning) {
            startForeground(1, createNotification("Loading...", 0, 100))
            isRunning = true
        }
        return START_STICKY
    }

    private fun play(url: String?) {
        mediaPlayer?.release()
        mediaPlayer = MediaPlayer()
        try {
            mediaPlayer!!.setOnPreparedListener({ _ ->
                sendDuration(mediaPlayer!!.duration)
                mediaPlayer!!.start()
                startPositionUpdates()
                sendPlaybackState(PlaybackState.PLAYING)
            })
            mediaPlayer!!.setOnCompletionListener { _ ->
                sendPlaybackState(PlaybackState.COMPLETED)
            }
            mediaPlayer!!.setOnErrorListener { mp: MediaPlayer?, what: Int, extra: Int ->
                sendPlaybackState(PlaybackState.ERROR)
                true
            }

            mediaPlayer!!.setDataSource(url)
            mediaPlayer!!.prepareAsync() // 异步准备音频
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    private fun pause() {
        if (mediaPlayer?.isPlaying == true) {
            mediaPlayer?.pause()
            sendPlaybackState(PlaybackState.PAUSED)
        }
    }

    private fun resume() {
        if (mediaPlayer?.isPlaying == false) {
            mediaPlayer!!.start()
            sendPlaybackState(PlaybackState.PLAYING)
        }
    }

    private fun seek(position: Int) {
        if (mediaPlayer == null) return

        val duration: Int = mediaPlayer!!.duration
        if (duration < 0) return

        if (position in 0..duration) {
            mediaPlayer!!.seekTo(position)
        }
    }

    private fun startPositionUpdates() {
        positionUpdateTask = object : Runnable {
            override fun run() {
                if (mediaPlayer != null && mediaPlayer!!.isPlaying()) {
                    val position: Int = mediaPlayer!!.getCurrentPosition()
                    sendPosition(position)
                }
                positionUpdateHandler.postDelayed(this, 500) // 每秒发送一次
            }
        }
        positionUpdateHandler.post(positionUpdateTask as Runnable)
    }

    private fun createNotification(content: String, progress: Int, maxProgress: Int): Notification {
//        RemoteViews notificationLayout = new RemoteViews(getPackageName(), R.layout.notification_audio);
//        notificationLayout.setProgressBar(R.id.progressBar, maxProgress, progress, false);

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Audio Service")
            .setContentText("Playing audio...")
            .setSmallIcon(R.drawable.ic_media_play) //                .setCustomContentView(notificationLayout)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true) // 防止通知被滑掉
//            .setContentIntent(
//                PendingIntent.getActivity(
//                    this, 0, Intent(
//                        this,
//                        MainActivity::class.java
//                    ), PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
//                )
//            )
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel: NotificationChannel = NotificationChannel(
                CHANNEL_ID,
                "Audio Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager: NotificationManager? = getSystemService<NotificationManager>(
                NotificationManager::class.java
            )
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel)
            }
        }
    }

    private fun sendPlaybackState(playbackState: PlaybackState) {
        module?.sendEvent(
            "onPlaybackStateChange",
            bundleOf("playbackState" to playbackState.value)
        )
    }

    private fun sendPosition(position: Int) {
        module?.sendEvent(
            "onPositionUpdate",
            bundleOf("position" to position)
        )
    }

    private fun sendDuration(duration: Int) {
        module?.sendEvent(
            "onDurationChange",
            bundleOf("duration" to duration)
        )
    }

    override fun onDestroy() {
        mediaPlayer?.release()
        isRunning = false
        super.onDestroy()
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    companion object {
        private var isRunning = false
        private const val CHANNEL_ID = "AudioServiceChannel"
        private var module: AudioPlayerModule? = null // 保存插件实例以发送事件
        fun setPluginInstance(plugin: AudioPlayerModule?) {
            module = plugin
        }
    }
}

enum class PlaybackState(val value: String) : Enumerable {
    IDLE("IDLE"),
    PLAYING("PLAYING"),
    PAUSED("PAUSED"),
    COMPLETED("COMPLETED"),
    ERROR("ERROR")
}