// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAGRj3KHVj-gLWNucHOg65fjoGuZmMTzg",
  authDomain: "loginwith-coolmate.firebaseapp.com",
  projectId: "loginwith-coolmate",
  storageBucket: "loginwith-coolmate.firebasestorage.app",
  messagingSenderId: "900327181331",
  appId: "1:900327181331:web:36c02f43979ebafdc083e6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Submit button event listener
const submit = document.getElementById("submit");
submit.addEventListener("click", (e) => {
  e.preventDefault();

  // Get email and password values from the input fields
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validate inputs
  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  // Log the inputs to check their values (for debugging)
  console.log("Email:", email);
  console.log("Password:", password);

  // Sign in with Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Sign in successful
      alert("Login successful!");
     window.location.href = "./index.html"; // Redirect to the dashboard or home page
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Handle specific errors
      if (errorCode === "auth/user-not-found") {
        alert("No user found with this email.");
      } else if (errorCode === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert(`Error: ${errorMessage}`);
      }
    });
});
