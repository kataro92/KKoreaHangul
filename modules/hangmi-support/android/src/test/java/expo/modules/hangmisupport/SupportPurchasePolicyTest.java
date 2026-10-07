package expo.modules.hangmisupport;

import com.android.billingclient.api.Purchase;
import java.util.Arrays;
import java.util.Collections;
import org.junit.Test;
import static org.junit.Assert.*;
import static expo.modules.hangmisupport.SupportPurchasePolicy.Action.*;

public class SupportPurchasePolicyTest {
    @Test public void vietnamPricesMustMatchTheRequestedItemAndUnknownProductsAreRejected() {
        assertTrue(SupportPurchasePolicy.acceptsPrice("hangmi_kibble", "VND", 29000L * 1000000));
        assertTrue(SupportPurchasePolicy.acceptsPrice("hangmi_pate", "VND", 59000L * 1000000));
        assertTrue(SupportPurchasePolicy.acceptsPrice("hangmi_toy", "VND", 99000L * 1000000));
        assertFalse(SupportPurchasePolicy.acceptsPrice("hangmi_pate", "VND", 29000L * 1000000));
        assertFalse(SupportPurchasePolicy.acceptsPrice("unknown", "VND", 29000L * 1000000));
        assertTrue(SupportPurchasePolicy.acceptsPrice("hangmi_kibble", "USD", 1490000));
    }
    @Test public void pendingAndUnknownPurchasesAreNeverConsumed() {
        SupportPurchasePolicy policy = new SupportPurchasePolicy();
        assertEquals(PENDING, policy.begin(Collections.singletonList("hangmi_kibble"), Purchase.PurchaseState.PENDING, "token"));
        assertEquals(IGNORE, policy.begin(Collections.singletonList("premium"), Purchase.PurchaseState.PURCHASED, "token"));
        assertEquals(IGNORE, policy.begin(Arrays.asList("hangmi_kibble", "premium"), Purchase.PurchaseState.PURCHASED, "token"));
        assertEquals(IGNORE, policy.begin(Collections.emptyList(), Purchase.PurchaseState.PURCHASED, "token"));
        assertEquals(IGNORE, policy.begin(Collections.singletonList("hangmi_kibble"), Purchase.PurchaseState.UNSPECIFIED_STATE, "token"));
        assertEquals(CONSUME, policy.begin(Collections.singletonList("hangmi_kibble"), Purchase.PurchaseState.PURCHASED, "token"));
    }

    @Test public void duplicateCallbacksDeliverThanksOnceAndFailedConsumesCanRecover() {
        SupportPurchasePolicy policy = new SupportPurchasePolicy();
        assertEquals(CONSUME, policy.begin(Collections.singletonList("hangmi_pate"), Purchase.PurchaseState.PURCHASED, "token"));
        assertEquals(IGNORE, policy.begin(Collections.singletonList("hangmi_pate"), Purchase.PurchaseState.PURCHASED, "token"));
        assertFalse(policy.finish("token", false));
        assertEquals(CONSUME, policy.begin(Collections.singletonList("hangmi_pate"), Purchase.PurchaseState.PURCHASED, "token"));
        assertTrue(policy.finish("token", true));
        assertFalse(policy.finish("token", true));
        assertEquals(COMPLETED, policy.begin(Collections.singletonList("hangmi_pate"), Purchase.PurchaseState.PURCHASED, "token"));
        assertEquals(CONSUME, policy.begin(Collections.singletonList("hangmi_pate"), Purchase.PurchaseState.PURCHASED, "another-token"));
    }
}
