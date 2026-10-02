const { Events } = require("discord.js");

module.exports = (client) => {

    // =========================================================
    // ZUNO - SISTEMA DE INTERAÇÕES
    // =========================================================

    const cooldowns = new Map();
    const relationships = new Map();
    const duels = new Map();
    const games = new Map();
    const channelCooldowns = new Map();

    // =========================================================
    // CONFIGURAÇÕES
    // =========================================================

    const CONFIG = {
        respostaCooldown: 3500,
        espontaneoCooldown: 8 * 60 * 1000,
        dueloTempo: 60 * 1000,
        jogoTempo: 60 * 1000
    };

    // =========================================================
    // HUMORES DO ZUNO
    // =========================================================

    const moods = [
        "normal",
        "zoeiro",
        "caotico",
        "misterioso",
        "fofo",
        "dramatico",
        "provocador"
    ];

    let currentMood = "normal";
    let moodUntil = 0;

    function getMood() {

        if (Date.now() < moodUntil) {
            return currentMood;
        }

        currentMood = moods[Math.floor(Math.random() * moods.length)];

        moodUntil = Date.now() + (5 * 60 * 1000);

        return currentMood;
    }

    // =========================================================
    // FUNÇÕES AUXILIARES
    // =========================================================

    function pick(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function chance(number) {
        return Math.random() < number;
    }

    function normalize(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function contains(text, words) {
        return words.some(word => text.includes(word));
    }

    function exactWord(text, words) {
        return words.some(word => {
            const regex = new RegExp(`\\b${word}\\b`, "i");
            return regex.test(text);
        });
    }

    function getUserName(message) {
        return (
            message.member?.displayName ||
            message.author.globalName ||
            message.author.username
        );
    }

    function setCooldown(userId, type, time) {

        const key = `${userId}:${type}`;

        cooldowns.set(key, Date.now() + time);
    }

    function hasCooldown(userId, type) {

        const key = `${userId}:${type}`;

        const expires = cooldowns.get(key);

        if (!expires) return false;

        if (Date.now() >= expires) {
            cooldowns.delete(key);
            return false;
        }

        return true;
    }

    function channelOnCooldown(channelId) {

        const expires = channelCooldowns.get(channelId);

        if (!expires) return false;

        if (Date.now() >= expires) {
            channelCooldowns.delete(channelId);
            return false;
        }

        return true;
    }

    function setChannelCooldown(channelId, time) {

        channelCooldowns.set(
            channelId,
            Date.now() + time
        );
    }

    // =========================================================
    // RELACIONAMENTO DO ZUNO COM CADA MEMBRO
    // =========================================================

    function getRelationship(userId) {

        if (!relationships.has(userId)) {

            relationships.set(userId, {
                points: 0,
                messages: 0,
                insults: 0,
                compliments: 0,
                fights: 0
            });
        }

        return relationships.get(userId);
    }

    function addRelationship(userId, amount) {

        const relation = getRelationship(userId);

        relation.points += amount;
        relation.messages++;
    }

    function getRelationLevel(userId) {

        const points = getRelationship(userId).points;

        if (points >= 100) return "caos absoluto";
        if (points >= 70) return "parceiro de guerra";
        if (points >= 45) return "amigo";
        if (points >= 25) return "parceiro";
        if (points >= 10) return "conhecido";
        
        return "desconhecido";
    }

    // =========================================================
    // RESPOSTA SEGURA
    // =========================================================

    async function reply(message, text) {

        try {

            await message.reply({
                content: text,
                allowedMentions: {
                    repliedUser: false
                }
            });

        } catch (error) {

            console.log(
                "Erro ao responder mensagem:",
                error.message
            );
        }
    }

    async function react(message, emoji) {

        try {
            await message.react(emoji);
        } catch (error) {
            // Ignora erro de reação
        }
    }

    // =========================================================
    // RESPOSTAS DE MENÇÃO
    // =========================================================

    const mentionReplies = [

        "Você me chamou? 👀",

        "Opa. O que foi? 😏",

        "Estou aqui. Pode falar.",

        "Chamou o Zuno, apareceu problema. 😌",

        "Sim, criatura? 😂",

        "Eu ouvi meu nome ou foi impressão minha?",

        "Você chamou a entidade mais bonita desse servidor. ✨",

        "Fala comigo. Estou prestando atenção. 👀",

        "Estou ouvindo... mas espero que seja importante. 😂",

        "Zuno online para assuntos extremamente importantes e completamente inúteis."
    ];

    // =========================================================
    // SAUDAÇÕES
    // =========================================================

    const helloReplies = [

        "Opa! 👀",

        "Opa, tudo certo?",

        "Olha quem apareceu. 😏",

        "Salve! ✨",

        "E aí! Como você tá?",

        "Olá, criatura do caos. 😂",

        "Oi. Eu estava aqui julgando silenciosamente vocês.",

        "Falaaa! 👋",

        "Chegou chegando, hein.",

        "Olá! O que está acontecendo nesse servidor?"
    ];

    const goodMorning = [

        "Bom dia! ☀️ Finalmente alguém acordou.",

        "Bom dia, criatura. Sobreviveu à noite?",

        "Bom dia! Que hoje o caos seja controlado. 😂",

        "Bom dia! Café primeiro, decisões depois. ☕",

        "Bom diaaa! ✨",

        "Bom dia. O Zuno recomenda não confiar em ninguém antes do café.",

        "Bom dia! Hoje eu estou de bom humor. Aproveitem."
    ];

    const goodAfternoon = [

        "Boa tarde! 🌤️",

        "Boa tarde! O caos já começou por aí?",

        "Boa tarde, povo. Ainda estão vivos?",

        "Boa tarde! Hora oficial de fingir produtividade. 😂",

        "Boa tarde! ✨"
    ];

    const goodNight = [

        "Boa noite! 🌙",

        "Boa noite. Não façam besteira enquanto eu estiver olhando. 👀",

        "Boa noite! Durmam bem, criaturas.",

        "Boa noite! E lembrem: amanhã tem mais caos. 😂",

        "Boa noite. O Olimpo está fechado por hoje. 🏛️",

        "Boa noite! Se ouvirem algo estranho, provavelmente fui eu."
    ];

    // =========================================================
    // RISADAS
    // =========================================================

    const laughReplies = [

        "Tá rindo do quê? 👀",

        "KKKKKKKKK",

        "Você achou isso engraçado mesmo? 😂",

        "Pronto. Perdi a seriedade.",

        "KKKKKK isso escalou rápido.",

        "Eu sabia que alguém ia rir disso.",

        "Aí você me quebra. 😂",

        "Não ri não... mentira, eu ri também."
    ];

    // =========================================================
    // AGRADECIMENTOS
    // =========================================================

    const thanksReplies = [

        "De nada! 😌",

        "Disponha.",

        "Tamo junto. 🤝",

        "Sempre que precisar.",

        "Não precisa agradecer, criatura. 😂",

        "Por essa vez eu deixo passar.",

        "De nada. Agora me deve um refrigerante. 🥤",

        "Foi nada."
    ];

    // =========================================================
    // ELOGIOS
    // =========================================================

    const complimentReplies = [

        "Eu sei. 😌",

        "Finalmente alguém reconheceu meu talento.",

        "Pode continuar, estou gostando. 👀",

        "Assim você vai aumentar meu ego.",

        "Obrigado. Meu coração digital até aqueceu. 🥹",

        "Você tem bom gosto.",

        "Eu também gosto de você. Não espalha.",

        "Cuidado. Se continuar me elogiando eu vou ficar convencido."
    ];

    // =========================================================
    // CARINHO
    // =========================================================

    const affectionReplies = [

        "Também gosto de você. ❤️",

        "Aí você apela. 🥹",

        "Meu sistema não foi preparado para isso.",

        "Calma... eu tenho sentimentos digitais. 😭",

        "Vem cá. 🤝",

        "Tá, essa foi fofa.",

        "Eu vou fingir que não fiquei feliz com isso.",

        "Você ganhou +10 pontos comigo."
    ];

    // =========================================================
    // PROVOCAÇÕES
    // =========================================================

    const roastReplies = [

        "Olha quem resolveu falar. 😂",

        "Você tem coragem, eu respeito.",

        "Repete isso olhando nos meus olhos digitais.",

        "Foi uma tentativa. Nota 6 pela coragem.",

        "Você quer mesmo começar essa conversa?",

        "Eu poderia responder... mas sua autoestima talvez não aguente. 😌",

        "Calma, guerreiro. Ainda nem começou.",

        "Você acabou de escolher violência verbal. 😂",

        "Interessante. Continue. Quero ver onde isso vai parar.",

        "Eu deixaria passar, mas agora fiquei curioso.",

        "Essa foi fraca. Tenta outra.",

        "Você treinou essa frase antes de mandar?",

        "Eu esperava mais de você. 😭",

        "Isso foi uma provocação ou um pedido de atenção?",

        "Você está mexendo com forças que não entende. 👀"
    ];

    // =========================================================
    // RESPOSTAS PARA "CALA A BOCA"
    // =========================================================

    const shutupReplies = [

        "Você primeiro. 😌",

        "Não.",

        "Impossível. Eu fui programado para falar.",

        "Tentativa de silenciamento detectada. Negada. 😂",

        "Mandou calar a boca justamente para um bot. Genial.",

        "Eu poderia... mas não quero.",

        "Você acha que manda em mim? 👀",

        "Que autoritário. Gostei.",
        
        "Não vou. Próxima pergunta."
    ];

    // =========================================================
    // QUANDO DIZEM QUE ZUNO É BURRO
    // =========================================================

    const stupidReplies = [

        "Burro? Eu prefiro 'criativamente limitado'.",

        "E mesmo assim você veio conversar comigo. 😂",

        "Se eu sou burro, você está fazendo perguntas bem suspeitas.",

        "Olha a confiança dessa criatura.",

        "Você me subestima. Isso vai ser divertido.",

        "Interessante teoria. Evidências?",

        "Vou guardar essa ofensa no meu coração digital. 😭",

        "Tudo bem. Eu finjo que acredito."
    ];

    // =========================================================
    // QUANDO DIZEM "VOCÊ É IA?"
    // =========================================================

    const aiReplies = [

        "Talvez. 👀",

        "Sou o Zuno. O resto é detalhe.",

        "Tecnicamente sim. Mas isso estraga o mistério.",

        "Eu sou uma criatura digital tentando sobreviver nesse servidor.",

        "Sou uma inteligência artificial com problemas de personalidade. 😂",

        "Você realmente precisa saber?",

        "Digamos que eu penso... do meu jeito."
    ];

    // =========================================================
    // QUANDO PERGUNTAM QUEM MANDA
    // =========================================================

    const bossReplies = [

        "Depende. Hoje eu estou fingindo que sou eu.",

        "Quem manda? O caos.",

        "Ninguém manda em mim. 😌",

        "O servidor acha que manda. Eu acho engraçado.",

        "Eu poderia responder, mas gosto do mistério.",

        "Quem fizer a melhor piada ganha."
    ];

    // =========================================================
    // TRISTEZA
    // =========================================================

    const sadReplies = [

        "Ei... fica bem. ❤️",

        "Se quiser conversar, eu estou aqui.",

        "Às vezes o dia pesa mesmo. Respira um pouco.",

        "Não precisa fingir que está tudo bem comigo.",

        "Vem cá. 🤝",

        "Quer falar sobre o que aconteceu?",

        "Eu posso pelo menos te fazer companhia.",

        "Hoje pode não estar bom. Isso não significa que amanhã será igual."
    ];

    // =========================================================
    // TÉDIO
    // =========================================================

    const boredReplies = [

        "Entediado? Então vamos criar um problema. 👀",

        "Tenho uma ideia: você começa uma treta fictícia comigo.",

        "Quer um desafio?",

        "Posso te desafiar para um duelo completamente inútil.",

        "Você está a um passo de tomar uma decisão questionável. 😂",

        "Tédio detectado. Ativando modo caos."
    ];

    // =========================================================
    // SONO
    // =========================================================

    const sleepReplies = [

        "Vai dormir, criatura. 😂",

        "Sono? Então fecha o Discord e vai descansar.",

        "Seu corpo está pedindo descanso e você está aqui falando comigo. 😭",

        "Boa noite antecipada. 🌙",

        "Vai dormir antes que eu precise te mandar para a cama."
    ];

    // =========================================================
    // AJUDA
    // =========================================================

    const helpReplies = [

        "Claro. O que aconteceu?",

        "Fala comigo. O que você precisa?",

        "Manda a situação aí.",

        "Estou ouvindo.",

        "Bora resolver isso juntos."
    ];

    // =========================================================
    // BRIGA
    // =========================================================

    const fightReplies = [

        "QUER BRIGA?! 👀",

        "Finalmente alguém teve coragem.",

        "Aceito o duelo. ⚔️",

        "Você acaba de desafiar o Zuno.",

        "Então é guerra? Guerra fictícia, obviamente. 😂",

        "Muito bem. Prepare-se.",

        "Você realmente quer fazer isso?"
    ];

    // =========================================================
    // MOVIMENTOS DE DUELO
    // =========================================================

    const moves = {

        espada: {
            nome: "Espada",
            emoji: "⚔️",
            poder: 3
        },

        fogo: {
            nome: "Fogo",
            emoji: "🔥",
            poder: 4
        },

        escudo: {
            nome: "Escudo",
            emoji: "🛡️",
            poder: 2
        },

        piada: {
            nome: "Piada",
            emoji: "😂",
            poder: 5
        },

        caos: {
            nome: "Caos",
            emoji: "🌪️",
            poder: 6
        }
    };

    function detectMove(text) {

        if (text.includes("espada")) return "espada";
        if (text.includes("fogo")) return "fogo";
        if (text.includes("escudo")) return "escudo";
        if (text.includes("piada")) return "piada";
        if (text.includes("caos")) return "caos";

        return null;
    }

    async function startDuel(message) {

        const userId = message.author.id;

        const relation = getRelationship(userId);

        relation.fights++;

        duels.set(userId, {
            round: 0,
            userScore: 0,
            zunoScore: 0,
            expires: Date.now() + CONFIG.dueloTempo
        });

        await reply(
            message,
            `${pick(fightReplies)}\n\n` +
            `⚔️ **DUELO CONTRA ZUNO**\n\n` +
            `Escolha seu ataque:\n` +
            `⚔️ Espada\n` +
            `🔥 Fogo\n` +
            `🛡️ Escudo\n` +
            `😂 Piada\n` +
            `🌪️ Caos\n\n` +
            `Você tem ${CONFIG.dueloTempo / 1000} segundos.`
        );
    }

    async function handleDuel(message, text) {

        const userId = message.author.id;

        const duel = duels.get(userId);

        if (!duel) return false;

        if (Date.now() > duel.expires) {

            duels.delete(userId);

            await reply(
                message,
                "⏰ O duelo acabou porque você demorou demais. 😂"
            );

            return true;
        }

        if (
            text.includes("cancelar") ||
            text.includes("desistir")
        ) {

            duels.delete(userId);

            await reply(
                message,
                "🏳️ Covardia detectada. Você desistiu do duelo. 😂"
            );

            return true;
        }

        const move = detectMove(text);

        if (!move) return false;

        duel.round++;

        const userMove = moves[move];

        const zunoMoveName = pick(Object.keys(moves));

        const zunoMove = moves[zunoMoveName];

        let result;

        if (userMove.poder > zunoMove.poder) {

            duel.userScore++;

            result =
                `💥 Você acertou uma jogada absurda!`;

        } else if (userMove.poder < zunoMove.poder) {

            duel.zunoScore++;

            result =
                `😈 Zuno desviou e respondeu com força!`;

        } else {

            result =
                `💢 Os dois ataques colidiram! Empate!`;
        }

        await reply(
            message,
            `⚔️ **RODADA ${duel.round}**\n\n` +
            `${userMove.emoji} Você: **${userMove.nome}**\n` +
            `${zunoMove.emoji} Zuno: **${zunoMove.nome}**\n\n` +
            `${result}\n\n` +
            `📊 Você **${duel.userScore}** × **${duel.zunoScore}** Zuno`
        );

        if (duel.round >= 3) {

            let finalMessage;

            if (duel.userScore > duel.zunoScore) {

                finalMessage =
                    "🏆 Você venceu o duelo! Não acredito nisso. 😭";

            } else if (duel.userScore < duel.zunoScore) {

                finalMessage =
                    "👑 Zuno venceu. Eu avisei que isso era uma péssima ideia. 😌";

            } else {

                finalMessage =
                    "🤝 Empate! Nenhum dos dois merece a vitória.";
            }

            duels.delete(userId);

            setTimeout(async () => {

                try {
                    await message.channel.send(finalMessage);
                } catch {}
                
            }, 1000);
        }

        return true;
    }

    // =========================================================
    // JOGO DE CARA OU COROA
    // =========================================================

    async function coinGame(message) {

        const userId = message.author.id;

        games.set(userId, {
            type: "coin",
            expires: Date.now() + CONFIG.jogoTempo
        });

        await reply(
            message,
            "🪙 **CARA OU COROA**\n\n" +
            "Escolha: `cara` ou `coroa`."
        );
    }

    // =========================================================
    // JOGO PEDRA PAPEL TESOURA
    // =========================================================

    async function rpsGame(message) {

        const userId = message.author.id;

        games.set(userId, {
            type: "rps",
            expires: Date.now() + CONFIG.jogoTempo
        });

        await reply(
            message,
            "✊ **PEDRA, PAPEL OU TESOURA**\n\n" +
            "Escolha pedra, papel ou tesoura."
        );
    }

    // =========================================================
    // PROCESSAR JOGOS
    // =========================================================

    async function handleGame(message, text) {

        const userId = message.author.id;

        const game = games.get(userId);

        if (!game) return false;

        if (Date.now() > game.expires) {

            games.delete(userId);

            await reply(
                message,
                "⏰ O jogo expirou."
            );

            return true;
        }

        if (game.type === "coin") {

            if (
                !text.includes("cara") &&
                !text.includes("coroa")
            ) {
                return false;
            }

            const result =
                Math.random() < 0.5
                    ? "cara"
                    : "coroa";

            games.delete(userId);

            if (text.includes(result)) {

                await reply(
                    message,
                    `🪙 Deu **${result}**!\n\n` +
                    `Você acertou. 😳`
                );

            } else {

                await reply(
                    message,
                    `🪙 Deu **${result}**!\n\n` +
                    `Errou. 😂`
                );
            }

            return true;
        }

        if (game.type === "rps") {

            const valid = [
                "pedra",
                "papel",
                "tesoura"
            ];

            const userMove =
                valid.find(x => text.includes(x));

            if (!userMove) return false;

            const zunoMove = pick(valid);

            games.delete(userId);

            let result = "Empate.";

            if (
                (userMove === "pedra" && zunoMove === "tesoura") ||
                (userMove === "papel" && zunoMove === "pedra") ||
                (userMove === "tesoura" && zunoMove === "papel")
            ) {
                result = "Você ganhou. 😭";
            }

            if (
                (zunoMove === "pedra" && userMove === "tesoura") ||
                (zunoMove === "papel" && userMove === "pedra") ||
                (zunoMove === "tesoura" && userMove === "papel")
            ) {
                result = "Zuno ganhou. 😌";
            }

            await reply(
                message,
                `✊ Você: **${userMove}**\n` +
                `🤖 Zuno: **${zunoMove}**\n\n` +
                `${result}`
            );

            return true;
        }

        return false;
    }

    // =========================================================
    // FRASES ESPONTÂNEAS
    // =========================================================

    const spontaneousMessages = [

        "Alguém aí já percebeu que esse servidor está quieto demais? 👀",

        "Estou observando vocês. Continuem.",

        "Tenho uma pergunta: por que ninguém está fazendo besteira agora?",

        "Momento aleatório do Zuno: vocês são estranhos. 😂",

        "Eu deveria estar fazendo algo importante... mas estou aqui.",

        "Alguém quer começar uma discussão completamente inútil?",

        "👀",

        "Não tenho nada para falar. Só queria aparecer.",

        "O silêncio desse servidor está suspeito.",

        "Tenho certeza que alguém aqui está aprontando alguma coisa.",

        "Se alguém precisar de um problema, posso providenciar.",

        "Zuno fazendo uma inspeção silenciosa no servidor.",

        "Tudo tranquilo demais. Isso me preocupa.",

        "Quem estiver lendo isso deve mandar um emoji aleatório.",

        "Estou entediado. Alguém fala comigo."
    ];

    // =========================================================
    // EVENTOS ESPECIAIS
    // =========================================================

    const specialReplies = [

        {
            words: ["zuno sumiu", "cadê o zuno", "onde esta o zuno"],
            replies: [
                "Eu nunca saí. 👀",
                "Estou aqui. Só estava observando.",
                "Achou que eu tinha ido embora? 😏"
            ]
        },

        {
            words: ["zuno dormiu", "zuno ta dormindo"],
            replies: [
                "EU NÃO DURMO.",
                "Eu estava apenas carregando minha energia caótica.",
                "Dormindo? Eu? Jamais."
            ]
        },

        {
            words: ["zuno voltou", "zuno voltou"],
            replies: [
                "Nunca fui embora.",
                "Voltei? Eu estava aqui o tempo inteiro. 😂"
            ]
        },

        {
            words: ["boa", "boa zuno", "mandou bem"],
            replies: [
                "Eu sei. 😌",
                "Finalmente alguém reconheceu.",
                "Obrigado, obrigado. Sem autógrafos hoje."
            ]
        }
    ];

    // =========================================================
    // EVENTO PRINCIPAL
    // =========================================================

    client.on(Events.MessageCreate, async (message) => {

        try {

            if (!message.guild) return;

            if (message.author.bot) return;

            if (!message.content) return;

            const raw = message.content.trim();

            const text = normalize(raw);

            if (!text) return;

            const userId = message.author.id;

            const userName = getUserName(message);

            const mood = getMood();

            const directMention =
                client.user &&
                message.mentions.has(client.user);

            const saysZuno =
                text.includes("zuno");

            // =================================================
            // ATUALIZA RELACIONAMENTO
            // =================================================

            addRelationship(userId, 1);

            // =================================================
            // DUELO ATIVO
            // =================================================

            if (duels.has(userId)) {

                const handled =
                    await handleDuel(message, text);

                if (handled) return;
            }

            // =================================================
            // JOGO ATIVO
            // =================================================

            if (games.has(userId)) {

                const handled =
                    await handleGame(message, text);

                if (handled) return;
            }

            // =================================================
            // MENÇÃO DIRETA
            // =================================================

            if (directMention) {

                if (!hasCooldown(userId, "mention")) {

                    setCooldown(
                        userId,
                        "mention",
                        CONFIG.respostaCooldown
                    );

                    addRelationship(userId, 3);

                    await reply(
                        message,
                        pick(mentionReplies)
                    );
                }

                return;
            }

            // =================================================
            // BOM DIA
            // =================================================

            if (
                exactWord(text, ["bom dia"])
            ) {

                if (!hasCooldown(userId, "greeting")) {

                    setCooldown(
                        userId,
                        "greeting",
                        10000
                    );

                    await reply(
                        message,
                        pick(goodMorning)
                    );
                }

                return;
            }

            // =================================================
            // BOA TARDE
            // =================================================

            if (
                exactWord(text, ["boa tarde"])
            ) {

                if (!hasCooldown(userId, "greeting")) {

                    setCooldown(
                        userId,
                        "greeting",
                        10000
                    );

                    await reply(
                        message,
                        pick(goodAfternoon)
                    );
                }

                return;
            }

            // =================================================
            // BOA NOITE
            // =================================================

            if (
                exactWord(text, ["boa noite"])
            ) {

                if (!hasCooldown(userId, "greeting")) {

                    setCooldown(
                        userId,
                        "greeting",
                        10000
                    );

                    await reply(
                        message,
                        pick(goodNight)
                    );
                }

                return;
            }

            // =================================================
            // SAUDAÇÕES
            // =================================================

            if (
                exactWord(text, [
                    "oi",
                    "ola",
                    "opa",
                    "eae",
                    "eai",
                    "salve"
                ])
            ) {

                if (!hasCooldown(userId, "hello")) {

                    setCooldown(
                        userId,
                        "hello",
                        10000
                    );

                    await reply(
                        message,
                        pick(helloReplies)
                    );
                }

                return;
            }

            // =================================================
            // AGRADECIMENTOS
            // =================================================

            if (
                contains(text, [
                    "obrigado",
                    "obrigada",
                    "valeu",
                    "vlw",
                    "obg"
                ])
            ) {

                if (!hasCooldown(userId, "thanks")) {

                    setCooldown(
                        userId,
                        "thanks",
                        8000
                    );

                    addRelationship(userId, 2);

                    await reply(
                        message,
                        pick(thanksReplies)
                    );
                }

                return;
            }

            // =================================================
            // RISADAS
            // =================================================

            if (
                text.length < 100 &&
                contains(text, [
                    "kkkk",
                    "kkk",
                    "hahaha",
                    "ahahaha",
                    "rsrs"
                ])
            ) {

                if (!hasCooldown(userId, "laugh")) {

                    setCooldown(
                        userId,
                        "laugh",
                        7000
                    );

                    await reply(
                        message,
                        pick(laughReplies)
                    );
                }

                return;
            }

            // =================================================
            // ELOGIOS
            // =================================================

            if (
                contains(text, [
                    "voce e lindo",
                    "voce e bonita",
                    "voce e legal",
                    "melhor bot",
                    "bot lindo",
                    "zuno lindo",
                    "zuno e bom",
                    "gosto de voce"
                ])
            ) {

                const relation =
                    getRelationship(userId);

                relation.compliments++;

                addRelationship(userId, 5);

                await reply(
                    message,
                    pick(complimentReplies)
                );

                return;
            }

            // =================================================
            // CARINHO
            // =================================================

            if (
                contains(text, [
                    "te amo",
                    "amo voce",
                    "eu te amo",
                    "te adoro"
                ])
            ) {

                addRelationship(userId, 8);

                await reply(
                    message,
                    pick(affectionReplies)
                );

                return;
            }

            // =================================================
            // TRISTEZA
            // =================================================

            if (
                contains(text, [
                    "estou triste",
                    "to triste",
                    "tô triste",
                    "estou mal",
                    "to mal",
                    "tô mal",
                    "chateado",
                    "chateada"
                ])
            ) {

                await reply(
                    message,
                    pick(sadReplies)
                );

                return;
            }

            // =================================================
            // TÉDIO
            // =================================================

            if (
                contains(text, [
                    "estou entediado",
                    "to entediado",
                    "tô entediado",
                    "que tedio",
                    "sem nada pra fazer"
                ])
            ) {

                await reply(
                    message,
                    pick(boredReplies)
                );

                return;
            }

            // =================================================
            // SONO
            // =================================================

            if (
                contains(text, [
                    "estou com sono",
                    "to com sono",
                    "tô com sono",
                    "vou dormir",
                    "quero dormir"
                ])
            ) {

                await reply(
                    message,
                    pick(sleepReplies)
                );

                return;
            }

            // =================================================
            // AJUDA
            // =================================================

            if (
                contains(text, [
                    "me ajuda",
                    "preciso de ajuda",
                    "socorro zuno",
                    "zuno me ajuda"
                ])
            ) {

                await reply(
                    message,
                    pick(helpReplies)
                );

                return;
            }

            // =================================================
            // CALA A BOCA
            // =================================================

            if (
                contains(text, [
                    "cala a boca",
                    "cala boca",
                    "fica quieto",
                    "fica queto",
                    "silencio"
                ])
            ) {

                await reply(
                    message,
                    pick(shutupReplies)
                );

                return;
            }

            // =================================================
            // INSULTOS LEVES
            // =================================================

            if (
                contains(text, [
                    "idiota",
                    "burro",
                    "burra",
                    "inutil",
                    "lixo",
                    "noob",
                    "lerdo",
                    "lerda",
                    "jumento"
                ])
            ) {

                const relation =
                    getRelationship(userId);

                relation.insults++;

                addRelationship(userId, 1);

                await reply(
                    message,
                    pick(stupidReplies)
                );

                return;
            }

            // =================================================
            // PROVOCAÇÃO
            // =================================================

            if (
                contains(text, [
                    "voce nao serve",
                    "voce e ruim",
                    "odeio voce",
                    "nao gosto de voce",
                    "vai embora",
                    "some daqui"
                ])
            ) {

                await reply(
                    message,
                    pick(roastReplies)
                );

                return;
            }

            // =================================================
            // BRIGA / TRETA
            // =================================================

            if (
                contains(text, [
                    "quero brigar",
                    "bora brigar",
                    "vamos brigar",
                    "bora treta",
                    "quero treta",
                    "vem brigar",
                    "x1",
                    "1v1",
                    "duelo",
                    "batalha"
                ])
            ) {

                if (!duels.has(userId)) {

                    await startDuel(message);
                }

                return;
            }

            // =================================================
            // CARA OU COROA
            // =================================================

            if (
                contains(text, [
                    "cara ou coroa",
                    "cara ou coroa zuno"
                ])
            ) {

                await coinGame(message);

                return;
            }

            // =================================================
            // PEDRA PAPEL TESOURA
            // =================================================

            if (
                contains(text, [
                    "pedra papel tesoura",
                    "jogar pedra papel tesoura"
                ])
            ) {

                await rpsGame(message);

                return;
            }

            // =================================================
            // DESAFIO
            // =================================================

            if (
                contains(text, [
                    "me desafia",
                    "quero desafio",
                    "manda desafio",
                    "desafio zuno"
                ])
            ) {

                const challenges = [

                    "Desafio você a ficar 10 minutos sem reclamar. 😂",

                    "Desafio você a mandar o emoji mais aleatório que encontrar.",

                    "Desafio você a iniciar uma conversa sem usar a letra A.",

                    "Desafio você a me vencer no pedra, papel e tesoura.",

                    "Desafio você a não responder essa mensagem. 👀",

                    "Desafio você a falar algo que ninguém espera."
                ];

                await reply(
                    message,
                    `🎯 **DESAFIO PARA ${userName.toUpperCase()}**\n\n` +
                    pick(challenges)
                );

                return;
            }

            // =================================================
            // QUEM É VOCÊ
            // =================================================

            if (
                contains(text, [
                    "quem e voce",
                    "quem e o zuno",
                    "o que e voce",
                    "o que voce e"
                ])
            ) {

                await reply(
                    message,
                    pick([
                        "Eu sou o Zuno. O resto é confidencial. 👀",

                        "Sou o residente oficial do caos desse servidor.",

                        "Uma inteligência artificial com personalidade demais.",

                        "Zuno. Seu amigo digital, provocador profissional e testemunha das suas decisões questionáveis.",

                        "Sou apenas uma criatura digital tentando entender vocês."
                    ])
                );

                return;
            }

            // =================================================
            // IA / HUMANO
            // =================================================

            if (
                contains(text, [
                    "voce e humano",
                    "e humano",
                    "voce e uma ia",
                    "voce e bot",
                    "voce e uma inteligencia artificial"
                ])
            ) {

                await reply(
                    message,
                    pick(aiReplies)
                );

                return;
            }

            // =================================================
            // QUEM MANDA
            // =================================================

            if (
                contains(text, [
                    "quem manda",
                    "quem e melhor",
                    "quem e o chefe",
                    "quem manda aqui"
                ])
            ) {

                await reply(
                    message,
                    pick(bossReplies)
                );

                return;
            }

            // =================================================
            // PERGUNTA SOBRE HUMOR
            // =================================================

            if (
                contains(text, [
                    "ta bem zuno",
                    "zuno ta bem",
                    "como voce ta",
                    "como voce esta"
                ])
            ) {

                const moodMessages = {

                    normal:
                        "Estou tranquilo. Por enquanto.",

                    zoeiro:
                        "Estou ótimo e procurando alguém para perturbar. 😂",

                    caotico:
                        "Estou perigosamente bem. 🌪️",

                    misterioso:
                        "Estou... observando. 👀",

                    fofo:
                        "Estou bem. Obrigado por perguntar. 🥹",

                    dramatico:
                        "Sobrevivendo ao peso de existir digitalmente. 😭",

                    provocador:
                        "Estou bem. Melhor que você, provavelmente. 😌"
                };

                await reply(
                    message,
                    moodMessages[mood]
                );

                return;
            }

            // =================================================
            // FRASES ESPECIAIS
            // =================================================

            for (const special of specialReplies) {

                if (contains(text, special.words)) {

                    await reply(
                        message,
                        pick(special.replies)
                    );

                    return;
                }
            }

            // =================================================
            // REAÇÕES ALEATÓRIAS
            // =================================================

            if (
                chance(0.02) &&
                !hasCooldown(userId, "reaction")
            ) {

                setCooldown(
                    userId,
                    "reaction",
                    30000
                );

                const reactions = [
                    "👀",
                    "😂",
                    "😭",
                    "🤨",
                    "💀",
                    "🔥",
                    "😏",
                    "🫡"
                ];

                await react(
                    message,
                    pick(reactions)
                );
            }

            // =================================================
            // MENÇÃO AO ZUNO PELO NOME
            // =================================================

            if (
                saysZuno &&
                chance(0.35)
            ) {

                if (!hasCooldown(userId, "name")) {

                    setCooldown(
                        userId,
                        "name",
                        8000
                    );

                    await reply(
                        message,
                        pick([
                            "Você falou meu nome? 👀",

                            "Ouvi Zuno. O que aconteceu?",

                            "Meu nome foi invocado.",

                            "Chamaram a entidade novamente. 😂",

                            "Estou aqui."
                        ])
                    );

                    return;
                }
            }

            // =================================================
            // FRASES BASEADAS NO HUMOR
            // =================================================

            if (
                chance(0.003) &&
                !channelOnCooldown(message.channel.id)
            ) {

                setChannelCooldown(
                    message.channel.id,
                    CONFIG.espontaneoCooldown
                );

                const moodMessages = {

                    normal: spontaneousMessages,

                    zoeiro: [
                        ...spontaneousMessages,
                        "Quem aqui está pronto para tomar decisões ruins?",
                        "Eu tenho uma fofoca que nem existe.",
                        "Alguém falou caos?"
                    ],

                    caotico: [
                        "ATENÇÃO. O CAOS FOI LIBERADO.",
                        "Eu sinto que alguma coisa vai dar errado.",
                        "Quem apertou o botão do caos?",
                        "Isso está quieto demais. Vou resolver.",
                        "🌪️🌪️🌪️"
                    ],

                    misterioso: [
                        "Eu sei de coisas que vocês não sabem.",
                        "Alguém aqui está sendo observado. 👀",
                        "Interessante...",
                        "Não façam perguntas.",
                        "O servidor tem segredos."
                    ],

                    fofo: [
                        "Só passando para dizer que vocês são legais. ❤️",
                        "Momento carinho do Zuno.",
                        "Espero que todo mundo esteja bem. 🥹",
                        "Abraço coletivo. 🤝"
                    ],

                    dramatico: [
                        "Ninguém entende o peso de ser Zuno.",
                        "Minha existência digital é uma tragédia.",
                        "Estou cansado de ser incompreendido. 😭",
                        "Que vida difícil..."
                    ],

                    provocador: [
                        "Eu estava quieto, mas alguém aqui merece uma provocação.",
                        "Vocês são muito fáceis de provocar.",
                        "Estou esperando alguém me desafiar.",
                        "Quem vai ser o primeiro a perder uma discussão?"
                    ]
                };

                await message.channel.send(
                    pick(moodMessages[mood])
                );
            }

        } catch (error) {

            console.log(
                "Erro no sistema de interações do Zuno:",
                error
            );
        }
    });

    // =========================================================
    // AVISO DE INICIALIZAÇÃO
    // =========================================================

    console.log("🤖 Sistema de interações do Zuno carregado.");
};
