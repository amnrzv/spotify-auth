/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [ { hostname: 'platform-lookaside.fbsbx.com' } ]
	}
};

module.exports = nextConfig;
