import bcrypt from 'bcryptjs';

async function hashPassword() {
    const password = 'TestPassword123!';
    const hashed = await bcrypt.hash(password, 12);
    console.log('Hashed password:', hashed);
    console.log('Use this password to sign in:', password);
}

hashPassword();