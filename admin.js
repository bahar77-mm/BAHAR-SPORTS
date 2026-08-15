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


// =====================================
// Firebase Configuration
// =====================================

const firebaseConfig = {
    apiKey: "AIzaSyCyqVbz009_W67poKQgjHLuGsLQTUFHtHw",
    authDomain: "bahar-sports-f2a70.firebaseapp.com",
    projectId: "bahar-sports-f2a70",
    storageBucket: "bahar-sports-f2a70.firebasestorage.app",
    messagingSenderId: "254621686378",
    appId: "1:254621686378:web:4edfdf85c40362a51cc813"
};


// =====================================
// Initialize Firebase
// =====================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// =====================================
// ADMIN LOGIN
// =====================================

document.getElementById("loginBtn").addEventListener("click", function() {

    let email =
        document.getElementById("email").value.trim();

    let password =
        document.getElementById("password").value.trim();


    if (!email || !password) {

        alert("Please enter both email and password!");

        return;
    }


    signInWithEmailAndPassword(
        auth,
        email,
        password
    )

    .then(() => {

        alert("✅ Login Successful");

        document.getElementById("loginBox").style.display = "none";

        document.getElementById("dashboard").style.display = "block";

        loadOrders();

        loadManageProducts();

    })

    .catch((error) => {

        alert(
            "Login Failed: " +
            error.message
        );

    });

});


// =====================================
// UPLOAD NEW PRODUCT
// =====================================

document.getElementById("uploadBtn").addEventListener("click", async function() {

    let name =
        document.getElementById("prodName").value.trim();

    let price =
        Number(
            document.getElementById("prodPrice").value
        );


    // Discount Price

    let discountInput =
        document.getElementById("prodDiscountPrice");

    let discountPrice = null;


    if (discountInput) {

        let discountValue =
            discountInput.value.trim();


        if (discountValue !== "") {

            discountPrice =
                Number(discountValue);

        }

    }


    let category =
        document.getElementById("prodCategory").value;

    let stockStatus =
        document.getElementById("prodStockStatus").value;

    let img =
        document.getElementById("prodImg").value.trim();


    // Check required fields

    if (!name || !price || !img) {

        alert(
            "Please fill in all the product fields!"
        );

        return;
    }


    // Check discount price

    if (
        discountPrice !== null &&
        (
            isNaN(discountPrice) ||
            discountPrice < 0 ||
            discountPrice >= price
        )
    ) {

        alert(
            "Discount Price must be less than Regular Price!"
        );

        return;
    }


    try {

        await addDoc(
            collection(db, "products"),
            {

                name: name,

                price: price,

                // Discount saved to Firebase

                discountPrice:
                    discountPrice,

                category:
                    category,

                stockStatus:
                    stockStatus,

                img:
                    img,

                createdAt:
                    new Date()

            }
        );


        alert(
            "✅ Product Uploaded Successfully!"
        );


        // Clear fields

        document.getElementById("prodName").value = "";

        document.getElementById("prodPrice").value = "";


        if (discountInput) {

            discountInput.value = "";

        }


        document.getElementById("prodImg").value = "";


        // Reload product list

        loadManageProducts();

    }

    catch (error) {

        alert(
            "❌ Error uploading product: "
            + error.message
        );

    }

});
// =====================================
// LOAD ORDERS
// =====================================

