// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

// Input fields
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");

// Submit button
const submit = document.getElementById("submit");

// Add event listener to the submit button
submit.addEventListener("click", (e) => {
  e.preventDefault();

  // Get values from input fields
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  // Validate fields (optional)
  if (!emailValue || !passwordValue) {
    alert("Email and password must not be empty!");
    return;
  }

  // Firebase create user
  createUserWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
      // Signed up successfully
      alert("Signup successful!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      // Handle errors
      alert(`Error: ${error.message}`);
    });
});
