import generateModule from "Utilities/rc_generate_key";
import hashModule from "Utilities/hash_sha256";
import cryptModule from "Utilities/rc_crypt";
import decryptModule from "Utilities/rc_decrypt";
import cryptFileModule from "Utilities/rc_crypt_file";
import decryptFileModule from "Utilities/rc_decrypt_file";

const genMod = !import.meta.env.SSR
  ? generateModule().then(function (Module: any) {
      const api = {
        generate_key: Module.cwrap("generate", "string", ["string"]),
      };
      return api;
    })
  : null;

const cryptMod = !import.meta.env.SSR
  ? cryptModule().then(function (Module: any) {
      const api = {
        crypt: Module.cwrap("rc_crypt", "string", ["string", "string"]),
      };
      return api;
    })
  : null;

const cryptFileMod = !import.meta.env.SSR
  ? cryptFileModule().then(function (Module: any) {
      const api = {
        crypt: Module.cwrap("rc_crypt_file", "string", ["string", "string"]),
      };
      return api;
    })
  : null;

const decryptMod = !import.meta.env.SSR
  ? decryptModule().then(function (Module: any) {
      const api = {
        decrypt: Module.cwrap("rc_decrypt", "string", ["string"]),
      };

      return api;
    })
  : null;

const decryptFileMod = !import.meta.env.SSR
  ? decryptFileModule().then(function (Module: any) {
      const api = {
        decrypt: Module.cwrap("rc_decrypt_file", "string", [
          "string",
          "string",
        ]),
      };

      return api;
    })
  : null;

const hashMod = !import.meta.env.SSR
  ? hashModule().then(function (Module: any) {
      const api = {
        hash_calc: Module.cwrap("hash", "string", ["string"]),
      };

      return api;
    })
  : null;

export { genMod, cryptMod, cryptFileMod, decryptMod, decryptFileMod, hashMod };
