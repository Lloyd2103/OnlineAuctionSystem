export class ITransactionManager {

    async deposit(userInstance, amount) {
        throw new Error('Not implemented');
    }

    async transfer(userInstance, recipientUsername, amount) {
        throw new Error('Not implemented');
    }

    async history(userId) {
        throw new Error('Not implemented');
    }
}

