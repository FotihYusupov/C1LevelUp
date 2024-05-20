const TelegramBot = require("node-telegram-bot-api");
const Channels = require("./models/Channels");
const Players = require("./models/Players");

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

module.exports = bot;

const userOpts = {
  reply_markup: {
    keyboard: [
      [{ text: "Sovg'alar 🎁" }, { text: "Ballarim 👤" }],
      [{ text: "Reyting 📊" }, { text: "Shartlar 💡" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

const getNotSubscribedChannels = async (userId) => {
  try {
    const notSubscribedChannels = [];
    const channels = await Channels.find();
    for (item of channels) {
      let result = await bot
        .getChatMember(+item.chatId, userId)
        .catch((err) => {
          notSubscribedChannels.push([
            {
              text: item.name,
              url: item.channelLink,
            },
          ]);
        });
      if (result) {
        if (result.status === "left") {
          notSubscribedChannels.push([
            {
              text: item.name,
              url: item.channelLink,
            },
          ]);
        }
      }
    }
    if (notSubscribedChannels.length > 0) {
      return notSubscribedChannels;
    } else {
      return true;
    }
  } catch (err) {
    return err;
  }
};

const findPlayer = async (chatId) => {
  try {
    const findPlayer = await Players.findOne({ chatId });
    if (!findPlayer) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return err;
  }
};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (msg.text.length > 6) {
    const findPlayer = await Players.findById(msg.text.split(" ")[1]);
    if (findPlayer) {
      if (findPlayer.chatId !== chatId) {
        findPlayer.coin += 5;
        await findPlayer.save();
      }
    }
  }
  const findPlayerRes = await findPlayer(chatId);
  if (findPlayerRes) {
    const result = await getNotSubscribedChannels(userId);
    if (result === true) {
      const findPlayer = await Players.findOne({ chatId });
      const ref = `Sizning refelar havolangiz: https://t.me/C1LevelUpbot?start=${findPlayer._id}`;
      const str = `🎉Tabriklaymiz siz muvofiqiyatli royxatdan o'tdingiz.\n🔗Ushbu refelar havola orqali ko'proq do'stingizni taklif qiling va katta mukofotlarga ega bo'ling.\n⬇️⬇️⬇️\n${ref}`;
      bot.sendMessage(chatId, str, { parse_mode: "Markdown", ...userOpts });
    } else {
      bot.sendMessage(
        chatId,
        `Konkursda ishtirok etish uchun bizning kanalarimizga a'zo bo'lishingiz kerak!`,
        {
          reply_markup: {
            inline_keyboard: [
              ...result,
              [
                {
                  text: "Tekshirish ✅",
                  callback_data: "Tekshirish",
                },
              ],
            ],
          },
        }
      );
    }
    return;
  }
  const result = await getNotSubscribedChannels(userId);
  if (result === true) {
    const opts = {
      reply_markup: {
        keyboard: [[{ text: "Raqamni yuborish", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
    const numberMessage =
      "To'liq royxatdan o'tish uchun iltimos raqamingizni yuboring!";
    bot.sendMessage(chatId, numberMessage, { parse_mode: "Markdown", ...opts });
  } else {
    bot.sendMessage(
      chatId,
      `Konkursda ishtirok etish uchun bizning kanalarimizga a'zo bo'lishingiz kerak!`,
      {
        reply_markup: {
          inline_keyboard: [
            ...result,
            [
              {
                text: "Tekshirish ✅",
                callback_data: "Tekshirish",
              },
            ],
          ],
        },
      }
    );
  }
});

bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  try {
    const newPlayer = new Players({
      username: msg.from.first_name,
      phone: msg.contact.phone_number,
      chatId: chatId,
    });
    await newPlayer.save();

    const ref = `Sizning refelar havolangiz: https://t.me/C1LevelUpbot?start=${newPlayer._id}`;
    const str = `🎉Tabriklaymiz siz muvofiqiyatli royxatdan o'tdingiz.\n🔗Ushbu refelar havola orqali ko'proq do'stingizni taklif qiling va katta mukofotlarga ega bo'ling.\n⬇️⬇️⬇️\n${ref}`;
    bot.sendMessage(chatId, str, { parse_mode: "Markdown", ...userOpts });
  } catch (err) {
    bot.sendMessage(
      chatId,
      "Kechirasiz qandaydir xatolik yuz berdi. Iltimos qaytadan urinib ko'ring. /start"
    );
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  try {
    const userId = query.from.id;
    const data = query.data;
    if (data == "Tekshirish") {
      const result = await getNotSubscribedChannels(userId);
      const findPlayerRes = await findPlayer(chatId);
      if (result === true) {
        if (findPlayerRes) {
          const find = await Players.findOne({ chatId: chatId })
          const ref = `Sizning refelar havolangiz: https://t.me/C1LevelUpbot?start=${find._id}`
          const str = `🎉Tabriklaymiz siz muvofiqiyatli royxatdan o'tdingiz.\n🔗Ushbu refelar havola orqali ko'proq do'stingizni taklif qiling va katta mukofotlarga ega bo'ling.\n⬇️⬇️⬇️\n${ref}`;
          bot.sendMessage(
            chatId,
            str,
            { parse_mode: "Markdown", ...userOpts }
          );
          return;
        }
        const opts = {
          reply_markup: {
            keyboard: [[{ text: "Raqamni yuborish", request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        };
        const numberMessage =
          "To'liq royxatdan o'tish uchun iltimos raqamingizni yuboring!";
        bot.sendMessage(chatId, numberMessage, {
          parse_mode: "Markdown",
          ...opts,
        });
      } else {
        bot.sendMessage(
          chatId,
          `Konkursda ishtirok etish uchun barcha kanallarga a'zo bo'lishingiz kerak!`,
          {
            reply_markup: {
              inline_keyboard: [
                ...result,
                [
                  {
                    text: "Tekshirish ✅",
                    callback_data: "Tekshirish",
                  },
                ],
              ],
            },
          }
        );
      }
    }
  } catch (err) {
    bot.sendMessage(
      chatId,
      "Kechirasiz qandaydir xatolik yuz berdi iltimos qaytadan urinib ko'ring"
    );
  }
});

const text = `
@MULTI_LEVEL_IELTS jamoasi tomonidan 
tashkil qilingan "YUTUQLI KONKURS "   tanlovida ishtirok eting! 🎁

Va bepul kursimizda o'qish imkoniyatini qo'lga kiriting👍

🥇1-OʻRIN:   Multi-level Free Seat 
🥈2-OʻRIN:   Multi-level Free Seat 
 🥉3-OʻRIN:   Multi-level Free Seat 
🏅4 - OʻRIN : Multi-level Free Seat 
🏅5 - OʻRIN :  Multi-level Free Seat 

5 ta odam qo'shgan qolgan barchaga Multi level mock kitobi pdf tashlab beriladi

Tanlov 2 hafta davom etadi va Multi level bepul kursni yutib oling‼️

Ajoyib imkoniyat sizni kutmoqda, imkoniyatni qo'ldan bermang:👇
`;

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "Sovg'alar 🎁") {
    bot.sendPhoto(chatId, "uploads/hero.jpg", { caption: text });
  } else if (msg.text === "Ballarim 👤") {
    const findPlayer = await Players.findOne({chatId})
    bot.sendMessage(chatId, `Sizda ${findPlayer.coin} ball mavjud‼️`);
  } else if (msg.text === "Reyting 📊") {
    const topPlayers = await Players.find().sort({ coin: -1 }).limit(10);
    const playersText = topPlayers.map((e, i) => `🏅${i + 1}-o'rin: ${e.username} • ${e.coin} ball`).join("\n").trim();

    bot.sendMessage(chatId, playersText);
  } else if (msg.text === "Shartlar 💡") {
    bot.sendMessage(
      chatId,
      `
5 ta odam qo'shgan qolgan barchaga Multi level mock kitobi pdf tashlab beriladi

Tanlov 2 hafta davom etadi va Multi level bepul kursni yutib oling!
    
Imkoniyatlar sizni kutmoqda👇👇
    
    `
    );
  }
});
