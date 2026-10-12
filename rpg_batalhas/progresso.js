
'use strict';

/*
============================================================
CRÔNICAS DO CAOS — SISTEMA DE PROGRESSÃO
Arquivo: rpg_batalhas/progresso.js
Módulo independente. Não altera index.js.
============================================================
*/

const CONFIG = {
  nivelInicial: 1,
  nivelMaximo: 400,
  pontosPorNivel: 3,
  pontosIniciais: 0,
  limiteAtributo: 1000000
};

const ATRIBUTOS = {
  forca: {
    nome: 'Força',
    descricao: 'Aumenta o poder dos ataques físicos.',
    valorInicial: 10,
    ganhoPorPonto: 2
  },
  defesa: {
    nome: 'Defesa',
    descricao: 'Reduz parte do dano recebido.',
    valorInicial: 5,
    ganhoPorPonto: 2
  },
  vitalidade: {
    nome: 'Vitalidade',
    descricao: 'Aumenta a vida máxima.',
    valorInicial: 10,
    ganhoPorPonto: 20
  },
  agilidade: {
    nome: 'Agilidade',
    descricao: 'Representa velocidade e capacidade de reação.',
    valorInicial: 5,
    ganhoPorPonto: 1
  },
  sorte: {
    nome: 'Sorte',
    descricao: 'Representa a chance de acontecimentos favoráveis.',
    valorInicial: 1,
    ganhoPorPonto: 1
  }
};

function numero(valor, padrao = 0) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : padrao;
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function garantirEstrutura(jogador) {
  if (!jogador || typeof jogador !== 'object') {
    throw new TypeError('Um objeto de jogador válido é obrigatório.');
  }

  const nivel = limitar(
    Math.floor(numero(jogador.nivel ?? jogador.level, CONFIG.nivelInicial)),
    CONFIG.nivelInicial,
    CONFIG.nivelMaximo
  );

  jogador.nivel = nivel;

  if (!jogador.atributos || typeof jogador.atributos !== 'object') {
    jogador.atributos = {};
  }

  for (const [id, atributo] of Object.entries(ATRIBUTOS)) {
    jogador.atributos[id] = limitar(
      Math.floor(numero(jogador.atributos[id], atributo.valorInicial)),
      0,
      CONFIG.limiteAtributo
    );
  }

  if (!Number.isFinite(Number(jogador.pontosAtributo))) {
    jogador.pontosAtributo = nivel > 1
      ? (nivel - 1) * CONFIG.pontosPorNivel
      : CONFIG.pontosIniciais;
  }

  jogador.pontosAtributo = Math.max(
    0,
    Math.floor(numero(jogador.pontosAtributo))
  );

  return jogador;
}

function obterNivel(jogador) {
  return limitar(
    Math.floor(numero(jogador?.nivel ?? jogador?.level, CONFIG.nivelInicial)),
    CONFIG.nivelInicial,
    CONFIG.nivelMaximo
  );
}

function obterAtributos(jogador) {
  garantirEstrutura(jogador);

  const resultado = {};

  for (const [id, definicao] of Object.entries(ATRIBUTOS)) {
    resultado[id] = {
      nome: definicao.nome,
      descricao: definicao.descricao,
      valor: jogador.atributos[id],
      ganhoPorPonto: definicao.ganhoPorPonto
    };
  }

  return resultado;
}

function obterPontosDisponiveis(jogador) {
  garantirEstrutura(jogador);
  return jogador.pontosAtributo;
}

function calcularVidaMaxima(jogador) {
  garantirEstrutura(jogador);

  const vitalidade = jogador.atributos.vitalidade;
  const vidaBase = 100;
  const vidaCalculada = vidaBase + vitalidade * ATRIBUTOS.vitalidade.ganhoPorPonto;

  return Math.max(1, Math.floor(vidaCalculada));
}

function calcularAtaque(jogador) {
  garantirEstrutura(jogador);

  const forca = jogador.atributos.forca;
  const ataqueBase = 10;

  return Math.max(
    1,
    Math.floor(ataqueBase + forca * ATRIBUTOS.forca.ganhoPorPonto)
  );
}

function calcularDefesa(jogador) {
  garantirEstrutura(jogador);

  return Math.max(
    0,
    Math.floor(
      jogador.atributos.defesa * ATRIBUTOS.defesa.ganhoPorPonto
    )
  );
}

function calcularAgilidade(jogador) {
  garantirEstrutura(jogador);

  return Math.max(
    0,
    Math.floor(
      jogador.atributos.agilidade * ATRIBUTOS.agilidade.ganhoPorPonto
    )
  );
}

function calcularSorte(jogador) {
  garantirEstrutura(jogador);

  return Math.max(
    0,
    Math.floor(
      jogador.atributos.sorte * ATRIBUTOS.sorte.ganhoPorPonto
    )
  );
}

function distribuirPontos(jogador, idAtributo, quantidade = 1) {
  garantirEstrutura(jogador);

  if (!Object.prototype.hasOwnProperty.call(ATRIBUTOS, idAtributo)) {
    return {
      sucesso: false,
      mensagem: 'Atributo inválido. Escolha força, defesa, vitalidade, agilidade ou sorte.'
    };
  }

  const pontos = Math.floor(numero(quantidade, 1));

  if (pontos < 1) {
    return {
      sucesso: false,
      mensagem: 'Você precisa distribuir pelo menos 1 ponto.'
    };
  }

  if (jogador.pontosAtributo < pontos) {
    return {
      sucesso: false,
      mensagem: `Você possui apenas ${jogador.pontosAtributo} ponto(s) disponível(is).`
    };
  }

  const atual = jogador.atributos[idAtributo];

  if (atual + pontos > CONFIG.limiteAtributo) {
    return {
      sucesso: false,
      mensagem: 'Esse atributo atingiu o limite permitido.'
    };
  }

  jogador.atributos[idAtributo] += pontos;
  jogador.pontosAtributo -= pontos;

  return {
    sucesso: true,
    atributo: idAtributo,
    nome: ATRIBUTOS[idAtributo].nome,
    pontosDistribuidos: pontos,
    valorAtual: jogador.atributos[idAtributo],
    pontosRestantes: jogador.pontosAtributo,
    mensagem: `${ATRIBUTOS[idAtributo].nome} aumentado em ${pontos} ponto(s)!`
  };
}

