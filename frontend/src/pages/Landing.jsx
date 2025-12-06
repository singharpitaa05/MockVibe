// LANDING PAGE COMPONENT

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MockVibe
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">
                How It Works
              </a>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-200 transition duration-200 transform hover:scale-105"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 text-blue-600 hover:text-indigo-600 font-semibold transition duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-200 transition duration-200 transform hover:scale-105"
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
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg text-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg text-sm"
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
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-blue-700">Powered by Advanced AI</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
            Master Your Interviews with
            <span className="block bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mt-2">
              AI-Powered Mock Practice
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Practice coding, behavioral, and system design interviews with our intelligent AI interviewer. Get real-time feedback, improve your skills, and land your dream job with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
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

        {/* Decorative Elements */}
        <div className="mt-24 relative">
          <div className="absolute -top-40 -right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur rounded-2xl border border-blue-100/50 p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">1000+</div>
                <p className="text-gray-600 font-medium mt-2">Interview Questions</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">50K+</div>
                <p className="text-gray-600 font-medium mt-2">Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">95%</div>
                <p className="text-gray-600 font-medium mt-2">Success Rate</p>
              </div>
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

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-blue-700 p-12 md:p-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative text-center space-y-8">
            <h3 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your Interview Skills?
            </h3>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join thousands of candidates who have successfully landed their dream jobs by practicing with MockVibe
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="inline-block px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="inline-block px-8 py-4 bg-blue-700/50 text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:border-white hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              >
                Already a Member?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-linear-to-b from-transparent to-gray-50 border-t border-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="font-bold text-lg text-gray-900">MockVibe</span>
              </div>
              <p className="text-gray-600">AI-powered interview preparation platform</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Product</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#features" className="hover:text-blue-600 transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-600 transition">How it works</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Company</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">About</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-100 pt-8 text-center">
            <p className="text-gray-600">&copy; 2024 MockVibe. All rights reserved. | Built with passion for your success.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;