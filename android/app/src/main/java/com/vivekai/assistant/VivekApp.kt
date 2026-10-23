package com.vivekai.assistant

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class VivekApp : Application() {

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val remindersChannel = NotificationChannel(
                CHANNEL_REMINDERS_ID,
                "Vivek AI Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for user reminders and scheduled check-ins"
                enableVibration(true)
            }

            val routinesChannel = NotificationChannel(
                CHANNEL_ROUTINES_ID,
                "Vivek AI Daily Routines",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Daily morning greetings and evening reflections"
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(remindersChannel)
            notificationManager?.createNotificationChannel(routinesChannel)
        }
    }

    companion object {
        const val CHANNEL_REMINDERS_ID = "vivek_reminders_channel"
        const val CHANNEL_ROUTINES_ID = "vivek_routines_channel"
    }
}
