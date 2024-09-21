import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { SmartAPI } from "smartapi-javascript";
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
    if (payload?.type === 1) {
    } else {
      const smart_api = new SmartAPI(payload);
      res = await smart_api.generateSession(
        payload.client_code,
        payload.password,
        payload.totp
      );
    }

    return NextResponse.json({
      res: res,
    });
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
};

// import axios from "axios";
// import { NextResponse } from "next/server";
// export const dynamic = "force-dynamic"; // defaults to auto;

// export const POST = async (req, res) => {
//   try {
//     var data = {
//       state: process.env.API_KEY,
//       clientcode: process.env.CLIENT_CODE,
//       password: process.env.PASSWORD,
//       totp: process.env.TOTP,
//     };

//     var config = {
//       method: "post",
//       url: "https://apiconnect.angelone.in//rest/auth/angelbroking/user/v1/loginByPassword",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "X-UserType": "USER",
//         "X-SourceID": "WEB",
//         "X-ClientLocalIP": "CLIENT_LOCAL_IP",
//         "X-ClientPublicIP": "CLIENT_PUBLIC_IP",
//         "X-MACAddress": "MAC_ADDRESS",
//         "X-PrivateKey": "API_KEY",
//       },
//       data: data,
//     };

//     const res = await axios(config);
//     console.log("😎😋", res.data);

//     return NextResponse.json({
//       res: res.data,
//     });
//   } catch (error) {
//     console.log("✨✨✨", error);
//     return NextResponse.json({
//       error,
//     });
//   }
// };
