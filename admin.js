// =====================================
// FIREBASE SETUP
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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

const auth = getAuth(app);


// =====================================
// LOGIN
// =====================================

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value.trim();

        if (!email || !password) {

            alert("Please enter email and password.");

            return;
        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        } catch (error) {

            console.error(error);

            alert("❌ Login failed!");

        }

    });

}


// =====================================
// AUTH STATE
// =====================================

onAuthStateChanged(auth, user => {

    if (user) {

        if (loginBox) {
            loginBox.style.display = "none";
        }

        if (adminPanel) {
            adminPanel.style.display = "block";
        }

        loadOrders();

        loadProducts();

    } else {

        if (loginBox) {
            loginBox.style.display = "block";
        }

        if (adminPanel) {
            adminPanel.style.display = "none";
        }

    }

});


// =====================================
// LOGOUT
// =====================================

window.logout = async function () {

    try {

        await signOut(auth);

    } catch (error) {

        console.error(error);

    }

};


// =====================================
// LOAD ORDERS
// =====================================

async function loadOrders() {

    const list = document.getElementById("order-list");

    if (!list) return;

    list.innerHTML = `
        <tr>
            <td colspan="10" style="text-align:center;">
                Loading orders...
            </td>
        </tr>
    `;

    try {

        const querySnapshot =
            await getDocs(collection(db, "orders"));

        list.innerHTML = "";

        if (querySnapshot.empty) {

            list.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center;">
                        No orders found.
                    </td>
                </tr>
            `;

            return;
        }


        querySnapshot.forEach(docSnap => {

            const data = docSnap.data();

            const docId = docSnap.id;

            const currentStatus =
                data.status || "Pending";


            const row = `

                <tr id="order-row-${docId}">

                    <td>
                        <strong style="color:#2563eb;">
                            ${data.orderId || "Old Order"}
                        </strong>
                    </td>

                    <td>
                        ${data.name || "N/A"}
                    </td>

                    <td>
                        ${data.phone || "N/A"}
                    </td>

                    <td>
                        ${data.product || "N/A"}
                    </td>

                    <td>
                        ${data.size || "N/A"}
                    </td>

                    <td>
                        ${data.address || "N/A"}
                    </td>

                    <td>
                        <strong style="color:#2563eb;">
                            ${data.payment || "Cash on Delivery"}
                        </strong>
                    </td>


                    <!-- STATUS -->

                    <td>

                        <select
                            id="order-status-${docId}"
                            style="
                                padding:6px;
                                border-radius:6px;
                                border:1px solid #ccc;
                            "
                        >

                            <option value="Pending"
                                ${currentStatus === "Pending" ? "selected" : ""}>
                                Pending
                            </option>

                            <option value="Confirmed"
                                ${currentStatus === "Confirmed" ? "selected" : ""}>
                                Confirmed
                            </option>

                            <option value="Processing"
                                ${currentStatus === "Processing" ? "selected" : ""}>
                                Processing
                            </option>

                            <option value="Shipped"
                                ${currentStatus === "Shipped" ? "selected" : ""}>
                                Shipped
                            </option>

                            <option value="Delivered"
                                ${currentStatus === "Delivered" ? "selected" : ""}>
                                Delivered
                            </option>

                            <option value="Cancelled"
                                ${currentStatus === "Cancelled" ? "selected" : ""}>
                                Cancelled
                            </option>

                        </select>


                        <button
                            class="table-confirm-btn"
                            onclick="updateOrderStatus('${docId}')"
                        >
                            Update
                        </button>

                    </td>


                    <!-- OLD CONFIRM BUTTON -->

                    <td>

                        <button
                            class="table-confirm-btn"
                            onclick="confirmAndDeleteOrder('${docId}')"
                        >
                            Confirm
                        </button>

                    </td>

                </tr>

            `;

            list.innerHTML += row;

        });


    } catch (error) {

        console.error("Error loading orders:", error);

        list.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;color:red;">
                    Failed to load orders.
                </td>
            </tr>
        `;

    }

}


// =====================================
// UPDATE ORDER STATUS
// =====================================

window.updateOrderStatus = async function (docId) {

    const statusSelect =
        document.getElementById(`order-status-${docId}`);


    if (!statusSelect) {

        alert("Status selector not found.");

        return;
    }


    const newStatus =
        statusSelect.value;


    try {

        await updateDoc(

            doc(db, "orders", docId),

            {
                status: newStatus
            }

        );


        alert(
            "✅ Order status updated successfully!"
        );


        // Reload orders

        loadOrders();


    } catch (error) {

        console.error(
            "Error updating order status:",
            error
        );


        alert(
            "❌ Failed to update order status."
        );

    }

};


// =====================================
// CONFIRM + DELETE ORDER
// =====================================

window.confirmAndDeleteOrder = async function (docId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to confirm and delete this order?"
        );


    if (!confirmDelete) {

        return;
    }


    try {

        await deleteDoc(
            doc(db, "orders", docId)
        );


        const row =
            document.getElementById(
                `order-row-${docId}`
            );


        if (row) {

            row.remove();

        }


        alert(
            "✅ Order confirmed and deleted."
        );


    } catch (error) {

        console.error(
            "Error deleting order:",
            error
        );


        alert(
            "❌ Failed to delete order."
        );

    }

};


// =====================================
// LOAD PRODUCTS
// =====================================

async function loadProducts() {

    const productList =
        document.getElementById("product-list");

    if (!productList) return;


    productList.innerHTML = "";


    try {

        const snapshot =
            await getDocs(
                collection(db, "products")
            );


        snapshot.forEach(docSnap => {

            const data =
                docSnap.data();


            const id =
                docSnap.id;


            const price =
                Number(data.price || 0);


            const discount =
                Number(data.discount || 0);


            const stock =
                Number(data.stock || 0);


            let finalPrice =
                price;


            if (discount > 0) {

                finalPrice =
                    price -
                    (price * discount / 100);

            }


            const row = `

                <tr>

                    <td>
                        ${data.name || "N/A"}
                    </td>

                    <td>
                        ৳${price}
                    </td>

                    <td>
                        ${discount}%
                    </td>

                    <td>
                        ৳${Math.round(finalPrice)}
                    </td>

                    <td>
                        ${stock}
                    </td>

                    <td>

                        <button
                            onclick="editProduct('${id}')"
                        >
                            Edit
                        </button>

                        <button
                            onclick="deleteProduct('${id}')"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;


            productList.innerHTML += row;

        });


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}


// =====================================
// DELETE PRODUCT
// =====================================

window.deleteProduct = async function (id) {

    if (
        !confirm(
            "Are you sure you want to delete this product?"
        )
    ) {

        return;
    }


    try {

        await deleteDoc(
            doc(db, "products", id)
        );


        alert(
            "✅ Product deleted successfully."
        );


        loadProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Failed to delete product."
        );

    }

};


// =====================================
// EDIT PRODUCT
// =====================================

window.editProduct = function (id) {

    alert(
        "Edit product function can be connected with your existing product editor."
    );

};


// =====================================
// INITIAL LOAD
// =====================================

if (auth.currentUser) {

    loadOrders();

    loadProducts();

}