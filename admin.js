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
// FIREBASE CONFIGURATION
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
// INITIALIZE FIREBASE
// =====================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


// =====================================
// ADMIN LOGIN
// =====================================

document
    .getElementById("loginBtn")
    .addEventListener("click", function () {

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();


        if (!email || !password) {

            alert(
                "Please enter both email and password!"
            );

            return;
        }


        signInWithEmailAndPassword(
            auth,
            email,
            password
        )

        .then(() => {

            alert("✅ Login Successful");


            document.getElementById(
                "loginBox"
            ).style.display = "none";


            document.getElementById(
                "dashboard"
            ).style.display = "block";


            loadOrders();

            loadManageProducts();

        })

        .catch((error) => {

            console.error(
                "Login Error:",
                error
            );


            alert(
                "Login Failed: " +
                error.message
            );

        });

    });


// =====================================
// UPLOAD NEW PRODUCT
// =====================================

document
    .getElementById("uploadBtn")
    .addEventListener("click", async function () {


        const name =
            document
                .getElementById("prodName")
                .value
                .trim();


        const price =
            Number(
                document
                    .getElementById("prodPrice")
                    .value
            );


        const discountInput =
            document.getElementById(
                "prodDiscountPrice"
            );


        let discountPrice = null;


        if (discountInput) {

            const discountValue =
                discountInput.value.trim();


            if (discountValue !== "") {

                discountPrice =
                    Number(discountValue);

            }

        }


        const category =
            document.getElementById(
                "prodCategory"
            ).value;


        const stockStatus =
            document.getElementById(
                "prodStockStatus"
            ).value;


        const img =
            document.getElementById(
                "prodImg"
            ).value.trim();


        // REQUIRED FIELD CHECK

        if (!name || !price || !img) {

            alert(
                "Please fill in all the product fields!"
            );

            return;
        }


        // DISCOUNT CHECK

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
                collection(
                    db,
                    "products"
                ),
                {

                    name: name,

                    price: price,

                    discountPrice:
                        discountPrice,

                    category:
                        category,

                    stockStatus:
                        stockStatus,

                    img: img,

                    createdAt:
                        new Date()

                }
            );


            alert(
                "✅ Product Uploaded Successfully!"
            );


            // CLEAR INPUTS

            document.getElementById(
                "prodName"
            ).value = "";


            document.getElementById(
                "prodPrice"
            ).value = "";


            if (discountInput) {

                discountInput.value = "";

            }


            document.getElementById(
                "prodImg"
            ).value = "";


            // RELOAD PRODUCTS

            loadManageProducts();

        }

        catch (error) {

            console.error(
                "Product Upload Error:",
                error
            );


            alert(
                "❌ Error uploading product: " +
                error.message
            );

        }

    });
    // =====================================
// LOAD ORDERS
// =====================================

