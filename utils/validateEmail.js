//const dns = require("dns");
import dns from "dns";

const checkMxRecords = (domain) => {
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses && addresses.length > 0);
      }
    });
  });
};

export async function isEmailDomainValid(email) {
  const domain = email.split("@")[1];
  try {
    const hasMxRecords = await checkMxRecords(domain);
    return hasMxRecords;
  } catch {
    return false;
  }
}

export default checkMxRecords;
