'use client';
import Search from '@arcgis/core/widgets/Search';
import { useState, useEffect, useRef } from 'react';

export default function AddressSearch({
	theme,
	setLatitude,
	setLongitude,
	setWorkLocation,
}: {
	theme?: string;
	setLatitude: any;
	setLongitude: any;
	setWorkLocation: any;
}) {
	const searchDiv = useRef(null);
	const [selectedAddress, setSelectedAddress] = useState('');

	useEffect(() => {
		if (searchDiv.current) {
			const search = new Search({ container: searchDiv.current });

			search.on('search-complete', function (result) {
				if (
					result.numResults > 0 &&
					(result as any).results[0].results[0].feature.geometry.x &&
					(result as any).results[0].results[0].feature.geometry.y
				) {
					setSelectedAddress((result as any).searchTerm);
					setLatitude((result as any).results[0].results[0].feature.geometry.y);
					setLongitude(
						(result as any).results[0].results[0].feature.geometry.x
					);
					setWorkLocation((result as any).searchTerm);
				} else {
					setSelectedAddress('No results found');
				}
			});
		}
	}, []);

	return (
		<>
			<link
				id='searchBarTheme'
				rel='stylesheet'
				href={`https://js.arcgis.com/4.28/esri/themes/${theme}/main.css`}
			/>
			<div
				id='searchDiv'
				ref={searchDiv}
				className='[&>*:not(:nth-child(1))]:hidden' // fixes double search bar issue
			></div>
			<p>
				<span className='font-semibold'>{selectedAddress}</span>
			</p>
		</>
	);
}
