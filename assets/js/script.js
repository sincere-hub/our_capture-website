const header = document.querySelector(".header, .navbar");

window.addEventListener("scroll", () => {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }
});

const enquiryForm = document.querySelector("[data-whatsapp-form]");

if (enquiryForm) {
    enquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(enquiryForm);
        const details = [
            "Hello Our Capture, I would like to enquire about a booking.",
            "",
            `Name: ${data.get("name")}`,
            `Email: ${data.get("email")}`,
            `Phone: ${data.get("phone")}`,
            `Event: ${data.get("event")}`,
            `Date: ${data.get("date") || "Not confirmed yet"}`,
            `Details: ${data.get("message")}`
        ].join("\n");
        window.open(`https://wa.me/27823655302?text=${encodeURIComponent(details)}`, "_blank", "noopener");
    });
}
