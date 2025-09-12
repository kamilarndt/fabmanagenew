const cron = require('node-cron')
const { createBackup } = require('./db')

class BackupScheduler {
    constructor() {
        this.isRunning = false
    }

    start() {
        if (this.isRunning) {
            console.log('⚠️ Backup scheduler already running')
            return
        }

        console.log('🕐 Starting backup scheduler...')

        // Backup codziennie o 2:00
        cron.schedule('0 2 * * *', async () => {
            console.log('🕐 Running daily backup...')
            try {
                await createBackup('daily')
                console.log('✅ Daily backup completed')
            } catch (error) {
                console.error('❌ Daily backup failed:', error)
            }
        })

        // Backup tygodniowo w niedzielę o 3:00
        cron.schedule('0 3 * * 0', async () => {
            console.log('🕐 Running weekly backup...')
            try {
                await createBackup('weekly')
                console.log('✅ Weekly backup completed')
            } catch (error) {
                console.error('❌ Weekly backup failed:', error)
            }
        })

        // Backup przed każdym restartem aplikacji
        process.on('SIGINT', async () => {
            console.log('🔄 Creating backup before shutdown...')
            try {
                await createBackup('manual')
                console.log('✅ Shutdown backup completed')
            } catch (error) {
                console.error('❌ Shutdown backup failed:', error)
            }
            process.exit(0)
        })

        this.isRunning = true
        console.log('✅ Backup scheduler started')
    }

    stop() {
        this.isRunning = false
        console.log('⏹️ Backup scheduler stopped')
    }
}

module.exports = { BackupScheduler }
