# miguel-acai

Projeto simples de gerenciamento de clientes e pedidos baseado da empresa Miguel Açaí de Ampére - PR, feito com autorização da mesma.

## Requisitos

- Docker
- Node.js

## Instalação

- [Linux](#linux)
- [Windows](#windows)
- [macOS](#macos)

### Linux

1. Instale o Docker seguindo as instruções [aqui](https://docs.docker.com/engine/install/).
2. Instale o Node.js usando o gerenciador de pacotes da sua distribuição ou [aqui](https://nodejs.org/).

### Windows

1. Baixe e instale o Docker Desktop [aqui](https://www.docker.com/products/docker-desktop).
2. Instale o Node.js através do instalador disponível [aqui](https://nodejs.org/).

### macOS

1. Instale o Docker Desktop [aqui](https://www.docker.com/products/docker-desktop).
2. Instale o Node.js usando o Homebrew:

```bash
brew install node
```

## Repositório

```bash
git clone https://github.com/devHonorio/miguel-backend.git
cd miguel-backend
```

## Variáveis de Ambiente

As seguintes variáveis de ambiente são necessárias para a configuração do projeto:

- `EVOLUTION_API_INSTANCE`: Nome da instância da API Evolution.
- `API_KEY`: Chave de autenticação para acessar a API, você vai usar para logar na mesma.

## Iniciando o projeto

instale as dependências

```bash
npm i
```

Rode um `npm test` para verificar se está tudo correto

```bash
npm test
```

Rode o servidor

```bash
npm run dev
```

Entre no manager da evolution api, a senha foi definida em `API_KEY`

[http://localhost:8080](http://localhost:8080/manager)

Crie uma instancia com o mesmo nome que foi definida em `EVOLUTION_API_INSTANCE`

Agora clone o frontend [aqui](https://github.com/devHonorio/miguel-frontend.git)
