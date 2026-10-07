package expo.modules.hangmisupport

import android.content.Context
import android.os.Handler
import android.os.Looper
import com.android.billingclient.api.*
import expo.modules.kotlin.Promise
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/** Optional symbolic gifts. Never changes access to lessons or starts checkout automatically. */
class HangmiSupportModule : Module() {
  private val main = Handler(Looper.getMainLooper())
  private val policy = SupportPurchasePolicy()
  private var ledger: SupportLedger? = null
  private var billing: BillingClient? = null
  private val waiters = mutableListOf<(Boolean) -> Unit>()
  private var connecting = false
  private var connectionAttempt = 0
  private var destroyed = false
  private var purchasePromise: Promise? = null
  private var purchaseId: String? = null
  private var checkoutStarted = false
  private var checkoutToken: String? = null
  private val unsettled = mutableSetOf<String>()

  override fun definition() = ModuleDefinition {
    Name("HangmiSupport")
    Events("onSupportPurchased")
    AsyncFunction("recoverIfNeeded") {
      val context = appContext.reactContext?.applicationContext
      if (context?.getSharedPreferences("HangmiSupport", Context.MODE_PRIVATE)?.getBoolean("checkoutUsed", false) == true) {
        connect { if (it) recoverPurchases(false) }
      }
    }.runOnQueue(Queues.MAIN)
    AsyncFunction("loadProducts") { promise: Promise ->
      connect { ready ->
        if (!ready || ledger == null) promise.reject("STORE_UNAVAILABLE", "Google Play unavailable", null)
        else {
          recoverPurchases(false) {
            queryProducts(SupportPurchasePolicy.PRODUCT_IDS) { products ->
              promise.resolve(mapOf("products" to products.mapNotNull { product ->
                offer(product)?.let { mapOf("id" to product.productId, "displayPrice" to it.formattedPrice) }
              }))
            }
          }
        }
      }
    }.runOnQueue(Queues.MAIN)
    AsyncFunction("getSummary") { promise: Promise ->
      initLedger()
      if (ledger == null) promise.reject("HISTORY_UNAVAILABLE", "Support history unavailable", null)
      else promise.resolve(mapOf("counts" to counts(), "unsettled" to unsettled.toList()))
    }.runOnQueue(Queues.MAIN)
    AsyncFunction("purchase") { id: String, promise: Promise -> buy(id, promise) }.runOnQueue(Queues.MAIN)
    OnActivityEntersForeground {
      // Country-only / free users do not initialize another Billing client.
      if (billing != null) main.post { connect { if (it) recoverPurchases(false) } }
    }
    OnDestroy {
      main.post {
        destroyed = true
        finishPurchase("processing")
        waiters.toList().forEach { it(false) }
        waiters.clear()
        main.removeCallbacksAndMessages(null)
        billing?.endConnection()
      }
    }
  }

  private fun initLedger() {
    if (ledger != null) return
    val context = appContext.reactContext?.applicationContext ?: return
    val prefs = context.getSharedPreferences("HangmiSupport", Context.MODE_PRIVATE)
    try {
      ledger = SupportLedger(object : SupportLedger.Storage {
        override fun read() = prefs.getString("ledger", "") ?: ""
        override fun write(value: String) = prefs.edit().putString("ledger", value).commit()
      })
    } catch (_: Exception) { /* Preserve invalid history; never reset it silently. */ }
  }

  private fun connect(callback: (Boolean) -> Unit) {
    if (destroyed) { callback(false); return }
    initLedger()
    if (billing == null) {
      val context = appContext.reactContext?.applicationContext
      if (context == null) { callback(false); return }
      try {
        billing = BillingClient.newBuilder(context)
          .setListener { result, purchases -> main.post { updated(result, purchases) } }
          .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
          .enableAutoServiceReconnection().build()
      } catch (_: Exception) { callback(false); return }
    }
    val client = billing!!
    if (client.isReady) { callback(true); return }
    waiters.add(callback)
    if (connecting) return
    connecting = true
    val attempt = ++connectionAttempt
    main.postDelayed({ connectionFinished(attempt, false) }, 10000)
    try {
      client.startConnection(object : BillingClientStateListener {
        override fun onBillingSetupFinished(result: BillingResult) {
          main.post { connectionFinished(attempt, result.responseCode == BillingClient.BillingResponseCode.OK) }
        }
        override fun onBillingServiceDisconnected() { /* Reconnect on the next operation. */ }
      })
    } catch (_: Exception) { connectionFinished(attempt, false) }
  }

