class FakePaymentService {
    async processPayment(amount, method, details = {}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.05) {
                    resolve({
                        success: true,
                        transactionId: `TXFAKE${Date.now()}`,
                        message: 'Thanh toán thành công'
                    });
                } else {
                    reject(new Error('Thanh toán bị từ chối bởi ngân hàng/ví điện tử'));
                }
            }, 10);
        });
    }

    async processRefund(amount, method, details = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `RFFAKE${Date.now()}`,
                    message: 'Hoàn tiền thành công'
                });
            }, 10);
        });
    }
}

export default new FakePaymentService();
