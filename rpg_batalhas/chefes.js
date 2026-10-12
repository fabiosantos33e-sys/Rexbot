
'use strict';

/*
============================================================
CRÔNICAS DO CAOS — SISTEMA DE CHEFES
Arquivo: rpg_batalhas/chefes.js
Módulo independente, sem alterações no index.js.
============================================================
*/

const CONFIG = {
  nivelMaximo: 400,
  chanceAtaqueEspecial: 0.25,
  chanceFaseExtra: 0.08
};

const CHEFES = [
  {
    id: 'guardiao_das_ruinas',
    nome: 'Guardião das Ruínas',
    titulo: 'O Sentinela Esquecido',
    nivel: 5,
    mapa: 'ruinas_antigas',
    vida: 1800,
    ataque: 95,
    defesa: 35,
    experiencia: 450,
    moedas: 220,
    raridade: 'raro',
    descricao: 'Uma estátua ancestral que desperta para proteger um segredo enterrado há séculos.',
    entrada: 'As pedras tremem. Uma figura colossal ergue-se diante das ruínas, e seus olhos acendem como brasas antigas.',
    derrota: 'O gigante se ajoelha. Rachaduras luminosas percorrem seu corpo até que ele se desfaça em poeira dourada.',
    ataques: [
      {
        id: 'punho_pedra',
        nome: 'Punho de Pedra',
        dano: 1.0,
        narrativa: 'O guardião desfere um golpe pesado que faz o chão estremecer.'
      },
      {
        id: 'onda_terrestre',
        nome: 'Onda Terrestre',
        dano: 1.25,
        narrativa: 'Ele golpeia o solo e uma onda de pedras avança em sua direção.'
      }
    ],
    fases: [
      {
        vidaMinima: 0.6,
        nome: 'Despertar Ancestral',
        multiplicadorAtaque: 1.2,
        narrativa: 'Runas antigas brilham pelo corpo do guardião. Sua força aumenta!'
      },
      {
        vidaMinima: 0.25,
        nome: 'Última Sentinela',
        multiplicadorAtaque: 1.5,
        narrativa: 'O guardião libera toda a energia restante. Cada golpe ameaça destruir as ruínas.'
      }
    ]
  },
  {
    id: 'rainha_aracnidea',
    nome: 'Rainha Aracnídea',
    titulo: 'A Tecelã das Sombras',
    nivel: 10,
    mapa: 'floresta_sombria',
    vida: 3600,
    ataque: 145,
    defesa: 55,
    experiencia: 850,
    moedas: 450,
    raridade: 'epico',
    descricao: 'Uma criatura ancestral que domina os túneis sob a floresta.',
    entrada: 'Fios negros descem das árvores. Uma enorme silhueta surge no alto, cercada por dezenas de olhos brilhantes.',
    derrota: 'A rainha solta um último grito. Sua teia se desfaz e a floresta volta a respirar.',
    ataques: [
      {
        id: 'mordida_venenosa',
        nome: 'Mordida Venenosa',
        dano: 1.0,
        narrativa: 'A rainha avança com presas cobertas por um veneno escuro.'
      },
      {
        id: 'chuva_de_teias',
        nome: 'Chuva de Teias',
        dano: 1.2,
        narrativa: 'Ela lança uma chuva de fios resistentes que dificultam seus movimentos.'
      },
      {
        id: 'investida',
        nome: 'Investida Aracnídea',
        dano: 1.35,
        narrativa: 'A criatura percorre as paredes e ataca de um ângulo inesperado.'
      }
    ],
    fases: [
      {
        vidaMinima: 0.65,
        nome: 'Teia Mortal',
        multiplicadorAtaque: 1.25,
        narrativa: 'A rainha espalha uma teia pelo campo e passa a atacar com maior velocidade.'
      },
      {
        vidaMinima: 0.3,
        nome: 'Instinto Predador',
        multiplicadorAtaque: 1.55,
        narrativa: 'Ferida, a criatura abandona toda cautela e parte para um ataque desesperado.'
      }
    ]
  },
  {
    id: 'cavaleiro_sem_rosto',
    nome: 'Cavaleiro Sem Rosto',
    titulo: 'O Executor do Reino',
    nivel: 15,
    mapa: 'cemiterio_real',
    vida: 6200,
    ataque: 230,
    defesa: 90,
    experiencia: 1500,
    moedas: 800,
    raridade: 'epico',
    descricao: 'Um guerreiro amaldiçoado que continua cumprindo uma ordem mesmo após a queda de seu reino.',
    entrada: 'Uma armadura negra emerge da neblina. Não há rosto sob o elmo, apenas um vazio que parece observar sua alma.',
    derrota: 'A espada cai de suas mãos. Pela primeira vez em séculos, o cavaleiro pode descansar.',
    ataques: [
      {
        id: 'corte_abissal',
        nome: 'Corte Abissal',
        dano: 1.15,
        narrativa: 'Sua lâmina corta o ar e deixa um rastro de energia sombria.'
      },
      {
        id: 'julgamento',
        nome: 'Julgamento do Executor',
        dano: 1.4,
        narrativa: 'O cavaleiro ergue a espada e desce com um golpe brutal.'
      },
      {
        id: 'onda_negra',
        nome: 'Onda Negra',
        dano: 1.3,
        narrativa: 'Uma onda de energia percorre o campo e ameaça engolir tudo ao redor.'
      }
    ],
    fases: [
      {
        vidaMinima: 0.7,
        nome: 'Armadura Desperta',
        multiplicadorAtaque: 1.2,
        narrativa: 'As inscrições da armadura acendem. O executor começa a lutar sem hesitação.'
      },
      {
        vidaMinima: 0.4,
        nome: 'Maldição Real',
        multiplicadorAtaque: 1.45,
        narrativa: 'A maldição se manifesta ao redor do cavaleiro, fortalecendo seus ataques.'
      },
      {
        vidaMinima: 0.15,
        nome: 'Sentença Final',
        multiplicadorAtaque: 1.8,
        narrativa: 'O cavaleiro concentra toda a energia restante em sua última ofensiva.'
      }
    ]
  },
  {
    id: 'dragao_cristalino',
    nome: 'Dragão Cristalino',
    titulo: 'A Catástrofe das Montanhas',
    nivel: 25,
    mapa: 'montanhas_cristalinas',
    vida: 15000,
    ataque: 420,
    defesa: 180,
    experiencia: 4200,
    moedas: 2300,
    raridade: 'lendario',
    descricao: 'Um dragão antigo cujas escamas refletem a luz como milhares de cristais.',
    entrada: 'O céu escurece quando asas gigantescas cobrem as montanhas. O dragão pousa, e o impacto lança cristais pelo vale.',
    derrota: 'O dragão fecha os olhos. Sua energia se converte em pequenos cristais que brilham sobre a montanha.',
    ataques: [
      {
        id: 'sopro_cristalino',
        nome: 'Sopro Cristalino',
        dano: 1.25,
        narrativa: 'O dragão libera um sopro de energia que transforma o ar em fragmentos luminosos.'
      },
      {
        id: 'garra_montanha',
        nome: 'Garra da Montanha',
        dano: 1.4,
        narrativa: 'Uma garra colossal desce sobre o campo de batalha.'
      },
      {
        id: 'tempestade_cristal',
        nome: 'Tempestade de Cristais',
        dano: 1.6,
        narrativa: 'Cristais afiados giram ao redor do dragão antes de serem lançados contra você.'
      }
    ],
    fases: [
      {
        vidaMinima: 0.7,
        nome: 'Asas da Destruição',
        multiplicadorAtaque: 1.25,
        narrativa: 'O dragão abre as asas e uma tempestade começa a se formar.'
      },
      {
        vidaMinima: 0.4,
        nome: 'Coração de Cristal',
        multiplicadorAtaque: 1.55,
        narrativa: 'O núcleo cristalino fica exposto e libera uma energia devastadora.'
      },
      {
        vidaMinima: 0.15,
        nome: 'Catástrofe Final',
        multiplicadorAtaque: 2.0,
        narrativa: 'A montanha inteira ressoa com o rugido final do dragão.'
      }
    ]
  },
  {
    id: 'rei_do_caos',
    nome: 'Rei do Caos',
    titulo: 'O Soberano do Fim',
    nivel: 50,
    mapa: 'trono_caos',
    vida: 50000,
    ataque: 1100,
    defesa: 400,
    experiencia: 15000,
    moedas: 10000,
    raridade: 'mitico',
    descricao: 'A entidade que governa o caos e ameaça apagar as fronteiras entre os mundos.',
    entrada: 'O trono está vazio, mas uma voz ecoa por toda a dimensão. A escuridão se reúne diante de você e assume uma forma coroada.',
    derrota: 'A coroa se parte. O silêncio toma o trono, e a dimensão começa lentamente a se reconstruir.',
    ataques: [
      {
        id: 'lamina_do_fim',
        nome: 'Lâmina do Fim',
        dano: 1.3,
        narrativa: 'O soberano manifesta uma lâmina negra que distorce tudo ao redor.'
      },
      {
        id: 'colapso',
        nome: 'Colapso Dimensional',
        dano: 1.6,
        narrativa: 'O espaço se dobra e uma onda de energia atravessa a arena.'
      },
      {
        id: 'decreto_caos',
        nome: 'Decreto do Caos',
        dano: 1.8,
        narrativa: 'O rei pronuncia palavras antigas. A própria dimensão parece obedecer à sua vontade.'
      },
      {
        id: 'fim_absoluto',
        nome: 'Fim Absoluto',
        dano: 2.2,
        narrativa: 'O soberano ergue a mão e reúne o poder de um mundo em colapso para um golpe devastador.'
      }
    ],
    fases: [
      {
        vidaMinima: 0.75,
        nome: 'Coroa Desperta',
        multiplicadorAtaque: 1.2,
        narrativa: 'A coroa começa a brilhar. O Rei do Caos ainda não revelou seu verdadeiro poder.'
      },
      {
        vidaMinima: 0.5,
        nome: 'Ruptura Dimensional',
        multiplicadorAtaque: 1.5,
        narrativa: 'A arena se rompe em fragmentos. O soberano começa a manipular a realidade.'
      },
      {
        vidaMinima: 0.25,
        nome: 'Deus da Destruição',
        multiplicadorAtaque: 1.9,
        narrativa: 'A forma do rei muda. Sua presença transforma o campo de batalha em um vazio infinito.'
      },
      {
        vidaMinima: 0.1,
        nome: 'Último Decreto',
        multiplicadorAtaque: 2.3,
        narrativa: 'O soberano abandona toda defesa e prepara seu ataque final. Este é o momento decisivo.'
      }
    ]
  }
];

