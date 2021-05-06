exports = module.exports = {
    apps: [
        {
            name: 'train-workduck-api',
            script: './dist/server.js',
            merge_logs: true,
            log_type: 'json',
            max_memory_restart: '500M',
            max_restarts: '100',
            output: './logs/out.log',
            error: './logs/error.log'
        }
    ]
};
