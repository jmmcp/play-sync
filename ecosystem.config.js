module.exports = {
	apps: [
		{
			name: 'Socket',
			script: 'server.js',
			instances: 1,
			autorestart: true,
			watch: true,
			max_memory_restart: '1G'
		},
		{
			name: 'Static',
			script: 'production-server.js',
			instances: 1,
			autorestart: true,
			watch: true,
			max_memory_restart: '1G'
		}
	]
}