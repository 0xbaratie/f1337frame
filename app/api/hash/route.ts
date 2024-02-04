import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, CastParamType } from "@neynar/nodejs-sdk";

export async function GET() {
  const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY || '');
  const url = "https://warpcast.com/baratie/0x508754e9"; // Change this to your warpcast post url
  const cast = await client.lookUpCastByHashOrWarpcastUrl(url, CastParamType.Url);
  console.log(cast);
  const jsonCast = JSON.stringify(cast);
  return new NextResponse(jsonCast);
}
