import React from 'react';
import TopHeader from '../components/TopHeader.jsx';
import ChatbotWidget from '../components/Chatbox.jsx';
import MainHeader from '../components/MainHeader.jsx';
import HeroSection from '../components/HeroSection.jsx';
import Services from '../components/Services.jsx';
import DiagnosticSection from '../components/DiagnosticSection.jsx';
import DoctorsSection from '../components/DoctorsSection.jsx';
import NewsSection from '../components/NewsSection.jsx';
import PatientSection from '../components/testimonials.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import ContactInfo from '../components/ContactInfo.jsx';
import LocationAndFooter from '../components/LocationAndFooter.jsx';
import MessengerButton from '../components/MessengerChat.jsx';
import FadeInSection from '../components/AnimateSection.jsx';
import "../app/styles/globals.css";
import "../app/styles/responsive.css";
export default function Home() {
  return (
    <>
      <FadeInSection className="slide-down">
      <TopHeader />
      </FadeInSection>

      <MainHeader />

      <FadeInSection className="slide-up">
      <HeroSection />
      </FadeInSection>

      <FadeInSection className="slide-up">
      <Services />
      </FadeInSection>

      <DiagnosticSection />
      <DoctorsSection />
      <NewsSection/>
      <PatientSection />
      <FaqAccordion />

      <FadeInSection className="slide-up">
      <ContactInfo />
      </FadeInSection>

      <LocationAndFooter/>

      <MessengerButton />
      <ChatbotWidget />
    </>
  );
}
