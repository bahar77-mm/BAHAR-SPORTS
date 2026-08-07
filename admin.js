import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs,
    addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
    getAuth, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyqVbz009_W67poKQgjHLuGsLQTUFHtHw",
    authDomain: "bahar-sports-f2a70.firebaseapp.com",
    projectId: "bahar-sports-f2a70",
    storageBucket: "bahar-sports-f2a70.firebasestorage.app",
    messagingSenderId: "254621686378",
    appId: "1:254621686378:web:4edfdf85c40362a51cc813"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Admin Login Event Listener
document.getElementById("loginBtn").addEventListener("click", function() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password!");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        alert("✅ Login Successful");
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        loadOrders();
    })
    .catch((error) => {
        alert("Login Failed: " + error.message);
    });
});

// Upload Product Event Listener
document.getElementById("uploadBtn").addEventListener("click", async function() {
    let name = document.getElementById("prodName").value.trim();
    let price = Number(document.getElementById("prodPrice").value);
    let category = document.getElementById("prodCategory").value;
    let img = document.getElementById("prodImg").value.trim();

    if (!name || !price || !img) {
        alert("Please fill in all the product fields!");
        return;
    }

    try {
        await addDoc(collection(db, "products"), {
            name: name,
            price: price,
            category: category,
            img: img,
            createdAt: new Date()
        });

        alert("✅ Product Uploaded Successfully!");
        
        document.getElementById("prodName").value = "";
        document.getElementById("prodPrice").value = "";
        document.getElementById("prodImg").value = "";

    } catch (error) {
        alert("❌ Error uploading product: " + error.message);
    }
});

// Load Orders Function
async function loadOrders() {
    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        let list = document.getElementById("orderList");
        list.innerHTML = "";

        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let row = `
                <tr>
                    <td>${data.name || 'N/A'}</td>
                    <td>${data.phone || 'N/A'}</td>
                    <td>${data.product || 'N/A'}</td>
                    <td>${data.size || 'N/A'}</td>
                    <td>${data.address || 'N/A'}</td>
                </tr>
            `;
            list.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading orders: ", error);
    }
}