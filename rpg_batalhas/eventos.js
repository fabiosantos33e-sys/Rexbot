
'use strict';

/*
============================================================
CRÔNICAS DO CAOS — EVENTOS ALEATÓRIOS
Arquivo: rpg_batalhas/eventos.js
Módulo independente. Não altera o index.js.
============================================================
*/

const CONFIG = {
  chanceEvento: 0.35,
  chanceEventoRaro: 0.08,
  chanceEventoLendario: 0.015,
  limiteMoedas: 999999999,
  limiteExperiencia: 999999999
};

const EVENTOS = [
  {
    id: 'bau_abandonado',
    nome: 'O Baú Abandonado',
    categoria: 'tesouro',
    raridade: 'comum',
    peso: 15,
    nivelMinimo: 1,
    titulo: '📦 UM BAÚ NO CAMINHO',
    narrativa: 'Entre pedras antigas e raízes retorcidas, você encontra um baú coberto de poeira. A fechadura está quebrada, mas algo parece brilhar lá dentro.',
    opcoes: [
      { id: 'abrir', nome: 'Abrir o baú', descricao: 'Investigar o conteúdo.', acao: 'tesouro' },
      { id: 'ignorar', nome: 'Seguir viagem', descricao: 'Não arriscar seu tempo.', acao: 'ignorar' }
    ]
  },
  {
    id: 'armadilha_antiga',
    nome: 'Armadilha das Ruínas',
    categoria: 'perigo',
    raridade: 'comum',
    peso: 12,
    nivelMinimo: 1,
    titulo: '⚠️ O CHÃO CEDE',
    narrativa: 'Um estalo ecoa sob seus pés. Símbolos quase apagados brilham nas pedras enquanto uma antiga armadilha desperta. Você precisa reagir rapidamente.',
    opcoes: [
      { id: 'esquivar', nome: 'Tentar esquivar', descricao: 'Confiar na agilidade.', acao: 'esquiva' },
      { id: 'proteger', nome: 'Proteger-se', descricao: 'Reduzir o impacto.', acao: 'proteger' }
    ]
  },
  {
    id: 'santuario_esquecido',
    nome: 'Santuário Esquecido',
    categoria: 'cura',
    raridade: 'incomum',
    peso: 9,
    nivelMinimo: 1,
    titulo: '🕯️ UMA PAZ INESPERADA',
    narrativa: 'Você encontra um pequeno santuário escondido pela vegetação. Uma luz suave atravessa as ruínas, e por um instante o peso da jornada parece desaparecer.',
    opcoes: [
      { id: 'rezar', nome: 'Aproximar-se da luz', descricao: 'Receber a bênção do santuário.', acao: 'cura' },
      { id: 'seguir', nome: 'Continuar a jornada', descricao: 'Não interromper a viagem.', acao: 'ignorar' }
    ]
  },
  {
    id: 'viajante_misterioso',
    nome: 'O Viajante Encapuzado',
    categoria: 'encontro',
    raridade: 'incomum',
    peso: 8,
    nivelMinimo: 2,
    titulo: '🧥 O ESTRANHO NA ESTRADA',
    narrativa: 'Sob uma capa escura, um viajante observa você em silêncio. Ele oferece uma pequena bolsa de moedas, mas avisa que nem toda fortuna vem sem consequências.',
    opcoes: [
      { id: 'aceitar', nome: 'Aceitar as moedas', descricao: 'Receber a oferta.', acao: 'moedas' },
      { id: 'recusar', nome: 'Recusar educadamente', descricao: 'Seguir sem aceitar.', acao: 'ignorar' }
    ]
  },
  {
    id: 'mercador_perdido',
    nome: 'Mercador Perdido',
    categoria: 'comercio',
    raridade: 'incomum',
    peso: 8,
    nivelMinimo: 2,
    titulo: '🛒 UM NEGÓCIO INESPERADO',
    narrativa: 'Um mercador com uma carroça danificada pede ajuda. Em agradecimento, ele oferece uma recompensa por você ter parado para ouvi-lo.',
    opcoes: [
      { id: 'ajudar', nome: 'Ajudar o mercador', descricao: 'Receber uma recompensa modesta.', acao: 'recompensa' },
      { id: 'passar', nome: 'Continuar andando', descricao: 'Deixar o mercador para trás.', acao: 'ignorar' }
    ]
  },
  {
    id: 'fonte_arcana',
    nome: 'Fonte de Energia Arcana',
    categoria: 'magia',
    raridade: 'raro',
    peso: 5,
    nivelMinimo: 5,
    titulo: '🔮 A FONTE ADORMECIDA',
    narrativa: 'Uma fonte de energia pulsa no interior de uma formação rochosa. O ar vibra com poder antigo. Você sente que pode absorver parte daquela energia.',
    opcoes: [
      { id: 'absorver', nome: 'Absorver a energia', descricao: 'Tentar receber experiência.', acao: 'experiencia' },
      { id: 'afastar', nome: 'Afastar-se', descricao: 'Evitar o desconhecido.', acao: 'ignorar' }
    ]
  },
  {
    id: 'lobos_caca',
    nome: 'Caçada na Floresta',
    categoria: 'perigo',
    raridade: 'incomum',
    peso: 7,
    nivelMinimo: 3,
    titulo: '🐺 VOCÊ ESTÁ SENDO OBSERVADO',
    narrativa: 'Dois olhos brilham entre as árvores. Logo, outros pares surgem. Uma matilha bloqueia a trilha e parece determinada a defender seu território.',
    opcoes: [
      { id: 'enfrentar', nome: 'Encarar a matilha', descricao: 'Assumir o risco de um confronto.', acao: 'combate' },
      { id: 'recuar', nome: 'Recuar devagar', descricao: 'Tentar escapar sem lutar.', acao: 'fuga' }
    ]
  },
  {
    id: 'altar_sangrento',
    nome: 'Altar Proibido',
    categoria: 'misterio',
    raridade: 'raro',
    peso: 4,
    nivelMinimo: 8,
    titulo: '🩸 O ALTAR DAS SOMBRAS',
    narrativa: 'No centro de uma câmara esquecida, um altar coberto de runas pulsa sob uma luz vermelha. Uma presença invisível parece aguardar sua decisão.',
    opcoes: [
      { id: 'investigar', nome: 'Investigar as runas', descricao: 'Buscar conhecimento proibido.', acao: 'experiencia' },
      { id: 'sair', nome: 'Abandonar a câmara', descricao: 'Não perturbar o altar.', acao: 'ignorar' }
    ]
  },
  {
    id: 'chuva_moedas',
    nome: 'A Chuva Dourada',
    categoria: 'tesouro',
    raridade: 'raro',
    peso: 4,
    nivelMinimo: 5,
    titulo: '🪙 UM PRESENTE DO DESTINO',
    narrativa: 'Uma velha bolsa cai de uma passagem elevada e se rompe no chão. Moedas antigas se espalham pelo caminho. Não há ninguém por perto para reivindicá-las.',
    opcoes: [
      { id: 'recolher', nome: 'Recolher as moedas', descricao: 'Guardar o achado.', acao: 'moedas' },
      { id: 'deixar', nome: 'Deixar tudo como está', descricao: 'Prosseguir sem tocar em nada.', acao: 'ignorar' }
    ]
  },
  {
    id: 'guardiao_dormindo',
    nome: 'O Guardião Adormecido',
    categoria: 'perigo',
    raridade: 'raro',
    peso: 3,
    nivelMinimo: 10,
    titulo: '🗿 O COLOSSO DE PEDRA',
    narrativa: 'Uma criatura colossal repousa diante de um portão. Seu corpo parece feito de pedra e seus braços seguram armas antigas. Cada movimento seu pode despertar o guardião.',
    opcoes: [
      { id: 'passar', nome: 'Tentar passar silenciosamente', descricao: 'Depender da sorte.', acao: 'esquiva' },
      { id: 'despertar', nome: 'Despertar o guardião', descricao: 'Enfrentar a criatura.', acao: 'combate' }
    ]
  },
  {
    id: 'benção_fenix',
    nome: 'A Bênção da Fênix',
    categoria: 'cura',
    raridade: 'lendario',
    peso: 1,
    nivelMinimo: 10,
    titulo: '🔥 A CHAMA DA RENOVAÇÃO',
    narrativa: 'Uma pena dourada desce lentamente do céu. Ao tocar o chão, transforma-se em uma chama que não queima. Uma voz distante sussurra que sua jornada ainda não terminou.',
    opcoes: [
      { id: 'receber', nome: 'Aceitar a bênção', descricao: 'Receber uma restauração extraordinária.', acao: 'cura_total' },
      { id: 'observar', nome: 'Observar a chama', descricao: 'Agradecer e continuar.', acao: 'ignorar' }
    ]
  },
  {
    id: 'fenda_caos',
    nome: 'Fenda do Caos',
    categoria: 'misterio',
    raridade: 'lendario',
    peso: 1,
    nivelMinimo: 20,
    titulo: '🌀 A REALIDADE SE ROMPE',
    narrativa: 'O ar se parte como vidro. Do outro lado da fenda, você vê um céu desconhecido e silhuetas que não deveriam existir. Uma energia terrível tenta atraí-lo.',
    opcoes: [
      { id: 'tocar', nome: 'Tocar a fenda', descricao: 'Arriscar-se em busca de poder.', acao: 'fenda' },
      { id: 'fugir', nome: 'Afastar-se imediatamente', descricao: 'Não desafiar o desconhecido.', acao: 'ignorar' }
    ]
  }
];

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function obterNivel(jogador) {
  return Math.max(1, Number(jogador?.nivel ?? jogador?.level ?? 1));
}

