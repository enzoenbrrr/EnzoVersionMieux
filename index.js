const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');
const askyourpdf = require('./ia');
const reverso = require('./traduction');


const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once("ready", async () => {
    const commands = [
        new SlashCommandBuilder()
        .setName('jp')
        .setDescription('Est-ce que JP est en Live ?'),

        new SlashCommandBuilder()
        .setName('latex')
        .setDescription('Transformer en langage LateX.')
        .addStringOption(option =>
            option.setName('contenu')
            .setDescription('Contenu à transformer en LaTeX.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('taille')
            .setDescription('Taille du renvoi.')
        ),

        new SlashCommandBuilder()
        .setName('ia')
        .setDescription('Parler avec une IA.')
        .addStringOption(option =>
            option.setName('question')
            .setDescription("Contenu pour discuter avec l'IA")
            .setRequired(true)
        )
    ];

    await bot.application.commands.set(commands);

    console.log("Running")
});

function getLatexPng(content, size){
    return `https://latex.codecogs.com/png.latex?%5Cdpi%7B${size}%7D%20%5Cbg_black%20%5Chuge%20`+encodeURI(content)
}


bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "latex") {
        let contenu = interaction.options.getString('contenu');
        let taille = interaction.options.getString('taille');
        if (!taille) {taille = '200';}
        interaction.reply(await getLatexPng(contenu, taille))
    }

    if (interaction.commandName == "ia"){
        contenu = interaction.options.getString('question');
        a = await interaction.reply("Je réflechis...")

        try {
            const response = await askyourpdf(contenu);
            const responseFr = await reverso("eng", "fra", response);
            await a.edit(responseFr)
        } catch (error) {
            console.error("Une erreur s'est produite:", error);
        }
    }

    if (interaction.commandName == "jp"){
        interaction.reply("Je guette attend")
        fetch('https://raw.githubusercontent.com/enzoenbrrr/EnzoVersionMieux/main/check-livestream.js')
        .then(response => response.text())
        .then(scriptContent => {eval(scriptContent);return getKickStatement(); })
        .then(live => {
            console.log(live)
            if(live['status']){
                interaction.channel.send("Jp n'est pas en live uwu.")
            }else{
                const exampleEmbed = {
                    color: 0x42d458,
                    title: 'Jean Pormanove',
                    url: 'https://kick.com/channels/jeanpormanove',
                    description: live["title"],
                    author: {
                        name: 'Sur kick'
                    },
                    thumbnail: {
                        url: "https://static-cdn.jtvnw.net/jtv_user_pictures/cea34708-d71f-445e-963a-b496f68f574f-profile_image-300x300.png",
                    },
                    fields: [
                        {
                            name: "Depuis",
                            value: live['start'],
                        },
                        {
                            name: 'Viewers',
                            value: live['viewers'],
                            inline: true,
                        }
                    ],
                    image: {
                        url: live['thumbnail'],
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'Enzo Version Ameliorée'
                    },
                };
                interaction.channel.send({ embeds: [exampleEmbed] });
            }
            
        })
        
    }

});

const token = 'MTIyNTUzMzg2OTM5OTM0MzM3Nw.G2oqE5.iQgZ3S-hj4bETNkOoIUisV-739uorUixMPCldo';
bot.login(token);