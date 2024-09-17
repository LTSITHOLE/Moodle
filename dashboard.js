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

// Check authentication state and load user data
auth.onAuthStateChanged((user) => {
  if (user) {
    loadPreviousRequests(user.uid);
  } else {
    window.location.href = 'index.html';
  }
});

// Handle sign-out
function signOut() {
  auth
    .signOut()
    .then(() => {
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
}

// Form submission listener for new help requests
document
  .getElementById('help-request-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    submitRequest(auth.currentUser.uid);
  });

async function submitRequest(userId) {
  const fullName = document.getElementById('fullName').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const modules = document.getElementById('modules').value.trim().split('\n');

  // Validate input fields
  if (!fullName || !whatsapp || modules.length === 0) {
    alert('Please fill in all the fields before submitting.');
    return;
  }

  // Submit request to Firestore
  try {
    await db.collection('helpRequests').add({
      userId,
      fullName,
      whatsapp,
      modules,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert('Help request submitted successfully!');
    document.getElementById('help-request-form').reset();
    loadPreviousRequests(userId); // Reload requests after submission
  } catch (error) {
    alert('Error submitting request: ' + error.message);
  }
}

// Load previous requests from Firestore and display them
function loadPreviousRequests(userId) {
  const previousRequestsContainer =
    document.getElementById('previous-requests');
  previousRequestsContainer.innerHTML =
    '<p>Loading your previous requests...</p>';

  db.collection('helpRequests')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .get()
    .then((querySnapshot) => {
      previousRequestsContainer.innerHTML = ''; // Clear loading message

      if (querySnapshot.empty) {
        previousRequestsContainer.innerHTML =
          '<p>No previous requests found.</p>';
      } else {
        let table = `
        `;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const requestId = doc.id;

          // Add each request as a row in the table
          table += `
          <div class="bg-white p-4 border border-gray-300 rounded-lg shadow-sm mb-3">
           
            <div class="text-gray-700 text-2xl mb-3"><strong>💡Modules</strong></div>

            <div class="text-gray-700 mb-2 p-3">${data.modules.join(
              '<hr class="mt-2 mb-2"/> '
            )}</div>

            <div class="text-gray-600 mb-2 mt-3"><strong>⏰Submitted:</strong> ${data.timestamp
              .toDate()
              .toLocaleString()}</div>
            <div class="flex  w-full gap-3 mt-4 p-3 ">
              <button class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onclick="cancelRequest('${requestId}')">🗑️Cancel</button>
            </div>
          </div>
          `;
        });

        table += '</tbody></table>';
        previousRequestsContainer.innerHTML = table;
      }
    })
    .catch((error) => {
      console.error('Error loading previous requests:', error);
      previousRequestsContainer.innerHTML =
        '<p>Error loading requests. Please try again later.</p>';
    });
}

// Cancel a request
function cancelRequest(requestId) {
  if (confirm('Are you sure you want to cancel this request?')) {
    db.collection('helpRequests')
      .doc(requestId)
      .delete()
      .then(() => {
        alert('Request cancelled successfully.');
        loadPreviousRequests(auth.currentUser.uid); // Reload requests after deletion
      })
      .catch((error) => {
        console.error('Error cancelling request:', error);
        alert('Error cancelling request: ' + error.message);
      });
  }
}
