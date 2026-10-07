package expo.modules.hangmisupport;

import org.junit.Test;
import static org.junit.Assert.*;

public class SupportLedgerTest {
    private static class MemoryStorage implements SupportLedger.Storage {
        String raw = "";
        boolean writable = true;
        public String read() { return raw; }
        public boolean write(String value) { if (!writable) return false; raw = value; return true; }
    }

    @Test public void repeatedItemsCountOncePerTransactionAcrossRestarts() {
        MemoryStorage storage = new MemoryStorage();
        SupportLedger ledger = new SupportLedger(storage);
        ledger.record("first-token", "hangmi_kibble", 1);
        ledger.record("first-token", "hangmi_kibble", 1);
        ledger.record("second-token", "hangmi_kibble", 1);
        ledger = new SupportLedger(storage);
        ledger.record("second-token", "hangmi_kibble", 1);
        ledger.record("third-token", "hangmi_toy", 1);
        assertEquals(2, ledger.count("kibble"));
        assertEquals(0, ledger.count("pate"));
        assertEquals(1, ledger.count("toy"));
        assertFalse(storage.raw.contains("first-token"));
    }

    @Test public void storageFailureDoesNotCommitAnUnsavedCountAndRetryCountsOnce() {
        MemoryStorage storage = new MemoryStorage();
        SupportLedger ledger = new SupportLedger(storage);
        storage.writable = false;
        assertThrows(IllegalStateException.class, () -> ledger.record("token", "hangmi_pate", 1));
        assertEquals(0, ledger.count("pate"));
        storage.writable = true;
        ledger.record("token", "hangmi_pate", 1);
        assertEquals(1, new SupportLedger(storage).count("pate"));
        assertThrows(IllegalArgumentException.class, () -> ledger.record("bad", "premium", 1));
    }

    @Test public void backupRestoredOnNewDeviceKeepsCountsAndTransactionDeduplication() {
        MemoryStorage original = new MemoryStorage();
        SupportLedger firstDevice = new SupportLedger(original);
        firstDevice.record("kibble-before-backup", "hangmi_kibble", 1);
        firstDevice.record("pate-before-backup", "hangmi_pate", 1);
        firstDevice.record("toy-before-backup", "hangmi_toy", 1);
        String snapshot = original.raw;
        firstDevice.record("kibble-after-backup", "hangmi_kibble", 1);

        MemoryStorage restored = new MemoryStorage();
        restored.raw = snapshot;
        SupportLedger newDevice = new SupportLedger(restored);
        assertEquals(1, newDevice.count("kibble")); // Only purchases in the saved snapshot return.
        assertEquals(1, newDevice.count("pate"));
        assertEquals(1, newDevice.count("toy"));
        newDevice.record("kibble-before-backup", "hangmi_kibble", 1);
        assertEquals(1, newDevice.count("kibble"));
        newDevice.record("kibble-on-new-device", "hangmi_kibble", 1);
        assertEquals(2, newDevice.count("kibble"));
        assertEquals(2, new SupportLedger(restored).count("kibble"));
        assertEquals(2, firstDevice.count("kibble"));
    }

    @Test public void malformedRestoredCounterIsReportedWithoutOverwritingHistory() {
        for (String invalid : new String[] { "broken", "9223372036854775808", "-1" }) {
            MemoryStorage restored = new MemoryStorage();
            restored.raw = "count.kibble=" + invalid + "\n";
            String original = restored.raw;
            assertThrows(IllegalStateException.class, () -> new SupportLedger(restored));
            assertEquals(original, restored.raw);
        }
    }
}
