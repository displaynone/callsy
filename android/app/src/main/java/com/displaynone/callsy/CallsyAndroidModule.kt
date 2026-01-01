package com.displaynone.callsy

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

class CallsyAndroidModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "CallsyAndroid"

  @ReactMethod
  fun setAllowedContacts(payload: ReadableMap, promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun setWhatsappFilterEnabled(enabled: Boolean, promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun enableDndBypassForContacts(contactIds: ReadableArray, promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun disableDndBypass(promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun openDoNotDisturbSettings(promise: Promise) {
    openSettings(
      listOf(
        "android.settings.ZEN_MODE_SETTINGS",
        "android.settings.NOTIFICATION_POLICY_ACCESS_SETTINGS"
      ),
      promise
    )
  }

  @ReactMethod
  fun openNotificationListenerSettings(promise: Promise) {
    openSettings(listOf("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"), promise)
  }

  private fun openSettings(actions: List<String>, promise: Promise) {
    val intent = actions
      .asSequence()
      .map { Intent(it) }
      .firstOrNull { it.resolveActivity(reactContext.packageManager) != null }

    if (intent == null) {
      promise.reject(
        "CALLSY_SETTINGS_UNAVAILABLE",
        "No se encontro una pantalla de ajustes compatible."
      )
      return
    }

    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    try {
      reactContext.startActivity(intent)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("CALLSY_SETTINGS_ERROR", e)
    }
  }
}
