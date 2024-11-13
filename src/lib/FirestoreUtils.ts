import { collection, doc, getDoc, getDocs, query, where, orderBy, DocumentData } from 'firebase/firestore';
import { db, auth } from './firebase';
import { CareerResult, UserStory, UserAssessment } from './types';

export class FirestoreUtils {
  static async getUserDocument() {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be logged in');
    return doc(db, 'users', user.uid);
  }

  static async getStory(): Promise<UserStory | null> {
    try {
      const userDoc = await this.getUserDocument();
      const storyDoc = await getDoc(doc(userDoc, 'story', 'current'));
      return storyDoc.exists() ? storyDoc.data() as UserStory : null;
    } catch (error) {
      console.error('Error fetching story:', error);
      return null;
    }
  }

  static async getAssessment(): Promise<UserAssessment | null> {
    try {
      const userDoc = await this.getUserDocument();
      const assessmentDoc = await getDoc(doc(userDoc, 'assessment', 'current'));
      return assessmentDoc.exists() ? assessmentDoc.data() as UserAssessment : null;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      return null;
    }
  }

  static async getResults(): Promise<CareerResult[]> {
    try {
      const userDoc = await this.getUserDocument();
      const resultsRef = collection(userDoc, 'results');
      const q = query(resultsRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CareerResult));
    } catch (error) {
      console.error('Error fetching results:', error);
      return [];
    }
  }

  static async getCurrentResult(): Promise<CareerResult | null> {
    try {
      const results = await this.getResults();
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error fetching current result:', error);
      return null;
    }
  }
}