# Guia de Integração de Escudos (Logos)

## 📋 Resumo

O site está **100% pronto** para receber as logos dos clubes. Você pode adicionar as imagens a qualquer momento, e o site carregará automaticamente sem quebrar.

## 🎯 Como Funciona

### Sistema de Fallback Inteligente

O código implementa um sistema de fallback em 3 camadas:

1. **Primeira opção**: Tenta carregar a logo local (`/escudos/nome-do-clube.png`)
2. **Segunda opção**: Se a logo não existir, exibe um badge colorido com as iniciais do clube
3. **Terceira opção**: Se houver erro ao carregar, volta para o badge colorido

### Vantagens

- ✅ Você pode adicionar logos gradualmente
- ✅ O site não quebra se faltar alguma logo
- ✅ Transição suave entre badges coloridos e logos reais
- ✅ Nenhuma mudança de código necessária

## 📁 Estrutura de Pastas

```
client/
├── public/
│   └── escudos/                    ← Coloque as logos aqui
│       ├── README.md               ← Instruções
│       ├── palmeiras.png           ← Exemplo (quando adicionar)
│       ├── flamengo.png
│       └── ... (outros clubes)
└── src/
    ├── components/
    │   └── RankingTable.tsx         ← Componente principal (já configurado)
    └── data/
        ├── clubColors.ts           ← Cores dos clubes (fallback)
        └── escudosMap.ts           ← Mapeamento de nomes
```

## 🚀 Passo a Passo para Adicionar Logos

### 1. Baixar as Logos

Você pode baixar as logos de:
- **escudosfc.com.br** (recomendado)
- Wikipedia
- Wikimedia Commons
- Qualquer outro site confiável

### 2. Renomear os Arquivos

Renomeie os arquivos para corresponder exatamente aos nomes em `escudosMap.ts`:

**Exemplo:**
- `Palmeiras` → `palmeiras.png`
- `Flamengo` → `flamengo.png`
- `LDU Quito` → `ldu-quito.png`
- `Racing Club` → `racing-club.png`

**Regra**: Use letras minúsculas e hífens no lugar de espaços

### 3. Colocar na Pasta

Coloque todos os arquivos PNG na pasta:
```
client/public/escudos/
```

### 4. Pronto!

O site carregará automaticamente as logos quando você recarregar a página.

## 📝 Mapeamento Completo de Nomes

Veja o arquivo `client/src/data/escudosMap.ts` para a lista completa de nomes esperados.

Ou veja o arquivo `client/public/escudos/README.md` para a lista formatada.

## 🎨 Recomendações de Qualidade

- **Formato**: PNG com fundo transparente (ideal)
- **Tamanho**: Mínimo 64x64px, ideal 128x128px ou 256x256px
- **Resolução**: Alta qualidade (300 DPI se possível)
- **Proporção**: Quadrada (1:1)

## 🔧 Código Relevante

### Componente ClubBadge

O componente `ClubBadge` em `RankingTable.tsx` faz todo o trabalho:

```typescript
function ClubBadge({ clubName, size = 'md' }: { clubName: string; size?: 'sm' | 'md' | 'lg' }) {
  const escudoUrl = getEscudoUrl(clubName);
  const colors = getClubColor(clubName);
  
  // Se temos uma URL de escudo, tenta carregar
  if (escudoUrl) {
    return (
      <img
        src={escudoUrl}
        alt={clubName}
        className={...}
        onLoad={() => setEscudoCarregado(true)}
        onError={() => setEscudoCarregado(false)}
        style={{ display: escudoCarregado ? 'block' : 'none' }}
        title={clubName}
      />
    );
  }
  
  // Fallback para badge com cores quando não há escudo
  return (
    <div
      className={...}
      style={{
        backgroundColor: colors.primary,
        color: colors.secondary,
      }}
      title={clubName}
    >
      {colors.initials}
    </div>
  );
}
```

### Arquivo de Mapeamento

O arquivo `escudosMap.ts` contém:

```typescript
export const escudosMap: Record<string, string> = {
  'Palmeiras': 'palmeiras.png',
  'Flamengo': 'flamengo.png',
  // ... mais clubes
};

export function getEscudoUrl(clubName: string): string | undefined {
  const fileName = escudosMap[clubName];
  if (!fileName) return undefined;
  return `/escudos/${fileName}`;
}
```

## ❓ Perguntas Frequentes

### P: Preciso editar algum código?
**R**: Não! Tudo está pronto. Apenas coloque os arquivos PNG na pasta.

### P: E se eu adicionar uma logo com nome errado?
**R**: Não será carregada, mas o site continuará funcionando com o badge colorido.

### P: Posso adicionar logos parcialmente?
**R**: Sim! Você pode adicionar algumas logos e deixar outras como badges coloridos.

### P: Como eu sei se a logo foi carregada?
**R**: Abra o DevTools (F12) → Aba Network → Procure por `/escudos/nome-do-clube.png`

### P: Qual é o tamanho máximo de arquivo?
**R**: Recomenda-se no máximo 100KB por arquivo PNG

## 📞 Suporte

Se tiver dúvidas, consulte:
1. `client/public/escudos/README.md` - Instruções básicas
2. `client/src/data/escudosMap.ts` - Lista de nomes esperados
3. `client/src/components/RankingTable.tsx` - Código do componente

---

**Status**: ✅ Sistema pronto para logos locais
**Última atualização**: 02/05/2026
