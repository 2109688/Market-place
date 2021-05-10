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
        var usersRef = rootRef.child("users").child(user);
        var userData = 
        {
          firstName: fName,
          lastName: lName,
          dateOfBirth: dob,
          email: email
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

// document.getElementById("i").innerHTML = 23;

  