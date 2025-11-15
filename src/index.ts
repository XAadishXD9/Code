import { Client, EmbedBuilder, GatewayIntentBits, ApplicationCommandOptionType } from "discord.js";
import discordSelfBot from "discord.js-selfbot-v13";
import dotenv from "dotenv";
import utils from "./utils";

dotenv.config();

const OWNER_ID = "1405778722732376176"; // Admin only

// Normal bot client
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

bot.login(process.env.CLIENT_TOKEN);

// Bot Ready
bot.on("ready", async () => {
    console.log(`Bot logged in as ${bot.user?.tag}`);

    const cmds = [
        {
            name: "join",
            description: "Join tokens to server",
            options: [
                {
                    name: "server",
                    description: "Server invite link or ID",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "stock",
            description: "Check how many tokens available"
        },
        {
            name: "checkserver",
            description: "Check if server exists",
            options: [
                {
                    name: "serverid",
                    description: "Server ID",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ];

    bot.application?.commands.set(cmds);
});

// Interaction
bot.on("interactionCreate", async (i) => {
    if (!i.isChatInputCommand()) return;

    // Admin only
    if (i.user.id !== OWNER_ID) {
        return i.reply({ content: "❌ You are not allowed to use this command.", ephemeral: true });
    }

    // ---- /stock ----
    if (i.commandName === "stock") {
        const tokens = utils.getTokens() || [];
        return i.reply(`🟢 **Tokens Loaded:** ${tokens.length}`);
    }

    // ---- /checkserver ----
    if (i.commandName === "checkserver") {
        const id = i.options.getString("serverid")!;
        const guild = bot.guilds.cache.get(id);

        if (!guild) return i.reply("❌ Server not found.");
        return i.reply(`🟢 Found server: **${guild.name}**`);
    }

    // ---- /join ----
    if (i.commandName === "join") {
        const invite = i.options.getString("server")!;
        const tokens = utils.getTokens() || [];

        await i.reply(`🔄 Starting join… (0/${tokens.length})`);

        let done = 0;

        for (const token of tokens) {
            const tClient = new discordSelfBot.Client({
                checkUpdate: false
            });

            // Invisible mode
            tClient.on("ready", async () => {
                try {
                    // Make token invisible
                    tClient.user?.setPresence({
                        status: "invisible"
                    });

                    console.log(`[Token Ready] ${tClient.user?.tag}`);

                    // Auto join
                    await tClient.joinGuild(invite);
                    done++;

                    await i.editReply(`🔄 Joining… (${done}/${tokens.length})`);

                } catch (e) {
                    console.log(`❌ Error with token: ${token}`);
                }

                tClient.destroy();
            });

            await tClient.login(token).catch(() => {
                console.log(`Invalid token: ${token}`);
            });
        }
    }
});
