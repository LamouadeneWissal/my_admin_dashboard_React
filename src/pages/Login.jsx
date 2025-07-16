import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../redux/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, error } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        dispatch(clearError());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-lg bg-opacity-90">
        <div>
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary-100 p-3 flex items-center justify-center shadow-md">
              <img className="h-18 w-18 object-contain" src="/src/assets/logo.png" alt="Logo" />
            </div>
          </div>
          <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="relative">
              <label htmlFor="email-address" className="absolute -top-2 left-3 inline-block bg-white px-1 text-xs font-medium text-primary-600">
                Email address
              </label>
              <div className="group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3.5 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm transition-all"
                  placeholder="admin@wingy.ma"
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="absolute -top-2 left-3 inline-block bg-white px-1 text-xs font-medium text-primary-600">
                Password
              </label>
              <div className="group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3.5 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3.5 text-sm font-medium text-white hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-primary-300 group-hover:text-primary-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 bg-primary-50 rounded-lg p-2 border border-primary-100">
              <span className="text-xs text-primary-600 font-medium">Demo credentials:</span>
              <div className="flex space-x-1 items-center">
                <code className="rounded bg-white px-2 py-1 text-xs font-mono text-primary-700 shadow-sm border border-primary-100">admin@wingy.ma</code>
                <span className="text-primary-400">/</span>
                <code className="rounded bg-white px-2 py-1 text-xs font-mono text-primary-700 shadow-sm border border-primary-100">admin123</code>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white border-l-4 border-red-500 p-4 shadow-xl rounded-lg animate-slideDown z-50">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 h-[30vh] w-[30vh] bg-primary-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 -z-10 h-[40vh] w-[40vh] bg-blue-100 rounded-full blur-3xl opacity-30"></div>
    </div>
  );
};

export default Login;
