#!/usr/bin/env node

const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔐 Bookmark Bunker - Password Change Utility');
console.log('=============================================');
console.log('');

rl.question('Enter your new password: ', (password) => {
    if (!password || password.length < 6) {
        console.log('❌ Password must be at least 6 characters long');
        rl.close();
        return;
    }

    const hash = bcrypt.hashSync(password, 10);
    
    console.log('');
    console.log('✅ Password hash generated successfully!');
    console.log('');
    console.log('📝 Copy this hash and replace the PASSWORD_HASH constant in server.js:');
    console.log('');
    console.log(`const PASSWORD_HASH = '${hash}';`);
    console.log('');
    console.log('🔄 Don\'t forget to restart your server after making the change!');
    console.log('');
    
    rl.close();
});

rl.on('close', () => {
    console.log('👋 Done! Your password has been secured.');
}); 