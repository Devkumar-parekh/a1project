import { NextResponse } from "next/server";
import { SmartAPI } from "smartapi-javascript";
import axios from "axios";
export const dynamic = "force-dynamic"; // defaults to auto;

export const POST = async (req, res) => {
  try {
    const payload = await req.json();
    // const smart_api = new SmartAPI({
    //   api_key: process.env.API_KEY,
    //   client_code: process.env.CLIENT_CODE,
    //   password: process.env.PASSWORD,
    //   totp: process.env.TOTP,
    // });
    let res = "";

    const smart_api = new SmartAPI(payload);
    res = await smart_api.generateSession(
      payload.client_code,
      payload.password,
      payload.totp
    );
    let profile = {};
    if (res) {
      profile = await smart_api.getProfile();
    }
    return NextResponse.json({
      res,
      profile,
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
    });
  }
};
