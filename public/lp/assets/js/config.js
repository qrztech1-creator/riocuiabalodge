/* =====================================================================
   RIO CUIABÁ LODGE · CONFIGURAÇÃO DE PREÇOS
   ---------------------------------------------------------------------
   ÚNICO lugar para alterar valores do site. Tudo que aparece na página
   (preço, "equivale a R$ X por pessoa", mensagens de WhatsApp e a
   estimativa do montador de pacote) é calculado a partir daqui.

   Não edite preços direto no index.html: o que está lá é só o texto
   reserva para quem abre a página sem JavaScript, e é sobrescrito
   por estes valores assim que a página carrega.

   Valores em reais, número inteiro, SEM ponto de milhar: 1590, não 1.590.
   ===================================================================== */

window.RCL_CONFIG = {

  // Mesmo número dos botões fixos do index.html. Só dígitos, com DDD.
  whatsapp: '31996467116',

  // Day use é cobrado POR BARCO. O "equivale a R$ X por pessoa" divide por este número.
  pessoasPorBarco: 3,

  precos: {

    // Day use de pesca COM comida e bebida · POR BARCO (até 3 pessoas)
    dayUseComAlimentacao: {
      valor: 1590,
      // Até esta data (inclusive) vale "valor". A partir do dia seguinte o site
      // passa a mostrar "valorDepois" sozinho, sem precisar editar nada.
      // Para desligar a troca automática, apague as duas linhas abaixo.
      validoAte: '2026-09-30',
      valorDepois: 1790            // valor de 2027
    },

    // Day use de pesca SEM comida e bebida (o cliente traz o próprio consumo) · POR BARCO
    dayUseSemAlimentacao: {
      valor: 1190
    },

    // Diária all inclusive · POR PESSOA
    diariaAllInclusive: {
      valor: 1790
    }
  },

  /* -------------------------------------------------------------------
     MONTE SEU PACOTE EXCLUSIVO
     -------------------------------------------------------------------
     Conta usada pelo montador:

       barcos    = pessoas ÷ pessoasPorBarco, arredondado para cima
       pesca     = diasPesca × barcos  × pescaPorBarcoPorDia
       pernoites = pernoites × pessoas × pernoitePorPessoa
       véspera   = (se "pernoite antes da pesca" = sim) pessoas × pernoiteAntesPorPessoa

       TOTAL     = pesca + pernoites + véspera

     ⚠️  TRAVA DE SEGURANÇA
     Enquanto "precosConfirmados" for false, o VISITANTE vê "Valor sob
     consulta" e a mensagem de WhatsApp vai sem valor. A estimativa só
     aparece em modo prévia: rodando em localhost, ou abrindo a página
     com ?previa no fim do endereço (ex.: seusite.com.br/?previa).

     Depois de preencher TODOS os valores com a tabela oficial do cliente,
     mude para true. Só então o valor estimado aparece para o público.
     ------------------------------------------------------------------- */
  montador: {

    precosConfirmados: false,     // TODO: mudar para true depois de preencher a tabela abaixo

    tabela: {
      // Com alimentação e bebida
      com: {
        pescaPorBarcoPorDia:    1590,  // TODO: preço a confirmar com o cliente (hoje igual ao day use)
        pernoitePorPessoa:       400,  // TODO: preço a confirmar com o cliente (valor fictício, só para testar a conta)
        pernoiteAntesPorPessoa:  400   // TODO: preço a confirmar com o cliente (valor fictício, só para testar a conta)
      },
      // Sem alimentação e bebida
      sem: {
        pescaPorBarcoPorDia:    1190,  // TODO: preço a confirmar com o cliente (hoje igual ao day use)
        pernoitePorPessoa:       250,  // TODO: preço a confirmar com o cliente (valor fictício, só para testar a conta)
        pernoiteAntesPorPessoa:  250   // TODO: preço a confirmar com o cliente (valor fictício, só para testar a conta)
      }
    },

    // Limites dos seletores e valor com que cada um já começa preenchido
    limites: {
      diasPesca: { min: 1, max: 10, inicial: 1 },
      pernoites: { min: 0, max: 10, inicial: 1 },
      pessoas:   { min: 1, max: 24, inicial: 2 }
    }
  }
};
