// Firebase Configuration (Replace with your own config)
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
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Check authentication state
auth.onAuthStateChanged((user) => {
  if (user) {
    loadDocuments(user.uid);
  } else {
    window.location.href = 'index.html';
  }
});

// Function to load documents for the user
async function loadDocuments(userId) {
  const documentList = document.getElementById('document-list');
  documentList.innerHTML = '<p>Loading your documents...</p>';

  try {
    // Query Firestore for documents uploaded by the user
    const querySnapshot = await db
      .collection('documents')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    if (querySnapshot.empty) {
      documentList.innerHTML = '<p>You have no uploaded documents.</p>';
    } else {
      let html = '';
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Get download URL from Firebase Storage
        storage
          .ref(data.storagePath)
          .getDownloadURL()
          .then((url) => {
            // Create a card for each document
            html += `
            <div class="p-4 bg-white shadow rounded">
              <p><strong>📄 File Name:</strong> ${data.fileName}</p>
              <p><strong>🕛 Uploaded:</strong> ${data.timestamp
                .toDate()
                .toLocaleString()}</p>
              <a href="${url}" target="_blank" class="text-blue-500 underline">Download File</a>
            </div>
          `;
            documentList.innerHTML = html;
          });
      });
    }
  } catch (error) {
    documentList.innerHTML =
      '<p>Error loading documents. Please try again later.</p>';
    console.error('Error loading documents:', error);
  }
}
