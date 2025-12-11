// LANDING PAGE COMPONENT

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AIInterviewIllustration from '../components/AIInterviewIllustration';
import FloatingStatsBadges from '../components/FloatingStatsBadges';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Prevent the main document from scrolling while this page is mounted
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  return (
    <div className="landing-wrapper text-gray-900 grid-background">
      {/* Navbar (pill-shaped, centered, larger elements) */}
      <nav className="sticky top-6 z-50 bg-white/90 backdrop-blur-xl border border-blue-100 shadow-xl overflow-hidden rounded-full mx-6 md:mx-12 py-2 px-3">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center gap-3 md:gap-4">
              <img src="/logo.png" alt="MockVibe Logo" className="w-12 h-12 rounded-2xl" />
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MockVibe
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-semibold text-lg md:text-xl transition duration-200">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-semibold text-lg md:text-xl transition duration-200">
                How It Works
              </a>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition duration-200 transform hover:scale-105 text-lg md:text-xl"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-7 py-3 text-blue-600 hover:text-indigo-600 font-semibold text-lg md:text-xl transition duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition duration-200 transform hover:scale-105 text-lg md:text-xl"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg text-sm md:text-base"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg text-sm md:text-base"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-blue-700">Powered by Advanced AI</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-6xl font-black tracking-tight">
              Master Your Interviews with
              <span className="block bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mt-2">
                AI-Powered Mock Practice
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Practice coding, behavioral, and system design interviews with our intelligent AI interviewer. Get real-time feedback, improve your skills, and land your dream job with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-blue-300 transition duration-300 transform hover:scale-105"
              >
                Get Started Free →
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl border-2 border-blue-200 hover:border-blue-600 hover:shadow-lg transition duration-300 transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
            <p className="text-sm text-gray-500">No credit card required. Start practicing today.</p>
          </div>

          {/* Right Column - Illustration (now horizontal rectangle) */}
          <div className="hidden lg:flex items-center justify-center relative w-full h-full">
            <div className="relative w-full max-w-4xl h-80 md:h-96 lg:h-96 xl:h-96">
              <AIInterviewIllustration />
              <FloatingStatsBadges />
            </div>
          </div>
        </div>
      </div>
    {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MockVibe?</span>
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to prepare for technical interviews and land your dream job
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: '🎯', title: 'AI-Powered Interviews', desc: 'Experience realistic interviews with adaptive AI that adjusts questions based on your responses.' },
            { icon: '💻', title: 'Integrated Code Editor', desc: 'Solve coding problems with our built-in editor supporting multiple languages and real-time execution.' },
            { icon: '📊', title: 'Detailed Analytics', desc: 'Track your progress with comprehensive feedback and performance insights after each interview.' },
            { icon: '🎤', title: 'Multiple Modes', desc: 'Choose from text, voice, or video interview modes to match your preparation style.' },
            { icon: '📚', title: 'Extensive Question Bank', desc: 'Access thousands of coding, behavioral, and system design questions across all difficulty levels.' },
            { icon: '⚡', title: 'Instant Feedback', desc: 'Get immediate, constructive feedback on your answers with suggestions for improvement.' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white/50 backdrop-blur border border-blue-100 p-8 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-100"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-125 transition duration-300">{feature.icon}</div>
              <h4 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-linear-to-b from-blue-50/50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Works</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and begin your interview preparation journey
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 md:gap-4">
            {[
              { num: '1', title: 'Sign Up', desc: 'Create your account and set up your profile with skills and goals.' },
              { num: '2', title: 'Customize', desc: 'Choose interview type, difficulty, and mode that matches your needs.' },
              { num: '3', title: 'Practice', desc: 'Take mock interviews with AI that adapts to your skill level.' },
              { num: '4', title: 'Improve', desc: 'Review feedback and analytics to track your progress and improve.' },
            ].map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-300 transition duration-300 transform group-hover:scale-110">
                  {step.num}
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                    <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Custom Gradient Bar */}
      <footer className="w-full bg-linear-to-r from-[#0B1120] to-[#172554] shadow-[0_-6px_24px_-8px_rgba(11,17,32,0.45)] border-t-0 py-7 px-0 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Branding Text */}
          <div className="w-full md:w-auto text-left">
            <p className="text-gray-200 font-semibold text-base md:text-lg mb-2 md:mb-0">
              Designed & Developed by the Arpita Singh <span className="text-blue-400">💙</span>
            </p>
            <p className="text-gray-400 text-xs md:text-sm">&copy; 2025 MockVibe. All rights reserved.</p>
          </div>
          {/* Right: Social Icons */}
          <div className="flex flex-row items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-start md:justify-end">
            {/* GitHub Icon */}
            <a
              href="https://github.com/singharpitaa05"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 4.302 2.792 7.953 6.653 9.24.486.09.664-.211.664-.47 0-.232-.009-.846-.013-1.66-2.706.588-3.276-1.305-3.276-1.305-.442-1.123-1.08-1.422-1.08-1.422-.883-.604.067-.592.067-.592  .976.069 1.49 1.003 1.49 1.003.867 1.486 2.275 1.057 2.832.809.088-.628.34-1.057.618-1.3-2.162-.246-4.437-1.081-4.437-4.814 0-1.063.38-1.933 1.003-2.615-.101-.247-.435-1.24.096-2.586 0 0 .816-.262 2.675 1.001A9.35 9.35 0 0 1 12 6.844c.827.004 1.66.112 2.438.328 1.858-1.263 2.673-1.001 2.673-1.001.533 1.346.199 2.339.098 2.586.625.682 1.002 1.552 1.002 2.615 0 3.742-2.278 4.565-4.447 4.808.35.302.66.899.66 1.814 0 1.31-.012 2.367-.012 2.69 0 .261.176.563.67.468C18.96 19.95 21.75 16.3 21.75 12c0-5.385-4.365-9.75-9.75-9.75z" />
              </svg>
            </a>
            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/in/arpita-singh-569202296/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25A3.75 3.75 0 0 1 20.25 12v3.75A3.75 3.75 0 0 1 16.5 19.5h-9A3.75 3.75 0 0 1 3.75 15.75V12A3.75 3.75 0 0 1 7.5 8.25h9zm-7.125 7.125v-4.5m3 4.5v-2.25m3 2.25v-3.375m-6.375-2.25a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;