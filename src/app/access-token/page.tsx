/* eslint-disable camelcase */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const AccessToken = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get( 'code' ) as string;

	useEffect( () => {
		const codeVerifier = localStorage.getItem( 'code_verifier' ) as string;

		const body = new URLSearchParams( {
			grant_type: 'authorization_code',
			code,
			redirect_uri: 'http://localhost:3000',
			client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
			code_verifier: codeVerifier
		} );

		const fetchToken = async () => {
			try {
				const response = await fetch( 'https://accounts.spotify.com/api/token', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body
				} );
				if ( !response.ok ) {
					throw new Error( 'HTTP status ' + response.status );
				}
				const data = await response.json();
				localStorage.setItem( 'access_token', data.access_token );

				router.push( '/account' );
			}
			catch ( error ) {
				console.error( 'Error:', error );
			}
		};

		fetchToken();
	}, [ code, router ] );

	return <span>loading</span>;
};

export default AccessToken;
