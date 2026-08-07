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
        let container = document.querySelector(".products"); 
        
        if (!container) return; 

        querySnapshot.forEach((doc) => {
            let p = doc.data();
            let card = `
                <div class="card product-card" data-category="club">
                    <div class="wishlist-btn" onclick="toggleWishlist(this, '${p.name}', ${p.price})">🤍</div>
                    <a href="product.html?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}">
                        <img src="${p.img}" alt="${p.name}">
                    </a>
                    <a href="product.html?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}" style="text-decoration:none; color:inherit;">
                        <h2>${p.name}</h2>
                    </a>
                    <p class="price">৳${p.price}</p>
                    <div class="size-selector">
                        <label>Size:</label>
                        <select id="size-${doc.id}">
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>
                    <div class="card-buttons">
                        <button class="add-cart-btn" onclick="addToCart('${p.name}', ${p.price}, 'size-${doc.id}')">🛒 Add to Cart</button>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error("Error loading products: ", error);
    }
}

loadProducts();