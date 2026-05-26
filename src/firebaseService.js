import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  doc, setDoc, getDoc, deleteDoc, collection,
  addDoc, getDocs, query, orderBy, serverTimestamp,
} from "firebase/firestore";

// ── AUTH ──────────────────────────────────────────────────────────────

export async function signup({ prenom, courriel, motDePasse, dateNaissance, sexe }) {
  const cred = await createUserWithEmailAndPassword(auth, courriel, motDePasse);
  await setDoc(doc(db, "users", cred.user.uid), {
    prenom, courriel, dateNaissance, sexe,
    createdAt: serverTimestamp(),
  });
  return cred.user;
}

export async function login(courriel, motDePasse) {
  const cred = await signInWithEmailAndPassword(auth, courriel, motDePasse);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(courriel) {
  await sendPasswordResetEmail(auth, courriel);
}

// ── PROFIL ────────────────────────────────────────────────────────────

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserPlan(uid, { plan, stripeCustomerId, stripeSubscriptionId }) {
  await setDoc(doc(db, "users", uid), {
    plan,
    stripeCustomerId,
    stripeSubscriptionId,
  }, { merge: true });
}

// ── PLANS ─────────────────────────────────────────────────────────────

export async function savePlan(uid, plan) {
  const ref = await addDoc(collection(db, "users", uid, "plans"), {
    ...plan,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPlans(uid) {
  const q = query(collection(db, "users", uid, "plans"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
}

export async function deletePlan(uid, firestoreId) {
  await deleteDoc(doc(db, "users", uid, "plans", firestoreId));
}

// ── JOURNAL ───────────────────────────────────────────────────────────

export async function saveJournalEntry(uid, entry) {
  await addDoc(collection(db, "users", uid, "journal"), {
    ...entry,
    createdAt: serverTimestamp(),
  });
}

export async function getJournalEntries(uid) {
  const q = query(collection(db, "users", uid, "journal"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
}

export async function deleteJournalEntry(uid, firestoreId) {
  await deleteDoc(doc(db, "users", uid, "journal", firestoreId));
}
