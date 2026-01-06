import fs from 'fs/promises';
import path from 'path';

const TOKEN_PATH = path.resolve('./tokens.json');

export const saveTokens = async (tokens) => {
    const data = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user_id: tokens.user_id,
        expires_at: Date.now() + (tokens.expires_in * 1000) - (60 * 1000) // Restamos 1 min de margen
    };
    await fs.writeFile(TOKEN_PATH, JSON.stringify(data, null, 2));
    console.log('💾 Tokens guardados en tokens.json');
    return data;
};

export const getTokens = async () => {
    try {
        const data = await fs.readFile(TOKEN_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return null; // El archivo no existe aún
    }
};