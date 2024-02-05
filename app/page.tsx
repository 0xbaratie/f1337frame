import type { Metadata } from 'next';
import React, { useState } from 'react';
import { getFrameMetadata } from '@coinbase/onchainkit';

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

const frameMetadata = getFrameMetadata({
    buttons: [
        {
        label: 'Recast and like 👉 Play',
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

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="font-mincho text-3xl mt-10 text-primary font-bold text-center">F1337</h1>
            
            <div className="flex justify-center mt-8">
                <a
                href={`https://f1337.vercel.app/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                <span>Play web version</span>
                </a>
            </div>


            <footer className="flex items-center justify-center pt-10 m-12 bg-gray-100">
                <nav className="flex flex-col items-center">
                    <a href="https://github.com/0xbaratie/f1337" className="font-mincho link link-hover p-1" target="_blank" rel="noopener noreferrer">Github</a>
                    <a href="https://twitter.com/0xBaratie" className="font-mincho link link-hover p-1" target="_blank" rel="noopener noreferrer">X</a>
                </nav>
            </footer>

            
        </div>
    );

}
