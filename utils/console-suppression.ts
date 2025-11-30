// Suppress harmless Three.js warnings that occur when using @react-three/fiber and @react-three/drei
// This file must be imported before any other imports in the app

const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

console.warn = function(...args: any[]) {
  const message = String(args[0] || '');
  
  // Suppress Three.js duplicate instance warnings
  if (
    message.includes('Multiple instances of Three.js') ||
    message.includes('THREE.') ||
    message.includes('three.js') ||
    message.includes('WebGLRenderer')
  ) {
    return;
  }
  
  originalWarn.apply(console, args);
};

console.error = function(...args: any[]) {
  const message = String(args[0] || '');
  
  // Suppress Three.js related errors
  if (
    message.includes('Multiple instances of Three.js') ||
    message.includes('THREE.') ||
    message.includes('three.js')
  ) {
    return;
  }
  
  originalError.apply(console, args);
};

console.log = function(...args: any[]) {
  const message = String(args[0] || '');
  
  // Suppress Three.js warnings that might come through console.log
  if (
    message.includes('WARNING: Multiple instances') ||
    message.includes('THREE.')
  ) {
    return;
  }
  
  originalLog.apply(console, args);
};

export {};
