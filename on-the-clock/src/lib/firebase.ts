import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBxGz7oVzfdm5hQIk5n4AoPAoi3u7kfRKs',
  authDomain: 'on-the-clock-production.firebaseapp.com',
  projectId: 'on-the-clock-production',
  storageBucket: 'on-the-clock-production.firebasestorage.app',
  messagingSenderId: '138828683769',
  appId: '1:138828683769:web:c077b2dd22fcfca4980528'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
