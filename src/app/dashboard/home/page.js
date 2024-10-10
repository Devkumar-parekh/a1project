"use client";
import Image from "next/image";
// import styles from "./page.module.css";
import styles from "./page.module.css";
import { useState, useEffect, memo, useMemo } from "react";
import axios from "axios";
import { TOTP } from "totp-generator";

// import instruments from "../../assets/instruments.json";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    let localdata = localStorage.getItem("secure");
    if (!localdata || localdata === "false") {
      router.push("/");
    }
  }, []);

  const [loadings, setLoadings] = useState({});

  const handleLoadings = (key, value) => {
    setLoadings((prev) => ({ ...prev, [key]: value }));
  };

  const [data, setData] = useState([]);
  const [formdata, setFormdata] = useState({
    api_key: "",
    client_code: "",
    password: "",
    totp: "",
    type: "",
  });
  const [token, setToken] = useState({});
  const [logindata, setLogindata] = useState({});
  const handleFormdata = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setFormdata((prev) => {
      return { ...prev, [key]: value };
    });
  };
  return (
    <div
      className="homepage"
      style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}
    >
      <div className={styles.page} style={{ flex: 1 }}>
        <main className={styles.main} style={{ maxWidth: "400px" }}>
          <h1 style={{ textAlign: "center" }}>
            {/* <code>A1PROJECT</code> */}
            <code>A1Trades</code>
          </h1>
          <hr />
          {!logindata?.profile?.data?.name && (
            <center>
              <InputText
                text={"API Key"}
                placeholder={"API Key"}
                name={"api_key"}
                value={formdata?.api_key}
                onChange={handleFormdata}
              />
              <InputText
                text={"Client Code"}
                placeholder={"Client Code"}
                name={"client_code"}
                value={formdata?.client_code}
                onChange={handleFormdata}
              />
              <InputText
                type={"password"}
                text={"MPin"}
                placeholder={"MPin"}
                name={"password"}
                value={formdata?.password}
                onChange={handleFormdata}
              />
              <InputText
                type={"password"}
                text={"Totp"}
                placeholder={"Totp"}
                name={"totp"}
                value={formdata?.totp}
                onChange={handleFormdata}
              />
            </center>
          )}

          <div className={styles.ctas}>
            {logindata?.profile?.data?.name
              ? `${logindata?.profile?.data?.name}`
              : ""}
            {!token?.jwtToken && (
              <button
                className={styles.primary}
                href=""
                rel="noopener noreferrer"
                disabled={loadings?.login}
                onClick={async (e) => {
                  e.preventDefault();
                  handleLoadings("login", 1);
                  let mypublicip = await findmyip();
                  const { otp, expires } = TOTP.generate(formdata.totp);
                  try {
                    const result = await axios.post(`/api/login`, {
                      ...formdata,
                      totp: otp,
                      mypublicip,
                    });
                    setToken(result?.data?.res?.data);
                    setLogindata(result?.data);
                  } catch (e) {
                    console.error(e.message, "👎");
                  } finally {
                    handleLoadings("login", 0);
                  }
                }}
              >
                <Image
                  className={styles.logo}
                  src="https://nextjs.org/icons/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                {loadings?.login ? "Loading..." : "Click To Continue"}
              </button>
            )}
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
                setToken({});
                setFormdata({});
                setLogindata({});
                localStorage.setItem("secure", false);
                router.push("/");
              }}
            >
              Log out
            </button>
          </div>
          <hr></hr>
        </main>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        {token?.jwtToken && (
          <>
            <InputText
              text={"Instrument..."}
              placeholder={"Instrument..."}
              name={"instrument"}
              value={formdata?.instrument}
              onChange={handleFormdata}
              className={"d-inline"}
            />
            <button
              className={styles.primary}
              style={{
                padding: "5px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              href=""
              rel="noopener noreferrer"
              onClick={async (e) => {
                setData([]);
                e.preventDefault();
                console.log("Searching", formdata?.instrument);
                if (formdata?.instrument) {
                  // let temp = instruments?.instruments?.filter((item) =>
                  //   item?.name
                  //     ?.toLowerCase()
                  //     ?.includes(formdata?.instrument.toLowerCase())
                  // );
                  // console.log("test");
                  let temp = [];
                  temp = await axios.post(`/api/instruments`, {
                    name: formdata?.instrument,
                  });
                  setData(temp?.data?.data);
                  console.log(temp, "temp");
                }
              }}
            >
              Search
            </button>
          </>
        )}
        <div style={{ maxHeight: "calc(100vh - 150px)", overflow: "auto" }}>
          {useMemo(() => {
            if (token?.jwtToken)
              return data?.map((dataitem, index) => {
                return (
                  <div key={index}>
                    <Instrument
                      data={dataitem}
                      key={index}
                      index={index}
                      api_key={formdata?.api_key}
                      token={token}
                    />
                  </div>
                );
              });
          }, [data])}
        </div>
      </div>
    </div>
  );
}

