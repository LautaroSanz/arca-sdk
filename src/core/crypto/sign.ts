import forge from "node-forge";
import { CryptoError } from "../errors/crypto";

const SHA256_OID = "2.16.840.1.101.3.4.2.1";

export interface SignInput {
  content: string;
  cert: string;
  key: string;
}

export interface SignedCms {
  base64: string;
}

export function signCms(input: SignInput): SignedCms {
  let cert: forge.pki.Certificate;
  try {
    cert = forge.pki.certificateFromPem(input.cert);
  } catch (err) {
    throw new CryptoError("CRYPTO.CERT_INVALID", {
      message: "Failed to parse certificate PEM",
      cause: err,
    });
  }

  let privateKey: forge.pki.PrivateKey;
  try {
    privateKey = forge.pki.privateKeyFromPem(input.key);
  } catch (err) {
    throw new CryptoError("CRYPTO.KEY_INVALID", {
      message: "Failed to parse private key PEM",
      cause: err,
    });
  }

  try {
    const p7 = forge.pkcs7.createSignedData();
    p7.content = forge.util.createBuffer(input.content, "utf8");
    p7.addCertificate(cert);
    p7.addSigner({
      key: privateKey,
      certificate: cert,
      digestAlgorithm: SHA256_OID,
    });
    p7.sign({ detached: false });
    const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
    return { base64: forge.util.encode64(der) };
  } catch (err) {
    throw new CryptoError("CRYPTO.SIGN_FAILED", {
      message: "PKCS#7 signing failed",
      cause: err,
    });
  }
}
