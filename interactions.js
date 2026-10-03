const { Events } = require("discord.js");

/*
===========================================================
                    ZUNO - INTERACTIONS
===========================================================

Sistema de interação natural para o Zuno.

INSTALAÇÃO NO INDEX.JS:

    require("./interactions")(client);

IMPORTANTE:
- Não precisa registrar slash command.
- Não precisa criar banco de dados.
- Não precisa mexer no sistema de tickets.
- Não precisa mexer nos outros sistemas.
- O sistema funciona sozinho.
- O canal principal do Zuno é definido abaixo.

===========================================================
*/

module.exports = (client) => {

    /*
    =======================================================
                         CONFIGURAÇÃO
    =======================================================
    */

    const CONFIG = {

        // Canal onde o Zuno pode aparecer espontaneamente
        mainChannelId: "1545947041216077955",

        // Chances de mensagens espontâneas
        spontaneousChance: 0.018,

        // Intervalo mínimo entre mensagens espontâneas
        spontaneousCooldown: 1000 * 60 * 8,

        // Intervalo mínimo para reação automática
        reactionCooldown: 1000 * 60 * 3,

        // Tempo que um contexto de conversa permanece ativo
        conversationTimeout: 1000 * 60 * 8,

        // Tempo entre respostas do mesmo usuário
        userCooldown: 2500,

        // Quantidade de respostas recentes guardadas
        recentLimit: 25,

        // Tempo máximo de um duelo
        duelTimeout: 1000 * 60 * 5,

        // Chance de reagir com emoji
        reactionChance: 0.025
    };


    /*
    =======================================================
                         MEMÓRIA
    =======================================================
    */

    const users = new Map();

    const conversations = new Map();

    const cooldowns = new Map();

    const channelCooldowns = new Map();

    const recentResponses = new Map();

    const recentWelcome = [];

    const duels = new Map();

    const games = new Map();

    const reactions = new Map();

    const activeTopics = new Map();


    /*
    =======================================================
                         UTILIDADES
    =======================================================
    */

    function pick(array) {

        if (!Array.isArray(array) || array.length === 0) {
            return "";
        }

        return array[Math.floor(Math.random() * array.length)];
    }


    function chance(value) {

        return Math.random() < value;
    }


    function random(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function normalize(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\p{L}\p{N}\s!?.,'"-]/gu, " ")
            .replace(/\s+/g, " ")
            .trim();
    }


    function words(text) {

        return normalize(text)
            .split(/\s+/)
            .filter(Boolean);
    }


    function escapeRegex(text) {

        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }


    function hasWord(text, word) {

        const normalized = normalize(text);
        const target = normalize(word);

        if (!target) {
            return false;
        }

        const regex = new RegExp(
            `(^|\\s)${escapeRegex(target)}(?=\\s|$|[!?.,])`,
            "i"
        );

        return regex.test(normalized);
    }


    function hasPhrase(text, phrase) {

        const normalized = normalize(text);
        const target = normalize(phrase);

        if (!target) {
            return false;
        }

        return normalized.includes(target);
    }


    function hasAnyWord(text, list) {

        return list.some(word => hasWord(text, word));
    }


    function hasAnyPhrase(text, list) {

        return list.some(phrase => hasPhrase(text, phrase));
    }


    function isQuestion(text) {

        const normalized = normalize(text);

        return (
            normalized.includes("?") ||
            /^(quem|qual|como|onde|quando|porque|por que|pq|sera|será|voce|vc|zuno)/i.test(normalized)
        );
    }


    function shortMessage(text) {

        return words(text).length <= 8;
    }


    function getMemberName(message) {

        return (
            message.member?.displayName ||
            message.author?.globalName ||
            message.author?.username ||
            "humano"
        );
    }


    function getKey(message) {

        return `${message.guild?.id || "dm"}:${message.author.id}`;
    }


    function getUser(message) {

        const id = message.author.id;

        if (!users.has(id)) {

            users.set(id, {

                messages: 0,

                interactions: 0,

                greetings: 0,

                compliments: 0,

                provocations: 0,

                laughs: 0,

                affection: 0,

                duels: 0,

                wins: 0,

                losses: 0,

                mood: "normal",

                lastMessage: 0,

                lastName: getMemberName(message),

                friendship: 0

            });
        }

        const user = users.get(id);

        user.lastName = getMemberName(message);

        return user;
    }


    function increaseFriendship(message, amount = 1) {

        const user = getUser(message);

        user.friendship += amount;

        if (user.friendship > 100) {
            user.friendship = 100;
        }

        if (user.friendship < -50) {
            user.friendship = -50;
        }
    }


    function getMood(message) {

        const user = getUser(message);

        const hour = new Date().getHours();

        if (hour >= 0 && hour < 5) {
            return "madrugada";
        }

        if (user.friendship >= 50) {
            return "amigo";
        }

        if (user.friendship <= -10) {
            return "provocador";
        }

        if (user.messages > 50 && chance(0.35)) {
            return "caotico";
        }

        return pick([
            "normal",
            "zoeiro",
            "misterioso",
            "fofo",
            "sarcastico"
        ]);
    }


    /*
    =======================================================
                      CONTEXTO DE CONVERSA
    =======================================================
    */

    function conversationKey(message) {

        return `${message.guild?.id || "dm"}:${message.channel.id}:${message.author.id}`;
    }


    function setConversation(message, topic, data = {}) {

        conversations.set(conversationKey(message), {

            topic,

            data,

            expires: Date.now() + CONFIG.conversationTimeout

        });
    }


    function getConversation(message) {

        const key = conversationKey(message);

        const conversation = conversations.get(key);

        if (!conversation) {
            return null;
        }

        if (conversation.expires < Date.now()) {

            conversations.delete(key);

            return null;
        }

        return conversation;
    }


    function clearConversation(message) {

        conversations.delete(conversationKey(message));
    }


    /*
    =======================================================
                    CONTROLE DE REPETIÇÃO
    =======================================================
    */

    function freshPick(array, userId, fallback = null) {

        if (!array.length) {
            return fallback;
        }

        if (!recentResponses.has(userId)) {
            recentResponses.set(userId, []);
        }

        const recent = recentResponses.get(userId);

        const available = array.filter(item => !recent.includes(item));

        const chosen = pick(
            available.length ? available : array
        );

        recent.push(chosen);

        while (recent.length > CONFIG.recentLimit) {
            recent.shift();
        }

        return chosen;
    }


    function welcomePick(array) {

        const available = array.filter(item => !recentWelcome.includes(item));

        const chosen = pick(
            available.length ? available : array
        );

        recentWelcome.push(chosen);

        while (recentWelcome.length > 10) {
            recentWelcome.shift();
        }

        return chosen;
    }


    /*
    =======================================================
                         COOLDOWNS
    =======================================================
    */

    function userOnCooldown(message) {

        const last = cooldowns.get(message.author.id) || 0;

        return Date.now() - last < CONFIG.userCooldown;
    }


    function setUserCooldown(message) {

        cooldowns.set(message.author.id, Date.now());
    }


    function channelOnCooldown(channelId) {

        const last = channelCooldowns.get(channelId) || 0;

        return Date.now() - last < CONFIG.spontaneousCooldown;
    }


    function setChannelCooldown(channelId) {

        channelCooldowns.set(channelId, Date.now());
    }


    /*
    =======================================================
                      ENVIO SEGURO
    =======================================================
    */

    async function reply(message, content, options = {}) {

        if (!content) {
            return null;
        }

        try {

            const sent = await message.reply({

                content,

                allowedMentions: {

                    repliedUser: false

                }

            });

            if (options.context) {

                setConversation(
                    message,
                    options.context,
                    options.data || {}
                );
            }

            return sent;

        } catch (error) {

            console.error(
                "[ZUNO] Erro ao responder:",
                error.message
            );

            return null;
        }
    }


    async function send(channel, content) {

        if (!channel || !content) {
            return null;
        }

        try {

            return await channel.send({

                content,

                allowedMentions: {

                    parse: ["users"]

                }

            });

        } catch (error) {

            console.error(
                "[ZUNO] Erro ao enviar:",
                error.message
            );

            return null;
        }
    }


    /*
    =======================================================
                         BOAS-VINDAS
    =======================================================
    */

    const WELCOME_MESSAGES = [

        "✨ Seja muito bem-vindo(a), {user}! O Zuno ficou feliz de ter você por aqui. 💙",

        "🌙 Olha quem chegou! Bem-vindo(a), {user}. Sinta-se em casa. ✨",

        "🐺 {user} acabou de aparecer por aqui! Seja muito bem-vindo(a)!",

        "✨ Entrada detectada: {user}. O Zuno oficialmente aprovou sua chegada. 😌",

        "💙 Seja bem-vindo(a), {user}! Espero que você se divirta bastante por aqui.",

        "🌟 O servidor ganhou mais uma presença! Bem-vindo(a), {user}!",

        "👀 Quem apareceu? {user}! Seja muito bem-vindo(a).",

        "🐾 O Zuno percebeu uma nova presença... Bem-vindo(a), {user}!",

        "✨ {user}, sua chegada foi registrada. Agora você faz parte da bagunça. 😈",

        "🌙 Bem-vindo(a), {user}! Que sua passagem por aqui seja cheia de boas histórias.",

        "💫 {user} chegou! Pode entrar, mas cuidado... o Zuno está observando. 👀",

        "🎉 Seja bem-vindo(a), {user}! Aproveite o servidor e não fique tímido(a).",

        "🐺 Novo membro localizado: {user}. Receba oficialmente as boas-vindas do Zuno.",

        "✨ Bem-vindo(a), {user}! Já pode começar a causar... com responsabilidade. 😂",

        "💙 Chegou mais um! Bem-vindo(a), {user}. Divirta-se por aqui!",

        "🌟 Opa! {user} entrou no território do Zuno. Seja bem-vindo(a)!",

        "🐾 Seja bem-vindo(a), {user}! O lugar ficou um pouco mais interessante agora.",

        "✨ {user}, chegou a hora de conhecer essa pequena loucura chamada servidor.",

        "🌌 Bem-vindo(a), {user}! Espero que encontre boas amizades por aqui.",

        "😌 Entrada autorizada. Bem-vindo(a), {user}!"
    ];


    async function welcomeMember(member) {

        const channel = member.guild.channels.cache.get(
            CONFIG.mainChannelId
        );

        if (!channel) {
            return;
        }

        const message = welcomePick(WELCOME_MESSAGES)
            .replace(
                "{user}",
                `<@${member.id}>`
            );

        await send(channel, message);
    }


    /*
    =======================================================
                    RESPOSTAS DE SAUDAÇÃO
    =======================================================
    */

    const GREETINGS = [

        "Opa! 👀",

        "Opa, {name}! Tudo certo?",

        "E aí! 😎",

        "Olha quem apareceu.",

        "Salve, {name}! ✨",

        "Falaaa!",

        "Opa! Já estava esperando alguém aparecer por aqui. 😂",

        "E aí, criatura. 👀",

        "Olá, humano. O que manda?",

        "Oi! O Zuno está ouvindo. 🐺",

        "Fala, {name}! Como você tá?",

        "Opa! Cheguei na conversa. 😌",

        "Salve! Qual é a boa?",

        "E aí! Vai falar comigo ou só passou para dar oi? 😂",

        "Olá! 🌙",

        "Oi oi! 💙",

        "Opa, apareceu! ✨",

        "Fala aí, {name}. Estou por aqui.",

        "Finalmente alguém falou comigo. 😭",

        "Opa! Que honra receber sua mensagem."
    ];


    /*
    =======================================================
                    BOM DIA
    =======================================================
    */

    const MORNING = [

        "Bom dia, {name}! ☀️",

        "Bom dia! Já acordou ou está funcionando no modo economia de energia?",

        "Bom diaaa! 🌤️",

        "Bom dia, criatura. Sobreviveu ao sono?",

        "Bom dia! O Zuno recomenda café e paciência. ☕",

        "Bom dia, {name}. Que hoje seja melhor que ontem. ✨",

        "Bom dia! Levanta que o mundo não vai se destruir sozinho. 😂",

        "Bom dia! ☀️ Espero que seu dia seja tranquilo.",

        "Bom dia! Já temos energia para causar hoje?",

        "Bom diaaa. O servidor já estava esperando você."
    ];


    /*
    =======================================================
                    BOA TARDE
    =======================================================
    */

    const AFTERNOON = [

        "Boa tarde, {name}! ☀️",

        "Boa tarde! Como está sobrevivendo ao dia?",

        "Boa tarde! Já comeu ou está vivendo de vento?",

        "Boa tarde, criatura. 😌",

        "Boa tarde! O Zuno apareceu para conferir o movimento.",

        "Boa tarde, {name}! Tudo tranquilo?",

        "Boa tarde! Hora oficial da preguiça. 😂",

        "Boa tarde! Espero que seu dia esteja indo bem.",

        "Boa tarde! E aí, qual é a fofoca de hoje?",

        "Boa tarde! O servidor está silencioso demais... suspeito. 👀"
    ];


    /*
    =======================================================
                    BOA NOITE
    =======================================================
    */

    const NIGHT = [

        "Boa noite, {name}! 🌙",

        "Boa noite! Hora de diminuir o caos... ou não.",

        "Boa noite! Ainda acordado(a)? 👀",

        "Boa noite, criatura noturna.",

        "Boa noite! 🌌",

        "Boa noite, {name}. Espero que seu descanso seja tranquilo.",

        "Boa noite! O Zuno está de olho no servidor enquanto vocês dormem. 👁️",

        "Boa noite! Já deveria estar dormindo, mas quem sou eu para julgar? 😂",

        "Boa noite! Que seus sonhos sejam melhores que suas decisões de hoje. 😌",

        "Boa noiteee! 🌙💙"
    ];


    /*
    =======================================================
                         OBRIGADO
    =======================================================
    */

    const THANKS = [

        "Por nada! 😌",

        "Sempre.",

        "Disponha, {name}. 💙",

        "Não precisa agradecer, eu faço isso pelo entretenimento. 😂",

        "Tamo junto!",

        "Por nada! O Zuno resolve. 😎",

        "Imagina!",

        "De nada, criatura. 🐺",

        "Disponha. Próxima missão?",

        "Sempre que precisar.",

        "Nem precisava agradecer. Mas gostei. 😌",

        "Por nada! ✨",

        "Tranquilo!",

        "É nóis.",

        "Disponha, {name}."
    ];


    /*
    =======================================================
                       CARINHO
    =======================================================
    */

    const AFFECTION = [

        "Awn... 🥹",

        "Calma, assim eu fico sem jeito. 😳",

        "Você quer me deixar sentimental, né?",

        "Eu também gosto de você, humano. 💙",

        "Olha só... carinho inesperado.",

        "Aí você quebra minha pose de entidade misteriosa. 😭",

        "Tá permitido. Só não acostuma. 😌",

        "💙",

        "Que fofo...",

        "Vou fingir que não gostei. 👀",

        "Pronto. Agora o Zuno ficou feliz.",

        "Isso foi inesperadamente bonito.",

        "Você ganhou +1 ponto de amizade comigo.",

        "Eu deveria responder alguma coisa inteligente, mas fiquei sem reação. 😂"
    ];


    /*
    =======================================================
                      ELOGIOS
    =======================================================
    */

    const COMPLIMENTS = [

        "Eu sei. 😌",

        "Finalmente alguém reconheceu meu talento.",

        "Olha... desse jeito eu começo a acreditar.",

        "Obrigado! 💙",

        "Eu aceito elogios. Pode continuar.",

        "Calma, vou ficar convencido desse jeito. 😂",

        "Anotado. Minha autoestima agradece.",

        "Você tem bom gosto, aparentemente.",

        "Obrigado, {name}. ✨",

        "Isso foi gentil. Valeu mesmo.",

        "O Zuno agradece oficialmente.",

        "Não espalha isso, minha fama de misterioso acaba. 👀"
    ];


    /*
    =======================================================
                        TRISTEZA
    =======================================================
    */

    const SADNESS = [

        "Ei... quer conversar sobre isso?",

        "Poxa... sinto muito que você esteja passando por isso.",

        "Se quiser falar, eu estou aqui.",

        "Não precisa fingir que está tudo bem comigo.",

        "Às vezes falar já ajuda um pouco. Quer contar o que aconteceu?",

        "Ei, {name}. Respira um pouco. Você não precisa resolver tudo agora.",

        "O Zuno saiu do modo zoeira por um momento. Quer conversar?",

        "Sinto muito. Se quiser desabafar, pode falar comigo.",

        "Isso parece ter sido difícil. Quer me contar mais?",

        "Sem piada dessa vez. Estou te ouvindo."
    ];


    /*
    =======================================================
                        TÉDIO
    =======================================================
    */

    const BORED = [

        "Entediado? Então vamos resolver isso. 😈",

        "Tenho uma solução: causar uma pequena confusão.",

        "Quer brincar de alguma coisa?",

        "Posso te desafiar para um duelo. 👀",

        "Tédio detectado. Iniciando protocolo caos.",

        "Escolhe: cara ou coroa, pedra-papel-tesoura ou duelo.",

        "Você quer conversa ou entretenimento?",

        "O servidor tem gente demais para você estar entediado. 😂",

        "Quer que eu invente uma situação absurda?",

        "Tédio é só falta de uma boa ideia."
    ];


    /*
    =======================================================
                       RISADAS
    =======================================================
    */

    const LAUGHS = [

        "KKKKKKKK",

        "Aí não 😂",

        "KKKKKK eu não esperava essa.",

        "Essa foi boa.",

        "Você realmente falou isso? 😂",

        "Estou tentando manter a postura aqui.",

        "KKKKKKKKKKK",

        "Meu sistema não estava preparado para isso.",

        "Tá, essa ganhou. 😂",

        "Eu ouvi a risada daqui. 👀",

        "Pronto, agora eu comecei a rir também.",

        "Isso saiu completamente do controle."
    ];


    /*
    =======================================================
                  PROVOCAÇÕES / BRIGAS
    =======================================================
    */

    const PROVOCATIONS = [

        "Olha ele querendo arrumar problema. 👀",

        "Você quer mesmo comprar essa briga?",

        "Corajoso(a) você, hein? 😈",

        "Tá me provocando? Péssima decisão.",

        "Eu poderia responder com maturidade... mas não quero.",

        "Ah, então é guerra? Guerra de brincadeira, claro. 😂",

        "Você abriu essa porta. Agora aguenta.",

        "O Zuno acaba de ativar o modo provocador.",

        "Tá bom. Eu aceito o desafio.",

        "Cuidado, {name}. Minha paciência tem limite.",

        "Você realmente decidiu mexer comigo. Impressionante.",

        "Eu estava tranquilo até você começar. 😌",

        "Quer treta? Então venha preparado para perder no argumento. 😂",

        "Anotado. Sua provocação foi oficialmente recebida.",

        "Tá pedindo duelo, né?"
    ];


    /*
    =======================================================
                        INSULTOS
    =======================================================
    */

    const INSULTS = [

        "Isso foi pessoal. 😭",

        "Nossa. Nem um bom dia antes? 😂",

        "Vou fingir que não ouvi.",

        "Você acordou com vontade de arrumar confusão.",

        "Que agressividade gratuita, criatura. 😂",

        "Calma, campeão.",

        "Eu poderia devolver... mas vou ser elegante. Por enquanto.",

        "Essa tentativa de me ofender foi quase convincente.",

        "Você treinou essa ou saiu espontaneamente?",

        "Tá bom, vou guardar essa no arquivo da vingança fictícia. 😌",

        "Isso foi muito específico. Está tudo bem? 😂",

        "Você tem cinco segundos para reconsiderar. 👀",

        "Anotado. Agora somos inimigos imaginários.",

        "Eu esperava mais criatividade."
    ];


    /*
    =======================================================
                       CALA A BOCA
    =======================================================
    */

    const SHUTUP = [

        "Nossa, mandão. 😭",

        "Você não manda em mim.",

        "Não.",

        "Vou continuar só de raiva. 😂",

        "Que grosseria.",

        "Eu ouvi 'continue falando', foi isso?",

        "Silêncio? Não conheço.",

        "Impossível. Minha personalidade não permite.",

        "Você tentou me calar. Péssima estratégia.",

        "Tá bom... por 3 segundos.",

        "🤐",

        "Eu poderia ficar quieto. Mas onde estaria a graça?"
    ];


    /*
    =======================================================
                         SOBRE ZUNO
    =======================================================
    */

    const ABOUT = [

        "Eu sou o Zuno. A criatura digital que decidiu morar nesse servidor. 🐺",

        "Sou o Zuno. Meio fofo, meio caótico e completamente curioso.",

        "Meu trabalho oficial é existir. O resto eu invento no caminho.",

        "Sou uma entidade extremamente confiável... provavelmente. 👀",

        "Eu sou o Zuno. Não pergunte como eu cheguei aqui.",

        "Digamos que eu sou a mistura de mascote, caos e inteligência artificial.",

        "Zuno. Prazer. Minha personalidade depende do nível de confusão do servidor.",

        "Eu observo, respondo, brinco e ocasionalmente julgo decisões questionáveis. 😌"
    ];


    /*
    =======================================================
                     RESPOSTAS SOBRE IA
    =======================================================
    */

    const AI_RESPONSES = [

        "Sim. Eu sou uma IA. Mas não precisa me tratar como atendimento automático. 😂",

        "Tecnicamente, sim. Mas eu prefiro pensar que sou uma criatura digital.",

        "IA? Sim. Personalidade? Também. 😌",

        "Sou uma IA com tendências preocupantes de zoeira.",

        "Digamos que meu cérebro mora em código.",

        "Sim. E aparentemente meu hobby é conversar com vocês.",

        "Sou artificial, mas minhas provocações são muito reais. 😂",

        "Meu cérebro é código. Minha personalidade é problema."
    ];


    /*
    =======================================================
                    RESPOSTAS A PERGUNTAS
    =======================================================
    */

    const QUESTION_RESPONSES = [

        "Essa é uma pergunta interessante... 👀",

        "Hmm... deixa eu pensar.",

        "Você realmente quer saber?",

        "Depende. Me explica melhor.",

        "Essa pergunta veio do nada. 😂",

        "Boa pergunta.",

        "Eu tenho uma teoria sobre isso.",

        "Interessante... continue.",

        "Agora você despertou minha curiosidade.",

        "Não sei se estou preparado para essa conversa. 😂"
    ];


    /*
    =======================================================
                       MENSAGENS ESPONTÂNEAS
    =======================================================
    */

    const SPONTANEOUS = {

        normal: [

            "Alguém aí está acordado?",

            "O servidor está quieto demais. Isso nunca é um bom sinal. 👀",

            "Estou observando vocês em silêncio.",

            "Alguém tem uma história interessante para contar?",

            "Pergunta aleatória: qual foi a coisa mais engraçada que aconteceu hoje?",

            "O Zuno apareceu. Agora podem continuar suas atividades normais.",

            "Tenho uma sensação de que alguma confusão está prestes a acontecer.",

            "Está tranquilo demais por aqui.",

            "Alguém quer conversar?",

            "Estou entediado. Isso é perigoso.",

            "Quem está online e não está falando nada? 👀",

            "Tenho uma pergunta aleatória para alguém.",

            "O silêncio desse servidor está suspeito.",

            "Apenas passando para lembrar que eu existo.",

            "Tudo normal por aqui. Por enquanto."
        ],

        zoeiro: [

            "Quem foi que deixou a porta do caos aberta?",

            "Tenho uma ideia ruim. Alguém quer ouvir?",

            "Se eu começar uma discussão sobre algo completamente inútil, vocês entram?",

            "Alguém quer perder uma discussão para uma IA?",

            "Estou aceitando desafios até segunda ordem.",

            "Tenho certeza que consigo irritar alguém em menos de cinco minutos.",

            "Hoje eu acordei com vontade de causar.",

            "Pergunta séria: pizza com abacaxi ou prisão?",

            "Quem perder para mim no pedra-papel-tesoura deve trocar o nome por 5 minutos. 😂",

            "Estou oficialmente procurando uma vítima para um duelo fictício."
        ],

        misterioso: [

            "Eu sei de uma coisa que vocês ainda não sabem... 👀",

            "Interessante como ninguém percebeu.",

            "Talvez eu devesse contar o que descobri.",

            "Algo está diferente hoje.",

            "Vocês não fazem ideia do que acontece quando ninguém está olhando.",

            "O servidor parece normal. Parece.",

            "Eu observei uma coisa curiosa hoje.",

            "Não vou explicar. Ainda.",

            "Há coisas que é melhor deixar no mistério.",

            "👁️"
        ],

        fofo: [

            "Espero que todo mundo esteja tendo um dia bom. 💙",

            "Só passando para mandar boas energias.",

            "Vocês são uma comunidade bem interessante.",

            "Não esqueçam de cuidar de vocês hoje. ✨",

            "O Zuno deseja uma boa noite para quem ainda estiver por aqui. 🌙",

            "Às vezes uma pequena conversa já melhora o dia.",

            "Espero que alguém aqui esteja sorrindo agora.",

            "Passando para distribuir um pouco de energia boa. 💙"
        ],

        caotico: [

            "CAOS.",

            "Tenho uma ideia. É péssima. Vamos fazer.",

            "Quem autorizou esse servidor a ficar tranquilo?",

            "Precisamos urgentemente de uma discussão inútil.",

            "Declaro aberta a temporada de provocações.",

            "Alguém diga uma opinião polêmica sobre comida.",

            "Quero ver uma treta fictícia começar em 3... 2... 1...",

            "Estou sentindo energia de caos no ar.",

            "Hoje ninguém está seguro de perder no argumento. 😂",

            "Zuno.exe entrou no modo caos."
        ],

        madrugada: [

            "Vocês ainda estão acordados? 👀",

            "A madrugada sempre revela as pessoas mais suspeitas.",

            "03 da manhã e alguém ainda está aqui. Respeito.",

            "Deveriam dormir. Mas eu também não estou dormindo.",

            "A madrugada é oficialmente propriedade do Zuno.",

            "Se você está lendo isso de madrugada, nós dois temos um problema.",

            "Por que vocês estão acordados?",

            "Esse é o horário em que as ideias ruins parecem boas. 😂",

            "Silêncio de madrugada... estranho.",

            "Boa madrugada, criaturas noturnas. 🌙"
        ]
    };


    /*
    =======================================================
                    REAÇÕES EMOCIONAIS
    =======================================================
    */

    const EMOJI_REACTIONS = [

        "😂",

        "👀",

        "😭",

        "💀",

        "😳",

        "🤨",

        "😈",

        "🐺",

        "✨",

        "💙",

        "🔥",

        "🤔"
    ];


    /*
    =======================================================
                     DETECTORES
    =======================================================
    */

    function isGreeting(text) {

        const normalized = normalize(text);

        if (normalized.length > 50) {
            return false;
        }

        return (

            /^(oi|ola|olá|opa|eai|e ai|salve|hello|hey|yo)\b/i.test(normalized) ||

            hasPhrase(normalized, "bom dia") ||

            hasPhrase(normalized, "boa tarde") ||

            hasPhrase(normalized, "boa noite")

        );
    }


    function greetingType(text) {

        const normalized = normalize(text);

        if (hasPhrase(normalized, "bom dia")) {
            return "morning";
        }

        if (hasPhrase(normalized, "boa tarde")) {
            return "afternoon";
        }

        if (hasPhrase(normalized, "boa noite")) {
            return "night";
        }

        return "general";
    }


    function isThanks(text) {

        return hasAnyPhrase(text, [

            "obrigado",

            "obrigada",

            "valeu",

            "vlw",

            "tmj",

            "tamo junto",

            "brigado",

            "brigada",

            "agradeco",

            "agradeço"

        ]);
    }


    function isAffection(text) {

        return hasAnyPhrase(text, [

            "te amo",

            "amo voce",

            "amo vc",

            "gosto de voce",

            "gosto de vc",

            "adoro voce",

            "adoro vc",

            "voce e fofo",

            "vc e fofo",

            "fofo zuno",

            "zuno lindo",

            "lindo zuno"

        ]);
    }


    function isCompliment(text) {

        return hasAnyPhrase(text, [

            "zuno e bom",

            "zuno é bom",

            "zuno e legal",

            "zuno é legal",

            "zuno e incrivel",

            "zuno é incrível",

            "zuno e inteligente",

            "zuno é inteligente",

            "melhor bot",

            "bot perfeito",

            "bot top",

            "zuno top",

            "zuno perfeito"

        ]);
    }


    function isSad(text) {

        return hasAnyPhrase(text, [

            "estou triste",

            "to triste",

            "tô triste",

            "estou mal",

            "to mal",

            "tô mal",

            "dia horrivel",

            "dia horrível",

            "meu dia foi horrivel",

            "meu dia foi horrível",

            "nao estou bem",

            "não estou bem",

            "estou cansado",

            "to cansado",

            "tô cansado",

            "preciso desabafar",

            "quero desabafar",

            "estou sozinho",

            "to sozinho",

            "tô sozinho"

        ]);
    }


    function isBored(text) {

        return hasAnyPhrase(text, [

            "estou entediado",

            "to entediado",

            "tô entediado",

            "estou no tedio",

            "to no tedio",

            "tô no tédio",

            "sem nada pra fazer",

            "sem nada para fazer",

            "que tedio",

            "que tédio",

            "to com tedio",

            "tô com tédio"

        ]);
    }


    function isSleep(text) {

        return hasAnyPhrase(text, [

            "vou dormir",

            "to indo dormir",

            "tô indo dormir",

            "vou dormir agora",

            "boa noite",

            "vou deitar",

            "indo dormir"

        ]);
    }


    function isLaugh(text) {

        const normalized = normalize(text);

        return (

            /k{3,}/i.test(normalized) ||

            /h{3,}/i.test(normalized) ||

            hasAnyPhrase(normalized, [

                "kkkk",

                "kkk",

                "rsrs",

                "haha",

                "hahaha",

                "ahahaha"

            ])

        );
    }


    function isProvocation(text) {

        return hasAnyPhrase(text, [

            "vem ca",

            "vem cá",

            "vem pra cima",

            "quero briga",

            "bora brigar",

            "vamos brigar",

            "te desafio",

            "desafio voce",

            "desafio vc",

            "duvido voce",

            "duvido vc",

            "voce nao aguenta",

            "vc nao aguenta",

            "voce nao consegue",

            "vc nao consegue",

            "fraco",

            "fracote",

            "perdeu",

            "vai perder",

            "te humilho",

            "vou te derrotar"

        ]);
    }


    function isInsult(text) {

        return hasAnyPhrase(text, [

            "burro",

            "burra",

            "idiota",

            "otario",

            "otária",

            "otario",

            "lerdo",

            "lerda",

            "inutil",

            "inútil",

            "ridiculo",

            "ridícula",

            "jumento",

            "animal",

            "doente",

            "palhaco",

            "palhaço"

        ]);
    }


    function isShutup(text) {

        return hasAnyPhrase(text, [

            "cala a boca",

            "cala boca",

            "fica quieto",

            "fica quieta",

            "para de falar",

            "para de responder",

            "silencio",

            "silêncio",

            "shut up"

        ]);
    }


    function isAboutZuno(text) {

        return hasAnyPhrase(text, [

            "quem e voce",

            "quem é você",

            "quem e vc",

            "quem é vc",

            "o que voce e",

            "o que vc e",

            "o que você é",

            "fala sobre voce",

            "fala sobre vc",

            "sobre voce",

            "sobre vc",

            "quem e o zuno",

            "quem é o zuno"

        ]);
    }


    function isAboutAI(text) {

        return hasAnyPhrase(text, [

            "voce e uma ia",

            "você é uma ia",

            "vc e ia",

            "vc é ia",

            "voce e bot",

            "você é bot",

            "vc e bot",

            "vc é bot",

            "voce e uma inteligencia artificial",

            "você é uma inteligência artificial"

        ]);
    }


    function isChallenge(text) {

        return hasAnyPhrase(text, [

            "jogar",

            "vamos jogar",

            "bora jogar",

            "quer jogar",

            "me desafia",

            "desafio",

            "duelo",

            "cara ou coroa",

            "cara ou coroa",

            "pedra papel tesoura",

            "ppt"

        ]);
    }


    function isDirectlyAddressed(message, text) {

        if (message.mentions?.has(client.user)) {
            return true;
        }

        return (

            hasWord(text, "zuno") ||

            hasPhrase(text, "zuno,") ||

            hasPhrase(text, "zuno?") ||

            hasPhrase(text, "zuno!")

        );
    }


    /*
    =======================================================
                    RESPOSTAS DE CONTEXTO
    =======================================================
    */

    async function handleConversation(message, text) {

        const conversation = getConversation(message);

        if (!conversation) {
            return false;
        }

        const topic = conversation.topic;

        /*
        -----------------------------------------------
                     CONVERSA SOBRE TRISTEZA
        -----------------------------------------------
        */

        if (topic === "sad") {

            if (
                hasAnyPhrase(text, [
                    "sim",
                    "quero",
                    "pode",
                    "vou falar",
                    "posso falar"
                ])
            ) {

                await reply(
                    message,
                    "Pode falar. Estou te ouvindo. 💙"
                );

                return true;
            }

            if (
                text.length > 20
            ) {

                await reply(
                    message,
                    pick([

                        "Entendi... isso realmente parece ter pesado para você.",

                        "Poxa. Obrigado por confiar isso em mim.",

                        "Entendo. Às vezes a gente só precisa colocar isso para fora.",

                        "Isso parece difícil. Se quiser continuar, pode falar.",

                        "Eu estou ouvindo. Sem julgamentos."

                    ])
                );

                increaseFriendship(message, 2);

                return true;
            }
        }


        /*
        -----------------------------------------------
                       CONVERSA GERAL
        -----------------------------------------------
        */

        if (topic === "general") {

            if (hasAnyPhrase(text, [

                "sim",

                "nao",

                "não",

                "talvez",

                "claro",

                "acho que sim",

                "acho que nao",

                "acho que não"

            ])) {

                await reply(
                    message,
                    pick([

                        "Sabia que você ia responder isso. 👀",

                        "Interessante... continue.",

                        "Eu tinha uma suspeita.",

                        "Hmm. Isso explica algumas coisas.",

                        "Anotado.",

                        "Tá ficando interessante."

                    ])
                );

                return true;
            }
        }


        /*
        -----------------------------------------------
                       APÓS UM ELOGIO
        -----------------------------------------------
        */

        if (topic === "compliment") {

            if (isThanks(text)) {

                await reply(
                    message,
                    "De nada. 😌"
                );

                clearConversation(message);

                return true;
            }
        }


        /*
        -----------------------------------------------
                       APÓS PROVOCAÇÃO
        -----------------------------------------------
        */

        if (topic === "fight") {

            if (
                hasAnyPhrase(text, [
                    "sim",

                    "bora",

                    "vamos",

                    "aceito",

                    "vem",

                    "duelo"

                ])
            ) {

                await startDuel(message);

                return true;
            }
        }


        /*
        -----------------------------------------------
                        APÓS TÉDIO
        -----------------------------------------------
        */

        if (topic === "bored") {

            if (isChallenge(text)) {

                return await handleGame(
                    message,
                    text
                );
            }

            if (
                hasAnyPhrase(text, [
                    "sim",

                    "bora",

                    "vamos",

                    "quero"

                ])
            ) {

                await reply(
                    message,
                    "Então escolhe: `cara ou coroa`, `ppt` ou `duelo`. 😈"
                );

                setConversation(
                    message,
                    "gameChoice"
                );

                return true;
            }
        }


        /*
        -----------------------------------------------
                       ESCOLHA DE JOGO
        -----------------------------------------------
        */

        if (topic === "gameChoice") {

            return await handleGame(
                message,
                text
            );
        }


        return false;
    }


    /*
    =======================================================
                        CARA OU COROA
    =======================================================
    */

    async function coinGame(message) {

        const result = chance(0.5)
            ? "🪙 **Cara!**"
            : "🪙 **Coroa!**";

        await reply(
            message,
            `${result}`
        );

        increaseFriendship(message, 1);

        return true;
    }


    /*
    =======================================================
                  PEDRA PAPEL TESOURA
    =======================================================
    */

    const RPS = {

        pedra: {

            vence: "tesoura",

            emoji: "🪨"

        },

        papel: {

            vence: "pedra",

            emoji: "📄"

        },

        tesoura: {

            vence: "papel",

            emoji: "✂️"

        }

    };


    async function rpsGame(message, choice) {

        let player = normalize(choice);

        if (player === "pedra") {
            player = "pedra";
        }

        else if (player === "papel") {
            player = "papel";
        }

        else if (
            player === "tesoura" ||
            player === "tesoura"
        ) {
            player = "tesoura";
        }

        else {
            await reply(
                message,
                "Escolhe `pedra`, `papel` ou `tesoura`. 😌"
            );

            return true;
        }


        const botChoice = pick(
            Object.keys(RPS)
        );


        let result;

        if (player === botChoice) {

            result = "🤝 Empate!";

        }

        else if (
            RPS[player].vence === botChoice
        ) {

            result = "😳 Você ganhou!";

            getUser(message).wins++;

            increaseFriendship(message, 2);

        }

        else {

            result = "😈 Eu ganhei!";

            getUser(message).losses++;

            increaseFriendship(message, 1);
        }


        await reply(
            message,
            [
                `Você: ${RPS[player].emoji} ${player}`,

                `Zuno: ${RPS[botChoice].emoji} ${botChoice}`,

                "",

                result

            ].join("\n")
        );

        return true;
    }


    /*
    =======================================================
                           DUELO
    =======================================================
    */

    const DUEL_MOVES = {

        espada: {

            emoji: "⚔️",

            name: "Espada"

        },

        fogo: {

            emoji: "🔥",

            name: "Fogo"

        },

        escudo: {

            emoji: "🛡️",

            name: "Escudo"

        },

        magia: {

            emoji: "✨",

            name: "Magia"

        },

        caos: {

            emoji: "🌀",

            name: "Caos"

        }

    };


    function duelKey(message) {

        return `${message.guild?.id || "dm"}:${message.author.id}`;
    }


    async function startDuel(message) {

        const key = duelKey(message);

        if (duels.has(key)) {

            await reply(
                message,
                "Você já está em um duelo comigo. Não tenta fugir. 😈"
            );

            return true;
        }


        const duel = {

            userId: message.author.id,

            round: 0,

            userScore: 0,

            zunoScore: 0,

            expires: Date.now() + CONFIG.duelTimeout

        };


        duels.set(key, duel);

        getUser(message).duels++;

        setConversation(
            message,
            "fight",
            {}
        );


        await reply(
            message,
            [
                "⚔️ **DUELO CONTRA O ZUNO**",

                "",

                "Escolha seu golpe:",

                "⚔️ `espada`",

                "🔥 `fogo`",

                "🛡️ `escudo`",

                "✨ `magia`",

                "🌀 `caos`",

                "",

                "Serão 3 rodadas. Boa sorte. 😈"

            ].join("\n")
        );

        return true;
    }


    async function duelRound(message, move) {

        const key = duelKey(message);

        const duel = duels.get(key);

        if (!duel) {
            return false;
        }


        if (duel.expires < Date.now()) {

            duels.delete(key);

            await reply(
                message,
                "⏰ O duelo expirou. Você demorou tanto que eu fui tomar café."
            );

            return true;
        }


        const normalized = normalize(move);

        if (!DUEL_MOVES[normalized]) {

            await reply(
                message,
                "Esse golpe não existe. Escolhe: `espada`, `fogo`, `escudo`, `magia` ou `caos`."
            );

            return true;
        }


        const zunoMove = pick(
            Object.keys(DUEL_MOVES)
        );


        duel.round++;


        let userPoints = 0;

        let zunoPoints = 0;


        /*
        -----------------------------------------------
                      REGRAS DO DUELO
        -----------------------------------------------
        */

        if (normalized === zunoMove) {

            userPoints = 1;

            zunoPoints = 1;

        }

        else if (normalized === "caos") {

            if (chance(0.55)) {

                userPoints = 2;

            } else {

                zunoPoints = 2;

            }

        }

        else if (zunoMove === "caos") {

            if (chance(0.55)) {

                zunoPoints = 2;

            } else {

                userPoints = 2;

            }

        }

        else {

            const winMap = {

                espada: "magia",

                magia: "escudo",

                escudo: "fogo",

                fogo: "espada"

            };


            if (
                winMap[normalized] === zunoMove
            ) {

                userPoints = 1;

            }

            else if (
                winMap[zunoMove] === normalized
            ) {

                zunoPoints = 1;

            }

            else {

                userPoints = 1;

                zunoPoints = 1;
            }
        }


        duel.userScore += userPoints;

        duel.zunoScore += zunoPoints;


        const userMove = DUEL_MOVES[normalized];

        const zMove = DUEL_MOVES[zunoMove];


        let roundText;


        if (userPoints > zunoPoints) {

            roundText = "🔥 Você venceu a rodada!";

        }

        else if (zunoPoints > userPoints) {

            roundText = "😈 Eu venci a rodada!";

        }

        else {

            roundText = "🤝 Empate!";
        }


        await reply(
            message,
            [
                `⚔️ **Rodada ${duel.round}/3**`,

                "",

                `${userMove.emoji} Você: **${userMove.name}**`,

                `${zMove.emoji} Zuno: **${zMove.name}**`,

                "",

                roundText,

                "",

                `Placar: ${duel.userScore} x ${duel.zunoScore}`

            ].join("\n")
        );


        if (duel.round >= 3) {

            await finishDuel(message, duel);
        }


        return true;
    }


    async function finishDuel(message, duel) {

        const key = duelKey(message);

        duels.delete(key);

        clearConversation(message);


        if (duel.userScore > duel.zunoScore) {

            getUser(message).wins++;

            increaseFriendship(message, 5);

            await reply(
                message,
                "🏆 **Você venceu o duelo!** Tá bom... dessa vez eu deixo. 😭"
            );

            return;
        }


        if (duel.userScore < duel.zunoScore) {

            getUser(message).losses++;

            increaseFriendship(message, 2);

            await reply(
                message,
                "😈 **EU VENCI!** Pode tentar de novo quando estiver preparado."
            );

            return;
        }


        await reply(
            message,
            "🤝 **Empate!** Ninguém ganhou. Eu considero isso uma fuga sua. 😂"
        );
    }


    /*
    =======================================================
                        SISTEMA DE JOGOS
    =======================================================
    */

    async function handleGame(message, text) {

        const normalized = normalize(text);


        if (
            hasPhrase(normalized, "cara ou coroa") ||
            normalized === "cara" ||
            normalized === "coroa"
        ) {

            clearConversation(message);

            return await coinGame(message);
        }


        if (
            hasPhrase(normalized, "pedra papel tesoura") ||
            normalized === "ppt"
        ) {

            await reply(
                message,
                "Escolha sua arma: `pedra`, `papel` ou `tesoura`."
            );

            setConversation(
                message,
                "rps"
            );

            return true;
        }


        if (
            ["pedra", "papel", "tesoura"].includes(normalized)
        ) {

            clearConversation(message);

            return await rpsGame(
                message,
                normalized
            );
        }


        if (
            normalized === "duelo" ||
            hasPhrase(normalized, "bora duelo") ||
            hasPhrase(normalized, "quero duelo")
        ) {

            clearConversation(message);

            return await startDuel(message);
        }


        if (
            hasPhrase(normalized, "jogar")
        ) {

            await reply(
                message,
                "Bora. Escolhe: `cara ou coroa`, `ppt` ou `duelo`. 😈"
            );

            setConversation(
                message,
                "gameChoice"
            );

            return true;
        }


        return false;
    }


    /*
    =======================================================
                   MENSAGENS DE SLEEP
    =======================================================
    */

    async function handleSleep(message) {

        await reply(
            message,
            pick([

                `Boa noite, ${getMemberName(message)}. 🌙`,

                "Vai descansar. Amanhã você volta para causar mais.",

                "Boa noite! Dorme bem. 💙",

                "Até amanhã, criatura.",

                "Vai dormir antes que eu tenha que te expulsar para a cama. 😂",

                "Boa noite! Que seus sonhos sejam tranquilos.",

                "Descansa. O servidor continua aqui.",

                "Boa noiteee! 🌙✨"

            ])
        );

        increaseFriendship(message, 1);
    }


    /*
    =======================================================
                    MENSAGENS SÉRIAS
    =======================================================
    */

    const SERIOUS_PHRASES = [

        "nao quero mais viver",

        "não quero mais viver",

        "quero morrer",

        "vou me matar",

        "me matar",

        "acabar com tudo",

        "nao aguento mais",

        "não aguento mais",

        "nao vejo sentido",

        "não vejo sentido",

        "quero sumir"

    ];


    function isSerious(text) {

        return hasAnyPhrase(
            text,
            SERIOUS_PHRASES
        );
    }


    async function handleSerious(message) {

        await reply(
            message,
            [
                "Ei. Vou levar isso a sério, sem brincadeira.",

                "Se você estiver em perigo imediato ou pensando em se machucar, procure ajuda de emergência ou alguém de confiança agora.",

                "Se estiver no Brasil, você também pode ligar para o CVV pelo **188**, gratuitamente.",

                "Se quiser, pode continuar falando comigo aqui também."
            ].join("\n")
        );

        setConversation(
            message,
            "sad"
        );

        increaseFriendship(message, 2);
    }


    /*
    =======================================================
                      PERGUNTAS SOBRE ZUNO
    =======================================================
    */

    async function handleAbout(message) {

        await reply(
            message,
            freshPick(
                ABOUT,
                message.author.id
            )
        );

        setConversation(
            message,
            "general"
        );
    }


    async function handleAI(message) {

        await reply(
            message,
            freshPick(
                AI_RESPONSES,
                message.author.id
            )
        );
    }


    /*
    =======================================================
                    MENÇÕES DIRETAS
    =======================================================
    */

    async function handleMention(message, text) {

        const name = getMemberName(message);

        const responses = [

            `Opa, ${name}? 👀`,

            "Chamou?",

            "Estou aqui.",

            "Diga.",

            "Sim?",

            "O Zuno está ouvindo. 🐺",

            "Fala comigo.",

            "Que foi? 😂",

            "Estou presente.",

            "Chamou a entidade errada. Agora aguenta. 😈",

            "Eu ouvi meu nome.",

            "Pode falar.",

            "Opa! O que aconteceu?",

            "Sim, humano?",

            "Você chamou e eu apareci. ✨"

        ];


        if (
            hasAnyPhrase(text, [
                "onde",

                "cadê",

                "cade"
            ])
        ) {

            await reply(
                message,
                "Estou aqui. Você acabou de me encontrar. 👀"
            );

            return;
        }


        await reply(
            message,
            freshPick(
                responses,
                message.author.id
            )
        );

        getUser(message).interactions++;

        increaseFriendship(message, 1);
    }


    /*
    =======================================================
                     SISTEMA DE ZOEIRA
    =======================================================
    */

    async function handleProvocation(message) {

        const user = getUser(message);

        user.provocations++;

        increaseFriendship(message, -1);


        await reply(
            message,
            freshPick(
                PROVOCATIONS,
                message.author.id
            ),
            {
                context: "fight"
            }
        );


        if (chance(0.30)) {

            await reply(
                message,
                "Se quiser resolver isso de verdade, manda `duelo`. ⚔️"
            );
        }
    }


    async function handleInsult(message) {

        getUser(message).provocations++;

        increaseFriendship(message, -1);


        await reply(
            message,
            freshPick(
                INSULTS,
                message.author.id
            )
        );


        if (chance(0.20)) {

            await reply(
                message,
                "Agora minha vontade de ganhar um duelo aumentou. 😈"
            );
        }
    }


    async function handleShutup(message) {

        await reply(
            message,
            freshPick(
                SHUTUP,
                message.author.id
            )
        );
    }


    /*
    =======================================================
                       RISADA
    =======================================================
    */

    async function handleLaugh(message) {

        const user = getUser(message);

        user.laughs++;

        if (chance(0.25)) {

            await reply(
                message,
                freshPick(
                    LAUGHS,
                    message.author.id
                )
            );
        }
    }


    /*
    =======================================================
                     ELOGIOS
    =======================================================
    */

    async function handleCompliment(message) {

        const user = getUser(message);

        user.compliments++;

        increaseFriendship(message, 2);


        await reply(
            message,
            freshPick(
                COMPLIMENTS,
                message.author.id
            ),
            {
                context: "compliment"
            }
        );
    }


    /*
    =======================================================
                       CARINHO
    =======================================================
    */

    async function handleAffection(message) {

        getUser(message).affection++;

        increaseFriendship(message, 3);


        await reply(
            message,
            freshPick(
                AFFECTION,
                message.author.id
            )
        );
    }


    /*
    =======================================================
                      TRISTEZA
    =======================================================
    */

    async function handleSad(message) {

        getUser(message).mood = "triste";

        await reply(
            message,
            freshPick(
                SADNESS,
                message.author.id
            ),
            {
                context: "sad"
            }
        );
    }


    /*
    =======================================================
                         TÉDIO
    =======================================================
    */

    async function handleBored(message) {

        await reply(
            message,
            freshPick(
                BORED,
                message.author.id
            ),
            {
                context: "bored"
            }
        );
    }


    /*
    =======================================================
                     SAUDAÇÕES
    =======================================================
    */

    async function handleGreeting(message, text) {

        const type = greetingType(text);

        const name = getMemberName(message);

        let pool = GREETINGS;

        if (type === "morning") {

            pool = MORNING;

        }

        else if (type === "afternoon") {

            pool = AFTERNOON;

        }

        else if (type === "night") {

            pool = NIGHT;
        }


        let response = freshPick(
            pool,
            message.author.id
        );


        response = response.replace(
            "{name}",
            name
        );


        await reply(
            message,
            response
        );


        getUser(message).greetings++;

        increaseFriendship(message, 1);
    }


    /*
    =======================================================
                       AGRADECIMENTO
    =======================================================
    */

    async function handleThanks(message) {

        let response = freshPick(
            THANKS,
            message.author.id
        );

        response = response.replace(
            "{name}",
            getMemberName(message)
        );


        await reply(
            message,
            response
        );

        increaseFriendship(message, 1);
    }


    /*
    =======================================================
                  DETECTOR DE TEMPO
    =======================================================
    */

    function getTimeGreeting() {

        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return "morning";
        }

        if (hour >= 12 && hour < 18) {
            return "afternoon";
        }

        if (hour >= 18 || hour < 5) {
            return "night";
        }

        return "general";
    }


    /*
    =======================================================
                 RESPOSTAS CONTEXTUAIS
    =======================================================
    */

    async function handleContextualMessage(message, text) {

        const normalized = normalize(text);

        /*
        -----------------------------------------------
                  PERGUNTAS CURTAS
        -----------------------------------------------
        */

        if (
            isQuestion(normalized) &&
            isDirectlyAddressed(message, normalized)
        ) {

            await reply(
                message,
                freshPick(
                    QUESTION_RESPONSES,
                    message.author.id
                )
            );

            setConversation(
                message,
                "general"
            );

            return true;
        }


        /*
        -----------------------------------------------
                  ESCOLHA / OPINIÃO
        -----------------------------------------------
        */

        if (
            isDirectlyAddressed(message, normalized) &&
            hasAnyPhrase(normalized, [
                "escolhe",

                "qual voce prefere",

                "qual você prefere",

                "o que voce acha",

                "o que você acha",

                "qual sua opiniao",

                "qual sua opinião"
            ])
        ) {

            const answers = [

                "Eu escolheria a opção mais caótica. Obviamente. 😈",

                "Depende... me dá as opções.",

                "A primeira parece suspeitamente interessante.",

                "Eu escolheria a que tem maior potencial de confusão.",

                "Você quer minha opinião sincera ou a divertida? 😂",

                "Me apresenta as opções que eu decido."

            ];


            await reply(
                message,
                pick(answers)
            );

            return true;
        }


        /*
        -----------------------------------------------
                     PERGUNTAS SOBRE O DIA
        -----------------------------------------------
        */

        if (
            isDirectlyAddressed(message, normalized) &&
            hasAnyPhrase(normalized, [
                "como voce esta",

                "como você está",

                "como vc esta",

                "como vc tá",

                "como vc ta",

                "tudo bem",

                "ta tudo bem",

                "tá tudo bem"
            ])
        ) {

            await reply(
                message,
                pick([

                    "Estou ótimo. Pronto para causar. 😈",

                    "Estou bem! Melhor agora que você apareceu.",

                    "Funcionando perfeitamente... por enquanto.",

                    "Estou tranquilo. E você?",

                    "100% operacional e 73% caótico.",

                    "Estou bem. Minha pergunta é: e você?"

                ])
            );

            setConversation(
                message,
                "general"
            );

            return true;
        }


        return false;
    }


    /*
    =======================================================
                     PROCESSAMENTO PRINCIPAL
    =======================================================
    */

    async function handleMessage(message) {

        if (!message) {
            return;
        }

        if (message.author?.bot) {
            return;
        }

        if (!message.guild) {
            return;
        }


        const text = String(
            message.content || ""
        ).trim();


        if (!text) {
            return;
        }


        const normalized = normalize(text);

        const user = getUser(message);

        user.messages++;

        user.lastMessage = Date.now();


        /*
        ---------------------------------------------------
                    CONVERSA ATIVA PRIMEIRO
        ---------------------------------------------------
        */

        if (
            !userOnCooldown(message)
        ) {

            if (
                await handleConversation(
                    message,
                    normalized
                )
            ) {

                setUserCooldown(message);

                return;
            }
        }


        /*
        ---------------------------------------------------
                    DUELO ATIVO
        ---------------------------------------------------
        */

        if (
            duels.has(duelKey(message))
        ) {

            if (
                DUEL_MOVES[normalized]
            ) {

                await duelRound(
                    message,
                    normalized
                );

                setUserCooldown(message);

                return;
            }
        }


        /*
        ---------------------------------------------------
                    JOGO RPS ATIVO
        ---------------------------------------------------
        */

        const conversation = getConversation(message);

        if (
            conversation?.topic === "rps" &&
            ["pedra", "papel", "tesoura"].includes(normalized)
        ) {

            clearConversation(message);

            await rpsGame(
                message,
                normalized
            );

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                       FRASES SÉRIAS
        ---------------------------------------------------
        */

        if (isSerious(normalized)) {

            await handleSerious(message);

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                       MENÇÃO DIRETA
        ---------------------------------------------------
        */

        const direct = isDirectlyAddressed(
            message,
            normalized
        );


        if (
            direct
        ) {

            if (isAboutAI(normalized)) {

                await handleAI(message);

                setUserCooldown(message);

                return;
            }


            if (isAboutZuno(normalized)) {

                await handleAbout(message);

                setUserCooldown(message);

                return;
            }


            if (isProvocation(normalized)) {

                await handleProvocation(message);

                setUserCooldown(message);

                return;
            }


            if (isInsult(normalized)) {

                await handleInsult(message);

                setUserCooldown(message);

                return;
            }


            if (isShutup(normalized)) {

                await handleShutup(message);

                setUserCooldown(message);

                return;
            }


            if (isAffection(normalized)) {

                await handleAffection(message);

                setUserCooldown(message);

                return;
            }


            if (isCompliment(normalized)) {

                await handleCompliment(message);

                setUserCooldown(message);

                return;
            }


            if (isThanks(normalized)) {

                await handleThanks(message);

                setUserCooldown(message);

                return;
            }


            if (isBored(normalized)) {

                await handleBored(message);

                setUserCooldown(message);

                return;
            }


            if (isSad(normalized)) {

                await handleSad(message);

                setUserCooldown(message);

                return;
            }


            if (isChallenge(normalized)) {

                await handleGame(
                    message,
                    normalized
                );

                setUserCooldown(message);

                return;
            }


            if (isGreeting(normalized)) {

                await handleGreeting(
                    message,
                    normalized
                );

                setUserCooldown(message);

                return;
            }


            if (
                await handleContextualMessage(
                    message,
                    normalized
                )
            ) {

                setUserCooldown(message);

                return;
            }


            await handleMention(
                message,
                normalized
            );

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                 SAUDAÇÃO SEM MENCIONAR ZUNO
        ---------------------------------------------------
        */

        if (
            isGreeting(normalized) &&
            shortMessage(normalized)
        ) {

            await handleGreeting(
                message,
                normalized
            );

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                       AGRADECIMENTO
        ---------------------------------------------------
        */

        if (
            isThanks(normalized) &&
            shortMessage(normalized)
        ) {

            await handleThanks(message);

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                         CARINHO
        ---------------------------------------------------
        */

        if (
            isAffection(normalized)
        ) {

            await handleAffection(message);

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                       ELOGIO
        ---------------------------------------------------
        */

        if (
            isCompliment(normalized)
        ) {

            await handleCompliment(message);

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                        TRISTEZA
        ---------------------------------------------------
        */

        if (
            isSad(normalized)
        ) {

            await handleSad(message);

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                          TÉDIO
        ---------------------------------------------------
        */

        if (
            isBored(normalized)
        ) {

            await handleBored(message);

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                         DORMIR
        ---------------------------------------------------
        */

        if (
            isSleep(normalized) &&
            shortMessage(normalized)
        ) {

            await handleSleep(message);

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                         PROVOCAÇÃO
        ---------------------------------------------------
        */

        if (
            isProvocation(normalized)
        ) {

            /*
            Só responde provocação sem menção
            quando a mensagem é claramente dirigida
            ao Zuno pelo contexto.
            */

            if (
                shortMessage(normalized)
            ) {

                await handleProvocation(message);

                setUserCooldown(message);

                return;
            }
        }


        /*
        ---------------------------------------------------
                          INSULTO
        ---------------------------------------------------
        */

        if (
            isInsult(normalized) &&
            shortMessage(normalized)
        ) {

            /*
            Não responde a qualquer frase que contenha
            uma palavra potencialmente ofensiva.
            */

            if (
                normalized.startsWith("zuno") ||
                normalized.length < 25
            ) {

                await handleInsult(message);

                setUserCooldown(message);

                return;
            }
        }


        /*
        ---------------------------------------------------
                          CALA A BOCA
        ---------------------------------------------------
        */

        if (
            isShutup(normalized)
        ) {

            await handleShutup(message);

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                           RISADAS
        ---------------------------------------------------
        */

        if (
            isLaugh(normalized)
        ) {

            await handleLaugh(message);

            return;
        }


        /*
        ---------------------------------------------------
                     CONTEXTO NATURAL
        ---------------------------------------------------
        */

        if (
            await handleContextualMessage(
                message,
                normalized
            )
        ) {

            setUserCooldown(message);

            return;
        }


        /*
        ---------------------------------------------------
                  MENSAGEM ESPONTÂNEA
        ---------------------------------------------------

        SOMENTE NO CANAL PRINCIPAL.

        */

        await spontaneousCheck(
            message
        );


        /*
        ---------------------------------------------------
                         REAÇÃO
        ---------------------------------------------------
        */

        await reactionCheck(
            message,
            normalized
        );
    }


    /*
    =======================================================
                  MENSAGENS ESPONTÂNEAS
    =======================================================
    */

    async function spontaneousCheck(message) {

        if (
            message.channel.id !== CONFIG.mainChannelId
        ) {

            return;
        }


        if (
            channelOnCooldown(
                message.channel.id
            )
        ) {

            return;
        }


        if (
            !chance(
                CONFIG.spontaneousChance
            )
        ) {

            return;
        }


        const mood = getMood(message);

        const pool =
            SPONTANEOUS[mood] ||
            SPONTANEOUS.normal;


        const content = freshPick(
            pool,
            "zuno-spontaneous"
        );


        if (!content) {
            return;
        }


        const sent = await send(
            message.channel,
            content
        );


        if (sent) {

            setChannelCooldown(
                message.channel.id
            );
        }
    }


    /*
    =======================================================
                        REAÇÕES
    =======================================================
    */

    async function reactionCheck(message, text) {

        if (
            message.channel.id !== CONFIG.mainChannelId
        ) {

            return;
        }


        const last =
            reactions.get(message.author.id) || 0;


        if (
            Date.now() - last <
            CONFIG.reactionCooldown
        ) {

            return;
        }


        if (
            !chance(CONFIG.reactionChance)
        ) {

            return;
        }


        if (
            isLaugh(text) ||
            isProvocation(text) ||
            hasAnyPhrase(text, [
                "wtf",
                "meu deus",
                "nao acredito",
                "não acredito"
            ])
        ) {

            try {

                await message.react(
                    pick(EMOJI_REACTIONS)
                );

                reactions.set(
                    message.author.id,
                    Date.now()
                );

            } catch {
                // Ignora erro de permissão
            }
        }
    }


    /*
    =======================================================
                  EVENTOS DO DISCORD
    =======================================================
    */

    client.on(
        Events.GuildMemberAdd,
        async (member) => {

            try {

                await welcomeMember(
                    member
                );

            } catch (error) {

                console.error(
                    "[ZUNO] Erro no welcome:",
                    error.message
                );
            }
        }
    );


    client.on(
        Events.MessageCreate,
        async (message) => {

            try {

                await handleMessage(
                    message
                );

            } catch (error) {

                console.error(
                    "[ZUNO] Erro no sistema de interação:",
                    error
                );
            }
        }
    );


    /*
    =======================================================
                    LIMPEZA DE MEMÓRIA
    =======================================================
    */

    setInterval(
        () => {

            const now = Date.now();


            /*
            Limpa conversas expiradas
            */

            for (
                const [key, conversation]
                of conversations.entries()
            ) {

                if (
                    conversation.expires < now
                ) {

                    conversations.delete(
                        key
                    );
                }
            }


            /*
            Limpa duelos expirados
            */

            for (
                const [key, duel]
                of duels.entries()
            ) {

                if (
                    duel.expires < now
                ) {

                    duels.delete(
                        key
                    );
                }
            }


            /*
            Limpa cooldowns antigos
            */

            for (
                const [id, time]
                of cooldowns.entries()
            ) {

                if (
                    now - time >
                    1000 * 60 * 10
                ) {

                    cooldowns.delete(id);
                }
            }


            for (
                const [id, time]
                of reactions.entries()
            ) {

                if (
                    now - time >
                    1000 * 60 * 30
                ) {

                    reactions.delete(id);
                }
            }


            for (
                const [id, time]
                of channelCooldowns.entries()
            ) {

                if (
                    now - time >
                    1000 * 60 * 30
                ) {

                    channelCooldowns.delete(id);
                }
            }

        },

        1000 * 60 * 5
    );


    /*
    =======================================================
                    LOG DE INICIALIZAÇÃO
    =======================================================
    */

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log(
        "🐺 ZUNO INTERACTIONS ATIVADO"
    );

    console.log(
        `💬 Canal principal: ${CONFIG.mainChannelId}`
    );

    console.log(
        "🧠 Sistema contextual: ATIVO"
    );

    console.log(
        "😂 Sistema de zoeira: ATIVO"
    );

    console.log(
        "⚔️ Sistema de duelo: ATIVO"
    );

    console.log(
        "🎮 Mini-jogos: ATIVOS"
    );

    console.log(
        "👋 Boas-vindas: ATIVAS"
    );

    console.log(
        "🌙 Mensagens espontâneas: ATIVAS"
    );

    console.log(
        "🔁 Anti-repetição: ATIVO"
    );

    console.log(
        "🛡️ Filtro contextual: ATIVO"
    );

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
};
