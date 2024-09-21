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

    if (Number(payload?.type) === 1) {
      var data = {
        state: payload.api_key,
        clientcode: payload.client_code,
        password: payload.password,
        totp: payload.totp,
      };
      var config = {
        method: "post",
        url: "https://apiconnect.angelone.in//rest/auth/angelbroking/user/v1/loginByPassword",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": "CLIENT_LOCAL_IP",
          "X-ClientPublicIP": "CLIENT_PUBLIC_IP",
          "X-MACAddress": "MAC_ADDRESS",
          "X-PrivateKey": "API_KEY",
        },
        data: data,
      };
      console.log("😎😎😎😎😋", data);
      axios(config)
        .then(function (response) {
          console.log("✌", JSON.stringify(response.data));
          console.log("✌2", response.data);
          const res = response.data;
          return NextResponse.json({
            res: res.data,
            msg: "😎😋",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
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
      error: error.message,
    });
  }
};
