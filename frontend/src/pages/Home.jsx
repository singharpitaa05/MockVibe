// HOME PAGE

// Landing page for unauthenticated users
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg- linear-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="shrink-0">
              <h1 className="text-xl font-bold text-primary-600">
                Mock Interview Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-primary-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Master Your Interview Skills
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Practice coding interviews, behavioral questions, and system design with our comprehensive mock interview platform
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="px-8 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 text-base font-medium text-primary-600 bg-white hover:bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Live Code Editor
              </h3>
              <p className="text-gray-600">
                Practice coding questions with our integrated editor supporting multiple languages
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Feedback
              </h3>
              <p className="text-gray-600">
                Get instant feedback on your performance with detailed scoring and insights
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor your improvement with comprehensive analytics and performance metrics
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;