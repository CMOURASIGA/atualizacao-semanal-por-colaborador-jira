// Função principal para enviar o relatório semanal de atividades no JIRA
function sendJiraEmail() {
  Logger.log("Iniciando o processo de envio de email...");

  const jiraUsername = //usuário de acesso do JIRA;
  const jiraApiToken = //API Token do JIRA;

  const headers = {
    "Authorization": "Basic " + Utilities.base64Encode(jiraUsername + ":" + jiraApiToken),
    "Content-Type": "application/json"
  };

  const colaboradores = [
    { nome: "André Ventura", email: /*Email do colaborador*/ , filtro: /*Link do Filtro criado do colaborador*/ },
    { nome: "Gustavo Barros", email: /*Email do colaborador*/, filtro: /*Link do Filtro criado do colaborador*/ },
    { nome: "Yohan Gregorio", email: /*Email do colaborador*/, filtro: /*Link do Filtro criado do colaborador*/ }
  ];

  colaboradores.forEach(function (colaborador) {
    try {
      Logger.log('Iniciando processamento para: ' + colaborador.nome);

      // Faz a requisição para o JIRA
      const response = UrlFetchApp.fetch(colaborador.filtro, { "method": "get", "headers": headers });
      const atividades = JSON.parse(response.getContentText());

      // Verificar se há atividades
      if (atividades.issues.length === 0) {
        Logger.log('Nenhuma atividade pendente encontrada para: ' + colaborador.nome);
        return;
      }

      Logger.log('Atividades recuperadas para ' + colaborador.nome + ': ' + atividades.issues.length + ' atividades');

      // Processa as atividades com os nomes de status em português
      var totalPendentes = atividades.issues.filter(a => a.fields.status.name === 'Tarefas pendentes').length;
      var totalEmAndamento = atividades.issues.filter(a => a.fields.status.name === 'Em andamento').length;
      var totalConcluidas = atividades.issues.filter(a => a.fields.status.name === 'Concluído').length;

      // Monta os blocos coloridos
var blocosStatus = `
  <div style="display: flex; justify-content: space-around; margin-top: 20px;">
    <div style="background-color: #228B22; color: white; padding: 2px; text-align: center; border-radius: 10px; width: 30%; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
      <strong style="font-size: 16px;">Concluído</strong>
      <p style="font-size: 24px; margin: 10px 0;">${totalConcluidas}</p>
    </div>
    <div style="background-color: #FFA500; color: white; padding: 2px; text-align: center; border-radius: 10px; width: 30%; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
      <strong style="font-size: 16px;">Em Andamento</strong>
      <p style="font-size: 24px; margin: 10px 0;">${totalEmAndamento}</p>
    </div>
    <div style="background-color: #FF0000; color: white; padding: 2px; text-align: center; border-radius: 10px; width: 30%; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
      <strong style="font-size: 16px;">Pendentes</strong>
      <p style="font-size: 24px; margin: 10px 0;">${totalPendentes}</p>
    </div>
  </div>
`;


      // Mensagem de incentivo aleatória
      var mensagemIncentivo = buscarMensagemIncentivoAleatoria();

      // Monta a mensagem do email com design
      var mensagem = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2F5597;">Bom dia ${colaborador.nome},</h2>
          <p>Aqui está o resumo das suas atividades da semana:</p>
          ${blocosStatus}
          <p><strong>Mensagem de Incentivo:</strong> ${mensagemIncentivo}</p>
      `;

      // Adicionar atividades em andamento e pendentes, se existirem
      if (totalEmAndamento > 0) {
        mensagem += '<h3 style="color: #FF8C00;">Atividades em Andamento</h3>' + montarTabela(atividades.issues, 'Em andamento');
      }
      if (totalPendentes > 0) {
        mensagem += '<h3 style="color: #FF4500;">Atividades Pendentes</h3>' + montarTabela(atividades.issues, 'Tarefas pendentes');
      }

      // Definir mensagem final conforme o status das atividades
      if (totalPendentes === 0 && totalEmAndamento === 0) {
        mensagem += '<p><strong>Parabéns, todas as suas atividades estão concluídas!</strong></p>';
      } else {
        mensagem += '<p>Por favor, revise as atividades acima e atualize conforme necessário.</p>';
      }

      mensagem += '<p><strong>Obrigado!</strong></p></div>';

      // Envia o email com as atividades
      MailApp.sendEmail({
        to: colaborador.email,
        subject: 'Dashboard do resultado de trabalho da semana',
        htmlBody: mensagem
      });

      Logger.log('Email enviado com sucesso para ' + colaborador.nome);

    } catch (error) {
      Logger.log('Erro ao processar ' + colaborador.nome + ': ' + error.message);
    }
  });

  Logger.log('Processo de envio de email concluído.');
}

// Função para montar a tabela de atividades por status com design e categoria ajustada
function montarTabela(atividades, statusDesejado) {
  var tabela = `
    <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 10px;">
      <thead style="background-color: #2F5597; color: white;">
        <tr>
          <th>Chave</th>
          <th>Resumo</th>
          <th>Status</th>
          <th>Prioridade</th>
          <th>Última Atualização</th>
        </tr>
      </thead>
      <tbody>
  `;

  atividades.forEach(function(atividade) {
    if (atividade.fields.status.name === statusDesejado) {
      tabela += `
        <tr>
          <td><a href="https://redeinspiraeducadores.atlassian.net/browse/${atividade.key}" target="_blank">${atividade.key}</a></td>
          <td>${atividade.fields.summary}</td>
          <td>${atividade.fields.status.name}</td>
          <td>${atividade.fields.priority.name}</td>
          <td>${formatarData(atividade.fields.updated)}</td>
        </tr>
      `;
    }
  });

  tabela += `</tbody></table>`;
  return tabela;
}

// Função para obter a categoria (do customfield_10038 ou labels)
function obterCategoria(issue) {
  var categoria = issue.fields.customfield_10038 ? issue.fields.customfield_10038[0].value : "N/D";
  
  if (categoria === "N/D" && issue.fields.labels && issue.fields.labels.length > 0) {
    categoria = issue.fields.labels.join(', ');
  }

  return categoria;
}

// Função para formatar a data
function formatarData(dataJira) {
  if (dataJira) {
    return Utilities.formatDate(new Date(dataJira), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
  }
  return "N/D";
}

function obterMensagensDaPlanilha(status) {
  const sheetId = "1KKPdbvMnMuso3EZqsW22BPRXUofS87PyKc5embtMse0";
  const aba = "Mensagens";
  const range = "A:B";
  
  const planilha = SpreadsheetApp.openById(sheetId);
  const dados = planilha.getSheetByName(aba).getRange(range).getValues();
  
  // Filtrar e normalizar o status para ignorar maiúsculas/minúsculas e acentos
  const mensagensFiltradas = dados.filter(function (linha) {
    return linha[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }).map(function (linha) {
    return linha[0];
  });
  
  return mensagensFiltradas;
}

// Função principal para selecionar a mensagem
function buscarMensagemIncentivoAleatoria(totalConcluidas, totalEmAndamento, totalPendentes) {
  let status;
  
  if (totalConcluidas > totalEmAndamento && totalConcluidas > totalPendentes) {
    status = 'concluido'; // Se a maioria das tarefas estiver concluída
  } else if (totalEmAndamento > totalPendentes) {
    status = 'emAndamento'; // Se há mais tarefas em andamento
  } else {
    status = 'pendente'; // Se há mais tarefas pendentes
  }
  
  // Buscar as mensagens da planilha com base no status
  const mensagens = obterMensagensDaPlanilha(status);

  // Selecionar uma mensagem aleatória da lista
  var randomIndex = Math.floor(Math.random() * mensagens.length);
  return mensagens[randomIndex];
}







