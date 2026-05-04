export const setResponseHeaders = (response) => {
    response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.set('Pragma', 'no-cache');
    response.set('X-Content-Type-Options', 'nosniff');
};
