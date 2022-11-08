import { genMod, cryptMod } from "./WasmModules";

const isServer = typeof window === "undefined";
if (isServer){
	global.__SECRET__ = "myLittleSecret";
	global.__GENKEYAPI__ = "";
	global.__CRYPTAPI__ = "";
	global.__KEY__ = "";
	genMod.then((e) => {
		global.__GENKEYAPI__ = e;
		global.__KEY__ = global.__GENKEYAPI__.generate_key(global.__SECRET__);
	});
	cryptMod.then((e) => {
		global.__CRYPTAPI__ = e;
	});
}
else{
	window.__SECRET__ = "myLittleSecret";
	window.__GENKEYAPI__ = "";
	window.__CRYPTAPI__ = "";
	window.__KEY__ = "";
	genMod.then((e) => {
		window.__GENKEYAPI__ = e;
		window.__KEY__ = window.__GENKEYAPI__.generate_key(window.__SECRET__);
		// return true;
	});
	cryptMod.then((e) => {
		window.__CRYPTAPI__ = e;
		// return true;
	});
}
