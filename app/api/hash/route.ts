import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, CastParamType } from "@neynar/nodejs-sdk";

export async function GET() {
  const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY || '');
  const url = "https://warpcast.com/baratie/0xa08b5c5a";
  const cast = await client.lookUpCastByHashOrWarpcastUrl(url, CastParamType.Url);
  console.log(cast);
  const jsonCast = JSON.stringify(cast);
  return new NextResponse(jsonCast);
}

// 0xa08b5c5a8e753d2ea3af1421d0f1d841a3e5a119