function obterVidaMaxima(jogador) {
  return Math.max(1, Number(
    jogador?.vidaMaxima ??
    jogador?.vida_maxima ??
    jogador?.hpMax ??
    jogador?.hp_maximo ??
    jogador?.vida ??
    100
  ));
}

function obterVidaAtual(jogador) {
  const max = obterVidaMaxima(jogador);
  return limitar(Number(
    jogador?.vidaAtual ??
    jogador?.vida_atual ??
    jogador?.hp ??
    max
  ), 0, max);
}

function definirVida(jogador, valor) {
  const max = obterVidaMaxima(jogador);
  const vida = limitar(Math.floor(valor), 0, max);

  if ('vidaAtual' in jogador || !('vida_atual' in jogador && !('hp' in jogador))) {
    jogador.vidaAtual = vida;
  }
  if ('vida_atual' in jogador) jogador.vida_atual = vida;
  if ('hp' in jogador) jogador.hp = vida;

  return vida;
}

function adicionarMoedas(jogador, quantidade) {
  const atual = Math.max(0, Number(jogador.moedas || 0));
  const total = limitar(atual + quantidade, 0, CONFIG.limiteMoedas);
  jogador.moedas = total;
  return quantidade;
}

function adicionarExperiencia(jogador, quantidade) {
  const atual = Math.max(0, Number(jogador.experiencia ?? jogador.xp ?? 0));
  const total = limitar(atual + quantidade, 0, CONFIG.limiteExperiencia);

  if ('xp' in jogador && !('experiencia' in jogador)) {
    jogador.xp = total;
  } else {
    jogador.experiencia = total;
  }

  return quantidade;
}