async function loadOrders() {

    const list =
        document.getElementById("order-list");

    if (!list) return;


    list.innerHTML = `
        <tr>
            <td colspan="10"
                style="text-align:center;">
                Loading orders...
            </td>
        </tr>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(db, "orders")
            );


        list.innerHTML = "";


        if (snapshot.empty) {

            list.innerHTML = `
                <tr>
                    <td colspan="10"
                        style="text-align:center;">
                        No orders found.
                    </td>
                </tr>
            `;

            return;
        }


        snapshot.forEach((docSnap) => {

            const data =
                docSnap.data();

            const docId =
                docSnap.id;


            const status =
                data.status || "Pending";


            let row = `

                <tr id="order-row-${docId}">

                    <td>
                        <strong
                            style="color:#2563eb;">
                            ${data.orderId || "N/A"}
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
                        <strong
                            style="color:#2563eb;">
                            ${data.payment || "N/A"}
                        </strong>
                    </td>


                    <!-- ORDER STATUS -->

                    <td>

                        <select
                            id="order-status-${docId}"
                            style="
                                padding:6px;
                                border-radius:6px;
                                border:1px solid #ccc;
                                margin-bottom:5px;
                            "
                        >

                            <option
                                value="Pending"
                                ${status === "Pending"
                                    ? "selected"
                                    : ""}>
                                Pending
                            </option>


                            <option
                                value="Confirmed"
                                ${status === "Confirmed"
                                    ? "selected"
                                    : ""}>
                                Confirmed
                            </option>


                            <option
                                value="Processing"
                                ${status === "Processing"
                                    ? "selected"
                                    : ""}>
                                Processing
                            </option>


                            <option
                                value="Shipped"
                                ${status === "Shipped"
                                    ? "selected"
                                    : ""}>
                                Shipped
                            </option>


                            <option
                                value="Delivered"
                                ${status === "Delivered"
                                    ? "selected"
                                    : ""}>
                                Delivered
                            </option>


                            <option
                                value="Cancelled"
                                ${status === "Cancelled"
                                    ? "selected"
                                    : ""}>
                                Cancelled
                            </option>

                        </select>


                        <button
                            class="table-confirm-btn"
                            onclick="
                                updateOrderStatus('${docId}')
                            "
                        >
                            Update
                        </button>

                    </td>


                    <!-- EXISTING CONFIRM BUTTON -->

                    <td>

                        <button
                            class="table-confirm-btn"
                            onclick="
                                confirmAndDeleteOrder('${docId}')
                            "
                        >
                            Confirm
                        </button>

                    </td>

                </tr>

            `;


            list.innerHTML += row;

        });


    }

    catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        list.innerHTML = `
            <tr>
                <td colspan="10"
                    style="
                        text-align:center;
                        color:red;
                    ">
                    Failed to load orders.
                </td>
            </tr>
        `;

    }

}


// =====================================
// UPDATE ORDER STATUS
// =====================================

window.updateOrderStatus =
async function(docId) {

    const statusSelect =
        document.getElementById(
            `order-status-${docId}`
        );


    if (!statusSelect) {

        alert(
            "❌ Status option not found!"
        );

        return;
    }


    const newStatus =
        statusSelect.value;


    try {

        await updateDoc(

            doc(
                db,
                "orders",
                docId
            ),

            {
                status: newStatus
            }

        );


        alert(
            "✅ Order status updated!"
        );


        // Reload order list

        loadOrders();

    }

    catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            "❌ Failed to update order status!"
        );

    }

};


// =====================================
// CONFIRM + DELETE ORDER
// =====================================

window.confirmAndDeleteOrder =
async function(docId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to confirm and delete this order?"
        );


    if (!confirmDelete) {

        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "orders",
                docId
            )
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

    }

    catch (error) {

        console.error(
            "Delete order error:",
            error
        );


        alert(
            "❌ Failed to delete order!"
        );

    }

};


// =====================================
// LOAD MANAGE PRODUCTS
// =====================================

async function loadManageProducts() {

    const productList =
        document.getElementById(
            "manage-product-list"
        );


    if (!productList) return;


    productList.innerHTML = "";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        if (snapshot.empty) {

            productList.innerHTML = `
                <tr>
                    <td colspan="7"
                        style="text-align:center;">
                        No products found.
                    </td>
                </tr>
            `;

            return;
        }


        snapshot.forEach((docSnap) => {

            const data =
                docSnap.data();

            const docId =
                docSnap.id;


            const price =
                Number(
                    data.price || 0
                );


            const discountPrice =
                Number(
                    data.discountPrice || 0
                );


            const finalPrice =
                discountPrice > 0
                    ? discountPrice
                    : price;


            const stockStatus =
                data.stockStatus ||
                "In Stock";


            let row = `

                <tr>

                    <td>

                        <img
                            src="${data.img || ""}"
                            style="
                                width:60px;
                                height:60px;
                                object-fit:cover;
                                border-radius:8px;
                            "
                        >

                    </td>


                    <td>
                        ${data.name || "N/A"}
                    </td>


                    <td>
                        ৳${price}
                    </td>


                    <td>

                        ${
                            discountPrice > 0
                            ? `৳${discountPrice}`
                            : "No Discount"
                        }

                    </td>


                    <td>
                        ${data.category || "N/A"}
                    </td>


                    <td>
                        ${stockStatus}
                    </td>


                    <td>

                        <button
                            class="table-confirm-btn"
                            onclick="
                                deleteProduct('${docId}')
                            "
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;


            productList.innerHTML += row;

        });

    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}


// =====================================
// DELETE PRODUCT
// =====================================

window.deleteProduct =
async function(docId) {

    const ok =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!ok) {

        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "products",
                docId
            )
        );


        alert(
            "✅ Product deleted successfully!"
        );


        loadManageProducts();

    }

    catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        alert(
            "❌ Failed to delete product!"
        );

    }

};
// =====================================
// PAGE INITIALIZATION
// =====================================

// If admin panel is already visible,
// load orders and products.

document.addEventListener("DOMContentLoaded", function () {

    const dashboard =
        document.getElementById("dashboard");


    if (
        dashboard &&
        dashboard.style.display !== "none"
    ) {

        loadOrders();

        loadManageProducts();

    }

});


// =====================================
// REFRESH ORDERS BUTTON
// =====================================

const refreshOrdersBtn =
    document.getElementById(
        "refreshOrdersBtn"
    );


if (refreshOrdersBtn) {

    refreshOrdersBtn.addEventListener(
        "click",
        function () {

            loadOrders();

        }
    );

}


// =====================================
// REFRESH PRODUCTS BUTTON
// =====================================

const refreshProductsBtn =
    document.getElementById(
        "refreshProductsBtn"
    );


if (refreshProductsBtn) {

    refreshProductsBtn.addEventListener(
        "click",
        function () {

            loadManageProducts();

        }
    );

}


// =====================================
// SEARCH ORDERS
// =====================================

const orderSearch =
    document.getElementById(
        "orderSearch"
    );


if (orderSearch) {

    orderSearch.addEventListener(
        "input",
        function () {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const rows =
                document.querySelectorAll(
                    "#order-list tr"
                );


            rows.forEach(row => {

                const text =
                    row.innerText
                        .toLowerCase();


                if (
                    text.includes(searchText)
                ) {

                    row.style.display = "";

                } else {

                    row.style.display =
                        "none";

                }

            });

        }
    );

}


// =====================================
// SEARCH PRODUCTS
// =====================================

const productSearch =
    document.getElementById(
        "productSearch"
    );


if (productSearch) {

    productSearch.addEventListener(
        "input",
        function () {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const rows =
                document.querySelectorAll(
                    "#manage-product-list tr"
                );


            rows.forEach(row => {

                const text =
                    row.innerText
                        .toLowerCase();


                if (
                    text.includes(searchText)
                ) {

                    row.style.display = "";

                } else {

                    row.style.display =
                        "none";

                }

            });

        }
    );

}


// =====================================
// END OF ADMIN.JS
// =====================================