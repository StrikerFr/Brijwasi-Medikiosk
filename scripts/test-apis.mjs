import { createClient } from "@libsql/client/web";

const env = process.env;

console.log("=== MediKiosk Live Provider Connectivity Checks ===\n");

// 1. Turso
console.log("1. Turso Database (libSQL):");
try {
  const db = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  const res = await db.execute("SELECT 1 AS alive");
  console.log("   Status: CONNECTED (res:", res.rows, ")");
} catch (e) {
  console.error("   Status: FAILED ->", e.message);
}

// 2. Google Gemini
console.log("\n2. Google Gemini API:");
try {
  const key = env.GEMINI_API_KEY;
  const model = env.GEMINI_MODEL || "gemini-flash-latest";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Hello, reply with OK" }] }],
      }),
      signal: AbortSignal.timeout(15000),
    }
  );
  if (res.ok) {
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log(`   Status: CONNECTED (model: ${model}, response: "${text}")`);
  } else {
    const txt = await res.text();
    console.error(`   Status: FAILED (HTTP ${res.status}) ->`, txt);
  }
} catch (e) {
  console.error("   Status: ERROR ->", e.message);
}

// 3. Groq
console.log("\n3. Groq API:");
try {
  const res = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${env.GROQ_API_KEY}` },
    signal: AbortSignal.timeout(15000),
  });
  if (res.ok) {
    console.log("   Status: CONNECTED (HTTP 200)");
  } else {
    const txt = await res.text();
    console.error(`   Status: FAILED (HTTP ${res.status}) ->`, txt);
  }
} catch (e) {
  console.error("   Status: ERROR ->", e.message);
}

// 4. ElevenLabs
console.log("\n4. ElevenLabs Voice API:");
try {
  const voiceId = env.ELEVENLABS_VOICE_ID;
  const res = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
    headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
    signal: AbortSignal.timeout(15000),
  });
  if (res.ok) {
    const data = await res.json();
    console.log(`   Status: CONNECTED (Voice Name: "${data.name}", ID: ${voiceId})`);
  } else {
    const txt = await res.text();
    console.error(`   Status: FAILED (HTTP ${res.status}) ->`, txt);
  }
} catch (e) {
  console.error("   Status: ERROR ->", e.message);
}

// 5. Clerk
console.log("\n5. Clerk Authentication:");
try {
  const res = await fetch("https://api.clerk.com/v1/users?limit=1", {
    headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}` },
    signal: AbortSignal.timeout(20000),
  });
  if (res.ok) {
    console.log("   Status: CONNECTED (HTTP 200 - Secret key valid)");
  } else {
    const txt = await res.text();
    console.error(`   Status: FAILED (HTTP ${res.status}) ->`, txt);
  }
} catch (e) {
  console.error("   Status: ERROR ->", e.message);
}

// 6. OCR.space
console.log("\n6. OCR.space API:");
try {
  const form = new FormData();
  form.append("apikey", env.OCR_SPACE_API_KEY);
  form.append("base64Image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(15000),
  });
  if (res.ok) {
    const data = await res.json();
    if (data.IsErroredOnProcessing && data.OCRExitCode !== 1 && data.OCRExitCode !== 2) {
      console.error("   Status: FAILED ->", data.ErrorMessage);
    } else {
      console.log("   Status: CONNECTED (OCR API Key is valid, OCR Engine replied)");
    }
  } else {
    console.error(`   Status: FAILED (HTTP ${res.status})`);
  }
} catch (e) {
  console.error("   Status: ERROR ->", e.message);
}