function sortearPonderado(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return null;

  const pesoTotal = lista.reduce((soma, evento) => soma + Math.max(0, evento.peso || 1), 0);
  if (pesoTotal <= 0) return lista[numeroAleatorio(0, lista.length - 1)];

  let sorteio = Math.random() * pesoTotal;

  for (const evento of lista) {
    sorteio -= Math.max(0, evento.peso || 1);
    if (sorteio <= 0) return evento;
  }

  return lista[lista.length - 1];
}

function listarEventosDisponiveis(jogador) {
  const nivel = obterNivel(jogador);
  return EVENTOS.filter(evento => nivel >= evento.nivelMinimo);
}

function sortearEvento(jogador, opcoes = {}) {
  if (!jogador || typeof jogador !== 'object') {
    return { ocorreu: false, motivo: 'jogador_invalido' };
  }

  const chance = limitar(
    Number(opcoes.chance ?? CONFIG.chanceEvento),
    0,
    1
  );

  if (Math.random() >= chance) {
    return { ocorreu: false, motivo: 'nenhum_evento' };
  }

  const disponiveis = listarEventosDisponiveis(jogador);
  if (!disponiveis.length) {
    return { ocorreu: false, motivo: 'sem_eventos_disponiveis' };
  }

  let candidatos = disponiveis;
  const rolagem = Math.random();

  if (rolagem < CONFIG.chanceEventoLendario) {
    const lendarios = disponiveis.filter(e => e.raridade === 'lendario');
    if (lendarios.length) candidatos = lendarios;
  } else if (rolagem < CONFIG.chanceEventoRaro) {
    const raros = disponiveis.filter(e => e.raridade === 'raro');
    if (raros.length) candidatos = raros;
  }

  const evento = sortearPonderado(candidatos) || sortearPonderado(disponiveis);

  return {
    ocorreu: true,
    evento: JSON.parse(JSON.stringify(evento))
  };
}

function obterEvento(id) {
  const evento = EVENTOS.find(e => e.id === id);
  return evento ? JSON.parse(JSON.stringify(evento)) : null;
}

function obterOpcao(evento, idOpcao) {
  if (!evento || !Array.isArray(evento.opcoes)) return null;
  return evento.opcoes.find(opcao => opcao.id === idOpcao) || null;
}

