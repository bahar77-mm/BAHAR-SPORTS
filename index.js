import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyqVbz009_W67poKQgjHLuGsLQTUFHtHw",
    authDomain: "bahar-sports-f2a70.firebaseapp.com",
    projectId: "bahar-sports-f2a70",
    storageBucket: "bahar-sports-f2a70.firebasestorage.app",
    messagingSenderId: "254621686378",
    appId: "1:254621686378:web:4edfdf85c40362a51cc813"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// প্রোডাক্ট লোড করার ফাংশন
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        let container = document.getElementById("productContainer");
        
        if (!container) return; // যদি ওই আইডি খুঁজে না পায়, তাহলে কিছু করবে না

        container.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            let p = doc.data();
            let card = `
                <div style="border:1px solid #ddd; padding:15px; margin:10px; border-radius:10px; display:inline-block; width:200px;">
                    <img src="${p.img}" alt="${p.name}" style="width:100%; height:150px; object-fit:cover;">
                    <h3>${p.name}</h3>
                    <p>Price: ${p.price} TK</p>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error("Error loading products: ", error);
    }
}

loadProducts();