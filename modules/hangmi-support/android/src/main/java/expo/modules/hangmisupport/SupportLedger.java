package expo.modules.hangmisupport;

import java.io.StringReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Properties;

/** Device-local counters plus hashed transaction IDs, saved atomically before consumption. */
final class SupportLedger {
    interface Storage { String read(); boolean write(String value); }
    private final Storage storage;
    private Properties data = new Properties();

    SupportLedger(Storage storage) {
        this.storage = storage;
        try { data.load(new StringReader(storage.read())); }
        catch (Exception error) { throw new IllegalStateException("Could not read support history", error); }
        for (String item : new String[] { "kibble", "pate", "toy" }) count(item);
    }

    synchronized long count(String item) {
        long count;
        try { count = Long.parseLong(data.getProperty("count." + item, "0")); }
        catch (NumberFormatException error) { throw new IllegalStateException("Invalid support count", error); }
        if (count < 0 || count > 9007199254740991L) throw new IllegalStateException("Invalid support count");
        return count;
    }

    static String fingerprint(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();
            for (byte value : digest) result.append(String.format(java.util.Locale.ROOT, "%02x", value & 255));
            return result.toString();
        } catch (Exception error) { throw new IllegalStateException(error); }
    }

    synchronized String record(String token, String productId, int quantity) {
        if (token.isEmpty() || quantity < 1 || !SupportPurchasePolicy.PRODUCT_IDS.contains(productId))
            throw new IllegalArgumentException("Invalid support transaction");
        String hash = fingerprint(token);
        String item = SupportPurchasePolicy.item(productId);
        String transaction = item + ":" + quantity;
        String previous = data.getProperty("seen." + hash);
        if (previous != null) {
            if (!previous.equals(transaction)) throw new IllegalStateException("Inconsistent support transaction");
            return hash;
        }
        long nextCount = Math.addExact(count(item), quantity);
        if (nextCount > 9007199254740991L) throw new IllegalStateException("Support count overflow");
        Properties next = new Properties();
        next.putAll(data);
        next.setProperty("seen." + hash, transaction);
        next.setProperty("count." + item, Long.toString(nextCount));
        try {
            StringWriter encoded = new StringWriter();
            next.store(encoded, "Device-local support counts");
            if (!storage.write(encoded.toString())) throw new IllegalStateException("Could not save support history");
            data = next;
            return hash;
        } catch (Exception error) { throw new IllegalStateException("Could not save support history", error); }
    }
}