function resolverEvento(jogador, idEvento, idOpcao, contexto = {}) {
  if (!jogador || typeof jogador !== 'object') {
    return {
      sucesso: false,
      mensagem: 'Não foi possível identificar o aventureiro.'
    };
  }

  const evento = obterEvento(idEvento);
  if (!evento) {
    return {
      sucesso: false,
      mensagem: 'Esse evento não existe ou já desapareceu.'
    };
  }

  if (obterNivel(jogador) < evento.nivelMinimo) {
    return {
      sucesso: false,
      mensagem: `Você precisa alcançar o nível ${evento.nivelMinimo} para interagir com esse evento.`
    };
  }

  const opcao = obterOpcao(evento, idOpcao);
  if (!opcao) {
    return {
      sucesso: false,
      mensagem: 'Opção inválida. Escolha uma das alternativas do evento.'
    };
  }

  const resultado = {
    sucesso: true,
    evento: evento.id,
    opcao: opcao.id,
    moedas: 0,
    experiencia: 0,
    dano: 0,
    cura: 0,
    combate: false,
    fuga: false,
    mensagens: []
  };

  const acao = opcao.acao;

  if (acao === 'ignorar') {
    resultado.mensagens.push('Você decide seguir viagem. O mundo continua guardando seus mistérios.');
  }

  else if (acao === 'tesouro') {
    if (Math.random() < 0.18) {
      const dano = numeroAleatorio(5, 15) + obterNivel(jogador);
      const vida = definirVida(jogador, obterVidaAtual(jogador) - dano);
      resultado.dano = dano;
      resultado.mensagens.push(`Uma armadilha escondida dispara! Você perde ${dano} pontos de vida. Vida atual: ${vida}/${obterVidaMaxima(jogador)}.`);
    } else {
      const moedas = numeroAleatorio(15, 45) * obterNivel(jogador);
      adicionarMoedas(jogador, moedas);
      resultado.moedas = moedas;
      resultado.mensagens.push(`Dentro do baú você encontra ${moedas} moedas. Uma pequena fortuna para continuar sua jornada.`);
    }
  }

  else if (acao === 'esquiva') {
    if (Math.random() < 0.65) {
      resultado.mensagens.push('Com reflexos rápidos, você escapa do perigo por pouco.');
      resultado.experiencia = adicionarExperiencia(jogador, 5 * obterNivel(jogador));
      resultado.mensagens.push(`Você recebe ${resultado.experiencia} de experiência pela reação.`);
    } else {
      const dano = numeroAleatorio(8, 18) * obterNivel(jogador);
      definirVida(jogador, obterVidaAtual(jogador) - dano);
      resultado.dano = dano;
      resultado.mensagens.push(`Você não consegue escapar completamente e recebe ${dano} de dano.`);
    }
  }

  else if (acao === 'proteger') {
    const dano = numeroAleatorio(3, 9) * obterNivel(jogador);
    definirVida(jogador, obterVidaAtual(jogador) - dano);
    resultado.dano = dano;
    resultado.mensagens.push(`Você se protege como pode, reduzindo o impacto. Ainda assim, recebe ${dano} de dano.`);
  }

  else if (acao === 'cura') {
    const cura = Math.max(0, Math.floor(obterVidaMaxima(jogador) * 0.3));
    const antes = obterVidaAtual(jogador);
    const depois = definirVida(jogador, antes + cura);
    resultado.cura = depois - antes;
    resultado.mensagens.push(
      resultado.cura > 0
        ? `A energia do santuário restaura ${resultado.cura} pontos de vida.`
        : 'Você já está com a vida completa. O santuário permanece em silêncio.'
    );
  }

  else if (acao === 'cura_total') {
    const antes = obterVidaAtual(jogador);
    const max = obterVidaMaxima(jogador);
    definirVida(jogador, max);
    resultado.cura = max - antes;
    resultado.mensagens.push(`A bênção da Fênix restaura sua vitalidade. Vida recuperada: ${resultado.cura}.`);
  }

  else if (acao === 'moedas') {
    const moedas = numeroAleatorio(20, 60) * obterNivel(jogador);
    adicionarMoedas(jogador, moedas);
    resultado.moedas = moedas;
    resultado.mensagens.push(`Você guarda ${moedas} moedas e agradece silenciosamente ao destino.`);
  }

  else if (acao === 'recompensa') {
    const moedas = numeroAleatorio(10, 30) * obterNivel(jogador);
    const xp = numeroAleatorio(5, 12) * obterNivel(jogador);
    adicionarMoedas(jogador, moedas);
    adicionarExperiencia(jogador, xp);
    resultado.moedas = moedas;
    resultado.experiencia = xp;
    resultado.mensagens.push(`O mercador entrega ${moedas} moedas e ${xp} de experiência como agradecimento.`);
  }

  else if (acao === 'experiencia') {
    const xp = numeroAleatorio(12, 25) * obterNivel(jogador);
    adicionarExperiencia(jogador, xp);
    resultado.experiencia = xp;
    resultado.mensagens.push(`O conhecimento antigo percorre sua mente. Você recebe ${xp} de experiência.`);
  }

  else if (acao === 'combate') {
    resultado.combate = true;
    resultado.mensagens.push('O encontro se transforma em um confronto. Inicie uma batalha usando o sistema de combate do RPG.');
    if (contexto && typeof contexto.iniciarCombate === 'function') {
      resultado.resultadoCombate = contexto.iniciarCombate(jogador, evento);
    }
  }

  else if (acao === 'fuga') {
    if (Math.random() < 0.7) {
      resultado.fuga = true;
      resultado.mensagens.push('Você recua com cautela e consegue escapar sem se ferir.');
    } else {
      const dano = numeroAleatorio(5, 12) * obterNivel(jogador);
      definirVida(jogador, obterVidaAtual(jogador) - dano);
      resultado.dano = dano;
      resultado.mensagens.push(`A fuga falha. Você consegue escapar, mas recebe ${dano} de dano.`);
    }
  }

  else if (acao === 'fenda') {
    const sorte = Math.random();

    if (sorte < 0.2) {
      const moedas = numeroAleatorio(50, 100) * obterNivel(jogador);
      adicionarMoedas(jogador, moedas);
      resultado.moedas = moedas;
      resultado.mensagens.push(`A fenda cospe uma bolsa de ${moedas} moedas antes de desaparecer.`);
    } else if (sorte < 0.5) {
      const xp = numeroAleatorio(30, 60) * obterNivel(jogador);
      adicionarExperiencia(jogador, xp);
      resultado.experiencia = xp;
      resultado.mensagens.push(`Você absorve fragmentos de conhecimento de outro mundo e recebe ${xp} de experiência.`);
    } else {
      const dano = numeroAleatorio(10, 25) * obterNivel(jogador);
      definirVida(jogador, obterVidaAtual(jogador) - dano);
      resultado.dano = dano;
      resultado.mensagens.push(`Uma força desconhecida repele você da fenda. Você recebe ${dano} de dano.`);
    }
  }

  resultado.vidaAtual = obterVidaAtual(jogador);
  resultado.vidaMaxima = obterVidaMaxima(jogador);
  resultado.moedasAtuais = Number(jogador.moedas || 0);
  resultado.experienciaAtual = Number(jogador.experiencia ?? jogador.xp ?? 0);

  return resultado;
}

