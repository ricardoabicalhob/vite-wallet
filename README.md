# 📈 InvestIR

O **InvestIR** é um sistema para controle, análise e planejamento de carteira de investimentos em ações.  
Com ele, você pode registrar suas negociações de compra e venda, acompanhar a rentabilidade dos seus ativos em tempo real e planejar a composição ideal da sua carteira.

As cotações são obtidas automaticamente através da **API BRAPI**, permitindo que a visualização de dados financeiros seja sempre atualizada.

---

## 🚀 Funcionalidades Principais

### 🧾 Controle de Ordens
- Registrar novas ordens de **compra** ou **venda**.
- Editar ordens existentes.
- Excluir ordens.
- Histórico completo de transações.

### 💼 Visualização da Carteira Atual
Para cada ativo da carteira, o sistema exibe:
- **Logo** e **símbolo** do ativo.
- **Quantidade total** de ações.
- **Preço médio** de compra.
- **Cotação atual (tempo real via BRAPI)**.
- **Rentabilidade** (absoluta e percentual).

### 🎯 Planejamento da Carteira
- Monte uma **carteira planejada** com os ativos desejados.
- Compare **carteira atual vs. planejada**.
- Veja **percentual de alocação recomendado** vs. **percentual atual**.
- Sistema calcula automaticamente **diferenças e ajustes necessários**.

### 🧮 Cálculo Automático de Imposto de Renda
- Cálculo automático do **ganho líquido** nas vendas.
- Considera histórico de compra e venda.
- Calcula **IR a pagar** segundo regras da Receita Federal para Day Trade e Swing Trade.
- Isenção automática em operações comuns (Swing Trade) quando aplicável.
- Cálculo de **IRRF (dedo-duro)**.
- Compensação automática de **prejuízos acumulados**.

#### 📊 Tabela de Tributação por Modalidade

Cada modalidade possui regras próprias de tributação, alíquotas e compensação de prejuízos:

| Característica            | Day Trade                                | Swing Trade (Operações Comuns)                     |
|---------------------------|--------------------------------------------|----------------------------------------------------|
| **Alíquota de IR**        | 20% sobre o lucro líquido mensal.         | 15% sobre o lucro líquido mensal.                  |
| **Isenção (R$ 20 mil)**   | Não há (qualquer lucro é tributável).     | Sim, para vendas totais abaixo de R$ 20.000 no mês.|
| **Compensação de Prejuízos** | Apenas com lucros futuros de day trade. | Apenas com lucros futuros de swing trade.          |
| **IRRF (Dedo-duro)**      | 1% sobre o valor da venda.                | 0,005% sobre o valor da venda.                     |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|----------|------------|
| React / Vite | Interface do usuário e fluxo de navegação |
| TypeScript | Tipagem e maior segurança no código |
| TailwindCSS | Estilização |
| API BRAPI | Obtenção das cotações em tempo real |
| Node.js / Backend | Processamento e persistência de dados |
| Banco de Dados PostgreSQL | Armazenamento das ordens e configurações |

---

## 📷 Capturas de Tela (opcional)

![Tela inicial](<./src/docs//images/Captura de tela 2025-11-30 015730.png>)
![Minha carteira](<./src/docs/images/Captura de tela 2025-11-30 015710.png>)
![Minhas ordens](<./src/docs/images/Captura de tela 2025-11-30 015743.png>)
![Rebalanceamento da carteira](<./src/docs/images/Captura de tela 2025-11-30 015800.png>)
![Imposto de renda](./src/docs/images/Captura%20de%20tela%202025-12-23%20103842.png)

---

## ⚙️ Como Executar o Projeto

```bash
# Clone o repositório
git clone https://github.com/ricardoabicalhob/investir.git

# Acesse o diretório
cd investir

# Instale as dependências
npm install

# Execute o projeto
npm run dev
