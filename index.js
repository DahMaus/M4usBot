require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/mausbot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/mausbot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/mausbot-ping - Check bot latency
/mausbot-slopball - Ask SlopBall a question and get a random answer
/mausbot-dice - roll a dice between 1 and 6
/mausbot-coinflip - flip a coin :D`
  });
});

app.command("/mausbot-slopball", async ({ ack, respond, command }) => {
  await ack();

  try {
    const anserws = ["Absolutely!", "No way!", "Maybe...", "Definitely not.", "Nah lol!"];
    const randomAnswer = anserws[Math.floor(Math.random() * anserws.length)];
    await respond({ text: `SlopBall says: ${randomAnswer}` });
  }
    catch (error) {
    console.error(error);
    await respond({ text: "An error occurred while processing your request." });
  }
});

app.command("/mausbot-coinflip", async ({ ack, respond, command }) => {
  await ack();

  try {
    if(command.text === "Heads" || command.text === "Tails") {
      await respond({ text: `You chose: ${command.text}` });
    } else {
      await respond({ text: "Please choose either 'Heads' or 'Tails'." });
      return;
    }

    const anserws = ["Heads", "Tails"];
    const randomAnswer = anserws[Math.floor(Math.random() * anserws.length)];

    if(randomAnswer === command.text) {
        await respond({ text: `The coin landed on: ${randomAnswer}. You win!` });
        }
    else if (randomAnswer !== command.text) {
        await respond({ text: `The coin landed on: ${randomAnswer}. You lose!` });
    }
  }
    catch (error) {
    console.error(error);
    await respond({ text: "An error occurred while processing your request." });
  }
});

app.command("/mausbot-dice", async ({ ack, respond }) => {
  await ack();
  const roll = Math.floor(Math.random() * 6) + 1;
  await respond({ text: `You rolled a ${roll}!` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();