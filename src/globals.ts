import { genMod, cryptMod, decryptMod } from "./WasmModules";

const isServer = typeof window === "undefined";
if (isServer) {
  global.__SECRET__ = "myLittleSecret";
  global.__GENKEYAPI__;
  global.__CRYPTAPI__;
  global.__DECRYPTAPI__;
  global.__KEY__ = "";
  genMod.then((e: any) => {
    global.__GENKEYAPI__ = e;
    global.__KEY__ = global.__GENKEYAPI__.generate_key(global.__SECRET__);
  });
  cryptMod.then((e: any) => {
    global.__CRYPTAPI__ = e;
  });
  decryptMod.then((e: any) => {
    global.__DECRYPTAPI__ = e;
  });
} else {
  window.__SECRET__ = "myLittleSecret";
  window.__GENKEYAPI__;
  window.__CRYPTAPI__;
  window.__DECRYPTAPI__;
  window.__KEY__ = "";
  genMod.then((e: any) => {
    window.__GENKEYAPI__ = e;
    window.__KEY__ = window.__GENKEYAPI__.generate_key(window.__SECRET__);
  });
  cryptMod.then((e: any) => {
    window.__CRYPTAPI__ = e;
  });
  decryptMod.then((e: any) => {
    window.__DECRYPTAPI__ = e;
  });
}
