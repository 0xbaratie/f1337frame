import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, CastParamType } from "@neynar/nodejs-sdk";

export async function GET() {
  const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY || '');
  const url = "https://warpcast.com/baratie/0xdcb08b3a"; // Change this to your warpcast post url
  const cast = await client.lookUpCastByHashOrWarpcastUrl(url, CastParamType.Url);
  console.log(cast);
  const jsonCast = JSON.stringify(cast);
  return new NextResponse(jsonCast);
}

// 0xdcb08b3ad3f9e347dac5a9b1dc4336d2f720a1d3
