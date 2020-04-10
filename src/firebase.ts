import { initializeApp } from "firebase";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyCa8BVIK25GCZEQjz1RK8xHH0CxMOjOe3k",
  authDomain: "online-card-table.firebaseapp.com",
  databaseURL: "https://online-card-table.firebaseio.com",
  projectId: "online-card-table",
  storageBucket: "online-card-table.appspot.com",
  messagingSenderId: "1016093045045",
  appId: "1:1016093045045:web:f292b9c8e33b79c663dc7c",
  measurementId: "G-0GVZ5MG99N"
});

export const db = firebaseApp.database();
export const roomRef = db.ref().child("room1");
export const seatsRef = roomRef.child("seats");
export const cardsRef = roomRef.child("cards");
