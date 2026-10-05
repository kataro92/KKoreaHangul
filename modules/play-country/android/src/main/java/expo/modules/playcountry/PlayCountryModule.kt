package expo.modules.playcountry

import android.os.Handler
import android.os.Looper
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.GetBillingConfigParams
import com.android.billingclient.api.PendingPurchasesParams
import expo.modules.kotlin.Promise
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.atomic.AtomicBoolean

/** Reads Play country once per request. No purchases or country caching.
 * The Billing SDK's own operational diagnostics are disclosed in the privacy policy.
 */
class PlayCountryModule : Module() {
  private val handler = Handler(Looper.getMainLooper())
  private val pending = mutableSetOf<CountryRequest>()

  override fun definition() = ModuleDefinition {
    Name("PlayCountry")

    AsyncFunction("getCountryCode") { promise: Promise ->
      val context = appContext.reactContext?.applicationContext
      if (context == null) {
        promise.resolve(null)
      } else {
        val request = CountryRequest(promise)
        pending.add(request)
        request.start {
          BillingClient.newBuilder(context)
            .setListener { _, _ -> }
            .enablePendingPurchases(
              PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()
            )
            .build()
        }
      }
    }.runOnQueue(Queues.MAIN)

    OnDestroy {
      handler.post { pending.toList().forEach { it.finish(null) } }
    }
  }

  private inner class CountryRequest(private val promise: Promise) {
    private val finished = AtomicBoolean(false)
    private var client: BillingClient? = null
    private val timeout = Runnable { finish(null) }

    fun start(createClient: () -> BillingClient) {
      handler.postDelayed(timeout, 2000L)
      try {
        val billingClient = createClient()
        client = billingClient
        billingClient.startConnection(object : BillingClientStateListener {
          override fun onBillingSetupFinished(result: BillingResult) {
            if (finished.get()) return
            if (result.responseCode != BillingClient.BillingResponseCode.OK) {
              finish(null)
              return
            }
            try {
              billingClient.getBillingConfigAsync(GetBillingConfigParams.newBuilder().build()) { configResult, config ->
                finish(if (configResult.responseCode == BillingClient.BillingResponseCode.OK) config?.countryCode else null)
              }
            } catch (_: Exception) {
              finish(null)
            }
          }

          override fun onBillingServiceDisconnected() { finish(null) }
        })
      } catch (_: Exception) {
        finish(null)
      }
    }

    fun finish(country: String?) {
      if (!finished.compareAndSet(false, true)) return
      handler.post {
        handler.removeCallbacks(timeout)
        try { client?.endConnection() } catch (_: Exception) { /* Already disconnected. */ }
        pending.remove(this)
        promise.resolve(country)
      }
    }
  }
}
