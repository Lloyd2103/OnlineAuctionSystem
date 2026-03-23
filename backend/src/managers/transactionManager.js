import { ITransactionManager } from '../interfaces/ITransactionManager.js';
import transactionService from '../services/transactionService.js';

class TransactionManager extends ITransactionManager {
	async deposit(userInstance, amount) {
		return await transactionService.deposit(userInstance, amount);
	}

	async transfer(userInstance, recipientUsername, amount) {
		return await transactionService.transfer(userInstance, recipientUsername, amount);
	}

	async history(userId) {
		return await transactionService.getHistory(userId);
	}
}

export default new TransactionManager();
