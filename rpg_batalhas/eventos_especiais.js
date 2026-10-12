
'use strict';

/*
============================================================
CRÔNICAS DO CAOS — EVENTOS ESPECIAIS
Arquivo: rpg_batalhas/eventos_especiais.js
Módulo independente. Não altera index.js.
============================================================
*/

const CONFIG = {
  chanceEventoGlobal: 0.05,
  chanceEventoLendario: 0.01,
  duracaoPadraoMinutos: 30,
  limiteHistorico: 100
};

const EVENTOS_ESPECIAIS = [
  {
    id: 'invasao_sombras',
    nome: 'Invasão das Sombras',
    raridade: 'raro',
    nivelMinimo: 5,
    duracaoMinutos: 30,
    tipo: 'invasao',
    titulo: '🌑 A INVASÃO COMEÇOU',
    narrativa: 'O céu escurece de repente. Fendas negras se abrem pelo território e criaturas sombrias avançam em direção às cidades. Os aventureiros precisam se unir antes que seja tarde.',
    objetivo: 'Derrotar criaturas invasoras.',
    recompensa: { moedas: 500, experiencia: 300 },
    progressoNecessario: 10
  },
  {
    id: 'portal_dourado',
    nome: 'Portal Dourado',
    raridade: 'epico',
    nivelMinimo: 10,
    duracaoMinutos: 25,
    tipo: 'exploracao',
    titulo: '✨ UM PORTAL SURGIU',
    narrativa: 'Um portal dourado aparece sobre uma formação rochosa. Do outro lado, ruínas de uma civilização perdida parecem guardar tesouros que desapareceram há milênios.',
    objetivo: 'Explorar o portal e descobrir seus segredos.',
    recompensa: { moedas: 900, experiencia: 650 },
    progressoNecessario: 5
  },
  {
    id: 'caca_ao_colosso',
    nome: 'Caçada ao Colosso',
    raridade: 'epico',
    nivelMinimo: 15,
    duracaoMinutos: 40,
    tipo: 'cacada',
    titulo: '⚔️ UMA AMEAÇA COLOSSAL',
    narrativa: 'Um colosso desperta nas montanhas e começa a destruir antigas construções. Uma recompensa extraordinária é oferecida a quem conseguir deter a criatura.',
    objetivo: 'Contribuir para a caçada ao colosso.',
    recompensa: { moedas: 1500, experiencia: 1200 },
    progressoNecessario: 15
  },
  {
    id: 'chuva_cristais',
    nome: 'Chuva de Cristais',
    raridade: 'raro',
    nivelMinimo: 3,
    duracaoMinutos: 20,
    tipo: 'coleta',
    titulo: '💎 UMA CHUVA DE CRISTAIS',
    narrativa: 'Fragmentos luminosos caem do céu e se espalham pela região. Os cristais parecem reagir à presença dos aventureiros e podem ser usados para obter recompensas.',
    objetivo: 'Recolher fragmentos durante o evento.',
    recompensa: { moedas: 350, experiencia: 250 },
    progressoNecessario: 8
  },
  {
    id: 'despertar_rei',
    nome: 'Despertar do Rei do Caos',
    raridade: 'lendario',
    nivelMinimo: 50,
    duracaoMinutos: 45,
    tipo: 'chefe_global',
    titulo: '👑 O REI DO CAOS DESPERTOU',
    narrativa: 'Uma pressão impossível cobre o mundo. O trono do caos voltou a brilhar, e uma presença ancestral anuncia que chegou a hora de testar os maiores guerreiros.',
    objetivo: 'Participar do confronto contra a ameaça lendária.',
    recompensa: { moedas: 10000, experiencia: 10000 },
    progressoNecessario: 25
  },
  {
    id: 'fenda_abissal',
    nome: 'Fenda Abissal',
    raridade: 'lendario',
    nivelMinimo: 30,
    duracaoMinutos: 35,
    tipo: 'exploracao',
    titulo: '🌀 A FENDA ABISSAL SE ABRIU',
    narrativa: 'Uma rachadura na realidade revela um abismo de energia instável. Ecos de criaturas desconhecidas atravessam a abertura, e o tempo parece fluir de maneira diferente ao redor dela.',
    objetivo: 'Investigar a fenda antes que ela desapareça.',
    recompensa: { moedas: 5000, experiencia: 4000 },
    progressoNecessario: 12
  }
];

const eventosAtivos = new Map();
const historicoEventos = [];

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clonar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function obterNivel(jogador) {
  return Math.max(1, Number(jogador?.nivel ?? jogador?.level ?? 1));
}

function obterEventoEspecial(id) {
  const evento = EVENTOS_ESPECIAIS.find(item => item.id === id);
  return evento ? clonar(evento) : null;
}

function listarEventosEspeciais() {
  return EVENTOS_ESPECIAIS.map(evento => ({
    id: evento.id,
    nome: evento.nome,
    raridade: evento.raridade,
    nivelMinimo: evento.nivelMinimo,
    duracaoMinutos: evento.duracaoMinutos,
    tipo: evento.tipo
  }));
}

