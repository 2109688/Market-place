var firebaseConfig = {
  apiKey: "AIzaSyBmJqjAXztETX4Dh4vEetlB4QzN9uqReYA",
  authDomain: "witsmarketproject.firebaseapp.com",
  databaseURL: "https://witsmarketproject-default-rtdb.firebaseio.com",
  projectId: "witsmarketproject",
  storageBucket: "witsmarketproject.appspot.com",
  messagingSenderId: "650642470600",
  appId: "1:650642470600:web:49fe3a262e6ca122b597fd",
  measurementId: "G-EHXK572PE1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth.Auth.Persistence.LOCAL;

function login(){
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    //window.alert(user.uid);
    window.location.href = "index.html";
  })
  .catch((error) => {
    var errorMessage = error.message;
    window.alert(errorMessage)
  });
}

function register(){
  var fName = document.getElementById("fName").value;
  var lName = document.getElementById("lName").value;
  var dob = document.getElementById("dob").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var cPassword = document.getElementById("cPassword").value;

  if(password == cPassword){
    if(fName!= "" && lName != "" && dob != ""){
      firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
        // Signed in 
        var user = userCredential.user.uid;
        var rootRef = firebase.database().ref();
        var usersRef = rootRef.child("users").child(user).child("details");
        var userData = 
        {
          firstName: fName,
          lastName: lName,
          dateOfBirth: dob,
          email: email,
          availableMoney: 10000
        };
        usersRef.set(userData, function(error){
          if(error){
            var errorCode = error.code;
            var errorMessage = error.message;
  
            window.alert("Message : " + errorMessage);
          }
          else{
            window.location.href = "index.html";
          }
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage)
        // ..
      });
    }
    else{
      window.alert("Please enter all fields!")
    }
    
  }
  else{
    window.alert("Passwords do not match.");
  }
}

function logout(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}

function getCategoryAndProductId(productId){
  arr = [1, 2, 3, 4, 5];
  categoryArray = ["Clothes", "Food", "Games", "Sports", "Technology"];
  for(var i=0; i<categoryArray.length; i++){
    if(productId.toString().charAt(0) == arr[i]){
      return [categoryArray[i], (productId-(i+1)*1000)];
    }
  }
}

function cartToFirebase(productId){
  var categoryProduct = getCategoryAndProductId(productId);
  var category = categoryProduct[0];
  var productId = "id"+categoryProduct[1];
  var categoryProductId = category +"_"+ productId;
  firebase.auth().onAuthStateChanged(function(user){
    const rootRef = firebase.database().ref();
    var usersRef = rootRef.child("users").child(user.uid).child("cart").child(categoryProductId);
      var userData = 
      {
        category: category,
        productId: productId,
        quantity: 1
      };
      usersRef.set(userData)
  });
}

function removeProduct(userUidAndCartId){ //seperated by #
  var arr =  userUidAndCartId.split("#");
  var userUid  = arr[0];
  var categoryProductId = arr[1];
  const rootRef = firebase.database().ref();

  var categotyProd = rootRef.child("users").child(userUid).child("cart").child(categoryProductId);
  categotyProd.set(null);

  window.location.href = "cart.html";
}

function updateQuantity(userUidAndCartId){ //seperated by #

  // const quantityInput = document.getElementById(cartId).value;
  
  var arr =  userUidAndCartId.split("#");
  var userUid  = arr[0];
  var categoryProductId = arr[1];
  var quantityInput = document.getElementById(categoryProductId).value;

  const rootRef = firebase.database().ref();
  var categotyProd = rootRef.child("users").child(userUid).child("cart").child(categoryProductId).child("quantity");
  categotyProd.set(quantityInput);

  window.location.href = "cart.html";

}

function checkout(){ 
  window.location.href = "checkout.html";
}

function checkoutOpen(){
  //update price
  firebase.auth().onAuthStateChanged(function(user){
    var userUid = user.uid;
    const dbRef = firebase.database().ref();
    dbRef.on('value', function(datasnapshot){
      dbRef.child("users").child(userUid).child("cart").once("value", function(data) {
        var cartObject = data.val();  //all prodcuts object

        var totalCartPrice = 0;
        for(var categoryId in cartObject){
          var category = cartObject[categoryId].category;
          var productId = cartObject[categoryId].productId
          var quantity = cartObject[categoryId].quantity;
          
          dbRef.child("prodcutCategory").child(category).child(productId).once("value", function(data) {

            var price = data.val().price;
            dbRef.child("users").child(userUid).child("cart").child(categoryId).child("totalPrice").set(price*quantity);
            totalCartPrice += price*quantity;
          });
          dbRef.child("users").child(userUid).child("cart").child("totalCartPrice").set(totalCartPrice);
        }
      });
    });
  });

  // var totalCartPrice = 0;

  // get total price
  // firebase.auth().onAuthStateChanged(function(user){
  //   var userUid = user.uid;
  //   const dbRef = firebase.database().ref();
  //   dbRef.on('value', function(datasnapshot){
  //     dbRef.child("users").child(userUid).child("cart").once("value", function(data) {
  //       var cartObject = data.val();  //all prodcuts object
  //       var count = Object.keys(cartObject).length;
  //       for(var categoryId in cartObject){

  //         dbRef.child("users").child(userUid).child("cart").child(categoryId).once("value", function(data) {
  //           var index = Object.keys(cartObject).indexOf(categoryId);
  //           // window.alert(totalCartPrice);

  //           // totalCartPrice += data.val().totalPrice;

  //           // if(count-index == 1){ //last in
  //           //   // window.alert(totalCartPrice);
  //           //   dbRef.child("users").child(userUid).child("cart").child("totalCartPrice").set(totalCartPrice);
  //           //   window.alert(1232)

  //           // }
  //         });
  //       }
  //       // dbRef.child("users").child(userUid).child("cart").child("totalCartPrice").set(totalCartPrice);
  //     });
  //   });
  // });
}

  