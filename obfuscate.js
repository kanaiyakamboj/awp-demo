const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Define the directory containing your JavaScript files
const sourceDirectory = 'public/js/awp';

// Define the configuration options for obfuscation
const obfuscationOptions = {
    // Add your obfuscation options here, if needed
};

// Read and obfuscate each JavaScript file
fs.readdir(sourceDirectory, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach((file) => {
        const filePath = `${sourceDirectory}/${file}`;
        const code = fs.readFileSync(filePath, 'utf-8');
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscationOptions).getObfuscatedCode();

        // Write the obfuscated code back to the file
        fs.writeFileSync(filePath, obfuscatedCode);
        console.log(`Obfuscated: ${file}`);
    });
});