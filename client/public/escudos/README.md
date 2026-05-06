# Pasta de Escudos - Instruções

Esta pasta contém (ou conterá) os logos dos clubes de futebol em formato PNG.

## Como adicionar as logos

1. **Baixe as logos dos clubes** em formato PNG de qualquer fonte confiável (ex: escudosfc.com.br, Wikipedia, etc.)

2. **Nomeie os arquivos exatamente como indicado abaixo** (use letras minúsculas e hífens no lugar de espaços):

### Lista de nomes de arquivos esperados:

```
palmeiras.png
flamengo.png
ldu-quito.png
racing-club.png
estudiantes.png
sao-paulo.png
velez-sarsfield.png
river-plate.png
botafogo.png
penarol.png
libertad.png
atletico-nacional.png
independiente-del-valle.png
universitario.png
internacional.png
fortaleza.png
boca-juniors.png
cerro-porteno.png
nacional.png
ind-rivadavia.png
bahia.png
universidad-de-chile.png
corinthians.png
bolivar.png
rosario-central.png
colo-colo.png
alianza-lima.png
olimpia.png
atletico-mineiro.png
independiente.png
talleres.png
barcelona-guayaquil.png
cruzeiro.png
argentinos-juniors.png
lanus.png
the-strongest.png
sporting-cristal.png
atletico-pr.png
coquimbo-unido.png
gremio.png
mirassol.png
universidad-catolica.png
fluminense.png
vitoria.png
san-lorenzo.png
carabobo.png
huracan.png
deportivo-tachira.png
platense.png
cuiaba.png
central-cordoba.png
atletico-bucaramanga.png
barcelona-guayaquil.png
```

3. **Coloque os arquivos PNG nesta pasta** (`client/public/escudos/`)

4. **O site carregará automaticamente as logos!**

## Como funciona

O código está configurado para:
- Tentar carregar a logo local primeiro
- Se a logo não existir, exibir um badge colorido com as iniciais do clube
- Isso significa que você pode adicionar as logos gradualmente sem quebrar o site

## Tamanho recomendado

- Recomenda-se logos com tamanho mínimo de 64x64 pixels
- Tamanho ideal: 128x128 ou 256x256 pixels
- Formato: PNG com fundo transparente (ideal) ou branco

## Estrutura do projeto

```
client/
├── public/
│   └── escudos/          ← Coloque as logos aqui
│       ├── palmeiras.png
│       ├── flamengo.png
│       └── ... (outros clubes)
└── src/
    └── data/
        └── escudosMap.ts  ← Mapeamento de nomes (não precisa editar)
```

## Teste

Após adicionar as logos, acesse o site e você verá as logos sendo exibidas no lugar dos badges coloridos!
