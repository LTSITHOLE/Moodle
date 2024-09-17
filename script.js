// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: 'AIzaSyDH2wh6lAeVfr7BVkA6HB1J4Ll_sOaxS7w',
  authDomain: 'unisa-helper.firebaseapp.com',
  projectId: 'unisa-helper',
  storageBucket: 'unisa-helper.appspot.com',
  messagingSenderId: '689781651847',
  appId: '1:689781651847:web:a61d4a9f1946329b51fb22',
  measurementId: 'G-VBKX3M6YWY',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email.length === 0 || password.length === 0) {
    alert(
      'Empty Field. Please fill all the fields before trying to sign up or login.'
    );
    return;
  }
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      alert('Error signing up: ' + error.message);
    });
}

function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email.length === 0 || password.length === 0) {
    alert(
      'Empty Field:  Please fill all the fields before trying to sign up or login.'
    );
    return;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      alert('Error signing in: ' + error.message);
    });
}

// Check authentication state
auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.href = 'dashboard.html';
  }
});
