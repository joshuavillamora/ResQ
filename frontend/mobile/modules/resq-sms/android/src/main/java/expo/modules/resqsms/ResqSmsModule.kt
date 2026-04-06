package expo.modules.resqsms

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.telephony.SmsManager
import androidx.core.content.ContextCompat
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ResqSmsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ResqSms")

    AsyncFunction("isAvailableAsync") {
      appContext.reactContext != null
    }

    AsyncFunction("sendTextMessageAsync") { phoneNumber: String, message: String ->
      val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      val permissionGranted = ContextCompat.checkSelfPermission(context, Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED

      if (!permissionGranted) {
        throw CodedException("SEND_SMS permission has not been granted")
      }

      val smsManager = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        context.getSystemService(SmsManager::class.java)
      } else {
        @Suppress("DEPRECATION")
        SmsManager.getDefault()
      }

      if (smsManager == null) {
        throw CodedException("SmsManager is unavailable on this device")
      }

      val parts = smsManager.divideMessage(message)
      if (parts.size > 1) {
        smsManager.sendMultipartTextMessage(phoneNumber, null, ArrayList(parts), null, null)
      } else {
        smsManager.sendTextMessage(phoneNumber, null, message, null, null)
      }

      true
    }
  }
}
