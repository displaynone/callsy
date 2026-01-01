package com.displaynone.callsy

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

class CallsyNotificationListenerService : NotificationListenerService() {
  override fun onNotificationPosted(sbn: StatusBarNotification) {
    // Placeholder: presence registers the app in notification access settings.
  }

  override fun onNotificationRemoved(sbn: StatusBarNotification) {
    // Placeholder: no-op for now.
  }
}
