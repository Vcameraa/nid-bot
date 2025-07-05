export default async function handler(req, res) {
  const token = "7702650514:AAGSQcnJ8zZ3mRchpbPb8ntO0fAdZvpPjkY-v5g";
  const body = req.body;

  if (!body || !body.message || !body.message.text) {
    return res.status(200).send("No message");
  }

  const chat_id = body.message.chat.id;
  const text = body.message.text;

  if (text.startsWith("/nid")) {
    const parts = text.split(" ");
    if (parts.length === 3) {
      const nid = parts[1];
      const dob = parts[2];

      const apiURL = `https://apiportal.24worker.shop/api/servercopy.php?user_key=SXT60OVmI&key_pass=AHCmYpMU3u2t&nid=${nid}&dob=${dob}`;

      try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.status === "ok") {
          const message = `👤 নাম: ${data.name} (${data.nameEn})
👨 পিতা: ${data.father}
👩 মাতা: ${data.mother}
📆 জন্ম: ${data.dob}
🩸 রক্ত: ${data.bloodGroup}
📍 ঠিকানা: ${data.perAddress?.slice(0, 100)}...`;

          await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id,
              photo: data.photo,
              caption: message
            })
          });
        } else {
          await sendMessage(chat_id, "❌ তথ্য পাওয়া যায়নি", token);
        }
      } catch (e) {
        await sendMessage(chat_id, "❌ সার্ভার সমস্যা", token);
      }
    } else {
      await sendMessage(chat_id, "⚠️ ব্যবহার: /nid NID DOB\nযেমন: /nid 6931847500 1976-08-15", token);
    }
  } else {
    await sendMessage(chat_id, "👋 স্বাগতম! লিখুন:\n/nid 6931847500 1976-08-15", token);
  }

  return res.status(200).send("OK");
}

async function sendMessage(chat_id, text, token) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text }),
  });
}
