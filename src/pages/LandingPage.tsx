import React from 'react';
import { Hero } from '../components/Hero';
import { WhyEvolvyng } from '../components/WhyEvolvyng';
import { FAQ } from '../components/FAQ';

export const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <WhyEvolvyng />
      <FAQ />
    </>
  );
};