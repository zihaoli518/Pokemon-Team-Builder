const fs = require('fs');
const path = require('path');

const componentDir = './components'; // Directory containing components
const outputDir = './styles'; // Directory to save CSS module files

function generateCSSModules(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      // Recursively process subdirectories
      generateCSSModules(filePath);
    } else if (file.endsWith('.jsx')) {
      // Process JavaScript files
      const componentName = path.basename(file, '.jsx');
      const cssModuleContent = `/* Styles for ${componentName} */`;

      const cssModuleFileName = `${componentName}.module.scss`;
      const cssModuleFilePath = path.join(outputDir, cssModuleFileName);

      fs.writeFileSync(cssModuleFilePath, cssModuleContent);
      console.log(`Created ${cssModuleFileName}`);
    }
  });
}

// Start generating CSS modules from the component directory
generateCSSModules(componentDir);