import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGxVO7fzAUtD_2ScEkHeEWCgC_IWqVmlU",
  authDomain: "loginreg-d83a1.firebaseapp.com",
  databaseURL: "https://loginreg-d83a1.firebaseio.com",
  projectId: "loginreg-d83a1",
  storageBucket: "",
  messagingSenderId: "652634633519",
  appId: "1:652634633519:web:7222268a002d318d"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  isInitialized() {
    return new Promise(resolve => {
      return this.auth.onAuthStateChanged(resolve);
    })
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.auth.signOut();
  }

  // Apenas registrarse, decimos que el nombre del usuario conectado es justo el del nuevo registrado.
  // register,addQuote se ejecutan juntas.
  async register(name, email, password) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.auth.currentUser.updateProfile({
      displayName: name
    });
  }

  addQuote(quote) {
    if (!this.auth.currentUser) {
      alert("Unauthorized");
    }

    return this.db.doc(`users_app/${this.auth.currentUser.uid}`).set({
      quote: quote
    });
  }

  updateQuote(quote) {
    if (!this.auth.currentUser) {
      alert("Unauthorized");
    }

    return this.db.doc(`users_app/${this.auth.currentUser.uid}`).update({
      quote: quote
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }

  async getCurrentUserQuote() {
    const quote = await this.db.doc(`users_app/${this.auth.currentUser.uid}`).get()
    return quote.get('quote');
  }
}

//Exportamos una instancia
export default new Firebase();
