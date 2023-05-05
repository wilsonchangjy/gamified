// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getDatabase, onChildAdded,ref, set, get, push } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUj7gdvMD6XtFO9wfJvsfE8JleKszJ9Mw",
  authDomain: "gamifiedfun.firebaseapp.com",
  databaseURL: "https://gamifiedfun-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "gamifiedfun",
  storageBucket: "gamifiedfun.appspot.com",
  messagingSenderId: "34633044677",
  appId: "1:34633044677:web:a73a695b638f426a4496ac",
  measurementId: "G-0R4RWVS995"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log("Session is signed in anonymously");
  }
  else {
    console.log("Session has not been signed in...");

    signInAnonymously(auth).then(() => {
      console.log("Signed in anonymously");
      console.log("refreshing...");
      location.reload();
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode, errorMessage);
    });
  }
});

// Data Handlers
export function writeProjectData(name, description, tags, goal, player, motivations) {
  const reference = ref(database, "gallery/");

  push(reference, {
    projectName: name,
    projectDescription: description,
    projectTags: tags,
    projectGoal: goal,
    playerType: player,
    playerMotivations: motivations
  });

  onChildAdded(reference, (data) => {
    console.log("form submitted!");
    localStorage.view = data.key;
    writeClientView(data.key);

    window.location = "breakdown.html";
  });
}

export async function readProjectData(projectID) {

  const reference = ref(database, "gallery/" + projectID);

  var snapshot = await get(reference);
  var data = snapshot.val();

  if (data == null) {
    const projectKey = ref(database, "client/view");
    const newSnapshot = await get(projectKey);
    const newKey = newSnapshot.val();
    const newReference = ref(database, "gallery/" + newKey);

    snapshot = await get(newReference);
    data = snapshot.val();
  }

  return data;
}

export async function getAPIKey() {
  const reference = ref(database, "ChatGPT APIKey");

  const snapshot = await get(reference);
  var data = snapshot.val();
  return data;
}

export async function getReference() {
  const reference = ref(database, "client/view");
  const viewKey = localStorage.view;

  if (viewKey == null) {
    console.log("localStoage is empty, fetching key from Firebase...");
    const snapshot = await get(reference);
    viewKey = snapshot.val();
  }

  return viewKey;
}

export async function getMotivations() {
  const reference = ref(database, "elements");

  const snapshot = await get(reference);
  var data = snapshot.val();
  return data;
}

export async function getGallery() {
  const reference = ref(database, "gallery");

  const snapshot = await get(reference);
  var data = snapshot.val();
  return data;
}

export function writeAffinityData(elementID, motivation, value) {
  const reference = ref(database, "elements/" + elementID + "/" + motivation);

  set(reference, value);
}

function writeClientView(key) {
  const reference = ref(database, "client/view");

  set(reference, key);

  console.log("written" + key);
}