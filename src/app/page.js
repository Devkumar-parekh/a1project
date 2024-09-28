"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";

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

export default function Home() {
  const router = useRouter();
  const [formdata, setFormdata] = useState({
    uid: "",
    password: "",
  });
  const handleFormdata = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setFormdata((prev) => {
      return { ...prev, [key]: value };
    });
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div className={styles.page} style={{ flex: 1 }}>
          <main className={styles.main} style={{ maxWidth: "400px" }}>
            <h1 style={{ textAlign: "center" }}>
              <code>A1PROJECT</code>
            </h1>
            <h5 style={{ textAlign: "center" }}>
              <code>Login Here</code>
            </h5>
            <hr />
            <center>
              <InputText
                placeholder={"uid"}
                name={"uid"}
                value={formdata?.uid}
                onChange={handleFormdata}
              />
              <InputText
                placeholder={"password"}
                name={"password"}
                value={formdata?.password}
                onChange={handleFormdata}
                type={"password"}
              />
            </center>
            <div className={styles.ctas} style={{ justifyContent: "center" }}>
              <button
                className={styles.primary}
                href=""
                rel="noopener noreferrer"
                onClick={async (e) => {
                  e.preventDefault();
                  if (formdata?.uid === "adminid") {
                    if (formdata?.password) {
                      generateSHA256Hash(formdata?.password).then((hash) => {
                        console.log("SHA-256 Hash:", hash);
                        if (
                          hash ===
                          "ebcaa2bc57ae3e81cf2065edd94e3c87d0997370c4b7fdb4e306d83efacf3c3d"
                        ) {
                          router.push("/dashboard/home");
                          localStorage.setItem("secure", true);
                        } else {
                          alert("Invalid credentials...");
                        }
                      });
                    } else {
                      alert("Invalid credentials..");
                    }
                  } else {
                    alert("Invalid credentials.");
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
                Login
              </button>
              <button
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondary}
                onClick={async () => {
                  setFormdata({});
                }}
              >
                Log out
              </button>
            </div>
            <hr></hr>
          </main>
        </div>
      </div>
    </>
  );
}

async function generateSHA256Hash(data) {
  // Encode the data as a Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Hash the data
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
