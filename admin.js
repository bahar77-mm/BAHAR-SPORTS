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



// Firebase Configuration[cite: 5]

const firebaseConfig = {

apiKey: "AIzaSyCyqVbz009_W67poKQgjHLuGsLQTUFHtHw",

authDomain: "bahar-sports-f2a70.firebaseapp.com",

projectId: "bahar-sports-f2a70",

storageBucket: "bahar-sports-f2a70.firebasestorage.app",

messagingSenderId: "254621686378",

appId: "1:254621686378:web:4edfdf85c40362a51cc813"

};



// Initialize Firebase[cite: 5]

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);




// Admin Login[cite: 5]

window.login = function(){


let email = document.getElementById("email").value;

let password = document.getElementById("password").value;



signInWithEmailAndPassword(auth,email,password)

.then(()=>{


alert("✅ Login Successful");


document.getElementById("loginBox").style.display="none";


document.getElementById("dashboard").style.display="block";


loadOrders();



})


.catch((error)=>{


alert("Login Failed: "+error.message);


});


}


// Upload Product to Firebase (New Added)
window.uploadProduct = async function() {
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
        
        // Clear input fields after successful upload
        document.getElementById("prodName").value = "";
        document.getElementById("prodPrice").value = "";
        document.getElementById("prodImg").value = "";

    } catch (error) {
        alert("❌ Error uploading product: " + error.message);
    }
};



// Load Orders[cite: 5]

async function loadOrders(){


const querySnapshot = await getDocs(collection(db,"orders"));[cite: 5]



let list = document.getElementById("orderList");[cite: 5]


list.innerHTML="";[cite: 5]



querySnapshot.forEach((doc)=>{[cite: 5]


let data = doc.data();[cite: 5]



let row = `


<tr>

<td>${data.name}</td>

<td>${data.phone}</td>

<td>${data.product}</td>

<td>${data.size}</td>

<td>${data.address}</td>


</tr>


`;[cite: 5]



list.innerHTML += row;[cite: 5]



});



}