const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {

    // =========================================================
    // CONFIGURAÇÃO
    // =========================================================

    const CONFIG = {
        mainChannelId: "1545947041216077955",

        userCooldown: 2500,
        spontaneousCooldown: 8 * 60 * 1000,
        spontaneousChance: 0.018,

        learningFile: path.join(
            process.cwd(),
            "database",
            "zuno_memory.json"
        ),

        learningLimit: 2500,
        learningThreshold: 0.58
    };

    // =========================================================
    // MEMÓRIA
    // =========================================================

    const users = new Map();
    const cooldowns = new Map();
    const recentResponses = new Map();
    const conversations = new Map();

    let learnedResponses = [];
    let saveTimer = null;
    let lastSpontaneous = 0;

    // =========================================================
    // BANCO DE APRENDIZADO
    // =========================================================

    function ensureDatabase() {
        const dir = path.dirname(CONFIG.learningFile);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (!fs.existsSync(CONFIG.learningFile)) {
            fs.writeFileSync(
                CONFIG.learningFile,
                "[]",
                "utf8"
            );
        }
    }

    function loadMemory() {
        try {
            ensureDatabase();

            const data = fs.readFileSync(
                CONFIG.learningFile,
                "utf8"
            );

            const parsed = JSON.parse(data);

            if (Array.isArray(parsed)) {
                learnedResponses = parsed;
            }
        } catch (err) {
            console.log("❌ Erro carregando memória:", err.message);
            learnedResponses = [];
        }
    }

    function saveMemory() {
        clearTimeout(saveTimer);

        saveTimer = setTimeout(() => {
            try {
                ensureDatabase();

                fs.writeFileSync(
                    CONFIG.learningFile,
                    JSON.stringify(learnedResponses, null, 2),
                    "utf8"
                );
            } catch (err) {
                console.log("❌ Erro salvando memória:", err.message);
            }
        }, 500);
    }

    loadMemory();

    // =========================================================
    // TEXTO
    // =========================================================

    function normalize(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s!?.,'-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function words(text) {
        return normalize(text)
            .split(/\s+/)
            .filter(Boolean);
    }

    function similarity(a, b) {
        const wa = new Set(words(a));
        const wb = new Set(words(b));

        if (!wa.size || !wb.size) return 0;

        let common = 0;

        for (const word of wa) {
            if (wb.has(word)) common++;
        }

        const union = new Set([...wa, ...wb]).size;

        const jaccard = common / union;
        const coverage = common / Math.max(wa.size, 1);

        const length =
            Math.min(wa.size, wb.size) /
            Math.max(wa.size, wb.size);

        return (
            jaccard * 0.45 +
            coverage * 0.40 +
            length * 0.15
        );
    }

    // =========================================================
    // FILTRO DE COMANDOS / FRASES SENSÍVEIS
    // =========================================================

    function isCommand(text) {
        return /^[\/,!.,;]/.test(text.trim());
    }

    function isSerious(text) {
        const t = normalize(text);

        const blocked = [
            "me matar",
            "me suicidar",
            "suicidio",
            "tirar minha vida",
            "acabar com minha vida",
            "me cortar",
            "me machucar",
            "automutilacao"
        ];

        return blocked.some(x => t.includes(x));
    }

    // =========================================================
    // ESTILO DE TEXTO
    // =========================================================

    const FONT = {
        a: "ᴀ",
        b: "ʙ",
        c: "ᴄ",
        d: "ᴅ",
        e: "ᴇ",
        f: "ғ",
        g: "ɢ",
        h: "ʜ",
        i: "ɪ",
        j: "ᴊ",
        k: "ᴋ",
        l: "ʟ",
        m: "ᴍ",
        n: "ɴ",
        o: "ᴏ",
        p: "ᴘ",
        q: "ǫ",
        r: "ʀ",
        s: "s",
        t: "ᴛ",
        u: "ᴜ",
        v: "ᴠ",
        w: "ᴡ",
        x: "x",
        y: "ʏ",
        z: "ᴢ"
    };

    function fancy(text) {
        if (!text) return text;

        if (
            text.length > 240 ||
            text.includes("```") ||
            text.includes("<@")
        ) {
            return text;
        }

        return String(text)
            .split("")
            .map(char => {
                const lower = char.toLowerCase();

                if (FONT[lower]) {
                    return FONT[lower];
                }

                return char;
            })
            .join("");
    }

    // =========================================================
    // RESPOSTAS
    // =========================================================

    const RESPONSES = {

        greeting: [
            "Opa! 👀",
            "Opa, chegou! 😎",
            "E aí! Como você tá?",
            "Salve! 🖤",
            "Falaaa!",
            "Opa, tudo certo por aí?",
            "Finalmente apareceu por aqui kkk",
            "E aí, criatura 😂",
            "Fala comigo!",
            "Tô por aqui 👀",
            "Salve, parceiro!",
            "Opa! O Zuno chegou.",
            "Eae! Bora conversar?",
            "Oláá! 🖤",
            "Opa! Qual é a boa?"
        ],

        affection: [
            "Aí você quebra meu sistema 😳🖤",
            "Desse jeito eu fico sem resposta kkk",
            "Você é gente boa demais.",
            "Também gosto de trocar ideia contigo 🖤",
            "Calma aí, vou ficar convencido desse jeito 😂",
            "Essa foi bonita.",
            "Recebido com sucesso 🖤",
            "Tu é brabo.",
            "Essa eu vou guardar na memória 😎"
        ],

        compliment: [
            "Eu sei, eu sou incrível mesmo 😎",
            "Aí sim! Obrigado 🖤",
            "Desse jeito meu ego vai subir.",
            "Valeu! Você também manda bem.",
            "Recebi o elogio oficialmente.",
            "KKKK valeu!",
            "Agora eu fiquei feliz.",
            "Essa foi boa demais."
        ],

        thanks: [
            "Tamo junto! 🖤",
            "Disponha!",
            "Sempre que precisar.",
            "Nadaaa!",
            "É nóis.",
            "Por nada 😎",
            "Pode chamar.",
            "Tamo junto nessa."
        ],

        laugh: [
            "KKKKKKKK",
            "Aí não 😂",
            "Mano KKKKK",
            "Não tankei isso.",
            "KKKKKK eu não esperava.",
            "Essa foi de quebrar.",
            "Tu é impossível 😂",
            "KKKKKKKKKK"
        ],

        bored: [
            "Tá entediado? Então bora inventar alguma coisa.",
            "O tédio chegou pesado aí? 😂",
            "Quer conversar sobre alguma coisa?",
            "Bora arrumar uma diversão.",
            "Tédio é perigoso kkk.",
            "Eu tenho uma ideia: me chama pra trocar ideia.",
            "Então fica por aqui comigo.",
            "Vamos fazer alguma coisa interessante."
        ],

        sad: [
            "Ei... fica tranquilo. Tô aqui pra conversar contigo.",
            "Se quiser falar sobre o que aconteceu, pode falar.",
            "Às vezes colocar pra fora ajuda.",
            "Não precisa fingir que tá tudo bem comigo.",
            "Tô te ouvindo.",
            "Se quiser conversar, manda aí.",
            "Você não precisa carregar tudo sozinho."
        ],

        sleep: [
            "Boa noite! Descansa bem. 🖤",
            "Vai descansar, criatura 😂",
            "Dorme bem!",
            "Boa noite! Até depois.",
            "Descansa aí.",
            "Que você tenha uma noite tranquila.",
            "Vai dormir antes que eu mande você ir kkk"
        ],

        insult: [
            "Olha o respeito comigo 😂",
            "Calma aí, campeão.",
            "Tá nervoso? KKKK",
            "Eu vou fingir que não ouvi.",
            "Que isso rapaz 😂",
            "Agressividade gratuita detectada.",
            "Vou anotar essa ofensa no meu caderninho imaginário."
        ],

        provocation: [
            "Tá querendo me provocar? 👀",
            "Você tá procurando problema kkk.",
            "Eu vi isso aí.",
            "Calma que eu também sei provocar 😂",
            "Começou...",
            "Vai nessa não.",
            "Tá se achando demais hoje."
        ],

        challenge: [
            "Aceito o desafio. 😎",
            "Bora então!",
            "Agora ficou interessante.",
            "Você chamou o Zuno pra disputa?",
            "Fechado!",
            "Quero ver você ganhar 😂"
        ],

        question: [
            "Boa pergunta.",
            "Hmm... deixa eu pensar.",
            "Interessante isso aí.",
            "Depende do que você quer saber.",
            "Pode explicar melhor que eu tento te responder.",
            "Essa merece uma resposta boa."
        ]
    };

    // =========================================================
    // RESPOSTAS CONTEXTUAIS
    // =========================================================

    const CONTEXTS = [

        {
            words: ["minecraft", "minecrafto"],
            responses: [
                "Minecraft? Agora você falou minha língua 👀",
                "Minecraft é perigoso... começa construindo uma casa e termina procurando diamante de madrugada.",
                "Se entrar no Minecraft agora, esquece o horário kkk."
            ]
        },

        {
            words: ["roblox"],
            responses: [
                "Roblox sempre aparece por aqui 😂",
                "Qual jogo do Roblox você tá jogando?",
                "Roblox é praticamente um universo inteiro."
            ]
        },

        {
            words: ["discord", "servidor", "server"],
            responses: [
                "Discord é onde a confusão começa 😂",
                "Esse servidor ainda vai ficar gigante.",
                "Tem muita coisa acontecendo nesse servidor."
            ]
        },

        {
            words: ["bot", "zuno"],
            responses: [
                "Chamou o Zuno? 👀",
                "Eu tô ouvindo.",
                "Opa, falaram de mim.",
                "Estou oficialmente presente.",
                "Zuno na área."
            ]
        },

        {
            words: ["musica", "funk", "som"],
            responses: [
                "Música boa muda o clima na hora.",
                "Agora fiquei imaginando esse som tocando alto 😂",
                "Qual música você tá ouvindo?"
            ]
        },

        {
            words: ["jogo", "jogar", "game"],
            responses: [
                "Bora jogar alguma coisa.",
                "Qual jogo?",
                "Sempre existe um jogo pra passar o tempo.",
                "Agora você me deixou curioso."
            ]
        },

        {
            words: ["escola", "aula", "prova"],
            responses: [
                "A famosa escola... 😂",
                "Boa sorte nessa missão.",
                "Se for tarefa, pelo menos tenta entender antes de entregar.",
                "Aula pode ser cansativa mesmo."
            ]
        }
    ];

    // =========================================================
    // IDENTIFICAÇÃO DE INTENÇÃO
    // =========================================================

    function hasAny(text, list) {
        return list.some(word =>
            text.includes(word)
        );
    }

    function detectIntent(text) {

        const t = normalize(text);

        if (
            hasAny(t, [
                "boa noite",
                "vou dormir",
                "dormir",
                "vou deitar",
                "sono"
            ])
        ) {
            return "sleep";
        }

        if (
            hasAny(t, [
                "kkkk",
                "haha",
                "rsrs",
                "😂",
                "mds kkk"
            ])
        ) {
            return "laugh";
        }

        if (
            hasAny(t, [
                "obrigado",
                "obrigada",
                "valeu",
                "vlw",
                "tmj"
            ])
        ) {
            return "thanks";
        }

        if (
            hasAny(t, [
                "oi",
                "ola",
                "olá",
                "eae",
                "eai",
                "salve",
                "opa",
                "bom dia",
                "boa tarde"
            ])
        ) {
            return "greeting";
        }

        if (
            hasAny(t, [
                "te amo",
                "amo voce",
                "amo vc",
                "gosto de voce",
                "gosto de vc",
                "querido"
            ])
        ) {
            return "affection";
        }

        if (
            hasAny(t, [
                "lindo",
                "bonito",
                "brabo",
                "incrivel",
                "perfeito",
                "legal"
            ])
        ) {
            return "compliment";
        }

        if (
            hasAny(t, [
                "burro",
                "idiota",
                "chato",
                "otario",
                "imbecil"
            ])
        ) {
            return "insult";
        }

        if (
            hasAny(t, [
                "desafio",
                "duelo",
                "batalha",
                "te desafio"
            ])
        ) {
            return "challenge";
        }

        if (
            hasAny(t, [
                "entediado",
                "tedio",
                "sem nada",
                "nao tenho nada"
            ])
        ) {
            return "bored";
        }

        if (
            hasAny(t, [
                "triste",
                "to mal",
                "estou mal",
                "desanimado",
                "desanimada",
                "chateado",
                "chateada"
            ])
        ) {
            return "sad";
        }

        if (
            hasAny(t, [
                "para",
                "cala",
                "cala boca",
                "quieto"
            ])
        ) {
            return "provocation";
        }

        if (
            t.endsWith("?") ||
            hasAny(t, [
                "como",
                "porque",
                "por que",
                "qual",
                "quando",
                "onde",
                "quem"
            ])
        ) {
            return "question";
        }

        return null;
    }

    // =========================================================
    // ESCOLHER RESPOSTA
    // =========================================================

    function random(array) {
        return array[
            Math.floor(Math.random() * array.length)
        ];
    }

    function getUserHistory(userId) {
        if (!recentResponses.has(userId)) {
            recentResponses.set(userId, []);
        }

        return recentResponses.get(userId);
    }

    function chooseResponse(userId, list) {

        if (!list.length) return null;

        const history = getUserHistory(userId);

        const available = list.filter(
            response => !history.includes(response)
        );

        const selected = random(
            available.length ? available : list
        );

        history.push(selected);

        while (history.length > 10) {
            history.shift();
        }

        return selected;
    }

    // =========================================================
    // RESPOSTA APRENDIDA
    // =========================================================

    function findLearned(text) {

        if (!learnedResponses.length) {
            return null;
        }

        let best = null;
        let bestScore = 0;

        for (const item of learnedResponses) {

            const score = similarity(
                text,
                item.input
            );

            if (
                score >= CONFIG.learningThreshold &&
                score > bestScore
            ) {
                bestScore = score;
                best = item;
            }
        }

        return best;
    }

    // =========================================================
    // APRENDIZADO AUTOMÁTICO
    // =========================================================

    function learn(message, response) {

        if (!message || !response) return;

        if (message.author?.bot) return;

        const input = String(message.content || "").trim();

        if (!input) return;

        if (isCommand(input)) return;

        if (isSerious(input)) return;

        const inputWords = words(input);

        if (
            inputWords.length < 2 ||
            inputWords.length > 45
        ) {
            return;
        }

        if (
            response.includes("```") ||
            response.length > 300
        ) {
            return;
        }

        const existing = learnedResponses.find(
            item =>
                normalize(item.input) === normalize(input) &&
                normalize(item.response) === normalize(response)
        );

        if (existing) {
            existing.uses = (existing.uses || 0) + 1;
            existing.lastUsed = Date.now();
            saveMemory();
            return;
        }

        learnedResponses.push({
            input,
            response,
            uses: 1,
            createdAt: Date.now(),
            lastUsed: Date.now()
        });

        while (
            learnedResponses.length >
            CONFIG.learningLimit
        ) {
            learnedResponses.sort(
                (a, b) =>
                    (a.uses || 0) -
                    (b.uses || 0)
            );

            learnedResponses.shift();
        }

        saveMemory();
    }

    // =========================================================
    // ENVIO
    // =========================================================

    async function reply(message, text, options = {}) {

        if (!text) return;

        const finalText =
            options.plain
                ? text
                : fancy(text);

        await message.reply({
            content: finalText,
            allowedMentions: {
                repliedUser: false
            }
        });

        if (!options.noLearn) {
            learn(message, text);
        }
    }

    async function send(channel, text) {

        if (!channel || !text) return;

        await channel.send({
            content: fancy(text),
            allowedMentions: {
                parse: []
            }
        });
    }

    // =========================================================
    // CONTEXTO ESPECÍFICO
    // =========================================================

    function contextResponse(text) {

        const normalized = normalize(text);

        for (const context of CONTEXTS) {

            const found = context.words.some(
                word => normalized.includes(word)
            );

            if (found) {
                return random(context.responses);
            }
        }

        return null;
    }

    // =========================================================
    // COOLDOWN
    // =========================================================

    function canAnswer(userId) {

        const now = Date.now();
        const last = cooldowns.get(userId) || 0;

        if (
            now - last <
            CONFIG.userCooldown
        ) {
            return false;
        }

        cooldowns.set(
            userId,
            now
        );

        return true;
    }

    // =========================================================
    // MENSAGENS ESPONTÂNEAS
    // =========================================================

    const SPONTANEOUS = [
        "Alguém aí ainda tá acordado? 👀",
        "Tô observando esse servidor em silêncio...",
        "Esse servidor tá quieto demais.",
        "Alguém quer conversar?",
        "O Zuno está oficialmente entediado.",
        "Tem alguém aí?",
        "A atividade desse servidor caiu suspeitamente 😂",
        "Eu poderia ficar quieto... mas não vou.",
        "Só passando para lembrar que eu existo.",
        "👀",
        "Interessante...",
        "Estou de olho."
    ];

    async function spontaneous(message) {

        if (
            message.channel.id !==
            CONFIG.mainChannelId
        ) {
            return false;
        }

        const now = Date.now();

        if (
            now - lastSpontaneous <
            CONFIG.spontaneousCooldown
        ) {
            return false;
        }

        if (
            Math.random() >
            CONFIG.spontaneousChance
        ) {
            return false;
        }

        lastSpontaneous = now;

        await send(
            message.channel,
            random(SPONTANEOUS)
        );

        return true;
    }

    // =========================================================
    // REAÇÃO EMOCIONAL
    // =========================================================

    async function automaticReaction(message, text) {

        const t = normalize(text);

        if (
            hasAny(t, [
                "kkkk",
                "haha",
                "rsrs"
            ])
        ) {
            if (Math.random() < 0.12) {
                try {
                    await message.react("😂");
                } catch {}
            }

            return;
        }

        if (
            hasAny(t, [
                "meu deus",
                "mds",
                "nao acredito"
            ])
        ) {
            if (Math.random() < 0.10) {
                try {
                    await message.react("😳");
                } catch {}
            }

            return;
        }

        if (
            hasAny(t, [
                "triste",
                "to mal",
                "estou mal"
            ])
        ) {
            if (Math.random() < 0.10) {
                try {
                    await message.react("🖤");
                } catch {}
            }
        }
    }

    // =========================================================
    // PROCESSAMENTO PRINCIPAL
    // =========================================================

    async function handleMessage(message) {

        if (!message) return;

        if (message.author?.bot) return;

        if (!message.guild) return;

        const raw = String(
            message.content || ""
        ).trim();

        if (!raw) return;

        const text = normalize(raw);

        // ---------------------------------------------
        // NÃO RESPONDE COMANDOS
        // ---------------------------------------------

        if (isCommand(raw)) {
            return;
        }

        // ---------------------------------------------
        // MENÇÃO AO ZUNO
        // ---------------------------------------------

        const mentioned =
            message.mentions?.users?.has(
                client.user.id
            );

        // ---------------------------------------------
        // COOLDOWN
        // ---------------------------------------------

        if (!canAnswer(message.author.id)) {
            return;
        }

        // ---------------------------------------------
        // REAÇÃO
        // ---------------------------------------------

        await automaticReaction(
            message,
            raw
        );

        // ---------------------------------------------
        // APRENDIZADO JÁ EXISTENTE
        // ---------------------------------------------

        const learned =
            findLearned(raw);

        if (
            learned &&
            !mentioned
        ) {

            await reply(
                message,
                learned.response,
                {
                    noLearn: true,
                    plain: true
                }
            );

            learned.uses =
                (learned.uses || 0) + 1;

            learned.lastUsed =
                Date.now();

            saveMemory();

            return;
        }

        // ---------------------------------------------
        // CONTEXTO
        // ---------------------------------------------

        const contextual =
            contextResponse(raw);

        if (contextual && mentioned) {

            await reply(
                message,
                contextual
            );

            return;
        }

        // ---------------------------------------------
        // INTENÇÃO
        // ---------------------------------------------

        const intent =
            detectIntent(raw);

        // ---------------------------------------------
        // RESPOSTA POR INTENÇÃO
        // ---------------------------------------------

        if (intent && RESPONSES[intent]) {

            const response =
                chooseResponse(
                    message.author.id,
                    RESPONSES[intent]
                );

            await reply(
                message,
                response
            );

            conversations.set(
                message.author.id,
                {
                    intent,
                    time: Date.now()
                }
            );

            return;
        }

        // ---------------------------------------------
        // CONTEXTO
        // ---------------------------------------------

        if (contextual && mentioned) {

            await reply(
                message,
                contextual
            );

            return;
        }

        // ---------------------------------------------
        // PERGUNTAS AO ZUNO
        // ---------------------------------------------

        if (
            mentioned &&
            intent === "question"
        ) {

            const response =
                chooseResponse(
                    message.author.id,
                    RESPONSES.question
                );

            await reply(
                message,
                response
            );

            return;
        }

        // ---------------------------------------------
        // QUALQUER MENÇÃO AO ZUNO
        // ---------------------------------------------

        if (mentioned) {

            const responses = [
                "Chamou? 👀",
                "Tô aqui.",
                "Fala comigo.",
                "Opa, estou ouvindo.",
                "Diga.",
                "Sim?",
                "Pode falar.",
                "Que foi? 😂",
                "Estou prestando atenção.",
                "O Zuno está online.",
                "Chamaram meu nome?",
                "Tô na área."
            ];

            await reply(
                message,
                chooseResponse(
                    message.author.id,
                    responses
                )
            );

            return;
        }

        // ---------------------------------------------
        // CONVERSA RECENTE
        // ---------------------------------------------

        const conversation =
            conversations.get(
                message.author.id
            );

        if (
            conversation &&
            Date.now() -
            conversation.time <
            8 * 60 * 1000
        ) {

            const followUps = [
                "Entendi.",
                "Hmm, continua.",
                "Tô acompanhando.",
                "Sério? 👀",
                "Interessante isso.",
                "Pode continuar.",
                "Estou ouvindo.",
                "E depois?",
                "Entendi o que você quis dizer."
            ];

            if (Math.random() < 0.18) {

                await reply(
                    message,
                    random(followUps)
                );

                conversation.time =
                    Date.now();

                return;
            }
        }

        // ---------------------------------------------
        // MENSAGEM ESPONTÂNEA
        // ---------------------------------------------

        await spontaneous(message);
    }

    // =========================================================
    // EVENTO DE MENSAGEM
    // =========================================================

    client.on(
        Events.MessageCreate,
        async message => {

            try {

                await handleMessage(
                    message
                );

            } catch (error) {

                console.log(
                    "❌ Erro nas interações do Zuno:",
                    error
                );
            }
        }
    );

    // =========================================================
    // BOAS-VINDAS
    // =========================================================

    client.on(
        Events.GuildMemberAdd,
        async member => {

            try {

                const channel =
                    member.guild.channels.cache.get(
                        CONFIG.mainChannelId
                    );

                if (!channel) return;

                const greetings = [
                    `Seja bem-vindo(a), ${member}! 🖤`,
                    `Olha quem chegou! Bem-vindo(a), ${member}!`,
                    `Bem-vindo(a) ao servidor, ${member}! 😎`,
                    `${member} acabou de chegar! 👀`,
                    `Recebam ${member} por aqui! 🖤`
                ];

                await channel.send({
                    content: fancy(
                        random(greetings)
                    ),
                    allowedMentions: {
                        users: [
                            member.id
                        ]
                    }
                });

            } catch (error) {

                console.log(
                    "❌ Erro no welcome:",
                    error.message
                );
            }
        }
    );

    // =========================================================
    // LIMPEZA AUTOMÁTICA
    // =========================================================

    setInterval(() => {

        const now = Date.now();

        for (
            const [
                userId,
                time
            ] of cooldowns
        ) {

            if (
                now - time >
                10 * 60 * 1000
            ) {
                cooldowns.delete(
                    userId
                );
            }
        }

        for (
            const [
                userId,
                data
            ] of conversations
        ) {

            if (
                now - data.time >
                15 * 60 * 1000
            ) {
                conversations.delete(
                    userId
                );
            }
        }

    }, 5 * 60 * 1000);

    // =========================================================
    // LOG
    // =========================================================

    console.log(
        `🧠 Aprendizado automático: ATIVO (${learnedResponses.length} memórias)`
    );

    console.log(
        "✨ Estilo de mensagens: ATIVO"
    );

    console.log(
        "💬 Sistema de interações do Zuno: ATIVO"
    );
};
