import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
getFirestore, 
collection, 
getDocs 
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




// Admin Login

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





// Load Orders

async function loadOrders(){


const querySnapshot = await getDocs(collection(db,"orders"));



let list = document.getElementById("orderList");


list.innerHTML="";



querySnapshot.forEach((doc)=>{


let data = doc.data();



let row = `


<tr>

<td>${data.name}</td>

<td>${data.phone}</td>

<td>${data.product}</td>

<td>${data.size}</td>

<td>${data.address}</td>


</tr>


`;



list.innerHTML += row;



});



}