import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const dbCollection = collection(db, "todos");

// Get data from the "todos" collection
export const getData = async () => {
  try {
    const querySnapshot = await getDocs(dbCollection);
    const tasksList = [];
    querySnapshot.forEach((doc) => {
      tasksList.push({
        id: doc.id,
        task: doc.data().task,
        status: doc.data().status,
      });
    }); 
    return tasksList;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Add a document to the "todos" collection
export const addData = async (taskDescription, taskDone) => {
  try {
    const docRef = await addDoc(dbCollection, {
      task: taskDescription,
      status: taskDone,
    });
    console.log("Document successfully added!");
    return docRef.id; // Return the ID of the added document
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Update a document in the "todos" collection
export const updateData = async (documentId, task, status) => {
  try {
    const docRef = doc(db, "todos", documentId);
    await updateDoc(docRef, {
      status: status,
      task: task
    });
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document from the "todos" collection
export const deleteData = async (documentId) => {
  try {
    const docRef = doc(db, "todos", documentId);
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