function clonar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function obterChefe(id) {
  const chefe = CHEFES.find(c => c.id === id);
  return chefe ? clonar(chefe) : null;
}

function listarChefes() {
  return CHEFES.map(chefe => ({
    id: chefe.id,
    nome: chefe.nome,
    titulo: chefe.titulo,
    nivel: chefe.nivel,
    mapa: chefe.mapa,
    raridade: chefe.raridade,
    vida: chefe.vida,
    experiencia: chefe.experiencia,
    moedas: chefe.moedas
  }));
}

function listarChefesDisponiveis(nivel) {
  const n = Math.max(1, Number(nivel) || 1);
  return listarChefes().filter(chefe => n >= chefe.nivel);
}

function podeEnfrentar(id, jogador) {
  const chefe = CHEFES.find(c => c.id === id);

  if (!chefe) {
    return { permitido: false, motivo: 'Chefe não encontrado.' };
  }

  const nivel = Math.max(
    1,
    Number(jogador?.nivel ?? jogador?.level ?? 1)
  );

  if (nivel < chefe.nivel) {
    return {
      permitido: false,
      motivo: `Você precisa alcançar o nível ${chefe.nivel} para desafiar ${chefe.nome}.`
    };
  }

  return {
    permitido: true,
    motivo: `Você pode desafiar ${chefe.nome}.`
  };
}

