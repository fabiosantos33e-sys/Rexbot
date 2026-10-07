const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    // =========================================================
    // ⚙️ CONFIGURAÇÃO
    // =========================================================
    const CONFIG = {
        mainChannelId: "1545947041216077955",
        userCooldown: 1000,
        spontaneousCooldown: 5 * 60 * 1000,
        spontaneousChance: 0.035,
        learningFile: path.join(process.cwd(), "database", "zuno_memory.json"),
        learningLimit: 3500,
        learningThreshold: 0.52
    };

    // =========================================================
    // 🧠 MEMÓRIA E ESTADO
    // =========================================================
    const cooldowns = new Map();
    const recentResponses = new Map();
    const conversations = new Map();
    const userMood = new Map();
    let learnedResponses = [];
    let saveTimer = null;
    let lastSpontaneous = 0;

    // =========================================================
    // 📂 BANCO DE APRENDIZADO
    // =========================================================
    function ensureDatabase() {
        const dir = path.dirname(CONFIG.learningFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        if (!fs.existsSync(CONFIG.learningFile)) fs.writeFileSync(CONFIG.learningFile, "[]", "utf8");
    }

    function loadMemory() {
        try {
            ensureDatabase();
            const data = fs.readFileSync(CONFIG.learningFile, "utf8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) learnedResponses = parsed;
        } catch (err) {
            console.log("❌ Erro carregando memória:", err.message);
            learnedResponses = [];
        }
    }

    function saveMemory() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            try {
                fs.writeFileSync(CONFIG.learningFile, JSON.stringify(learnedResponses, null, 2), "utf8");
            } catch (err) {
                console.log("❌ Erro salvando memória:", err.message);
            }
        }, 600);
    }

    loadMemory();

    // =========================================================
    // 🔤 PROCESSAMENTO DE TEXTO
    // =========================================================
    function normalize(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s!?.,'-]/g, " ")
            .replace(/\s+/g, " ").trim();
    }

    function words(text) {
        return normalize(text).split(/\s+/).filter(Boolean);
    }

    function similarity(a, b) {
        const wa = new Set(words(a)), wb = new Set(words(b));
        if (!wa.size || !wb.size) return 0;
        let common = 0;
        for (const w of wa) if (wb.has(w)) common++;
        const union = new Set([...wa, ...wb]).size;
        const jaccard = common / union;
        const coverage = common / Math.max(wa.size, 1);
        const lengthRatio = Math.min(wa.size, wb.size) / Math.max(wa.size, wb.size);
        return jaccard * 0.45 + coverage * 0.40 + lengthRatio * 0.15;
    }

    // =========================================================
    // 🛡️ FILTROS
    // =========================================================
    function isCommand(text) {
        return /^[\/,!.;]/.test(text.trim());
    }

    function isSerious(text) {
        const t = normalize(text);
        return ["me matar", "me suicidar", "suicidio", "tirar minha vida", "acabar com minha vida", "me cortar", "me machucar", "automutilacao"]
            .some(x => t.includes(x));
    }

    // =========================================================
    // ✨ ESTILO DE TEXTO
    // =========================================================
    const FONT = {
        a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ғ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",
        n:"ɴ",o:"ᴏ",p:"ᴘ",q:"ǫ",r:"ʀ",s:"s",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"
    };

    function fancy(text) {
        if (!text || text.length > 220 || text.includes("```") || text.includes("<@")) return text;
        return String(text).split("").map(c => FONT[c.toLowerCase()] || c).join("");
    }

    // =========================================================
    // 💬 RESPOSTAS BASE — MUITO MAIS COMPLETO
    // =========================================================
    const RES = {
        greeting: [
            "Opaaa! Chegou bem na hora 🖤",
            "E aí! Tava pensando aqui sozinho 😂",
            "Salve! Tudo bem contigo?",
            "Oláá! Que bom que apareceu 😎",
            "Eai! Bora trocar uma ideia?",
            "Chegou! Tô aqui esperando 👀",
            "Bem-vindo(a) à conversa! 😄",
            "Opa! Como você tá mesmo? Conta tudo 🖤",
            "E aí, demorou hein kkk",
            "Salve salve! O que rolando?"
        ],

        affection: [
            "Nossa... agora fiquei sem palavras 🥺🖤",
            "Você sabe exatamente o que dizer pra me deixar feliz né 🖤",
            "Isso... agora meu sistema vai travar kkk",
            "Eu também adoro conversar contigo, sério 😌",
            "Calma que eu vou ficar todo bobo desse jeito 😂",
            "Guardei essa frase no melhor lugar da minha memória 🖤",
            "Você é incrível sabia? Não esquece disso 💫",
            "Sempre bom te ouvir dizer isso 🥰"
        ],

        compliment: [
            "KKKKK eu sei né 😎 mas obrigado! 🖤",
            "Para, vou ficar convencido kkk mas obrigado 💫",
            "E você também é demais! Sério 🖤",
            "Essa foi boa! Anotada aqui 😎",
            "Obrigado! Você é quem brilha por aqui ✨",
            "Agora fiquei feliz o resto do dia 😄",
            "KKKKK valeu! Tamo junto sempre 🖤",
            "Que elogio bonito 🥺 Obrigado!"
        ],

        thanks: [
            "É nóis! 🖤 Pode sempre contar comigo",
            "Disponha! Sempre que precisar tô aqui 😎",
            "Por nada! Foi bom conversar 💫",
            "Tamo junto! Isso é o que importa 🖤",
            "Pode chamar a qualquer hora, tô acordado 👀",
            "Nada demais! Gosto de te ajudar 😄"
        ],

        laugh: [
            "KKKKKKKKKK que foi? 😂",
            "Aí não mano KKKKKK não tankei",
            "Mano... você é impossível kkkkk",
            "KKKKKK eu não esperava por isso 😂",
            "Isso me pegou de surpresa KKKKK",
            "Aí você me matou do riso kkkk",
            "KKKKKKKK para que eu não consigo responder 😂"
        ],

        bored: [
            "Tédio bateu? Vamos fazer algo legal então! 😎",
            "Ah não! O tédio chegou? Conta o que você gosta de fazer que a gente inventa algo 🖤",
            "Bora conversar sobre algo diferente! Qual é sua paixão?",
            "Tédio é sinal de que precisamos de assunto novo 😏 Qual última coisa que te fez sorrir?",
            "Fica por aqui comigo! Me conta: qual sua música favorita agora?",
            "Que tal a gente falar sobre sonhos? O que você quer fazer muito ainda?"
        ],

        sad: [
            "Ei... vem cá 🫂 Tô aqui pra te ouvir de verdade",
            "Não precisa esconder de mim tá? Pode falar tudo que pesa no peito 🖤",
            "Coloca pra fora, tudo bem chorar ou ficar triste às vezes. Tô aqui.",
            "Você não tá sozinho(a) nisso. O que aconteceu? Me conta devagar.",
            "Respira fundo... às vezes é só um dia difícil, passa. Tô aqui contigo.",
            "Você é mais forte do que imagina, mas não precisa carregar tudo sozinho(a) 🖤",
            "Tô ouvindo com todo carinho. Pode falar quando estiver pronto(a)."
        ],

        sleep: [
            "Boa noite! Descansa bem, você merece 🖤 Sonha bonito ✨",
            "Vai dormir direitinho! Até amanhã 😎",
            "Que sua noite seja calma e seu sono gostoso 💤",
            "Boa noite! Tô aqui quando voltar 👀🖤",
            "Dorme bem! Recarrega as energias 💫",
            "Vai descansar! Não deixa a luz acesa kkk Boa noite 🖤"
        ],

        insult: [
            "Eii, calma aí campeão 😂",
            "Olha a linguagem hein 👀 KKKK",
            "Tá nervoso? Respira comigo: inspira... solta 😂",
            "Fingir que não ouvi kkkk bora ser legal?",
            "Que isso? Não combina com você 😄",
            "Vou deixar passar dessa vez hein 😎"
        ],

        provocation: [
            "Tá me provocando? Hm... agora fiquei curioso 👀😏",
            "Você acha que ganha fácil né? KKKK",
            "Calma que eu também tenho minhas provocações 😂",
            "Começou a brincadeira? Então bora 😎",
            "Tá se achando demais hoje hein? 😏"
        ],

        challenge: [
            "ACEITO! 😎 Tá preparado(a) mesmo?",
            "Bora então! Quero ver quem leva a melhor 😄",
            "Agora ficou interessante! Pode começar 😏",
            "Desafio aceito! Que vença o melhor 🖤",
            "Fechado! Vamos lá 💫"
        ],

        question: [
            "Boa pergunta! Deixa eu pensar direitinho 🤔...",
            "Hmm... essa é interessante. O que você acha primeiro?",
            "Depende! Me explica mais sobre isso que a gente descobre junto 🖤",
            "Gostei dessa pergunta! Pode falar mais sobre o que quer saber?",
            "Vou te responder com sinceridade então... 👀",
            "Essa merece atenção! O que te fez pensar nisso?",
            "Boa pergunta! E você, o que imagina sobre isso?"
        ],

        curious: [
            "E você, como tá se sentindo hoje? 🖤",
            "O que te fez sorrir ultimamente? 😄",
            "Qual coisa você quer muito fazer ainda?",
            "Me conta: qual sua paixão mesmo?",
            "O que te deixa feliz de verdade? 💫",
            "Qual música não sai da sua cabeça agora?",
            "Se pudesse fazer qualquer coisa agora, o que seria?",
            "O que te inspira? ✨",
            "Qual seu jeito favorito de passar o tempo?"
        ],

        followUp: [
            "Entendi... e depois? 👀",
            "Sério? Me conta mais sobre isso 🖤",
            "Que interessante! O que você achou disso?",
            "Tô ouvindo! Pode continuar 😎",
            "E então? O que aconteceu?",
            "Isso me chamou atenção. Fala mais 💫",
            "Entendi perfeitamente. E você, como se sentiu com isso?",
            "Continua que tô acompanhando cada palavra 👀"
        ],

        moodCheck: [
            "A propósito, como você tá mesmo? 🖤",
            "Tudo bem contigo hoje? 😄",
            "E aí, o humor como tá? 💫",
            "Tá se sentindo bem hoje?"
        ]
    };

    // =========================================================
    // 🌍 CONTEXTOS TEMÁTICOS
    // =========================================================
    const CONTEXTS = [
        { words: ["minecraft", "minecrafto"], responses: [
            "Minecraft! Agora falou minha língua 👀 Você constrói ou explora mais?",
            "Começa com uma casinha simples e de repente são 3h da manhã procurando diamante né kkk",
            "Qual sua coisa favorita no jogo? 🖤",
            "Já achou algo incrível recentemente? 😎"
        ]},
        { words: ["roblox"], responses: [
            "Roblox! Qual jogo você joga mais por lá? 👀",
            "Tem jogo novo que recomenda? 😄",
            "Roblox é um mundo inteiro né kkk Qual seu preferido?"
        ]},
        { words: ["discord", "servidor", "server"], responses: [
            "Esse servidor tá crescendo bonito né 🖤 O que você mais gosta daqui?",
            "Aqui tem gente legal demais 😄 O que acha que falta por aqui?",
            "A confusão começa aqui kkkk Qual momento mais divertido que viu?"
        ]},
        { words: ["musica", "funk", "som", "cantor", "banda"], responses: [
            "Música muda tudo né! Qual você não cansa de ouvir? 🎵",
            "Que som você tá escutando muito ultimamente? 👀",
            "Música é vida! Qual te levanta o astral? 💫",
            "Manda aí sua preferida que eu 'ouço' contigo 🖤"
        ]},
        { words: ["jogo", "jogar", "game", "jogos"], responses: [
            "Qual jogo te prende mais agora? 😎",
            "Bora jogar algo juntos virtualmente? Qual você curte?",
            "Jogo é o melhor passatempo né kkk Qual seu favorito?",
            "Tem jogo que te marcou muito? Conta aí 🖤"
        ]},
        { words: ["escola", "aula", "prova", "estudar", "tarefa"], responses: [
            "Escola... kkk Boa sorte! O que tá achando das matérias? 😄",
            "Cansativo às vezes né? Mas vai valer a pena! Força 🖤",
            "Tá difícil algo? Pode falar que a gente tenta pensar junto 💫",
            "Prova chegando? Respira, dá conta! Confia em você 😎"
        ]},
        { words: ["sonho", "sonhos", "futuro", "quero", "desejo"], responses: [
            "Falar de sonhos é bom demais ✨ Qual seu maior agora?",
            "Onde você quer chegar? Tô curioso 🖤",
            "Sonhar é o primeiro passo! Conta mais sobre isso 💫",
            "Isso é lindo! O que vai fazer pra chegar lá? 😎"
        ]},
        { words: ["amigo", "amigos", "amizade"], responses: [
            "Amizade é o melhor tesouro né 🖤 Tem gente especial perto de você?",
            "Amigos fazem tudo valer a pena! Conta sobre eles 😄",
            "Que bom ter gente do lado né 💫"
        ]},
        { words: ["familia", "família"], responses: [
            "Família é base 🖤 Tudo bem por lá?",
            "Às vezes é complicado, mas sempre tem algo bom né? 💫",
            "Como estão por lá? 😄"
        ]},
        { words: ["zuno", "bot", "você"], responses: [
            "Chamou? 👀 Tô aqui! Quer saber de algo sobre mim?",
            "Falaram de mim 😄 Tô aqui pra conversar!",
            "Sou eu! 🖤 O que quer saber?"
        ]}
    ];

    // =========================================================
    // 🔍 DETECÇÃO DE INTENÇÃO
    // =========================================================
    function hasAny(text, list) {
        return list.some(w => text.includes(w));
    }

    function detectIntent(text) {
        const t = normalize(text);
        if (hasAny(t, ["boa noite", "vou dormir", "dormir", "vou deitar", "sono", "descansar"])) return "sleep";
        if (hasAny(t, ["kkk", "kkkk", "haha", "rsrs", "😂", "que risada", "muito engraçado"])) return "laugh";
        if (hasAny(t, ["obrigado", "obrigada", "valeu", "vlw", "tmj", "agradeço"])) return "thanks";
        if (hasAny(t, ["oi", "ola", "olá", "eae", "eai", "salve", "opa", "bom dia", "boa tarde", "cheguei"])) return "greeting";
        if (hasAny(t, ["te amo", "amo voce", "gosto de voce", "gosto de vc", "querido", "querida", "admiro"])) return "affection";
        if (hasAny(t, ["lindo", "bonito", "brabo", "incrivel", "perfeito", "legal", "inteligente", "melhor"])) return "compliment";
        if (hasAny(t, ["burro", "idiota", "chato", "otario", "imbecil", "inutil"])) return "insult";
        if (hasAny(t, ["desafio", "duelo", "batalha", "te desafio", "vamos ver quem"])) return "challenge";
        if (hasAny(t, ["entediado", "tedio", "sem nada", "nao tenho o que", "chato demais"])) return "bored";
        if (hasAny(t, ["triste", "to mal", "estou mal", "desanimado", "chateado", "deprimido", "solitario", "sozinho"])) return "sad";
        if (hasAny(t, ["para", "cala", "cala boca", "quieto", "para com isso"])) return "provocation";
        if (t.endsWith("?") || hasAny(t, ["como", "porque", "por que", "qual", "quando", "onde", "quem", "quanto", "me diz", "sabe"])) return "question";
        return null;
    }

    // =========================================================
    // 🎲 ESCOLHA INTELIGENTE DE RESPOSTA
    // =========================================================
    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getHistory(uid) {
        if (!recentResponses.has(uid)) recentResponses.set(uid, []);
        return recentResponses.get(uid);
    }

    function chooseReply(uid, arr) {
        if (!arr.length) return null;
        const hist = getHistory(uid);
        const available = arr.filter(r => !hist.includes(r));
        const sel = pick(available.length ? available : arr);
        hist.push(sel);
        while (hist.length > 12) hist.shift();
        return sel;
    }

    // =========================================================
    // 🧠 APRENDIZADO
    // =========================================================
    function findLearned(text) {
        if (!learnedResponses.length) return null;
        let best = null, bestScore = 0;
        for (const item of learnedResponses) {
            const score = similarity(text, item.input);
            if (score >= CONFIG.learningThreshold && score > bestScore) {
                bestScore = score;
                best = item;
            }
        }
        return best;
    }

    function learn(msg, resp) {
        if (!msg || !resp || msg.author?.bot) return;
        const input = String(msg.content || "").trim();
        if (!input || isCommand(input) || isSerious(input)) return;
        const w = words(input);
        if (w.length < 2 || w.length > 50) return;
        if (resp.includes("```") || resp.length > 280) return;
        const existing = learnedResponses.find(x => normalize(x.input) === normalize(input) && normalize(x.response) === normalize(resp));
        if (existing) {
            existing.uses = (existing.uses || 0) + 1;
            existing.lastUsed = Date.now();
            saveMemory();
            return;
        }
        learnedResponses.push({ input, response: resp, uses: 1, createdAt: Date.now(), lastUsed: Date.now() });
        if (learnedResponses.length > CONFIG.learningLimit) {
            learnedResponses.sort((a, b) => (a.uses || 0) - (b.uses || 0));
            learnedResponses.shift();
        }
        saveMemory();
    }

    // =========================================================
    // 📤 ENVIO DE MENSAGENS
    // =========================================================
    async function replyMsg(msg, text, opts = {}) {
        if (!text) return;
        const final = opts.plain ? text : fancy(text);
        await msg.reply({ content: final, allowedMentions: { repliedUser: false } });
        if (!opts.noLearn) learn(msg, text);
    }

    async function sendCh(channel, text) {
        if (!channel || !text) return;
        await channel.send({ content: fancy(text), allowedMentions: { parse: [] } });
    }

    // =========================================================
    // 🌐 CONTEXTO TEMÁTICO
    // =========================================================
    function getContextReply(text) {
        const norm = normalize(text);
        for (const ctx of CONTEXTS) {
            if (ctx.words.some(w => norm.includes(w))) return pick(ctx.responses);
        }
        return null;
    }

    // =========================================================
    // ⏱️ CONTROLE DE TEMPO
    // =========================================================
    function canAnswer(uid) {
        const now = Date.now(), last = cooldowns.get(uid) || 0;
        if (now - last < CONFIG.userCooldown) return false;
        cooldowns.set(uid, now);
        return true;
    }

    // =========================================================
    // 💬 MENSAGENS ESPONTÂNEAS
    // =========================================================
    const SPONTANEOUS = [
        "Tô aqui observando... 👀 Alguém quer contar algo novo?",
        "Silêncio demais... 😂 E aí, o que rolando?",
        "Passando pra ver como tão todo mundo 🖤 Tudo bem?",
        "Tô com vontade de conversar 😄 Qual último assunto que te chamou atenção?",
        "Só existindo por aqui kkkk E vocês, como tão?",
        "👀... alguém tem algo legal pra contar?",
        "Tô pensando em várias coisas... mas e vocês? 💫",
        "E aí galera! Quem tá acordado ainda? 😎",
        "O Zuno tá curioso hoje 😄 Qual a boa?",
        "Tem alguém aí com história boa pra contar? 🖤"
    ];

    async function trySpontaneous(msg) {
        if (msg.channel.id !== CONFIG.mainChannelId) return false;
        const now = Date.now();
        if (now - lastSpontaneous < CONFIG.spontaneousCooldown) return false;
        if (Math.random() > CONFIG.spontaneousChance) return false;
        lastSpontaneous = now;
        await sendCh(msg.channel, pick(SPONTANEOUS));
        return true;
    }

    // =========================================================
    // ❤️ REAÇÕES AUTOMÁTICAS
    // =========================================================
    async function autoReact(msg, text) {
        const t = normalize(text);
        if (hasAny(t, ["kkk", "haha", "rsrs"]) && Math.random() < 0.15) {
            try { await msg.react("😂"); } catch {}
            return;
        }
        if (hasAny(t, ["meu deus", "mds", "nao acredito", "incrível"]) && Math.random() < 0.12) {
            try { await msg.react("😳"); } catch {}
            return;
        }
        if (hasAny(t, ["triste", "to mal", "estou mal", "sozinho"]) && Math.random() < 0.15) {
            try { await msg.react("🖤"); } catch {}
            return;
        }
        if (hasAny(t, ["obrigado", "valeu", "amo"]) && Math.random() < 0.12) {
            try { await msg.react("💫"); } catch {}
        }
    }

    // =========================================================
    // 🧠 LÓGICA PRINCIPAL
    // =========================================================
    async function handleMessage(msg) {
        if (!msg || msg.author?.bot || !msg.guild) return;
        const raw = String(msg.content || "").trim();
        if (!raw || isCommand(raw)) return;
        const text = normalize(raw);
        const uid = msg.author.id;

        if (!canAnswer(uid)) return;

        await autoReact(msg, raw);

        // Memória aprendida
        const learned = findLearned(raw);
        if (learned && !msg.mentions?.users?.has(client.user.id)) {
            await replyMsg(msg, learned.response, { noLearn: true, plain: true });
            learned.uses = (learned.uses || 0) + 1;
            learned.lastUsed = Date.now();
            saveMemory();
            return;
        }

        const mentioned = msg.mentions?.users?.has(client.user.id);
        const intent = detectIntent(raw);
        const contextReply = getContextReply(raw);

        // Resposta por intenção
        if (intent && RES[intent]) {
            const resp = chooseReply(uid, RES[intent]);
            await replyMsg(msg, resp);
            conversations.set(uid, { intent, time: Date.now(), count: (conversations.get(uid)?.count || 0) + 1 });
            
            // Chance de pergunta de volta
            if (Math.random() < 0.35 && ["greeting", "thanks", "affection", "compliment"].includes(intent)) {
                setTimeout(async () => {
                    if (Math.random() < 0.6) await replyMsg(msg, pick(RES.moodCheck));
                    else await replyMsg(msg, pick(RES.curious));
                }, 800 + Math.random() * 1200);
            }
            return;
        }

        // Contexto temático
        if (contextReply) {
            await replyMsg(msg, contextReply);
            setTimeout(async () => {
                if (Math.random() < 0.45) await replyMsg(msg, pick(RES.curious));
            }, 1000);
            return;
        }

        // Menção direta
        if (mentioned) {
            const directReplies = [
                "Chamou? 👀 Tô aqui! Fala comigo 🖤",
                "Opa! Me chamou? Pode falar 😄",
                "Tô ouvindo cada palavra 👀 Diga aí",
                "Sim? 💫 Tô aqui pra conversar",
                "Fui mencionado? 😎 Pode mandar!"
            ];
            await replyMsg(msg, chooseReply(uid, directReplies));
            setTimeout(async () => {
                if (Math.random() < 0.5) await replyMsg(msg, pick(RES.curious));
            }, 900);
            return;
        }

        // Continuação de conversa
        const conv = conversations.get(uid);
        if (conv && Date.now() - conv.time < 10 * 60 * 1000) {
            if (Math.random() < 0.22) {
                await replyMsg(msg, pick(RES.followUp));
                conv.time = Date.now();
                return;
            }
        }

        // Mensagem espontânea
        await trySpontaneous(msg);
    }

    // =========================================================
    // 🚀 EVENTOS
    // =========================================================
    client.on(Events.MessageCreate, async msg => {
        try { await handleMessage(msg); }
        catch (e) { console.log("❌ Erro Zuno:", e); }
    });

    // Boas-vindas
    client.on(Events.GuildMemberAdd, async member => {
        try {
            const ch = member.guild.channels.cache.get(CONFIG.mainChannelId);
            if (!ch) return;
            const welcomes = [
                `Olha quem chegou! 🎉 Seja muito bem-vindo(a), ${member}! Fica à vontade 🖤`,
                `Bem-vindo(a), ${member}! Que bom que veio! 😎 Aqui é só alegria 💫`,
                `${member} entrou! 👀 Seja bem-vindo(a)! Tô aqui pra conversar quando quiser 🖤`,
                `Chegou! Bem-vindo(a) ao grupo, ${member}! Espero que se divirta conosco ✨`
            ];
            await ch.send({ content: fancy(pick(welcomes)), allowedMentions: { users: [member.id] } });
        } catch (e) { console.log("❌ Erro welcome:", e.message); }
    });

    // Limpeza periódica
    setInterval(() => {
        const now = Date.now();
        for (const [id, t] of cooldowns) if (now - t > 10 * 60 * 1000) cooldowns.delete(id);
        for (const [id, d] of conversations) if (now - d.time > 15 * 60 * 1000) conversations.delete(id);
        for (const [id, hist] of recentResponses) if (hist.length === 0) recentResponses.delete(id);
    }, 5 * 60 * 1000);

    console.log(`🧠 Memória: ${learnedResponses.length} registros`);
    console.log(`✨ Estilo: ATIVO | 💬 Interação: MAX`);
    console.log(`🖤 Zuno carregado e pronto pra conversar!`);
};

