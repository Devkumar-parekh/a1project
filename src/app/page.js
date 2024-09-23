"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { TOTP } from "totp-generator";
import { instruments } from "./assets/instruments";

const Instrument = (props) => {
  const { name, symbol, exch_seg, index } = props?.data;
  const { api_key, token } = props;
  const [ltp, setltp] = useState({});
  console.log(props?.data, "props?.data");
  useEffect(() => {
    setltp([]);
  }, [index]);
  return (
    <div
      key={index}
      style={{
        padding: "10px",
        border: "2px solid gray",
        borderRadius: "10px",
        margin: "10px 0",
      }}
    >
      <div className="" style={{ display: "flex", gap: "10px" }}>
        <div>
          <div>name: {name}</div>
          <div>symbol: {symbol}</div>
          <div>exch_seg: {exch_seg}</div>
        </div>
        <div>
          {props?.data?.token === ltp?.symboltoken && ltp?.symboltoken && (
            <>
              <div>ltp: {ltp?.ltp}</div>
              <div>high: {ltp?.high}</div>
              <div>low: {ltp?.low}</div>
              <div>open: {ltp?.open}</div>
              <div>close: {ltp?.close}</div>
            </>
          )}
        </div>
        <div>
          {/* {props?.data?.token === ltp?.symboltoken && ltp?.symboltoken && ( */}
          <button
            onClick={async () => {
              const templtp = await getLTP({
                api_key: api_key,
                jwt: token?.jwtToken,
                data: {
                  exchange: props?.data?.exch_seg,
                  tradingsymbol: props?.data?.symbol,
                  symboltoken: props?.data?.token,
                },
              });
              console.log(templtp?.data?.data, "templtpa");
              setltp(templtp?.data?.data);
            }}
          >
            LTP
          </button>
          {/* )} */}
          {props?.data?.token === ltp?.symboltoken && ltp?.symboltoken && (
            <button
              onClick={async () => {
                const temp = await placeorder({
                  api_key: api_key,
                  jwt: token?.jwtToken,
                  data: {
                    variety: "NORMAL",
                    tradingsymbol: "SBIN-EQ",
                    symboltoken: "3045",
                    transactiontype: "BUY",
                    exchange: "NSE",
                    ordertype: "MARKET",
                    producttype: "INTRADAY",
                    duration: "DAY",
                    price: "1",
                    squareoff: "0",
                    stoploss: "0",
                    quantity: "1",
                  },
                });
                console.log(temp, "♦♥😍temp placeorder");
              }}
            >
              Buy
            </button>
          )}

          {props?.data?.token === ltp?.symboltoken && ltp?.symboltoken && (
            <button
              onClick={async () => {
                const temp = await cancelOrder({
                  api_key: api_key,
                  jwt: token?.jwtToken,
                  data: {
                    variety: "NORMAL",
                    orderid: "240923001916184",
                  },
                });
                console.log(temp, "♦♥😍temp cancelOrder");
              }}
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const InputText = (props) => {
  return (
    <input
      type={props?.type || "text"}
      name={props?.name}
      value={props?.value || ""}
      onChange={props.onChange}
      style={{
        borderRadius: "5px",
        margin: "3px",
        padding: "5px",
        fontSize: "16px",
        width: "min(300px,100%)",
      }}
      placeholder={props.placeholder}
    />
  );
};

const findmyip = async () => {
  const res = await axios.get("https://api.ipify.org?format=json");
  console.log(res.data);
  return res.data?.ip;
};

const cancelOrder = async (payload) => {
  // var data = JSON.stringify({
  //   variety: "NORMAL",
  //   orderid: "201020000000080",
  // });

  let data = JSON.stringify(payload?.data);

  var config = {
    method: "post",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/cancelOrder",
    headers: {
      Authorization: `Bearer ${payload?.jwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": "CLIENT_LOCAL_IP",
      "X-ClientPublicIP": "CLIENT_PUBLIC_IP",
      "X-MACAddress": "MAC_ADDRESS",
      "X-PrivateKey": payload.api_key,
    },
    data: data,
  };

  const result = await axios(config);
  console.log(result);
  return result;
};

const placeorder = async (payload) => {
  let data = JSON.stringify(payload?.data);

  var config = {
    method: "post",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder",
    headers: {
      Authorization: `Bearer ${payload?.jwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": "CLIENT_LOCAL_IP",
      "X-ClientPublicIP": "CLIENT_PUBLIC_IP",
      "X-MACAddress": "MAC_ADDRESS",
      "X-PrivateKey": payload.api_key,
    },
    data: data,
  };

  const result = await axios(config);
  console.log(result);
  return result;
};

const getLTP = async (payload) => {
  let data = JSON.stringify(payload?.data);

  var config = {
    method: "post",
    url: "https://apiconnect.angelone.in/order-service/rest/secure/angelbroking/order/v1/getLtpData",
    headers: {
      Authorization: `Bearer ${payload?.jwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": "CLIENT_LOCAL_IP",
      "X-ClientPublicIP": "CLIENT_PUBLIC_IP",
      "X-MACAddress": "MAC_ADDRESS",
      "X-PrivateKey": payload.api_key,
    },
    data: data,
  };

  const result = await axios(config);
  console.log(result);
  return result;
};
const logOut = async (payload) => {
  var data = JSON.stringify({
    clientcode: payload?.client_code,
  });
  console.log(payload.api_key, "payload.api_key");
  var config = {
    method: "post",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/logout",
    headers: {
      Authorization: `Bearer ${payload?.jwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": "CLIENT_LOCAL_IP",
      "X-ClientPublicIP": "CLIENT_PUBLIC_IP",
      "X-MACAddress": "MAC_ADDRESS",
      "X-PrivateKey": payload.api_key,
    },
    data: data,
  };

  const result = await axios(config);
  console.log(result);
  alert(result?.data?.data);
  return result;
};

export default function Home() {
  const [data, setData] = useState([]);
  const [formdata, setFormdata] = useState({
    api_key: "",
    client_code: "",
    password: "",
    totp: "",
    type: "",
  });
  const [token, setToken] = useState({});
  const handleFormdata = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setFormdata((prev) => {
      return { ...prev, [key]: value };
    });
  };
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className={styles.page} style={{ flex: 1 }}>
          <main className={styles.main} style={{ maxWidth: "400px" }}>
            {/* <Image
          className={styles.logo}
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
            <h1 style={{ textAlign: "center" }}>
              <code>A1PROJECT</code>
            </h1>
            {/* <ul>
          <li>Everything on fingertip</li>
        </ul> */}
            <hr />
            <center>
              <InputText
                placeholder={"api_key"}
                name={"api_key"}
                value={formdata?.api_key}
                onChange={handleFormdata}
              />
              <InputText
                placeholder={"client_code"}
                name={"client_code"}
                value={formdata?.client_code}
                onChange={handleFormdata}
              />
              <InputText
                type={"password"}
                placeholder={"password"}
                name={"password"}
                value={formdata?.password}
                onChange={handleFormdata}
              />
              <InputText
                type={"password"}
                placeholder={"totp"}
                name={"totp"}
                value={formdata?.totp}
                onChange={handleFormdata}
              />
            </center>
            <hr />
            <div className={styles.ctas}>
              <button
                className={styles.primary}
                href=""
                rel="noopener noreferrer"
                onClick={async (e) => {
                  e.preventDefault();

                  let mypublicip = await findmyip();
                  const { otp, expires } = TOTP.generate(formdata.totp);
                  const res = await axios.post(`/api/login`, {
                    ...formdata,
                    totp: otp,
                    mypublicip,
                  });
                  setToken(res?.data?.res?.data);
                }}
              >
                <Image
                  className={styles.logo}
                  src="https://nextjs.org/icons/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                Click To Continue
              </button>
              <button
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondary}
                onClick={async () => {
                  console.log(formdata?.api_key);
                  await logOut({
                    api_key: formdata?.api_key,
                    jwt: token?.jwtToken,
                    client_code: formdata?.client_code,
                  });
                  setFormdata({});
                }}
              >
                Log out
              </button>
            </div>
            <hr></hr>

            {/* {response?.length > 0 && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <span>
                  <Image
                    aria-hidden
                    src="https://nextjs.org/icons/file.svg"
                    alt="File icon"
                    width={16}
                    height={16}
                  />
                </span>
                <span>{response || ""}</span>
              </div>
            )} */}
          </main>
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <InputText
            placeholder={"Instrument..."}
            name={"instrument"}
            value={formdata?.instrument}
            onChange={handleFormdata}
          />
          <button
            className={styles.primary}
            style={{ padding: "5px", borderRadius: "10px" }}
            href=""
            rel="noopener noreferrer"
            onClick={async (e) => {
              setData([]);
              e.preventDefault();
              console.log("Searching", formdata?.instrument);
              let temp = instruments?.filter((item) =>
                item?.name
                  ?.toLowerCase()
                  ?.includes(formdata?.instrument.toLowerCase())
              );
              // console.log("test");
              setData(temp);
            }}
          >
            Search
          </button>
          <div>
            {data?.map((dataitem, index) => {
              return (
                <div key={index}>
                  <Instrument
                    data={dataitem}
                    key={index}
                    api_key={formdata?.api_key}
                    token={token}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
