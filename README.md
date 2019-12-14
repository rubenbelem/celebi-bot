# Teste Técnico Méliuz

## Rúben Jozafá Silva Belém

### Arquitetura e decisões técnicas

-   Banco de Dados:

Para esse projeto, estou utilizando o banco de dados _SQLite_, pela sua praticidade, já que não é preciso instalar nenhum programa. Também escolhi utilizar o o pacote _Sequelize_, um _Object-Relational Mapping_ baseado em _Promises_ para NodeJS, que comporta Postgres, MySQL, MariaDB, SQLite e Microsoft SQL Server.

Quanto à modelagem, há apenas uma tabela para o Time, na qual há um id (chave primária, incrementado automaticamente), o nome do time, o nome do treinador, e um campo de texto onde armazeno um array convertido em _string_, com 6 ids, referentes aos pokémons pertencentes ao time.

-   Organização do código

Para boas práticas de código e formatação, utilizei os pacotes _ESLint_ e _Prettier_, respectivamente. Também utilize um pacote chamado Husky para criar _hooks_ para o Git, de forma que só é permitido realizar um _commit_ ou um _push_ se não houver nenhum erro apontado pelo _ESLint_.

-   Acesso à PokéAPI

Para a recuperação dos dados da API de Pokémons utilizei um pacote chamado _pokedex-promise-v2_ (https://github.com/PokeAPI/pokedex-promise-v2#pokedex-promise-v2-), que é uma interface para a _PokéAPI_. Esse pacote, além de facilitar a implementação das requisições, ainda coloca os resultados das requisições em _cache_ na memória _RAM_.

-   Garantia de escalabilidade:

Com o objetivo de tornar o sistema escalável, a possibilidade de _caching_ me levou a pensar em uma arquitetura onde há vários "micro-serviços PokéAPI" que consomem a PokéAPI e armazenam os resultados em memória para tornar a consulta mais rápida. O tempo de duração da cache é um parâmetro configurável no pacote mencionado acima. Estes micro-serviços não precisam estar todos necessariamente no mesmo computados, e também é deles a tarefa de processar os filtros por nome e tipo.

E então, há a API geral, que implementa as rotas que irão alimentar o _frontend_ e realiza requisições aos micro-serviços PokéAPI para obter os dados dos pokémons. Essa API geral tambeḿ pode ser executada em várias instâncias, de forma distribuída. No entanto, todas elas devem consumir um único banco de dados.

A _PokéAPI_ tem uma limitação de só permitir 100 requisições por minuto (https://pokeapi.co/docs/v2.html/#info), para cada IP. No entanto, as informações necessárias dos pokémons só estão disponíveis em rotas de forma que é necessário requisitar um pokémon por vez. Era possível implementar um pooling de forma que a cada minuto a API deste projeto requisitasse 100 pokémons da PokéAPI, mas isso demoraria cerca de 9 - 10 minutos (já que são mais de 900 pokémons) apenas para iniciar o micro-serviço PokeAPI. Então, para agilizar o teste desse projeto, optei por trazer apenas 99 pokémons ao iniciar o micro-serviço.

É possível haver escalabilidade da solução, pois podem existir várias instâncias da API geral sendo executadas na mesma máquina ou em máquinas diferentes, consumindo dados em _cache_ de um micro-serviço PokéAPI sendo executadas também na mesma máquina ou em máquinas diferentes. Escolhi o _NodeJS_ pois com ele seria possível implementar essa escalabilidade, já que possui um módulo de _cluster_ que permite o uso de balanceamento de carga em um ambiente com uma CPU de vários núcleos. É possível clonar a aplicação principal de forma que haja um clone para cada núcleo da CPU. O módulo então cuida de redirecionar as requisições para os devidos clones.

### Instruções para execução

Os comandos a seguir foram testados em uma máquina virtual, com o sistema operacional Ubuntu 18.04 Bionic Beaver, a partir de uma instalação "limpa".

#### 1. Instalação de dependências

O primeiro passo é a instalação do Git. Para isso, usar o comando:

```
sudo apt install git
```

Instalação do curl:

```
sudo apt install curl
```

Agora, deve-se habilitar o repositório NodeSource com o comando:

```
sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```

Após isso, deve-se instalar o Node com o comando:

```
sudo apt-get install -y nodejs
```

Para verificar se o Node foi instalado corretamente, execute o comando (este projeto foi desenvolvido com a versão 10):

```
node --version
```

#### 2. Executando a API

-   Primeiramente, é preciso clonar o repositório e apontar o terminal para a pasta do projeto:

```
git clone https://github.com/rubenbelem/meliuz-technical-test.git
cd meliuz-technical-test
```

-   Instalação dos pacotes Node utilizados pelo projeto:

```
npm install
```

-   Criar o arquivo _.env_ de variáveis de ambiente:

```
cp dotenv_template .env
```

Após isso, você pode abrir o arquivo .env em seu editor de texto de preferência, e atribuir as variáveis. Abaixo está a explicação de cada variável e um exemplo de possível valor:

```
POKEAPI_PORT=3001 // porta padrão na qual o micro-serviço PokéAPI irá escutar, e a API geral fará suas requisições.
DATABASE_NAME="meliuz" // nome do banco de dados a ser criado
API_PORT=4001 // Porta padrão que API geral escutará.
POKEAPI_HOST="localhost" // IP/Hostname do micro-serviço pokeapi que para o qual a API geral fará suas requisições
```

-   Executando o micro-serviço da PokéAPI:

```
npm run pokeapi-service
```

ou

```
POKEAPI_PORT=<porta> npm run pokeapi-service
```

para executar em uma porta de sua preferência, diferente da definida no .env.

Agora, abra um outro terminal e aponte para o diretório _meliuz-technical-test_:

```
cd /caminho/do/diretorio/meliuz-technical-test
```

Por fim, executar a API geral com o comando:

```
npm start
```

ou

```
POKEAPI_PORT=<porta> API_PORT=<porta2> npm start
```

para executar em uma porta de sua preferência.

#### 3. Rotas

Segue a lista de rotas implementadas na API geral, com alguns comandos do _curl_ para testes, com uma instância da API geral escutando a porta 4001, e uma instância do micro-serviço pokeapi escutando a porta 3001:

#### GET /pokemon

Lista todos os pokémons (99, como já mencionado anteriormente).

Essa rota também permite filtros por nome e por tipo:

> GET /pokemon?name=bulba
> GET /pokemon?type=pois
> GET /pokemon?name=bulba&type=poiso

Funcionamento do filtro por nome: Se o nome do pokémon é "bulbasaur", e o parâmetro da query for "_name=bulba_", esse pokémon será considerado pois contem em algum lugar de seu nome o valor do parâmetro _name_ da query.

Funcionamento do filtro por tipo: O filtro para o tipo funciona de forma similar, porém considera essa correspondência em qualquer um dos tipos do pokémon.

#### POST /team/

Cadastro de times. Segue um exemplo dos dados que devem ir no corpo da requisição:

```
{
	"name": "Time1",
	"trainer_name": "Ruben",
	"pokemon_ids": [1,2,3,4,5,6]
}
```

A API dispara um erro se houver _ids_ repetidos no _array pokemon_ids_.

#### GET /team?id=\<id\>

Retorna um time a partir de seu id.

#### DELETE /team?id=\<id\>

Deleção de um time a partir de seu id.
