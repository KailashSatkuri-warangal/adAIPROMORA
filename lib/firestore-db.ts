import { firestore } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// Helper for Firestore error resilience
export async function safeFirestoreOp<T>(op: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await op();
  } catch (err) {
    return fallback;
  }
}

// 1. BRAND MANAGEMENT IN FIRESTORE
export async function syncBrandToFirestore(workspaceId: string, brand: any) {
  return safeFirestoreOp(async () => {
    const brandRef = doc(firestore, "brands", workspaceId);
    await setDoc(
      brandRef,
      {
        ...brand,
        workspaceId,
        platform: "adAIPROMORA",
        developed_by: "Satkuri Kailash",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  }, false);
}

export async function getBrandFromFirestore(workspaceId: string) {
  return safeFirestoreOp(async () => {
    const brandRef = doc(firestore, "brands", workspaceId);
    const snap = await getDoc(brandRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  }, null);
}

// 2. CONTENT ASSETS IN FIRESTORE
export async function syncContentToFirestore(workspaceId: string, content: any) {
  return safeFirestoreOp(async () => {
    const contentsCol = collection(firestore, "contents");
    const docRef = await addDoc(contentsCol, {
      ...content,
      workspaceId,
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }, null);
}

export async function getContentsFromFirestore(workspaceId: string) {
  return safeFirestoreOp(async () => {
    const q = query(
      collection(firestore, "contents"),
      where("workspaceId", "==", workspaceId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, []);
}

// 3. CAMPAIGNS IN FIRESTORE
export async function syncCampaignToFirestore(workspaceId: string, campaign: any) {
  return safeFirestoreOp(async () => {
    const campaignsCol = collection(firestore, "campaigns");
    const docRef = await addDoc(campaignsCol, {
      ...campaign,
      workspaceId,
      currency: "INR",
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }, null);
}

export async function getCampaignsFromFirestore(workspaceId: string) {
  return safeFirestoreOp(async () => {
    const q = query(
      collection(firestore, "campaigns"),
      where("workspaceId", "==", workspaceId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, []);
}

// 4. 30-DAY CONTENT CALENDAR IN FIRESTORE
export async function syncCalendarItemToFirestore(workspaceId: string, item: any) {
  return safeFirestoreOp(async () => {
    const calCol = collection(firestore, "calendar_items");
    const docRef = await addDoc(calCol, {
      ...item,
      workspaceId,
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }, null);
}

// 5. SEO AUDITS & KEYWORDS IN FIRESTORE
export async function syncSEOAuditToFirestore(workspaceId: string, audit: any) {
  return safeFirestoreOp(async () => {
    const auditCol = collection(firestore, "seo_audits");
    const docRef = await addDoc(auditCol, {
      ...audit,
      workspaceId,
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }, null);
}

export async function syncKeywordToFirestore(workspaceId: string, keyword: any) {
  return safeFirestoreOp(async () => {
    const kwCol = collection(firestore, "keywords");
    const docRef = await addDoc(kwCol, {
      ...keyword,
      workspaceId,
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }, null);
}

// 6. COMPETITOR INTELLIGENCE IN FIRESTORE
export async function syncCompetitorToFirestore(workspaceId: string, competitor: any) {
  return safeFirestoreOp(async () => {
    const compCol = collection(firestore, "competitors");
    const docRef = await addDoc(compCol, {
      ...competitor,
      workspaceId,
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }, null);
}

// 7. RAZORPAY TRANSACTIONS & LIVE CREDITS IN FIRESTORE
export async function syncTransactionToFirestore(workspaceId: string, txn: any) {
  return safeFirestoreOp(async () => {
    const txnCol = collection(firestore, "transactions");
    const docRef = await addDoc(txnCol, {
      ...txn,
      workspaceId,
      currency: "INR",
      gateway: "RAZORPAY",
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
    });

    // Also update live credits in workspace document
    const wsRef = doc(firestore, "workspaces", workspaceId);
    await setDoc(
      wsRef,
      {
        workspaceId,
        plan: txn.planTier,
        monthlyGenerationsLimit: txn.creditsAwarded || 1000,
        lastPaymentId: txn.paymentId,
        lastPaidAmountINR: txn.amount,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return docRef.id;
  }, null);
}

export async function getTransactionsFromFirestore(workspaceId: string) {
  return safeFirestoreOp(async () => {
    const q = query(
      collection(firestore, "transactions"),
      where("workspaceId", "==", workspaceId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, []);
}

// 8. REAL-TIME AI TOKEN & CREDIT USAGE IN FIRESTORE
export async function recordAIUsageToFirestore(workspaceId: string, usage: any) {
  return safeFirestoreOp(async () => {
    const usageCol = collection(firestore, "ai_usage");
    const docRef = await addDoc(usageCol, {
      ...usage,
      workspaceId,
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }, null);
}

// 9. EMAIL CONTACTS IN FIRESTORE
export async function syncContactToFirestore(workspaceId: string, contact: any) {
  return safeFirestoreOp(async () => {
    const contactsCol = collection(firestore, "contacts");
    const docRef = await addDoc(contactsCol, {
      ...contact,
      workspaceId,
      platform: "adAIPROMORA",
      developed_by: "Satkuri Kailash",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }, null);
}
