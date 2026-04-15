import cron from 'node-cron';
import auctionManager from '../../../managers/auctionManager.js';
import auctionService from '../../../services/auctionService.js';

const scheduledJobs = new Map();

export const initSystemJobs = async () => {
    try {
        console.log('[Cron] Initializing auction system jobs...');
        const auctions = await auctionService.getAllAuctions({ where: { auctionStatus: ['UPCOMING', 'ACTIVE'] } });

        for (const auction of auctions) {
            if (auction.auctionStatus === 'UPCOMING') {
                await scheduleAuctionStart(auction.id, auction.startTime);
                await scheduleAuctionEnd(auction.id, auction.endTime);
            } else if (auction.auctionStatus === 'ACTIVE') {
                await scheduleAuctionEnd(auction.id, auction.endTime);
            }
        }
        console.log('[Cron] Auction system jobs initialized successfully.');
    } catch (error) {
        console.error('[Cron] Failed to init system jobs:', error);
    }
};


function dateToCron(date) {
    const d = new Date(date);
    return `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
}

export const scheduleAuctionStart = async (auctionId, startTime) => {
    if (new Date(startTime) <= new Date()) {
        await auctionManager.handleTimeEvent(auctionId, 'START').catch(console.error);
        return;
    }

    const cronTime = dateToCron(startTime);
    const job = cron.schedule(cronTime, async () => {
        try {
            await auctionManager.handleTimeEvent(auctionId, 'START');
        } catch (error) {
            console.error(`Error starting auction ${auctionId}:`, error);
        } finally {
            job.stop();
            scheduledJobs.delete(`start_${auctionId}`);
        }
    });

    scheduledJobs.set(`start_${auctionId}`, job);
    console.log(`[Cron] Scheduled START for auction: ${auctionId} at ${startTime}`);
};

export const scheduleAuctionEnd = async (auctionId, endTime) => {
    if (new Date(endTime) <= new Date()) {
        await auctionManager.handleTimeEvent(auctionId, 'END').catch(console.error);
        return;
    }

    const cronTime = dateToCron(endTime);
    const job = cron.schedule(cronTime, async () => {
        try {
            await auctionManager.handleTimeEvent(auctionId, 'END');
        } catch (error) {
            console.error(`Error ending auction ${auctionId}:`, error);
        } finally {
            job.stop();
            scheduledJobs.delete(`end_${auctionId}`);
        }
    });

    scheduledJobs.set(`end_${auctionId}`, job);
    console.log(`[Cron] Scheduled END for auction: ${auctionId} at ${endTime}`);
};

