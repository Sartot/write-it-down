/**
 * Determina l'URL base dell'applicazione in base all'ambiente
 * @returns {string} L'URL base corretto per l'ambiente corrente
 */
export function getBaseUrl() {
    // Se siamo su Vercel, usa l'URL fornito da Vercel
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    
    // Se abbiamo BETTER_AUTH_URL definito, usalo
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    
    // Fallback per sviluppo locale
    return process.env.BASE_URL || 'http://localhost:3000';
}

/**
 * Verifica se siamo in ambiente di produzione
 * @returns {boolean}
 */
export function isProduction() {
    return process.env.NODE_ENV === 'production';
}

/**
 * Verifica se siamo su Vercel
 * @returns {boolean}
 */
export function isVercel() {
    return !!process.env.VERCEL_URL;
}
