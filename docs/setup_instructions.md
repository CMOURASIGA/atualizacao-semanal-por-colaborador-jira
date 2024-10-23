# Instruções de Configuração

## 1. Gere o API Token do JIRA
- Acesse seu perfil no JIRA e vá até a seção de segurança para gerar um API token.
- Copie e guarde o token em um local seguro.

## 2. Configuração do Google Apps Script
- Abra o Google Apps Script (https://script.google.com).
- Crie um novo projeto e copie o conteúdo do arquivo `atualizacao_semanal_por_colaborador.js` para o editor.
- Atualize as variáveis do script:
  - `jiraUsername`: Seu usuário do JIRA.
  - `jiraApiToken`: Seu API token gerado.
- Configure os filtros dos colaboradores para garantir que o script está buscando as tarefas corretas.

## 3. Criar um Trigger para Execução Automática
- No Google Apps Script, vá até **Triggers** (ou acesse `Executar > Triggers`).
- Crie um novo trigger para a função `sendJiraEmail`.
- Configure para executar **semanalmente** às segundas-feiras, no horário que preferir.

## 4. Configurar a Planilha de Mensagens
- Crie uma planilha no Google Sheets com o ID especificado no script e adicione mensagens de incentivo conforme o formato esperado.