function listarEventosDisponiveis(jogador) {
  const nivel = obterNivel(jogador);
  return listarEventosEspeciais().filter(evento => nivel >= evento.nivelMinimo);
}

function registrarHistorico(entrada) {
  historicoEventos.unshift({
    ...entrada,
    data: new Date().toISOString()
  });

  if (historicoEventos.length > CONFIG.limiteHistorico) {
    historicoEventos.length = CONFIG.limiteHistorico;
  }
}

function iniciarEvento(id, iniciadoPor = 'sistema', duracaoMinutos) {
  const definicao = EVENTOS_ESPECIAIS.find(item => item.id === id);

  if (!definicao) {
    return {
      sucesso: false,
      mensagem: 'Evento especial não encontrado.'
    };
  }

  const existente = eventosAtivos.get(id);

  if (existente && existente.terminaEm > Date.now()) {
    return {
      sucesso: false,
      mensagem: 'Esse evento já está ativo.',
      evento: clonar(existente)
    };
  }

  const duracao = Math.max(
    1,
    Number(duracaoMinutos || definicao.duracaoMinutos || CONFIG.duracaoPadraoMinutos)
  );

  const agora = Date.now();

  const eventoAtivo = {
    ...clonar(definicao),
    iniciadoPor,
    iniciadoEm: agora,
    terminaEm: agora + duracao * 60 * 1000,
    participantes: {},
    contribuicoes: 0,
    concluido: false
  };

  eventosAtivos.set(id, eventoAtivo);

  registrarHistorico({
    acao: 'inicio',
    eventoId: id,
    nome: definicao.nome,
    iniciadoPor
  });

  return {
    sucesso: true,
    mensagem: `O evento **${definicao.nome}** começou!`,
    evento: clonar(eventoAtivo)
  };
}

function sortearEventoGlobal() {
  if (Math.random() >= CONFIG.chanceEventoGlobal) {
    return {
      ocorreu: false,
      mensagem: 'Nenhum evento global surgiu desta vez.'
    };
  }

  const disponiveis = EVENTOS_ESPECIAIS.filter(evento => {
    const ativo = eventosAtivos.get(evento.id);
    return !ativo || ativo.terminaEm <= Date.now();
  });

  if (!disponiveis.length) {
    return {
      ocorreu: false,
      mensagem: 'Todos os eventos disponíveis já estão ativos.'
    };
  }

  const lendarios = disponiveis.filter(evento => evento.raridade === 'lendario');

  let candidatos = disponiveis;

  if (lendarios.length && Math.random() < CONFIG.chanceEventoLendario) {
    candidatos = lendarios;
  } else {
    candidatos = disponiveis.filter(evento => evento.raridade !== 'lendario');

    if (!candidatos.length) candidatos = disponiveis;
  }

  const evento = candidatos[numeroAleatorio(0, candidatos.length - 1)];
  const resultado = iniciarEvento(evento.id);

  return {
    ocorreu: resultado.sucesso,
    ...resultado
  };
}

function obterEventoAtivo(id) {
  const evento = eventosAtivos.get(id);

  if (!evento) return null;

  if (evento.terminaEm <= Date.now() && !evento.concluido) {
    encerrarEvento(id, 'tempo_esgotado');
    return null;
  }

  return clonar(evento);
}

function listarEventosAtivos() {
  const agora = Date.now();
  const lista = [];

  for (const id of eventosAtivos.keys()) {
    const evento = eventosAtivos.get(id);

    if (evento.terminaEm <= agora && !evento.concluido) {
      encerrarEvento(id, 'tempo_esgotado');
      continue;
    }

    if (evento && !evento.concluido) {
      lista.push({
        id: evento.id,
        nome: evento.nome,
        titulo: evento.titulo,
        raridade: evento.raridade,
        terminaEm: evento.terminaEm,
        participantes: Object.keys(evento.participantes).length,
        contribuicoes: evento.contribuicoes
      });
    }
  }

  return lista;
}

function registrarParticipacao(idEvento, jogador, contribuicao = 1) {
  const evento = eventosAtivos.get(idEvento);

  if (!evento || evento.concluido || evento.terminaEm <= Date.now()) {
    return {
      sucesso: false,
      mensagem: 'Esse evento não está ativo.'
    };
  }

  if (!jogador || typeof jogador !== 'object') {
    return {
      sucesso: false,
      mensagem: 'Jogador inválido.'
    };
  }

  const idJogador = String(jogador.id || jogador.userId || jogador.usuarioId || '');

  if (!idJogador) {
    return {
      sucesso: false,
      mensagem: 'O jogador precisa ter um identificador para participar.'
    };
  }

  if (obterNivel(jogador) < evento.nivelMinimo) {
    return {
      sucesso: false,
      mensagem: `Você precisa alcançar o nível ${evento.nivelMinimo} para participar.`
    };
  }

  const quantidade = Math.max(1, Math.floor(Number(contribuicao) || 1));

  if (!evento.participantes[idJogador]) {
    evento.participantes[idJogador] = {
      jogadorId: idJogador,
      nome: jogador.nome || jogador.username || `Aventureiro ${idJogador}`,
      contribuicao: 0,
      participouEm: Date.now(),
      recompensaRecebida: false
    };
  }

  evento.participantes[idJogador].contribuicao += quantidade;
  evento.contribuicoes += quantidade;

  registrarHistorico({
    acao: 'participacao',
    eventoId: idEvento,
    jogadorId: idJogador,
    contribuicao: quantidade
  });

  return {
    sucesso: true,
    mensagem: `Participação registrada em **${evento.nome}**.`,
    contribuicaoTotal: evento.participantes[idJogador].contribuicao,
    progresso: evento.contribuicoes,
    necessario: evento.progressoNecessario
  };
}

