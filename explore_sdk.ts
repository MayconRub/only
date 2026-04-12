import { createTurbofyClient } from "@turbofy/sdk";

const client = createTurbofyClient({ 
  baseUrl: "https://api.turbofypay.com", 
  credentials: { 
    clientId: "dummy-id", 
    clientSecret: "dummy-secret" 
  } 
});

console.log("Client keys:", Object.keys(client));
console.log("Pix keys:", Object.keys(client.pix));
// Check for any other modules
for (const key of Object.keys(client)) {
  if (typeof (client as any)[key] === 'object' && (client as any)[key] !== null) {
    console.log(`Module ${key} keys:`, Object.keys((client as any)[key]));
  }
}
