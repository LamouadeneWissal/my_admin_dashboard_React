// build-css.js
import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

async function processCss() {
  try {
    // Read the input CSS file
    const inputFile = path.resolve('./src/input.css');
    const css = fs.readFileSync(inputFile, 'utf8');
    
    // Process with PostCSS
    const result = await postcss([
      tailwindcss,
      autoprefixer
    ]).process(css, { from: inputFile, to: './public/styles.css' });
    
    // Save the result
    fs.writeFileSync('./public/styles.css', result.css);
    console.log('CSS built successfully!');
  } catch (error) {
    console.error('Error processing CSS:', error);
  }
}

processCss();
