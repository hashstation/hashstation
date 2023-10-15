/*
   * Author : see AUTHORS
   * Licence: MIT, see LICENSE
*/

window.serverAddress = "http://localhost:5000"
window.projectName = "Hashstation" // Set the name to show in titlebars etc.

window.optimizedKernelsOnly = false // Set to true to disable unoptimized kernels (safer, but slower)
window.docsLink = "https://nesfit.github.io/hashstation" // link to docs for help button

// Set up color schemes for light and dark appearances
window.theme = {
  light: {
    primary: '#1976D2',    // Blue
    secondary: '#4CAF50',  // Green
    accent: '#FF5722',     // Deep Orange
    error: '#F44336',      // Red
    info: '#9C27B0',       // Purple
    success: '#8BC34A',    // Light Green
    warning: '#FFC107'     // Amber
  },
  dark: {
    primary: '#1565C0',    // Dark Blue
    secondary: '#2E7D32',  // Dark Green
    accent: '#E64A19',     // Dark Deep Orange
    error: '#C62828',      // Dark Red
    info: '#6A1B9A',       // Dark Purple
    success: '#7CB342',    // Dark Light Green
    warning: '#FFAB00'     // Dark Amber
  }
}