const Instrument = (props) => {
  const { name, symbol, exch_seg, index } = props?.data;
  const { api_key, token } = props;
  const [ltp, setltp] = useState({});
  useEffect(() => {
    setltp([]);
  }, [index]);
  const initForm = {
    price: "0",
    quantity: "0",
  };
  const [formdata, setFormdata] = useState(initForm);
  const handleFormdata = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };
  const [buyOrSell, setBuyOrSell] = useState(false);

  const [loader, setLoader] = useState({});
  const handleLoader = (key, value) => {
    setLoader((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="instrument"
      key={index}
      style={{
        padding: "10px",
        border: "2px solid gray",
        borderRadius: "10px",
        margin: "10px 0",
        background: "#64646430",
      }}
    >
      <div className="" style={{ display: "flex", gap: "10px" }}>
        {props.index + 1}
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
          <Button
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
          </Button>
          {/* )} */}
          {props?.data?.token === ltp?.symboltoken && ltp?.symboltoken && (
            <>
              <Button
                onClick={async () => {
                  setBuyOrSell((prev) => {
                    setFormdata(initForm);
                    return !prev;
                  });
                }}
              >
                Buy/Sell
              </Button>
              {buyOrSell && (
                <div className="bg-blue m-1 p-1 rounded">
                  <Dropdown
                    data={[
                      { value: "NORMAL", label: "Normal Order (Regular)" },
                      { value: "STOPLOSS", label: "Stop loss order" },
                      { value: "AMO", label: "After Market Order" },
                      { value: "ROBO", label: "ROBO (Bracket Order)" },
                    ]}
                    onchange={handleFormdata}
                    name={"variety"}
                    text={"Variety"}
                  />
                  <Dropdown
                    data={[
                      { value: "BUY", label: "Buy" },
                      { value: "SELL", label: "Sell" },
                    ]}
                    onchange={handleFormdata}
                    name={"transactiontype"}
                    text={"Transaction Type"}
                  />
                  <Dropdown
                    data={[
                      { value: "MARKET", label: "Market Order(MKT)" },
                      { value: "LIMIT", label: "Limit Order(L)" },
                      {
                        value: "STOPLOSS_LIMIT",
                        label: "Stop Loss Limit Order(SL)",
                      },
                      {
                        value: "STOPLOSS_MARKET",
                        label: "Stop Loss Market Order(SL-M)",
                      },
                    ]}
                    onchange={handleFormdata}
                    name={"ordertype"}
                    text={"Order Type"}
                  />
                  <Dropdown
                    data={[
                      {
                        value: "DELIVERY",
                        label: "Cash & Carry for equity (CNC)",
                      },
                      {
                        value: "CARRYFORWARD",
                        label: "Normal for futures and options (NRML)",
                      },
                      {
                        value: "MARGIN",
                        label: "Margin Delivery",
                      },
                      {
                        value: "INTRADAY",
                        label: "Margin Intraday Squareoff (MIS)",
                      },
                      {
                        value: "BO",
                        label: "Bracket Order (Only for ROBO)",
                      },
                    ]}
                    onchange={handleFormdata}
                    name={"producttype"}
                    text={"Product Type"}
                  />

                  <Dropdown
                    data={[
                      { value: "DAY", label: "Regular Order" },
                      { value: "IOC", label: "Immediate or Cancel" },
                    ]}
                    onchange={handleFormdata}
                    name={"duration"}
                    text={"Duration"}
                  />
                  <InputText
                    type="number"
                    text={"Price"}
                    placeholder={"Price"}
                    name={"price"}
                    value={formdata?.price}
                    onChange={handleFormdata}
                  />
                  <InputText
                    type="number"
                    text={"Quantity"}
                    placeholder={"Quantity"}
                    name={"quantity"}
                    value={formdata?.quantity}
                    onChange={handleFormdata}
                  />
                  <Button
                    onClick={async () => {
                      const data = {
                        variety: formdata?.variety || "NORMAL", //"NORMAL",
                        transactiontype: formdata?.transactiontype || "BUY",
                        ordertype: formdata?.ordertype || "MARKET",
                        producttype: formdata?.producttype || "DELIVERY", //"INTRADAY",
                        duration: formdata?.duration || "DAY",
                        price: formdata?.price || "0", //"51",
                        quantity: formdata?.quantity || "0", //"1",
                        squareoff: "0",
                        stoploss: "0",
                        tradingsymbol: ltp?.tradingsymbol,
                        symboltoken: ltp?.symboltoken || "",
                        exchange: ltp?.exchange || "",
                      };
                      //================================================
                      //=================DO NOT REMOVE==================
                      //================================================
                      handleLoader("order", 1);
                      if (
                        Number(formdata?.price) &&
                        Number(formdata?.quantity)
                      ) {
                        const temp = await placeorder({
                          api_key: api_key,
                          jwt: token?.jwtToken,
                          data: data,
                        });
                        console.log(data, "data❤❤💛💙🖤", temp, "buy result");
                      } else {
                        alert("Please enter valid price and quantity");
                      }
                      //================================================
                      handleLoader("order", 0);
                      setFormdata(initForm);
                      // console.log(data, "data❤❤💛💙🖤");
                    }}
                  >
                    {loader?.order ? "Loading" : "Submit"}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* {props?.data?.token === ltp?.symboltoken && ltp?.symboltoken && (
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
          )} */}
        </div>
      </div>
    </div>
  );
};

const InputText = (props) => {
  return (
    <div className={`m-1 ${props?.className || ""}`}>
      <div style={{ fontWeight: "bold" }}>{props.text}</div>
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
    </div>
  );
};

const Dropdown = (props) => {
  return (
    <div className="m-1">
      <div style={{ fontWeight: "bold" }}>{props.text}</div>
      <select name={props.name} onChange={props.onchange}>
        {props?.data?.length ? (
          props?.data?.map((item, key) => {
            if (item?.value && item?.label)
              return (
                <option key={key} value={item?.value}>
                  {item?.label}
                </option>
              );
          })
        ) : (
          <option>No data Found</option>
        )}
      </select>
    </div>
  );
};

const Button = (props) => {
  return (
    <button
      className="m-1"
      style={{ cursor: "pointer" }}
      onClick={props.onClick}
    >
      {props?.children}
    </button>
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
  alert("Success!");
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