function obterProgresso(idEvento) {
  const evento = obterEventoAtivo(idEvento);

  if (!evento) return null;

  return {
    id: evento.id,
    nome: evento.nome,
    progresso: evento.contribuicoes,
    necessario: evento.progressoNecessario,
    percentual: Math.min(
      100,
      Math.floor((evento.contribuicoes / evento.progressoNecessario) * 100)
    ),
    participantes: Object.keys(evento.participantes).length,
    concluido: evento.contribuicoes >= evento.progressoNecessario
  };
}

function encerrarEvento(id, motivo = 'encerrado') {
  const evento = eventosAtivos.get(id);

  if (!evento) {
    return {
      sucesso: false,
      mensagem: 'Evento não encontrado ou já encerrado.'
    };
  }

  if (evento.concluido) {
    return {
      sucesso: false,
      mensagem: 'Esse evento já foi encerrado.'
    };
  }

  evento.concluido = true;
  evento.motivoEncerramento = motivo;
  evento.encerradoEm = Date.now();

  registrarHistorico({
    acao: 'fim',
    eventoId: id,
    nome: evento.nome,
    motivo,
    contribuicoes: evento.contribuicoes,
    participantes: Object.keys(evento.participantes).length
  });

  eventosAtivos.delete(id);

  return {
    sucesso: true,
    mensagem: `O evento **${evento.nome}** foi encerrado.`,
    evento: clonar(evento),
    completouObjetivo: evento.contribuicoes >= evento.progressoNecessario
  };
}

function obterHistorico(limite = 10) {
  const quantidade = Math.max(1, Math.min(50, Math.floor(Number(limite) || 10)));
  return clonar(historicoEventos.slice(0, quantidade));
}

function formatarEvento(evento) {
  if (!evento) return 'Evento especial não encontrado.';

  const termina = evento.terminaEm
    ? new Date(evento.terminaEm).toLocaleString('pt-BR')
    : 'Não iniciado';

  return [
    `# ${evento.titulo}`,
    `**${evento.nome}**`,
    `Raridade: ${evento.raridade}`,
    `Nível necessário: ${evento.nivelMinimo}`,
    '',
    evento.narrativa,
    '',
    `🎯 Objetivo: ${evento.objetivo}`,
    `📊 Progresso: ${evento.contribuicoes || 0}/${evento.progressoNecessario}`,
    `👥 Participantes: ${Object.keys(evento.participantes || {}).length}`,
    `⏳ Termina em: ${termina}`
  ].join('\n');
}

function formatarListaEventos(eventos = listarEventosAtivos()) {
  if (!eventos.length) {
    return 'Não há eventos especiais ativos neste momento.';
  }

  return [
    '# 🌌 Eventos Especiais Ativos',
    '',
    ...eventos.map((evento, indice) =>
      `**${indice + 1}. ${evento.nome}**\n` +
      `Raridade: ${evento.raridade}\n` +
      `Participantes: ${evento.participantes}\n` +
      `Progresso: ${evento.contribuicoes}`
    )
  ].join('\n\n');
}

function verificarAcesso(idEvento, jogador) {
  const evento = EVENTOS_ESPECIAIS.find(item => item.id === idEvento);

  if (!evento) {
    return { permitido: false, motivo: 'Evento não encontrado.' };
  }

  if (obterNivel(jogador) < evento.nivelMinimo) {
    return {
      permitido: false,
      motivo: `Nível ${evento.nivelMinimo} necessário.`
    };
  }

  const ativo = obterEventoAtivo(idEvento);

  if (!ativo) {
    return {
      permitido: false,
      motivo: 'Esse evento não está ativo.'
    };
  }

  return { permitido: true, motivo: 'Acesso permitido.' };
}

module.exports = {
  CONFIG,
  EVENTOS_ESPECIAIS,
  obterEventoEspecial,
  listarEventosEspeciais,
  listarEventosDisponiveis,
  iniciarEvento,
  sortearEventoGlobal,
  obterEventoAtivo,
  listarEventosAtivos,
  registrarParticipacao,
  obterProgresso,
  encerrarEvento,
  obterHistorico,
  formatarEvento,
  formatarListaEventos,
  verificarAcesso
};

