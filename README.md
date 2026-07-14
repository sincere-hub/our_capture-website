# Our Capture website

Static website for Our Capture wedding photography and films.

## Firebase enquiries

The contact form saves bookings to a Firestore `enquiries` collection, then opens WhatsApp with the same enquiry details.

1. Create a Firebase project and add a **Web app** in the [Firebase console](https://console.firebase.google.com/).
2. Create a **Cloud Firestore** database.
3. Copy the web app configuration into `assets/js/firebase-config.js`.
4. Publish Firestore rules that let the public create enquiries but never read or change them:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /enquiries/{enquiryId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name', 'email', 'phone', 'event', 'eventDate', 'message', 'createdAt', 'source'
      ]) && request.resource.data.name is string
        && request.resource.data.email is string
        && request.resource.data.phone is string
        && request.resource.data.event is string
        && request.resource.data.message is string
        && request.resource.data.source == 'website';
      allow read, update, delete: if false;
    }
  }
}
```

Use the Firebase console to view incoming enquiries. The site remains usable through WhatsApp if Firebase has not been configured or is temporarily unavailable.
