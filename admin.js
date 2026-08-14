import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs,
    addDoc,
    doc,
    deleteDoc,
    updateDoc 
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
        loadManageProducts(); // অ্যাডমিন লগইন করার পর প্রোডাক্ট লিস্ট লোড হবে
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
    let stockStatus = document.getElementById("prodStockStatus").value; // স্টক স্ট্যাটাস নেওয়া হলো
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
            stockStatus: stockStatus, // ডাটাবেজে স্টক স্ট্যাটাস সেভ হচ্ছে
            img: img,
            createdAt: new Date()
        });

        alert("✅ Product Uploaded Successfully!");
        
        document.getElementById("prodName").value = "";
        document.getElementById("prodPrice").value = "";
        document.getElementById("prodImg").value = "";
        loadManageProducts(); // নতুন প্রোডাক্ট আপলোডের পর লিস্ট আপডেট হবে

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

        querySnapshot.forEach((documentSnapshot) => {
            let data = documentSnapshot.data();
            let docId = documentSnapshot.id;
            
            let row = `
                <tr id="order-row-${docId}">
                    <td>${data.name || 'N/A'}</td>
                    <td>${data.phone || 'N/A'}</td>
                    <td>${data.product || 'N/A'}</td>
                    <td>${data.size || 'N/A'}</td>
                    <td>${data.address || 'N/A'}</td>
                    <td><strong style="color: #2563eb;">${data.payment || 'Cash on Delivery'}</strong></td>
                    <td>
                        <button class="table-confirm-btn" onclick="confirmAndDeleteOrder('${docId}')">Confirm</button>
                    </td>
                </tr>
            `;
            list.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading orders: ", error);
    }
}

// Load Existing Products for Management & Stock Control
async function loadManageProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        let manageList = document.getElementById("manageProductList");
        manageList.innerHTML = "";

        querySnapshot.forEach((documentSnapshot) => {
            let prod = documentSnapshot.data();
            let prodId = documentSnapshot.id;
            let currentStatus = prod.stockStatus || "In Stock";

            let row = `
                <tr id="prod-row-${prodId}">
                    <td><img src="${prod.img}" width="50" style="border-radius:5px; object-fit:cover;"></td>
                    <td>${prod.name}</td>
                    <td>৳${prod.price}</td>
                    <td>
                        <select id="status_${prodId}" style="padding:6px; border-radius:6px;">
                            <option value="In Stock" ${currentStatus === 'In Stock' ? 'selected' : ''}>In Stock</option>
                            <option value="Stock Out" ${currentStatus === 'Stock Out' ? 'selected' : ''}>Stock Out</option>
                            <option value="M Size Stock Out" ${currentStatus === 'M Size Stock Out' ? 'selected' : ''}>M Size Stock Out</option>
                        </select>
                    </td>
                    <td>
                        <button class="table-confirm-btn" onclick="updateStockStatus('${prodId}')">Update</button>
                    </td>
                </tr>
            `;
            manageList.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading products for management: ", error);
    }
}

// Global function to Update Product Stock Status
window.updateStockStatus = async function(prodId) {
    let selectedStatus = document.getElementById(`status_${prodId}`).value;
    try {
        const prodRef = doc(db, "products", prodId);
        await updateDoc(prodRef, {
            stockStatus: selectedStatus
        });
        alert("✅ Stock status updated successfully!");
    } catch (error) {
        console.error("Error updating stock status: ", error);
        alert("❌ Failed to update stock status.");
    }
};

// Global function to Confirm and Delete Order from Firestore and UI
window.confirmAndDeleteOrder = async function(docId) {
    if (confirm("Are you sure you want to confirm and delete this order?")) {
        try {
            await deleteDoc(doc(db, "orders", docId));
            
            let rowElement = document.getElementById(`order-row-${docId}`);
            if (rowElement) {
                rowElement.remove();
            }
            
            alert("✅ Order confirmed and deleted successfully!");
        } catch (error) {
            console.error("Error deleting order: ", error);
            alert("❌ Failed to delete the order.");
        }
    }
};