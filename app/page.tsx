import type { Metadata } from 'next';
// import RandomInterval from '../../data/RandomInterval';
import React, { useState } from 'react';
import { getFrameMetadata } from '@coinbase/onchainkit';

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

const frameMetadata = getFrameMetadata({
    buttons: [
        {
        label: 'Recast and click 👉 Mint',
        },
    ],
    image: 'https://i.gyazo.com/40a269363f416f28caff4f8d9601d670.gif',
    post_url: `${process.env['HOST']}/api/mint`,
});

export const metadata: Metadata = {
    title: 'F1337',
    description: 'Are you 1337?',
    openGraph: {
        title: 'F1337',
        description: 'Are you 1337?',
        images: ['https://i.gyazo.com/40a269363f416f28caff4f8d9601d670.gif'],
    },
    other: {
        ...frameMetadata,
    },
};

export default function Page() {
    // const [randomNumber, setRandomNumber] = useState('1337');
    // const [counter, setCounter] = useState(1);

    // RandomInterval(counter, setCounter, setRandomNumber);

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="font-mincho text-xl mt-10 text-primary font-bold text-center">Are you 1337?</h1>
            
            {/* <p  className="mt-4 mb-6 text-6xl text-primary-text font-bold">{randomNumber}</p> */}
        </div>
    );

}