function obterFase(id, vidaAtual, vidaMaxima) {
  const chefe = CHEFES.find(c => c.id === id);
  if (!chefe) return null;

  const max = Math.max(1, Number(vidaMaxima) || chefe.vida);
  const vida = Math.max(0, Number(vidaAtual) || 0);
  const percentual = vida / max;

  const fasesAtivas = chefe.fases
    .filter(fase => percentual <= fase.vidaMinima)
    .sort((a, b) => a.vidaMinima - b.vidaMinima);

  const fase = fasesAtivas[0];

  return fase ? clonar(fase) : {
    nome: 'Fase Inicial',
    multiplicadorAtaque: 1,
    narrativa: 'O chefe observa seus movimentos, preparando o próximo ataque.'
  };
}

function sortearAtaque(id, vidaAtual, vidaMaxima) {
  const chefe = CHEFES.find(c => c.id === id);
  if (!chefe) return null;

  const fase = obterFase(id, vidaAtual, vidaMaxima);
  const ataques = chefe.ataques;

  if (!ataques.length) return null;

  let ataque = ataques[Math.floor(Math.random() * ataques.length)];

  if (
    fase &&
    fase.nome !== 'Fase Inicial' &&
    Math.random() < CONFIG.chanceAtaqueEspecial
  ) {
    ataque = ataques[ataques.length - 1];
  }

  return {
    ...clonar(ataque),
    danoBase: Math.floor(chefe.ataque * ataque.dano * (fase?.multiplicadorAtaque || 1)),
    fase: fase?.nome || 'Fase Inicial'
  };
}