function formatarEvento(evento) {
  if (!evento) return 'Nenhum evento disponível.';

  const opcoes = evento.opcoes.map(opcao =>
    `**${opcao.nome}** — ${opcao.descricao}\nID: \`${opcao.id}\``
  ).join('\n\n');

  return [
    `# ${evento.titulo}`,
    `**Evento:** ${evento.nome}`,
    `**Categoria:** ${evento.categoria} | **Raridade:** ${evento.raridade}`,
    '',
    evento.narrativa,
    '',
    '**O que você fará?**',
    opcoes
  ].join('\n');
}

function formatarResultado(resultado) {
  if (!resultado || !resultado.sucesso) {
    return resultado?.mensagem || 'Não foi possível resolver o evento.';
  }

  const linhas = [
    '## 📜 Consequências da sua escolha',
    ...resultado.mensagens
  ];

  if (resultado.vidaAtual !== undefined) {
    linhas.push(
      '',
      `❤️ Vida: ${resultado.vidaAtual}/${resultado.vidaMaxima}`,
      `🪙 Moedas: ${resultado.moedasAtuais}`,
      `✨ Experiência: ${resultado.experienciaAtual}`
    );
  }

  return linhas.join('\n');
}

function verificarChanceEvento(jogador, chance) {
  const resultado = sortearEvento(jogador, { chance });
  return resultado.ocorreu ? resultado.evento : null;
}

module.exports = {
  CONFIG,
  EVENTOS,
  sortearEvento,
  verificarChanceEvento,
  obterEvento,
  obterOpcao,
  listarEventosDisponiveis,
  resolverEvento,
  formatarEvento,
  formatarResultado
};

