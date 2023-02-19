import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: sentence }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>영어 문장 검사기</title>
      </Head>

      <main className={styles.main}>
        <h3>영어 문장 검사기</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="textarea"
            name="eng_sentence"
            placeholder="Enter an animal"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
          <input type="submit" value="fix!" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