function calcularDanoChefe(id, ataqueId, vidaAtual, vidaMaxima) {
  const chefe = CHEFES.find(c => c.id === id);
  if (!chefe) return 0;

  const ataque = chefe.ataques.find(a => a.id === ataqueId);
  if (!ataque) return 0;

  const fase = obterFase(id, vidaAtual, vidaMaxima);
  const multiplicador = fase?.multiplicadorAtaque || 1;

  return Math.max(1, Math.floor(
    chefe.ataque * ataque.dano * multiplicador
  ));
}

function formatarChefe(chefe) {
  if (!chefe) return 'Chefe não encontrado.';

  return [
    `# ${chefe.nome}`,
    `*${chefe.titulo}*`,
    '',
    chefe.descricao,
    '',
    `❤️ Vida: ${chefe.vida.toLocaleString('pt-BR')}`,
    `⚔️ Ataque: ${chefe.ataque.toLocaleString('pt-BR')}`,
    `🛡️ Defesa: ${chefe.defesa.toLocaleString('pt-BR')}`,
    `📈 Nível necessário: ${chefe.nivel}`,
    `✨ Experiência: ${chefe.experiencia.toLocaleString('pt-BR')}`,
    `🪙 Moedas: ${chefe.moedas.toLocaleString('pt-BR')}`,
    `💎 Raridade: ${chefe.raridade}`,
    '',
    `📖 ${chefe.entrada}`,
    '',
    '**Fases do combate:**',
    ...chefe.fases.map(fase =>
      `• ${fase.nome} — ativada abaixo de ${Math.round(fase.vidaMinima * 100)}% de vida`
    )
  ].join('\n');
}

module.exports = {
  CONFIG,
  CHEFES,
  obterChefe,
  listarChefes,
  listarChefesDisponiveis,
  podeEnfrentar,
  obterFase,
  sortearAtaque,
  calcularDanoChefe,
  formatarChefe
};

