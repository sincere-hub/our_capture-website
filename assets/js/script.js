import { saveEnquiry } from "./firebase.js";

const header = document.querySelector(".header, .navbar");

const isDataSaving = navigator.connection?.saveData || ["slow-2g", "2g"].includes(navigator.connection?.effectiveType);
const isMobile = window.matchMedia("(max-width: 700px)").matches;

document.querySelectorAll("video[data-background-video]").forEach((video) => {
    if (isDataSaving || isMobile) return;

    const source = document.createElement("source");
    source.src = video.dataset.backgroundVideo;
    source.type = "video/mp4";
    video.append(source);
    video.load();
    video.play().catch(() => {});
});

window.addEventListener("scroll", () => {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }
});

const enquiryForm = document.querySelector("[data-enquiry-form]");
const formStatus = document.querySelector("[data-form-status]");

if (enquiryForm) {
    enquiryForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitButton = enquiryForm.querySelector('button[type="submit"]');
        const data = new FormData(enquiryForm);
        const enquiry = Object.fromEntries(data.entries());

        submitButton.disabled = true;
        formStatus.textContent = "Sending your enquiry…";

        try {
            await saveEnquiry(enquiry);
            formStatus.textContent = "Thank you — your enquiry has been received. Opening WhatsApp…";
        } catch (error) {
            console.error("Unable to save enquiry to Firebase:", error);
            formStatus.textContent = "We couldn't save your enquiry. You can still contact us on WhatsApp.";
        } finally {
            submitButton.disabled = false;
        }

        const details = [
            "Hello Our Capture, I would like to enquire about a booking.",
            "",
            `Name: ${enquiry.name}`,
            `Email: ${enquiry.email}`,
            `Phone: ${enquiry.phone}`,
            `Event: ${enquiry.event}`,
            `Date: ${enquiry.date || "Not confirmed yet"}`,
            `Details: ${enquiry.message}`
        ].join("\n");
        window.open(`https://wa.me/27823655302?text=${encodeURIComponent(details)}`, "_blank", "noopener");
    });
}
