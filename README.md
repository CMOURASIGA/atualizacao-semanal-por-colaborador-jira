# Atualização Semanal por Colaborador no JIRA

## Descrição
Este projeto automatiza o envio de emails semanais personalizados para cada colaborador com um resumo das atividades no JIRA. O script coleta as tarefas, classifica por status e envia um relatório detalhado para cada pessoa.

## Funcionalidades
- Geração de relatórios semanais para cada colaborador com base em atividades específicas.
- Formatação HTML de emails com blocos coloridos para destacar status (pendente, em andamento e concluído).
- Inclusão de mensagens de incentivo aleatórias para motivar os colaboradores.
- Integração com planilhas do Google Sheets para buscar mensagens personalizadas.

## Pré-requisitos
- **API Token** do JIRA para autenticação.
- Permissão para acessar e modificar os projetos no JIRA.
- Planilha do Google configurada para armazenar mensagens de incentivo.
- Configuração do Google Apps Script para automatizar o envio semanal.

## Como Configurar
1. Gere um **API Token** no JIRA e configure as variáveis `jiraUsername` e `jiraApiToken` no script.
2. Crie um novo projeto no Google Apps Script e copie o conteúdo do arquivo `atualizacao_semanal_por_colaborador.js` para o editor.
3. Ajuste os filtros dos colaboradores no script para refletir as atividades que deseja monitorar.
4. Atualize a **Planilha do Google** com mensagens de incentivo e configure o ID e o nome da aba no script.

## Estrutura do Projeto
- **/scripts**: Código do Google Apps Script utilizado para automação (`atualizacao_semanal_por_colaborador.js`).
- **/docs**: Documentação e instruções detalhadas.

## Futuras Melhorias
- Adição de logs detalhados para acompanhamento do envio.
- Integração com mais plataformas além do JIRA para centralizar informações.

## Autor
Christian Moura - Inspira Rede de Educadores

