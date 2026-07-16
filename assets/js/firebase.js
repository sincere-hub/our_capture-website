import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { addDoc, collection, getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"];
const isConfigured = requiredConfigKeys.every((key) => firebaseConfig[key]);
const db = isConfigured ? getFirestore(initializeApp(firebaseConfig)) : null;

export async function saveEnquiry(enquiry) {
    if (!db) {
        throw new Error("Firebase has not been configured.");
    }

    return addDoc(collection(db, "enquiries"), {
        name: enquiry.name.trim(),
        email: enquiry.email.trim(),
        phone: enquiry.phone.trim(),
        event: enquiry.event,
        coverageHours: enquiry.hours,
        coverage: enquiry.coverage,
        location: enquiry.location.trim(),
        eventDate: enquiry.date || null,
        message: enquiry.message.trim(),
        createdAt: serverTimestamp(),
        source: "website"
    });
}