  private fun connectionFinished(attempt: Int, ready: Boolean) {
    if (!connecting || attempt != connectionAttempt) return
    connecting = false
    val callbacks = waiters.toList()
    waiters.clear()
    callbacks.forEach { it(ready && !destroyed) }
  }

  private fun queryProducts(ids: List<String>, callback: (List<ProductDetails>) -> Unit) {
    var finished = false
    val once: (List<ProductDetails>) -> Unit = { details ->
      if (!finished && !destroyed) { finished = true; callback(details) }
    }
    main.postDelayed({ once(emptyList()) }, 10000)
    val products = ids.map { QueryProductDetailsParams.Product.newBuilder()
      .setProductId(it).setProductType(BillingClient.ProductType.INAPP).build() }
    try {
      billing!!.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(products).build()) { result, details ->
        main.post { once(if (result.responseCode == BillingClient.BillingResponseCode.OK) details.productDetailsList else emptyList()) }
      }
    } catch (_: Exception) { once(emptyList()) }
  }

  private fun offer(product: ProductDetails): ProductDetails.OneTimePurchaseOfferDetails? {
    if (product.productId !in SupportPurchasePolicy.PRODUCT_IDS) return null
    val offers = product.oneTimePurchaseOfferDetailsList ?: return null
    if (offers.size != 1) return null // Exactly one ordinary Buy option, no discounts/rental/pre-orders.
    return offers[0].takeIf { !it.offerToken.isNullOrBlank() && SupportPurchasePolicy.acceptsPrice(product.productId, it.priceCurrencyCode, it.priceAmountMicros) }
  }

  private fun buy(id: String, promise: Promise) {
    if (purchasePromise != null || id in unsettled) { promise.resolve(mapOf("status" to "processing")); return }
    if (id !in SupportPurchasePolicy.PRODUCT_IDS) { promise.resolve(mapOf("status" to "unavailable")); return }
    initLedger()
    if (ledger == null) { promise.resolve(mapOf("status" to "unavailable")); return }
    purchasePromise = promise
    purchaseId = id
    checkoutStarted = false
    checkoutToken = null
    connect { ready ->
      if (purchasePromise !== promise) return@connect
      if (!ready) finishPurchase("unavailable")
      else queryProducts(listOf(id)) { products ->
        if (purchasePromise === promise) {
          val product = products.firstOrNull { it.productId == id }
          val details = product?.let { offer(it) }
          val activity = appContext.currentActivity
          if (product == null || details == null || activity == null) finishPurchase("unavailable")
          else {
            val item = BillingFlowParams.ProductDetailsParams.newBuilder()
              .setProductDetails(product).setOfferToken(details.offerToken!!).build()
            // Persist this before launch, including PENDING purchases that survive process death.
            val prefs = appContext.reactContext!!.getSharedPreferences("HangmiSupport", Context.MODE_PRIVATE)
            if (!prefs.edit().putBoolean("checkoutUsed", true).commit()) {
              finishPurchase("unavailable")
              return@queryProducts
            }
            checkoutStarted = true
            try {
              val result = billing!!.launchBillingFlow(activity,
                BillingFlowParams.newBuilder().setProductDetailsParamsList(listOf(item)).build())
              if (result.responseCode == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) recoverPurchases(true)
              else if (result.responseCode != BillingClient.BillingResponseCode.OK) finishPurchase(status(result))
            } catch (_: Exception) { finishPurchase("failed") }
          }
        }
      }
    }
  }

  private fun updated(result: BillingResult, purchases: List<Purchase>?) {
    if (destroyed) return
    if (result.responseCode == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) { recoverPurchases(true); return }
    if (result.responseCode != BillingClient.BillingResponseCode.OK) { finishPurchase(status(result)); return }
    if (purchases.isNullOrEmpty()) { finishPurchase("failed"); return }
    purchases.forEach {
      if (checkoutStarted && purchaseId in it.products) checkoutToken = it.purchaseToken
      process(it)
    }
  }

  private fun recoverPurchases(resolvingOwned: Boolean, done: () -> Unit = {}) {
    val client = billing ?: return
    val owner = purchasePromise
    var finished = false
    val complete = { if (!finished) { finished = true; done() } }
    main.postDelayed({ complete() }, 10000)
    if (resolvingOwned) main.postDelayed({
      if (owner != null && purchasePromise === owner) finishPurchase("processing")
    }, 10000)
    try {
      client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build()) { result, purchases ->
        main.post {
          if (!destroyed && result.responseCode == BillingClient.BillingResponseCode.OK) {
            // Removed pending purchases were declined/cancelled; active consumes remain unsettled.
            val present = purchases.flatMap { it.products }.toSet()
            unsettled.retainAll(present)
            purchases.forEach {
              if (resolvingOwned && purchasePromise === owner && purchaseId in it.products) checkoutToken = it.purchaseToken
              process(it)
            }
          }
          if (resolvingOwned && owner != null && purchasePromise === owner && purchases.none { purchaseId in it.products }) finishPurchase("processing")
          complete()
        }
      }
    } catch (_: Exception) { if (resolvingOwned) finishPurchase("processing"); complete() }
  }

  private fun process(purchase: Purchase) {
    val token = purchase.purchaseToken
    val current = checkoutStarted && checkoutToken == token && purchaseId in purchase.products
    val action = policy.begin(purchase.products, purchase.purchaseState, token)
    if (action == SupportPurchasePolicy.Action.PENDING) {
      unsettled.addAll(purchase.products)
      if (current) finishPurchase("pending")
      return
    }
    if (action == SupportPurchasePolicy.Action.COMPLETED) {
      if (current) finishPurchase("purchased", receipt(purchase))
      return
    }
    if (action != SupportPurchasePolicy.Action.CONSUME) return
    unsettled.addAll(purchase.products)
    try { ledger!!.record(token, purchase.products[0], purchase.quantity) }
    catch (_: Exception) {
      policy.finish(token, false)
      if (current) finishPurchase("processing")
      return
    }
    // Persist count + fingerprint before consume; raw payment tokens never reach JS/storage.
    val owner = purchasePromise
    if (current) main.postDelayed({
      if (owner != null && purchasePromise === owner && checkoutToken == token) finishPurchase("processing")
    }, 15000)
    try {
      billing!!.consumeAsync(ConsumeParams.newBuilder().setPurchaseToken(token).build()) { result, _ ->
        main.post {
          if (!destroyed) {
            val success = result.responseCode == BillingClient.BillingResponseCode.OK
            val first = policy.finish(token, success)
            if (success) {
              unsettled.removeAll(purchase.products.toSet())
              val receipt = receipt(purchase)
              if (checkoutStarted && checkoutToken == token && purchaseId in purchase.products) finishPurchase("purchased", receipt)
              if (first) sendEvent("onSupportPurchased", receipt)
            } else if (checkoutStarted && checkoutToken == token && purchaseId in purchase.products) finishPurchase("processing")
          }
        }
      }
    } catch (_: Exception) {
      policy.finish(token, false)
      if (current) finishPurchase("processing")
    }
  }

  private fun counts() = listOf("kibble", "pate", "toy").associateWith { ledger!!.count(it) }
  private fun receipt(purchase: Purchase): Map<String, Any> = mapOf(
    "productId" to purchase.products[0],
    "transactionId" to "play:" + SupportLedger.fingerprint(purchase.purchaseToken),
    "counts" to counts()
  )
  private fun finishPurchase(status: String, receipt: Map<String, Any> = emptyMap()) {
    val promise = purchasePromise
    purchasePromise = null
    purchaseId = null
    checkoutStarted = false
    checkoutToken = null
    promise?.resolve(receipt + mapOf("status" to status))
  }
  private fun status(result: BillingResult) = when (result.responseCode) {
    BillingClient.BillingResponseCode.USER_CANCELED -> "cancelled"
    BillingClient.BillingResponseCode.BILLING_UNAVAILABLE, BillingClient.BillingResponseCode.ITEM_UNAVAILABLE -> "unavailable"
    else -> "failed"
  }
}
