package expo.modules.hangmisupport;

import java.util.Arrays;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
import com.android.billingclient.api.Purchase;

/** Only these consumables belong to voluntary support; no app entitlement is changed. */
final class SupportPurchasePolicy {
    static final List<String> PRODUCT_IDS = Arrays.asList("hangmi_kibble", "hangmi_pate", "hangmi_toy");

    static boolean accepts(List<String> products) {
        return products.size() == 1 && PRODUCT_IDS.containsAll(products);
    }

    enum Action { IGNORE, PENDING, CONSUME, COMPLETED }
    private final Set<String> consuming = new HashSet<>();
    private final Set<String> completed = new HashSet<>();

    Action begin(List<String> products, int state, String token) {
        if (!accepts(products)) return Action.IGNORE;
        if (state == Purchase.PurchaseState.PENDING) return Action.PENDING;
        if (state != Purchase.PurchaseState.PURCHASED || token.isEmpty()) return Action.IGNORE;
        if (completed.contains(token)) return Action.COMPLETED;
        return consuming.add(token) ? Action.CONSUME : Action.IGNORE;
    }

    /** A failed consume remains retryable; successful delivery is reported only once. */
    boolean finish(String token, boolean success) {
        consuming.remove(token);
        return success && completed.add(token);
    }

    static String title(String id) {
        switch (id) {
            case "hangmi_kibble": return "Bát hạt cho Hangmi";
            case "hangmi_pate": return "Pate cho Hangmi";
            case "hangmi_toy": return "Đồ chơi cho Hangmi";
            default: throw new IllegalArgumentException("Unknown support product");
        }
    }

    static String item(String id) {
        switch (id) {
            case "hangmi_kibble": return "kibble";
            case "hangmi_pate": return "pate";
            case "hangmi_toy": return "toy";
            default: throw new IllegalArgumentException("Unknown support product");
        }
    }

    static long vndPrice(String id) {
        switch (id) {
            case "hangmi_kibble": return 29000L;
            case "hangmi_pate": return 59000L;
            case "hangmi_toy": return 99000L;
            default: throw new IllegalArgumentException("Unknown support product");
        }
    }

    static boolean acceptsPrice(String id, String currency, long priceMicros) {
        return PRODUCT_IDS.contains(id) && priceMicros > 0 && (!"VND".equals(currency) || priceMicros == vndPrice(id) * 1000000L);
    }
}
