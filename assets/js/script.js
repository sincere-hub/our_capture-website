import { saveEnquiry } from "./firebase.js";

const header = document.querySelector(".header, .navbar");

const isDataSaving = navigator.connection?.saveData || ["slow-2g", "2g"].includes(navigator.connection?.effectiveType);
document.querySelectorAll("video[data-background-video]").forEach((video) => {
    if (isDataSaving) return;

    const source = document.createElement("source");
    source.src = video.dataset.backgroundVideo;
    source.type = "video/mp4";
    video.append(source);
    video.load();
    video.play().catch(() => {});
});

const videoPreviews = document.querySelectorAll("video[data-video-preview]");
if (!isDataSaving && videoPreviews.length) {
    const previewObserver = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
                target.play().catch(() => {});
            } else {
                target.pause();
            }
        });
    }, { threshold: 0.2 });

    videoPreviews.forEach((video) => previewObserver.observe(video));
}

const homeEntry = document.querySelector("[data-home-entry]");
if (homeEntry) {
    homeEntry.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        event.preventDefault();
        document.body.classList.add("page-leaving");
        window.setTimeout(() => {
            window.location.assign(homeEntry.href);
        }, 260);
    });
}

window.addEventListener("scroll", () => {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }
});

const enquiryForm = document.querySelector("[data-enquiry-form]");
const formStatus = document.querySelector("[data-form-status]");

if (enquiryForm) {
    const emailInput = enquiryForm.querySelector('input[name="email"]');
    const emailFeedback = enquiryForm.querySelector("#email-feedback");
    const phoneInput = enquiryForm.querySelector('input[name="phone"]');
    const phoneFeedback = enquiryForm.querySelector("#phone-feedback");
    const eventType = enquiryForm.querySelector("#event-type");
    const hoursSelect = enquiryForm.querySelector("#event-hours");
    const hoursHelp = enquiryForm.querySelector("#hours-help");

    const updateHourOptions = () => {
        const selectedEvent = eventType.options[eventType.selectedIndex];
        const minimumHours = Number(selectedEvent.dataset.minHours);
        const maximumHours = Number(selectedEvent.dataset.maxHours);
        const selectedHours = Number(hoursSelect.value);

        hoursSelect.replaceChildren();
        for (let hours = minimumHours; hours <= maximumHours; hours += 1) {
            const option = new Option(`${hours} ${hours === 1 ? "hour" : "hours"}`, `${hours} hours`);
            option.selected = hours === selectedHours || (!selectedHours && hours === minimumHours);
            hoursSelect.add(option);
        }
        hoursHelp.textContent = `${minimumHours}–${maximumHours} hours available for ${selectedEvent.value}.`;
    };

    eventType.addEventListener("change", updateHourOptions);
    updateHourOptions();

    const validateEmail = () => {
        if (!emailInput.value) {
            emailInput.removeAttribute("aria-invalid");
            emailFeedback.textContent = "";
            return;
        }

        const isInvalid = !emailInput.validity.valid;
        emailInput.setAttribute("aria-invalid", String(isInvalid));
        emailFeedback.textContent = isInvalid ? "Enter a valid email address, for example name@example.com." : "";
    };

    emailInput.addEventListener("input", validateEmail);
    emailInput.addEventListener("blur", validateEmail);

    const validatePhone = () => {
        const phone = phoneInput.value.trim();
        if (!phone) {
            phoneInput.setCustomValidity("");
            phoneInput.removeAttribute("aria-invalid");
            phoneFeedback.textContent = "";
            return;
        }

        const digits = phone.replace(/\D/g, "");
        const isValid = /^[+\d\s()-]+$/.test(phone) && digits.length >= 9 && digits.length <= 15;
        phoneInput.setCustomValidity(isValid ? "" : "Enter a valid phone number.");
        phoneInput.setAttribute("aria-invalid", String(!isValid));
        phoneFeedback.textContent = isValid ? "" : "Enter a valid phone number using 9–15 digits.";
    };

    phoneInput.addEventListener("input", validatePhone);
    phoneInput.addEventListener("blur", validatePhone);

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
            `Duration: ${enquiry.hours}`,
            `Coverage: ${enquiry.coverage}`,
            `Location: ${enquiry.location}`,
            `Date: ${enquiry.date || "Not confirmed yet"}`,
            `Details: ${enquiry.message}`
        ].join("\n");
        window.open(`https://wa.me/27823655302?text=${encodeURIComponent(details)}`, "_blank", "noopener");
    });
}
