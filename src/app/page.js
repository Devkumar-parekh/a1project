"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import axios from "axios";
import { TOTP } from "totp-generator";

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

export default function Home() {
  const [formdata, setFormdata] = useState({
    api_key: "",
    client_code: "",
    password: "",
    totp: "",
    type: "",
  });
  const [response, setResponse] = useState("");
  const handleFormdata = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setFormdata((prev) => {
      return { ...prev, [key]: value };
    });
  };
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
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
          {/* <InputText
          type={"number"}
          placeholder={"type"}
          name={"type"}
          value={formdata?.type}
          onChange={handleFormdata}
        /> */}
          <hr />
          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href=""
              rel="noopener noreferrer"
              onClick={async (e) => {
                e.preventDefault();
                setResponse("");
                let mypublicip = await findmyip();
                const { otp, expires } = TOTP.generate(formdata.totp);
                const res = await axios.post(`/api/login`, {
                  ...formdata,
                  totp: otp,
                  mypublicip,
                });
                if (res) setResponse(JSON.stringify(res?.data));
              }}
            >
              <Image
                className={styles.logo}
                src="https://nextjs.org/icons/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Click To Sign In
            </a>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Home
            </a>
          </div>
        </main>
      </div>
      {response?.length > 0 && (
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
      )}
    </>
  );
}
