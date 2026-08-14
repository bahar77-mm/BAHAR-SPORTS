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

        loadManageProducts();

    })

    .catch((error) => {

        alert("Login Failed: " + error.message);

    });

});


// =====================================
// UPLOAD NEW PRODUCT
// =====================================

document.getElementById("uploadBtn").addEventListener("click", async function() {

    let name =
        document.getElementById("prodName").value.trim();

    let price =
        Number(document.getElementById("prodPrice").value);

    // Discount Price
    let discountInput =
        document.getElementById("prodDiscountPrice");

    let discountPrice = null;

    if (discountInput) {

        let discountValue =
            discountInput.value.trim();

        if (discountValue !== "") {
            discountPrice = Number(discountValue);
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

        alert("Please fill in all the product fields!");

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

        alert("Discount Price must be less than Regular Price!");

        return;

    }


    try {

        await addDoc(
            collection(db, "products"),
            {

                name: name,

                price: price,

                // Discount saved to Firebase
                discountPrice: discountPrice,

                category: category,

                stockStatus: stockStatus,

                img: img,

                createdAt: new Date()

            }
        );


        alert("✅ Product Uploaded Successfully!");


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

    try {

        const querySnapshot =
            await getDocs(
                collection(db, "orders")
            );

        let list =
            document.getElementById("orderList");

        list.innerHTML = "";


        querySnapshot.forEach(
            (documentSnapshot) => {

                let data =
                    documentSnapshot.data();

                let docId =
                    documentSnapshot.id;


                let row = `

                    <tr id="order-row-${docId}">

                        <td>
                            ${data.name || 'N/A'}
                        </td>

                        <td>
                            ${data.phone || 'N/A'}
                        </td>

                        <td>
                            ${data.product || 'N/A'}
                        </td>

                        <td>
                            ${data.size || 'N/A'}
                        </td>

                        <td>
                            ${data.address || 'N/A'}
                        </td>

                        <td>
                            <strong style="color:#2563eb;">
                                ${data.payment || 'Cash on Delivery'}
                            </strong>
                        </td>

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

            }
        );

    }

    catch (error) {

        console.error(
            "Error loading orders: ",
            error
        );

    }

}


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
                                    ${currentStatus === "In Stock"
                                    ? "selected"
                                    : ""}
                                >
                                    In Stock
                                </option>


                                <option
                                    value="Stock Out"
                                    ${currentStatus === "Stock Out"
                                    ? "selected"
                                    : ""}
                                >
                                    Stock Out
                                </option>


                                <option
                                    value="M Size Stock Out"
                                    ${currentStatus === "M Size Stock Out"
                                    ? "selected"
                                    : ""}
                                >
                                    M Size Stock Out
                                </option>


                                <option
                                    value="L Size Stock Out"
                                    ${currentStatus === "L Size Stock Out"
                                    ? "selected"
                                    : ""}
                                >
                                    L Size Stock Out
                                </option>


                                <option
                                    value="XL Size Stock Out"
                                    ${currentStatus === "XL Size Stock Out"
                                    ? "selected"
                                    : ""}
                                >
                                    XL Size Stock Out
                                </option>


                                <option
                                    value="XXL Size Stock Out"
                                    ${currentStatus === "XXL Size Stock Out"
                                    ? "selected"
                                    : ""}
                                >
                                    XXL Size Stock Out
                                </option>


                                <option
                                    value="3XL Size Stock Out"
                                    ${currentStatus === "3XL Size Stock Out"
                                    ? "selected"
                                    : ""}
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

window.updateProduct = async function(
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


    if (!discountInput || !statusInput) {

        alert("❌ Product controls not found.");

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

window.updateStockStatus = async function(prodId) {

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