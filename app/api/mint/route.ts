import { FrameRequest, getFrameAccountAddress, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { http, createWalletClient, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { MintDelegaterAbi } from "../../../data/NFTContractAbi";
import { MintDelegaterAddress } from "../../../data/NFTContractAddress";
import { Warpcast } from "../../../classes/Warpcast";
import { z } from "zod";

const rpcUrl = "https://base.publicnode.com";
const requestBodyWarpcastSchema = z.object({
  trustedData: z.object({
    messageBytes: z.string().min(5),
  }),
});

// Based on https://github.com/coinbase/build-onchain-apps/blob/b0afac264799caa2f64d437125940aa674bf20a2/template/app/api/frame/route.ts#L13
async function getAddrByFid(fid: number) {
  console.log("Extracting address for FID: ", fid);
  const options = {
    method: "GET",
    url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY || "",
    },
  };
  console.log("Fetching user address from Neynar API");
  const resp = await fetch(options.url, { headers: options.headers });
  console.log("Response: ", resp);
  const responseBody = await resp.json(); // Parse the response body as JSON
  if (responseBody.users && responseBody.users[0]) {
    const userVerifications = responseBody.users[0].verifications;
    if (userVerifications && userVerifications.length > 0) {
      console.log("User address from Neynar API: ", userVerifications[0]);
      return userVerifications[0].toString();
    } else {
      console.log("No verifications found for user.");
      // Return a default or error value here
      return null; // or handle this scenario appropriately
    }
  } else {
    console.log("Could not fetch user address from Neynar API for FID: ", fid);
    return "0x0000000000000000000000000000000000000000"; // Consider handling this scenario differently
  }
}


async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body);
  if (isValid) {
    try {
      accountAddress = await getFrameAccountAddress(message, { NEYNAR_API_KEY: 'NEYNAR_API_DOCS' });
    } catch (err) {
      console.error(err);
    }
  }

  try {
    console.log("req.body", req.body);

    const fid = body.untrustedData.fid;
    const addressFromFid = await getAddrByFid(fid);
    console.log("Extracted address from FID: ", addressFromFid);

    if (addressFromFid === null) {
      // Address not found, return a specific HTML response
      return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://i.gyazo.com/40a269363f416f28caff4f8d9601d670.gif" />
        <meta property="fc:frame:button:1" content="Connect your address with farcaster account" />
        <meta property="fc:frame:post_url" content="https://f1337.vercel.app/" />
      </head></html>`);
    }

    const generatedNum =  Math.floor(Math.random() * 49);
    const trustedData  = body.trustedData;
    
    const action = await Warpcast.validateMessage(trustedData.messageBytes);
    
    const hasRecasted = await Warpcast.hasRecasted(action.interactor.fid);
    if (!hasRecasted) {
      // Recast failure HTML Response
      return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://i.gyazo.com/40a269363f416f28caff4f8d9601d670.gif" />
        <meta property="fc:frame:button:1" content="Recast is required to stop" />
        <meta property="fc:frame:post_url" content="https://f1337.vercel.app/" />
      </head></html>`);
    }

    
    const hasLiked = await Warpcast.hasLiked(action.interactor.fid);
    if (!hasLiked) {
      // Like failure HTML Response
      return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://i.gyazo.com/40a269363f416f28caff4f8d9601d670.gif" />
        <meta property="fc:frame:button:1" content="Like is required to stop" />
        <meta property="fc:frame:post_url" content="https://f1337.vercel.app/" />
      </head></html>`);
    }

    const account = privateKeyToAccount(
      process.env.PRIVATE_KEY as `0x${string}`
    );

    const publicClient = createPublicClient({
      chain: base,
      transport: http(rpcUrl),
    });
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(rpcUrl),
    });
    // const [account] = await walletClient.getAddresses();

    const { request, result } = await publicClient.simulateContract({
      address: MintDelegaterAddress,
      abi: MintDelegaterAbi,
      functionName: "mint",
      account,
      args: [addressFromFid],
    });
    const hash = await walletClient.writeContract(request);

    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });
    const blockNumber = receipt.blockNumber;

    console.log("@@Result: ", result);
    const resultString = result.toString();
    
    if (resultString === "1337") {
      // Success HTML Response
      return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://f1337.vercel.app/success/0.GIF" />
        <meta property="fc:frame:button:1" content="You are 1337" />
        <meta property="fc:frame:post_url" content="https://f1337.vercel.app/" />
      </head></html>`);
    } else {
      // Failure HTML Response
      return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://f1337.vercel.app//failed/${generatedNum}.GIF" />
        <meta property="fc:frame:button:1" content="You are not 1337 " />
        <meta property="fc:frame:post_url" content="https://f1337.vercel.app/" />
      </head></html>`);
    }

  } catch (error) {
    console.error(error);
    return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://i.gyazo.com/40a269363f416f28caff4f8d9601d670.gif" />
        <meta property="fc:frame:button:1" content="Error" />
        <meta property="fc:frame:post_url" content="https://f1337.vercel.app/" />
      </head></html>`);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
