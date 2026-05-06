# Guia de Configuração Local (Windows)

Este projeto foi desenvolvido utilizando tecnologias modernas que são compatíveis com Windows, macOS e Linux. Siga os passos abaixo para rodar o site na sua máquina local.

## 1. Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (Versão 20 ou superior): [Baixar aqui](https://nodejs.org/)
- **PNPM** (Recomendado): Abra o terminal (PowerShell ou CMD) e digite:
  ```bash
  npm install -g pnpm
  ```
- **VS Code**: [Baixar aqui](https://code.visualstudio.com/)

## 2. Passo a Passo para Rodar o Projeto

1.  **Extraia o arquivo ZIP**: Extraia o conteúdo de `conmebol-ranking-final.zip` em uma pasta de sua preferência.
2.  **Abra no VS Code**: Clique com o botão direito na pasta e selecione "Abrir com Code".
3.  **Instale as Dependências**: Abra o terminal integrado do VS Code (`Ctrl + '`) e digite:
    ```bash
    pnpm install
    ```
    *(Se não quiser usar pnpm, pode usar `npm install`, mas o pnpm é mais rápido e foi o usado no desenvolvimento).*
4.  **Configuração do Banco de Dados**:
    - O projeto utiliza MySQL. Você precisará de uma instância do MySQL rodando localmente ou um serviço na nuvem (como Railway ou PlanetScale).
    - Crie um arquivo chamado `.env` na raiz do projeto e adicione sua URL de conexão:
      ```env
      DATABASE_URL=mysql://usuario:senha@localhost:3306/nome_do_banco
      ```
5.  **Inicie o Servidor de Desenvolvimento**:
    ```bash
    pnpm dev
    ```
6.  **Acesse o Site**: O terminal mostrará um link (geralmente `http://localhost:5173`). Clique nele para visualizar o site.

## 3. Dicas para Windows

- **PowerShell**: Se receber um erro de "scripts desabilitados" ao tentar rodar o `pnpm`, abra o PowerShell como Administrador e execute:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- **Cross-Env**: O projeto já utiliza `cross-env` nos scripts do `package.json`, o que garante que as variáveis de ambiente funcionem corretamente no Windows (que tem uma sintaxe diferente do Linux/Mac).

## 4. Estrutura do Projeto
- `client/`: Código do frontend (React + Tailwind).
- `server/`: Código do backend (Node.js + tRPC).
- `drizzle/`: Esquema e migrações do banco de dados.

---
**Desenvolvido por:** Manus AI
**Para:** Jackson Ribeiro Silva