async function loadOrders() {

    const list =
        document.getElementById("orderList");

    if (!list) return;


    list.innerHTML = `
        <tr>
            <td colspan="9"
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
                    <td colspan="9"
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


            // Tracking Code

            const trackingCode =
                data.orderId ||
                data.trackingCode ||
                "N/A";


            // Current Status

            const currentStatus =
                data.status ||
                "Pending";


            const row = `

                <tr id="order-row-${docId}">

                    <!-- Tracking Code -->

                    <td>
                        <strong
                            style="
                                color:#2563eb;
                            "
                        >
                            ${trackingCode}
                        </strong>
                    </td>


                    <!-- Name -->

                    <td>
                        ${data.name || "N/A"}
                    </td>


                    <!-- Phone -->

                    <td>
                        ${data.phone || "N/A"}
                    </td>


                    <!-- Product -->

                    <td>
                        ${data.product || "N/A"}
                    </td>


                    <!-- Size -->

                    <td>
                        ${data.size || "N/A"}
                    </td>


                    <!-- Address -->

                    <td>
                        ${data.address || "N/A"}
                    </td>


                    <!-- Payment -->

                    <td>
                        ${data.payment || "N/A"}
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
                                ${
                                    currentStatus ===
                                    "Pending"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Pending
                            </option>


                            <option
                                value="Confirmed"
                                ${
                                    currentStatus ===
                                    "Confirmed"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Confirmed
                            </option>


                            <option
                                value="Processing"
                                ${
                                    currentStatus ===
                                    "Processing"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Processing
                            </option>


                            <option
                                value="Shipped"
                                ${
                                    currentStatus ===
                                    "Shipped"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Shipped
                            </option>


                            <option
                                value="Delivered"
                                ${
                                    currentStatus ===
                                    "Delivered"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Delivered
                            </option>


                            <option
                                value="Cancelled"
                                ${
                                    currentStatus ===
                                    "Cancelled"
                                    ? "selected"
                                    : ""
                                }
                            >
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


                    <!-- ACTION -->

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
                <td colspan="9"
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


        loadOrders();

    }

    catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            "❌ Failed to update order status: " +
            error.message
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
            "❌ Failed to delete order: " +
            error.message
        );

    }

};
// =====================================
// LOAD PRODUCTS
// =====================================

async function loadManageProducts() {

    try {

        const querySnapshot =
            await getDocs(
                collection(db, "products")
            );


        let manageList =
            document.getElementById(
                "manageProductList"
            );


        manageList.innerHTML = "";


        querySnapshot.forEach(
            (documentSnapshot) => {

                let prod =
                    documentSnapshot.data();

                let prodId =
                    documentSnapshot.id;


                // Current stock

                let currentStatus =
                    prod.stockStatus || "In Stock";


                // Current discount

                let currentDiscount =
                    prod.discountPrice ?? "";


                let row = `

                    <tr id="prod-row-${prodId}">

                        <!-- IMAGE -->

                        <td>

                            <img
                                src="${prod.img}"
                                width="50"
                                style="
                                    border-radius:5px;
                                    object-fit:cover;
                                "
                            >

                        </td>


                        <!-- PRODUCT NAME -->

                        <td>
                            ${prod.name}
                        </td>


                        <!-- REGULAR PRICE -->

                        <td>
                            ৳${prod.price}
                        </td>


                        <!-- DISCOUNT PRICE -->

                        <td>

                            <input
                                type="number"
                                id="discount_${prodId}"
                                class="table-input"
                                value="${currentDiscount}"
                                min="0"
                                max="${Number(prod.price) - 1}"
                                placeholder="No Discount"
                            >

                        </td>


                        <!-- STOCK STATUS -->

                        <td>

                            <select
                                id="status_${prodId}"
                                style="
                                    padding:6px;
                                    border-radius:6px;
                                "
                            >

                                <option
                                    value="In Stock"
                                    ${
                                        currentStatus ===
                                        "In Stock"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    In Stock
                                </option>


                                <option
                                    value="Stock Out"
                                    ${
                                        currentStatus ===
                                        "Stock Out"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    Stock Out
                                </option>


                                <option
                                    value="M Size Stock Out"
                                    ${
                                        currentStatus ===
                                        "M Size Stock Out"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    M Size Stock Out
                                </option>


                                <option
                                    value="L Size Stock Out"
                                    ${
                                        currentStatus ===
                                        "L Size Stock Out"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    L Size Stock Out
                                </option>


                                <option
                                    value="XL Size Stock Out"
                                    ${
                                        currentStatus ===
                                        "XL Size Stock Out"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    XL Size Stock Out
                                </option>


                                <option
                                    value="XXL Size Stock Out"
                                    ${
                                        currentStatus ===
                                        "XXL Size Stock Out"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    XXL Size Stock Out
                                </option>


                                <option
                                    value="3XL Size Stock Out"
                                    ${
                                        currentStatus ===
                                        "3XL Size Stock Out"
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    3XL Size Stock Out
                                </option>

                            </select>

                        </td>


                        <!-- ACTION -->

                        <td>

                            <button
                                class="table-confirm-btn"
                                onclick="
                                    updateProduct(
                                        '${prodId}',
                                        ${Number(prod.price)}
                                    )
                                "
                            >
                                Update
                            </button>

                        </td>

                    </tr>

                `;


                manageList.innerHTML += row;

            }
        );

    }

    catch (error) {

        console.error(
            "Error loading products for management: ",
            error
        );

    }

}


// =====================================
// UPDATE PRODUCT
// DISCOUNT + STOCK
// =====================================

window.updateProduct =
async function(
    prodId,
    regularPrice
) {

    let discountInput =
        document.getElementById(
            `discount_${prodId}`
        );


    let statusInput =
        document.getElementById(
            `status_${prodId}`
        );


    if (
        !discountInput ||
        !statusInput
    ) {

        alert(
            "❌ Product controls not found."
        );

        return;
    }


    let discountValue =
        discountInput.value.trim();


    let discountPrice =
        discountValue === ""
        ? null
        : Number(discountValue);


    let selectedStatus =
        statusInput.value;


    // Discount validation

    if (
        discountPrice !== null &&
        (
            isNaN(discountPrice) ||
            discountPrice < 0 ||
            discountPrice >= Number(regularPrice)
        )
    ) {

        alert(
            "Discount Price must be less than Regular Price!"
        );

        return;
    }


    try {

        const prodRef =
            doc(
                db,
                "products",
                prodId
            );


        await updateDoc(
            prodRef,
            {

                // Save discount

                discountPrice:
                    discountPrice,


                // Save stock

                stockStatus:
                    selectedStatus

            }
        );


        alert(
            "✅ Product updated successfully!"
        );


        // Reload products

        loadManageProducts();

    }

    catch (error) {

        console.error(
            "Error updating product: ",
            error
        );


        alert(
            "❌ Failed to update product: "
            + error.message
        );

    }

};


// =====================================
// OLD STOCK UPDATE FUNCTION
// রাখা হয়েছে যাতে আগের কিছু নষ্ট না হয়
// =====================================

window.updateStockStatus =
async function(prodId) {

    let selectedStatus =
        document.getElementById(
            `status_${prodId}`
        ).value;


    try {

        const prodRef =
            doc(
                db,
                "products",
                prodId
            );


        await updateDoc(
            prodRef,
            {

                stockStatus:
                    selectedStatus

            }
        );


        alert(
            "✅ Stock status updated successfully!"
        );

    }

    catch (error) {

        console.error(
            "Error updating stock status: ",
            error
        );


        alert(
            "❌ Failed to update stock status."
        );

    }

};


// =====================================
// CONFIRM + DELETE ORDER
// =====================================

window.confirmAndDeleteOrder =
async function(docId) {

    if (
        confirm(
            "Are you sure you want to confirm and delete this order?"
        )
    ) {

        try {

            await deleteDoc(
                doc(
                    db,
                    "orders",
                    docId
                )
            );


            let rowElement =
                document.getElementById(
                    `order-row-${docId}`
                );


            if (rowElement) {

                rowElement.remove();

            }


            alert(
                "✅ Order confirmed and deleted successfully!"
            );

        }

        catch (error) {

            console.error(
                "Error deleting order: ",
                error
            );


            alert(
                "❌ Failed to delete the order."
            );

        }

    }

};