function calcularExperienciaNecessaria(nivel) {
  const n = limitar(
    Math.floor(numero(nivel, CONFIG.nivelInicial)),
    CONFIG.nivelInicial,
    CONFIG.nivelMaximo
  );

  if (n >= CONFIG.nivelMaximo) return 0;

  return Math.floor(100 + n * 45 + Math.pow(n, 1.65) * 12);
}

function obterExperiencia(jogador) {
  return Math.max(
    0,
    Math.floor(numero(jogador?.experiencia ?? jogador?.xp, 0))
  );
}

function concederExperiencia(jogador, quantidade) {
  garantirEstrutura(jogador);

  const ganho = Math.max(0, Math.floor(numero(quantidade, 0)));

  if (obterNivel(jogador) >= CONFIG.nivelMaximo) {
    jogador.experiencia = 0;

    return {
      sucesso: true,
      experienciaGanha: ganho,
      niveisGanhos: 0,
      nivelAtual: CONFIG.nivelMaximo,
      pontosRecebidos: 0,
      mensagem: 'Você já alcançou o nível máximo.'
    };
  }

  let experiencia = obterExperiencia(jogador) + ganho;
  let niveisGanhos = 0;
  let pontosRecebidos = 0;

  while (jogador.nivel < CONFIG.nivelMaximo) {
    const necessaria = calcularExperienciaNecessaria(jogador.nivel);

    if (necessaria <= 0 || experiencia < necessaria) break;

    experiencia -= necessaria;
    jogador.nivel += 1;
    niveisGanhos += 1;

    jogador.pontosAtributo += CONFIG.pontosPorNivel;
    pontosRecebidos += CONFIG.pontosPorNivel;
  }

  if (jogador.nivel >= CONFIG.nivelMaximo) {
    experiencia = 0;
  }

  if ('xp' in jogador && !('experiencia' in jogador)) {
    jogador.xp = experiencia;
  } else {
    jogador.experiencia = experiencia;
  }

  return {
    sucesso: true,
    experienciaGanha: ganho,
    niveisGanhos,
    nivelAtual: jogador.nivel,
    pontosRecebidos,
    experienciaAtual: experiencia,
    proximaMeta: calcularExperienciaNecessaria(jogador.nivel),
    mensagem: niveisGanhos > 0
      ? `Você subiu ${niveisGanhos} nível(is) e recebeu ${pontosRecebidos} ponto(s) de atributo!`
      : `Você recebeu ${ganho} de experiência.`
  };
}

function obterResumo(jogador) {
  garantirEstrutura(jogador);

  return {
    nivel: jogador.nivel,
    nivelMaximo: CONFIG.nivelMaximo,
    experiencia: obterExperiencia(jogador),
    experienciaNecessaria: calcularExperienciaNecessaria(jogador.nivel),
    pontosDisponiveis: jogador.pontosAtributo,
    atributos: { ...jogador.atributos },
    vidaMaximaCalculada: calcularVidaMaxima(jogador),
    ataqueCalculado: calcularAtaque(jogador),
    defesaCalculada: calcularDefesa(jogador),
    agilidadeCalculada: calcularAgilidade(jogador),
    sorteCalculada: calcularSorte(jogador)
  };
}

function formatarProgresso(jogador) {
  const resumo = obterResumo(jogador);

  const linhas = [
    '# 📈 Progressão do Aventureiro',
    '',
    `**Nível:** ${resumo.nivel}/${resumo.nivelMaximo}`,
    `**Experiência:** ${resumo.experiencia}/${resumo.experienciaNecessaria || 'MÁXIMO'}`,
    `**Pontos de atributo:** ${resumo.pontosDisponiveis}`,
    '',
    '## ⚔️ Atributos',
    `💪 Força: ${resumo.atributos.forca}`,
    `🛡️ Defesa: ${resumo.atributos.defesa}`,
    `❤️ Vitalidade: ${resumo.atributos.vitalidade}`,
    `💨 Agilidade: ${resumo.atributos.agilidade}`,
    `🍀 Sorte: ${resumo.atributos.sorte}`,
    '',
    '## 📊 Estatísticas calculadas',
    `❤️ Vida máxima: ${resumo.vidaMaximaCalculada}`,
    `⚔️ Ataque: ${resumo.ataqueCalculado}`,
    `🛡️ Defesa: ${resumo.defesaCalculada}`,
    `💨 Agilidade: ${resumo.agilidadeCalculada}`,
    `🍀 Sorte: ${resumo.sorteCalculada}`
  ];

  return linhas.join('\n');
}

module.exports = {
  CONFIG,
  ATRIBUTOS,
  garantirEstrutura,
  obterNivel,
  obterAtributos,
  obterPontosDisponiveis,
  calcularVidaMaxima,
  calcularAtaque,
  calcularDefesa,
  calcularAgilidade,
  calcularSorte,
  distribuirPontos,
  calcularExperienciaNecessaria,
  obterExperiencia,
  concederExperiencia,
  obterResumo,
  formatarProgresso
};

