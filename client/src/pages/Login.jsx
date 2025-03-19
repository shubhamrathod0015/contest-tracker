import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as THREE from 'three';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const animationRef = useRef(null);

  const { email, password } = formData;

  useEffect(() => {
    const currentMount = mountRef.current;
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);
  
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
  
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
  
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
    // Material (Updated to react to darkMode)
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.020,
      color: darkMode ? 0xffffff : 0x6366f1, // White in dark mode, Blue in light mode
      transparent: true,
      opacity: 0.8
    });
  
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
  
    camera.position.z = 3;
  
    // Animation
    const animate = () => {
      particlesMesh.rotation.x += 0.0020;
      particlesMesh.rotation.y += 0.0020;
  
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
  
    animate();
  
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      currentMount.removeChild(renderer.domElement);
    };
  }, [darkMode]); // Include darkMode in dependencies
  

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async e => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    const result = await login(email, password);
    
    if (result.success) {
      // Add delay for cookie propagation
      setTimeout(() => navigate('/'), 500);
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div ref={mountRef} className="absolute inset-0 overflow-hidden" />
      
      <div className={`max-w-md w-full space-y-8 relative ${darkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white bg-opacity-80'} backdrop-blur-sm p-8 rounded-xl shadow-xl`}>
        <div className="absolute top-4 right-4">
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Sign in to your account
          </h2>
          <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Or{' '}
            <Link to="/signup" className="font-medium text-indigo-500 hover:text-indigo-400">
              create a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${darkMode ? 'border-gray-700 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 mt-2 py-2 border ${darkMode ? 'border-gray-700 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;