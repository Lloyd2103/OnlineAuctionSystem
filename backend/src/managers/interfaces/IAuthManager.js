export class IAuthManager {
    async signUp(data) {
        throw new Error('Not implemented');
    }

    async signIn(data) {
        throw new Error('Not implemented');
    }

    async signOut(refreshToken) {
        throw new Error('Not implemented');
    }

    async refreshToken(token) {
        throw new Error('Not implemented');
    }
}