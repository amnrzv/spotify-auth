'use client';
/* eslint-disable camelcase */
import styles from './page.module.css';
import { useSearchParams, useRouter } from 'next/navigation';

function generateRandomString( length: number ) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for ( let i = 0; i < length; i++ ) {
		text += possible.charAt( Math.floor( Math.random() * possible.length ) );
	}
	return text;
}

async function generateCodeChallenge( codeVerifier: string ) {
	function base64encode( digest: ArrayBuffer ) {
		return btoa( String.fromCharCode.apply( null, new Uint8Array( digest ) ) )
			.replace( /\+/g, '-' )
			.replace( /\//g, '_' )
			.replace( /[=]+$/, '' );
	}

	const encoder = new TextEncoder();
	const data = encoder.encode( codeVerifier );
	const digest = await window.crypto.subtle.digest( 'SHA-256', data );

	return base64encode( digest );
}

const Home = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const onLogin = () => {
		const redirectUri = 'http://localhost:3000';

		const codeVerifier = generateRandomString( 128 );

		generateCodeChallenge( codeVerifier ).then( codeChallenge => {
			const state = generateRandomString( 16 );
			const scope = 'user-read-private user-read-email';

			localStorage.setItem( 'code_verifier', codeVerifier );

			const args = new URLSearchParams( {
				response_type: 'code',
				client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
				scope,
				redirect_uri: redirectUri,
				state,
				code_challenge_method: 'S256',
				code_challenge: codeChallenge
			} );

			router.push( `https://accounts.spotify.com/authorize?${args}` );
		} );
	};

	if ( searchParams.get( 'code' ) ) {
		router.push( `/access-token?code=${searchParams.get( 'code' )}` );
	}

	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<button className={styles.loginBtn} onClick={onLogin}>
					Login
				</button>
			</main>
		</div>
	);
};

export default Home;
