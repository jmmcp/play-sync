module.exports = {
	apps: [
		{
			name: 'Socket',
			script: 'dist/server.js',
			instances: 1,
			autorestart: true,
			watch: true,
			max_memory_restart: '1G'
		},
		{
			name: 'Static',
			script: 'dist/production-server.js',
			instances: 1,
			autorestart: true,
			watch: true,
			max_memory_restart: '1G'
		}
	]
}