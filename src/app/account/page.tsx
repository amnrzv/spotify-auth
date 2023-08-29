'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Profile = {
	display_name: string;
	images: {
		height: number;
		width: number;
		url: string;
	}[];
};

const Account = () => {
	const [ profile, setProfile ] = useState<Profile>();

	useEffect( () => {
		async function fetchProfile() {
			const accessToken = localStorage.getItem( 'access_token' );

			const response = await fetch( 'https://api.spotify.com/v1/me', {
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			} );

			const data = await response.json();
			setProfile( data );
		}

		fetchProfile();
	}, [] );

	if ( !profile ) {
		return <span>loading</span>;
	}

	return (
		<main>
			<h1>Account</h1>
			<h3>{profile.display_name}</h3>
			<Image
				src={profile.images[ 1 ].url}
				width={profile.images[ 1 ].width}
				height={profile.images[ 1 ].height}
				alt={profile.display_name}
			/>
		</main>
	);
};

export default Account;
