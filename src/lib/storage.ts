import { collection, addDoc, doc, setDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import { UserStory, UserAssessment, CareerResult } from './types';

export const saveStory = async (content: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be logged in');

    const storyData = {
      content,
      updatedAt: new Date().toISOString()
    };

    const storyRef = doc(db, 'users', user.uid, 'story', 'current');
    await setDoc(storyRef, storyData);
    return storyData;
  } catch (error) {
    console.error('Error saving story:', error);
    throw error;
  }
};

export const saveAssessment = async (assessment: UserAssessment) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be logged in');

    const assessmentRef = doc(db, 'users', user.uid, 'assessment', 'current');
    await setDoc(assessmentRef, assessment);
    return assessment;
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
};

export const saveUserResult = async (
  story: UserStory,
  assessment: UserAssessment,
  recommendation: CareerResult['recommendation']
) => {
  try {
    // Always save to localStorage first
    const result = {
      id: new Date().getTime().toString(),
      userId: auth.currentUser?.uid || 'anonymous',
      timestamp: new Date().toISOString(),
      story,
      assessment,
      recommendation
    };

    localStorage.setItem('latestResult', JSON.stringify(result));
    localStorage.setItem('lastUpdated', new Date().toISOString());

    // If user is logged in, also save to Firestore
    const user = auth.currentUser;
    if (user) {
      const resultsRef = collection(db, 'users', user.uid, 'results');
      const docRef = await addDoc(resultsRef, result);
      result.id = docRef.id;
    }

    return result;
  } catch (error) {
    console.error('Error saving result:', error);
    throw error;
  }
};

export const getUserResults = async (): Promise<CareerResult[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be logged in');

    const resultsRef = collection(db, 'users', user.uid, 'results');
    const q = query(
      resultsRef,
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const firestoreResults = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CareerResult));
    
    // Check for latest result in localStorage
    const latestResult = localStorage.getItem('latestResult');
    
    let results = [...firestoreResults];
    
    if (latestResult) {
      const parsedLatestResult = JSON.parse(latestResult) as CareerResult;
      // Only add if not already in Firestore results
      if (!results.some(r => r.id === parsedLatestResult.id)) {
        results.unshift(parsedLatestResult);
      }
    }
    
    console.log('Fetched results:', results);
    return results;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};