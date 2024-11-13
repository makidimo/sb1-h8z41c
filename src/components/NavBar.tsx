import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Logo } from './Logo';
import { SignInModal } from './SignInModal';
import toast from 'react-hot-toast';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const [isTransparent, setIsTransparent] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const handleScroll = () => {
      setIsTransparent(window.scrollY < 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isTransparent ? 'bg-white/50' : 'bg-white/70'
    } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/">
            <Logo />
          </Link>
          <div className="hidden sm:flex items-center space-x-8">
            <button className="text-gray-600 hover:text-gray-900 transition-all hover:scale-105 font-medium">About</button>
            <button className="text-gray-600 hover:text-gray-900 transition-all hover:scale-105 font-medium">Features</button>
            <button className="text-gray-600 hover:text-gray-900 transition-all hover:scale-105 font-medium">Contact</button>
          </div>
          <div className="flex space-x-4">
            {user && (
              <Link
                to="/profile"
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105"
              >
                Profile
              </Link>
            )}
            {!user && (
              <button
                onClick={() => setShowSignInModal(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
      <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
    </nav>
  );
};