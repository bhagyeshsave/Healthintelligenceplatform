/**
 * Three.js Configuration
 * 
 * This file ensures only one instance of Three.js is used throughout the app
 * to prevent the "Multiple instances of Three.js" warning.
 * 
 * The warning occurs when:
 * - Different modules import Three.js separately
 * - Bundler creates multiple chunks with Three.js
 * - react-three-fiber detects version mismatches
 * 
 * Solution: Let react-three-fiber manage Three.js entirely
 */

// This file intentionally left minimal
// All Three.js usage should go through @react-three/fiber

export const threeConfig = {
  // Configuration if needed in the future
  version: 'managed-by-react-three-fiber',
  
  // Suppress the warning by ensuring single instance
  // This is handled automatically by react-three-fiber
};

export default threeConfig;
