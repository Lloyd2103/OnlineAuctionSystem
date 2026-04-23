import sequelize from '../../libs/db.js';

export class BasePaymentProcessor {
    /**
     * Template Method chính điều phối quy trình giao dịch
     */
    async execute(params) {
        const t = await sequelize.transaction();
        // Context sẽ được truyền qua tất cả các bước để chia sẻ dữ liệu
        const context = { 
            params, 
            transaction: t,
            data: {}, // Nơi chứa user, auction, v.v. sau khi validate
            result: {} // Kết quả cuối cùng trả về cho client
        };

        try {
            // 1. Kiểm tra điều kiện (Validate)
            await this.validate(context);

            // 2. Thực hiện thanh toán/trừ tiền (Strategy)
            await this.performPayment(context);

            // 3. Xử lý logic hậu thanh toán (Ví dụ: cập nhật trạng thái đấu giá)
            await this.postProcess(context);

            // 4. Ghi lại lịch sử giao dịch
            await this.recordLogs(context);

            await t.commit();
            return { success: true, ...context.result };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // Các móc nối (Hooks) mặc định
    async validate(context) { throw new Error("Method 'validate' must be implemented."); }
    async performPayment(context) { throw new Error("Method 'performPayment' must be implemented."); }
    async postProcess(context) { return; }
    async recordLogs(context) { throw new Error("Method 'recordLogs' must be implemented."); }
}