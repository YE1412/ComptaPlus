import generateModule from "Utilities/rc_generate_key";
import hashModule from "Utilities/hash_sha256";
import cryptModule from "Utilities/rc_crypt";
import decryptModule from "Utilities/rc_decrypt";
import cryptFileModule from "Utilities/rc_crypt_file";
import decryptFileModule from "Utilities/rc_decrypt_file";
const genMod = generateModule().then(function (Module) {
  const api = {
    generate_key: Module.cwrap("generate", "string", ["string"]),
  };
  return api;
});
const cryptMod = cryptModule().then(function (Module) {
  const api = {
    crypt: Module.cwrap("rc_crypt", "string", ["string", "string"]),
  };
  return api;
});
const cryptFileMod = cryptFileModule().then(function (Module) {
  const api = {
    crypt: Module.cwrap("rc_crypt_file", "string", ["string", "string"]),
  };
  return api;
});
const decryptMod = decryptModule().then(function (Module) {
  const api = {
    decrypt: Module.cwrap("rc_decrypt", "string", ["string"]),
  };
  return api;
});
const decryptFileMod = decryptFileModule().then(function (Module) {
  const api = {
    decrypt: Module.cwrap("rc_decrypt_file", "string", ["string", "string"]),
  };
  return api;
});
const hashMod = hashModule().then(function (Module) {
  const api = {
    hash_calc: Module.cwrap("hash", "string", ["string"]),
  };
  return api;
});
export { genMod, cryptMod, cryptFileMod, decryptMod, decryptFileMod, hashMod };
