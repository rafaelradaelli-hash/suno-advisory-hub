import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

var INTL_SUBS = {
  "Dollar Income": ["VNOM","HPQ","EWBC","ALLY","BTI"],
  "Hidden Value": ["PAM","GPRK","IRS","HCC","AMR","PROSY","BABA","BFH"],
  "Great Companies": ["SIRI","LBRDA","AMZN","GOOG","META","BKNG","BLK","BRKB"]
};

function makeData() {
  return {
    Dividendos: [
      {"ticker": "WIZC3", "name": "Wiz", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 7.5, "thesis": "A Wiz é uma holding de corretagem de seguros que opera através de canais bancários (bancassurance), com participações estratégicas em corretoras de bancos como Inter, BRB e BMG. Após perder exclusividade com a Caixa em 2021, se reinventou através de parcerias estratégicas. A empresa combina crescimento com baixa intensidade de capital, possui receitas recorrentes de run-off da Caixa (~R$200M/ano) e opera em segmentos com alta geração de caixa. O valuation atual (~R$1,3-1,4bi) embute baixo crescimento, criando assimetria positiva de retorno.", "thesisPros": ["Todas unidades contribuíram", "Modelo de negócio asset-light com baixíssima necessidade de capex, diferenciado na B3", "Participação de 40% na Inter Seguros com contrato até 2069, exposta ao crescimento de banco digital com 36M clientes", "Diversificação de receitas através de múltiplas corretoras (Inter, BRB, BMG) e canais (Promotiva, consórcios)", "Receita recorrente de run-off da Caixa de ~R$200M/ano adicionando margem de segurança", "Forte geração de caixa operacional (R$466,5M em 2025) e baixa intensidade de capital", "Valuation descontado não precifica adequadamente potencial de crescimento das parcerias estratégicas"], "thesisCons": ["Transição de CEO", "Alta competição no setor dominado por grandes instituições financeiras", "Dependência de parcerias bancárias com contratos de prazo determinado (BMG até 2040, BRB até 2046)", "Promotiva tem contrato não-mútuo com BB até apenas 2027, criando incerteza de renovação", "Exposição a ciclos macroeconômicos que afetam originação de crédito e venda de seguros", "Controle concentrado na Integra/FENAE após saída da CNP pode gerar conflitos de interesse", "Amortização relevante não-caixa de contratos de exclusividade afeta resultado contábil"], "resultPros": ["Recorde de R$4bi em prêmios emitidos em 2025 (+11,7% vs 2024), demonstrando recuperação pós-Caixa", "Forte desalavancagem: dívida líquida caiu 48,6% para R$229M, melhorando perfil de risco", "Lucro líquido da controladora de R$201,1M (+25,6% vs 2024), equivalente a R$1,26/ação", "Inter Seguros entregou melhor resultado da história com receita de R$333,8M (+34,9%) e carteira de 10M contratos (+90,8%)", "EBITDA consolidado de R$313,4M (+14,9%), impulsionado por equivalência patrimonial de R$232,7M (+44,6%)", "Proposta de dividendos de 50% do lucro (acima dos 25% estatutários), sinalizando confiança da administração", "Omni1 alcançou recorde de R$332,5M em prêmios (+42,1%), com lucro de R$46,5M (+52,2%)"], "resultCons": ["Segmento de crédito e consórcios registrou queda de 12,6% no volume comercializado no 4T25 (R$3,34bi)", "Volume anual de crédito/consórcios caiu 15,4% para R$14,3bi, impactado por juros altos e paralisação do consignado", "EBITDA corporativo negativo de R$36,1M no 4T25 (piora de 29%), com perdas de capital em investidas", "BMG Corretora teve queda de 7,6% no EBITDA trimestral para R$25,9M", "Wiz Corporate teve recuo de 25,1% no lucro líquido anual para R$25,1M devido a ajuste em remuneração de executivos", "Alienação da Wiz Concept por R$13,96M indica descarte de ativo não-core com baixa rentabilidade"], "result": "A Wiz apresentou um 4T25 sólido com desempenho misto: o segmento de seguros brilhou com recordes operacionais e forte crescimento (prêmios de R$4bi no ano, +11,7%), enquanto crédito/consórcios sofreu com cenário macro adverso (-15,4% no ano). Destaques para a Inter Seguros com crescimento explosivo de 90,8% na base de contratos e a drástica redução de 48,6% na dívida líquida. O lucro da controladora subiu 25,6% para R$201,1M, com proposta de dividendos de 50% do lucro sinalizando solidez financeira. A geração de caixa operacional de R$466,5M no ano confirma o modelo capital-leve da tese.", "sunoView": "A Suno Research recomenda COMPRA de WIZC3 com preço-teto de R$10,00 (atual R$8,88). A analista destaca que a Wiz atual é fundamentalmente diferente da empresa pré-Caixa e conseguiu recompor receitas através de parcerias estratégicas. Reconhece risco ligeiramente elevado, mas com potencial de retorno proporcional. O valuation de R$1,3-1,4bi embute cenário pessimista improvável dado o crescimento trimestral consistente em prêmios, crédito e consórcios. Considerada a melhor escolha da carteira Dividendos com diversas opcionalidades de retorno futuro.", "history": [{"quarter": "4T25", "result": "Lucro de R$49,6M (+28,6% a/a). Recorrente ~R$55M, acima do esperado.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "BBSE3", "name": "BB Seguridade", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 5.5, "thesis": "Empresa com modelo de negócio defensivo, exclusividade de distribuição no Banco do Brasil até 2033, alta rentabilidade (ROE elevado) e forte geração de dividendos. Beneficia-se de juros altos devido ao float e possui baixa necessidade de capital para crescimento.", "thesisPros": ["Performance financeira forte", "Exclusividade na distribuição através do Banco do Brasil até 2033", "Modelo de negócio altamente rentável com ROE extremamente elevado", "Forte distribuição de proventos (payout entre 80-100%)", "Negócio defensivo e resiliente mesmo em recessão", "Beneficia-se de juros elevados devido ao float", "Não precisa de capital para crescer", "Valuation atrativo com P/L de 8,3x para 2025 e dividend yield de 11-12,5%"], "thesisCons": ["Risco de não renovação ou piores condições no contrato de exclusividade após 2033", "Dependência do Banco do Brasil para distribuição", "Controle estatal pode trazer riscos de ingerência"], "resultPros": ["Resultados financeiros consolidados cresceram 80,9% vs 4T24, totalizando R$ 577 milhões", "Lucro líquido gerencial recorrente de R$ 2,29 bilhões, crescimento de 5,1% vs 4T24", "Benefício da Selic elevada nos ativos das subsidiárias", "Redução do custo do passivo da Brasilprev por deflação do IGP-M"], "resultCons": ["Emissão de prêmios da BrasilSeg caiu 11,5% vs 4T24 e 13,4% vs 3T25", "Contribuições de previdência da Brasilprev caíram 36,6% vs 4T24 devido ao IOF sobre VGBL", "Captação líquida negativa na Brasilprev afetando crescimento das reservas", "Arrecadação da Brasilcap caiu 20,4% vs 4T24", "Receitas de corretagem da BB Corretora em queda, especialmente previdência (-24,5%)", "Guidance 2026 prevê retração de 7% a 3% nos resultados operacionais não decorrentes de juros", "Despesas gerais e administrativas da holding aumentaram 30,1% vs 4T24"], "result": "Resultado neutro com performance financeira positiva impulsionada pela Selic elevada, mas limitada por retração operacional significativa. A menor emissão de prêmios (especialmente seguro rural devido a preços deprimidos de commodities) e o impacto negativo do IOF sobre planos VGBL afetaram as operações. Lucro líquido cresceu apenas 5,1% vs 4T24, mas caiu 10,8% vs 3T25.", "sunoView": "Mantém recomendação de compra com preço-teto de R$ 35,50. Empresa sólida e resiliente, mas com expectativa de piora em 2026 conforme guidance. Valuation atrativo e dividendos robustos compensam momento operacional pressionado.", "history": [{"quarter": "4T25", "result": "Mediano mas esperado.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "BBAS3", "name": "Banco do Brasil", "quarter": "4T25", "highlight": true, "sentiment": "negative", "rankScore": 2.5, "thesis": "Banco do Brasil é um dos maiores conglomerados financeiros do Brasil com forte capilaridade e acesso a funding barato. Apesar dos riscos de intervenção governamental, negocia a múltiplos atrativos (P/L 6-7x para 2026, 0,8x P/VP), com modelo de negócio resiliente baseado em agronegócio e pessoa física.", "thesisPros": ["Margem financeira bruta +3,8%", "Capital Principal 12,23%", "Marca forte e maior rede de distribuição física do Brasil com quase 4 mil agências", "Acesso privilegiado a depósitos baratos (funding via CDBs, depósitos judiciais e poupança)", "Maior gestora de recursos do país com R$ 1,7 trilhão sob gestão", "Capilaridade abrangente oferece vantagem competitiva inigualável sobre fintechs", "Valuation atrativo: 0,8x P/VP e P/L de 6-7x para 2026", "Receitas de serviços diversificadas e altamente escaláveis (gestão de ativos)", "Solidez financeira com Índice de Capital Principal de 12,23%"], "thesisCons": ["Provisionamento insuficiente", "Risco de intervenção governamental na administração (União detém 50% das ações)", "Sistema bancário brasileiro altamente oligopolizado sob pressão de fintechs e regulação", "Exposição relevante ao agronegócio sujeito a ciclos e inadimplência", "Modelo de negócio correlacionado ao CDI tanto em receitas quanto custos"], "resultPros": ["Margem financeira bruta cresceu 3,8% vs 4T24 e 5,4% vs 3T25, alcançando R$ 27,8 bilhões", "Spread global de 5% a.a. mesmo com alta da Selic", "Índice de Capital Principal sólido de 12,23% (vs 10,89% em 4T24)", "Margem com mercado cresceu 94,4% vs 3T25", "Recuperação de crédito com 78,5% à vista"], "resultCons": ["Lucro líquido ajustado caiu 40,1% vs 4T24 para R$ 5,74 bilhões devido a provisões elevadas", "Inadimplência acima de 90 dias disparou para 5,17% (vs 3,16% em 4T24), pior que concorrentes", "Índice de cobertura caiu para 155,4% (vs 209,5% em 4T24), abaixo de Itaú (250%) e Santander (194%)", "Custo de crédito subiu 93,9% vs 2024", "ROE ajustado despencou para 12,4% (vs 20,8% em 4T24)", "Receita de serviços caiu 3,9% vs 4T24", "Recuperação acumulada de crédito vem diminuindo trimestre a trimestre", "Provisionamento insuficiente segundo analista - risco de prejuízos futuros", "Guidance 2026 prevê lucro de R$ 22-26 bilhões, muito abaixo dos R$ 37,9 bilhões de 2024"], "result": "Resultado muito negativo no 4T25. Apesar do crescimento da margem financeira bruta, o banco sofreu forte deterioração na qualidade da carteira de crédito, especialmente em PF e agro. A inadimplência acima de 90 dias saltou para 5,17% enquanto o índice de cobertura caiu para 155,4%, abaixo de peers. O lucro de R$ 5,74 bilhões (-40,1% a/a) só foi positivo devido a provisionamento considerado insuficiente pelo analista e crédito fiscal. ROE despencou para 12,4%. A empresa não está conseguindo recuperar créditos nem reverter a tendência de deterioração.", "sunoView": "Mantém recomendação de COMPRA com preço-teto de R$ 25,00, mas com ressalvas importantes. Apesar do valuation atrativo e da solidez de capital, o analista alerta que o banco levará tempo para sanear a carteira problemática e que os próximos trimestres devem continuar difíceis. O guidance 2026 confirma pressão no lucro. A recomendação parece conservadora diante dos riscos crescentes.", "history": [{"quarter": "4T25", "result": "Muito negativo. Inadimplência disparando.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "UNIP6", "name": "Unipar", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 6, "thesis": "Maior produtora de cloro-soda da América do Sul.", "thesisPros": ["Camaçari plena capacidade"], "thesisCons": [], "resultPros": ["EBITDA recorrente +16%; margem 22%", "Energia renovável 68%", "R$1,3 bi em dividendos"], "resultCons": ["Prejuízo R$7M no 4T", "Alavancagem 2,20x"], "result": "Em linha. Motor do negócio intacto.", "sunoView": "Eficiência brilhou apesar do ciclo adverso.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "VALE3", "name": "Vale", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 8.5, "thesis": "Vale é uma das principais mineradoras do mundo com produção de baixo custo, exposição à economia asiática (principalmente China), forte geração de caixa e política generosa de distribuição de proventos. A empresa combina ativos de alta qualidade em minério de ferro com crescimento estrutural na divisão de Metais para Transição Energética.", "thesisPros": ["Maior produção desde 2018", "EBITDA proforma +17%", "Produtora de baixo custo global, rentável mesmo em cenários adversos de preços", "Minério de ferro de maior qualidade (maior teor) versus concorrentes", "Exposição à economia asiática (China e Índia) com demanda resiliente estrutural", "Diversificação da carteira sem correlação com economia brasileira", "Endividamento baixo e forte geração de caixa permitindo distribuição agressiva aos acionistas", "Divisão de Metais para Transição Energética (VBM) oferece margem de segurança e opcionalidade de crescimento", "Política consistente de dividendos e recompra de ações (US$ 48 bi distribuídos entre 2020-2024)"], "thesisCons": ["Alta exposição a commodities com volatilidade de preços", "Dependência do mercado chinês (cerca de 80% da receita do minério de ferro)", "Passivos ambientais relevantes (Mariana, Brumadinho, Samarco)", "Risco de novos acidentes com barragens apesar de programa de descomissionamento", "Setor de difícil previsibilidade ligado a ciclos econômicos globais"], "resultPros": ["Volumes recordes: produção de minério e cobre nos maiores níveis desde 2018", "EBITDA proforma de US$ 4,83 bi no 4T25 (+17% a/a), totalizando US$ 15,8 bi em 2025", "Fluxo de Caixa Livre recorrente saltou para US$ 1,7 bi no trimestre (+US$ 900 mi a/a)", "Todos os guidances anuais atingidos ou superados", "Segundo ano consecutivo de redução no custo caixa (C1 de US$ 21,3/t, -2% a/a em 2025)", "VBM (Metais Básicos) com EBITDA +157% a/a, atingindo US$ 1,39 bi - protagonista do trimestre", "Custo all-in do cobre negativo em US$ 881/t devido a subprodutos (ouro)", "Dívida líquida reduzida em US$ 1 bi no trimestre, encerrando em US$ 15,6 bi", "Dividendos e JCP de US$ 1,8 bi anunciados para março/2026, além de US$ 1 bi extraordinário já pago em janeiro", "Alavancagem confortável de 1,2x (Dívida/EBITDA 12M)", "Lucro líquido proforma de US$ 1,46 bi (+68% a/a) ao excluir eventos não recorrentes"], "resultCons": ["Prejuízo líquido contábil de US$ 3,84 bi no 4T25 devido a ajustes não-caixa", "Impairment de US$ 3,5 bi nos ativos de níquel no Canadá", "Baixa de impostos diferidos de US$ 2,8 bi", "Provisionamento adicional de US$ 449 mi para obrigações da Samarco (Ação Reino Unido)", "Custo C1 pontualmente subiu para US$ 21,3/t no 4T25 (+13% a/a) por manutenções preventivas", "Prêmio all-in recuou para US$ 0,9/t pressionado por mix de produtos"], "result": "Resultado operacional excepcional com volumes recordes, forte geração de caixa (FCF de US$ 1,7 bi) e EBITDA crescendo 17% a/a. A divisão de Metais Básicos foi destaque com EBITDA +157%. O prejuízo contábil de US$ 3,84 bi decorre exclusivamente de ajustes não-caixa (impairments e provisões). Lucro proforma ajustado foi de US$ 1,46 bi (+68% a/a), refletindo a verdadeira capacidade de geração de valor.", "sunoView": "Recomendação de COMPRA mantida com preço-teto de R$ 78,00. O ruído contábil do 4T25 não afeta a tese. A operação demonstra alta eficiência, disciplina de capital e forte geração de caixa (US$ 5,6 bi de FCF em 2025). O turnaround da VBM já é realidade e oferece margem de segurança subprecificada. Valuation atrativo combinado com yield de duplo dígito em proventos e controle de passivos bem executado reforçam a convicção.", "history": [{"quarter": "4T25", "result": "Forte operação ofuscada por ajustes contábeis.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "PETR4", "name": "Petrobras", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 7.5, "thesis": "Petrobras é uma petroleira estatal brasileira com foco crescente em E&P, especialmente no pré-sal, que oferece custo de extração extremamente competitivo globalmente. Apesar de riscos de governança e mudanças políticas recentes (fim da PPI, alteração na política de dividendos), a empresa negocia com margem de segurança relevante e mantém capacidade de gerar dividendos superiores a 10% ao ano.", "thesisPros": ["Lucro recorrente R$100,9 bi", "Produção +11%; exportação recorde", "Custo de extração ultra-competitivo no pré-sal (US$ 4,19/boe em 2025), entre os menores do mundo", "Pré-sal representa mais de 80% da produção, com petróleo de maior qualidade (leve e menos enxofre)", "Foco estratégico em E&P, segmento de maior rentabilidade (80% do lucro líquido)", "Geração de caixa operacional robusta de R$ 200 bilhões/ano", "Free cash flow yield de aproximadamente 20%, altamente atrativo", "Capacidade de absorver choques de preço do Brent mantendo geração de valor"], "thesisCons": ["Riscos de governança inerentes a uma estatal", "Fim da Política de Paridade de Preços Internacionais (PPI)", "Mudança na política de remuneração aos acionistas", "Fim dos desinvestimentos de ativos menos produtivos", "Não distribuição de dividendos extraordinários", "Possíveis investimentos em setores menos rentáveis no futuro"], "resultPros": ["Produção recorde de petróleo cresceu 11% no ano, com exportações atingindo 999 mil barris/dia no 4T25", "EBITDA de R$ 244,3 bilhões em 2025 praticamente estável (-0,6%) apesar de queda de 14% no Brent", "Receita resiliente de R$ 127,4 bilhões no 4T25, +5% vs 4T24 mesmo com Brent mais baixo", "Lucro líquido recorrente de R$ 100,9 bilhões em 2025, queda modesta de apenas 2%", "Três novos FPSOs entraram em operação em 2025, adicionando 585 mil barris/dia de capacidade", "Margem EBITDA saudável de 47% no trimestre", "Fluxo de caixa operacional de R$ 54,9 bilhões no 4T25 (+15,2% vs 4T24)"], "resultCons": ["Brent médio caiu 14,7% no ano, pressionando receitas", "CapEx elevado de US$ 20,3 bilhões em 2025 (+22,2% vs 2024), 9,7% acima do planejado", "Fluxo de caixa livre caiu 26,1% no ano para R$ 91,6 bilhões devido ao alto CapEx", "Dívida líquida subiu 16% para US$ 60,6 bilhões, com alavancagem em 1,42x (vs 1,29x em dez/24)", "Dividendos totais de R$ 45,2 bilhões em 2025, significativamente abaixo dos R$ 100,3 bilhões de 2024", "Lucro bruto do E&P recuou 20,5% no trimestre"], "result": "Resultado acima das expectativas. Apesar do ambiente desafiador com Brent caindo 14% no ano, a Petrobras demonstrou resiliência excepcional através do crescimento de 11% na produção e eficiência operacional do pré-sal. A companhia manteve EBITDA praticamente estável em R$ 244 bilhões e gerou R$ 200 bilhões em caixa operacional, provando sua capacidade de absorver choques de preço. Pontos de atenção incluem o CapEx elevado (acima do guidance) e o aumento da alavancagem para 1,42x, embora em níveis ainda controlados.", "sunoView": "Recomendação de COMPRA mantida com preço-teto REVISADO PARA CIMA para R$ 38,00 (anteriormente não especificado), com valor justo estimado em R$ 54,00. Analistas destacam margem de segurança de 30% e potencial de dividendos acima de 10% ao ano. Resultados acima do esperado reforçam a tese de uma petroleira de baixo custo, geradora de caixa e com visibilidade de crescimento, mesmo diante dos riscos de governança.", "history": [{"quarter": "2025", "result": "Resiliência com Brent -14%.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "AXIA6", "name": "Axia Energia", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 7, "thesis": "Axia Energia (ex-Eletrobras) é a maior geradora do Brasil com 25% da capacidade instalada (45,8 GW) e maior transmissora da América Latina (72,6 mil km). Portfólio equilibrado entre geração (71% receita) e transmissão (29% receita), com matriz 97% renovável. Contratos de longo prazo indexados à inflação garantem previsibilidade e resiliência. Preço justo de R$ 54,70 com margem de segurança de 20% (preço-teto R$ 43,80).", "thesisPros": ["EBITDA +12,9%; margem 53,2%", "Custos -19,6%", "Maior geradora do Brasil (25% capacidade instalada) e maior transmissora da América Latina", "Excelente equilíbrio entre geração (63% EBITDA) e transmissão (37% EBITDA) aumenta diversificação e resiliência", "Contratos de longo prazo com reajuste inflacionário (IPCA/IGP-M) garantem previsibilidade e proteção", "Prazo médio ponderado de 24 anos em geração e 18 anos em transmissão", "Matriz 97% renovável (92% hídrica) com baixa emissão de GEE", "Forte geração de caixa: FCL yield de 7% real", "Migração de contratos de cotas para mercado livre deve adicionar R$ 3,5 bi anuais de receita até 2027", "RAP incremental de R$ 1,9 bi em transmissão com projetos em implantação", "Alavancagem saudável de 2x Dívida Líquida/EBITDA"], "thesisCons": ["Dependência de fatores hidrológicos pode afetar geração", "Exposição a riscos regulatórios do setor elétrico brasileiro", "Ainda em processo de captura de eficiências pós-privatização", "Parte dos contratos (cotas) ainda mal remunerados a R$ 90/MWh"], "resultPros": ["EBITDA ajustado de R$ 5,7 bi (+12,9% vs 4T24) apesar de receita fraca, impulsionado por ganhos de eficiência", "Margem EBITDA ajustada expandiu 8,2 p.p. para 55,6% no ano (+2,2 p.p.)", "Custos operacionais caíram 19,6% no trimestre para R$ 4,6 bi", "Lucro líquido ajustado de R$ 2,1 bi (+72,3% vs 4T24)", "FCL normalizado de R$ 3,1 bi (+29,1%), anualizando em yield de 7% real", "Resultado financeiro melhorou 21,3%", "Equivalência patrimonial forte em R$ 470 mi (+28,8%)"], "resultCons": ["Receita líquida de R$ 9,9 bi (-5,5% vs 4T24), totalizando R$ 39,3 bi no ano (-2,7%)", "EBITDA ajustado anual de R$ 23 bi (-2,3% vs 2024)", "Dívida líquida aumentou 23,4% para R$ 46,5 bi (ainda saudável em 2x EBITDA)", "Ainda opera com 2,6 GW em cotas mal remuneradas"], "result": "Trimestre positivo com forte expansão de margem (+8,2 p.p.) e lucro (+72,3%), demonstrando captura de eficiências pós-privatização. Geração de caixa robuста (+29,1%) compensa queda de receita. Alavancagem controlada e visibilidade de crescimento com migração para mercado livre.", "sunoView": "Recomendação de compra mantida. Assimetria positiva no patamar atual de preço (R$ 63,95 vs preço justo R$ 54,70), com margem de segurança adicional de 20% (preço-teto R$ 43,80). Empresa entrega previsibilidade sem depender de grandes feitos da gestão. FCL yield real de 7% + crescimento contratado justificam posição.", "history": [{"quarter": "4T25", "result": "Eficiência impulsionando resultados.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "TUPY3", "name": "Tupy", "quarter": "4T25", "highlight": true, "sentiment": "negative", "rankScore": 2, "thesis": "Transformação de fabricante de blocos e cabeçotes para player global de motores de combustão, com agregação de valor via usinagem e pré-montagem através das aquisições da MWM e Teksid. Foco em veículos pesados, máquinas agrícolas e de construção, segmentos com eletrificação mais lenta.", "thesisPros": ["Caixa operacional R$915M", "MWM: EBITDA 10%", "Integração de novas unidades de negócios gerando margens melhores", "Setor já começa a dar sinais de recuperação em 2025", "Potencial de melhoria na geração de caixa operacional", "Agregação de valor com produtos usinados e pré-montados após aquisições da MWM e Teksid", "Crescimento no segmento de peças de reposição (aftermarket) com margens melhores", "Diversificação geográfica com plantas em três continentes e capacidade produtiva de 960 mil ton/ano", "Exposição a veículos pesados e máquinas agrícolas com eletrificação mais lenta", "Valuation atrativo com FCF yield de aproximadamente 25%", "Opcionalidade positiva com iniciativas de energia e descarbonização da MWM", "Forte geração de caixa operacional histórica"], "thesisCons": ["Setor de fundição e usinagem passa por cenário conjuntural adverso", "Exposição a demanda global por veículos comerciais e máquinas pesadas", "Vulnerabilidade a incertezas tarifárias globais", "Necessidade de desalavancagem do balanço", "Risco de eletrificação de veículos no longo prazo", "Ciclicidade do setor automotivo", "Poder de barganha das montadoras pressiona margens", "Dependência do mercado norte-americano (41% da receita)", "Setor de margens apertadas com alta sensibilidade à utilização de capacidade"], "resultPros": ["Segunda maior geração de caixa operacional da história com R$ 915 milhões em 2025", "Gestão agressiva de capital de giro consumindo estoques", "Redução nominal da dívida líquida em 5% para R$ 2,2 bilhões", "63% da dívida com vencimento após 2031, dando fôlego financeiro", "MWM apresentou margem EBITDA de 10% com crescimento de dois dígitos em peças de reposição", "Expectativa de captura de R$ 100 milhões em ganhos de EBITDA com reestruturação e R$ 600 milhões em receitas de novos projetos para 2026"], "resultCons": ["Receita líquida de R$ 9,7 bilhões em 2025, queda de 9% vs 2024", "Redução de 10% nos volumes vendidos, especialmente em componentes estruturais", "Receita do 4T25 de R$ 2,1 bilhões, recuo de 12,4% anual", "EBITDA ajustado de apenas R$ 39 milhões no 4T25, queda de 84% vs 4T24", "EBITDA anual caiu 48,9% em 2025", "Prejuízo líquido de R$ 627 milhões no 4T25 (vs -R$ 98 milhões no 4T24)", "Alavancagem financeira subiu para 3,35x dívida líquida/EBITDA, limitando novos investimentos", "Desalavancagem operacional severa com queda de volumes", "Impacto negativo de tarifas norte-americanas reduzindo confiança e postergando renovação de frotas", "Ambiente doméstico desafiador com juros elevados, inadimplência recorde e agronegócio fraco"], "result": "Resultado extremamente fraco no 4T25 e 2025, com quedas expressivas de receita (-9% no ano, -12,4% no trimestre) e colapso do EBITDA (-84% no 4T25). Prejuízo líquido de R$ 627 milhões impactado por não recorrentes. Apesar disso, forte geração de caixa de R$ 915 milhões via gestão de capital de giro, mas alavancagem subiu para 3,35x.", "sunoView": "A Suno mantém recomendação de compra até R$ 21,00 (preço justo R$ 26,20). Apesar do ano desafiador de 2025, destacam a forte geração de caixa, redução nominal da dívida e perfil de vencimento favorável. Projetam recuperação gradual em 2026 com captura de sinergias e novos projetos. Conservadorismo no valuation exclui potencial de energia/descarbonização da MWM.", "history": [{"quarter": "4T25", "result": "Ano extremamente desafiador.", "date": ""}, {"quarter": "4T25", "result": "Ano extremamente desafiador.", "date": "2026-03-25"}], "lastUpdated": "2026-03-27"},
      {"ticker": "ITSA4", "name": "Itaúsa", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 8, "thesis": "Holding do Itaú (~95% resultado). Não financeiro amadurecendo.", "thesisPros": ["Lucro recorde R$16,5 bi (+11,5%)", "Itaú eficiência 36,9%"], "thesisCons": ["Dexco pressionada"], "resultPros": ["Lucro recorde R$16,5 bi (+11,5%)", "Itaú eficiência 36,9%", "Não financeiro +42%", "Dívida -30%"], "resultCons": ["Desconto holding 23,8%"], "result": "Maior resultado da história.", "sunoView": "Positiva — diversificação e desalavancagem.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "SLCE3", "name": "SLC Agrícola", "quarter": "", "highlight": false, "sentiment": "positive", "rankScore": 7, "thesis": "A SLC Agrícola é a maior produtora individual de grãos e fibras do Brasil, com vantagens competitivas estruturais em escala, produtividade e diversificação. A empresa opera em modelo asset light, possui excelência operacional e está posicionada no epicentro do crescimento global de demanda por alimentos. Negocia a preços que não refletem a qualidade do negócio, com earnings yield de 12%.", "thesisPros": ["Maior produtora individual de grãos e fibras do país com 836 mil hectares", "Modelo asset light que impulsionou o ROIC e libera capital", "Diversificação resiliente: três culturas, oito estados, duas safras por ano", "Rating de crédito brAA (S&P) e AA.br (Moody's)", "Listada no Novo Mercado desde 2007 com excelente governança corporativa"], "thesisCons": ["Ciclicidade de preços de commodities agrícolas afeta margens", "Risco de execução das aquisições recentes (Sierentz Agro, Agrícola Xingú)", "Risco climático inerente à atividade agrícola", "Poder de barganha limitado com fornecedores de sementes e biotecnologia (oligopólio global)", "Opera como price taker em mercado de commodities", "Gargalos logísticos e déficit estrutural de armazenagem no Brasil"], "resultPros": ["Produtividade 14% superior à média nacional na soja, 29% no milho e 129% acima da média mundial no algodão", "Gestão profissional com 80 anos de experiência e controlador alinhado (55% das ações)", "Exposição ao vento de cauda secular: 41% do crescimento global de grãos virá do Brasil segundo USDA", "Valor justo estimado em R$ 24,20 por ação com dividend yield projetado de 6%", "NAV das terras indica R$ 30,88 por ação", "Práticas ESG robustas: 35,9% de mata nativa preservada, meta de carbono neutro até 2030"], "resultCons": ["Alavancagem elevada de 2x (dívida líquida/EBITDA), acima do conforto histórico", "Dependência de fertilizantes importados (Brasil importa mais de 85% do que consome)"], "result": "A empresa apresentou crescimento exponencial com CAGR de receita de 19% ao ano, saindo de R$ 588 milhões em 2009 para quase R$ 10 bilhões projetados para 2025. O lucro bruto teve CAGR de 24,7% no período. A companhia mantém rentabilidade sólida com ROE médio de 20% nos últimos 5 anos e ROIC crescente devido à estratégia asset light. Dividend yield médio de 5% nos últimos cinco anos, com projeção de 5,6% para 2026.", "sunoView": "A SLC Agrícola é uma das recomendações da carteira Dividendos da Suno Research, com preço-teto de R$ 20,40 para aportes. O valuation por owners earnings normalizado aponta valor justo de R$ 24,20 por ação. A empresa negocia com earnings yield de 12%, como se fosse um negócio ordinário, quando na verdade possui qualidade superior. O mercado precifica em excesso os riscos de alavancagem e ciclicidade. Trata-se de oportunidade para investidor paciente construir posição em momentos de fraqueza.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "EGIE3", "name": "Engie Brasil", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 5, "thesis": "Elétrica com posicionamento defensivo, concessões com prazo médio de 17 anos, 100% matriz renovável, disciplina na alocação de capital e geração de caixa recorrente. Tese conservadora sem contar com renovações ou preços elevados de energia.", "thesisPros": ["Prazo médio ponderado de concessões de 17 anos sem vencimentos até 2030", "Portfolio 100% renovável (71% hidro, 19% eólica, 9% solar, 1% biomassa)", "Segunda maior geradora do Brasil com 9,1 GW de capacidade instalada", "Diversificação com transmissão (R$ 1,3 bi de RAP) e participação de 17,5% na TAG", "Histórico de disciplina na alocação de capital", "Receitas indexadas à inflação (IPCA) com reajustes anuais", "FCF yield normalizado de 12% (real) do valor de mercado"], "thesisCons": ["Crescimento limitado após conclusão do ciclo atual de investimentos", "Exposição a riscos regulatórios do setor elétrico", "Depende de novas oportunidades para sustentar crescimento futuro"], "resultPros": ["Receita líquida ajustada cresceu 6,3% no 4T25 (R$ 3,1 bi) e 5,9% em 2025 (R$ 11,4 bi)", "Entrada em operação de novos ativos: Serra do Assuruá, Assú Sol, Santo Antônio do Jari e Cachoeira Caldeirão", "CapEx de expansão retraiu 74,3%, indicando fim do ciclo de investimentos pesados", "Geração de caixa livre normalizada de R$ 4,5 bi anualizados", "Trechos de transmissão de Graúna e Asa Branca iniciaram operações"], "resultCons": ["Preço médio da energia caiu 6,3% (R$ 211/MWh)", "Custos e despesas operacionais subiram 9,3%", "Margem EBITDA ajustada recuou 1,2 p.p. para 57,2% no trimestre", "Lucro líquido ajustado despencou 32,5% no 4T25 e 14,3% em 2025", "Resultado financeiro pressionou 44,3% (R$ 645 mi negativos)", "Dívida líquida saltou 26,8% para R$ 25,5 bi, com alavancagem de 2,7x para 3,3x DL/EBITDA", "Contribuição da TAG caiu 28,8%"], "result": "Resultado misto com crescimento de receita de 6,3% impulsionado por novos ativos, mas lucro líquido ajustado caiu 32,5% no trimestre devido a pressões de custos (+9,3%), resultado financeiro (+44,3%) e menor contribuição da TAG (-28,8%). Destaque positivo para geração de caixa normalizada robusta e conclusão do ciclo de investimentos.", "sunoView": "Preço justo de R$ 31,80 e preço-teto para aportes em R$ 28,60. Dividend yield esperado de 7,3% com expectativa de retorno ao payout de 100%. Tese defensiva mantida, com foco em proteção contra riscos através de premissas conservadoras. Geração de caixa sólida compensa resultado contábil mais fraco.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "AGRO3", "name": "BrasilAgro", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 4.5, "thesis": "BrasilAgro atua na aquisição, desenvolvimento, exploração e comercialização de propriedades rurais, entregando ROIC médio satisfatório através de gestão ativa do portfólio de terras. A empresa transforma fazendas subutilizadas em propriedades produtivas de alto valor, gerando receita tanto da operação agrícola quanto da valorização e venda dos ativos imobiliários.", "thesisPros": ["Histórico de boas alocações de capital com taxas de retorno atraentes nas transações de compra e venda de propriedades", "Portfólio diversificado com 21 fazendas e 252 mil hectares em múltiplas regiões (MT, MG, MA, BA, PI, Paraguai e Bolívia)", "Estratégia de mitigação de riscos climáticos e de preço através da diversificação geográfica e de culturas", "Fundamentos de longo prazo positivos para commodities agrícolas impulsionados por crescimento populacional e aumento do PIB per capita", "Asset value estimado em R$ 3,4 bilhões ou R$ 33,11 por ação, oferecendo margem de segurança ao preço-teto de R$ 27,50"], "thesisCons": ["Setor agro passando por pressão nas margens devido à queda nos preços das commodities", "Riscos climáticos inerentes à atividade agrícola", "Concentração de clientes (vendas principalmente para tradings)", "Volatilidade dos preços das commodities agrícolas afeta diretamente os resultados"], "resultPros": ["Receita líquida operacional de R$ 191 milhões no 4T25, crescimento de 25% ano contra ano", "Forte desempenho em grãos: soja cresceu 33% e milho apresentou salto expressivo de receita", "Comercialização estratégica de estoques aproveitando janelas de preços favoráveis", "Foco em investimentos para transformação de áreas e expansão da irrigação para ganhos de produtividade futuros", "Resiliência operacional apesar do cenário macroeconômico desafiador"], "resultCons": ["Prejuízo acumulado de R$ 61 milhões no semestre (6M26)", "Queda acentuada no resultado consolidado do semestre por ausência de venda de fazendas", "Cana-de-açúcar com queda de 31% na receita semestral devido a menores volumes e redução de produtividade", "Resultado financeiro negativo pressionado por altos juros e volatilidade cambial", "Dívida líquida de R$ 812 milhões, 12% superior ao mesmo período do ano anterior"], "result": "A BrasilAgro apresentou resultados mistos no 4T25, com forte crescimento de receita (+25%) impulsionado pela comercialização estratégica de estoques de grãos, mas registrou prejuízo semestral de R$ 61 milhões devido à ausência de vendas de fazendas, pressão na cana-de-açúcar e resultado financeiro negativo. Operacionalmente, grãos foram destaque positivo (soja +33%), enquanto cana sofreu com queda de 31% na receita. A dívida líquida aumentou 12% para R$ 812 milhões.", "sunoView": "Recomendação de compra até o preço-teto de R$ 27,50. Apesar do prejuízo contábil no semestre, a empresa demonstra resiliência operacional e está bem posicionada, especialmente em grãos. A administração projeta melhora nas margens para o segundo semestre do ano-safra. O asset value estimado em R$ 33,11 por ação oferece margem de segurança apropriada no preço-teto estabelecido.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "SEER3", "name": "Ser Educacional", "quarter": "4T25", "highlight": true, "sentiment": "positive", "rankScore": 8.5, "thesis": "Companhia com longo histórico em setor maduro e gerador de caixa. Principal atrativo é o preço baixo (3x EV/EBITDA, 5x P/L) e potencial de dividendos (DY ~8%). Crescimento esperado de 6% no EBITDA em 5 anos, impulsionado pela maturação de 881 vagas de Medicina (margens de 50-55% vs 20% dos demais cursos). Foco estratégico em cursos de saúde com maior tíquete e menor evasão.", "thesisPros": ["Vertical de Medicina altamente rentável (margens EBITDA 50-55%) com altas barreiras de entrada regulatórias (ADC 81)", "881 vagas anuais de Medicina em operação com crescimento contratado e previsível via maturação ao longo de 6 anos", "Forte reconhecimento de marcas regionais (UNINASSAU líder Top of Mind em Recife, UNAMA no Pará, UNINORTE no Amazonas)", "Múltiplos atrativos: 3x EV/EBITDA, 5x P/L e dividend yield projetado de 8% para 2026", "Lucro operacional historicamente resiliente apesar de choques macroeconômicos", "Controle familiar consolidado (59% do capital votante) com gestão experiente desde 2008", "Foco estratégico em cursos de saúde (65% da base presencial) com menor evasão e maior tíquete", "Alavancagem operacional consistente com diluição de custos fixos", "Expansão estrutural da base de alunos no ensino híbrido de saúde", "Modelo de negócio com forte capacidade de geração de caixa", "Estratégia focada em cursos de medicina com tickets maiores"], "thesisCons": ["Crescimento limitado em setor maduro (projeção de apenas 6% de crescimento do EBITDA em 5 anos)", "Risco de sobreoferta de médicos reduzir interesse e pressionar mensalidades no longo prazo", "Ambiente altamente regulado pelo MEC sujeito a mudanças abruptas de regras", "Incertezas jurídicas sobre vagas operando com liminares (Rio de Janeiro e Belo Horizonte foram suspensas em fev/2025)", "Exposição a programas federais (FIES, PROUNI) que podem afetar captação de alunos", "Competição fragmentada com milhares de instituições locais e regionais", "Brasil não atingiu metas do PNE 2024 (taxa líquida 27,1% vs meta 33%), indicando gargalos estruturais no setor", "Exposição ao ciclo econômico que afeta capacidade de pagamento dos alunos", "Dependência de programas governamentais como PROUNI", "Setor educacional competitivo com pressão sobre preços"], "resultPros": ["Receita líquida cresceu 9,4% no trimestre e 11,8% no ano, atingindo R$ 2,2 bilhões", "Base de alunos híbridos cresceu +10%, chegando a 182 mil alunos", "Ticket médio ex-PROUNI subiu 6% no semestre", "EBITDA ajustado avançou 22,8% com margem de 26,3% (+3 p.p.)", "Lucro líquido ajustado mais que dobrou: R$ 77 milhões no trimestre e R$ 239 milhões no ano", "Geração operacional de caixa pós-capex recorde de R$ 289 milhões em 12 meses (conversão >50%)", "PDD caiu de 12,5% para 8,6% da receita líquida", "Inadimplência melhorou significativamente", "Dívida líquida caiu quase 30%", "Dívida líquida/EBITDA de 0,9x, melhor nível desde 2021", "Aprovados R$ 61 milhões em dividendos"], "resultCons": [], "result": "Resultado muito forte e acima das expectativas. Empresa entregou evolução consistente em todas as linhas, com destaque para geração de caixa recorde e desalavancagem expressiva. Combinação vencedora de crescimento de receita, expansão de margem e melhora estrutural no capital de giro.", "sunoView": "Trimestre excepcional que valida a tese de recuperação operacional da Ser Educacional. A empresa superou significativamente expectativas, especialmente em geração de caixa e lucratividade. O ciclo de desalavancagem está praticamente completo e a companhia entra 2026 em posição financeira muito sólida.", "history": [], "lastUpdated": "2026-03-27"}
    ],
    Valor: [
      {"ticker": "B3SA3", "name": "B3", "quarter": "4T25", "highlight": true, "sentiment": "positive", "rankScore": 8.5, "thesis": "A B3 é uma das empresas mais resilientes e rentáveis do Brasil, com modelo de negócio monopolista no mercado de capitais brasileiro. Possui alta alavancagem operacional, cresce sem necessidade de capital investido e opera com payout próximo de 100%. É beneficiada pelo amadurecimento estrutural do mercado de capitais brasileiro e pela migração de investidores para renda variável.", "thesisPros": ["Modelo de negócio resiliente e altamente lucrativo mesmo em cenários adversos", "Crescimento sem necessidade de capital investido (alta alavancagem operacional)", "Monopólio de fato no mercado de capitais brasileiro", "Base de dados valiosa com potencial de monetização"], "thesisCons": ["Risco de perda de monopólio com a entrada da nova bolsa do Rio de Janeiro (ATS)", "Dependência do cenário macroeconômico (juros altos prejudicam renda variável)", "Vulnerabilidade a mudanças regulatórias", "Risco cibernético", "Concorrência com bolsas estrangeiras (NYSE, Nasdaq)"], "resultPros": ["Lucro recorrente +25,3%", "Receita +10,6%; Renda Fixa +34%", "Margem EBITDA 69%", "Payout 137%", "Margens elevadas (EBIT 66%, líquida 46% em 2025)", "Excelente pagadora de dividendos com payout de 137% em 2025", "Distribuiu R$ 6,3 bilhões aos acionistas em 2025 (JCP + recompras)", "Receitas recorrentes cresceram 23,2% no 4T25", "Forte tendência de crescimento do mercado de capitais brasileiro (apenas 3% da população investe na bolsa)", "Endividamento saudável (2x EBITDA)"], "resultCons": ["Lucro contábil -23%", "ADV derivativos -6,8%", "Contingências judiciais elevadas (R$ 45,2 bilhões em ações do MPF e R$ 5,3 bilhões em questões tributárias)", "Lucro líquido reportado caiu 23% no 4T25 por efeito contábil de R$ 1 bilhão"], "result": "A B3 reportou resultados sólidos no 4T25 com receita total de R$ 3 bilhões (+10,6% a/a). O destaque foi o crescimento de 23,2% nas receitas recorrentes vs. apenas 2% nas pró-cíclicas, demonstrando resiliência. EBITDA recorrente foi R$ 1,8 bilhão (+14,5%) com margem de 69%. Lucro líquido reportado caiu 23% para R$ 907,8 milhões devido a efeito contábil negativo de R$ 1 bilhão (sem efeito caixa). Excluindo não recorrentes, lucro ajustado atingiu R$ 1,5 bilhão (+25,3%). Distribuiu R$ 6,3 bilhões em 2025 (payout 137%). Despesas ajustadas cresceram apenas 4,7%, mostrando disciplina e alavancagem operacional.", "sunoView": "Recomendação de COMPRA até o preço-teto de R$ 16,90. A Suno considera a B3 uma empresa de qualidade excepcional, com vantagens competitivas duráveis e geração de caixa extraordinária. O preço-teto incorpora margem de segurança de 15% e considera as contingências judiciais. O valuation aponta valor justo de R$ 20,00 por ação antes de ajustes por contingências. A empresa consegue crescer 6% ao ano de forma sustentável mantendo payout de 90%.", "history": [{"quarter": "4T25", "result": "Excelente. Diversificação funcionando.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "KLBN4", "name": "Klabin", "quarter": "4T25", "highlight": false, "sentiment": "negative", "rankScore": 4, "thesis": "Maior produtora de papéis para embalagens.", "thesisPros": ["Alavancagem USD 3,9x para 3,3x"], "thesisCons": [], "resultPros": ["EBITDA estável apesar de 2 paradas", "Custo/ton -7%"], "resultCons": ["Receita -2%", "Lucro -80% (não caixa)", "Celulose -15%"], "result": "Pressionado por paradas e câmbio.", "sunoView": "Compra com teto R$5,60.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "TTEN3", "name": "3tentos", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 8, "thesis": "Ecossistema verticalizado no agro.", "thesisPros": ["Lucro recorde R$808,7M", "Receita +28,1%"], "thesisCons": [], "resultPros": ["Lucro recorde R$808,7M", "Receita +28,1%", "Grãos +60,7%", "Insumos 2026 já +36%"], "resultCons": ["Indústria: lucro -40,3%", "Capex R$1,7 bi"], "result": "Força operacional e financeira.", "sunoView": "Porto seguro de crescimento no agro.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "PRIO3", "name": "PRIO SA", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 6.5, "thesis": "A PRIO é especializada na revitalização de campos offshore maduros, sendo o maior player privado brasileiro neste segmento. A tese se baseia em três pilares: (1) eficiência extraordinária com menor lifting cost que grandes petroleiras internacionais e Petrobras; (2) expectativa de grande aumento de produção com Albacora Leste, Wahoo e Peregrino; (3) governança alinhada ao acionista com 80% da remuneração da diretoria em ações.", "thesisPros": ["Wahoo iminente", "Menor lifting cost entre junior oils e abaixo de grandes petroleiras internacionais e Petrobras", "Track record comprovado de revitalização de campos maduros (case Frade dobrou reservas provadas desde 2019)"], "thesisCons": [], "resultPros": ["Produção +45,1% t/t", "Receita +20%", "Campo de Wahoo com custo operacional muito baixo de US$ 1/barril devido ao tieback com Frade", "Aquisição de 100% de Peregrino concluída, aumentando produção em 47% e trazendo sinergias", "Governança alinhada: 80% da remuneração dos gestores é variável e em ações", "Dívida com custo médio de 6,36% ao ano e alavancagem saudável de 2,3x Dívida Líquida/EBITDA", "Produção média bruta cresceu 45,1% no 4T25 vs 3T25 e 27% no ano vs 2024"], "resultCons": ["Prejuízo US$185M", "Lucro -77%", "Custo +13%", "Produção de Frade caiu 22,3% no 4T25 vs 4T24 e 28% no ano devido ao declínio natural do campo", "Brent médio caiu 14,6% em 2025, impactando receitas", "Lifting cost subiu 13% no 4T25 para US$ 12,5/bbl devido à interdição do FPSO Peregrino", "Prejuízo líquido de US$ 185 milhões no 4T25 por maior depreciação e piora no resultado financeiro", "Lucro líquido anual caiu 77% em 2025 vs 2024", "Fluxo de caixa operacional reduziu de US$ 1,6 bi em 2024 para US$ 1,3 bi em 2025", "Dívida líquida aumentou US$ 1,489 bilhão no trimestre devido à aquisição de Peregrino"], "result": "No 4T25, a PRIO apresentou produção média de 127.944 bbl/dia (+45,1% vs 3T25), impulsionada pela conclusão da aquisição de Peregrino. A receita líquida foi de US$ 586,2 milhões (+20% vs 4T24). O EBITDA ajustado trimestral foi de US$ 341 milhões (+6% vs 4T24), mas o anual de US$ 1,4 bilhão caiu 17% vs 2024. A empresa registrou prejuízo líquido de US$ 185 milhões no trimestre devido a maior depreciação por Peregrino e piora no resultado financeiro. O lifting cost subiu para US$ 12,5/bbl. A dívida líquida/EBITDA está em 2,3x, ainda em patamar saudável.", "sunoView": "Os resultados estão dentro do esperado considerando a transição com Peregrino. A partir de agora, a empresa deve mostrar melhores resultados com esses problemas ficando no passado e com o início de Wahoo. A tese de longo prazo continua focada na geração de caixa relevante. Recomendação de compra mantida com preço-teto de R$ 62,75 (cotação atual R$ 66,89, acima do teto).", "history": [{"quarter": "4T25", "result": "Dentro do esperado na transição.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "BRBI11", "name": "BR Advisory Partners Participações S.A.", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 6, "thesis": "BR Partners é um banco de investimento independente de alta qualidade que combina crescimento com distribuição de dividendos. Opera em segmentos intensivos em pessoal mas não em capital, permitindo distribuir a maior parte do resultado mantendo crescimento relevante. Negocia a P/L atraente de 9x com alta rentabilidade sobre PL. Executivos experientes e alinhados com minoritários, sendo assessor das maiores empresas do Brasil.", "thesisPros": ["ROAE 22,1%", "Despesas -12,6%", "Banco independente sem conflitos de interesse dos grandes conglomerados financeiros", "Alta rentabilidade sobre patrimônio líquido (ROAE de 22,1% em 2025)", "Forte geração de caixa e distribuição de dividendos", "Executivos experientes e alinhados com minoritários", "Diversificação de receitas além de M&A (Mercado de Capitais, Treasury, Wealth)", "Crescimento expressivo em emissões: de R$860M (2017) para R$9,8B (2025) - CAGR de 35,5%", "Valuation atraente: P/L de 9x", "Forte marca e reputação no mercado"], "thesisCons": ["Receita concentrada em Investment Banking, segmento cíclico e sensível a juros", "Volatilidade das ações por ser empresa de crescimento", "Dependência de relacionamento e reputação dos executivos-chave", "Negócio intensivo em pessoal", "Exposição a risco de crédito ao reter títulos em garantia firme"], "resultPros": ["Segmento de Wealth Management cresceu 31,4% em receita", "Treasury Sales manteve-se estável (-1,9%) apesar do cenário difícil", "Redução relevante de despesas em 12,6%, com eficiência mantida em 45%", "Índice de Capital Nível I forte: 17,8% vs 13,9% no 4T24", "ROAE sólido de 22,1% mesmo em ano desafiador", "Desenvolvimento de novos produtos de commodities"], "resultCons": ["Receita total caiu 8,6% para R$531,4M", "Lucro líquido gerencial caiu 9,6% para R$175,1M", "Fees de Investment Banking e Capital Markets caíram 13,8%", "Volume de transações IB caiu 6,7% para R$9,8B, perdendo market share", "Volume de transações em Capital Markets caiu 1,8% para R$15,7B, perdendo share", "Resultado operacional caiu 2,8%", "Cenário macroeconômico impactou negativamente as atividades"], "result": "Resultados pressionados em 2025 pelo cenário macroeconômico adverso e perda de market share. Receita total caiu 8,6% e lucro líquido 9,6%, com queda significativa em Investment Banking (-13,8%). Apesar disso, empresa demonstrou resiliência com controle de despesas (-12,6%), manutenção da eficiência operacional (45%), e rentabilidade ainda elevada (ROAE 22,1%). Destaque positivo para Wealth Management (+31,4%) e estabilidade em Treasury. Balanço mais conservador com maior capitalização.", "sunoView": "Mantemos recomendação de compra com preço-teto de R$18,00. Empresa continua de alta qualidade mas valorização recente (cotação R$19,01 vs teto R$18,00) faz com que não seja mais uma barganha. Resultados pressionados mas praticamente estáveis, com empresa mostrando grande rentabilidade mesmo em momento desafiador.", "history": [{"quarter": "2025", "result": "Pressionado mas estável.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "PNVL3", "name": "Panvel", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 8.5, "thesis": "Farmácias líder no Sul.", "thesisPros": ["Receita +17%; SSS +14,7%", "Share 13,9%"], "thesisCons": [], "resultPros": ["Receita +17%; SSS +14,7%", "Share 13,9%", "EBITDA +27,9%; maior margem 5 anos", "FCL reverteu para +R$106M"], "resultCons": ["Lucro modesto R$128M"], "result": "Eficiência inquestionável.", "sunoView": "Balanço limpo, preparada para crescer.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "GMAT3", "name": "Grupo Mateus", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 6.5, "thesis": "Tese de investimento baseada na boa execução e expectativa de crescimento da companhia. Amplo espaço para conquistar mercado com expansão regional no Nordeste através de múltiplos formatos de loja. Posição confortável de balanço com baixa alavancagem (0,4x Dívida Líquida/EBITDA) permite continuidade do plano de expansão. Forte presença do fundador Ilson Mateus garante capacidade de execução comprovada. Preço justo estimado em R$ 9,00 (taxa de desconto real de 10% e crescimento perpétuo de 2,5%).", "thesisPros": ["Alavancagem 0,4x", "Posição dominante em Estados-chave (Maranhão, Piauí, Pará)", "Joint venture com Novo Atacarejo fortalece presença em Pernambuco", "Controlador presente e fundador com histórico comprovado de execução"], "thesisCons": ["Fragilidades em estoques", "Pressão macroeconômica: deflação de alimentos e alto endividamento das famílias", "Migração de consumidores para marcas mais baratas e redução de volumes", "Nota baixa no Reclame Aqui (5,3) comparada aos concorrentes Assaí (7,2) e Carrefour (7,6)", "Incapacidade de crescimento orgânico nas lojas existentes", "Setor altamente competitivo sem poder de precificação superior"], "resultPros": ["Receita +20,9%", "Margem bruta 22,5%", "Forte crescimento de receita: +20,9% no 4T25 e +19,8% em 2025", "Expansão de margem bruta para 22,5% (+0,7 p.p.) demonstrando gestão assertiva de precificação", "Margem EBITDA ajustada de 6,2% no 4T25", "Excelente saúde financeira: alavancagem de apenas 0,4x (Dívida Líquida/EBITDA)", "Geração de caixa robusta de R$ 379 milhões no 4T25", "Lucro líquido de R$ 1,5 bilhão em 2025 (+21% vs 2024)"], "resultCons": ["SSS -1,1%", "Margem EBITDA caiu", "Vendas nas mesmas lojas negativas: -1,1% no 4T25, indicando crescimento apenas por abertura de novas lojas", "Cotação atual (R$ 4,42-4,85) significativamente abaixo do preço justo estimado (R$ 9,00)"], "result": "Resultado misto no 4T25. Receita líquida de R$ 10,6 bilhões (+20,9% a/a) e R$ 38,4 bilhões no ano (+19,8%). Margem bruta expandiu para 22,5%. EBITDA ajustado de R$ 652 milhões (margem 6,2%). Lucro líquido trimestral de R$ 340 milhões (+5,3%) e R$ 1,5 bilhão no ano (+21%). Ponto negativo: vendas mesmas lojas -1,1%, indicando crescimento apenas via novas aberturas. Geração de caixa de R$ 379 milhões e alavancagem confortável de 0,4x.", "sunoView": "A Suno mantém recomendação de compra com preço justo de R$ 9,00. Apesar dos desafios de curto prazo (vendas mesmas lojas negativas e pressão macroeconômica), a companhia demonstra capacidade de proteger margens e crescer em escala. A baixa alavancagem (0,4x) e forte geração de caixa garantem segurança para atravessar a fase difícil. Em 2026, a empresa sinaliza foco em produtividade e rentabilidade ao invés de expansão agressiva, indicando maturação mais criteriosa das unidades existentes.", "history": [{"quarter": "4T25", "result": "Misto. Crescimento só por novas lojas.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "VIVA3", "name": "Vivara", "quarter": "4T25", "highlight": true, "sentiment": "positive", "rankScore": 9, "thesis": "A Vivara é a maior rede de joalherias do Brasil com 24,4% de market share, operando com modelo verticalizado de produção que garante vantagens competitivas significativas. A companhia possui excelente qualidade de negócio com margens elevadas (margem bruta de 69,6% e EBITDA de 25,3%), alto retorno sobre capital investido e forte poder de precificação raramente visto no varejo brasileiro. A verticalização permite rápida reação a mudanças de mercado, remanufatura de produtos e gestão eficiente de estoques de matéria-prima, mitigando volatilidade de preços do ouro e prata. Opera com duas marcas principais: Vivara (público acima de 30 anos, ticket amplo) e Life (público jovem acima de 15 anos, ticket médio R$300). Possui grande potencial de expansão, presente em apenas 40% dos shoppings brasileiros com a marca Vivara, e potencial ainda maior com Life que pode operar em ruas.", "thesisPros": ["Alavancagem 0,2x", "Modelo verticalizado garante vantagens competitivas: velocidade de reação, capacidade de remanufatura e gestão eficiente de estoques", "Base sólida de mais de 2 milhões de clientes ativos e NPS de 90", "Capacidade de adaptação em cenários adversos através de ajustes de produto (prata vs ouro, diferentes gramaturas)"], "thesisCons": ["Exposição à volatilidade de preços de commodities (ouro, prata, diamantes) apesar da mitigação via estoques", "Queda de margens no 4T25 devido a alterações contábeis e efeitos pontuais relacionados à otimização de estoques", "Vulnerabilidade a cenários de juros elevados que afetam o varejo, mesmo sendo segmento de luxo mais inelástico", "Ritmo agressivo de expansão planejado (65 lojas em 2026 vs 498 existentes) pode pressionar execução"], "resultPros": ["Receita +16%; SSS +11,8%", "Share 24,4%", "Margem bruta 69,6%", "Estoque -35 dias", "Líder absoluta do mercado com 24,4% de market share, distante dos concorrentes (Pandora e HStern com ~2% cada)", "Margens excepcionais para varejo: margem bruta de 69,6% e margem EBITDA ajustada de 25,3%", "Forte geração de caixa operacional de R$367 milhões no 4T25, com redução de 35 dias no ciclo de estoque", "Balanço patrimonial conservador com alavancagem de apenas 0,2x (dívida líquida/EBITDA), redução de 58% na dívida líquida no ano", "Crescimento consistente: receita de R$3,8 bilhões em 2025 (+16% a/a), vendas mesmas lojas +11,8% no 4T25", "Canal digital performando fortemente com alta de 31% no 4T25", "Grande potencial de expansão: presente em ~40% dos shoppings e plano ambicioso de abrir até 65 lojas em 2026"], "resultCons": ["EBITDA 4T -4,8% (pontual)", "Dependência de shoppings centers (99% das lojas), expondo a empresa ao fluxo destes estabelecimentos", "Concentração geográfica com 99% das lojas em shoppings pode limitar alcance de outros públicos"], "result": "A Vivara entregou resultados robustos em 2025 com crescimento de receita de 16% atingindo R$3,8 bilhões. No 4T25, as vendas avançaram 17,5% com same-store sales de +11,8%. O grande destaque foi a melhoria na gestão de estoques com redução de 35 dias, gerando caixa operacional de R$367 milhões. A margem bruta foi de 69,6% e EBITDA ajustado de 25,3% no ano. O EBITDA ajustado totalizou R$766 milhões (+16,5%) e lucro líquido de R$599 milhões (+22,6%). A dívida líquida foi reduzida em 58%, resultando em alavancagem de apenas 0,2x. A companhia encerrou 2025 com 498 lojas (268 Vivara, 219 Life, 11 quiosques) e manteve forte dinâmica competitiva ganhando 2,8 p.p. de market share para 24,4%.", "sunoView": "Recomendação de COMPRA com preço-alvo de R$30,14, considerando taxa de desconto real de 10% e crescimento de 2,5% na perpetuidade. A Vivara possui negócio de excelente qualidade com fatores raros no varejo brasileiro: margens elevadas e alto retorno sobre capital investido. O potencial de crescimento permanece significativo com a marca Vivara presente em apenas ~40% dos shoppings e Life com potencial ainda maior podendo operar em unidades de rua. A companhia demonstrou capacidade de execução em ambiente desafiador, com balanço sólido que suporta o plano ambicioso de abertura de até 65 lojas em 2026.", "history": [{"quarter": "4T25", "result": "Resultado limpo: crescimento + margens + caixa.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "EZTC3", "name": "Eztec", "quarter": "4T25", "highlight": true, "sentiment": "positive", "rankScore": 8.5, "thesis": "A Eztec é uma das maiores incorporadoras paulistas com mais de 40 anos de experiência. A tese se fundamenta em três pilares: (1) recuperação do ROE que atingiu 10,9% em 2025, com potencial de melhoria substancial após monetização dos ativos da EZ Inc; (2) conclusão iminente do Esther Towers (79% concluído, primeira torre prevista para 1S26), destravando valor significativo; (3) forte potencial de aumento no payout de dividendos com o fim dos investimentos em ativos corporativos, considerando a baixa alavancagem (dívida líquida/PL de 2,9%) e forte geração de caixa operacional de R$ 557 milhões em 2025.", "thesisPros": ["Lançamentos recorde R$2,4 bi (+46,7%)", "Lucro R$535M (+32,2%) — maior 10 anos"], "thesisCons": ["Aumento de capital diluiu acionistas: emissão de 60 milhões de novas ações (de 218 para 281 milhões)", "Dependência da monetização do Esther Towers para destravar valor", "Exposição a setor cíclico com dependência de crédito e taxas de juros"], "resultPros": ["Lançamentos recorde R$2,4 bi (+46,7%)", "Lucro R$535M (+32,2%) — maior 10 anos", "Margem bruta 41,7%", "Caixa R$504M", "Lucro líquido recorde de R$ 535 milhões em 2025, crescimento de 32,2% vs 2024, maior resultado em 10 anos", "Margem bruta de 41,7% em 2025, melhor patamar dos últimos 3 anos, acima de 40%", "Recorde histórico de lançamentos (R$ 2,36 bilhões em VGV, +46,7% vs 2024) e vendas (R$ 2,22 bilhões, +17,2%)", "Esther Towers com 79% de conclusão, primeira torre prevista para 1S26, reduzindo risco de execução", "Air Brooklin Corporate com 97% de conclusão", "Baixa alavancagem: dívida líquida/PL de apenas 2,9%, queda de 59,7% vs 2024", "Forte geração de caixa operacional de R$ 557 milhões (exceto dividendos) em 2025", "ROE em recuperação pelo segundo ano consecutivo, atingindo 10,9% (+2,3 p.p. vs 2024)", "Distribuição de R$ 339 milhões em dividendos (57% do lucro) com potencial de aumento", "67% dos projetos entregues em 2025 com economia de custos", "Guidance de lançamentos 2026 entre R$ 2,5 e R$ 3,5 bilhões"], "resultCons": ["Receita -4% (PoC)", "Receita líquida de R$ 1,5 bilhão em 2025, queda de 4% vs 2024", "Receita do 4T25 de R$ 269 milhões, queda de 42,7% vs 3T25 devido ao ciclo de entregas", "ROE de 10,9% ainda abaixo de patamares históricos e considerados satisfatórios para o setor", "Eventos não recorrentes contribuíram com R$ 91,5 milhões (20,7% do lucro operacional anual)", "Banco de terrenos reduzido em 15,8% para R$ 9,3 bilhões", "VSO líquida trimestral de apenas 16,2%"], "result": "Trimestre com lucro de R$ 117,5 milhões (margem líquida de 43,7%, a mais elevada do ano), mas receita fraca de R$ 269 milhões (-42,7% vs 3T25). No acumulado de 2025, lucro recorde de R$ 535 milhões (+32,2% vs 2024) com margem líquida de 35,7%. Lançamentos recordes de R$ 2,36 bilhões (+46,7%) e vendas históricas de R$ 2,22 bilhões (+17,2%). Margem bruta de 41,7%, retornando ao patamar acima de 40%. ROE de 10,9%, segundo ano consecutivo de melhoria. Dívida líquida/PL de apenas 2,9%. Esther Towers com 79% de conclusão.", "sunoView": "Valuation indica valor justo de R$ 17,50 por ação, com preço-teto de R$ 14,00 (margem de segurança de 20%). A Suno mantém a tese de investimento inalterada e destaca os resultados expressivos de 2025. A conclusão do Esther Towers nos próximos 12-18 meses é vista como catalisador-chave para destravar valor e permitir aumento significativo no payout de dividendos. A companhia é considerada benchmark do setor de incorporação.", "history": [{"quarter": "4T25", "result": "Aceleração com margens em expansão.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "TIMS3", "name": "TIM Brasil", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 8.5, "thesis": "A Tim é líder em cobertura e qualidade no setor de telecomunicações brasileiro, com forte capacidade de geração de caixa e modelo asset light em banda larga. Foi a maior beneficiada pelo leilão da Oi móvel, operando em mercado consolidado com três players principais.", "thesisPros": ["Líder em cobertura e qualidade (OpenSignal e Reclame Aqui) com maior quantidade de espectro por usuário", "Nenhuma exposição a serviços legados (telefonia fixa ou cabos metálicos)", "Maior beneficiada pelo leilão da Oi móvel, com ganhos de eficiência ainda a serem capturados", "Modelo asset light em fibra ótica via redes neutras (I-Systems e V.Tal) sem necessidade de CapEx relevante", "Potencial de conversão de clientes pré-pago para pós-pago gerando alavancagem operacional", "Mercado consolidado em oligopólio (Vivo, Claro, Tim) com ambiente competitivo mais racional", "Dividend yield próximo de 7% com pagamento de R$ 4,5 bilhões esperado"], "thesisCons": ["Mercado maduro com crescimento limitado de novos acessos", "Terceira posição em market share atrás de Vivo e Claro", "Banda larga fixa ainda com baixa representatividade no resultado consolidado"], "resultPros": ["Forte migração pré para pós-pago: 32,7M clientes pós (+8,4%) com ARPU superior", "Receita líquida móvel R$ 6,3 bi (+4,8%) e fixa R$ 359M (+9,4%)", "Margem EBITDA expandiu 2,6 p.p. para 53,1% com controle de custos (-1,1%)", "EBITDA R$ 3,6 bi (+9,6%) e lucro líquido R$ 1,3 bi (+28,1%) no trimestre", "Fluxo de caixa livre normalizado R$ 983M (+94,7%)", "Anualizado 2025: receita +4,6%, EBITDA +4,5%, lucro +37,4%", "Banda larga FTTH 808 mil acessos (+11,7%) com ARPU estável", "Alavancagem operacional sem custos e investimentos adicionais relevantes"], "resultCons": ["Clientes pré-pago em declínio: 29,2M (-8,3%)", "Base total móvel estável em 62M (-0,1%)", "Receita de produtos caiu para R$ 255M (-11,3%) com preço médio menor (-9,7%)", "Resultado financeiro caixa negativo em R$ 396M"], "result": "A Tim apresentou excelente resultado no 4T25, com a migração acelerada de clientes pré para pós-pago gerando forte alavancagem operacional. A expansão de margem EBITDA de 2,6 p.p. e crescimento do lucro líquido de 28,1% demonstram a captura de eficiências operacionais. O fluxo de caixa livre quase dobrou (+94,7%), sustentando dividendos atrativos. A estratégia asset light em fibra e a consolidação do mercado em três players continuam rendendo frutos.", "sunoView": "A Suno mantém recomendação de compra com preço-teto de R$ 18,60 (nota: cotação atual R$ 27,35 está acima). Destaca que o retorno via dividendos de ~7% em 'modo manutenção', combinado com potencial de crescimento sem investimentos relevantes pela migração pré/pós e expansão em fibra, permanece atrativo. A empresa segue sólida em setor previsível, com espaço para migração (53% pós vs 70% Vivo) e TIM Ultrafibra ganhando relevância.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "VAMO3", "name": "Vamos", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 7.5, "thesis": "Empresa de locação de caminhões e máquinas com modelo de negócio resiliente, focada em ganhos de eficiência operacional e desalavancagem. Possui alavancas internas para gerar valor independente do cenário macro.", "thesisPros": ["Modelo de negócio resiliente mesmo com juros elevados (Selic 15%)", "Core business (Locação) com forte geração de caixa e alta rentabilidade (TIR média de 21,76%)", "Estratégia de aumento de ocupação da frota existente e aluguel de ativos usados (Sempre Novo) com alta rentabilidade", "Disciplina na alocação de capital e foco em desalavancagem orgânica", "Alavancas internas poderosas para gerar valor independente de quedas na Selic"], "thesisCons": ["Segmento de Indústria segue como ponto de pressão estrutural", "Despesa financeira ainda elevada devido ao carrego de dívidas e juros altos", "Exposição ao ciclo econômico através do segmento de Seminovos"], "resultPros": ["Receita Líquida de R$ 1,48 bilhão com forte crescimento de 24,3% a/a", "EBITDA Ajustado de R$ 956,9 milhões, alta de 13,2% a/a", "Lucro Líquido com inflexão importante: +53,9% vs 3T25, sinalizando virada de tendência", "Locação com taxa de ocupação de 86,9%, maior patamar desde 2020", "Inadimplência em apenas 0,8% da receita líquida de serviços", "Seminovos bateu recorde com 6.490 unidades vendidas (+102,7% a/a)", "Desalavancagem orgânica: dívida líquida caiu para R$ 11,8 bi e alavancagem para 3,16x (menor desde 2022)"], "resultCons": ["Lucro Líquido Ajustado de R$ 77,7 milhões ainda representa queda de 52,6% a/a", "Segmento Indústria com EBITDA negativo de R$ 11,6 milhões", "Margem EBITDA de Seminovos ainda pressionada (1,2%), apesar de positiva", "Despesa financeira líquida elevada em R$ 591,6 milhões"], "result": "Resultado levemente acima das expectativas, com inflexão no lucro e cumprimento da promessa de desalavancagem orgânica. Core business (Locação) apresentou excelente execução com recordes operacionais.", "sunoView": "O pior momento para a companhia já ficou para trás. A estratégia de segurar compras de ativos novos, focar no aumento da ocupação da frota e limpar estoques se provou acertada. O ganho de eficiência operacional deve ditar o ritmo positivo de 2026.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "BRKM5", "name": "Braskem", "quarter": "4T25", "highlight": false, "sentiment": "negative", "rankScore": 2.5, "thesis": "Maior produtora petroquímica da América Latina com posição dominante no mercado brasileiro de resinas termoplásticas. Possui vantagens competitivas estruturais como integração com fornecedores de matéria-prima, escala produtiva e proximidade com mercado consumidor doméstico. Enfrenta ciclo prolongado de baixa da indústria petroquímica global com spreads internacionais comprimidos e alta alavancagem financeira que compromete flexibilidade operacional.", "thesisPros": ["Posição dominante no mercado brasileiro de resinas termoplásticas", "Integração vertical com fornecedores de matéria-prima", "Escala produtiva relevante na América Latina", "Proximidade com mercado consumidor doméstico", "Avanços regulatórios com PRESIQ e majoração do REIQ de 0,73% para 5,8%", "Redução gradual do risco de Alagoas com acordo de R$ 1,2 bilhão até 2030"], "thesisCons": ["Alavancagem extremamente elevada em 14,74x dívida líquida/EBITDA", "Exposição ao ciclo petroquímico global com spreads internacionais comprimidos", "Situação crítica da Braskem Idesa com default nos juros e impairment de US$ 272 milhões", "Dependência de matéria-prima importada encarece custos", "Operações internacionais (EUA e Europa) com desempenho estruturalmente fraco", "Alta exposição cambial com custo médio ponderado de variação cambial + 6,20% a.a."], "resultPros": ["Recuperação operacional significativa no México com utilização subindo para 85%", "Receitas extraordinárias de R$ 2,3 bilhões com créditos tributários PIS/COFINS", "Saque de linha stand-by de US$ 1 bilhão garantiu liquidez no curto prazo", "Avanço de 99,5% nas propostas do PCF pagas em Alagoas", "EBITDA anual em dólares com leve alta de 7% vs 4T24"], "resultCons": ["Receita líquida de R$ 16,1 bilhões, queda de 7% trimestral e 16% anual", "EBITDA recorrente de apenas US$ 109 milhões, queda de 27% no trimestre", "Margem EBITDA recorrente de apenas 3,7%, muito baixa para o porte da empresa", "Prejuízo líquido de R$ 10,3 bilhões no trimestre", "Segmento EUA/Europa com EBITDA negativo de US$ 32 milhões", "Taxa de utilização de eteno no Brasil caiu para 59% (-6 p.p. trimestral)", "Default da Braskem Idesa nos juros do bond 2029 e impairment de US$ 272 milhões"], "result": "Resultado fraco no 4T25 com receita de R$ 16,1 bilhões (-7% trimestral) e EBITDA recorrente de apenas US$ 109 milhões (-27% trimestral). Margem EBITDA de 3,7% evidencia dificuldade em gerar valor. Prejuízo de R$ 10,3 bilhões inflado por baixa contábil, mas operação segue pressionada. Situação crítica da Braskem Idesa com default e impairment. Alavancagem permanece em 14,74x.", "sunoView": "Resultado abaixo do esperado confirma pressões do ciclo petroquímico global. Spreads em queda, volumes menores e alavancagem de 14,74x inspiram cuidado. Situação da Braskem Idesa é particularmente preocupante com default nos juros. Avanços regulatórios são positivos para longo prazo, mas efeitos só a partir de 2027.", "history": [], "lastUpdated": "2026-03-27"}
    ],
    "Small Caps": [
      {"ticker": "FIQE3", "name": "Unifique Telecomunicações", "quarter": "4T25", "highlight": true, "sentiment": "positive", "rankScore": 9.2, "thesis": "Small cap com forte geração de caixa, crescimento previsível e investimentos transformacionais em 5G. Operadora regional líder em Santa Catarina com infraestrutura robusta de fibra óptica e qualidade de serviço reconhecida. Forte alinhamento entre executivos e acionistas.", "thesisPros": ["Receita +21,8%; EBITDA +31,1%", "Churn mínimo 1,36%", "Forte capacidade de geração de caixa com yield FCL de 14%", "Líder de market share em Santa Catarina, superando Claro, Oi e Vivo", "Melhor banda larga e telefonia fixa do Brasil por 5 anos consecutivos (2019-2023)", "Infraestrutura robusta com +33 mil km de fibra óptica e tecnologia XGS-PON em 80% da rede", "Baixo churn histórico de 1,36% demonstrando fidelização de clientes", "Alavancagem operacional com ganhos de escala nas aquisições", "Expansão em 5G com grande potencial (penetração de apenas 5,7% em móvel)", "Qualidade de serviço reconhecida (NPS elevado e nota 8+ no Reclame Aqui)", "Foco regional permite crescimento eficiente sem grandes novos investimentos"], "thesisCons": ["Risco de disrupção tecnológica no mercado de telecomunicações", "Risco de segurança cibernética", "Competição intensa com grandes players (Claro, Vivo, TIM, Oi)", "Concentração geográfica na região Sul", "Ações negociando acima do preço-teto de R$ 4,50 (cotação em R$ 6,59)"], "resultPros": ["Crescimento de 9,6% em acessos de banda larga, atingindo 858 mil", "Receita líquida de R$ 323,5 milhões no trimestre (+21,8%) e R$ 1,2 bilhão no ano (+15,6%)", "EBITDA de R$ 165,6 milhões (+31,1%) com margem de 50,9% (+3,4 p.p.)", "Forte aceleração em móvel: 247,8 mil acessos (+159,8%) e receita de R$ 24,8 milhões (+275,8%)", "Lucro líquido de R$ 62 milhões (+24,9%) no trimestre e R$ 208,2 milhões (+19,2%) no ano", "Churn atingiu menor patamar histórico de 1,36% (-0,2 p.p.)", "ARPU de banda larga cresceu 9,3% para R$ 110,7", "Expansão para 3,8 milhões de casas passadas (+7,2%) com penetração de 23%", "Cobertura móvel expandiu para 4,4 milhões de população (vs 305,6 mil no 4T24)", "Custos operacionais bem controlados (+13,3%) frente ao crescimento de receita"], "resultCons": ["Receita de telefonia fixa caiu 3,3% para R$ 14 milhões", "Receita de datacenter e outros serviços caiu 3,3% para R$ 11,9 milhões", "Penetração em móvel ainda muito baixa (5,7%)", "Acessos no RS caíram 3,3% para 175,4 mil"], "result": "Excelente resultado consolidando crescimento orgânico e aquisições. Destaque para aceleração em móvel (+159,8% em acessos) e forte alavancagem operacional com margem EBITDA de 50,9%. Banda larga mantém crescimento sólido (+9,6%) com churn no menor nível histórico (1,36%). Geração de caixa robusta com R$ 302 milhões de FCL no ano (yield de 14%).", "sunoView": "Analista mantém conforto com a tese pela robustez dos resultados, mas sugere canalizar novos aportes para outras empresas, pois as ações negociam acima do preço-teto de R$ 4,50 (cotação atual R$ 6,59), reduzindo a margem de segurança. Recomendação de compra apenas até R$ 4,50.", "history": [{"quarter": "4T25", "result": "Excelente. Alavancagem operacional.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "RECV3", "name": "PetroRecôncavo", "quarter": "4T25", "highlight": false, "sentiment": "negative", "rankScore": 4.1, "thesis": "PetroRecôncavo é especializada na revitalização de campos onshore maduros de petróleo e gás, sendo o maior player privado brasileiro nesse nicho. A tese se baseia em: (1) grande eficiência operacional com baixo lifting cost, (2) forte geração de caixa e distribuição de dividendos, e (3) governança alinhada ao acionista com sócios-fundadores experientes.", "thesisPros": ["Alavancagem 1,1x", "Maior player privado em campos onshore com expertise de mais de 20 anos", "Eficiência operacional comprovada na revitalização de campos maduros com custos competitivos", "Track record consistente de aumento de produção acima das expectativas iniciais", "Governança de qualidade com sócios-fundadores alinhados aos minoritários", "Alavancagem conservadora (1,1x Dívida Líquida/EBITDA) com custo de dívida baixo (6,12% a.a.)", "Diversificação de ativos com polos na Bahia e Rio Grande do Norte", "Expansão no midstream com aquisição de 50% dos ativos da Brava (UPGNs)"], "thesisCons": ["FCL negativo", "Exposição significativa à volatilidade do preço do Brent", "Declínio natural dos campos maduros requer investimentos contínuos em revitalização", "Dependência de poucos compradores (53% Brava, 40% Petrobras)", "Campos onshore têm custos de extração maiores que pré-sal"], "resultPros": ["Produção anual manteve-se estável em 26.506 boe/dia", "Crescimento de 6% na produção do Ativo Bahia devido ao desenvolvimento em Tiê", "Redução de 22% nos custos de processamento e escoamento após aquisição midstream", "Dividend yield de 6% mantido mesmo com cenário adverso", "Custos de extração no trimestre caíram 8% para US$ 14,32/boe"], "resultCons": ["Receita líquida caiu 10% no trimestre para R$ 704 milhões e 3% no ano", "Preço médio de venda do petróleo caiu 8% no trimestre (US$ 54,85/barril) devido à queda do Brent", "EBITDA recuou 16% no trimestre e 12% no ano para R$ 1,4 bilhão", "Fluxo de Caixa Operacional caiu 32% no ano para R$ 1,5 bilhão", "Fluxo de Caixa Livre negativo em R$ 135 milhões (vs. R$ 1 bilhão positivo em 2024)", "Produção caiu 5% no trimestre para 24.996 boe/dia devido a paradas para manutenção", "Custos de extração subiram 6% no ano para US$ 14,42/boe", "Alavancagem aumentou de 0,8x para 1,1x"], "result": "Trimestre desafiador marcado pela volatilidade do Brent, com quedas na receita, EBITDA e geração de caixa. Produção estável no ano, mas FCL negativo devido a investimentos elevados em midstream e desenvolvimento de poços. Empresa manteve governança sólida e alavancagem conservadora.", "sunoView": "Recomendação de COMPRA mantida com preço-teto de R$ 17,10. Apesar dos resultados fracos de curto prazo devido ao Brent, a empresa realizou investimentos importantes que devem gerar retornos futuros. Os efeitos positivos dos novos poços e da aquisição dos ativos de midstream devem aparecer em breve. Valuation por fluxo de caixa descontado conservador com Brent a US$ 65 no longo prazo.", "history": [{"quarter": "4T25", "result": "Brent pesou. Investimentos preparam futuro.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "RANI3", "name": "Irani Papel e Embalagem S.A.", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 6.8, "thesis": "Produtora de embalagens de papel e papelão ondulado com forte geração de caixa, ROIC alto e projetos de redução de custos. Beneficia-se de competição local favorável em cluster frigorífico com demanda resiliente do setor alimentício (70%+ dos clientes). ESG forte com operação carbono negativa. Passou por turnaround bem-sucedido e possui situação financeira saudável. Menos exposta à volatilidade do preço de celulose versus Klabin/Suzano.", "thesisPros": ["EBITDA +12,4%", "Aparas -14,1% t/t", "Forte geração de caixa com FCF yield de 12% (ajustado) em 2025", "ROIC relativamente alto com projetos de melhoria operacional (Plataforma Gaia)", "Competição local favorável em cluster frigorífico de Santa Catarina", "Baixa correlação com preço volátil de celulose", "Demanda resiliente: 70%+ clientes do setor alimentício com elasticidade baixa", "ESG diferenciado: carbono negativa, acesso a debêntures verdes com custo baixo", "Política de dividendos atrativa: 50% de payout", "Alavancagem controlada: Dívida Líquida/EBITDA de 1,99x (vs 2,26x no 4T24)"], "thesisCons": ["Alta dependência do mercado interno", "Competição com Klabin, player muito maior e mais eficiente", "Menor integração vertical: 71,7% da produção depende de aparas recicladas", "Exposição indireta ao dólar nos preços de venda (negativa com desvalorização cambial)", "Custos elevados de aparas (R$ 1.030/ton no 4T25)", "Market share modesto: 4,16% em papelão ondulado e 4,87% em papéis para embalagem"], "resultPros": ["EBITDA ajustado cresceu 12,4% no 4T25 vs 4T24, atingindo R$ 122,6 milhões", "Forte FCF de R$ 387,1 milhões em 2025 (yield de 17,5%), ou R$ 265 milhões ajustado (yield de 12%)", "Repasse efetivo de preços: +7% em papelão ondulado e +6,7% em papéis rígidos", "Custo de aparas estabilizou: +1% vs 4T24 e -14,1% vs 3T25", "Redução da alavancagem: DL/EBITDA de 1,99x vs 2,26x no 4T24", "Projeto Gaia mostrando resultados positivos no 2S25", "Saída do negócio deficitário de resinas (EBITDA negativo) no 1T25", "CPV caiu 0,8% apesar da pressão de custos"], "resultCons": ["Receita líquida cresceu apenas 2% no 4T25 vs 4T24 (R$ 416 milhões)", "Volume de papelão ondulado caiu 6% no 4T25 vs 4T24", "Lucro líquido despencou 79,6% no 4T25 vs 4T24 para R$ 38 milhões (impacto de não recorrentes)", "Produção de papéis praticamente estagnada: -0,4% no 4T25 vs 4T24", "Desvalorização do dólar em 2025 impactou negativamente os preços", "Preço de aparas ainda elevado (R$ 1.030/ton), apesar de estabilização", "Preço de papéis flexíveis caiu 0,8%"], "result": "A Irani apresentou resultados sólidos no 4T25 com EBITDA ajustado crescendo 12,4% e forte geração de caixa (FCF yield de 12% ajustado). A empresa conseguiu repassar preços efetivamente (+7% em papelão ondulado) e compensar custos elevados de aparas. O Projeto Gaia está entregando melhorias operacionais e a alavancagem caiu para 1,99x. Pontos negativos incluem queda de 6% no volume de papelão ondulado, crescimento modesto de receita (+2%) e impacto da desvalorização cambial nos preços.", "sunoView": "Mantemos recomendação de compra com preço-teto de R$ 8,85. A empresa demonstra capacidade de manter margens através de repasses de preços mesmo em ambiente adverso. Com normalização do preço das aparas e ramp-up dos projetos Gaia, esperamos forte geração de caixa nos próximos anos, beneficiando investidores através da política de dividendos de 50% de payout.", "history": [{"quarter": "4T25", "result": "Lucratividade crescendo.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "ABCB4", "name": "Banco ABC Brasil", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 7.4, "thesis": "Banco especializado em crédito corporativo (PJ de médio a grande porte) com expansão estratégica no segmento Middle. Possui vantagens competitivas sólidas em atendimento diferenciado, importante avenida de crescimento através de novos produtos/serviços e valuation atrativo negociando abaixo do valor patrimonial.", "thesisPros": ["Valuation atrativo: P/L de 7x para 2026, negociando abaixo do valor patrimonial", "Especialização em atendimento corporativo de alto valor agregado"], "thesisCons": ["Funding mais caro que grandes bancos por falta de fontes baratas como poupança", "Captação concentrada em prazos curtos (maioria até um ano)", "Cenário macroeconômico conturbado levando à postura mais conservadora"], "resultPros": ["Lucro +13,4%; ROAE 16,3%", "NIM 4,7%", "Inadimplência 0,5%", "Cobertura 501%", "Margem financeira gerencial cresceu 14% vs 4T24 e 79,4% vs 3T25, alcançando R$ 713,4 milhões", "Carteira de crédito expandida cresceu 3% vs 4T24 e 4,7% vs 3T25", "NIM melhorou para 4,7% a.a. no 4T25 (vs 4,2% a.a. no 4T24)", "Inadimplência (90 dias) reduziu para 0,5% no 4T25 (vs 0,9% no início do ano)", "Índice de cobertura bastante conservador subiu para 501% (vs 227% no 1T25)", "Lucro líquido recorrente de R$ 275,5 milhões, crescimento de 13,4% vs 4T24", "ROAE recorrente de 16,3%, aumento de 1,1 p.p. vs 4T24", "Índice de Capital Principal sólido de 11,9%", "Dividend yield estimado de 6% para 2026", "Expansão estratégica no segmento Middle (crescimento esperado de 12-18%)"], "resultCons": ["Serviços -5%", "Guidance conservador", "Provisionamento conservador aumentou para 2,4% da carteira (vs 2,1% no início do ano), limitando crescimento do lucro", "Receita de serviços diminuiu 5% vs 4T24", "Índice de eficiência piorou ligeiramente para 37,9% no 4T25 (vs 37,7% no 4T24)", "Guidance de crescimento da carteira reduzido para 2026: de 7-12% para 6-10%", "Guidance de Índice de Eficiência piorado: de 36-38% para 37,5-39,5%"], "result": "Lucro líquido recorrente de R$ 275,5 milhões no 4T25, crescimento de 13,4% vs 4T24 e 7,3% vs 3T25. Margem financeira gerencial de R$ 713,4 milhões (+14% a/a). ROAE recorrente de 16,3%. Resultados sólidos mascarados por provisionamento bastante conservador que elevou índice de cobertura para 501%.", "sunoView": "Recomendação de COMPRA com preço-teto de R$ 24,00. O banco apresenta resultados resilientes com modelo de negócio sólido, negociando a P/L atrativo de 7x para 2026. A especialização em clientes corporativos, expansão no segmento Middle e postura conservadora em ambiente desafiador são pontos positivos. Valuation oferece margem de segurança considerável.", "history": [{"quarter": "4T25", "result": "Sólido. Provisionamento conservador.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "CAMB3", "name": "Cambuci", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 5.2, "thesis": "A Cambuci é a maior fabricante brasileira de artigos esportivos para futebol, destacando-se pela produção nacional, gestão eficiente de capital de giro e excelente relação custo-benefício. A empresa possui marcas consolidadas (Penalty e Stadium), certificações internacionais e forte presença no varejo multimarcas. Apresenta capacidade consistente de geração de caixa e remuneração aos acionistas. O preço-teto recomendado é R$ 16,50, com potencial de valorização significativo ante a cotação atual de R$ 9,65.", "thesisPros": ["Líder no segmento de bolas esportivas no Brasil com marcas reconhecidas", "Certificações internacionais (FIFA, FIVB, IHF) como única marca sul-americana reconhecida", "Ampla capilaridade com presença em mais de 9 mil pontos de venda"], "thesisCons": ["Dependência significativa de incentivos fiscais com risco de mudanças tributárias", "Desafio de executar plano de crescimento em ambiente de juros restritivos"], "resultPros": ["Caixa líquido +61%", "Dividendos R$44M", "Estoques -21,5%", "Gestão exemplar de caixa e capital de giro - caixa líquido cresceu 61% em 2025 para R$ 65 milhões", "Forte geração operacional de caixa (R$ 80 milhões em 2025) e compromisso com dividendos (R$ 44 milhões distribuídos)", "Redução estratégica de estoques em 21,5% alinhada à menor demanda", "Produção nacional com instalações modernas e custo-benefício competitivo", "Valor de mercado (R$ 395 milhões) significativamente abaixo do valor justo estimado"], "resultCons": ["Receita -12,5%", "EBITDA -24,3%", "Queda de 12,5% na receita em 2025 (R$ 383 milhões) devido ao varejo desaquecido", "EBITDA caiu 24,3% no ano para R$ 82 milhões por dificuldade em diluir custos fixos", "Pressão do cenário macroeconômico com Selic em 15% ao ano afetando consumo", "Falta de alavancagem operacional em cenário de receita decrescente"], "result": "No 4T25, a receita foi de R$ 80 milhões (-11,7% vs 4T24) e EBITDA de R$ 12,6 milhões (-18,2%). No ano, receita de R$ 383 milhões (-12,5%), EBITDA de R$ 82 milhões (-24,3%) e lucro líquido de R$ 68 milhões (-10%). Destaque positivo para caixa líquido de R$ 65 milhões (+61% vs 2024), forte geração de caixa operacional de R$ 80 milhões e distribuição de R$ 44 milhões em proventos. Redução de 21,5% nos estoques demonstra gestão prudente.", "sunoView": "Recomendação de COMPRA até o preço-teto de R$ 16,50. Apesar do resultado operacional fraco em 2025 devido ao ambiente macro adverso, a gestão defensiva foi impecável. A empresa mantém fundamentos sólidos, excelente gestão de caixa e capital de giro, e está negociando com significativo desconto em relação ao valor justo. O desafio será executar o crescimento projetado em cenário de juros elevados, mas a capacidade de geração de caixa e eficiência operacional sustentam o otimismo de longo prazo.", "history": [{"quarter": "4T25", "result": "Operacional pressionado, gestão exemplar.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "FESA4", "name": "Ferbasa", "quarter": "4T25", "highlight": false, "sentiment": "negative", "rankScore": 3.6, "thesis": "Ferbasa é a única produtora integrada de ferrocromo das Américas e maior produtora independente de ferroligas do Brasil. Empresa com histórico excepcional de geração de valor, ESG forte (controlada por fundação educacional), operação verticalmente integrada com produção de energia limpa. Potencial de destravamento de valor através de aumento de produção e redução de custos via verticalização.", "thesisPros": ["Caixa líquida", "Única produtora integrada de ferrocromo das Américas com reservas de ~40 milhões de toneladas de cromita", "Operação totalmente verticalizada desde mineração até produção de ligas, incluindo geração de energia limpa", "ESG excepcional: controlada por fundação educacional sem fins lucrativos, operação de ferrossilício carbono negativa", "Histórico de forte geração de valor e distribuição de dividendos acima do payout mínimo de 25%", "Posição operacional e financeira sólida, empresa caixa líquida"], "thesisCons": ["Sobretaxas pesadas", "Exposição à volatilidade de preços de commodities (ferroligas)", "Negócio intensivo em energia elétrica, sujeito a variações de custos energéticos", "Dependência de mercado cíclico sujeito a flutuações de demanda global", "Exposição a medidas protecionistas e tarifas internacionais"], "resultPros": ["Volume de vendas cresceu 14,8% vs 3T25, alcançando 73,9 mil toneladas", "Receita líquida avançou 11,1% no trimestre para R$ 602,6 milhões", "Lucro líquido mais que dobrou no 4T25 para R$ 99,8 milhões vs R$ 46 milhões no 3T25", "Distribuiu R$ 240 milhões em JCP em 2025, representando dividend yield de 9,1%"], "resultCons": ["EBITDA ajustado despencou 91,5% no trimestre para apenas R$ 4,3 milhões (margem de 0,7%)", "Margem EBITDA anual caiu para 7,9% em 2025 vs 15,7% em 2024", "Lucro líquido anual recuou 42,4% para R$ 188 milhões", "Sobretaxação nos EUA: 69% sobre ferrosilício, 40% sobre ferrocromo e 50% sobre aço brasileiro exportado", "Geração de energia eólica 3,9% menor devido a restrições do ONS", "Aumento significativo do CPV pressionou margens"], "result": "Resultado desafiador no 4T25 e 2025. Apesar do aumento no volume de vendas e receita trimestral, as margens foram severamente pressionadas por tarifas protecionistas internacionais, aumento de custos operacionais (especialmente energia) e menor recuperação de créditos tributários. O EBITDA ajustado praticamente zerou no trimestre. O lucro líquido anual caiu 42,4%. Pontos positivos incluem recuperação do lucro trimestral via resultado financeiro favorável e manutenção de bom dividend yield de 9,1%.", "sunoView": "Mantemos recomendação de compra com preço-teto de R$ 8,25. Os desafios de 2025 são temporários e cíclicos, relacionados ao ambiente externo de tarifas e volatilidade de commodities. A tese de longo prazo permanece intacta: empresa com qualidade excepcional, operação verticalizada única, ESG forte e perspectivas de melhora de eficiência. A distribuição generosa de proventos (yield de 9,1%) reforça a atratividade enquanto o ciclo não se normaliza.", "history": [{"quarter": "4T25", "result": "Impactada por tarifas. Não estrutural.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "SHUL4", "name": "Schulz", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 5.5, "thesis": "Compressores e automotivo. Caixa líquido.", "thesisPros": ["Lucro +13%", "Caixa R$133M"], "thesisCons": [], "resultPros": ["Lucro +13%", "Caixa R$133M", "Aftermarket +5,9%"], "resultCons": ["Receita -14%", "Margem 25% para 18%"], "result": "Fortaleza financeira.", "sunoView": "Recomendação inalterada.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "BRSR6", "name": "Banrisul", "quarter": "4T25", "highlight": true, "sentiment": "negative", "rankScore": 2.1, "thesis": "Banco regional RS. Funding barato.", "thesisPros": ["Capital 14%", "Funding ~82,4% CDI"], "thesisCons": ["Cobertura despencou"], "resultPros": ["Capital 14%", "Funding ~82,4% CDI"], "resultCons": ["Lucro real ~R$42M (-85%)", "Inadimplência 4,18%"], "result": "Muito fraco. Inadimplência agro.", "sunoView": "Compra com teto R$13,75.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "KEPL3", "name": "Kepler Weber", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 5.8, "thesis": "Tese baseada na redução do déficit de armazenagem no Brasil ('long Brazil, long Agro'). Líder em mercado fundamental de armazenagem de grãos com 40% de market share, presença em 50% das plantas agrícolas do país. Empresa centenária com marca reconhecida, alto padrão de governança e modelo de negócio resiliente após implementação de lean manufacturing. Diversificação de portfólio com aumento de valor agregado e recorrência de receitas.", "thesisPros": ["Líder de mercado com 40% de market share em soluções de armazenagem e pós-colheita", "Mercado estrutural em crescimento com déficit de armazenagem crescente no Brasil", "Segmento de Reposição & Serviços crescente e rentável, trazendo recorrência", "Alto padrão de governança e marca tradicional reconhecida", "Modelo de negócio resiliente após implementação de lean manufacturing", "Forte geração de caixa e estrutura financeira sólida com caixa líquido", "Diversificação geográfica com expansão internacional bem-sucedida"], "thesisCons": ["Exposição a ciclos do agronegócio e preços de commodities", "Sensibilidade a taxas de juros elevadas que impactam investimentos dos clientes", "Sazonalidade no modelo de negócios", "Dependência de programas governamentais de incentivo"], "resultPros": ["Lucro líquido de R$ 64,7 milhões no 4T25, alta de 28,5% versus 4T24", "Margem líquida de 16,2%, expansão de 5,2 p.p.", "Negócios Internacionais cresceram 31,4% no trimestre e 19,4% no ano (melhor desempenho em 10 anos)", "Segmento Reposição & Serviços resiliente, com receita anual de R$ 310,9 milhões (+10,1%)", "Distribuição de R$ 145 milhões em dividendos no ano (dividend yield de 10%)", "Terceiro maior volume de toneladas embarcadas dos últimos 10 anos"], "resultCons": ["Receita operacional líquida recuou 13,3% no trimestre e 7,3% no ano para R$ 1,5 bilhão", "Margem EBITDA caiu 4,8 p.p. no ano para 15,6%", "EBITDA anual de R$ 231,9 milhões, queda de 29,4%", "ROIC de 23%, bem abaixo dos 34,2% de 2024", "Segmento Fazendas com receita em queda de 26,4% no trimestre", "Agroindústrias retraiu 32,9% no trimestre com margem bruta caindo 7,4 p.p.", "Portos e Terminais com queda de 38,9% na receita do trimestre"], "result": "Resultados do 4T25 foram mistos, refletindo ambiente desafiador do agronegócio com juros elevados e baixos preços de commodities. A receita consolidada caiu 13,3% no trimestre, com forte pressão nos segmentos de Fazendas, Agroindústrias e Portos. Margens operacionais comprimidas, com EBITDA recuando 29,4% no ano. Pontos positivos: lucro líquido cresceu 28,5% devido a melhora no resultado financeiro e créditos tributários; Negócios Internacionais em destaque com crescimento de 31,4%; Reposição & Serviços manteve resiliência. Forte geração de caixa permitiu distribuir R$ 145 milhões em dividendos (DY 10%).", "sunoView": "Mantemos visão positiva para KEPL3. Apesar do trimestre mais fraco devido ao cenário macroeconômico adverso (juros altos, preços baixos de commodities), os problemas são setoriais e não estruturais da empresa. A diversificação está funcionando, com destaque para Negócios Internacionais e Reposição & Serviços. A empresa mantém posição de liderança, estrutura financeira sólida com caixa líquido e forte geração de caixa (DY 10%). Com a recuperação dos preços de commodities e maior investimento no setor, o desempenho deve se recuperar. Recomendação de compra mantida.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "SOJA3", "name": "Boa Safra", "quarter": "4T25", "highlight": false, "sentiment": "negative", "rankScore": 3.2, "thesis": "Empresa do setor de sementes com estratégia de expansão de capacidade produtiva através de arrendamentos, focada em ganho de escala e eficiência operacional no mercado de sementes.", "thesisPros": ["Estratégia eficiente de expansão via arrendamento sem imobilização excessiva de capital", "Posicionamento estratégico no mercado de sementes", "Modelo de negócio com potencial de ganho de escala relevante", "Evita custos elevados de construção greenfield", "Ganho estrutural de market share: de 5,7% em 2020 para 10% em 2025", "Posição de liderança no setor de sementes", "Estratégia bem executada de ganhar mercado em momento de crise", "Endividamento controlado com dívida líquida de apenas R$ 151 milhões", "Crescimento histórico de 34% no volume de vendas de Big Bags"], "thesisCons": ["Dificuldades operacionais no curto prazo", "Exposição a ciclos do agronegócio", "Dependência de contratos de arrendamento de terceiros", "Setor cíclico e exposto a volatilidade de preços de commodities", "Dependência de fatores climáticos que impactam volume comercializável", "Necessidade de conceder prazos mais longos aos clientes pressiona capital de giro"], "resultPros": ["Receita líquida cresceu 29% no trimestre e 42% no ano, atingindo R$ 2,62 bilhões", "Volume de vendas atingiu 215 mil Big Bags, crescimento de 34% anual", "Caixa robusto de R$ 1,1 bilhão mantém solidez financeira"], "resultCons": ["EBITDA ajustado caiu 55% no trimestre para R$ 58,5 milhões", "Margem EBITDA desabou de 14% para 5%", "Prejuízo líquido de R$ 21,3 milhões no 4T25 (reversão do lucro do ano anterior)", "Lucro anual ajustado caiu 79% para apenas R$ 20 milhões", "Fluxo de caixa operacional negativo em R$ 89 milhões no ano", "Contas a receber consumiram R$ 320 milhões devido a prazos estendidos"], "result": "Resultado abaixo das expectativas com forte compressão de margens e reversão para prejuízo no trimestre, reflexo de ambiente desafiador no agronegócio com preços baixos de grãos e custos operacionais elevados. Apesar disso, empresa executou estratégia de ganho de participação de mercado sacrificando rentabilidade de curto prazo.", "sunoView": "Mantém recomendação apesar dos resultados fracos. Considera que o ganho de market share é estrutural e posicionará bem a empresa quando o ciclo das commodities melhorar. Acredita que a companhia está escolhendo conscientemente sacrificar margem para consolidar posição competitiva.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "CLSC4", "name": "CELESC", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 8.1, "thesis": "Celesc possui uma das melhores distribuidoras de energia do Brasil, localizada em Santa Catarina (estado com maior consumo médio por cliente do país). Opera com perdas baixas e controladas, combinando distribuição premium com geração rentável. Apresenta forte geração de caixa livre normalizado e dividendo sustentável estimado em R$ 8,66 por ação (8,5% a 7,1% do preço de recomendação). TIR real de 15% no preço de recomendação oferece margem de segurança.", "thesisPros": ["Crescimento consistente da base de consumidores (3,6 milhões, +3,3% vs 2024)", "Forte geração de fluxo de caixa livre (~11% do valor de mercado atual)", "Expansão de margem EBITDA de forma sustentável", "Foco em investimentos de expansão em distribuição", "Melhor perfil de consumidor do Brasil - maior consumo médio mensal (0,772 MWh vs 0,500 MWh nacional)", "Atende todos os 295 municípios de Santa Catarina com concessão até 2045", "Distribuidora representa 95% do EBITDA com perdas baixas e controladas", "Geração diversificada com 166 MW instalados (92% hídrica, 8% solar) e potencial de expansão de 40 MW", "Forte geração de caixa livre normalizado de R$ 593 milhões em 2025 (~11% do valor de mercado)", "Dividendo sustentável atrativo de R$ 8,66 por ação", "Estatual com gestão premium e governança diferenciada"], "thesisCons": ["Crescimento tímido no volume faturado (+1,2%)", "Capacidade instalada de geração estável sem expansão (125 MW)", "Resultado financeiro negativo e em deterioração (+59,1% no ano)", "Risco de estatual controlada pelo governo de Santa Catarina", "Exposição regulatória - tarifas sujeitas a reajustes anuais e revisões quinquenais", "Concentração geográfica em um único estado", "Segmento de distribuição é monopólio regulado sem crescimento orgânico significativo esperado (conservadorismo da tese)"], "resultPros": ["Excelente 4T25 com crescimento de consumidores em distribuição (+3,3% para 3,6 milhões)", "Receita líquida de R$ 2,7 bilhões no trimestre (+9,2% vs 4T24) e R$ 10,7 bilhões no ano (+11,0%)", "EBITDA de R$ 397 milhões no trimestre (+24,9%) e R$ 1,8 bilhão no ano (+16%)", "Expansão de margem EBITDA para 14,4% no trimestre (+2,2 p.p.) e 16,3% no ano (+0,9 p.p.)", "Lucro líquido de R$ 158 milhões no trimestre (+21,6%) e R$ 729 milhões no ano (+1,9%)", "Distribuição teve forte desempenho com EBITDA de R$ 360 milhões (+30,5%) no trimestre", "Fluxo de caixa livre normalizado de R$ 593 milhões no ano garante ~11% do valor de mercado"], "resultCons": ["Crescimento tímido no volume faturado de distribuição (+1,2% para 29.850 GWh)", "Resultado financeiro negativo de R$ 457 milhões no ano (+59,1% vs 2024)", "Geração teve crescimento modesto com EBITDA de R$ 28 milhões (+2%) no trimestre", "Capacidade instalada de geração permaneceu estável em 125 MW (sem expansão concretizada)", "CapEx elevado de R$ 1,5 bilhão focado em expansão pressiona caixa livre"], "result": "A Celesc entregou um excelente 4T25, encerrando 2025 com forte desempenho operacional e financeiro. A distribuidora mostrou resiliência com crescimento de consumidores (+3,3%) e expansão relevante de margem EBITDA (+2,2 p.p. no trimestre). O lucro líquido cresceu 21,6% no trimestre, enquanto o fluxo de caixa livre normalizado de R$ 593 milhões representa ~11% do valor de mercado, sustentando a atratividade da tese de dividendos. Apesar do crescimento modesto em volume e pressão financeira, os fundamentos permanecem sólidos.", "sunoView": "Recomendamos a compra das ações CLSC4. Com TIR real de 15% no preço de recomendação e mínimo de 12,5% no teto de R$ 122,00 (preço justo de R$ 152,00 com 20% de margem de segurança), a empresa mantém-se atrativa mesmo após valorização. O fluxo de caixa livre normalizado assegura ~11% do valor de mercado atual, mantendo a tese suficientemente interessante para continuidade na carteira.", "history": [{"quarter": "4T25", "result": "A Celesc entregou um excelente 4T25, encerrando 2025 com forte crescimento operacional. O trimestre apresentou receita de R$ 2,7 bilhões (+9,2%) e EBITDA de R$ 397 milhões (+24,9%), com margem expandindo 2,2 p.p. para 14,4%. No ano, receita atingiu R$ 10,7 bilhões (+11,0%) e EBITDA de R$ 1,8 bilhão (+16,0%). O lucro líquido trimestral foi de R$ 158 milhões (+21,6%), mas no ano cresceu apenas 1,9% para R$ 729 milhões devido ao impacto do resultado financeiro negativo. O fluxo de caixa livre normalizado de R$ 593 milhões representa aproximadamente 11% do valor de mercado.", "date": "2026-03-26"}], "lastUpdated": "2026-03-27"},
      {"ticker": "MLAS3", "name": "Grupo Multi", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 7, "thesis": "Companhia em recuperação operacional focada em ganho gradual de rentabilidade, com melhora consistente em margens e geração de caixa após período de reestruturação", "thesisPros": ["Administração diligente na limpeza de portfólio e recuperação da geração de caixa", "Saiu da zona de risco financeiro", "Caixa robusto de R$656 milhões suficiente para cobrir obrigações de curto prazo", "Retomada do pagamento de dividendos sinalizando confiança na estabilização"], "thesisCons": ["Margens ainda abaixo dos padrões históricos da companhia (4,5% em 2025)", "70% da dívida bruta com vencimento no curto prazo (R$342 milhões)", "Processo de recuperação gradual ainda em andamento"], "resultPros": ["Receita líquida de R$1,16 bilhão no 4T25, crescimento de 20,6% vs 4T24", "EBITDA ajustado de R$72 milhões com margem de 6,3%, alta de 109% a/a no trimestre", "Forte geração operacional de caixa de R$209 milhões no 4T25", "Gestão eficiente de estoques, redução de R$1,6bi para R$1,3bi", "Encerrou 2025 com caixa líquido positivo de R$166 milhões", "Reversão de prejuízo: lucro líquido ajustado de R$136 milhões em 2025"], "resultCons": ["Prejuízo de R$28 milhões no 4T25 devido a variação cambial não recorrente de R$55 milhões", "Margem EBITDA de 4,5% no ano ainda considerada baixa para os padrões da companhia"], "result": "Resultados sólidos no 4T25 com receita de R$1,16 bilhão (+20,6% a/a) e EBITDA ajustado de R$72 milhões (margem 6,3%). Destaque para forte geração de caixa de R$209 milhões e reversão do prejuízo anual. Impacto negativo pontual de variação cambial no resultado líquido do trimestre.", "sunoView": "A Multi demonstra recuperação consistente com crescimento de receita, melhora de margens e forte geração de caixa. A companhia saiu da zona de risco e está focada em ganho gradual de rentabilidade. Expectativa de continuidade do crescimento e maturação das margens operacionais em 2026.", "history": [], "lastUpdated": "2026-03-27"}
    ],
    Internacional: [
      {"ticker": "VNOM", "name": "Viper Energy Partners LP", "quarter": "2025", "highlight": true, "sentiment": "positive", "rankScore": 8.5, "intlSub": "Dollar Income", "thesis": "Modelo de negócio asset light focado em royalties de petróleo e gás na Bacia do Permiano, sem custos operacionais ou de perfuração, com alta conversão de receita em caixa e forte capacidade de distribuição aos acionistas. Parceria estratégica com Diamondback Energy proporciona crescimento orgânico e sinergias em aquisições.", "thesisPros": ["Produção +138%", "EBITDA +67%", "Modelo asset light sem custos de perfuração, operação ou abandono de poços", "Alta conversão de receita em geração de caixa livre (distribuição de ~75% do FCF)", "Crescimento orgânico através do desenvolvimento de reservas pelos operadores", "Parceria estratégica com Diamondback (42% do poder de voto) garante desenvolvimento contínuo", "Oportunidades de crescimento inorgânico em região fragmentada (Bacia do Permiano)", "Reservas provadas de 406 MMBOE com vida útil de ~9 anos", "Shareholder yield atrativo de 5% com premissas conservadoras"], "thesisCons": ["Exposição concentrada à Bacia do Permiano (100% da produção)", "Dependência de operadores terceiros para desenvolvimento das reservas", "Vulnerabilidade a variações nos preços de petróleo e gás natural", "Depleção natural das reservas requer aquisições contínuas para manter produção", "42% do poder de voto concentrado na Diamondback Energy"], "resultPros": ["Produção cresceu 91% A/A para 95,1 mil BOE/dia após aquisição da Sitio Royalties", "Receita aumentou 62% A/A para US$ 1,4 bilhão em 2025", "EBITDA expandiu 67% A/A para US$ 1,3 bilhão", "Caixa disponível para distribuição cresceu 60% A/A para US$ 507 milhões", "Distribuiu 95% do FCF aos acionistas (US$ 481 milhões em dividendos e recompras)", "2 mil novos poços horizontais colocados em produção em 2025", "Alavancagem confortável de 1,4x dívida líquida/EBITDA (cairá para 1,1x após venda de ativos)", "Novo programa de recompra de US$ 1 bilhão anunciado"], "resultCons": ["Preço médio de venda caiu ~20% A/A para US$ 34,80/BOE (ajustado por derivativos)", "Despesas operacionais aumentaram 19% A/A para US$ 24,00/BOE", "Depleção por BOE subiu 50% após aquisição da Sitio Royalties", "Royalty médio dos novos poços de apenas 2% (1,3% para não-Diamondback)"], "result": "A Viper Energy apresentou resultados sólidos em 2025, com forte crescimento de produção (+91%) e receita (+62%) impulsionados pela aquisição da Sitio Royalties. O EBITDA expandiu 67% e a empresa manteve disciplina na devolução de capital, distribuindo 95% do FCF. Apesar da pressão nos preços (-20%) e aumento nas despesas operacionais, a companhia demonstrou resiliência operacional com 2 mil novos poços em produção. A alavancagem permanece confortável em 1,4x e deve melhorar para 1,1x após desinvestimentos, aproximando a empresa da meta de distribuir 100% do FCF.", "sunoView": "Mantemos recomendação positiva. A Viper Energy oferece exposição atrativa ao setor de petróleo e gás com riscos mitigados através do modelo de royalties. Com shareholder yield estimado de 5%, alavancagem controlada e potencial de geração de caixa acumulada de US$ 9,5 bilhões (60% do valor de mercado), a empresa representa uma opção interessante para renda em dólar. A parceria com Diamondback e oportunidades de M&A na região fragmentada do Permiano sustentam o crescimento de longo prazo.", "history": [{"quarter": "2025", "result": "Forte crescimento via aquisição.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "HPQ", "name": "HP Inc.", "quarter": "1T26", "highlight": false, "sentiment": "positive", "rankScore": 7.5, "intlSub": "Dollar Income", "thesis": "Empresa sólida em setor maduro com poucos players e margens estáveis. Tese centrada no segmento de impressão (mais lucrativo, com custo de troca) e no segmento de sistemas pessoais com oportunidades de crescimento. Modelo asset light com terceirização da produção, resultando em alta geração de caixa e ROIC crescente. Foco em devolver capital aos acionistas via dividendos e recompras, mesmo após reestruturação de custos e foco em produtos de maior margem.", "thesisPros": ["Receita +6,9%", "AI PCs >35%", "Setor maduro com poucos players que não atrai novos entrantes", "Líder em impressoras (40% market share) com custo de troca e margens elevadas (18,3%)", "Segunda maior fabricante de PCs (20% market share)", "Modelo asset light com baixa necessidade de capital e alto ROIC", "Capital investido em redução com aumento de preços ao longo dos anos", "Forte política de distribuição de caixa (dividendos + recompras)", "Recomprou 60% do valor de mercado atual nos últimos 5 anos", "Plano de transformação com foco em IA visa gerar US$ 1 bi em economias até 2028"], "thesisCons": ["Custos memória", "Segmento de Sistemas Pessoais (70% da receita) possui margens muito inferiores ao de Impressão", "Indústria de PCs não cresce estruturalmente", "Alta dependência de terceirização na produção", "Exposição a volatilidade de preços de commodities (memória representa 35% do custo de PC)"], "resultPros": ["Receita líquida de US$ 14,4 bi, alta de 6,9% YoY (5,2% em moeda constante)", "Lucro líquido de US$ 545 mi, crescimento de 9% YoY", "Sistemas Pessoais cresceu 11% YoY para US$ 10,3 bi, liderado por Consumer (+16%) e Commercial (+9%)", "AI PCs representaram mais de 35% das remessas (vs 30% no trimestre anterior)", "Segmento de Impressão manteve margem sólida de 18,3% (faixa superior da meta)", "Retornou US$ 600 mi aos acionistas (US$ 277 mi em dividendos + US$ 325 mi em recompras)", "Empresa bem posicionada para capturar recuperação do mercado de PCs"], "resultCons": ["Margem operacional de Sistemas Pessoais em apenas 5%, impactada por custos de componentes", "Custos de memória (DRAM e NAND) representam 35% do custo de materiais de PC", "Receita de Impressão caiu 2% YoY para US$ 4,2 bi", "Receitas de suprimentos caíram 1%", "Fluxo de caixa operacional de apenas US$ 383 mi e FCL de US$ 175 mi (sazonalidade típica do 1T)", "Ventos contrários com volatilidade de custos de commodities"], "result": "Início de ano positivo com crescimento de receita acima do esperado (+6,9% YoY), impulsionado pela recuperação no ciclo de PCs e adoção de IA (AI PCs com 35% das remessas). Lucro cresceu 9% YoY. Sistemas Pessoais teve forte desempenho (+11%), mas margens pressionadas (5%) por custos de memória. Impressão estável com margem sólida de 18,3%, apesar da queda de 2% na receita. Retornou US$ 600 mi aos acionistas no trimestre.", "sunoView": "Recomendação inalterada com preço-teto de US$ 38,00 por ação. Empresa líder de mercado bem posicionada para capturar recuperação do mercado de PCs, apesar dos desafios de curto prazo nas margens por custos de componentes. Boa opção para quem busca dividendos e retorno consistente de capital.", "history": [{"quarter": "1T26", "result": "Acima do esperado com IA.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "EWBC", "name": "East West Bancorp Inc", "quarter": "4Q25", "highlight": false, "sentiment": "positive", "rankScore": 7.8, "intlSub": "Dollar Income", "thesis": "Banco de altíssima qualidade com vantagem competitiva dificilmente replicável na concessão de crédito à comunidade asiático-americana. Consegue identificar bons pagadores e emprestar com baixíssima inadimplência. Atrai depósitos a custo muito baixo e opera de forma extremamente eficiente.", "thesisPros": ["Receita +12%", "ROTCE 16,9%", "Vantagem competitiva sustentável baseada em relacionamento com comunidade asiático-americana", "Capacidade de captar depósitos a custo muito baixo (média histórica de 1% vs taxa básica de 2%)", "Expertise em identificar bons pagadores, resultando em inadimplência baixíssima (média de 0,13% em 10 anos)", "Gestão alinhada com geração de valor de longo prazo", "Operação extremamente eficiente com estrutura de custos enxuta", "ROE tangível consistentemente acima da média (média histórica de 17,1%)", "Licença para operar na China, facilitando negócios transpacíficos", "Capitalização robusta com CET1 de 15,1% (muito acima do mínimo regulatório de 6,5%)"], "thesisCons": ["Payout baixo (próximo de 30%), distribuindo pouco capital aos acionistas no curto prazo", "Concentração em um nicho específico (comunidade asiático-americana)", "Exposição a tensões geopolíticas entre EUA e China (embora 96% dos negócios sejam nos EUA)"], "resultPros": ["Receita total cresceu 12% a/a para US$ 2,9 bilhões em 2025", "Receita líquida de juros aumentou 12% a/a para US$ 2,6 bilhões", "Receitas de serviços subiram 13% a/a, com gestão de patrimônio crescendo 29%", "Lucro líquido ajustado de US$ 1,3 bilhão, alta de 13,7% vs 2024", "ROTCE sólido de 16,9%", "Inadimplência controlada em 0,11% da carteira média", "Aumento do dividendo trimestral de US$ 0,60 para US$ 0,80 por ação"], "resultCons": ["Crescimento da carteira de crédito foi modesto (2% vs 3T25)", "Base de depósitos cresceu apenas 0,7% no trimestre", "Provisões aumentaram US$ 108 milhões no ano"], "result": "Trimestre sólido com receitas e lucros crescendo double-digit. Banco mantém níveis excepcionais de qualidade de crédito e eficiência operacional. Crescimento orgânico moderado no trimestre, mas tendências de longo prazo permanecem intactas.", "sunoView": "Seguimos confiantes com a tese em EWBC e reforçamos a recomendação de compra, respeitando o preço-teto de US$ 110,00. O histórico consistente de mais de uma década reforça a qualidade da gestão.", "history": [{"quarter": "2025", "result": "Sólido.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "ALLY", "name": "Ally Financial Inc", "quarter": "2025", "highlight": false, "sentiment": "positive", "rankScore": 8.2, "intlSub": "Dollar Income", "thesis": "Banco digital líder nos EUA focado em financiamento automotivo, com modelo de negócio virtuoso que conecta revendedoras e consumidores. Possui vantagens competitivas pela ausência de agências físicas, permitindo oferecer melhores taxas. Negociado a múltiplos atrativos (10x lucro, P/VPA tangível ~1) que não refletem a qualidade do negócio após reestruturação bem-sucedida.", "thesisPros": ["Lucro ajustado +63%", "Perdas 1,28%", "Maior banco digital dos EUA em ativos e depósitos, pioneiro no segmento", "Líder de mercado em financiamento automotivo e capital de giro para concessionárias", "Modelo operacional enxuto sem agências físicas reduz custos e permite melhores taxas", "Rede de 21,4 mil revendedoras parceiras garante capilaridade nacional", "Base crescente de clientes millennials e gerações mais jovens (3,35 milhões de clientes)", "Múltiplos atrativos: 10x lucro normalizado e P/VPA tangível próximo de 1", "Histórico de crescimento com distribuição de dividendos e recompras"], "thesisCons": ["Exposição ao ciclo econômico e preços de veículos usados impacta margem financeira", "Pressão de inadimplência em cenários de desaceleração econômica", "Negócio intensivo em capital próprio típico do setor bancário", "Dependência do mercado automotivo americano"], "resultPros": ["Lucro líquido cresceu 32% atingindo US$ 742 milhões; lucro ajustado +63% para US$ 1,2 bilhão", "Receita líquida de juros subiu 3% para US$ 6,2 bilhões com menores custos de financiamento", "Custo médio dos depósitos caiu 0,62 p.p. para 3,56%", "Perdas líquidas melhoraram de 1,48% para 1,28% da carteira", "Índice CET1 saudável de 10,2% (bem acima do mínimo regulatório de 7,1%)", "Retomada de recompras com novo programa de US$ 2 bilhões", "43% das originações vieram de clientes com os mais altos níveis de crédito", "Atraiu 178 mil novos clientes em 2025"], "resultCons": ["Receita total recuou 4,2% para US$ 8 bilhões", "Carteira de crédito caiu 3% para US$ 134,3 bilhões devido a reestruturações", "Despesas operacionais subiram 4% para US$ 5,3 bilhões por custos de reestruturação", "ROE tangível de 10,4% ainda abaixo do potencial da empresa", "Redução de 9,2% no capital de giro para concessionárias", "Queda de 8% no financiamento de hipotecas"], "result": "Resultados sólidos em 2025 com forte crescimento de lucratividade (+32% no lucro líquido) impulsionado pela melhora da carteira de crédito, redução de custos de captação e reestruturações estratégicas. A inadimplência melhorou significativamente e o banco mantém capitalização robusta. Retomada da recompra de ações sinaliza confiança da gestão.", "sunoView": "A Ally apresentou bons números em 2025 graças à melhora da carteira de crédito, benefícios de menor custo de captação, reestruturação de negócios e corte de custos. Com o término das simplificações, resolução de questões regulatórias e melhorias no perfil da carteira, acreditamos que a companhia começará a devolver mais capital aos acionistas via recompras. Mantemos nossa recomendação inalterada.", "history": [{"quarter": "2025", "result": "Melhora na carteira.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "BTI", "name": "British American Tobacco", "quarter": "2025", "highlight": false, "sentiment": "neutral", "rankScore": 6.5, "intlSub": "Dollar Income", "thesis": "BAT possui vantagens competitivas duradouras no mercado de tabaco, com alto poder de precificação devido à dependência química da nicotina e fidelidade dos consumidores. Grandes barreiras regulatórias impedem novos entrantes. A empresa deve continuar gerando caixa consistentemente, pagando dividendos elevados especialmente após término da amortização de dívidas da aquisição da Reynolds (2017). Novas Categorias são tratadas como opcionalidades.", "thesisPros": ["Velo Plus 3 dígitos", "Poder de precificação excepcional devido à inelasticidade da demanda por nicotina", "Altíssima fidelidade dos consumidores às marcas de cigarro", "Preço relativo baixo do cigarro nos EUA permite sucessivos aumentos futuros", "Margens crescentes esperadas com queda de volumes e custos combinada com aumentos de preço", "Barreiras de entrada elevadíssimas: regulação intensa, proibição de marketing favorece incumbentes", "Geração de caixa consistente e previsível", "Histórico excepcional: melhor ação do FTSE 100 em 35 anos (33.123% de retorno acumulado até 2018)"], "thesisCons": ["Indústria de cigarros em declínio estrutural desde a década de 1960", "Futuro incerto das Novas Categorias, com barreiras de entrada menos definidas", "Riscos regulatórios e fiscais crescentes globalmente", "Dependência ainda muito alta de cigarros tradicionais (>80% da receita)"], "resultPros": ["Receita cresceu 2,1% em moeda constante apesar de queda reportada de 1% (efeito cambial)", "Novas Categorias cresceram 7% em moeda constante, já representam 18,2% da receita (+70bps vs 2024)", "Velo Plus com crescimento de três dígitos, alcançou 2ª posição no mercado americano", "Forte desempenho em combustíveis nos EUA e região AME", "Margem operacional ajustada estável em 44%", "Dívida bruta caiu 5,1%, alavancagem no caminho da meta de 2-2,5x até final de 2026", "Dividendos cresceram 2% e anunciado buyback de £1,3 bilhão para 2026", "34,1 milhões de consumidores nas Novas Categorias (+5 milhões vs ano anterior)"], "resultCons": ["Receita reportada caiu 1% devido a efeitos cambiais desfavoráveis", "Região APMEA enfrentou desafios fiscais e regulatórios (Bangladesh e Austrália)", "Fluxo de caixa operacional despencou 37,4% para £6,34 bilhões (impacto de pagamentos)", "Fluxo de caixa livre de apenas £3,9 bilhões", "Categoria vape continua impactada por produtos ilícitos", "Dívida líquida ainda elevada em £31,21 bilhões (praticamente estável)"], "result": "Resultado sólido com crescimento orgânico de 2,1% em moeda constante e aceleração das Novas Categorias (7% crescimento). Margens operacionais ajustadas estáveis em 44%. Principal destaque negativo foi a queda de 37,4% no fluxo de caixa operacional devido a pagamentos extraordinários. Alavancagem continua em trajetória de queda rumo à meta. Retorno aos acionistas robusto com dividendos crescentes e buyback de £1,3bi anunciado.", "sunoView": "Recomendação de compra mantida com preço-teto de US$ 50,00. BAT segue com alavancagem em queda, Novas Categorias em expansão e distribuição robusta de capital aos acionistas. A tese permanece intacta.", "history": [{"quarter": "2025", "result": "Transição avançando.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "PAM", "name": "Pampa Energía", "quarter": "2025", "highlight": false, "sentiment": "neutral", "rankScore": 6.8, "intlSub": "Hidden Value", "thesis": "A Pampa Energía é a maior empresa independente do setor de energia da Argentina, atuando principalmente em Geração de Energia Elétrica e Exploração e Produção de Petróleo e Gás Natural. A empresa possui 15% da geração de energia do país, 8% da reserva de Vaca Muerta (segunda maior reserva não convencional de gás do mundo) e participações estratégicas na Transener (26,33%) e TGS (26,91%). Com gestão de qualidade, a companhia demonstra capacidade de expansão eficiente, especialmente no desenvolvimento do bloco Rincón de Aranda, que deve atingir 45 mil barris/dia até 2027.", "thesisPros": ["Dívida <1,1x", "Melhoria regulatória: novas resoluções (294/24 e 400/25) aumentaram remuneração das termelétricas e estabeleceram sistema marginal de preços"], "thesisCons": ["Ambiente político e econômico incerto na Argentina representa risco contínuo"], "resultPros": ["Receita +6,5%", "EBITDA +7,7%", "Empresa extremamente descontada: negociada a 7,11x EV/EBITDA, com valuation por DCF indicando potencial de 1,7x o valor atual de mercado", "Forte crescimento operacional: receita +6,5% e EBITDA +7,7% em 2025, com expansão robusta em petróleo e gás (+18%) e geração de energia (+18%)", "Balanço saudável com baixa alavancagem: dívida líquida de apenas 1,1x EBITDA (US$ 801 milhões), permitindo continuidade dos investimentos", "Expansão acelerada em petróleo: produção de Rincón de Aranda aumentou 9,5x (de 1 mil para 9,5 mil barris/dia), com pico de 20 mil barris/dia e meta de 45 mil barris/dia até 2027", "Reservas em crescimento: aumento de 28% nas reservas (296 milhões boe), com taxa de reposição de 3,2x e vida útil de 10,2 anos", "Posição dominante no mercado argentino: 15% da geração elétrica, 8% de Vaca Muerta, participações estratégicas em transmissão e transporte de gás", "Sinergias operacionais: autogestão de gás para geração própria atingindo 41%, capturando margens integradas"], "resultCons": ["Lucro -38%", "Fluxo de caixa livre negativo: FCL de -US$ 376 milhões em 2025 devido aos altos investimentos (CapEx de US$ 1 bilhão), com virada positiva apenas esperada para 2027", "Queda no lucro líquido: redução de 38% para US$ 377 milhões devido a impostos maiores versus benefício fiscal de 2024", "Segmento petroquímico em dificuldade: queda de 14% na receita com EBITDA negativo de US$ 5 milhões", "Exposição a preços internacionais de commodities: preço médio do petróleo caiu 12,4% e pressões no gás natural", "Intensidade de capital elevada: US$ 1,2 bilhão de CapEx previsto para 2026, mantendo pressão no caixa", "Custos operacionais em alta: custos de vendas +19% e despesas administrativas +38% no segmento de petróleo e gás"], "result": "Em 2025, a Pampa Energía reportou receita de US$ 2 bilhões (+6,5% vs 2024) e EBITDA de US$ 1 bilhão (+7,7%). O lucro líquido foi de US$ 377 milhões (-38%), impactado por impostos maiores. O segmento de geração apresentou receita de US$ 792 milhões (+18%) e EBITDA de US$ 427 milhões (+21%), com margem de 60%. Petróleo e gás registrou receita de US$ 862 milhões (+18%) e EBITDA de US$ 375 milhões (+8%). A produção consolidada atingiu 84,4 mil boe/dia (+8%), com destaque para Rincón de Aranda (9,5 mil barris/dia vs 1 mil em 2024). A dívida líquida foi de US$ 801 milhões (1,1x EBITDA). O FCL foi negativo em US$ 376 milhões devido ao CapEx de US$ 1 bilhão focado em expansão.", "sunoView": "A análise considera a Pampa Energía extremamente descontada, negociando a apenas 7,11x EV/EBITDA para uma empresa em pleno crescimento. O valuation por DCF aponta para 1,7x o valor atual de mercado, e por custo de reposição a empresa vale US$ 6,4 bilhões (1,5x o valor de mercado de US$ 4,2 bilhões). Apesar dos desafios do ambiente argentino, a companhia demonstra gestão de qualidade, com investimentos eficientes gerando forte expansão operacional. O desenvolvimento de Rincón de Aranda é um marco crucial, com produção aumentando de 1 mil para 20 mil barris/dia, rumo à meta de 45 mil barris/dia em 2027. O balanço saudável (alavancagem de apenas 1,1x) permite continuidade dos investimentos mesmo com FCL temporariamente negativo. A recomendação é mantida como positiva.", "history": [{"quarter": "2025", "result": "Bons resultados.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "GPRK", "name": "GeoPark", "quarter": "2025", "highlight": false, "sentiment": "negative", "rankScore": 4, "intlSub": "Hidden Value", "thesis": "Petróleo LatAm.", "thesisPros": ["FCL yield ~19%", "84% hedgeado"], "thesisCons": [], "resultPros": ["FCL yield ~19%", "84% hedgeado"], "resultCons": ["Produção -17%", "Receita -22%"], "result": "Declínio esperado. Foco Vaca Muerta.", "sunoView": "Inalterada.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "IRS", "name": "IRSA Inversiones y Representaciones Sociedad Anónima", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 6.2, "intlSub": "Hidden Value", "thesis": "IRSA é a maior empresa do setor imobiliário argentino, proprietária de 17 shopping centers (principalmente em Buenos Aires) em localizações premium. A empresa está extremamente descontada devido ao cenário macroeconômico adverso da Argentina. Avaliação conservadora por soma das partes indica valor potencial de US$ 1,9 bi (1,5x o valor de mercado atual). Com cap rate de 14% e EV de US$ 1,7 bi, representa oportunidade de investimento em ativos de alta qualidade a preços depreciados.", "thesisPros": ["Receita locação +5,1%", "Shoppings 97,7%", "Maior operadora de shoppings da Argentina com 17 propriedades em localizações premium", "Portfólio de alta qualidade em Buenos Aires com alto PIB per capita", "84% da receita dos shoppings vem de componentes fixos reajustados pela inflação", "Taxa de ocupação elevada: 97,7% nos shoppings e 98,9% nos escritórios", "Reserva de 14,7 milhões de m² de terrenos para desenvolvimento futuro", "Valuation atrativo: negociando a cap rate de 14% vs valor potencial 1,5x superior", "Contratos ajustados mensalmente pelo índice de inflação (proteção)", "Rentabilidade por m² supera operadoras brasileiras como Multiplan e Iguatemi"], "thesisCons": ["Exposição total ao risco Argentina (hiperinflação, contas públicas desajustadas)", "Risco de moratória da dívida externa argentina por escassez de dólares", "Histórico de perdas significativas (US$ 1 bi no IDB Group em 2020)", "Ambiente macroeconômico adverso impacta consumo e vendas dos lojistas", "Concentração geográfica em mercado com alta volatilidade política e econômica"], "resultPros": ["Taxa de ocupação resiliente: 97,7% nos shoppings (estável) e 98,9% nos escritórios", "Receita dos shoppings cresceu 2% no ano, totalizando US$ 60 milhões no 4T25", "Aluguel base aumentou 12,6% vs 4T24, compensando queda nas vendas dos lojistas", "Segmento de escritórios com receita +18,4% e ocupação de 100% no portfólio A/A+", "Segmento hoteleiro mostrou recuperação: receita +14,1% e EBITDA +127,4%", "EBITDA consolidado de locação alcançou US$ 53,5 milhões (+6,2%) com margem de 66%", "Expansão em andamento: Shopping Distrito Diagonal com 23% de obras concluídas e 78% dos contratos fechados", "Aquisição estratégica de imóvel em Buenos Aires por US$ 6,8 milhões para requalificação"], "resultCons": ["Vendas dos inquilinos caíram 9,02% em termos reais no 4T25 (US$ 657,3 milhões)", "EBITDA dos shoppings ficou apenas alinhado ao ano anterior (US$ 45,2 milhões)", "Fluxo de clientes nos shoppings permanece pressionado pela atividade econômica fraca", "Segmento hoteleiro ainda abaixo dos níveis recordes dos últimos dois anos", "Competitividade cambial continua sendo desafio para o setor hoteleiro"], "result": "Resultados do 4T25 foram mistos mas resilientes. Apesar da queda real de 9% nas vendas dos lojistas, a receita dos shoppings cresceu 2% no ano devido ao maior aluguel base (+12,6%) e reajustes mensais pela inflação. A taxa de ocupação permaneceu elevada (97,7% shoppings, 98,9% escritórios). O segmento hoteleiro apresentou forte recuperação com EBITDA +127%. A empresa segue expandindo com novo shopping previsto para 2027 e aquisições estratégicas, totalizando potencial de 458 mil m² de ABL.", "sunoView": "Mantemos recomendação. A IRSA continua apresentando resiliência operacional mesmo em cenário macroeconômico adverso. A mudança regulatória permitindo reajuste mensal dos aluguéis pela inflação fortalece o modelo de negócio. Com 84% da receita em componentes fixos indexados, a empresa está mais protegida contra quedas no consumo. O valuation permanece atrativo (cap rate 14%, potencial de valorização de 50%) e a expansão planejada deve adicionar valor. Recuperação econômica da Argentina pode destravar valor significativo.", "history": [{"quarter": "4T25", "result": "Shoppings recuperando.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "HCC", "name": "Warrior Met Coal Inc", "quarter": "4T25", "highlight": false, "sentiment": "negative", "rankScore": 4.5, "intlSub": "Hidden Value", "thesis": "Warrior Met Coal é uma das mineradoras de carvão metalúrgico com menor custo de produção no mundo, operando em um setor mal compreendido mas essencial para produção de aço. A conclusão do projeto Blue Creek aumentará capacidade em ~90% e reduzirá ainda mais os custos. Setor tem oferta restrita devido a falta de investimentos, com expectativa de demanda superar oferta até 2030.", "thesisPros": ["Caixa líquido", "Custo de produção no primeiro quartil global devido à geologia favorável das jazidas", "Balanço sólido com caixa líquido de US$ 104,9 milhões (fim 2025)", "Blue Creek aumentará produção de 8 Mst para ~15 Mst, reduzindo custos por tonelada", "Localização estratégica: 300 milhas do Porto de Mobile, vantagem logística vs Austrália para Europa/América do Sul", "Reservas de 197,6 Mst garantem +9 anos de vida útil", "Setor com barreiras à entrada: novas minas levam 7-15 anos, investimentos caíram de US$ 9,5bi (2011) para US$ 1,5bi (2023)", "Carvão metalúrgico essencial para produção de aço sem substitutos de curto prazo"], "thesisCons": ["Setor historicamente volátil e cíclico, sujeito a grandes oscilações de preço", "Dependência de fatores externos: geopolítica, políticas energéticas, crise imobiliária China", "Pressões ESG dificultam acesso a financiamento e seguros", "Alavancagem operacional significativa amplifica impacto de variações de preço", "Exportações chinesas de aço (recorde 119 Mt em 2025) pressionam preços globais", "Adequado apenas para investidores que toleram alta volatilidade"], "resultPros": ["Produção cresceu 24% para 10,2 Mst em 2025, Blue Creek contribuiu com 2,0 Mst", "Custo caixa caiu 19% para US$ 101/st, atingindo US$ 94/st no 4T25", "Blue Creek antecipada em 8 meses, dentro do orçamento (US$ 957M investidos de US$ 1,1B total)", "Projeção de 12,5 Mst em 2026 com Blue Creek produzindo 4-5 Mst", "Conclusão de investimentos em 1T26, iniciando fase de geração de caixa", "Preços melhoraram no início de 2026 devido escassez de carvão alta qualidade na Austrália"], "resultCons": ["Receita caiu 14% para US$ 1,3B devido queda de preço de US$ 199 para US$ 133/st", "Preço médio líquido caiu US$ 6/st no 4T25 vs 3T25 por maior participação de High-Vol A", "Lucro líquido de apenas US$ 57M em 2025", "Fluxo de caixa livre negativo de US$ 173M (positivo US$ 149M excluindo CapEx Blue Creek)", "Expectativa de FCL negativo no 1S26 devido crescimento capital de giro e CapEx final", "Fundamentos siderúrgicos globais fracos, preços pressionados nos últimos 2 anos"], "result": "Resultados de 2025 refletem ambiente desafiador com queda de 14% na receita devido colapso de preços (US$ 199 para US$ 133/st), parcialmente compensada por aumento de 21% no volume. Lucro foi apenas US$ 57M e FCL negativo em US$ 173M, mas Blue Creek avançou conforme planejado, antecipada em 8 meses. Custos caíram 19% para US$ 101/st com tendência de maior redução. Empresa finaliza ciclo de investimentos em 1T26 para iniciar fase de geração de caixa.", "sunoView": "Mantemos Warrior na carteira recomendada. Apesar do ambiente desafiador com preços fracos, a empresa mantém posição competitiva com custos baixos e balanço sólido. Blue Creek está próxima da conclusão e transformará o perfil operacional, aumentando produção em ~90% e reduzindo custos. Com fim dos investimentos em 1T26, empresa entrará em fase de geração de caixa e potencial distribuição aos acionistas. Investimento adequado para perfil que tolera volatilidade e não deve representar posição muito grande no portfólio.", "history": [{"quarter": "2025", "result": "Blue Creek quase pronta.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "AMR", "name": "Alpha Metallurgical Resources Inc", "quarter": "2025", "highlight": false, "sentiment": "negative", "rankScore": 3.2, "intlSub": "Hidden Value", "thesis": "Produtora de carvão metalúrgico para fabricação de aço, operando em setor pouco compreendido e evitado por investidores. Apesar dos desafios de ESG e custos elevados, o carvão metalúrgico permanece insumo indispensável sem substitutos viáveis no curto prazo. A demanda deve se manter estável ou crescer, especialmente em mercados emergentes asiáticos como Índia, enquanto a oferta tende a diminuir devido à falta de investimentos em novas minas e pressões regulatórias.", "thesisPros": ["+US$400M caixa", "Custo -8,7%/ton", "Carvão metalúrgico é insumo indispensável para produção de aço sem substitutos viáveis no curto prazo", "Demanda crescente em países emergentes da Ásia, especialmente Índia que planeja expandir produção de aço para 300M toneladas até 2030", "75% das vendas são para exportação, beneficiando-se de mercados em crescimento", "Escassez de oferta esperada nos próximos anos devido à falta de investimentos em novas minas e pressões ESG", "Balanço sólido com caixa líquido e praticamente sem dívidas (US$ 524M em liquidez vs US$ 13M em dívida)", "Grande alavancagem operacional - pequenas variações no preço do carvão geram crescimento expressivo nos lucros", "Histórico de retorno aos acionistas: US$ 1,2 bilhão em recompras entre 2021-2025, reduzindo ações em 31%", "Free cash flow yield de 32% com base em premissas conservadoras de geração normalizada"], "thesisCons": ["Setor cíclico altamente volátil dependente de commodities", "Não possui o menor custo do setor, operando próximo ao prejuízo com preços atuais", "Pressões regulatórias ESG dificultam aprovações, financiamentos e seguros", "Declínio secular da demanda na América do Norte e Europa", "Custos de produção elevados (mão de obra, eletricidade, diesel, explosivos, transporte, questões ambientais)", "Dependência do mercado de aço global, especialmente China que enfrenta crise imobiliária", "Bancos e investidores afastando-se do setor em favor de energias renováveis"], "resultPros": ["Custo de produção caiu 18,6% para US$ 1,5 bilhão (US$ 102,23/tonelada, -8,7% vs 2024) devido a medidas de economia", "Liquidez robusta de US$ 524,3 milhões mantida apesar do consumo de caixa", "Posição de caixa líquido preservada com apenas US$ 13,4M em dívida de longo prazo", "Progresso no desenvolvimento da mina Kingston Wildcat com previsão de 500 mil toneladas em 2026", "37% do volume de carvão metalúrgico para 2026 já contratado a US$ 134,02/tonelada"], "resultCons": ["Volume de vendas caiu 11% para 15,3 milhões de toneladas devido à baixa demanda", "Preço médio de venda recuou 18% para US$ 117,08/tonelada", "Receita caiu 27% para US$ 1,8 bilhão", "Margem bruta despencou 51,5% para US$ 14,85/tonelada", "EBITDA de US$ 121,8 milhões, queda de 70,1% vs 2024", "Prejuízo líquido de US$ 61,7 milhões em 2025", "Fluxo de caixa livre negativo de US$ 20 milhões (FCO US$ 145M - CapEx US$ 127M - DTA US$ 38M)", "Mercado de carvão metalúrgico permanece fraco sem perspectiva de melhora imediata", "Aumento de produção em outras regiões pode pressionar ainda mais os preços"], "result": "Resultado anual fraco de 2025 com quedas significativas em volume (-11%), preço (-18%), receita (-27%) e EBITDA (-70%), resultando em prejuízo de US$ 62M e FCF negativo de US$ 20M. Apesar das medidas de redução de custos (-18,6%), a margem bruta caiu 51,5%. A empresa mantém solidez financeira com US$ 524M em liquidez e caixa líquido, mas enfrenta mercado deprimido sem catalisadores de curto prazo.", "sunoView": "Mantemos recomendação inalterada. Apesar do cenário desafiador com preços deprimidos do carvão metalúrgico devido à crise imobiliária chinesa e excesso de oferta pontual, acreditamos que os preços atuais são insustentáveis no longo prazo. A tese baseia-se na demanda estrutural por carvão metalúrgico (sem substitutos viáveis), crescimento em mercados emergentes asiáticos e escassez futura de oferta. Com balanço sólido (caixa líquido), a empresa tem respaldo para atravessar o ciclo negativo. O valuation de 32% FCF yield em cenário normalizado oferece assimetria atrativa, especialmente considerando o potencial de retorno aos acionistas via recompras quando o mercado se normalizar.", "history": [{"quarter": "2025", "result": "Mercado fraco.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "PROSY", "name": "Prosus/Tencent", "quarter": "2025", "highlight": false, "sentiment": "positive", "rankScore": 7.5, "intlSub": "Hidden Value", "thesis": "Holding Tencent com desconto.", "thesisPros": ["Tencent receita +14%", "Games intl +33%"], "thesisCons": [], "resultPros": ["Tencent receita +14%", "Games intl +33%", "Cloud lucrou US$711M"], "resultCons": ["MAU +2%"], "result": "Positivo. IA e Cloud.", "sunoView": "Desconto atrativo.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "BABA", "name": "Alibaba", "quarter": "4T25", "highlight": false, "sentiment": "neutral", "rankScore": 5.5, "intlSub": "Hidden Value", "thesis": "E-commerce China. Cloud IA.", "thesisPros": ["Receita ajustada +9%", "Cloud +36%"], "thesisCons": [], "resultPros": ["Receita ajustada +9%", "Cloud +36%", "Caixa US$42,4 bi"], "resultCons": ["Lucro op. -53%", "FCL -71%"], "result": "Fase de investimentos.", "sunoView": "Mantém.", "history": [], "lastUpdated": "2026-03-27"},
      {"ticker": "BFH", "name": "Bread Financial Holdings", "quarter": "4T25", "highlight": false, "sentiment": "positive", "rankScore": 8, "intlSub": "Hidden Value", "thesis": "Banco altamente rentável focado em cartões de crédito private label e co-brand, com margens líquidas excepcionais (NIM ~19%) devido ao foco em crédito ao consumidor com taxas atrativas. Apesar da maior complexidade e incertezas regulatórias (especialmente sobre late fees), o capital retido é reinvestido a taxas atrativas que compensam o baixo payout.", "thesisPros": ["NIM 18,9%", "Perdas 7,4%", "Margens financeiras (NIM) extremamente altas de 18,9%, muito superiores aos bancos tradicionais", "Quarta maior emissora de cartões private label dos EUA com 39+ milhões de contas ativas", "Modelo de negócio diversificado entre private label (53% empréstimos), co-brand (maior parte das vendas) e soluções BNPL", "Taxas de juros atrativas no segmento (20-30% a.a.) compensam inadimplência estruturalmente mais alta", "Histórico de desalavancagem bem-sucedida após spin-off, mais que duplicando patrimônio tangível por ação", "Otimização do funding com depósitos DTC crescendo para 48% do total (vs 43% ano anterior)"], "thesisCons": ["Risco regulatório", "Maior complexidade operacional e incertezas regulatórias que desafiam o modelo de negócio", "Exposição a regulação de late fees que pode impactar receitas futuras", "Inadimplência estruturalmente mais alta que outras modalidades de crédito", "Baixo payout com pouca distribuição via dividendos e recompras historicamente", "Alta volatilidade da ação exige maior tolerância ao risco", "Pressão potencial na receita de juros com cortes futuros do Fed"], "resultPros": ["Receita cresceu 5% a/a para US$ 975 milhões com receita líquida de juros +6%", "Melhora significativa na qualidade de crédito: taxa de perda líquida caiu de 8% para 7,4%", "Provisão para perdas reduziu 11% a/a para US$ 373 milhões com perdas de principal -8%", "Lucro líquido de US$ 53 milhões vs US$ 8 milhões no 4T24, lucro ajustado por ação de US$ 2,07", "CET1 sólido em 13% (+60bps a/a) e TBV por ação cresceu 23% para US$ 57,57", "Retorno aos acionistas de US$ 350 milhões no ano com recompra de US$ 120 milhões no trimestre e dividendo elevado em 10%", "Vendas de crédito cresceram 3% para US$ 8,1 bilhões com gastos de uso geral resilientes", "Depósitos DTC cresceram 11% a/a para US$ 8,5 bilhões otimizando estrutura de funding"], "resultCons": ["Carteira média de crédito recuou 1% para US$ 18 bilhões devido ao aumento na taxa de pagamento", "Despesas totais subiram 4% a/a para US$ 555 milhões, impactadas por US$ 55 milhões em custos de recompra de dívida", "CET1 caiu 100bps sequencialmente apesar do aumento anual", "Projeção conservadora de crescimento de apenas low single digits para empréstimos e receita em 2026", "Taxa de inadimplência ainda elevada em 5,8% apesar da melhora relativa"], "result": "Resultado bastante positivo com forte melhora na qualidade de crédito (perdas caindo de 8% para 7,4%), lucro líquido saltando de US$ 8 para US$ 53 milhões, e sólida geração de capital com TBV crescendo 23%. A otimização do funding e eficiência operacional continuam avançando, enquanto a companhia intensifica retorno aos acionistas.", "sunoView": "Recomendação inalterada. Tese de maior complexidade que exige tolerância à volatilidade, mas resultados recentes têm sido bastante positivos. Aos investidores interessados em montar ou elevar posição, recomendam aguardar preço mais atrativo ou melhoria operacional. Principais pontos de atenção seguem sendo as perdas e adaptação à regulação de late fees.", "history": [{"quarter": "4T25", "result": "Melhora na inadimplência.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "SIRI", "name": "Sirius XM Holdings Inc", "quarter": "4Q25", "highlight": false, "sentiment": "neutral", "rankScore": 6.5, "intlSub": "Great Companies", "thesis": "A Sirius XM é um monopólio em rádio via satélite nos EUA com modelo de negócio altamente rentável baseado em programação linear de áudio. A empresa possui vantagens competitivas duráveis (licenças exclusivas da FCC, relacionamento de décadas com indústrias musical e automotiva) e gestão eficiente na alocação de capital. A programação linear em áudio mantém relevância, diferentemente do vídeo, pois permite multitarefa e requer menos atenção ativa dos usuários.", "thesisPros": ["Capex caindo", "Monopólio em rádio via satélite nos EUA com licenças exclusivas da FCC", "Modelo de negócio altamente rentável, superior ao Spotify devido à programação linear", "Relacionamento consolidado de décadas com indústrias musical e automotiva", "Gestão competente com histórico consistente de alocação de capital e retorno aos acionistas", "Pricing power demonstrado historicamente, aumentando geração de caixa sem grandes reinvestimentos", "Portfólio único e extenso de canais (música, esportes, notícias, podcasts)", "Programação linear em áudio mantém relevância e atende demanda específica que streaming não consegue"], "thesisCons": ["Base de assinantes em declínio gradual (-300 mil assinantes pagantes em 2025)", "Dependência do mercado automotivo para aquisição de novos clientes", "Competição com plataformas de streaming (Spotify, Pandora) e rádio AM/FM tradicional", "Alavancagem ainda elevada (dívida líquida/EBITDA de 3,6x)", "Custos de aquisição de clientes (SAC) em elevação"], "resultPros": ["Fluxo de caixa livre cresceu 24% para US$ 1,26 bilhão, impulsionado por disciplina de custos", "Churn em níveis históricos baixos de 1,5% mensal, demonstrando alta retenção", "Adição líquida de 110 mil assinantes pagantes no 4T25, revertendo tendência", "Tecnologia 360L presente em mais de 50% dos novos veículos, com taxas de conversão superiores", "Renovação de 3 anos com Howard Stern, com aumento de 32% em mídia espontânea", "Margem bruta robusta de 59% no segmento Sirius XM", "Investimentos em satélites em fase final (US$ 115 milhões em 2026, US$ 50 milhões em 2027)", "Economia de US$ 250 milhões em custos ao longo de 2025", "Mais de 50% da base com mais de 10 anos de assinatura"], "resultCons": ["Receita caiu 2% para US$ 8,56 bilhões em 2025", "Base total de assinantes em 32,9 milhões, com saída líquida de 300 mil pagantes no ano", "ARPU praticamente estável em US$ 15,17, sem crescimento significativo", "Custo de aquisição (SAC) mais elevado em US$ 18,21 por instalação", "Redução de intensidade no segmento de streaming para focar em veículos", "Expectativa de primeiro ano de queda nas vendas de veículos novos desde 2022"], "result": "A Sirius XM apresentou resultados mistos no 4Q25, com receita em queda de 2% mas fluxo de caixa livre crescendo 24% para US$ 1,26 bilhão, demonstrando execução de disciplina de custos. Destaque para o churn em níveis históricos de 1,5%, a renovação com Howard Stern e a expansão da plataforma 360L. A base de assinantes caiu 300 mil no ano, mas reverteu no 4T25 com adição de 110 mil. A empresa mantém forte geração de caixa e caminha para reduzir alavancagem para 3-3,5x até final de 2026.", "sunoView": "Mantemos visão positiva. A Sirius XM continua com fundamentos sólidos, vantagens competitivas duráveis e gestão eficiente. O mercado precifica o ativo de forma excessivamente negativa. Com fluxo de caixa livre crescente, investimentos em satélites chegando ao fim e meta de desalavancagem próxima, a empresa está bem posicionada para retornar praticamente todo o caixa aos acionistas. Aos preços atuais, enxergamos elevada margem de segurança.", "history": [{"quarter": "2025", "result": "Fundamentos sólidos.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "LBRDA", "name": "Liberty Broadband Corp - Series A", "quarter": "4Q25", "highlight": false, "sentiment": "positive", "rankScore": 7, "intlSub": "Great Companies", "thesis": "Liberty Broadband possui 28,5% de participação na Charter Communications, empresa de qualidade com vantagens competitivas e forte geração de caixa. A tese se baseia na exposição à Charter, que é líder em telecomunicações nos EUA com infraestrutura praticamente irreplicável e presença em 41 estados. Fusão com Charter prevista para junho/2027 e Charter adquirindo Cox Communications (12M casas passadas adicionais).", "thesisPros": ["FCL yield 35%", "Móvel +22%", "Exposição à Charter Communications (2ª maior operadora de cabo dos EUA) com 28,5% de participação", "Charter possui vantagens competitivas por escala e infraestrutura irreplicável, operando como monopolista em várias áreas", "Forte geração de caixa: FCF de US$ 10bi (34% do market cap), ajustado pela participação LBRDA = 35%", "Gestão focada em retornar capital via recompras - devolveu US$ 5,4bi em 2025 (redução de 11% nas ações)", "Fusão LBRDA-Charter simplificará estrutura e aumentará liquidez (conclusão prevista junho/2027)", "Charter adquirindo Cox: +12M casas passadas, +6,3M clientes, expansão para Las Vegas e Phoenix", "Ciclo de CapEx pesado chegando ao fim: US$ 11,7bi (2025) → US$ 11,4bi (2026) → US$ 9,5bi (2027) → <US$ 8bi (2028+)"], "thesisCons": ["Perda 405k internet", "Desconto em relação ao NAV praticamente zerado - negociando pelo valor justo dos ativos", "Participação será diluída para 23% após fusão Charter e 17% após fusão Charter-Cox", "Ambiente competitivo intenso: concorrência de fibra óptica e internet via celular aumentando", "Estrutura de holding adiciona complexidade (recomendação atual é investir direto na Charter)", "Dívida líquida Charter de US$ 94,7bi (4,2x EBITDA)"], "resultPros": ["FCF de US$ 5bi em 2025 (+US$ 747M vs 2024), representando 34% do valor de mercado", "Telefonia móvel cresceu forte: 11,7M linhas (+20% vs 2024), adicionando 2M linhas no ano", "Perda de clientes de internet melhorou: -405k em 2025 vs -507k em 2024", "TV a cabo teve perda menor: -287k assinantes vs -1,2M em 2024, com adição líquida de 44k no 4Q25", "Margem EBITDA sólida de 41,8% mantida (US$ 22,7bi)", "Expansão rural atingiu 1,3M casas passadas com penetração de 37,5%", "Custos de programação caíram 8,6% para US$ 8,8bi"], "resultCons": ["Receita estável em US$ 54,8bi (0% de crescimento vs 2024)", "Perda líquida de 405k assinantes de internet, totalizando 29,7M clientes (-1,3% vs 2024)", "Base de TV a cabo caiu para 12,6M assinantes", "Telefonia fixa em queda contínua: 6M acessos (-12% ano a ano)", "CapEx ainda elevado em US$ 11,7bi (sendo US$ 1,1bi atualização e US$ 4bi expansões)", "Lucro líquido caiu 2% para US$ 5bi"], "result": "Charter apresentou resultados resilientes em ambiente competitivo difícil. Receita estável em US$ 54,8bi com margem EBITDA sólida de 41,8%. Destaque para crescimento de 20% em telefonia móvel (11,7M linhas) e melhora nas perdas de internet (-405k vs -507k) e TV cabo (-287k vs -1,2M). FCF de US$ 5bi (+15% vs 2024) com US$ 5,4bi devolvidos via recompras. CapEx no pico de US$ 11,7bi começará a cair em 2026, liberando mais caixa. Fusão com Cox adicionará escala significativa.", "sunoView": "Mantemos a posição em LBRDA pela exposição à Charter Communications, empresa de qualidade com vantagens competitivas e forte geração de caixa (FCF yield de 34%). Embora o desconto ao NAV tenha zerado, a tese se baseia na qualidade do ativo subjacente. Com o fim do ciclo de CapEx pesado e conclusão das fusões (Charter-LBRDA e Charter-Cox), esperamos retomada da devolução massiva de capital. Para novos investimentos, recomendamos exposição direta via Charter Communications (CHTR).", "history": [{"quarter": "2025", "result": "Não depende de crescimento.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "AMZN", "name": "Amazon", "quarter": "4Q25", "highlight": true, "sentiment": "positive", "rankScore": 8.5, "intlSub": "Great Companies", "thesis": "Amazon é uma companhia compounder de alta qualidade, com vantagens competitivas robustas (economia de escala e efeito de rede), extensas avenidas de crescimento (AWS, anúncios e e-commerce) e gestão exímia. Opera sob o flywheel de Bezos focando em preço, seleção e conveniência, compartilhando economia de escala com clientes.", "thesisPros": ["Receita +12%", "Lucro op. +17%", "Vantagens competitivas sustentáveis através de economia de escala e efeito de rede", "Gestão excelente na alocação de capital, historicamente capaz de desenvolver linhas de negócio inesperadas (AWS, anúncios)", "Extensas avenidas de crescimento em AWS, anúncios e e-commerce", "Investimentos massivos em P&D e CapEx direcionados para segmentos de alto ROIC como AWS", "Ecossistema integrado fortalecido pelo FBA e Prime que potencializa vendas 3P", "Cultura empresarial forte baseada em foco no cliente, inovação e pensamento de longo prazo"], "thesisCons": ["Margens operacionais ainda relativamente baixas no varejo (6,9% na América do Norte)", "Dependência de investimentos contínuos e elevados em CapEx (US$ 200 bi estimados para 2026)", "Segmento Internacional ainda opera com margens muito baixas (2,9%)", "Mais de 80% dos gastos globais em TI ainda ocorrem on-premise, indicando risco de execução na migração"], "resultPros": ["Receita cresceu 12% atingindo US$ 716,9 bilhões em 2025", "Lucro operacional aumentou 17% para US$ 80 bilhões com margem expandindo de 10,8% para 11,2%", "Balanço sólido com caixa líquido de US$ 45,1 bilhões", "AWS apresentou crescimento de 20% na receita (US$ 129 bi) com backlog saltando 40% para US$ 244 bilhões", "Entregas no mesmo dia nos EUA cresceram 70%, com mais de 8 bilhões de itens entregues rapidamente", "Segmento de supermercados supera US$ 150 bilhões com crescimento ao dobro das outras categorias", "Chips próprios (Graviton e Trainium) oferecem vantagem de custo de 30-40% versus concorrentes"], "resultCons": ["Margem operacional da AWS caiu de 37% para 35,4%", "Impacto não recorrente negativo de US$ 5,2 bilhões por acordo judicial com FTC e indenizações", "CapEx crescendo agressivamente para US$ 200 bilhões estimados em 2026 (vs US$ 130 bi em 2025)", "Yield de NOPAT normalizado de apenas 4,2% em relação ao valor de mercado de US$ 2,2 trilhões"], "result": "Resultados sólidos em 2025 com receita de US$ 717 bi (+12%) e lucro operacional de US$ 80 bi (+17%). AWS continua como destaque com crescimento de 20% e backlog de US$ 244 bi (+40%). Varejo fortalecido com expansão em supermercados (US$ 150 bi) e melhorias logísticas. Margem operacional expandiu para 11,2% apesar de impactos extraordinários de US$ 5,2 bi. CapEx intenso de US$ 130 bi com previsão de US$ 200 bi em 2026 focado em IA e infraestrutura AWS.", "sunoView": "A Amazon segue fortalecendo suas vantagens competitivas com amplo espaço para crescimento. A gestão continua eficiente na alocação de capital. Mantemos a Amazon em nossa carteira recomendada. Estimamos NOPAT normalizado de US$ 92 bilhões anuais, representando yield de 4,2% sobre o valor de mercado.", "history": [{"quarter": "2025", "result": "Vantagens fortalecidas.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "GOOG", "name": "Alphabet Inc", "quarter": "4T25", "highlight": true, "sentiment": "positive", "rankScore": 9.2, "intlSub": "Great Companies", "thesis": "Alphabet mantém posição dominante em search advertising e expande fortemente em Cloud e IA. Possui ecossistema robusto com bilhões de usuários, gerando dados valiosos que alimentam seus algoritmos de inteligência artificial. Modelo de negócio baseado em anúncios digitais altamente rentável (margem bruta acima de 80% em propriedades próprias), com diversificação crescente via Google Cloud, YouTube e serviços de assinatura.", "thesisPros": ["Receita +18%", "Cloud +48%", "Quase monopólio em search advertising com barreiras de entrada altíssimas", "Ecossistema com mais de 1 bilhão de usuários ativos em múltiplas plataformas (Android, Chrome, Gmail, Maps, YouTube)", "Margem bruta excepcional acima de 80% em propriedades próprias de anúncios", "Forte geração de caixa livre e posição de caixa líquido robusta", "Investimentos massivos em P&D (US$ 170 bi em 5 anos) sustentam vantagens competitivas", "Diversificação bem-sucedida com Google Cloud crescendo aceleradamente", "Posicionamento de liderança em inteligência artificial"], "thesisCons": ["Dependência ainda elevada de receitas de publicidade (cerca de 80%)", "Custos de aquisição de tráfego (TAC) elevados, especialmente pagamento estimado de US$ 20 bi anuais para Apple", "Investimentos em Other Bets continuam gerando prejuízos operacionais", "Riscos regulatórios antitruste dado poder de mercado", "Banimento do mercado chinês limita crescimento global"], "resultPros": ["Receita recorde de US$ 113,83 bi no 4T25 (+18% YoY) e US$ 400 bi no ano", "Google Cloud com crescimento explosivo de 48% YoY, atingindo US$ 17,66 bi em receita", "Margem operacional do Cloud saltou para 30,1% (vs US$ 2,09 bi de lucro operacional no 4T24)", "Lucro líquido de US$ 34,46 bi no trimestre (+30% YoY)", "Fluxo de caixa operacional robusto de US$ 52,4 bi e FCL de US$ 24,55 bi no trimestre", "Google Search cresceu 17% YoY para US$ 63,07 bi", "Dividendo trimestral declarado de US$ 0,21 por ação"], "resultCons": ["CapEx quase dobrou para US$ 27,85 bi (+95% YoY), com previsão de US$ 175-185 bi em 2026", "Despesas com P&D subiram 42% para US$ 18,57 bi", "Google Network recuou de US$ 7,95 bi para US$ 7,83 bi", "Other Bets manteve prejuízo operacional de US$ 3,62 bi", "YouTube Ads cresceu apenas 9%, abaixo do ritmo corporativo", "Despesas gerais e administrativas subiram 21%"], "result": "Resultado excepcional com receita recorde de US$ 113,83 bi (+18% YoY) e lucro líquido de US$ 34,46 bi (+30% YoY). Destaque para Google Cloud com crescimento de 48% e margem operacional de 30,1%. Google Search mantém forte performance (+17%). CapEx elevado reflete investimentos agressivos em infraestrutura de IA. Geração de caixa livre permanece robusta em US$ 24,55 bi no trimestre.", "sunoView": "A Alphabet continua bem capitalizada, altamente rentável e posicionada para liderar a nova era da inteligência artificial, sustentando vantagens competitivas de longo prazo. A tese de investimento permanece inalterada.", "history": [{"quarter": "4T25", "result": "Recorde. >US$400 bi.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "META", "name": "Meta Platforms", "quarter": "4T25", "highlight": true, "sentiment": "positive", "rankScore": 8.8, "intlSub": "Great Companies", "thesis": "A Meta domina o segmento de anúncios em redes sociais com uma base de 3,58 bilhões de usuários ativos diários. A empresa possui forte efeito de rede, histórico de decisões acertadas (aquisições de Instagram e WhatsApp, cópia bem-sucedida de Stories e Reels), e é controlada por Mark Zuckerberg que detém mais de 50% do poder de voto. Mais de 95% da receita vem de anúncios digitais com margem bruta acima de 80%. A companhia está investindo massivamente em IA e Reality Labs para construir vantagens competitivas de longo prazo.", "thesisPros": ["Receita +24%", "Margem 41%", "Domínio absoluto em anúncios de redes sociais com 3,58 bilhões de usuários ativos diários", "Forte efeito de rede e ecossistema integrado (Facebook, Instagram, WhatsApp, Messenger)", "Margem bruta superior a 80% no negócio de anúncios digitais", "Histórico comprovado de decisões estratégicas acertadas (aquisições e adaptações)", "Controle por fundador com alinhamento de longo prazo", "Forte geração de caixa permitindo investimentos em IA e retorno aos acionistas", "Oportunidade de crescimento em mercados emergentes com baixo ARPU"], "thesisCons": ["Dependência excessiva de receita publicitária (>95%)", "Reality Labs continua queimando bilhões sem retorno claro", "Risco regulatório e antitruste crescente", "Vulnerabilidade a mudanças de plataforma (Apple iOS, novas redes sociais)", "Investimentos massivos em IA e metaverso com retorno incerto", "Saturação de usuários em mercados desenvolvidos"], "resultPros": ["Receita total de US$ 59,89 bilhões no 4T25, crescimento robusto de 24% a/a", "Receita de publicidade atingiu US$ 56,78 bilhões (+24% a/a) com crescimento saudável tanto em volume (impressões +14%) quanto em preço (+9%)", "Margem operacional sólida de 41% com lucro operacional de US$ 24,75 bilhões", "Geração de caixa livre fortíssima de US$ 15,8 bilhões no trimestre", "WhatsApp Business e Meta Verified cresceram 59% a/a, atingindo US$ 1,36 bilhão", "Retorno agressivo de capital: US$ 6,32 bilhões em recompras e US$ 1,25 bilhão em dividendos"], "resultCons": ["Lucro líquido caiu 9% para US$ 20,84 bilhões (mesmo considerando base comparativa difícil)", "Reality Labs registrou perdas operacionais crescentes de US$ 5,3 bilhões no trimestre", "Despesas totais aumentaram 10% a/a para US$ 35,15 bilhões", "P&D disparou 35% devido a investimentos massivos em IA", "CapEx de US$ 14,2 bilhões no trimestre, com guidance de US$ 60-65 bilhões para 2026", "Alíquota efetiva de imposto de apenas 11% pode não ser sustentável"], "result": "A Meta entregou resultados operacionais robustos no 4T25, com crescimento de 24% na receita total e forte momentum no negócio principal de publicidade. A geração de caixa permanece excepcional (US$ 15,8 bilhões de FCF), permitindo investimentos agressivos em IA (CapEx de US$ 60-65 bilhões projetado para 2026) e retorno simultâneo de capital aos acionistas. O Reality Labs continua queimando caixa (prejuízo de US$ 5,3 bilhões), mas o core business compensa amplamente. A empresa demonstra capacidade de equilibrar investimentos de longo prazo com rentabilidade presente.", "sunoView": "Mantemos recomendação de compra com preço-teto de US$ 500,00. A forte posição financeira, rentabilidade fenomenal do negócio principal e histórico de execução da gestão nos deixam confiantes. Os investimentos em IA podem ser vistos como perda de rentabilidade no curto prazo, mas esperamos que a empresa colha frutos positivos dessas iniciativas. A tese permanece inalterada e a Meta continua sendo boa oportunidade de investimento para o futuro.", "history": [{"quarter": "4T25", "result": "Robusto.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "BKNG", "name": "Booking Holdings Inc.", "quarter": "4T25", "highlight": true, "sentiment": "positive", "rankScore": 8.7, "intlSub": "Great Companies", "thesis": "A Booking é a maior agência de viagens online do mundo, com relevantes vantagens competitivas sustentadas pelo efeito de rede, relacionamento com provedores, poder de marca e escala operacional. O mercado de OTAs ainda tem alcance reduzido com importante avenida de crescimento pela frente, conforme gerações mais novas substituem as velhas. A estratégia Connected Trip visa expandir monetização via cross-selling de serviços integrados de viagem.", "thesisPros": ["Receita +16%", "Lucro +34%", "Líder global em OTAs com forte efeito de rede nas plataformas", "Vantagens competitivas em relacionamento com provedores, marca e escala", "Investimentos superiores em marketing ampliam presença em ferramentas de busca", "Projeto Connected Trip oferece oportunidade de monetização via plataforma de pagamentos", "Mercado em expansão com migração geracional para reservas online", "Diversificação geográfica (Europa, Ásia, EUA) e de serviços (acomodações, voos, carros)"], "thesisCons": ["Dependência de gastos com marketing (4,4% das reservas brutas)", "Concentração de receita em acomodações (~90% do volume transacionado)", "Exposição a ciclos econômicos e eventos extraordinários (Covid-19 impactou severamente)", "Competição intensa no segmento de OTAs"], "resultPros": ["Receita cresceu 16% no 4T25 para US$ 6,3 bi (11% em moeda constante)", "Lucro líquido aumentou 34% no trimestre para US$ 1,4 bi", "Noites reservadas cresceram 9% no 4T25 (285 milhões) e 8% no ano (1,235 bi)", "Reservas brutas subiram 16% no 4T25 (US$ 43 bi) e 12% no ano (US$ 186,1 bi)", "Acomodações alternativas em forte expansão (9% no 4T25, representando 36% do total)", "Connected Trip com transações crescendo na faixa alta de 20% (já representa dígitos baixos do total)", "Segmento de passagens aéreas disparou 37% (68 milhões de bilhetes vendidos)", "Programa de Transformação gerou US$ 550 milhões em economia anual", "Fluxo de caixa operacional cresceu 107% no 4T25 para US$ 1,5 bi (US$ 9,4 bi no ano)", "Fluxo de caixa livre subiu 120% no trimestre para US$ 1,4 bi (US$ 9,1 bi em 2025)", "Retornou US$ 7,1 bi aos acionistas (US$ 5,9 bi em recompras + US$ 1,2 bi em dividendos)", "Dividendo trimestral aumentado 9,4% para US$ 10,50 por ação", "Aprovado desdobramento de ações 25:1 (vigor em 02/04/2026)"], "resultCons": ["Take-rate permaneceu relativamente estável em 13,8% (sem expansão de margem)", "Gastos com marketing mantidos no mesmo patamar de 2024"], "result": "Resultado excepcional no 4T25 e ano consolidado de 2025, com crescimento robusto em todas as métricas operacionais e financeiras. Destaque para expansão de 16% na receita, 34% no lucro líquido e forte geração de caixa (FCO +107% no trimestre). A estratégia Connected Trip está avançando conforme planejado, com passagens aéreas crescendo 37% e transações conectadas na faixa alta de 20%. Forte retorno de capital aos acionistas com US$ 7,1 bi distribuídos e aumento de dividendos de 9,4%.", "sunoView": "A Suno reitera a recomendação de compra ao preço-teto de US$ 3.626,00 por ação, permanecendo confiante na capacidade da Booking de gerar valor aos acionistas. A empresa demonstra execução consistente da estratégia, com expansão geográfica equilibrada e forte avanço nas iniciativas de diversificação de receitas.", "history": [{"quarter": "4T25", "result": "Sólido.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "BLK", "name": "BlackRock", "quarter": "4Q25", "highlight": false, "sentiment": "positive", "rankScore": 8.1, "intlSub": "Great Companies", "thesis": "BlackRock é a maior gestora de ativos do mundo com US$ 14 trilhões sob gestão, beneficiando-se de um modelo de negócio altamente escalável com custos fixos, crescimento orgânico via valorização de mercado e aportes líquidos consistentes. A empresa domina o mercado de ETFs através da marca iShares e possui vantagem competitiva pelo software Aladdin de gestão de risco.", "thesisPros": ["AuM +22%", "Aportes US$698 bi", "Maior gestora de ativos do mundo com escala massiva (US$ 14 trilhões AuM)", "Modelo de negócio escalável com custos predominantemente fixos e alta conversão de receita em lucro", "Crescimento orgânico impulsionado pela valorização histórica dos mercados (S&P 500: 10,41% ao ano desde 1926)", "Liderança absoluta em ETFs através da marca iShares (US$ 5,5 trilhões, 6x maior que segundo colocado)", "Software Aladdin com 900 clientes institucionais gerindo US$ 21,6+ trilhões", "Distribuição consistente aos acionistas: média de 85% do lucro líquido em dividendos e recompras (2015-2024)", "Aportes líquidos robustos: US$ 2,5 trilhões nos últimos 5 anos"], "thesisCons": ["Valuation premium: negocia a ~20x lucros, próximo ao valor intrínseco estimado", "Dependência da valorização dos mercados para crescimento orgânico de receitas", "Concorrência da Vanguard (sem fins lucrativos) com pricing power similar", "Risco de saques superarem aportes, reduzindo AuM e receitas", "Sensibilidade a ciclos de baixa do mercado acionário"], "resultPros": ["Aportes líquidos excepcionais de US$ 698 bilhões em 2025 (US$ 342 bi só no 4T25)", "AuM cresceu 22% para US$ 14 trilhões, impulsionado por aportes e valorização de US$ 1,5 trilhão", "Receita total aumentou 19% para US$ 24,2 bilhões", "ETFs iShares captaram US$ 527 bilhões, consolidando liderança absoluta do segmento", "Lucro operacional ajustado cresceu 18% para US$ 9,6 bilhões com margem de 44,1%", "Lucro líquido ajustado subiu 17% para US$ 7,7 bilhões", "Aquisições estratégicas (HPS, GIP, Preqin) expandindo presença em crédito privado, infraestrutura e dados"], "resultCons": ["Lucro líquido contábil recuou 13% para US$ 5,5 bilhões devido a efeitos não recorrentes", "Despesas totais dispararam 34% para US$ 17,1 bilhões", "Custos com pessoal subiram 30% para US$ 8,4 bilhões por remuneração variável e integrações de M&A", "Despesas gerais aumentaram 21% devido a transações de fusões e investimentos em tecnologia", "Shareholder yield de apenas 3% (US$ 5 bi retornados vs. valor de mercado de US$ 171 bi)"], "result": "BlackRock apresentou resultados sólidos em 2025 com crescimento expressivo em todas as métricas operacionais principais. Os aportes líquidos de US$ 698 bilhões demonstram forte demanda, especialmente em ETFs (US$ 527 bi). O AuM alcançou US$ 14 trilhões (+22%) e a receita cresceu 19%. Apesar do aumento significativo de 34% nas despesas (impactadas por M&A e remuneração variável), o lucro operacional ajustado cresceu 18% com margem saudável de 44,1%. As aquisições estratégicas fortalecem posicionamento em novos canais de crescimento.", "sunoView": "Mantemos recomendação de compra com preço-teto de US$ 750 (vs. cotação atual de US$ 976). A empresa está próxima do valor intrínseco estimado de US$ 1.000/ação. Assinantes que compraram abaixo do teto devem manter pela qualidade do negócio, vantagem tributária e remuneração consistente. A gestão historicamente surpreende positivamente em captação e inovação (Aladdin). Empresa detém plataforma única e lidera novos canais como mercados privados, wealth, ETFs ativos, infraestrutura e dados.", "history": [{"quarter": "2025", "result": "Plataforma única.", "date": ""}], "lastUpdated": "2026-03-27"},
      {"ticker": "BRKB", "name": "Berkshire Hathaway", "quarter": "2025", "highlight": false, "sentiment": "neutral", "rankScore": 6.5, "intlSub": "Great Companies", "thesis": "Conglomerado. Caixa US$371 bi.", "thesisPros": ["FCL US$25 bi (+116%)", "Caixa US$371 bi"], "thesisCons": ["Sem recompras"], "resultPros": ["FCL US$25 bi (+116%)", "Caixa US$371 bi", "Float US$176 bi"], "resultCons": ["Lucro op. -6,2%"], "result": "Greg Abel mantém modelo.", "sunoView": "Inalterada.", "history": [], "lastUpdated": "2026-03-27"}
    ]
  };
}

function uniqueArr(arr) { var s={}; var o=[]; for(var i=0;i<arr.length;i++){var v=arr[i]; if(v&&!s[v]){s[v]=true;o.push(v);}} return o; }

function migrateStock(s) {
  if (s.thesisPros && s.resultPros) return s;
  var allPros = s.pros || [];
  var allCons = s.cons || [];
  s.thesisPros = s.thesisPros || [];
  s.thesisCons = s.thesisCons || [];
  s.resultPros = s.resultPros || [];
  s.resultCons = s.resultCons || [];
  for (var i = 0; i < allPros.length; i++) {
    var p = allPros[i];
    var isResult = /[\+\-]\d|%|a\/a|t\/t|tri |bi |mi |R\$|US\$|recorde|caiu|subiu|cresceu|margem|lucro|receita|EBITDA|FCL|produção|yield|payout|dividendo/i.test(p);
    if (isResult) { if (s.resultPros.indexOf(p) < 0) s.resultPros.push(p); }
    else { if (s.thesisPros.indexOf(p) < 0) s.thesisPros.push(p); }
  }
  for (var j = 0; j < allCons.length; j++) {
    var c = allCons[j];
    var isResultC = /[\+\-]\d|%|a\/a|t\/t|tri |bi |mi |R\$|US\$|caiu|subiu|cresceu|margem|lucro|receita|EBITDA|prejuízo|inadimplência|alavancagem|guidance/i.test(c);
    if (isResultC) { if (s.resultCons.indexOf(c) < 0) s.resultCons.push(c); }
    else { if (s.thesisCons.indexOf(c) < 0) s.thesisCons.push(c); }
  }
  if (s.thesisPros.length === 0 && s.resultPros.length > 0) {
    s.thesisPros = s.resultPros.slice(0, Math.min(2, s.resultPros.length));
  }
  delete s.pros;
  delete s.cons;
  return s;
}

function migrateData(data) {
  var migrated = {};
  Object.keys(data).forEach(function(k) {
    migrated[k] = (data[k] || []).map(function(s) { return migrateStock(s); });
  });
  return migrated;
}

function mergeStock(ex, inc) {
  var prev = ex.history || [];
  if (ex.result && ex.quarter && ex.quarter !== inc.quarter) {
    prev = prev.concat([{quarter:ex.quarter,result:ex.result,date:ex.lastUpdated||""}]);
  }
  var m = {};
  m.ticker = inc.ticker||ex.ticker; m.name = inc.name||ex.name; m.quarter = inc.quarter||ex.quarter;
  m.highlight = inc.highlight!==undefined?inc.highlight:ex.highlight; m.sentiment = inc.sentiment||ex.sentiment;
  m.intlSub = inc.intlSub||ex.intlSub;

  if (inc._smartMerge) {
    m.thesis = inc.thesis || ex.thesis || "";
    m.thesisPros = inc.thesisPros || [];
    m.thesisCons = inc.thesisCons || [];
    m.resultPros = inc.resultPros || [];
    m.resultCons = inc.resultCons || [];
  } else {
    m.thesis = inc.thesis&&inc.thesis.length>(ex.thesis||"").length?inc.thesis:(ex.thesis||inc.thesis||"");
    m.thesisPros = uniqueArr((ex.thesisPros||ex.pros||[]).concat(inc.thesisPros||[]));
    m.thesisCons = uniqueArr((ex.thesisCons||ex.cons||[]).concat(inc.thesisCons||[]));
    m.resultPros = inc.resultPros||(inc.pros?inc.pros:ex.resultPros)||[];
    m.resultCons = inc.resultCons||(inc.cons?inc.cons:ex.resultCons)||[];
  }

  m.result = inc.result||ex.result; m.sunoView = inc.sunoView||ex.sunoView;
  m.history = prev; m.lastUpdated = new Date().toISOString().slice(0,10);
  delete m._smartMerge;
  return m;
}

function SentimentBadge(p) {
  var c={positive:{l:"Positivo",bg:"rgba(34,197,94,0.1)",c:"#4ade80",b:"rgba(34,197,94,0.2)"},neutral:{l:"Neutro",bg:"rgba(255,255,255,0.04)",c:"#94a3b8",b:"rgba(255,255,255,0.1)"},negative:{l:"Negativo",bg:"rgba(220,38,38,0.1)",c:"#f87171",b:"rgba(220,38,38,0.2)"}}[p.sentiment]||{l:"—",bg:"#111",c:"#888",b:"#333"};
  return <span style={{display:"inline-block",padding:"2px 9px",borderRadius:"20px",fontSize:"10px",fontWeight:700,background:c.bg,color:c.c,border:"1px solid "+c.b,letterSpacing:"0.5px",textTransform:"uppercase"}}>{c.l}</span>;
}

function PointsList(p) {
  var items = p.items||[];
  if(!items.length) return <div style={{fontSize:"11px",color:"rgba(255,255,255,0.2)",fontStyle:"italic"}}>Nenhum</div>;
  return items.map(function(t,i){return <div key={i} style={{fontSize:"11.5px",color:"rgba(255,255,255,0.55)",marginBottom:"3px",paddingLeft:"12px",position:"relative",lineHeight:1.5}}><span style={{position:"absolute",left:0,color:p.color,fontWeight:700}}>{p.icon}</span>{t}</div>;});
}

function RankBadge(p) {
  if (!p.rank && !p.score) return null;
  var scoreColor = p.score >= 8 ? "#4ade80" : p.score >= 5 ? "#fbbf24" : "#f87171";
  var delta = (typeof p.score === "number" && typeof p.prevScore === "number") ? p.score - p.prevScore : null;
  var showDelta = delta !== null && Math.abs(delta) >= 1.5;
  return (
    <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
      {p.rank && <div style={{background:"rgba(255,255,255,0.06)",borderRadius:"6px",padding:"2px 7px",fontSize:"10px",fontWeight:800,color:"rgba(255,255,255,0.5)",letterSpacing:"0.5px"}}>#{p.rank}</div>}
      {p.score && <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid " + scoreColor + "33",borderRadius:"6px",padding:"2px 7px",fontSize:"10px",fontWeight:800,color:scoreColor}}>{p.score.toFixed(1)}</div>}
      {showDelta && <div style={{fontSize:"9px",fontWeight:800,color:delta>0?"#4ade80":"#f87171",padding:"1px 5px",borderRadius:"4px",background:delta>0?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.1)"}}>{delta>0?"▲":"▼"}{Math.abs(delta).toFixed(1)}</div>}
    </div>
  );
}

var TONE_OPTIONS = [
  {key:"simples",label:"Simples",desc:"Leigo"},
  {key:"intermediario",label:"Intermediário",desc:"Noções básicas"},
  {key:"profissional",label:"Profissional",desc:"Técnico"}
];
var TONE_MAP = {
  "simples":"REGRA DE TOM: Escreva como se estivesse explicando para alguem da sua familia que NUNCA investiu. PROIBIDO usar qualquer termo tecnico (P/L, yield, EBITDA, margem, spread, duration, fluxo de caixa, alavancagem, etc). Se precisar mencionar um conceito, explique com palavras do dia-a-dia. Use frases CURTAS (maximo 15 palavras). Use comparacoes simples (ex: 'a empresa lucrou mais do que o esperado' em vez de 'superou o consenso de mercado'). Tom de CONVERSA INFORMAL entre amigos. Evite numeros demais — prefira 'subiu bastante' a '12,3% acima do guidance'. Quando mencionar valores grandes, contextualize (ex: 'lucrou R$200 milhoes, quase o dobro do ano passado').",
  "intermediario":"REGRA DE TOM: O cliente entende o basico de investimentos (sabe o que e acao, fundo, renda fixa, dividendo) mas NAO domina termos avancados. Pode usar: lucro, receita, dividendo, rentabilidade, CDI, Selic, inflacao, valorizacao. EVITE ou EXPLIQUE brevemente: EBITDA (diga 'lucro operacional'), yield (diga 'retorno em dividendos'), spread, duration, P/L (diga 'preco sobre lucro'). Use paragrafos de 2-3 frases. Inclua numeros importantes mas sem exagerar. Tom profissional mas acessivel — como um consultor explicando para um cliente com 2-3 anos de experiencia.",
  "profissional":"REGRA DE TOM: Linguagem TECNICA completa de mercado financeiro. Use livremente: P/L, P/VP, EV/EBITDA, yield, spread, duration, beta, Sharpe, fluxo de caixa descontado, margem liquida, ROE, ROIC, alavancagem, guidance, consenso, upside, downside, re-rating, de-rating, carry, NTN-B, DI futuro, premio de risco, multiplos, peer comparison. Inclua TODOS os numeros relevantes com precisao (percentuais com 1 casa decimal). Analise deve ser densa, com comparativos vs peers e benchmarks. Tom de relatorio de research institucional. Paragrafos podem ser mais longos e detalhados."
};
var TONE_MAP_SHORT = {
  "simples":"linguagem simples de conversa informal, SEM termos tecnicos, frases curtas, como para alguem que nunca investiu",
  "intermediario":"linguagem acessivel com termos basicos explicados, como para cliente com nocoes de investimento",
  "profissional":"linguagem tecnica completa de research institucional, com todos os termos e numeros do mercado"
};
function getToneInstruction(tone, short) { return short ? (TONE_MAP_SHORT[tone]||TONE_MAP_SHORT["simples"]) : (TONE_MAP[tone]||TONE_MAP["simples"]); }

function ToneSelector(p) {
  var val = p.value || "simples";
  var color = p.color || "#DC2626";
  return (
    <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
      <label style={{fontSize:"9px",color:"rgba(255,255,255,0.4)",whiteSpace:"nowrap"}}>Tom:</label>
      {TONE_OPTIONS.map(function(t){
        var active = val === t.key;
        return <button key={t.key} onClick={function(){p.onChange(t.key);}} style={{padding:"4px 10px",borderRadius:"14px",border:active?"1px solid "+color:"1px solid rgba(255,255,255,0.08)",background:active?(color+"1F"):"transparent",color:active?color:"rgba(255,255,255,0.35)",fontSize:"9px",fontWeight:active?700:500,cursor:"pointer"}} title={t.desc}>{t.label}</button>;
      })}
    </div>
  );
}

function StockCard(p) {
  var s = p.stock;
  var [open,setOpen] = useState(false);
  var [del,setDel] = useState(false);
  var hist = s.history||[];
  var rp = s.resultPros||[]; var rc = s.resultCons||[];
  var tp = s.thesisPros||s.pros||[]; var tc = s.thesisCons||s.cons||[];
  var hasResultPoints = rp.length>0 || rc.length>0;
  return (
    <div style={{background:"#111",borderRadius:"12px",overflow:"hidden",border:s.highlight?"1px solid rgba(220,38,38,0.3)":"1px solid rgba(255,255,255,0.06)",marginBottom:"8px"}}>
      <div onClick={function(){setOpen(!open);}} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:open?"1px solid rgba(255,255,255,0.05)":"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{background:"#DC2626",borderRadius:"8px",width:"40px",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"10px",color:"#fff"}}>{s.ticker.replace(/[0-9]/g,"").slice(0,4)}</div>
            {s._rank && <div style={{position:"absolute",top:"-6px",left:"-6px",background:"#0A0A0A",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"10px",padding:"0px 5px",fontSize:"9px",fontWeight:800,color:"rgba(255,255,255,0.6)",lineHeight:"16px"}}>#{s._rank}</div>}
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"5px"}}><span style={{fontWeight:700,fontSize:"14px",color:"#f1f5f9"}}>{s.ticker}</span>{s.highlight&&<span style={{color:"#DC2626",fontSize:"14px"}}>&#9733;</span>}<span style={{color:"rgba(255,255,255,0.28)",fontSize:"12px",marginLeft:"4px"}}>{s.quarter}</span>{s.lastUpdated&&<span style={{color:"rgba(255,255,255,0.18)",fontSize:"10px",marginLeft:"4px"}}>({s.lastUpdated})</span>}</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",marginTop:"1px"}}>{s.name}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}><RankBadge score={s.rankScore} prevScore={s.prevRankScore}/><SentimentBadge sentiment={s.sentiment}/><span style={{color:"rgba(255,255,255,0.2)",fontSize:"14px",transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0)"}}>&#9662;</span></div>
      </div>
      {open&&(
        <div style={{padding:"16px 18px"}}>
          <div style={{marginBottom:"16px"}}>
            <div style={{fontSize:"9px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"5px"}}>Tese de Investimento</div>
            <div style={{fontSize:"12.5px",color:"rgba(255,255,255,0.65)",lineHeight:1.6,marginBottom:"10px"}}>{s.thesis}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div><div style={{fontSize:"9px",fontWeight:600,color:"rgba(74,222,128,0.6)",marginBottom:"5px"}}>FAVORÁVEIS DA TESE</div><PointsList items={tp} color="#4ade80" icon="+"/></div>
              <div><div style={{fontSize:"9px",fontWeight:600,color:"rgba(248,113,113,0.6)",marginBottom:"5px"}}>RISCOS DA TESE</div><PointsList items={tc} color="#f87171" icon="-"/></div>
            </div>
          </div>
          <div style={{marginBottom:"16px",background:"rgba(251,191,36,0.03)",border:"1px solid rgba(251,191,36,0.12)",borderRadius:"10px",padding:"14px"}}>
            <div style={{fontSize:"9px",fontWeight:700,color:"#fbbf24",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"8px"}}>&#9733; Último Resultado ({s.quarter})</div>
            <div style={{fontSize:"12.5px",color:"rgba(255,255,255,0.7)",lineHeight:1.6,marginBottom:hasResultPoints?"10px":"0"}}>{s.result}</div>
            {hasResultPoints&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",borderTop:"1px solid rgba(251,191,36,0.08)",paddingTop:"10px"}}>
                <div><div style={{fontSize:"9px",fontWeight:700,color:"#4ade80",marginBottom:"5px"}}>DESTAQUES POSITIVOS</div><PointsList items={rp} color="#4ade80" icon="+"/></div>
                <div><div style={{fontSize:"9px",fontWeight:700,color:"#f87171",marginBottom:"5px"}}>PONTOS DE ATENÇÃO</div><PointsList items={rc} color="#f87171" icon="-"/></div>
              </div>
            )}
          </div>
          {hist.length>0&&(<div style={{marginBottom:"14px"}}><div style={{fontSize:"9px",fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"5px"}}>Resultados Anteriores ({hist.length})</div>{hist.map(function(h,i){return <div key={i} style={{fontSize:"11px",color:"rgba(255,255,255,0.35)",padding:"6px 10px",background:"rgba(255,255,255,0.02)",borderRadius:"6px",marginBottom:"4px"}}><span style={{fontWeight:600,color:"rgba(255,255,255,0.45)"}}>{h.quarter}:</span> {h.result}</div>;})}</div>)}
          <div style={{marginBottom:"14px"}}><div style={{fontSize:"9px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"5px"}}>Visão Suno</div><div style={{fontSize:"12.5px",color:"rgba(255,255,255,0.65)",lineHeight:1.6,background:"rgba(220,38,38,0.03)",padding:"9px 12px",borderRadius:"8px",border:"1px solid rgba(220,38,38,0.1)"}}>{s.sunoView}</div></div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:"10px",display:"flex",justifyContent:"flex-end"}}>
            {!del?(<button onClick={function(e){e.stopPropagation();setDel(true);}} style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid rgba(220,38,38,0.2)",background:"transparent",color:"rgba(220,38,38,0.6)",fontSize:"10px",fontWeight:600,cursor:"pointer"}}>Excluir desta carteira</button>):(
              <div style={{display:"flex",gap:"6px",alignItems:"center"}}><span style={{fontSize:"10px",color:"rgba(255,255,255,0.4)"}}>Confirma?</span><button onClick={function(e){e.stopPropagation();p.onDelete(s.ticker);}} style={{padding:"5px 12px",borderRadius:"6px",border:"none",background:"#DC2626",color:"#fff",fontSize:"10px",fontWeight:700,cursor:"pointer"}}>Sim</button><button onClick={function(e){e.stopPropagation();setDel(false);}} style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.4)",fontSize:"10px",cursor:"pointer"}}>Cancelar</button></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Diff helpers ─── */
function diffList(oldArr, newArr) {
  oldArr = oldArr || []; newArr = newArr || [];
  var kept = []; var added = []; var removed = [];
  for (var i = 0; i < newArr.length; i++) {
    if (oldArr.indexOf(newArr[i]) >= 0) kept.push(newArr[i]);
    else added.push(newArr[i]);
  }
  for (var j = 0; j < oldArr.length; j++) {
    if (newArr.indexOf(oldArr[j]) < 0) removed.push(oldArr[j]);
  }
  return { kept: kept, added: added, removed: removed };
}

function DiffPointsList(p) {
  var d = p.diff;
  if (!d) return null;
  var total = d.kept.length + d.added.length + d.removed.length;
  if (total === 0) return <div style={{fontSize:"11px",color:"rgba(255,255,255,0.2)",fontStyle:"italic"}}>Nenhum</div>;
  return (
    <div>
      {d.removed.map(function(t,i){return <div key={"r"+i} style={{fontSize:"11px",color:"rgba(248,113,113,0.7)",marginBottom:"3px",paddingLeft:"14px",position:"relative",lineHeight:1.5,textDecoration:"line-through",opacity:0.7}}><span style={{position:"absolute",left:0,fontWeight:700}}>✕</span>{t}</div>;})}
      {d.kept.map(function(t,i){return <div key={"k"+i} style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",marginBottom:"3px",paddingLeft:"14px",position:"relative",lineHeight:1.5}}><span style={{position:"absolute",left:0,color:"rgba(255,255,255,0.25)",fontWeight:700}}>=</span>{t}</div>;})}
      {d.added.map(function(t,i){return <div key={"a"+i} style={{fontSize:"11px",color:"rgba(74,222,128,0.85)",marginBottom:"3px",paddingLeft:"14px",position:"relative",lineHeight:1.5,fontWeight:600}}><span style={{position:"absolute",left:0,fontWeight:700}}>+</span>{t}</div>;})}
    </div>
  );
}

function PreviewPanel(p) {
  var nw = p.newData;
  var old = p.oldData;
  var isNew = !old;

  var diffTP = old ? diffList(old.thesisPros, nw.thesisPros) : null;
  var diffTC = old ? diffList(old.thesisCons, nw.thesisCons) : null;
  var diffRP = old ? diffList(old.resultPros, nw.resultPros) : null;
  var diffRC = old ? diffList(old.resultCons, nw.resultCons) : null;

  var statsAdd = 0; var statsRem = 0; var statsKeep = 0;
  if (!isNew) {
    [diffTP,diffTC,diffRP,diffRC].forEach(function(d) {
      if (d) { statsAdd += d.added.length; statsRem += d.removed.length; statsKeep += d.kept.length; }
    });
  }

  var secS = {marginBottom:"12px"};
  var lblS = {fontSize:"9px",fontWeight:700,textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:"4px"};

  return (
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:"10px",padding:"16px",marginTop:"12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:"16px"}}>&#128269;</span>
          <div>
            <div style={{fontSize:"13px",fontWeight:700,color:"#fbbf24"}}>{isNew ? "Preview — Novo Ativo" : "Preview — Consolidação"}</div>
            <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)"}}>{nw.ticker} — {nw.name} ({nw.quarter})</div>
          </div>
        </div>
        <SentimentBadge sentiment={nw.sentiment}/>
      </div>

      {!isNew && (
        <div style={{display:"flex",gap:"8px",marginBottom:"14px",flexWrap:"wrap"}}>
          <span style={{fontSize:"10px",padding:"3px 10px",borderRadius:"10px",background:"rgba(74,222,128,0.1)",color:"#4ade80",fontWeight:700}}>+{statsAdd} novos</span>
          <span style={{fontSize:"10px",padding:"3px 10px",borderRadius:"10px",background:"rgba(255,255,255,0.04)",color:"#94a3b8",fontWeight:700}}>={statsKeep} mantidos</span>
          <span style={{fontSize:"10px",padding:"3px 10px",borderRadius:"10px",background:"rgba(248,113,113,0.1)",color:"#f87171",fontWeight:700}}>✕{statsRem} removidos</span>
        </div>
      )}

      <div style={secS}>
        <div style={Object.assign({},lblS,{color:"#DC2626"})}>Tese</div>
        <div style={{fontSize:"12px",color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{nw.thesis}</div>
        {old && old.thesis !== nw.thesis && <div style={{fontSize:"10px",color:"rgba(251,191,36,0.5)",marginTop:"4px",fontStyle:"italic"}}>Tese atualizada pela IA</div>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
        <div>
          <div style={Object.assign({},lblS,{color:"rgba(74,222,128,0.7)"})}>Favoráveis da Tese</div>
          {isNew ? <PointsList items={nw.thesisPros} color="#4ade80" icon="+"/> : <DiffPointsList diff={diffTP}/>}
        </div>
        <div>
          <div style={Object.assign({},lblS,{color:"rgba(248,113,113,0.7)"})}>Riscos da Tese</div>
          {isNew ? <PointsList items={nw.thesisCons} color="#f87171" icon="-"/> : <DiffPointsList diff={diffTC}/>}
        </div>
      </div>

      <div style={secS}>
        <div style={Object.assign({},lblS,{color:"#fbbf24"})}>Resultado ({nw.quarter})</div>
        <div style={{fontSize:"12px",color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{nw.result}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
        <div>
          <div style={Object.assign({},lblS,{color:"rgba(74,222,128,0.7)"})}>Destaques Positivos</div>
          {isNew ? <PointsList items={nw.resultPros} color="#4ade80" icon="+"/> : <DiffPointsList diff={diffRP}/>}
        </div>
        <div>
          <div style={Object.assign({},lblS,{color:"rgba(248,113,113,0.7)"})}>Pontos de Atenção</div>
          {isNew ? <PointsList items={nw.resultCons} color="#f87171" icon="-"/> : <DiffPointsList diff={diffRC}/>}
        </div>
      </div>

      <div style={secS}>
        <div style={Object.assign({},lblS,{color:"#DC2626"})}>Visão Suno</div>
        <div style={{fontSize:"12px",color:"rgba(255,255,255,0.6)",lineHeight:1.6,padding:"8px 10px",background:"rgba(220,38,38,0.03)",borderRadius:"6px",border:"1px solid rgba(220,38,38,0.08)"}}>{nw.sunoView}</div>
      </div>

      <div style={{display:"flex",gap:"8px",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"12px"}}>
        <button onClick={p.onConfirm} style={{padding:"9px 22px",borderRadius:"8px",border:"none",cursor:"pointer",background:"#16a34a",color:"#fff",fontWeight:700,fontSize:"12px"}}>Confirmar e Salvar</button>
        <button onClick={p.onDiscard} style={{padding:"9px 22px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"12px"}}>Descartar</button>
      </div>
    </div>
  );
}

function AddPanel(p) {
  var [mode,setMode]=useState("ai");var [port,setPort]=useState("Dividendos");var [isub,setIsub]=useState("Dollar Income");
  var [aiText,setAiText]=useState("");var [aiLoad,setAiLoad]=useState(false);var [aiErr,setAiErr]=useState("");var [fn,setFn]=useState("");var fr=useRef(null);
  var [mT,setMT]=useState("");var [mN,setMN]=useState("");var [mQ,setMQ]=useState("");var [mTh,setMTh]=useState("");
  var [mTP,setMTP]=useState("");var [mTC,setMTC]=useState("");var [mRP,setMRP]=useState("");var [mRC,setMRC]=useState("");
  var [mR,setMR]=useState("");var [mSV,setMSV]=useState("");var [mSe,setMSe]=useState("neutral");var [mH,setMH]=useState(false);
  var [writingTone,setWritingTone]=useState("profissional");

  // Preview state
  var [preview, setPreview] = useState(null); // { newData, oldData }

  // Explicit stock selection for updating
  var [selTicker, setSelTicker] = useState("__auto__");
  var portfolioStocks = (p.currentData || {})[port] || [];

  function handleFile(e){var f=e.target.files[0];if(!f)return;setFn(f.name);var r=new FileReader();if(f.name.endsWith(".pdf")){r.onload=function(){setAiText("__PDF__"+r.result.split(",")[1]);};r.readAsDataURL(f);}else{r.onload=function(){setAiText(r.result);};r.readAsText(f);}}

  async function handleAI(){if(!aiText.trim())return;setAiLoad(true);setAiErr("");setPreview(null);try{
    var isPdf=aiText.indexOf("__PDF__")===0;
    var ef=port==="Internacional"?',"intlSub":"'+(isub||"Dollar Income")+'"':"";

    // Find existing stock
    var existingStock = null;
    var allLists = p.currentData || {};
    var portfolioList = allLists[port] || [];

    if (selTicker !== "__auto__" && selTicker !== "__new__") {
      // Explicit selection
      for (var xi = 0; xi < portfolioList.length; xi++) {
        if (portfolioList[xi].ticker === selTicker) { existingStock = portfolioList[xi]; break; }
      }
    } else if (selTicker === "__auto__") {
      // Auto-detect from text
      for (var pi = 0; pi < portfolioList.length; pi++) {
        var st = portfolioList[pi];
        if (aiText.toUpperCase().indexOf(st.ticker) >= 0) {
          existingStock = st;
          break;
        }
      }
    }
    // selTicker === "__new__" means force new entry

    var existingContext = "";
    if (existingStock) {
      existingContext = "\n\nDADOS ATUAIS DESTA EMPRESA NA BASE:\n" + JSON.stringify({
        ticker: existingStock.ticker, name: existingStock.name, quarter: existingStock.quarter,
        thesis: existingStock.thesis,
        thesisPros: existingStock.thesisPros || [],
        thesisCons: existingStock.thesisCons || [],
        resultPros: existingStock.resultPros || [],
        resultCons: existingStock.resultCons || [],
        result: existingStock.result,
        sunoView: existingStock.sunoView,
        sentiment: existingStock.sentiment
      }, null, 0);
    }

    var sys = 'Voce e um analista financeiro brasileiro especializado. Sua tarefa e analisar o NOVO TEXTO fornecido sobre uma empresa e gerar uma ficha CONSOLIDADA e ATUALIZADA.'
      + '\n\nTOM DE ESCRITA: ' + getToneInstruction(writingTone, false)
      + (existingStock ? ' Voce recebera tambem os DADOS ATUAIS da empresa na base. Voce deve CONSOLIDAR as informacoes: atualizar o que mudou, remover pontos que ficaram obsoletos ou contraditorios com dados mais recentes, manter o que continua relevante, e adicionar novos pontos do texto.' : ' Como esta empresa ainda nao tem dados na base, extraia todas as informacoes relevantes do texto.')
      + ' REGRAS IMPORTANTES:'
      + ' 1) thesisPros e thesisCons sao pontos ESTRUTURAIS e PERMANENTES da tese de investimento (modelo de negocio, vantagens competitivas, riscos estruturais). Maximo 5-7 pontos cada. NAO inclua dados numericos trimestrais aqui.'
      + ' 2) resultPros e resultCons sao destaques ESPECIFICOS do ultimo resultado trimestral (numeros, percentuais, eventos do trimestre). Maximo 5-7 pontos cada.'
      + ' 3) Se um ponto antigo da tese ou resultado foi CONTRADITO por dados novos, REMOVA o antigo e coloque o atualizado. Exemplo: se antes era "inadimplencia controlada em 3,16%" e agora a inadimplencia subiu para 5,17%, remova o antigo e coloque "Inadimplencia disparou para 5,17%".'
      + ' 4) Se o texto traz um NOVO TRIMESTRE, os resultPros e resultCons devem ser SUBSTITUIDOS integralmente pelos do novo trimestre (nao acumule resultados de trimestres diferentes).'
      + ' 5) Priorize qualidade sobre quantidade - so mantenha pontos realmente relevantes e nao redundantes.'
      + ' 6) O campo "result" deve ser um resumo conciso do resultado MAIS RECENTE.'
      + ' 7) O campo "thesis" deve ser uma descricao atualizada e concisa da tese.'
      + ' 8) Mantenha pontos da tese que CONTINUAM VALIDOS mesmo se nao mencionados no novo texto.'
      + ' 9) HIGHLIGHT (destaque): Defina "highlight":true SOMENTE quando o resultado trimestral foi SIGNIFICATIVAMENTE acima ou abaixo do esperado — uma surpresa clara, positiva ou negativa. Exemplos de highlight=true: lucro muito acima do consenso, inadimplencia disparando inesperadamente, resultado recorde historico, prejuizo surpresa, guidance cortado drasticamente, virada operacional inesperada. Exemplos de highlight=false: resultado em linha com esperado, crescimento moderado previsivel, leve melhora ou piora dentro do esperado. Na duvida, highlight=false.'
      + ' 10) RANKSCORE: Atribua uma nota de 1.0 a 10.0 no campo "rankScore" avaliando a QUALIDADE ABSOLUTA do ultimo resultado trimestral. 10=resultado excepcional (recordes, crescimento forte, margens expandindo, geração de caixa robusta). 7-9=resultado bom/solido. 5-6=resultado misto ou em linha. 3-4=resultado fraco. 1-2=resultado muito ruim (prejuizo, inadimplencia alta, guidance cortado). Avalie com base nos resultPros vs resultCons e no resumo do resultado.'
      + ' Responda SOMENTE com JSON puro, sem markdown, sem backticks. Estrutura: {"ticker":"","name":"","quarter":"","highlight":false,"rankScore":5.0,"thesis":"","thesisPros":[""],"thesisCons":[""],"resultPros":[""],"resultCons":[""],"result":"","sunoView":"","sentiment":"positive ou neutral ou negative"' + ef + '}';

    var userContent = (existingStock ? "DADOS ATUAIS:" + existingContext + "\n\nNOVO TEXTO PARA CONSOLIDAR:\n\n" : "TEXTO PARA EXTRAIR:\n\n");

    var msgs;
    if (isPdf) {
      var b64 = aiText.replace("__PDF__","");
      msgs = [{role:"user",content:[
        {type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},
        {type:"text",text:userContent + "Analise o PDF acima e gere a ficha consolidada no formato JSON solicitado."}
      ]}];
    } else {
      msgs = [{role:"user",content: userContent + aiText.slice(0,15000)}];
    }

    var resp=await fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2048,system:sys,messages:msgs})});
    if(!resp.ok){var eb=await resp.text();throw new Error("API "+resp.status+": "+eb.slice(0,300));}
    var d=await resp.json();if(!d.content||!d.content.length)throw new Error("Vazio");
    var raw="";for(var i=0;i<d.content.length;i++){if(d.content[i].text)raw+=d.content[i].text;}
    raw=raw.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");var si=raw.indexOf("{");var ei=raw.lastIndexOf("}");if(si>=0&&ei>si)raw=raw.slice(si,ei+1);
    var parsed=JSON.parse(raw);if(!parsed.ticker)throw new Error("Sem ticker");
    if(port==="Internacional"&&!parsed.intlSub)parsed.intlSub=isub;
    parsed._smartMerge = true;

    // Show preview instead of saving directly
    setPreview({ newData: parsed, oldData: existingStock || null });

  }catch(err){console.error(err);setAiErr("Erro: "+err.message);}setAiLoad(false);}

  function confirmPreview() {
    if (!preview) return;
    p.onAdd(preview.newData, port);
    setPreview(null);
    setAiText("");
    setFn("");
    setSelTicker("__auto__");
  }

  function discardPreview() {
    setPreview(null);
  }

  function handleManual(){if(!mT.trim()||!mN.trim())return;
    var entry={ticker:mT.trim().toUpperCase(),name:mN.trim(),quarter:mQ.trim()||"N/A",highlight:mH,sentiment:mSe,thesis:mTh.trim(),
      thesisPros:mTP.split("\n").filter(function(l){return l.trim();}).map(function(l){return l.trim();}),
      thesisCons:mTC.split("\n").filter(function(l){return l.trim();}).map(function(l){return l.trim();}),
      resultPros:mRP.split("\n").filter(function(l){return l.trim();}).map(function(l){return l.trim();}),
      resultCons:mRC.split("\n").filter(function(l){return l.trim();}).map(function(l){return l.trim();}),
      result:mR.trim(),sunoView:mSV.trim()};
    if(port==="Internacional")entry.intlSub=isub;
    p.onAdd(entry,port);setMT("");setMN("");setMQ("");setMTh("");setMTP("");setMTC("");setMRP("");setMRC("");setMR("");setMSV("");setMSe("neutral");setMH(false);}

  var iS={width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"8px 10px",color:"#e2e8f0",fontSize:"12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  var lS={fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:"4px",display:"block"};

  return(
    <div style={{background:"#111",borderRadius:"12px",padding:"20px",border:"1px solid rgba(255,255,255,0.06)",marginTop:"12px"}}>
      <div style={{fontSize:"9px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"10px"}}>Carteira</div>
      <div style={{display:"flex",gap:"6px",marginBottom:"10px",flexWrap:"wrap"}}>{["Dividendos","Valor","Small Caps","Internacional"].map(function(x){return <button key={x} onClick={function(){setPort(x);setSelTicker("__auto__");setPreview(null);}} style={{padding:"5px 12px",borderRadius:"16px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:600,background:port===x?"#DC2626":"rgba(255,255,255,0.05)",color:port===x?"#fff":"rgba(255,255,255,0.4)"}}>{x}</button>;})}</div>
      {port==="Internacional"&&<div style={{display:"flex",gap:"6px",marginBottom:"12px"}}>{["Dollar Income","Hidden Value","Great Companies"].map(function(x){return <button key={x} onClick={function(){setIsub(x);}} style={{padding:"4px 10px",borderRadius:"14px",border:"none",cursor:"pointer",fontSize:"10px",fontWeight:600,background:isub===x?"rgba(220,38,38,0.12)":"rgba(255,255,255,0.03)",color:isub===x?"#DC2626":"rgba(255,255,255,0.3)"}}>{x}</button>;})}</div>}
      <div style={{display:"flex",gap:"4px",marginBottom:"14px",background:"rgba(255,255,255,0.03)",borderRadius:"8px",padding:"3px"}}>
        <button onClick={function(){setMode("ai");setPreview(null);}} style={{flex:1,padding:"7px",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:700,background:mode==="ai"?"#DC2626":"transparent",color:mode==="ai"?"#fff":"rgba(255,255,255,0.4)"}}>Extrair via IA (texto ou PDF)</button>
        <button onClick={function(){setMode("manual");setPreview(null);}} style={{flex:1,padding:"7px",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:700,background:mode==="manual"?"#DC2626":"transparent",color:mode==="manual"?"#fff":"rgba(255,255,255,0.4)"}}>Preencher Manual</button>
      </div>
      {mode==="ai"&&(<div>
        {/* Stock selector for consolidation */}
        <div style={{marginBottom:"10px"}}>
          <label style={lS}>Ativo para atualizar</label>
          <select value={selTicker} onChange={function(e){setSelTicker(e.target.value);setPreview(null);}} style={{width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"8px 10px",color:"#e2e8f0",fontSize:"12px",outline:"none",fontFamily:"inherit"}}>
            <option value="__auto__" style={{background:"#1a1a1a"}}>Detectar automaticamente pelo texto</option>
            <option value="__new__" style={{background:"#1a1a1a"}}>Novo ativo (não existe na carteira)</option>
            {portfolioStocks.map(function(s){return <option key={s.ticker} value={s.ticker} style={{background:"#1a1a1a"}}>{s.ticker} — {s.name} ({s.quarter})</option>;})}
          </select>
          {selTicker !== "__auto__" && selTicker !== "__new__" && (
            <div style={{fontSize:"10px",color:"rgba(251,191,36,0.6)",marginTop:"4px"}}>A IA vai consolidar os dados novos com a ficha existente de {selTicker}</div>
          )}
        </div>

        <div style={{marginBottom:"8px"}}><ToneSelector value={writingTone} onChange={setWritingTone}/></div>

        <textarea value={aiText.indexOf("__PDF__")===0?"[PDF: "+fn+"]":aiText} onChange={function(e){if(aiText.indexOf("__PDF__")!==0)setAiText(e.target.value);setAiErr("");setPreview(null);}} placeholder="Cole o texto da análise aqui..." style={{width:"100%",minHeight:"140px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"8px",padding:"10px",color:"#e2e8f0",fontSize:"12px",resize:"vertical",fontFamily:"monospace",lineHeight:1.6,outline:"none",boxSizing:"border-box"}}/>
        {aiErr&&<div style={{color:"#f87171",fontSize:"11px",marginTop:"6px",padding:"8px 10px",background:"rgba(220,38,38,0.08)",borderRadius:"6px"}}>{aiErr}</div>}
        <div style={{display:"flex",gap:"8px",marginTop:"8px",alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={handleAI} disabled={aiLoad||!aiText.trim()||!!preview} style={{padding:"8px 18px",borderRadius:"8px",border:"none",cursor:aiLoad?"wait":"pointer",background:aiLoad?"rgba(220,38,38,0.3)":"#DC2626",color:"#fff",fontWeight:700,fontSize:"12px",opacity:(!aiText.trim()||!!preview)?0.4:1}}>{aiLoad?"Processando...":"Extrair via IA"}</button>
          <label style={{padding:"8px 18px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"12px",cursor:"pointer"}}>{fn||"Upload PDF / TXT"}<input ref={fr} type="file" accept=".pdf,.txt,.md" onChange={handleFile} style={{display:"none"}}/></label>
          {fn&&<button onClick={function(){setAiText("");setFn("");setPreview(null);}} style={{padding:"4px 10px",borderRadius:"6px",border:"none",background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.4)",fontSize:"10px",cursor:"pointer"}}>Limpar</button>}
        </div>

        {/* Preview panel */}
        {preview && <PreviewPanel newData={preview.newData} oldData={preview.oldData} onConfirm={confirmPreview} onDiscard={discardPreview}/>}

        {!preview && <div style={{marginTop:"10px",padding:"8px 10px",background:"rgba(255,255,255,0.02)",borderRadius:"6px",fontSize:"10px",color:"rgba(255,255,255,0.2)",lineHeight:1.5}}>Extração inteligente: a IA recebe os dados atuais do ativo + o novo texto e gera uma ficha CONSOLIDADA. Pontos obsoletos ou contraditórios são removidos automaticamente. Resultado anterior vira histórico. Você verá um preview antes de salvar.</div>}
      </div>)}
      {mode==="manual"&&(<div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}><div><label style={lS}>Ticker *</label><input value={mT} onChange={function(e){setMT(e.target.value);}} style={iS}/></div><div><label style={lS}>Nome *</label><input value={mN} onChange={function(e){setMN(e.target.value);}} style={iS}/></div><div><label style={lS}>Trimestre</label><input value={mQ} onChange={function(e){setMQ(e.target.value);}} style={iS}/></div></div>
        <div><label style={lS}>Tese</label><textarea value={mTh} onChange={function(e){setMTh(e.target.value);}} rows={2} style={Object.assign({},iS,{resize:"vertical"})}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}><div><label style={lS}>Favoráveis da TESE (1/linha)</label><textarea value={mTP} onChange={function(e){setMTP(e.target.value);}} rows={3} style={Object.assign({},iS,{resize:"vertical"})}/></div><div><label style={lS}>Riscos da TESE (1/linha)</label><textarea value={mTC} onChange={function(e){setMTC(e.target.value);}} rows={3} style={Object.assign({},iS,{resize:"vertical"})}/></div></div>
        <div><label style={lS}>Resumo do Resultado</label><textarea value={mR} onChange={function(e){setMR(e.target.value);}} rows={2} style={Object.assign({},iS,{resize:"vertical"})}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}><div><label style={lS}>Destaques POSITIVOS do resultado (1/linha)</label><textarea value={mRP} onChange={function(e){setMRP(e.target.value);}} rows={3} style={Object.assign({},iS,{resize:"vertical"})}/></div><div><label style={lS}>Pontos de ATENÇÃO do resultado (1/linha)</label><textarea value={mRC} onChange={function(e){setMRC(e.target.value);}} rows={3} style={Object.assign({},iS,{resize:"vertical"})}/></div></div>
        <div><label style={lS}>Visão Suno</label><textarea value={mSV} onChange={function(e){setMSV(e.target.value);}} rows={2} style={Object.assign({},iS,{resize:"vertical"})}/></div>
        <div style={{display:"flex",gap:"12px",alignItems:"center",flexWrap:"wrap"}}><div style={{display:"flex",gap:"4px"}}>{["positive","neutral","negative"].map(function(x){var lb={positive:"Positivo",neutral:"Neutro",negative:"Negativo"};return <button key={x} onClick={function(){setMSe(x);}} style={{padding:"4px 10px",borderRadius:"12px",border:"none",cursor:"pointer",fontSize:"10px",fontWeight:600,background:mSe===x?"rgba(220,38,38,0.15)":"rgba(255,255,255,0.03)",color:mSe===x?"#DC2626":"rgba(255,255,255,0.3)"}}>{lb[x]}</button>;})}</div><button onClick={function(){setMH(!mH);}} style={{padding:"4px 10px",borderRadius:"12px",border:"none",cursor:"pointer",fontSize:"10px",fontWeight:600,background:mH?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.03)",color:mH?"#fbbf24":"rgba(255,255,255,0.3)"}}>{mH?"Destaque ON":"Destaque OFF"}</button></div>
        <button onClick={handleManual} disabled={!mT.trim()||!mN.trim()} style={{padding:"10px 20px",borderRadius:"8px",border:"none",cursor:"pointer",background:"#DC2626",color:"#fff",fontWeight:700,fontSize:"12px",opacity:(!mT.trim()||!mN.trim())?0.4:1,alignSelf:"flex-start"}}>Salvar</button>
      </div>)}
    </div>
  );
}

/* ─── Report PDF Generator ─── */
function ReportModal(p) {
  var [clientName, setClientName] = useState("");
  var [consultorName, setConsultorName] = useState("Rafael Manfroi Radaelli");
  var [selTickers, setSelTickers] = useState({});
  var [fields, setFields] = useState({tese:true,resultado:true,thesisPros:true,thesisCons:true,resultPros:true,resultCons:true,sunoView:true,nota:true});
  var [generating, setGenerating] = useState(false);
  var [genProgress, setGenProgress] = useState("");
  var [writingTone, setWritingTone] = useState("simples");

  var allStocks = [];
  ["Dividendos","Valor","Small Caps","Internacional"].forEach(function(port){
    (p.data[port]||[]).forEach(function(s){ allStocks.push(Object.assign({_port:port},s)); });
  });

  function toggleTicker(t){setSelTickers(function(prev){var n=Object.assign({},prev);if(n[t])delete n[t];else n[t]=true;return n;});}
  function toggleField(f){setFields(function(prev){var n=Object.assign({},prev);n[f]=!n[f];return n;});}
  function selectAll(){var n={};allStocks.forEach(function(s){n[s.ticker]=true;});setSelTickers(n);}
  function selectNone(){setSelTickers({});}

  var selCount = Object.keys(selTickers).length;

  // AI rewrite helper - rewrites text fields in selected tone
  async function rewriteTexts(stocks) {
    if (writingTone === "profissional") return stocks; // Original texts are already professional
    setGenProgress("Adaptando textos ao tom selecionado...");
    var batchSize = 5;
    var rewritten = stocks.map(function(s){return Object.assign({},s);});
    for (var b = 0; b < rewritten.length; b += batchSize) {
      var batch = rewritten.slice(b, b + batchSize);
      setGenProgress("Adaptando " + batch.map(function(s){return s.ticker;}).join(", ") + "...");
      var toRewrite = batch.map(function(s){
        return {
          ticker: s.ticker,
          thesis: fields.tese ? (s.thesis||"") : "",
          result: fields.resultado ? (s.result||"") : "",
          sunoView: fields.sunoView ? (s.sunoView||"") : "",
          thesisPros: fields.thesisPros ? (s.thesisPros||[]) : [],
          thesisCons: fields.thesisCons ? (s.thesisCons||[]) : [],
          resultPros: fields.resultPros ? (s.resultPros||[]) : [],
          resultCons: fields.resultCons ? (s.resultCons||[]) : []
        };
      });
      try {
        var sys = 'Reescreva os textos de investimento no tom solicitado. Mantenha TODOS os dados numericos e fatos. Apenas mude a linguagem.\n\nTOM: ' + getToneInstruction(writingTone, false)
          + '\n\nResponda SOMENTE com JSON puro: [{"ticker":"","thesis":"","result":"","sunoView":"","thesisPros":[""],"thesisCons":[""],"resultPros":[""],"resultCons":[""]}]';
        var resp = await fetch("/api/anthropic", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4096,system:sys,messages:[{role:"user",content:JSON.stringify(toRewrite)}]})});
        if (resp.ok) {
          var d = await resp.json();
          var raw = "";
          for (var i=0;i<(d.content||[]).length;i++){if(d.content[i].type==="text"&&d.content[i].text)raw+=d.content[i].text;}
          raw=raw.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");
          var si=raw.indexOf("[");var ei=raw.lastIndexOf("]");
          if(si>=0&&ei>si){
            var parsed=JSON.parse(raw.slice(si,ei+1));
            parsed.forEach(function(rw){
              for(var ri=b;ri<Math.min(b+batchSize,rewritten.length);ri++){
                if(rewritten[ri].ticker===rw.ticker){
                  if(rw.thesis)rewritten[ri].thesis=rw.thesis;
                  if(rw.result)rewritten[ri].result=rw.result;
                  if(rw.sunoView)rewritten[ri].sunoView=rw.sunoView;
                  if(rw.thesisPros&&rw.thesisPros.length)rewritten[ri].thesisPros=rw.thesisPros;
                  if(rw.thesisCons&&rw.thesisCons.length)rewritten[ri].thesisCons=rw.thesisCons;
                  if(rw.resultPros&&rw.resultPros.length)rewritten[ri].resultPros=rw.resultPros;
                  if(rw.resultCons&&rw.resultCons.length)rewritten[ri].resultCons=rw.resultCons;
                  break;
                }
              }
            });
          }
        }
      } catch(err) { console.error("Rewrite error:", err); }
    }
    return rewritten;
  }

  async function generate() {
    if (selCount === 0) return;
    setGenerating(true); setGenProgress("Preparando...");
    try {
      var selected=allStocks.filter(function(s){return selTickers[s.ticker];});
      selected.sort(function(a,b){return(b.rankScore||0)-(a.rankScore||0);});

      // Rewrite in selected tone if not professional
      if (writingTone !== "profissional") {
        selected = await rewriteTexts(selected);
      }

      setGenProgress("Gerando PDF...");
      var doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      var W = 210; var H = 297; var ML = 24; var MR = 20; var CW = W - ML - MR;
      var y = 0;

      var C = {
        black:[18,18,18],title:[30,30,30],body:[50,50,50],secondary:[100,100,100],
        caption:[140,140,140],muted:[175,175,175],rule:[215,215,215],
        bg_light:[245,245,245],bg_card:[250,250,252],
        accent:[180,40,40],
        positive:[25,120,65],positive_bg:[235,248,240],
        negative:[170,45,45],negative_bg:[252,238,238],
        neutral_tag:[90,90,90],
        amber:[150,105,25],amber_bg:[255,248,232]
      };
      function setC(c){doc.setTextColor(c[0],c[1],c[2]);}
      function setF(c){doc.setFillColor(c[0],c[1],c[2]);}
      function setD(c){doc.setDrawColor(c[0],c[1],c[2]);}
      function wrap(t,mw,sz){doc.setFontSize(sz);return doc.splitTextToSize(t||"",mw);}

      function drawHeader(){
        setF(C.accent);doc.rect(0,0,W,0.5,"F");
        doc.setFontSize(6.5);doc.setFont("helvetica","bold");setC(C.muted);
        doc.text("SUNO ADVISORY HUB",ML,8);
        doc.setFont("helvetica","normal");
        doc.text("PANORAMA DE RESULTADOS",W-MR,8,{align:"right"});
        setD(C.rule);doc.line(ML,11,W-MR,11);
      }
      function newPage(){doc.addPage();drawHeader();return 18;}
      function chk(needed){if(y+needed>H-16){y=newPage();return true;}return false;}

      // COVER
      setF(C.accent);doc.rect(0,0,W,1,"F");
      setF(C.accent);doc.rect(24,40,0.8,100,"F");
      doc.setFontSize(8);doc.setFont("helvetica","bold");setC(C.caption);
      doc.text("SUNO CONSULTORIA",32,46);
      doc.setFontSize(34);doc.setFont("helvetica","bold");setC(C.black);
      doc.text("Panorama",32,64);
      doc.text("de Resultados",32,80);
      doc.setFontSize(10);doc.setFont("helvetica","normal");setC(C.secondary);
      doc.text("Análise trimestral das empresas do seu portfólio",32,98);
      if(clientName.trim()){
        doc.setFontSize(7.5);doc.setFont("helvetica","normal");setC(C.secondary);
        doc.text("ELABORADO PARA",32,170);
        doc.setFontSize(18);doc.setFont("helvetica","bold");setC(C.title);
        doc.text(clientName.trim(),32,179);
      }
      if(consultorName.trim()){
        doc.setFontSize(7.5);doc.setFont("helvetica","normal");setC(C.secondary);
        doc.text("CONSULTOR",32,200);
        doc.setFontSize(10.5);doc.setFont("helvetica","normal");setC(C.body);
        doc.text(consultorName.trim(),32,207);
      }
      setD(C.caption);doc.line(32,268,W-MR,268);
      doc.setFontSize(8);doc.setFont("helvetica","normal");setC(C.secondary);
      doc.text(new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"}),32,274);
      setF(C.accent);doc.rect(0,H-1,W,1,"F");

      // STOCKS
      var curPort="";
      for(var si=0;si<selected.length;si++){
        var s=selected[si];
        if(si===0){y=newPage();}
        var estH=24;
        if(fields.tese)estH+=6+wrap(s.thesis,CW-6,8).length*4;
        if(fields.thesisPros)estH+=5+(s.thesisPros||[]).length*4;
        if(fields.thesisCons)estH+=5+(s.thesisCons||[]).length*4;
        if(fields.resultado)estH+=6+wrap(s.result,CW-6,8).length*4;
        if(fields.resultPros)estH+=5+(s.resultPros||[]).length*4;
        if(fields.resultCons)estH+=5+(s.resultCons||[]).length*4;
        if(fields.sunoView)estH+=6+wrap(s.sunoView,CW-6,8).length*4;
        chk(Math.min(estH,80));

        if(s._port!==curPort){
          curPort=s._port;
          if(y>22)y+=4;
          doc.setFontSize(6.5);doc.setFont("helvetica","bold");setC(C.accent);
          doc.text(curPort.toUpperCase(),ML,y);
          y+=4;setF(C.accent);doc.rect(ML,y,15,0.4,"F");y+=5;
        }

        setF(C.bg_card);setD(C.rule);doc.rect(ML,y-1,CW,18,"DF");
        doc.setFontSize(16);doc.setFont("helvetica","bold");setC(C.title);
        doc.text(s.ticker,ML+4,y+7);
        doc.setFontSize(8.5);doc.setFont("helvetica","normal");setC(C.secondary);
        doc.text(s.name+"  ·  "+s.quarter,ML+4,y+13);

        var badgeW=28;var badgeX=W-MR-badgeW-4;
        var sc=s.rankScore||0;
        var sentMap={positive:["POSITIVO","positive","positive_bg"],neutral:["NEUTRO","neutral_tag","bg_light"],negative:["NEGATIVO","negative","negative_bg"]};
        var sentInfo=sentMap[s.sentiment]||sentMap.neutral;

        if(sc&&fields.nota){
          var colName=sc>=8?"positive":sc>=5?"amber":"negative";
          var bgName=colName+"_bg";
          setF(C[bgName]||C.bg_light);doc.rect(badgeX,y+1.5,badgeW,7,"F");
          doc.setFontSize(13);doc.setFont("helvetica","bold");setC(C[colName]);
          doc.text(sc.toFixed(1),badgeX+badgeW/2,y+6.5,{align:"center"});
        }
        setF(C[sentInfo[2]]);doc.rect(badgeX,y+8.5,badgeW,5,"F");
        doc.setFontSize(5.5);doc.setFont("helvetica","bold");setC(C[sentInfo[1]]);
        doc.text(sentInfo[0],badgeX+badgeW/2,y+11.5,{align:"center"});

        y+=21;

        function drawText(label,text,lCol){
          chk(12);
          doc.setFontSize(6.5);doc.setFont("helvetica","bold");setC(lCol);
          doc.text(label,ML+2,y);y+=5;
          doc.setFontSize(8);doc.setFont("helvetica","normal");setC(C.body);
          var lines=wrap(text,CW-6,8);
          for(var i=0;i<lines.length;i++){chk(4.5);doc.setFontSize(8);doc.setFont("helvetica","normal");setC(C.body);doc.text(lines[i],ML+2,y);y+=4;}
          y+=3;
        }
        function drawBullets(label,items,bChar,bCol){
          if(!items||!items.length)return;
          chk(10);
          doc.setFontSize(6.5);doc.setFont("helvetica","bold");setC(bCol);
          doc.text(label,ML+2,y);y+=5;
          for(var i=0;i<items.length;i++){
            chk(5);
            doc.setFontSize(7.5);doc.setFont("helvetica","bold");setC(bCol);
            doc.text(bChar,ML+3,y);
            doc.setFont("helvetica","normal");setC(C.body);
            var il=wrap(items[i],CW-12,7.5);
            for(var j=0;j<il.length;j++){doc.setFontSize(7.5);doc.setFont("helvetica","normal");setC(C.body);doc.text(il[j],ML+8,y);y+=3.6;}
            y+=0.6;
          }
          y+=3;
        }

        if(fields.tese&&s.thesis)drawText("TESE DE INVESTIMENTO",s.thesis,C.title);
        if(fields.thesisPros)drawBullets("PONTOS FAVORÁVEIS",s.thesisPros,"+",C.positive);
        if(fields.thesisCons)drawBullets("RISCOS",s.thesisCons,"-",C.negative);
        if(fields.resultado&&s.result)drawText("RESULTADO  ·  "+s.quarter,s.result,C.amber);
        if(fields.resultPros)drawBullets("DESTAQUES",s.resultPros,"+",C.positive);
        if(fields.resultCons)drawBullets("ATENÇÃO",s.resultCons,"-",C.negative);
        if(fields.sunoView&&s.sunoView)drawText("VISÃO SUNO",s.sunoView,C.accent);

        y+=3;setD(C.rule);doc.line(ML,y,ML+25,y);y+=10;
      }

      var pc=doc.internal.getNumberOfPages();
      for(var pg=2;pg<=pc;pg++){
        doc.setPage(pg);
        doc.setFontSize(6.5);doc.setFont("helvetica","normal");setC(C.muted);
        doc.text((pg-1)+"  |  "+(pc-1),W/2,H-10,{align:"center"});
        setF(C.accent);doc.rect(0,H-0.5,W,0.5,"F");
      }

      var fn="panorama-resultados"+(clientName.trim()?"-"+clientName.trim().replace(/\s+/g,"-").toLowerCase():"")+".pdf";
      doc.save(fn);
    }catch(err){
      console.error(err);
      alert("Erro ao gerar PDF: "+err.message);
    }
    setGenerating(false); setGenProgress("");
  }

  var iS = {width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"10px 12px",color:"#e2e8f0",fontSize:"13px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  var lS = {fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:"4px",display:"block"};

  var fieldOpts = [
    {k:"tese",l:"Tese de investimento"},{k:"thesisPros",l:"Favoráveis da tese"},{k:"thesisCons",l:"Riscos da tese"},
    {k:"resultado",l:"Resumo do resultado"},{k:"resultPros",l:"Destaques positivos"},{k:"resultCons",l:"Pontos de atenção"},
    {k:"sunoView",l:"Visão Suno"},{k:"nota",l:"Nota (rankScore)"}
  ];

  return (
    <div style={p.inline?{padding:"0"}:{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:p.inline?"transparent":"#111",borderRadius:p.inline?"0":"14px",border:p.inline?"none":"1px solid rgba(255,255,255,0.08)",width:"100%",maxWidth:"650px",maxHeight:p.inline?"none":"90vh",overflow:"auto",padding:p.inline?"16px 24px 24px":"24px",margin:p.inline?"0 auto":"0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <div>
            <div style={{fontSize:"16px",fontWeight:800,color:"#fff"}}>Panorama de Resultados</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",marginTop:"2px"}}>Relatório PDF com ativos selecionados</div>
          </div>
          <button onClick={p.onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"18px",cursor:p.inline?"default":"pointer",display:p.inline?"none":"block"}}>&#10005;</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"10px",marginBottom:"14px"}}>
          <div><label style={lS}>Nome do Cliente</label><input value={clientName} onChange={function(e){setClientName(e.target.value);}} placeholder="Ex: João Silva" style={iS}/></div>
          <div><label style={lS}>Nome do Consultor</label><input value={consultorName} onChange={function(e){setConsultorName(e.target.value);}} placeholder="Ex: Rafael Radaelli" style={iS}/></div>
        </div>

        <div style={{marginBottom:"14px"}}>
          <label style={Object.assign({},lS,{marginBottom:"6px"})}>Tom do texto no PDF</label>
          <ToneSelector value={writingTone} onChange={setWritingTone} color="#ef4444"/>
          {writingTone!=="profissional"&&<div style={{fontSize:"9px",color:"rgba(251,191,36,0.5)",marginTop:"4px"}}>A IA vai adaptar os textos para o tom "{writingTone==="simples"?"Simples":"Intermediário"}" antes de gerar o PDF</div>}
        </div>

        <div style={{marginBottom:"14px"}}>
          <label style={Object.assign({},lS,{marginBottom:"6px"})}>Campos do relatório</label>
          <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
            {fieldOpts.map(function(f){return <button key={f.k} onClick={function(){toggleField(f.k);}} style={{padding:"5px 11px",borderRadius:"12px",border:"none",cursor:"pointer",fontSize:"10px",fontWeight:600,background:fields[f.k]?"rgba(220,38,38,0.15)":"rgba(255,255,255,0.03)",color:fields[f.k]?"#DC2626":"rgba(255,255,255,0.3)"}}>{f.l}</button>;})}
          </div>
        </div>

        <div style={{marginBottom:"14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px",flexWrap:"wrap",gap:"6px"}}>
            <label style={Object.assign({},lS,{marginBottom:0})}>Empresas ({selCount} selecionadas)</label>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={selectAll} style={{fontSize:"10px",color:"rgba(74,222,128,0.7)",background:"transparent",border:"none",cursor:"pointer",fontWeight:600}}>Todas</button>
              <button onClick={selectNone} style={{fontSize:"10px",color:"rgba(248,113,113,0.7)",background:"transparent",border:"none",cursor:"pointer",fontWeight:600}}>Nenhuma</button>
            </div>
          </div>
          <div style={{maxHeight:"260px",overflow:"auto",background:"rgba(255,255,255,0.02)",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)",padding:"6px",WebkitOverflowScrolling:"touch"}}>
            {["Dividendos","Valor","Small Caps","Internacional"].map(function(port){
              var ps = (p.data[port]||[]).slice().sort(function(a,b){return (b.rankScore||0)-(a.rankScore||0);});
              if (ps.length === 0) return null;
              return <div key={port} style={{marginBottom:"8px"}}>
                <div style={{fontSize:"9px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1px",padding:"4px 6px"}}>{port}</div>
                {ps.map(function(s){
                  var checked = !!selTickers[s.ticker];
                  var scColor = (s.rankScore||0)>=8?"#4ade80":(s.rankScore||0)>=5?"#fbbf24":"#f87171";
                  return <div key={s.ticker} onClick={function(){toggleTicker(s.ticker);}} style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px",cursor:"pointer",borderRadius:"6px",background:checked?"rgba(220,38,38,0.08)":"transparent",minHeight:"36px"}}>
                    <div style={{width:"18px",height:"18px",borderRadius:"4px",border:checked?"2px solid #DC2626":"2px solid rgba(255,255,255,0.15)",background:checked?"#DC2626":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#fff",flexShrink:0}}>{checked?"✓":""}</div>
                    <span style={{fontSize:"12px",fontWeight:600,color:"#f1f5f9",minWidth:"50px",flexShrink:0}}>{s.ticker}</span>
                    <span style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
                    {s.rankScore&&<span style={{fontSize:"10px",fontWeight:700,color:scColor,flexShrink:0}}>{s.rankScore.toFixed(1)}</span>}
                  </div>;
                })}
              </div>;
            })}
          </div>
        </div>

        <button onClick={generate} disabled={selCount===0||generating} style={{width:"100%",padding:"13px",borderRadius:"8px",border:"none",cursor:generating?"wait":"pointer",background:selCount===0?"rgba(255,255,255,0.05)":"#DC2626",color:selCount===0?"rgba(255,255,255,0.3)":"#fff",fontWeight:700,fontSize:"13px",opacity:generating?0.6:1,minHeight:"44px"}}>
          {generating?(genProgress||"Gerando..."):"Gerar PDF (" + selCount + " empresa" + (selCount!==1?"s":"") + ")"}
        </button>
      </div>
    </div>
  );
}

/* ─── Client Profiles System ─── */
var ALLOC_CLASSES = ["Renda Fixa","Ações BR","FIIs","Internacional","Alternativos"];
var RISK_PROFILES = ["Conservador","Moderado","Arrojado","Agressivo"];
var EXP_LEVELS = ["Iniciante","Intermediário","Avançado"];

function makeEmptyProfile() {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    name: "", age: "", profession: "", maritalStatus: "",
    totalWealth: "", monthlyIncome: "", monthlyContribution: "",
    experience: "Intermediário", riskProfile: "Moderado",
    horizon: "5", hasEmergencyReserve: true, liquidityNeed: "Baixa",
    longTermGoals: "", strategy: "",
    notes: "",
    allocation: {
      "Renda Fixa": {target: 30, current: 0},
      "Ações BR": {target: 25, current: 0},
      "FIIs": {target: 20, current: 0},
      "Internacional": {target: 20, current: 0},
      "Alternativos": {target: 5, current: 0}
    },
    jbData: null, // Journey Book data saved permanently
    jbImportDate: null,
    createdAt: new Date().toISOString().slice(0,10),
    updatedAt: new Date().toISOString().slice(0,10)
  };
}

function loadClientProfiles() {
  try {
    var s = localStorage.getItem("tt-clients");
    if (s) return JSON.parse(s);
  } catch(e) {}
  return [];
}

function saveClientProfiles(profiles) {
  try { localStorage.setItem("tt-clients", JSON.stringify(profiles)); } catch(e) {}
}

function ClientProfileEditor(p) {
  var prof = p.profile;
  var onChange = p.onChange;
  var compact = p.compact;

  function set(field, val) {
    var updated = Object.assign({}, prof);
    updated[field] = val;
    updated.updatedAt = new Date().toISOString().slice(0,10);
    onChange(updated);
  }
  function setAlloc(cls, field, val) {
    var updated = Object.assign({}, prof);
    var alloc = Object.assign({}, updated.allocation || {});
    alloc[cls] = Object.assign({}, alloc[cls] || {target:0,current:0});
    alloc[cls][field] = parseFloat(val) || 0;
    updated.allocation = alloc;
    updated.updatedAt = new Date().toISOString().slice(0,10);
    onChange(updated);
  }

  var iS = {width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"7px 10px",color:"#e2e8f0",fontSize:"12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  var lS = {fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:"3px",display:"block"};
  var selS = Object.assign({}, iS);
  var secTitle = {fontSize:"9px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:"6px",marginTop:compact?"8px":"14px"};

  var allocObj = prof.allocation || {};
  var totalTarget = ALLOC_CLASSES.reduce(function(s,c){return s + ((allocObj[c]||{}).target||0);},0);
  var totalCurrent = ALLOC_CLASSES.reduce(function(s,c){return s + ((allocObj[c]||{}).current||0);},0);

  return (
    <div>
      {/* Personal data */}
      <div style={secTitle}>Dados Pessoais</div>
      <div style={{display:"grid",gridTemplateColumns:compact?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:"8px",marginBottom:"8px"}}>
        <div><label style={lS}>Nome completo *</label><input value={prof.name||""} onChange={function(e){set("name",e.target.value);}} style={iS}/></div>
        <div><label style={lS}>Idade</label><input value={prof.age||""} onChange={function(e){set("age",e.target.value);}} placeholder="Ex: 45" type="number" style={iS}/></div>
        <div><label style={lS}>Profissão</label><input value={prof.profession||""} onChange={function(e){set("profession",e.target.value);}} style={iS}/></div>
        <div><label style={lS}>Estado civil</label><select value={prof.maritalStatus||""} onChange={function(e){set("maritalStatus",e.target.value);}} style={selS}>
          <option value="" style={{background:"#1a1a1a"}}>—</option>
          <option value="Solteiro(a)" style={{background:"#1a1a1a"}}>Solteiro(a)</option>
          <option value="Casado(a)" style={{background:"#1a1a1a"}}>Casado(a)</option>
          <option value="Divorciado(a)" style={{background:"#1a1a1a"}}>Divorciado(a)</option>
          <option value="Viúvo(a)" style={{background:"#1a1a1a"}}>Viúvo(a)</option>
          <option value="União estável" style={{background:"#1a1a1a"}}>União estável</option>
        </select></div>
      </div>

      {/* Financial data */}
      <div style={secTitle}>Dados Financeiros</div>
      <div style={{display:"grid",gridTemplateColumns:compact?"1fr 1fr":"1fr 1fr 1fr",gap:"8px",marginBottom:"8px"}}>
        <div><label style={lS}>Patrimônio total (R$)</label><input value={prof.totalWealth||""} onChange={function(e){set("totalWealth",e.target.value);}} placeholder="Ex: 1500000" style={iS}/></div>
        <div><label style={lS}>Renda mensal (R$)</label><input value={prof.monthlyIncome||""} onChange={function(e){set("monthlyIncome",e.target.value);}} placeholder="Ex: 25000" style={iS}/></div>
        <div><label style={lS}>Capacidade de aporte mensal (R$)</label><input value={prof.monthlyContribution||""} onChange={function(e){set("monthlyContribution",e.target.value);}} placeholder="Ex: 5000" style={iS}/></div>
      </div>

      {/* Investor profile */}
      <div style={secTitle}>Perfil Investidor</div>
      <div style={{display:"grid",gridTemplateColumns:compact?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:"8px",marginBottom:"8px"}}>
        <div><label style={lS}>Experiência</label>
          <div style={{display:"flex",gap:"3px"}}>{EXP_LEVELS.map(function(x){return <button key={x} onClick={function(){set("experience",x);}} style={{flex:1,padding:"5px 4px",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"10px",fontWeight:600,background:prof.experience===x?"rgba(220,38,38,0.15)":"rgba(255,255,255,0.03)",color:prof.experience===x?"#DC2626":"rgba(255,255,255,0.3)"}}>{x}</button>;})}</div>
        </div>
        <div><label style={lS}>Apetite para risco</label>
          <div style={{display:"flex",gap:"3px"}}>{RISK_PROFILES.map(function(x){
            var colors = {Conservador:"#60a5fa",Moderado:"#4ade80",Arrojado:"#fbbf24",Agressivo:"#f87171"};
            return <button key={x} onClick={function(){set("riskProfile",x);}} style={{flex:1,padding:"5px 2px",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"9px",fontWeight:600,background:prof.riskProfile===x?"rgba(220,38,38,0.15)":"rgba(255,255,255,0.03)",color:prof.riskProfile===x?colors[x]:"rgba(255,255,255,0.25)"}}>{x}</button>;
          })}</div>
        </div>
        <div><label style={lS}>Horizonte (anos)</label><input value={prof.horizon||""} onChange={function(e){set("horizon",e.target.value);}} placeholder="Ex: 10" type="number" style={iS}/></div>
        <div><label style={lS}>Necessidade de liquidez</label><select value={prof.liquidityNeed||"Baixa"} onChange={function(e){set("liquidityNeed",e.target.value);}} style={selS}>
          <option value="Baixa" style={{background:"#1a1a1a"}}>Baixa</option>
          <option value="Média" style={{background:"#1a1a1a"}}>Média</option>
          <option value="Alta" style={{background:"#1a1a1a"}}>Alta</option>
        </select></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:"8px",marginBottom:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <button onClick={function(){set("hasEmergencyReserve",!prof.hasEmergencyReserve);}} style={{width:"18px",height:"18px",borderRadius:"4px",border:prof.hasEmergencyReserve?"2px solid #4ade80":"2px solid rgba(255,255,255,0.15)",background:prof.hasEmergencyReserve?"#4ade80":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"#fff",cursor:"pointer",flexShrink:0}}>{prof.hasEmergencyReserve?"✓":""}</button>
          <span style={{fontSize:"11px",color:"rgba(255,255,255,0.5)"}}>Possui reserva de emergência adequada</span>
        </div>
      </div>

      {/* Goals & Strategy */}
      <div style={secTitle}>Objetivos e Estratégia</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"8px"}}>
        <div><label style={lS}>Objetivos de longo prazo</label><textarea value={prof.longTermGoals||""} onChange={function(e){set("longTermGoals",e.target.value);}} rows={2} placeholder="Ex: Aposentadoria aos 55 anos, renda passiva de R$15k/mês, educação dos filhos..." style={Object.assign({},iS,{resize:"vertical",fontSize:"11px"})}/></div>
        <div><label style={lS}>Estratégia definida</label><textarea value={prof.strategy||""} onChange={function(e){set("strategy",e.target.value);}} rows={2} placeholder="Ex: Foco em dividendos + crescimento patrimonial via ações de valor..." style={Object.assign({},iS,{resize:"vertical",fontSize:"11px"})}/></div>
      </div>
      <div><label style={lS}>Observações adicionais</label><textarea value={prof.notes||""} onChange={function(e){set("notes",e.target.value);}} rows={1} placeholder="Informações relevantes sobre o cliente..." style={Object.assign({},iS,{resize:"vertical",fontSize:"11px"})}/></div>

      {/* Allocation targets */}
      <div style={secTitle}>Alocação — Meta vs Atual (%)</div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)",padding:"8px",marginBottom:"4px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 60px",gap:"4px",marginBottom:"4px"}}>
          <div style={{fontSize:"9px",fontWeight:600,color:"rgba(255,255,255,0.3)"}}>Classe</div>
          <div style={{fontSize:"9px",fontWeight:600,color:"#fbbf24",textAlign:"center"}}>Meta %</div>
          <div style={{fontSize:"9px",fontWeight:600,color:"#60a5fa",textAlign:"center"}}>Atual %</div>
          <div style={{fontSize:"9px",fontWeight:600,color:"rgba(255,255,255,0.2)",textAlign:"center"}}>Desvio</div>
        </div>
        {ALLOC_CLASSES.map(function(cls){
          var al = allocObj[cls] || {target:0,current:0};
          var diff = al.current - al.target;
          var diffColor = Math.abs(diff) <= 3 ? "#4ade80" : Math.abs(diff) <= 8 ? "#fbbf24" : "#f87171";
          return <div key={cls} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 60px",gap:"4px",alignItems:"center",padding:"3px 0",borderTop:"1px solid rgba(255,255,255,0.03)"}}>
            <div style={{fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.6)"}}>{cls}</div>
            <input value={al.target||""} onChange={function(e){setAlloc(cls,"target",e.target.value);}} type="number" style={{background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.12)",borderRadius:"6px",padding:"4px 6px",color:"#fbbf24",fontSize:"11px",textAlign:"center",outline:"none",width:"100%",boxSizing:"border-box"}}/>
            <input value={al.current||""} onChange={function(e){setAlloc(cls,"current",e.target.value);}} type="number" style={{background:"rgba(96,165,250,0.05)",border:"1px solid rgba(96,165,250,0.12)",borderRadius:"6px",padding:"4px 6px",color:"#60a5fa",fontSize:"11px",textAlign:"center",outline:"none",width:"100%",boxSizing:"border-box"}}/>
            <div style={{fontSize:"10px",fontWeight:700,color:diffColor,textAlign:"center"}}>{diff > 0?"+":""}{diff.toFixed(1)}</div>
          </div>;
        })}
        <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 60px",gap:"4px",alignItems:"center",padding:"5px 0",borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:"2px"}}>
          <div style={{fontSize:"10px",fontWeight:700,color:"rgba(255,255,255,0.6)"}}>Total</div>
          <div style={{fontSize:"10px",fontWeight:700,color:totalTarget===100?"#4ade80":"#f87171",textAlign:"center"}}>{totalTarget}%</div>
          <div style={{fontSize:"10px",fontWeight:700,color:totalCurrent===100?"#4ade80":"#f87171",textAlign:"center"}}>{totalCurrent}%</div>
          <div></div>
        </div>
        {totalTarget !== 100 && <div style={{fontSize:"9px",color:"#f87171",marginTop:"2px"}}>Meta deve somar 100% (atualmente {totalTarget}%)</div>}
      </div>
    </div>
  );
}

function ClientProfilesModal(p) {
  var [profiles, setProfiles] = useState(function(){return loadClientProfiles();});
  var [editing, setEditing] = useState(null); // profile id or null
  var [editData, setEditData] = useState(null);

  function saveAll(list) { setProfiles(list); saveClientProfiles(list); }

  function addNew() {
    var np = makeEmptyProfile();
    setEditing(np.id);
    setEditData(np);
  }
  function editProfile(id) {
    var found = profiles.find(function(pr){return pr.id===id;});
    if (found) { setEditing(found.id); setEditData(Object.assign({},found)); }
  }
  function saveEdit() {
    if (!editData || !editData.name.trim()) return;
    var idx = profiles.findIndex(function(pr){return pr.id===editData.id;});
    var list = profiles.slice();
    if (idx >= 0) list[idx] = editData; else list.push(editData);
    saveAll(list);
    setEditing(null); setEditData(null);
  }
  function deleteProfile(id) {
    if (!confirm("Excluir este perfil de cliente?")) return;
    saveAll(profiles.filter(function(pr){return pr.id!==id;}));
  }
  function cancelEdit() { setEditing(null); setEditData(null); }

  var btnBase = {padding:"7px 14px",borderRadius:"7px",border:"none",cursor:"pointer",fontWeight:700,fontSize:"11px"};

  return (
    <div style={p.inline?{padding:"0"}:{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:"#0A0A0A",borderRadius:"16px",border:"1px solid rgba(220,38,38,0.15)",width:"100%",maxWidth:editing?"750px":"550px",maxHeight:"92vh",overflow:"auto",padding:"0"}}>
        <div style={{padding:"20px 24px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#0A0A0A",zIndex:10,borderRadius:"16px 16px 0 0"}}>
          <div>
            <div style={{fontSize:"16px",fontWeight:800,color:"#fff"}}>{editing?"Editar Perfil":"Perfis de Clientes"}</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",marginTop:"2px"}}>{editing?"Dados do investidor":"Cadastro de perfis para relatórios consultivos"}</div>
          </div>
          <button onClick={p.onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"20px",cursor:"pointer",padding:"4px 8px"}}>{"✕"}</button>
        </div>
        <div style={{padding:"16px 24px 24px"}}>
          {!editing && (<div>
            <button onClick={addNew} style={Object.assign({},btnBase,{background:"#DC2626",color:"#fff",marginBottom:"14px",width:"100%"})}>+ Novo Cliente</button>
            {profiles.length === 0 && <div style={{textAlign:"center",padding:"30px 0",color:"rgba(255,255,255,0.15)",fontSize:"12px"}}>Nenhum perfil cadastrado ainda.</div>}
            {profiles.map(function(pr){
              var riskColors = {Conservador:"#60a5fa",Moderado:"#4ade80",Arrojado:"#fbbf24",Agressivo:"#f87171"};
              var hasJB = !!(pr.jbData);
              var hasPos = !!(pr.posAssets && pr.posAssets.length > 0);
              var posTotal = hasPos ? pr.posAssets.reduce(function(s,a){return s+(a.totalValue||0);},0) : 0;
              var posCount = hasPos ? pr.posAssets.filter(function(a){return a.totalValue>0;}).length : 0;
              return <div key={pr.id} style={{background:"#111",borderRadius:"10px",padding:"14px",border:"1px solid rgba(255,255,255,0.06)",marginBottom:"6px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <span style={{fontSize:"13px",fontWeight:700,color:"#f1f5f9"}}>{pr.name || "Sem nome"}</span>
                    {hasJB && <span style={{fontSize:"7px",padding:"2px 5px",borderRadius:"6px",background:"rgba(251,191,36,0.1)",color:"#fbbf24",fontWeight:700,letterSpacing:"0.5px"}}>JB</span>}
                    {hasPos && <span style={{fontSize:"7px",padding:"2px 5px",borderRadius:"6px",background:"rgba(74,222,128,0.1)",color:"#4ade80",fontWeight:700,letterSpacing:"0.5px"}}>{posCount} ativos</span>}
                  </div>
                  <div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)",marginTop:"2px"}}>
                    {pr.age && pr.age + " anos"}{pr.profession && " · " + pr.profession}
                    {pr.riskProfile && <span style={{marginLeft:"6px",padding:"1px 6px",borderRadius:"8px",background:"rgba(255,255,255,0.04)",color:riskColors[pr.riskProfile]||"#888",fontSize:"9px",fontWeight:600}}>{pr.riskProfile}</span>}
                    {hasPos && posTotal > 0 && <span style={{marginLeft:"6px",color:"rgba(255,255,255,0.25)"}}>R$ {posTotal.toLocaleString("pt-BR",{maximumFractionDigits:0})}</span>}
                    {!hasPos && pr.totalWealth && <span style={{marginLeft:"6px",color:"rgba(255,255,255,0.25)"}}>R$ {parseFloat(pr.totalWealth).toLocaleString("pt-BR")}</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:"4px"}}>
                  <button onClick={function(){editProfile(pr.id);}} style={Object.assign({},btnBase,{background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.5)",fontSize:"10px",padding:"5px 10px"})}>Editar</button>
                  <button onClick={function(){deleteProfile(pr.id);}} style={Object.assign({},btnBase,{background:"transparent",color:"rgba(220,38,38,0.5)",fontSize:"10px",padding:"5px 10px",border:"1px solid rgba(220,38,38,0.15)"})}>Excluir</button>
                </div>
              </div>;
            })}
          </div>)}
          {editing && editData && (<div>
            <ClientProfileEditor profile={editData} onChange={setEditData}/>
            <div style={{display:"flex",gap:"8px",marginTop:"14px"}}>
              <button onClick={cancelEdit} style={Object.assign({},btnBase,{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"})}>Cancelar</button>
              <button onClick={saveEdit} disabled={!editData.name.trim()} style={Object.assign({},btnBase,{flex:1,background:editData.name.trim()?"#DC2626":"rgba(255,255,255,0.05)",color:editData.name.trim()?"#fff":"rgba(255,255,255,0.3)"})}>Salvar Perfil</button>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
}

/* ─── Macro & Bias Module (Pilar 4) ─── */
var SUNO_PROFILES = ["Conservador","Moderado","Dinâmico","Arrojado","Sofisticado","Defensivo","Intermediário","Longo Prazo"];
var SUNO_BENCHMARKS = {"Conservador":"110%","Moderado":"115%","Dinâmico":"120%","Arrojado":"125%","Sofisticado":"130%","Defensivo":"125%","Intermediário":"130%","Longo Prazo":"135%"};
var BIAS_CLASSES = [
  {group:"Crédito",items:["Cash","Pós-fixado","Pré-fixado","IPCA+"]},
  {group:"Equities",items:["FIIs","Alternativos","Ações Brasil"]},
  {group:"Offshore",items:["Equities Offshore","Credit Offshore"]}
];
var ALL_BIAS_ITEMS = [];
BIAS_CLASSES.forEach(function(g){g.items.forEach(function(it){ALL_BIAS_ITEMS.push(it);});});

// Currency formatting helpers
function formatBRL(val) {
  if (!val && val !== 0) return "";
  var num = typeof val === "string" ? parseInt(val.replace(/\D/g, "")) || 0 : Math.round(val);
  if (num === 0) return "";
  return num.toLocaleString("pt-BR");
}
function parseBRL(str) {
  return parseInt(String(str).replace(/\D/g, "")) || 0;
}

function cleanCitations(text) {
  if (!text) return "";
  return text.replace(/<cite[^>]*>/g, "").replace(/<\/cite>/g, "").replace(/<[^>]+>/g, "");
}



function loadMacroData() {
  try { var s = localStorage.getItem("tt-macro"); if (s) return JSON.parse(s); } catch(e) {}
  return { macroReports:[], biasViews:{}, allocationTable:{} };
}
function saveMacroData(d) { try { localStorage.setItem("tt-macro", JSON.stringify(d)); } catch(e) {} }

function MacroModal(p) {
  var [macroData, setMacroData] = useState(function(){
    var d = loadMacroData();
    // Migrate old single report to array
    if (d.macroReport && (!d.macroReports || d.macroReports.length === 0)) {
      d.macroReports = [{id: Date.now().toString(36), date: d.macroDate || new Date().toISOString().slice(0,10), title: "Relatório Macro", text: d.macroReport}];
      delete d.macroReport; delete d.macroDate;
    }
    if (!d.macroReports) d.macroReports = [];
    return d;
  });
  var [tab, setTab] = useState("report");
  var [importing, setImporting] = useState(false);
  var biasFileRef = useRef(null);

  // Report editing state
  var [addingReport, setAddingReport] = useState(false);
  var [editReportId, setEditReportId] = useState(null);
  var [rTitle, setRTitle] = useState("");
  var [rDate, setRDate] = useState(new Date().toISOString().slice(0,10));
  var [rText, setRText] = useState("");

  function save(updated) { setMacroData(updated); saveMacroData(updated); }

  function startAddReport() {
    setAddingReport(true); setEditReportId(null);
    setRTitle(""); setRDate(new Date().toISOString().slice(0,10)); setRText("");
  }
  function startEditReport(id) {
    var rep = (macroData.macroReports||[]).find(function(r){return r.id===id;});
    if (!rep) return;
    setEditReportId(id); setAddingReport(true);
    setRTitle(rep.title||""); setRDate(rep.date||""); setRText(rep.text||"");
  }
  function saveReport() {
    if (!rText.trim()) return;
    var u = Object.assign({}, macroData);
    var reports = (u.macroReports||[]).slice();
    if (editReportId) {
      reports = reports.map(function(r){
        if (r.id === editReportId) return {id:r.id, date:rDate, title:rTitle.trim()||"Relatório Macro", text:rText};
        return r;
      });
    } else {
      reports.unshift({id: Date.now().toString(36) + Math.random().toString(36).slice(2,5), date:rDate, title:rTitle.trim()||"Relatório Macro", text:rText});
    }
    u.macroReports = reports;
    save(u);
    setAddingReport(false); setEditReportId(null); setRTitle(""); setRDate(""); setRText("");
  }
  function deleteReport(id) {
    if (!confirm("Excluir este relatório?")) return;
    var u = Object.assign({}, macroData);
    u.macroReports = (u.macroReports||[]).filter(function(r){return r.id!==id;});
    save(u);
  }
  function cancelReport() { setAddingReport(false); setEditReportId(null); }

  function setBiasView(item, val) {
    var u = Object.assign({}, macroData);
    u.biasViews = Object.assign({}, u.biasViews || {});
    u.biasViews[item] = parseInt(val) || 0;
    save(u);
  }

  function setAllocCell(profile, item, field, val) {
    var u = Object.assign({}, macroData);
    u.allocationTable = Object.assign({}, u.allocationTable || {});
    var key = profile + "||" + item;
    u.allocationTable[key] = Object.assign({}, u.allocationTable[key] || {});
    u.allocationTable[key][field] = parseFloat(val) || 0;
    save(u);
  }

  function getAlloc(profile, item, field) {
    var t = macroData.allocationTable || {};
    var cell = t[profile + "||" + item];
    return cell ? (cell[field] || 0) : 0;
  }

  async function handleBiasUpload(e) {
    var f = e.target.files[0]; if (!f) return;
    setImporting(true);
    try {
      var u = Object.assign({}, macroData);
      u.biasViews = Object.assign({}, u.biasViews || {});
      u.allocationTable = Object.assign({}, u.allocationTable || {});

      var isImage = /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(f.name) || f.type.startsWith("image/");
      var sysPrompt = 'Voce recebera uma tabela de alocacao por perfil de investidor. Extraia em JSON: {"views":{"Cash":-1,"Pós-fixado":-2,...},"allocations":{"Conservador||Cash":{"strategic":18,"tactical":16},"Conservador||Pós-fixado":{"strategic":35,"tactical":10},...}} Inclua TODOS os perfis (Conservador,Moderado,Dinâmico,Arrojado,Sofisticado,Defensivo,Intermediário,Longo Prazo) e TODAS as subclasses (Cash,Pós-fixado,Pré-fixado,IPCA+,FIIs,Alternativos,Ações Brasil,Equities Offshore,Credit Offshore). Views sao a coluna "View" com valores de -2 a +2. Strategic e Tactical sao as colunas "Estratégico" e "Tático" de cada perfil (numeros inteiros sem %). JSON puro sem markdown.';

      var messages;

      if (isImage) {
        // Read as base64 for image upload
        var b64 = await new Promise(function(res, rej) {
          var r = new FileReader();
          r.onload = function() { res(r.result.split(",")[1]); };
          r.onerror = function() { rej(new Error("Erro leitura")); };
          r.readAsDataURL(f);
        });
        var mimeType = f.type || "image/png";
        messages = [{role:"user", content:[
          {type:"image", source:{type:"base64", media_type:mimeType, data:b64}},
          {type:"text", text:"Extraia todos os dados desta tabela de alocação no formato JSON solicitado."}
        ]}];
      } else {
        // Excel file
        var arrayBuf = await new Promise(function(res, rej) {
          var r = new FileReader(); r.onload = function(){res(r.result);}; r.onerror = function(){rej(new Error("Erro"));}; r.readAsArrayBuffer(f);
        });
        var wb = XLSX.read(arrayBuf, {type:"array"});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var raw = XLSX.utils.sheet_to_json(ws, {header:1, defval:""});
        var tableText = raw.map(function(row){return row.join("\t");}).join("\n");
        messages = [{role:"user", content:"Tabela:\n"+tableText}];
      }

      var resp = await fetch("/api/anthropic", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:4096,
          system: sysPrompt,
          messages: messages
        })
      });
      if (!resp.ok) throw new Error("API " + resp.status);
      var d = await resp.json();
      var rawText = "";
      for (var i=0;i<d.content.length;i++){if(d.content[i].text)rawText+=d.content[i].text;}
      rawText = rawText.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");
      var si=rawText.indexOf("{");var ei=rawText.lastIndexOf("}");
      if(si>=0&&ei>si)rawText=rawText.slice(si,ei+1);
      rawText=rawText.replace(/,\s*}/g,"}").replace(/,\s*\]/g,"]");
      var parsed = JSON.parse(rawText);

      if (parsed.views) u.biasViews = parsed.views;
      if (parsed.allocations) {
        Object.keys(parsed.allocations).forEach(function(key){
          u.allocationTable[key] = parsed.allocations[key];
        });
      }
      save(u);
    } catch(err) { console.error(err); alert("Erro ao importar: " + err.message); }
    setImporting(false);
  }

  var iS={width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"8px 10px",color:"#e2e8f0",fontSize:"12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  var lS={fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:"4px",display:"block"};
  var biasColors = {"-2":"#ef4444","-1":"#f97316","0":"#94a3b8","1":"#22c55e","2":"#10b981"};
  var biasLabels = {"-2":"Muito Pessimista","-1":"Pessimista","0":"Neutro","1":"Otimista","2":"Muito Otimista"};

  return (
    <div style={p.inline?{padding:"0"}:{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:"#0A0A0A",borderRadius:"16px",border:"1px solid rgba(251,191,36,0.15)",width:"100%",maxWidth:"900px",maxHeight:"92vh",overflow:"auto",padding:"0"}}>
        <div style={{padding:"20px 24px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#0A0A0A",zIndex:10,borderRadius:"16px 16px 0 0"}}>
          <div>
            <div style={{fontSize:"16px",fontWeight:800,color:"#fff"}}>Macro & Viés Tático</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",marginTop:"2px"}}>Pilar 4 — Visão macroeconômica e alocação tática da Suno</div>
          </div>
          <button onClick={p.onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"20px",cursor:p.inline?"default":"pointer",display:p.inline?"none":"block"}}>✕</button>
        </div>

        <div style={{display:"flex",gap:"2px",padding:"10px 24px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          {[{k:"report",l:"Relatório Macro"},{k:"bias",l:"Viés & Alocação"}].map(function(t){
            return <button key={t.k} onClick={function(){setTab(t.k);}} style={{padding:"8px 16px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:700,borderRadius:"7px 7px 0 0",background:tab===t.k?"rgba(251,191,36,0.12)":"transparent",color:tab===t.k?"#fbbf24":"rgba(255,255,255,0.3)"}}>{t.l}</button>;
          })}
        </div>

        <div style={{padding:"20px 24px 24px"}}>
          {tab==="report"&&(<div>
            {!addingReport && (<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                <div>
                  <div style={{fontSize:"12px",fontWeight:700,color:"#fff"}}>Relatórios Macro Acumulados</div>
                  <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)"}}>{(macroData.macroReports||[]).length} relatório(s) salvos — IA usa os últimos 10</div>
                </div>
                <button onClick={startAddReport} style={{padding:"7px 14px",borderRadius:"7px",border:"none",background:"#DC2626",color:"#fff",fontWeight:700,fontSize:"10px",cursor:"pointer"}}>+ Novo Relatório</button>
              </div>
              {(macroData.macroReports||[]).length === 0 && <div style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,0.15)",fontSize:"12px"}}>Nenhum relatório macro cadastrado. Clique em "+ Novo Relatório" para começar a alimentar a inteligência macro.</div>}
              {(macroData.macroReports||[]).map(function(rep, idx){
                return <div key={rep.id} style={{background:idx<10?"#111":"rgba(255,255,255,0.02)",borderRadius:"10px",padding:"12px",border:idx<10?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(255,255,255,0.03)",marginBottom:"6px",opacity:idx>=10?0.5:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      {idx<10 && <span style={{fontSize:"8px",padding:"2px 6px",borderRadius:"6px",background:"rgba(74,222,128,0.1)",color:"#4ade80",fontWeight:600}}>ATIVO</span>}
                      {idx>=10 && <span style={{fontSize:"8px",padding:"2px 6px",borderRadius:"6px",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.25)",fontWeight:600}}>ARQUIVO</span>}
                      <span style={{fontSize:"12px",fontWeight:700,color:"#f1f5f9"}}>{rep.title || "Relatório Macro"}</span>
                      <span style={{fontSize:"10px",color:"rgba(255,255,255,0.3)"}}>{rep.date}</span>
                    </div>
                    <div style={{display:"flex",gap:"4px"}}>
                      <button onClick={function(){startEditReport(rep.id);}} style={{fontSize:"9px",color:"rgba(255,255,255,0.4)",background:"rgba(255,255,255,0.04)",border:"none",borderRadius:"4px",padding:"3px 8px",cursor:"pointer"}}>Editar</button>
                      <button onClick={function(){deleteReport(rep.id);}} style={{fontSize:"9px",color:"rgba(220,38,38,0.5)",background:"transparent",border:"1px solid rgba(220,38,38,0.15)",borderRadius:"4px",padding:"3px 8px",cursor:"pointer"}}>Excluir</button>
                    </div>
                  </div>
                  <div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)",lineHeight:1.5,maxHeight:"60px",overflow:"hidden"}}>{(rep.text||"").slice(0,300)}{(rep.text||"").length>300?"...":""}</div>
                </div>;
              })}
            </div>)}
            {addingReport && (<div>
              <div style={{fontSize:"12px",fontWeight:700,color:"#fff",marginBottom:"10px"}}>{editReportId ? "Editar Relatório" : "Novo Relatório Macro"}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                <div><label style={lS}>Título / Referência</label><input value={rTitle} onChange={function(e){setRTitle(e.target.value);}} placeholder="Ex: Relatório Macro Mensal - Março 2026" style={iS}/></div>
                <div><label style={lS}>Data do relatório</label><input value={rDate} onChange={function(e){setRDate(e.target.value);}} type="date" style={iS}/></div>
              </div>
              <div style={{marginBottom:"10px"}}>
                <label style={lS}>Texto do relatório (Ctrl+C / Ctrl+V do PDF)</label>
                <textarea value={rText} onChange={function(e){setRText(e.target.value);}} rows={14} placeholder="Cole aqui o texto completo do relatório macro da Suno. Inclua visão sobre Selic, inflação, câmbio, ciclo econômico, perspectivas por classe de ativo, cenário internacional, etc." style={Object.assign({},iS,{resize:"vertical",lineHeight:1.6,fontSize:"11px",minHeight:"250px"})}/>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={cancelReport} style={{padding:"8px 16px",borderRadius:"7px",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"11px",cursor:"pointer"}}>Cancelar</button>
                <button onClick={saveReport} disabled={!rText.trim()} style={{flex:1,padding:"8px 16px",borderRadius:"7px",border:"none",background:rText.trim()?"#DC2626":"rgba(255,255,255,0.05)",color:rText.trim()?"#fff":"rgba(255,255,255,0.3)",fontWeight:700,fontSize:"11px",cursor:"pointer"}}>Salvar Relatório</button>
              </div>
            </div>)}
          </div>)}

          {tab==="bias"&&(<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
              <div>
                <div style={{fontSize:"12px",fontWeight:700,color:"#fff"}}>Tabela de Viés & Alocação por Perfil</div>
                <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)"}}>Escala: -2 (muito pessimista) a +2 (muito otimista)</div>
              </div>
              <label style={{padding:"7px 14px",borderRadius:"7px",border:"1px solid rgba(251,191,36,0.2)",background:"rgba(251,191,36,0.06)",color:"#fbbf24",fontWeight:700,fontSize:"10px",cursor:"pointer"}}>
                {importing?"Importando...":"Importar Excel ou Imagem"}
                <input ref={biasFileRef} type="file" accept=".xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp" onChange={handleBiasUpload} style={{display:"none"}}/>
              </label>
            </div>

            {/* Bias views */}
            <div style={{marginBottom:"16px"}}>
              <div style={{fontSize:"9px",fontWeight:700,color:"#fbbf24",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>View atual por classe</div>
              {BIAS_CLASSES.map(function(group){
                return <div key={group.group} style={{marginBottom:"8px"}}>
                  <div style={{fontSize:"10px",fontWeight:700,color:"rgba(255,255,255,0.5)",marginBottom:"4px"}}>{group.group}</div>
                  {group.items.map(function(item){
                    var v = (macroData.biasViews||{})[item] || 0;
                    return <div key={item} style={{display:"flex",alignItems:"center",gap:"8px",padding:"4px 0"}}>
                      <span style={{fontSize:"11px",color:"rgba(255,255,255,0.6)",width:"120px"}}>{item}</span>
                      <div style={{display:"flex",gap:"3px"}}>
                        {[-2,-1,0,1,2].map(function(bv){
                          var active = v === bv;
                          return <button key={bv} onClick={function(){setBiasView(item,bv);}} style={{width:"32px",height:"24px",borderRadius:"4px",border:active?"2px solid "+biasColors[String(bv)]:"1px solid rgba(255,255,255,0.06)",background:active?biasColors[String(bv)]+"22":"rgba(255,255,255,0.02)",color:active?biasColors[String(bv)]:"rgba(255,255,255,0.25)",fontSize:"10px",fontWeight:700,cursor:"pointer"}}>{bv>0?"+"+bv:bv}</button>;
                        })}
                      </div>
                      <span style={{fontSize:"9px",color:biasColors[String(v)],fontWeight:600}}>{biasLabels[String(v)]}</span>
                    </div>;
                  })}
                </div>;
              })}
            </div>

            {/* Allocation table */}
            <div style={{fontSize:"9px",fontWeight:700,color:"#fbbf24",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Alocação Estratégica vs Tática por Perfil</div>
            <div style={{overflow:"auto",marginBottom:"8px"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"9px",minWidth:"800px"}}>
                <thead>
                  <tr>
                    <th style={{textAlign:"left",padding:"4px 6px",color:"rgba(255,255,255,0.4)",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>Classe</th>
                    <th style={{textAlign:"center",padding:"4px 3px",color:"rgba(255,255,255,0.3)",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>View</th>
                    {SUNO_PROFILES.map(function(pr){
                      return <th key={pr} colSpan={2} style={{textAlign:"center",padding:"4px 3px",color:"#fbbf24",fontWeight:700,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:"8px"}}>{pr}<br/><span style={{color:"rgba(255,255,255,0.2)",fontWeight:400}}>{SUNO_BENCHMARKS[pr]}</span></th>;
                    })}
                  </tr>
                  <tr>
                    <th style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}></th>
                    <th style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}></th>
                    {SUNO_PROFILES.map(function(pr){
                      return [
                        <th key={pr+"e"} style={{textAlign:"center",padding:"2px",color:"rgba(255,255,255,0.2)",fontSize:"7px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>Estr</th>,
                        <th key={pr+"t"} style={{textAlign:"center",padding:"2px",color:"rgba(255,255,255,0.2)",fontSize:"7px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>Tát</th>
                      ];
                    })}
                  </tr>
                </thead>
                <tbody>
                  {BIAS_CLASSES.map(function(group){
                    return [
                      <tr key={group.group+"h"}><td colSpan={2+SUNO_PROFILES.length*2} style={{padding:"4px 6px",fontWeight:700,color:"rgba(255,255,255,0.5)",fontSize:"9px",borderBottom:"1px solid rgba(255,255,255,0.04)",background:"rgba(255,255,255,0.02)"}}>{group.group}</td></tr>
                    ].concat(group.items.map(function(item){
                      var v = (macroData.biasViews||{})[item] || 0;
                      return <tr key={item}>
                        <td style={{padding:"3px 6px",color:"rgba(255,255,255,0.5)",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{item}</td>
                        <td style={{textAlign:"center",padding:"3px",color:biasColors[String(v)],fontWeight:700,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{v>0?"+"+v:v}</td>
                        {SUNO_PROFILES.map(function(pr){
                          var es = getAlloc(pr,item,"strategic");
                          var ta = getAlloc(pr,item,"tactical");
                          return [
                            <td key={pr+"e"} style={{textAlign:"center",padding:"2px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><input value={es||""} onChange={function(e){setAllocCell(pr,item,"strategic",e.target.value);}} type="number" style={{width:"32px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:"3px",color:"rgba(255,255,255,0.4)",fontSize:"9px",textAlign:"center",padding:"2px",outline:"none"}}/></td>,
                            <td key={pr+"t"} style={{textAlign:"center",padding:"2px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><input value={ta||""} onChange={function(e){setAllocCell(pr,item,"tactical",e.target.value);}} type="number" style={{width:"32px",background:"rgba(251,191,36,0.03)",border:"1px solid rgba(251,191,36,0.08)",borderRadius:"3px",color:"#fbbf24",fontSize:"9px",textAlign:"center",padding:"2px",outline:"none"}}/></td>
                          ];
                        })}
                      </tr>;
                    }));
                  })}
                </tbody>
              </table>
            </div>
            <div style={{fontSize:"9px",color:"rgba(255,255,255,0.2)"}}>Dica: Importe o Excel da tabela de alocação para preencher automaticamente. Ou edite manualmente cada célula.</div>
          </div>)}
        </div>
      </div>
    </div>
  );
}

/* ─── Carteiras Suno Module ─── */
var DEFAULT_CARTEIRAS = [
  {id:"div",name:"Dividendos",intl:false},
  {id:"val",name:"Valor",intl:false},
  {id:"sc",name:"Small Caps",intl:false},
  {id:"di",name:"Dollar Income",intl:true},
  {id:"hv",name:"Hidden Value",intl:true},
  {id:"gc",name:"Great Companies",intl:true}
];

function loadCarteiras() {
  try { var s = localStorage.getItem("tt-carteiras-suno"); if (s) return JSON.parse(s); } catch(e) {}
  return { carteiras: DEFAULT_CARTEIRAS, ativos: {} };
}
function saveCarteiras(d) { try { localStorage.setItem("tt-carteiras-suno", JSON.stringify(d)); } catch(e) {} }

function CarteirasModal(p) {
  var [cData, setCData] = useState(function(){ return loadCarteiras(); });
  var [selCart, setSelCart] = useState(null);
  var [addingCart, setAddingCart] = useState(false);
  var [editCartId, setEditCartId] = useState(null);
  var [cartName, setCartName] = useState("");
  var [cartIntl, setCartIntl] = useState(false);
  var [addingAtivo, setAddingAtivo] = useState(false);
  var [editAtivoIdx, setEditAtivoIdx] = useState(null);
  var [aForm, setAForm] = useState({ticker:"",name:"",rank:"",precoTeto:"",aloc:"",vies:"Comprar"});
  var [importing, setImporting] = useState(false);
  var importRef = useRef(null);

  function save(u) { setCData(u); saveCarteiras(u); }

  function saveCarteira() {
    if (!cartName.trim()) return;
    var u = Object.assign({}, cData);
    var carts = (u.carteiras||[]).slice();
    if (editCartId) {
      carts = carts.map(function(c){ return c.id===editCartId ? Object.assign({},c,{name:cartName.trim(),intl:cartIntl}) : c; });
    } else {
      var newId = Date.now().toString(36) + Math.random().toString(36).slice(2,5);
      carts.push({id:newId, name:cartName.trim(), intl:cartIntl});
    }
    u.carteiras = carts;
    save(u);
    setAddingCart(false); setEditCartId(null); setCartName(""); setCartIntl(false);
  }
  function startEditCart(c) { setEditCartId(c.id); setCartName(c.name); setCartIntl(c.intl); setAddingCart(true); }
  function deleteCarteira(id) {
    if (!confirm("Excluir esta carteira e todos os seus ativos?")) return;
    var u = Object.assign({}, cData);
    u.carteiras = (u.carteiras||[]).filter(function(c){return c.id!==id;});
    var ativos = Object.assign({}, u.ativos||{});
    delete ativos[id];
    u.ativos = ativos;
    save(u);
    if (selCart === id) setSelCart(null);
  }
  function cancelCart() { setAddingCart(false); setEditCartId(null); setCartName(""); setCartIntl(false); }

  function getCartAtivos(cartId) { return (cData.ativos||{})[cartId] || []; }

  function startAddAtivo() { setAddingAtivo(true); setEditAtivoIdx(null); setAForm({ticker:"",name:"",rank:"",precoTeto:"",aloc:"",vies:"Comprar"}); }
  function startEditAtivo(idx) {
    var a = getCartAtivos(selCart)[idx];
    if (!a) return;
    setEditAtivoIdx(idx); setAddingAtivo(true);
    setAForm({ticker:a.ticker||"",name:a.name||"",rank:a.rank!==undefined?String(a.rank):"",precoTeto:a.precoTeto!==undefined?String(a.precoTeto):"",aloc:a.aloc!==undefined?String(a.aloc):"",vies:a.vies||"Comprar"});
  }
  function saveAtivo() {
    if (!aForm.ticker.trim()) return;
    var u = Object.assign({}, cData);
    var ativos = Object.assign({}, u.ativos||{});
    var list = (ativos[selCart]||[]).slice();
    var selCartObj = (u.carteiras||[]).find(function(c){return c.id===selCart;});
    var isIntl = selCartObj ? selCartObj.intl : false;
    var entry = {
      ticker: aForm.ticker.trim().toUpperCase(),
      name: aForm.name.trim(),
      rank: aForm.rank ? parseInt(aForm.rank) : null,
      precoTeto: aForm.precoTeto ? parseFloat(aForm.precoTeto) : null,
      aloc: isIntl ? null : (aForm.aloc ? parseFloat(aForm.aloc) : null),
      vies: aForm.vies || "Comprar"
    };
    if (editAtivoIdx !== null) { list[editAtivoIdx] = entry; }
    else { list.push(entry); }
    list.sort(function(a,b){ return (a.rank||999)-(b.rank||999); });
    ativos[selCart] = list;
    u.ativos = ativos;
    save(u);
    setAddingAtivo(false); setEditAtivoIdx(null); setAForm({ticker:"",name:"",rank:"",precoTeto:"",aloc:"",vies:"Comprar"});
  }
  function deleteAtivo(idx) {
    var u = Object.assign({}, cData);
    var ativos = Object.assign({}, u.ativos||{});
    var list = (ativos[selCart]||[]).slice();
    list.splice(idx, 1);
    ativos[selCart] = list;
    u.ativos = ativos;
    save(u);
  }
  function cancelAtivo() { setAddingAtivo(false); setEditAtivoIdx(null); }

  async function handleImport(e) {
    var f = e.target.files[0]; if (!f) return;
    if (!selCart) { alert("Selecione uma carteira primeiro."); return; }
    setImporting(true);
    try {
      var carteira = (cData.carteiras||[]).find(function(c){return c.id===selCart;});
      var isIntl = carteira ? carteira.intl : false;
      var isImage = /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(f.name) || f.type.startsWith("image/");
      var sysPrompt = 'Voce recebera uma tabela de carteira recomendada da Suno Research. Extraia TODOS os ativos em JSON puro (sem markdown): [{"ticker":"XXXX","name":"Nome da Empresa","rank":1,"precoTeto":25.50,"aloc":5.0,"vies":"Comprar"},...] Regras: ticker em MAIUSCULAS. rank e a posicao/ranking (inteiro). precoTeto em reais ou dolares. ' + (isIntl ? 'Carteira INTERNACIONAL: coloque aloc como null para todos.' : 'aloc e percentual recomendado.') + ' vies: "Comprar", "Aguardar" ou "Vender". Se nao houver, use "Comprar". JSON puro.';
      var messages;
      if (isImage) {
        var b64 = await new Promise(function(res, rej) {
          var r = new FileReader();
          r.onload = function() { res(r.result.split(",")[1]); };
          r.onerror = function() { rej(new Error("Erro leitura")); };
          r.readAsDataURL(f);
        });
        messages = [{role:"user", content:[
          {type:"image", source:{type:"base64", media_type:f.type||"image/png", data:b64}},
          {type:"text", text:"Extraia todos os ativos desta tabela. Carteira: " + (carteira?carteira.name:"") + (isIntl?" (Internacional)":"")}
        ]}];
      } else {
        var arrayBuf = await new Promise(function(res, rej) {
          var r = new FileReader(); r.onload = function(){res(r.result);}; r.onerror = function(){rej(new Error("Erro"));}; r.readAsArrayBuffer(f);
        });
        var wb = XLSX.read(arrayBuf, {type:"array"});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var raw = XLSX.utils.sheet_to_json(ws, {header:1, defval:""});
        var tableText = raw.map(function(row){return row.join("\t");}).join("\n");
        messages = [{role:"user", content:"Carteira: " + (carteira?carteira.name:"") + "\nTabela:\n"+tableText}];
      }
      var resp = await fetch("/api/anthropic", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:4096, system:sysPrompt, messages:messages })
      });
      if (!resp.ok) throw new Error("API " + resp.status);
      var d = await resp.json();
      var rawText = "";
      for (var i=0;i<d.content.length;i++){if(d.content[i].text)rawText+=d.content[i].text;}
      rawText = rawText.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");
      var si=rawText.indexOf("[");var ei=rawText.lastIndexOf("]");
      if(si>=0&&ei>si)rawText=rawText.slice(si,ei+1);
      rawText=rawText.replace(/,\s*}/g,"}").replace(/,\s*\]/g,"]");
      var parsed = JSON.parse(rawText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        var u = Object.assign({}, cData);
        var ativos = Object.assign({}, u.ativos||{});
        var existing = (ativos[selCart]||[]).slice();
        var existMap = {};
        existing.forEach(function(a,i){ existMap[a.ticker] = i; });
        parsed.forEach(function(newA){
          var t = (newA.ticker||"").toUpperCase();
          if (!t) return;
          var entry = {ticker:t, name:newA.name||"", rank:newA.rank||null, precoTeto:newA.precoTeto||null, aloc:isIntl?null:(newA.aloc||null), vies:newA.vies||"Comprar"};
          if (existMap[t] !== undefined) { existing[existMap[t]] = entry; }
          else { existing.push(entry); }
        });
        existing.sort(function(a,b){ return (a.rank||999)-(b.rank||999); });
        ativos[selCart] = existing;
        u.ativos = ativos;
        save(u);
        alert("Importados " + parsed.length + " ativos com sucesso!");
      }
    } catch(err) { console.error(err); alert("Erro ao importar: " + err.message); }
    setImporting(false);
    if (importRef.current) importRef.current.value = "";
  }

  var iS={width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"8px 10px",color:"#e2e8f0",fontSize:"12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  var lS={fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:"4px",display:"block"};
  var viesColors = {"Comprar":"#4ade80","Aguardar":"#fbbf24","Vender":"#f87171"};
  var carteiras = cData.carteiras || [];
  var selCartObj = selCart ? carteiras.find(function(c){return c.id===selCart;}) : null;
  var selAtivos = selCart ? getCartAtivos(selCart) : [];

  return (
    <div style={p.inline?{padding:"0"}:{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:"#0A0A0A",borderRadius:"16px",border:"1px solid rgba(59,130,246,0.15)",width:"100%",maxWidth:"960px",maxHeight:"92vh",overflow:"auto",padding:"0"}}>
        <div style={{padding:"20px 24px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#0A0A0A",zIndex:10,borderRadius:"16px 16px 0 0"}}>
          <div>
            <div style={{fontSize:"16px",fontWeight:800,color:"#fff"}}>Carteiras Suno</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",marginTop:"2px"}}>Recomendações oficiais — Ranking, Preço-teto, Alocação % e Viés</div>
          </div>
          <button onClick={p.onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"20px",cursor:p.inline?"default":"pointer",display:p.inline?"none":"block"}}>✕</button>
        </div>
        <div style={{display:"flex",minHeight:"500px"}}>
          {/* Sidebar */}
          <div style={{width:"220px",borderRight:"1px solid rgba(255,255,255,0.05)",padding:"12px",flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <div style={{fontSize:"9px",fontWeight:700,color:"rgba(59,130,246,0.8)",textTransform:"uppercase",letterSpacing:"1px"}}>Carteiras</div>
              <button onClick={function(){setAddingCart(true);setEditCartId(null);setCartName("");setCartIntl(false);}} style={{fontSize:"9px",padding:"3px 8px",borderRadius:"5px",border:"none",background:"rgba(59,130,246,0.12)",color:"#60a5fa",fontWeight:700,cursor:"pointer"}}>+ Nova</button>
            </div>
            {carteiras.map(function(c){
              var cnt = getCartAtivos(c.id).length;
              var active = selCart === c.id;
              return <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:"8px",marginBottom:"3px",cursor:"pointer",background:active?"rgba(59,130,246,0.1)":"transparent",border:active?"1px solid rgba(59,130,246,0.2)":"1px solid transparent"}} onClick={function(){setSelCart(c.id);setAddingAtivo(false);}}>
                <div>
                  <div style={{fontSize:"12px",fontWeight:active?700:500,color:active?"#60a5fa":"rgba(255,255,255,0.6)"}}>{c.name}</div>
                  <div style={{fontSize:"9px",color:"rgba(255,255,255,0.25)",display:"flex",gap:"6px",marginTop:"1px"}}>
                    {c.intl && <span style={{color:"rgba(139,92,246,0.6)",fontWeight:600}}>INTL</span>}
                    <span>{cnt} ativo{cnt!==1?"s":""}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:"2px"}}>
                  <button onClick={function(ev){ev.stopPropagation();startEditCart(c);}} style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",background:"transparent",border:"none",cursor:"pointer",padding:"2px 4px"}}>✎</button>
                  <button onClick={function(ev){ev.stopPropagation();deleteCarteira(c.id);}} style={{fontSize:"9px",color:"rgba(220,38,38,0.4)",background:"transparent",border:"none",cursor:"pointer",padding:"2px 4px"}}>✕</button>
                </div>
              </div>;
            })}
            {addingCart && (<div style={{background:"rgba(59,130,246,0.05)",borderRadius:"8px",padding:"10px",border:"1px solid rgba(59,130,246,0.12)",marginTop:"8px"}}>
              <div style={{fontSize:"10px",fontWeight:700,color:"#60a5fa",marginBottom:"6px"}}>{editCartId?"Editar":"Nova"} Carteira</div>
              <input value={cartName} onChange={function(e){setCartName(e.target.value);}} placeholder="Nome da carteira" style={Object.assign({},iS,{fontSize:"11px",marginBottom:"6px"})}/>
              <label style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"10px",color:"rgba(255,255,255,0.5)",cursor:"pointer",marginBottom:"8px"}}>
                <input type="checkbox" checked={cartIntl} onChange={function(e){setCartIntl(e.target.checked);}} style={{accentColor:"#8b5cf6"}}/>
                Internacional (sem Alocação %)
              </label>
              <div style={{display:"flex",gap:"4px"}}>
                <button onClick={cancelCart} style={{flex:1,padding:"5px",borderRadius:"5px",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.4)",fontSize:"10px",cursor:"pointer"}}>Cancelar</button>
                <button onClick={saveCarteira} disabled={!cartName.trim()} style={{flex:1,padding:"5px",borderRadius:"5px",border:"none",background:cartName.trim()?"#3b82f6":"rgba(255,255,255,0.05)",color:cartName.trim()?"#fff":"rgba(255,255,255,0.3)",fontSize:"10px",fontWeight:700,cursor:"pointer"}}>Salvar</button>
              </div>
            </div>)}
          </div>
          {/* Main */}
          <div style={{flex:1,padding:"16px 20px",overflow:"auto"}}>
            {!selCart && <div style={{textAlign:"center",padding:"80px 0",color:"rgba(255,255,255,0.15)"}}><div style={{fontSize:"36px",marginBottom:"8px"}}>&#128202;</div><div style={{fontSize:"13px"}}>Selecione uma carteira na barra lateral</div><div style={{fontSize:"10px",marginTop:"4px"}}>ou crie uma nova com o botão "+ Nova"</div></div>}
            {selCart && selCartObj && (<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
                <div>
                  <div style={{fontSize:"16px",fontWeight:800,color:"#fff"}}>{selCartObj.name}</div>
                  <div style={{display:"flex",gap:"8px",marginTop:"2px"}}>
                    {selCartObj.intl && <span style={{fontSize:"9px",padding:"2px 8px",borderRadius:"10px",background:"rgba(139,92,246,0.1)",color:"#a78bfa",fontWeight:600}}>Internacional</span>}
                    <span style={{fontSize:"10px",color:"rgba(255,255,255,0.3)"}}>{selAtivos.length} ativo{selAtivos.length!==1?"s":""}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:"6px"}}>
                  <label style={{padding:"7px 12px",borderRadius:"7px",border:"1px solid rgba(59,130,246,0.2)",background:"rgba(59,130,246,0.06)",color:"#60a5fa",fontWeight:700,fontSize:"10px",cursor:"pointer"}}>
                    {importing?"Importando...":"Importar Imagem/Excel"}
                    <input ref={importRef} type="file" accept=".xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp" onChange={handleImport} style={{display:"none"}}/>
                  </label>
                  <button onClick={startAddAtivo} style={{padding:"7px 12px",borderRadius:"7px",border:"none",background:"#3b82f6",color:"#fff",fontWeight:700,fontSize:"10px",cursor:"pointer"}}>+ Ativo</button>
                </div>
              </div>
              {addingAtivo && (<div style={{background:"rgba(59,130,246,0.04)",border:"1px solid rgba(59,130,246,0.12)",borderRadius:"10px",padding:"14px",marginBottom:"12px"}}>
                <div style={{fontSize:"11px",fontWeight:700,color:"#60a5fa",marginBottom:"10px"}}>{editAtivoIdx!==null?"Editar":"Adicionar"} Ativo</div>
                <div style={{display:"grid",gridTemplateColumns:selCartObj.intl?"1fr 1fr 1fr 1fr 1fr":"1fr 1fr 1fr 1fr 1fr 1fr",gap:"8px",marginBottom:"10px"}}>
                  <div><label style={lS}>Ticker *</label><input value={aForm.ticker} onChange={function(e){setAForm(Object.assign({},aForm,{ticker:e.target.value}));}} placeholder="VALE3" style={iS}/></div>
                  <div><label style={lS}>Empresa</label><input value={aForm.name} onChange={function(e){setAForm(Object.assign({},aForm,{name:e.target.value}));}} placeholder="Vale S.A." style={iS}/></div>
                  <div><label style={lS}>Ranking</label><input value={aForm.rank} onChange={function(e){setAForm(Object.assign({},aForm,{rank:e.target.value}));}} type="number" placeholder="1" style={iS}/></div>
                  <div><label style={lS}>Preço-teto</label><input value={aForm.precoTeto} onChange={function(e){setAForm(Object.assign({},aForm,{precoTeto:e.target.value}));}} type="number" step="0.01" placeholder="65.00" style={iS}/></div>
                  {!selCartObj.intl && <div><label style={lS}>Alocação %</label><input value={aForm.aloc} onChange={function(e){setAForm(Object.assign({},aForm,{aloc:e.target.value}));}} type="number" step="0.1" placeholder="5.0" style={iS}/></div>}
                  <div><label style={lS}>Viés</label><select value={aForm.vies} onChange={function(e){setAForm(Object.assign({},aForm,{vies:e.target.value}));}} style={Object.assign({},iS,{cursor:"pointer"})}><option value="Comprar">Comprar</option><option value="Aguardar">Aguardar</option><option value="Vender">Vender</option></select></div>
                </div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={cancelAtivo} style={{padding:"7px 14px",borderRadius:"7px",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"10px",cursor:"pointer"}}>Cancelar</button>
                  <button onClick={saveAtivo} disabled={!aForm.ticker.trim()} style={{padding:"7px 14px",borderRadius:"7px",border:"none",background:aForm.ticker.trim()?"#3b82f6":"rgba(255,255,255,0.05)",color:aForm.ticker.trim()?"#fff":"rgba(255,255,255,0.3)",fontWeight:700,fontSize:"10px",cursor:"pointer"}}>Salvar</button>
                </div>
              </div>)}
              {selAtivos.length===0&&!addingAtivo&&<div style={{textAlign:"center",padding:"50px 0",color:"rgba(255,255,255,0.15)",fontSize:"12px"}}>Nenhum ativo nesta carteira.<br/>Clique em "+ Ativo" ou "Importar Imagem/Excel" para adicionar.</div>}
              {selAtivos.length>0&&(<div style={{overflow:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                  <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                    <th style={{textAlign:"center",padding:"8px 6px",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"9px",width:"40px"}}>#</th>
                    <th style={{textAlign:"left",padding:"8px 6px",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"9px"}}>Ticker</th>
                    <th style={{textAlign:"left",padding:"8px 6px",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"9px"}}>Empresa</th>
                    <th style={{textAlign:"right",padding:"8px 6px",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"9px"}}>Preço-teto</th>
                    {!selCartObj.intl&&<th style={{textAlign:"right",padding:"8px 6px",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"9px"}}>Aloc %</th>}
                    <th style={{textAlign:"center",padding:"8px 6px",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"9px"}}>Viés</th>
                    <th style={{textAlign:"center",padding:"8px 6px",color:"rgba(255,255,255,0.4)",fontWeight:600,fontSize:"9px",width:"60px"}}>Ações</th>
                  </tr></thead>
                  <tbody>{selAtivos.map(function(a,idx){
                    return <tr key={a.ticker+idx} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                      <td style={{textAlign:"center",padding:"8px 6px",color:"rgba(255,255,255,0.35)",fontWeight:700}}>{a.rank||"—"}</td>
                      <td style={{padding:"8px 6px",fontWeight:700,color:"#f1f5f9"}}>{a.ticker}</td>
                      <td style={{padding:"8px 6px",color:"rgba(255,255,255,0.5)"}}>{a.name||"—"}</td>
                      <td style={{textAlign:"right",padding:"8px 6px",color:"rgba(255,255,255,0.6)",fontWeight:600}}>{a.precoTeto!=null?(selCartObj.intl?"US$ ":"R$ ")+Number(a.precoTeto).toFixed(2):"—"}</td>
                      {!selCartObj.intl&&<td style={{textAlign:"right",padding:"8px 6px",color:"rgba(59,130,246,0.8)",fontWeight:600}}>{a.aloc!=null?a.aloc+"%":"—"}</td>}
                      <td style={{textAlign:"center",padding:"8px 6px"}}><span style={{padding:"2px 10px",borderRadius:"12px",fontSize:"10px",fontWeight:700,background:(viesColors[a.vies]||"#94a3b8")+"18",color:viesColors[a.vies]||"#94a3b8",border:"1px solid "+(viesColors[a.vies]||"#94a3b8")+"33"}}>{a.vies||"—"}</span></td>
                      <td style={{textAlign:"center",padding:"8px 6px"}}>
                        <button onClick={function(){startEditAtivo(idx);}} style={{fontSize:"9px",color:"rgba(255,255,255,0.35)",background:"transparent",border:"none",cursor:"pointer",padding:"2px 5px",marginRight:"2px"}}>✎</button>
                        <button onClick={function(){deleteAtivo(idx);}} style={{fontSize:"9px",color:"rgba(220,38,38,0.4)",background:"transparent",border:"none",cursor:"pointer",padding:"2px 5px"}}>✕</button>
                      </td>
                    </tr>;
                  })}</tbody>
                </table>
                {!selCartObj.intl&&(function(){
                  var totalAloc=selAtivos.reduce(function(s,a){return s+(a.aloc||0);},0);
                  return <div style={{marginTop:"8px",padding:"8px 12px",background:"rgba(59,130,246,0.04)",borderRadius:"8px",border:"1px solid rgba(59,130,246,0.1)",display:"flex",justifyContent:"space-between",fontSize:"10px"}}>
                    <span style={{color:"rgba(255,255,255,0.4)"}}>Total alocação:</span>
                    <span style={{fontWeight:700,color:Math.abs(totalAloc-100)<0.5?"#4ade80":totalAloc>100?"#f87171":"#fbbf24"}}>{totalAloc.toFixed(1)}%</span>
                  </div>;
                })()}
              </div>)}
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Meeting Prep Module ─── */
function MeetingPrepModal(p) {
  var [clientProfiles] = useState(function(){return loadClientProfiles();});
  var [selectedProfileId, setSelectedProfileId] = useState("");
  var [selectedProfile, setSelectedProfile] = useState(null);
  var [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0,10));
  var [meetingFocus, setMeetingFocus] = useState("");

  // Module selections
  var [wantMacroShort, setWantMacroShort] = useState(true);
  var [wantMacroDetail, setWantMacroDetail] = useState(false);
  var [wantEmpresas, setWantEmpresas] = useState(true);
  var [wantTalkPoints, setWantTalkPoints] = useState(true);
  var [wantPDF, setWantPDF] = useState(false);
  var [selectedEmpresas, setSelectedEmpresas] = useState({});
  var [writingTone, setWritingTone] = useState("simples");

  // Results
  var [generating, setGenerating] = useState(false);
  var [genProgress, setGenProgress] = useState("");
  var [error, setError] = useState("");
  var [results, setResults] = useState(null); // {macroShort, macroDetail, empresas:{ticker:{text}}, talkPoints}
  var [pdfGenerating, setPdfGenerating] = useState(false);

  // All app stocks
  var allAppStocks = [];
  ["Dividendos","Valor","Small Caps","Internacional"].forEach(function(port) {
    (p.data[port] || []).forEach(function(s) { allAppStocks.push(Object.assign({_portfolio: port}, s)); });
  });
  var carteirasData = loadCarteiras();

  function selectClient(id) {
    var found = clientProfiles.find(function(pr){return pr.id===id;});
    setSelectedProfileId(id);
    setSelectedProfile(found ? Object.assign({}, found) : null);
    if (found && found.posAssets) {
      // Pre-select empresas from client position (RV only)
      var sel = {};
      found.posAssets.forEach(function(pa) {
        if (pa.totalValue > 0 && /^[A-Z]{4}(3|4|5|6|11)$/.test(pa.ticker)) sel[pa.ticker] = true;
      });
      setSelectedEmpresas(sel);
    }
  }

  async function generateAll() {
    if (!selectedProfile) return;
    setGenerating(true); setError(""); setGenProgress("Preparando...");
    var res = {macroShort:null, macroDetail:null, empresas:{}, talkPoints:null};

    function extractText(content) {
      var txt = "";
      for (var i = 0; i < (content||[]).length; i++) {
        if (content[i].type === "text" && content[i].text) txt += content[i].text;
      }
      return txt;
    }
    function safeParseJSON(raw) {
      raw = raw.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");
      var si = raw.indexOf("{"); var ei = raw.lastIndexOf("}");
      if (si >= 0 && ei > si) {
        try { return JSON.parse(raw.slice(si, ei + 1).replace(/,\s*}/g,"}").replace(/,\s*\]/g,"]")); } catch(e) {}
      }
      si = raw.indexOf("["); ei = raw.lastIndexOf("]");
      if (si >= 0 && ei > si) return JSON.parse(raw.slice(si, ei + 1).replace(/,\s*}/g,"}").replace(/,\s*\]/g,"]"));
      throw new Error("No JSON found");
    }
    async function callAPI(body) {
      var resp = await fetch("/api/anthropic", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      if (!resp.ok) { var et = ""; try{et=await resp.text();}catch(x){} throw new Error("API " + resp.status + ": " + et.slice(0,150)); }
      var d = await resp.json();
      if (d.error) throw new Error(d.error.message || JSON.stringify(d.error));
      return d;
    }

    var warnings = [];
    try {
      var md = loadMacroData();
      var macroReports = (md.macroReports || []).slice(0,5);
      var macroText = macroReports.map(function(r){return "--- " + (r.title||"Relatorio") + " (" + (r.date||"") + ") ---\n" + r.text.slice(0,2500);}).join("\n\n");
      var hasMacroCtx = macroText.trim().length > 50;
      var profileCtx = "Cliente: " + (selectedProfile.name||"") + ", " + (selectedProfile.age||"") + " anos, " + (selectedProfile.riskProfile||"") + ", horizonte " + (selectedProfile.horizon||"") + " anos. Objetivos: " + (selectedProfile.longTermGoals||"");
      var posCtx = "";
      if (selectedProfile.posAssets) {
        var posTotal = selectedProfile.posAssets.reduce(function(s,a){return s+(a.totalValue||0);},0);
        var topA = selectedProfile.posAssets.filter(function(a){return a.totalValue>0;}).sort(function(a,b){return (b.totalValue||0)-(a.totalValue||0);}).slice(0,15);
        posCtx = "Patrimonio: R$ " + posTotal.toLocaleString("pt-BR") + ". Posicoes: " + topA.map(function(a){return a.ticker + " R$" + (a.totalValue||0).toLocaleString("pt-BR");}).join(", ");
      }

      if (wantMacroShort || wantMacroDetail) {
        setGenProgress("Gerando cenario macro...");
        try {
          var mUserMsg = hasMacroCtx
            ? "Com base nestes relatorios macro da Suno:\n\n" + macroText.slice(0,8000)
            : "Nao ha relatorios macro salvos. Gere cenario macro generico do Brasil atual (Selic, inflacao, cambio, bolsa).";
          var mFields = [];
          if (wantMacroShort) mFields.push('"macroShort": "3-4 bullets curtos sobre Selic, inflacao, cambio, bolsa"');
          if (wantMacroDetail) mFields.push('"macroDetail": "3 paragrafos detalhados sobre economia BR, cenario global, perspectivas"');
          mUserMsg += "\n\nResponda SOMENTE com JSON puro sem markdown:\n{" + mFields.join(", ") + "}";
          var mD = await callAPI({model:"claude-sonnet-4-20250514",max_tokens:4096,system:"Voce e um consultor preparando material macro para reuniao.\n\n" + getToneInstruction(writingTone, false),messages:[{role:"user",content:mUserMsg}]});
          var mRaw = extractText(mD.content);
          if (mRaw) { var mP = safeParseJSON(mRaw); res.macroShort = cleanCitations(mP.macroShort)||null; res.macroDetail = cleanCitations(mP.macroDetail)||null; }
        } catch(me) { console.error("Macro err:", me); warnings.push("macro"); }
      }

      if (wantEmpresas) {
        var eTickers = Object.keys(selectedEmpresas);
        if (eTickers.length > 0) {
          for (var eb = 0; eb < eTickers.length; eb += 5) {
            var eBatch = eTickers.slice(eb, eb + 5);
            setGenProgress("Analisando " + eBatch.join(", ") + "...");
            var eCtx = eBatch.map(function(tk) {
              var app = allAppStocks.find(function(s){return s.ticker===tk;});
              var cart = null;
              (carteirasData.carteiras||[]).forEach(function(ca){(carteirasData.ativos[ca.id]||[]).forEach(function(a){if(a.ticker===tk)cart=a;});});
              return {ticker:tk, appData: app ? {result:(app.result||"").slice(0,300), sunoView:(app.sunoView||"").slice(0,200), sentiment:app.sentiment, rankScore:app.rankScore, quarter:app.quarter} : null, carteira: cart};
            });
            try {
              var eD = await callAPI({model:"claude-sonnet-4-20250514",max_tokens:3000,system:"Gere resumo de 1 paragrafo por empresa para briefing. Sem HTML.\n\n" + getToneInstruction(writingTone, false) + "\n\nJSON puro: [{\"ticker\":\"\",\"summary\":\"\"}]",messages:[{role:"user",content:"Empresas:\n"+JSON.stringify(eCtx)}]});
              var eRaw = extractText(eD.content);
              if (eRaw) { var eP = safeParseJSON(eRaw); if (Array.isArray(eP)) eP.forEach(function(e){e.summary=cleanCitations(e.summary||"");res.empresas[e.ticker]=e;}); }
            } catch(ee) { console.error("Emp err:", ee); warnings.push("empresas"); }
          }
        }
      }

      if (wantTalkPoints) {
        setGenProgress("Gerando talking points...");
        try {
          var tMsg = profileCtx + "\n" + posCtx + "\nEmpresas: " + Object.keys(res.empresas).join(", ") + "\nFoco: " + (meetingFocus || "trimestral");
          if (res.macroShort) tMsg += "\nMacro: " + res.macroShort;
          tMsg += "\n\nGere 5-7 pontos de conversa. JSON puro: {\"talkPoints\":\"- ponto 1\\n- ponto 2\"}";
          var tD = await callAPI({model:"claude-sonnet-4-20250514",max_tokens:2000,system:"Gere talking points para reuniao de investimentos.\n\n" + getToneInstruction(writingTone, false),messages:[{role:"user",content:tMsg}]});
          var tRaw = extractText(tD.content);
          if (tRaw) { var tP = safeParseJSON(tRaw); res.talkPoints = cleanCitations(tP.talkPoints)||null; }
        } catch(te) { console.error("TP err:", te); warnings.push("talking points"); }
      }

      setResults(res);
      if (warnings.length > 0) setError("Aviso: falha em " + warnings.join(", ") + ". Clique Refazer.");
    } catch(err) { console.error(err); setError("Erro: " + err.message); }
    setGenerating(false); setGenProgress("");
  }

  // ── PDF Export ──
  function generateMeetingPDF() {
    setPdfGenerating(true);
    try {
      var doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      var W=210;var H=297;var ML=24;var MR=20;var CW=W-ML-MR;
      function setC(c){doc.setTextColor(c[0],c[1],c[2]);}
      function setF(c){doc.setFillColor(c[0],c[1],c[2]);}
      function wrap(t,mw,sz){doc.setFontSize(sz);return doc.splitTextToSize(t||"",mw);}
      var y=0;
      function chk(n){if(y+n>H-16){doc.addPage();setF([180,40,40]);doc.rect(0,0,W,0.5,"F");y=18;return true;}return false;}

      // Cover
      setF([180,40,40]);doc.rect(0,0,W,1,"F");
      doc.setFontSize(8);doc.setFont("helvetica","bold");setC([140,140,140]);doc.text("SUNO ADVISORY HUB",ML,46);
      doc.setFontSize(30);setC([30,30,30]);doc.text("Preparo de",ML,68);doc.text("Reunião",ML,82);
      doc.setFontSize(10);doc.setFont("helvetica","normal");setC([100,100,100]);
      doc.text((selectedProfile?selectedProfile.name:"") + " — " + meetingDate,ML,98);
      if(meetingFocus)doc.text("Foco: " + meetingFocus,ML,106);
      setF([180,40,40]);doc.rect(0,H-1,W,1,"F");

      // Content pages
      doc.addPage();setF([180,40,40]);doc.rect(0,0,W,0.5,"F");y=18;

      if(results.macroShort){chk(30);doc.setFontSize(7);doc.setFont("helvetica","bold");setC([180,40,40]);doc.text("CENÁRIO MACRO — RESUMO",ML,y);y+=6;
        doc.setFontSize(9);doc.setFont("helvetica","normal");setC([50,50,50]);
        var msl=wrap(results.macroShort,CW,9);msl.forEach(function(l){chk(4.5);doc.text(l,ML,y);y+=4.5;});y+=6;}

      if(results.macroDetail){chk(30);doc.setFontSize(7);doc.setFont("helvetica","bold");setC([180,40,40]);doc.text("CENÁRIO MACRO — DETALHADO",ML,y);y+=6;
        doc.setFontSize(8.5);doc.setFont("helvetica","normal");setC([50,50,50]);
        var mdl=wrap(results.macroDetail,CW,8.5);mdl.forEach(function(l){chk(4.5);doc.text(l,ML,y);y+=4.5;});y+=8;}

      if(Object.keys(results.empresas).length>0){chk(20);doc.setFontSize(7);doc.setFont("helvetica","bold");setC([180,40,40]);doc.text("EMPRESAS EM FOCO",ML,y);y+=6;
        Object.keys(results.empresas).forEach(function(tk){
          var e=results.empresas[tk];chk(25);
          doc.setFontSize(11);doc.setFont("helvetica","bold");setC([30,30,30]);doc.text(tk,ML,y);y+=5;
          doc.setFontSize(8.5);doc.setFont("helvetica","normal");setC([50,50,50]);
          var el=wrap(e.summary||"",CW-4,8.5);el.forEach(function(l){chk(4.5);doc.text(l,ML+2,y);y+=4.5;});y+=6;
        });}

      if(results.talkPoints){chk(30);doc.setFontSize(7);doc.setFont("helvetica","bold");setC([180,40,40]);doc.text("TALKING POINTS",ML,y);y+=6;
        doc.setFontSize(9);doc.setFont("helvetica","normal");setC([50,50,50]);
        var tpl=wrap(results.talkPoints,CW,9);tpl.forEach(function(l){chk(4.5);doc.text(l,ML,y);y+=4.5;});}

      // Page numbers
      var pc=doc.internal.getNumberOfPages();for(var pg=2;pg<=pc;pg++){doc.setPage(pg);doc.setFontSize(6.5);doc.setFont("helvetica","normal");setC([175,175,175]);doc.text((pg-1)+"/"+(pc-1),W/2,H-10,{align:"center"});setF([180,40,40]);doc.rect(0,H-0.5,W,0.5,"F");}

      doc.save("reuniao-"+(selectedProfile?selectedProfile.name.replace(/\s+/g,"-").toLowerCase():"cliente")+"-"+meetingDate+".pdf");
    } catch(err){console.error(err);alert("Erro PDF: "+err.message);}
    setPdfGenerating(false);
  }

  var iS={width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"8px 10px",color:"#e2e8f0",fontSize:"12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  var lS={fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:"4px",display:"block"};
  var btnBase={padding:"8px 16px",borderRadius:"8px",border:"none",cursor:"pointer",fontWeight:700,fontSize:"12px"};

  // Client position assets (RV only for empresa selection)
  var clientAssets = selectedProfile && selectedProfile.posAssets ? selectedProfile.posAssets.filter(function(a){return a.totalValue > 0;}) : [];

  return (
    <div style={p.inline?{padding:"0"}:{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:"#0A0A0A",borderRadius:"16px",border:"1px solid rgba(139,92,246,0.15)",width:"100%",maxWidth:"850px",maxHeight:"92vh",overflow:"auto",padding:"0"}}>
        {/* Header */}
        <div style={{padding:"20px 24px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#0A0A0A",zIndex:10,borderRadius:"16px 16px 0 0"}}>
          <div><div style={{fontSize:"16px",fontWeight:800,color:"#fff"}}>Preparo de Reunião</div><div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",marginTop:"2px"}}>Monte seu briefing personalizado</div></div>
          <button onClick={p.onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"20px",cursor:p.inline?"default":"pointer",display:p.inline?"none":"block"}}>✕</button>
        </div>

        <div style={{padding:"16px 24px 24px"}}>
          {error&&<div style={{color:"#f87171",fontSize:"11px",padding:"8px 10px",background:"rgba(220,38,38,0.08)",borderRadius:"6px",marginBottom:"10px"}}>{error}</div>}

          {/* Client + Date + Focus */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"16px"}}>
            <div><label style={lS}>Cliente</label><select value={selectedProfileId} onChange={function(e){selectClient(e.target.value);}} style={iS}><option value="" style={{background:"#1a1a1a"}}>Selecionar...</option>{clientProfiles.map(function(pr){return <option key={pr.id} value={pr.id} style={{background:"#1a1a1a"}}>{pr.name||"Sem nome"}</option>;})}</select></div>
            <div><label style={lS}>Data da Reunião</label><input type="date" value={meetingDate} onChange={function(e){setMeetingDate(e.target.value);}} style={iS}/></div>
            <div><label style={lS}>Foco / Pauta</label><input value={meetingFocus} onChange={function(e){setMeetingFocus(e.target.value);}} placeholder="Ex: trimestral, rebalanceamento" style={iS}/></div>
          </div>

          {selectedProfile&&(<div>
            {/* Module selection */}
            <div style={{fontSize:"10px",fontWeight:700,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"10px"}}>O que preparar?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"14px"}}>
              <label style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 12px",borderRadius:"8px",cursor:"pointer",background:wantMacroShort?"rgba(139,92,246,0.08)":"rgba(255,255,255,0.02)",border:wantMacroShort?"1px solid rgba(139,92,246,0.2)":"1px solid rgba(255,255,255,0.06)"}}>
                <input type="checkbox" checked={wantMacroShort} onChange={function(e){setWantMacroShort(e.target.checked);}} style={{accentColor:"#a78bfa"}}/>
                <div><div style={{fontSize:"11px",fontWeight:600,color:wantMacroShort?"#a78bfa":"rgba(255,255,255,0.5)"}}>Cenário Macro Resumido</div><div style={{fontSize:"9px",color:"rgba(255,255,255,0.25)"}}>3-4 bullets dos pontos-chave</div></div>
              </label>
              <label style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 12px",borderRadius:"8px",cursor:"pointer",background:wantMacroDetail?"rgba(139,92,246,0.08)":"rgba(255,255,255,0.02)",border:wantMacroDetail?"1px solid rgba(139,92,246,0.2)":"1px solid rgba(255,255,255,0.06)"}}>
                <input type="checkbox" checked={wantMacroDetail} onChange={function(e){setWantMacroDetail(e.target.checked);}} style={{accentColor:"#a78bfa"}}/>
                <div><div style={{fontSize:"11px",fontWeight:600,color:wantMacroDetail?"#a78bfa":"rgba(255,255,255,0.5)"}}>Cenário Macro Detalhado</div><div style={{fontSize:"9px",color:"rgba(255,255,255,0.25)"}}>3 parágrafos aprofundados</div></div>
              </label>
              <label style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 12px",borderRadius:"8px",cursor:"pointer",background:wantEmpresas?"rgba(139,92,246,0.08)":"rgba(255,255,255,0.02)",border:wantEmpresas?"1px solid rgba(139,92,246,0.2)":"1px solid rgba(255,255,255,0.06)"}}>
                <input type="checkbox" checked={wantEmpresas} onChange={function(e){setWantEmpresas(e.target.checked);}} style={{accentColor:"#a78bfa"}}/>
                <div><div style={{fontSize:"11px",fontWeight:600,color:wantEmpresas?"#a78bfa":"rgba(255,255,255,0.5)"}}>Empresas em Foco</div><div style={{fontSize:"9px",color:"rgba(255,255,255,0.25)"}}>Resumo + notícias por empresa</div></div>
              </label>
              <label style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 12px",borderRadius:"8px",cursor:"pointer",background:wantTalkPoints?"rgba(139,92,246,0.08)":"rgba(255,255,255,0.02)",border:wantTalkPoints?"1px solid rgba(139,92,246,0.2)":"1px solid rgba(255,255,255,0.06)"}}>
                <input type="checkbox" checked={wantTalkPoints} onChange={function(e){setWantTalkPoints(e.target.checked);}} style={{accentColor:"#a78bfa"}}/>
                <div><div style={{fontSize:"11px",fontWeight:600,color:wantTalkPoints?"#a78bfa":"rgba(255,255,255,0.5)"}}>Talking Points</div><div style={{fontSize:"9px",color:"rgba(255,255,255,0.25)"}}>Pontos de conversa personalizados</div></div>
              </label>
            </div>

            {/* Empresa selection (if checked) */}
            {wantEmpresas&&clientAssets.length>0&&(<div style={{marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                <span style={{fontSize:"9px",fontWeight:600,color:"rgba(255,255,255,0.4)"}}>Selecione empresas ({Object.keys(selectedEmpresas).length})</span>
                <div style={{display:"flex",gap:"4px"}}>
                  <button onClick={function(){var sel={};clientAssets.forEach(function(a){if(/^[A-Z]{4}(3|4|5|6|11)$/.test(a.ticker))sel[a.ticker]=true;});setSelectedEmpresas(sel);}} style={{fontSize:"8px",padding:"3px 6px",borderRadius:"4px",border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}>Todas RV</button>
                  <button onClick={function(){setSelectedEmpresas({});}} style={{fontSize:"8px",padding:"3px 6px",borderRadius:"4px",border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"rgba(255,255,255,0.3)",cursor:"pointer"}}>Limpar</button>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"4px",maxHeight:"120px",overflow:"auto"}}>
                {clientAssets.filter(function(a){return /^[A-Z]{3,6}\d{0,2}$/.test(a.ticker);}).map(function(a){
                  var isSel=!!selectedEmpresas[a.ticker];
                  return <button key={a.ticker} onClick={function(){setSelectedEmpresas(function(prev){var n=Object.assign({},prev);if(n[a.ticker])delete n[a.ticker];else n[a.ticker]=true;return n;});}} style={{padding:"4px 8px",borderRadius:"6px",fontSize:"10px",fontWeight:isSel?700:500,background:isSel?"rgba(139,92,246,0.15)":"rgba(255,255,255,0.03)",color:isSel?"#a78bfa":"rgba(255,255,255,0.35)",border:isSel?"1px solid rgba(139,92,246,0.3)":"1px solid rgba(255,255,255,0.06)",cursor:"pointer"}}>{a.ticker}</button>;
                })}
              </div>
            </div>)}

            {/* Tone selector + Generate button */}
            {!results&&(<div>
              <div style={{marginBottom:"10px"}}><ToneSelector value={writingTone} onChange={setWritingTone} color="#7c3aed"/></div>
              <button onClick={generateAll} disabled={generating} style={Object.assign({},btnBase,{width:"100%",background:generating?"rgba(139,92,246,0.2)":"#7c3aed",color:"#fff",padding:"12px",fontSize:"13px"})}>
              {generating?genProgress:"Gerar Briefing"}
            </button></div>)}

            {/* Results */}
            {results&&(<div>
              <div style={{fontSize:"10px",fontWeight:700,color:"#4ade80",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"10px"}}>✓ Briefing Gerado</div>

              {results.macroShort&&(<div style={{background:"#111",borderRadius:"10px",padding:"14px",border:"1px solid rgba(255,255,255,0.06)",marginBottom:"8px"}}>
                <div style={{fontSize:"9px",fontWeight:700,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"}}>Cenário Macro — Resumo</div>
                <textarea value={results.macroShort} onChange={function(e){setResults(Object.assign({},results,{macroShort:e.target.value}));}} rows={4} style={Object.assign({},iS,{resize:"vertical",fontSize:"11px",lineHeight:1.6})}/>
              </div>)}

              {results.macroDetail&&(<div style={{background:"#111",borderRadius:"10px",padding:"14px",border:"1px solid rgba(255,255,255,0.06)",marginBottom:"8px"}}>
                <div style={{fontSize:"9px",fontWeight:700,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"}}>Cenário Macro — Detalhado</div>
                <textarea value={results.macroDetail} onChange={function(e){setResults(Object.assign({},results,{macroDetail:e.target.value}));}} rows={8} style={Object.assign({},iS,{resize:"vertical",fontSize:"11px",lineHeight:1.6})}/>
              </div>)}

              {Object.keys(results.empresas).length>0&&(<div style={{marginBottom:"8px"}}>
                <div style={{fontSize:"9px",fontWeight:700,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"}}>Empresas em Foco ({Object.keys(results.empresas).length})</div>
                {Object.keys(results.empresas).map(function(tk){
                  var e=results.empresas[tk];
                  return <div key={tk} style={{background:"#111",borderRadius:"8px",padding:"10px 12px",border:"1px solid rgba(255,255,255,0.05)",marginBottom:"4px"}}>
                    <div style={{fontWeight:800,fontSize:"12px",color:"#f1f5f9",marginBottom:"4px"}}>{tk}</div>
                    <textarea value={e.summary||""} onChange={function(e2){setResults(function(prev){var n=Object.assign({},prev);n.empresas=Object.assign({},n.empresas);n.empresas[tk]=Object.assign({},n.empresas[tk],{summary:e2.target.value});return n;});}} rows={3} style={Object.assign({},iS,{resize:"vertical",fontSize:"11px",lineHeight:1.6})}/>
                  </div>;
                })}
              </div>)}

              {results.talkPoints&&(<div style={{background:"#111",borderRadius:"10px",padding:"14px",border:"1px solid rgba(255,255,255,0.06)",marginBottom:"12px"}}>
                <div style={{fontSize:"9px",fontWeight:700,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"}}>Talking Points</div>
                <textarea value={results.talkPoints} onChange={function(e){setResults(Object.assign({},results,{talkPoints:e.target.value}));}} rows={6} style={Object.assign({},iS,{resize:"vertical",fontSize:"11px",lineHeight:1.6})}/>
              </div>)}

              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={function(){setResults(null);}} style={Object.assign({},btnBase,{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"})}>Refazer</button>
                <button onClick={generateMeetingPDF} disabled={pdfGenerating} style={Object.assign({},btnBase,{flex:1,background:"#7c3aed",color:"#fff"})}>{pdfGenerating?"Gerando...":"Exportar PDF"}</button>
              </div>
            </div>)}
          </div>)}

          {!selectedProfile&&<div style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,0.15)",fontSize:"12px"}}>Selecione um cliente para começar.</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── Consultive Report Module v3 — 2 Sub-abas (Estratégia + Recomendação) ─── */
var CONSULT_TAB_STRATEGY = "strategy";
var CONSULT_TAB_RECOMMEND = "recommend";
var REC_STEPS = ["position","select","preview","review","pdf"];
var REC_STEP_LABELS = {position:"1. Posição",select:"2. Selecionar",preview:"3. Prévia IA",review:"4. Revisar",pdf:"5. PDF"};

function ConsultiveReportModal(p) {
  var [mainTab, setMainTab] = useState(CONSULT_TAB_STRATEGY);
  var [consultorName, setConsultorName] = useState("Rafael Manfroi Radaelli");
  var [period, setPeriod] = useState("");
  var [error, setError] = useState("");

  // Client profiles
  var [clientProfiles, setClientProfiles] = useState(function(){return loadClientProfiles();});
  var [selectedProfileId, setSelectedProfileId] = useState("");
  var [editingProfile, setEditingProfile] = useState(null);
  var [showProfileEditor, setShowProfileEditor] = useState(false);

  // Strategy tab — JB
  var [jbFile, setJbFile] = useState(null);
  var [jbFileName, setJbFileName] = useState("");
  var [jbParsing, setJbParsing] = useState(false);

  // Recommendation tab
  var [recStep, setRecStep] = useState("position");
  var [posFile, setPosFile] = useState(null);
  var [posFileName, setPosFileName] = useState("");
  var [posAssets, setPosAssets] = useState([]);
  var [availableCash, setAvailableCash] = useState("");
  var [allocations, setAllocations] = useState({}); // {ticker: {value: R$, text: "", verdict: ""}}
  var [previewApproved, setPreviewApproved] = useState(false);
  var [writingTone, setWritingTone] = useState("simples"); // simples, intermediario, profissional
  var posFileRef = useRef(null);
  var [crossrefData, setCrossrefData] = useState(null);
  var [selectedAssets, setSelectedAssets] = useState({});
  var [sellAssets, setSellAssets] = useState({}); // {ticker: {value: R$, total: bool}}
  var [quotesLoading, setQuotesLoading] = useState(false);
  var [quotesUpdated, setQuotesUpdated] = useState(null);
  var [generating, setGenerating] = useState(false);
  var [genProgress, setGenProgress] = useState("");
  var [analyses, setAnalyses] = useState({});
  var [strategyText, setStrategyText] = useState("");
  var [pdfGenerating, setPdfGenerating] = useState(false);
  var [filterVies, setFilterVies] = useState("all");
  var [filterCarteira, setFilterCarteira] = useState("all");
  var [filterClasse, setFilterClasse] = useState("all");
  var [filterSentiment, setFilterSentiment] = useState("all");
  var [filterRank, setFilterRank] = useState("all");
  var [filterMargem, setFilterMargem] = useState("all");

  var fileRef = useRef(null);

  // All app stocks (Pilar 1 — Inteligência)
  var allAppStocks = [];
  ["Dividendos","Valor","Small Caps","Internacional"].forEach(function(port) {
    (p.data[port] || []).forEach(function(s) {
      allAppStocks.push(Object.assign({_portfolio: port}, s));
    });
  });

  // Load Carteiras Suno data (Pilar 5)
  var carteirasData = loadCarteiras();

  // ── Profile functions ──
  function selectProfile(id) {
    setSelectedProfileId(id);
    var found = clientProfiles.find(function(pr){return pr.id===id;});
    if (found) {
      setEditingProfile(Object.assign({}, found));
      // Load saved position if available
      if (found.posAssets && found.posAssets.length > 0) {
        setPosAssets(found.posAssets);
        setPosFileName(found.posFileName || "Posição salva");
      } else {
        setPosAssets([]);
        setPosFileName("");
      }
    }
    else { setEditingProfile(null); setPosAssets([]); setPosFileName(""); }
    setError("");
  }
  function saveProfileToList(profile) {
    var list = clientProfiles.slice();
    var idx = list.findIndex(function(pr){return pr.id===profile.id;});
    if (idx >= 0) list[idx] = profile; else list.push(profile);
    setClientProfiles(list); saveClientProfiles(list);
    setEditingProfile(Object.assign({}, profile));
  }
  function createNewProfileInline() {
    var np = makeEmptyProfile();
    setSelectedProfileId(np.id); setEditingProfile(np); setShowProfileEditor(true);
  }

  // ── Journey Book parsing (saves to profile) ──
  function handleJBUpload(e) {
    var f = e.target.files[0]; if (!f) return;
    setJbFileName(f.name); setJbFile(f); setError("");
  }

  async function parseJourneyBook() {
    if (!jbFile || !editingProfile) return;
    setJbParsing(true); setError("");
    try {
      var arrayBuf = await new Promise(function(res, rej) {
        var r = new FileReader();
        r.onload = function() { res(r.result); };
        r.onerror = function() { rej(new Error("Erro leitura")); };
        r.readAsArrayBuffer(jbFile);
      });
      if (!window.pdfjsLib) {
        await new Promise(function(res, rej) {
          var s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
      var pdf = await window.pdfjsLib.getDocument({data: arrayBuf}).promise;
      var allText = "";
      for (var pg = 1; pg <= pdf.numPages; pg++) {
        var page = await pdf.getPage(pg);
        var tc = await page.getTextContent();
        var pageText = tc.items.map(function(item){return item.str;}).join(" ");
        if (pageText.trim()) allText += "\n\n--- PAGINA " + pg + " ---\n" + pageText;
      }
      if (allText.length < 200) throw new Error("PDF parece ser apenas imagens.");

      var sys = 'Voce e um parser de documentos financeiros. Recebera o TEXTO EXTRAIDO de um Journey Book (PDF) da Suno Consultoria. Extraia TODAS as informacoes estruturadas em JSON com esta estrutura EXATA:'
        + ' {"clientInfo":{"name":"","age":0,"profession":"","riskProfile":"","patrimony":0,"monthlyIncome":0,"monthlyExpenses":0,"monthlyContribution":0,"horizon":"","objective":"","desiredIncome":0,"liquidityNeed":""},'
        + '"projections":{"retirementAge":0,"capitalAtRetirement":0,"percentMeta":0,"realReturnRate":"","estimatedCurrentIncome":0,"estimatedRetirementIncome":0,"requiredContribution":0,"ageForMeta":"","evolutionTable":[{"date":"","patrimony":0,"percentMeta":0,"age":0}]},'
        + '"allocationMacro":{"classes":[{"name":"","currentPercent":0,"suggestedPercent":0,"currentValue":0,"suggestedValue":0}],"availableCash":0},'
        + '"allocationDetail":[{"class":"Renda Fixa","subclass":"Pós-fixado","percentOfClass":48,"percentOfTotal":0},{"class":"Renda Fixa","subclass":"Inflação","percentOfClass":41,"percentOfTotal":0},{"class":"Renda Fixa","subclass":"Pré-fixado","percentOfClass":10,"percentOfTotal":0}],'
        + '"currentPortfolio":[{"ticker":"","name":"","class":"","subclass":"","value":0,"percentPortfolio":0}],'
        + '"suggestedPortfolio":[{"ticker":"","name":"","class":"","subclass":"","value":0,"percentPortfolio":0,"yieldEstimate":0}],'
        + '"movements":{"sells":[{"ticker":"","value":0,"qty":0}],"buys":[{"ticker":"","value":0,"qty":0}]},'
        + '"assetRationales":[{"ticker":"","class":"","sector":"","currentPrice":0,"ceilingPrice":0,"deltaCeiling":0,"rationale":""}],'
        + '"feeFix":{"value":0,"percent":"","asset":""}}'
        + ' REGRAS: 1) Extraia TODOS os ativos de TODAS as classes. 2) Valores monetarios sem R$, numero puro. 3) Percentuais como numeros. 4) Se campo nao existe, use null. 5) JSON puro sem markdown. 6) Em allocationDetail, extraia a distribuicao DENTRO de cada classe (ex: dentro de Renda Fixa: Pos-fixado 48%, Inflacao 41%, Pre-fixado 10%). percentOfClass = % dentro da classe. Procure paginas como "Carteira Sugerida - Renda Fixa" que mostram essa abertura por indexador.';

      var resp = await fetch("/api/anthropic", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8192, system: sys, messages: [{role:"user", content: "TEXTO DO JOURNEY BOOK (" + pdf.numPages + " paginas):\n" + allText.slice(0, 80000)}] })
      });
      if (!resp.ok) throw new Error("API " + resp.status);
      var d = await resp.json();
      var raw = "";
      for (var i = 0; i < d.content.length; i++) { if (d.content[i].text) raw += d.content[i].text; }
      raw = raw.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");
      var si = raw.indexOf("{"); var ei = raw.lastIndexOf("}");
      if (si >= 0 && ei > si) raw = raw.slice(si, ei + 1);
      raw = raw.replace(/,\s*}/g, "}").replace(/,\s*\]/g, "]").replace(/\n/g, " ").replace(/\t/g, " ").replace(/[\x00-\x1F\x7F]/g, " ");
      var parsed;
      try { parsed = JSON.parse(raw); } catch(jsonErr) {
        var repaired = raw;
        var ob = (raw.match(/{/g)||[]).length; var cb = (raw.match(/}/g)||[]).length;
        var oB = (raw.match(/\[/g)||[]).length; var cB = (raw.match(/\]/g)||[]).length;
        for (var bi = 0; bi < oB - cB; bi++) repaired += "]";
        for (var bri = 0; bri < ob - cb; bri++) repaired += "}";
        repaired = repaired.replace(/,\s*}/g, "}").replace(/,\s*\]/g, "]");
        parsed = JSON.parse(repaired);
      }

      // Save JB to profile permanently
      var updated = Object.assign({}, editingProfile, {jbData: parsed, jbImportDate: new Date().toISOString().slice(0,10)});
      // Auto-fill profile fields from JB
      if (parsed.clientInfo) {
        var ci = parsed.clientInfo;
        if (!updated.name && ci.name) updated.name = ci.name;
        if (!updated.age && ci.age) updated.age = String(ci.age);
        if (!updated.profession && ci.profession) updated.profession = ci.profession;
        if (ci.riskProfile) updated.riskProfile = ci.riskProfile;
        if (!updated.totalWealth && ci.patrimony) updated.totalWealth = String(ci.patrimony);
        if (!updated.monthlyIncome && ci.monthlyIncome) updated.monthlyIncome = String(ci.monthlyIncome);
        if (!updated.monthlyContribution && ci.monthlyContribution) updated.monthlyContribution = String(ci.monthlyContribution);
        if (ci.horizon) updated.horizon = String(ci.horizon);
        if (ci.objective) updated.longTermGoals = ci.objective + (ci.desiredIncome ? ". Renda desejada: R$ " + ci.desiredIncome.toLocaleString("pt-BR") : "");
      }
      if (parsed.allocationMacro && parsed.allocationMacro.classes) {
        var allocMap = {"Renda Fixa":"Renda Fixa","Ações":"Ações BR","Acoes":"Ações BR","FIIs":"FIIs","Internacional":"Internacional","Alternativo":"Alternativos","Multimercado":"Alternativos"};
        var newAlloc = Object.assign({}, updated.allocation || {});
        parsed.allocationMacro.classes.forEach(function(c) {
          var mapped = allocMap[c.name] || c.name;
          if (newAlloc[mapped]) newAlloc[mapped] = {target: c.suggestedPercent || 0, current: c.currentPercent || 0};
        });
        updated.allocation = newAlloc;
      }
      updated.updatedAt = new Date().toISOString().slice(0,10);
      saveProfileToList(updated);
      setJbFile(null); setJbFileName("");
    } catch(err) { console.error(err); setError("Erro ao processar JB: " + err.message); }
    setJbParsing(false);
  }

  function clearJB() {
    if (!editingProfile || !confirm("Remover Journey Book salvo deste cliente?")) return;
    var updated = Object.assign({}, editingProfile, {jbData: null, jbImportDate: null});
    saveProfileToList(updated);
  }

  // ── Position upload ──
  async function handlePosUpload(e) {
    var f = e.target.files[0]; if (!f) return;
    setPosFileName(f.name); setPosFile(f); setError("");
    try {
      var arrayBuf = await new Promise(function(res, rej) {
        var r = new FileReader(); r.onload = function(){res(r.result);}; r.onerror = function(){rej(new Error("Erro"));}; r.readAsArrayBuffer(f);
      });
      var wb = XLSX.read(arrayBuf, {type:"array"});
      var ws = wb.Sheets[wb.SheetNames[0]];
      var allRows = XLSX.utils.sheet_to_json(ws, {header:1, defval:""});
      if (allRows.length === 0) { setError("Planilha vazia"); return; }

      // Find the header row (look for "Ativo" or "Ticker" or "Posição" in any row)
      var headerIdx = -1;
      var colMap = {};
      for (var hi = 0; hi < Math.min(allRows.length, 50); hi++) {
        var row = allRows[hi];
        for (var ci = 0; ci < row.length; ci++) {
          var val = String(row[ci]||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
          if (val === "ativo" || val === "ticker" || val === "codigo" || val === "papel") {
            headerIdx = hi;
            break;
          }
        }
        if (headerIdx >= 0) break;
      }

      if (headerIdx < 0) {
        // Fallback: try standard sheet_to_json
        var raw2 = XLSX.utils.sheet_to_json(ws, {defval:""});
        if (raw2.length > 0) {
          var cols2 = Object.keys(raw2[0]);
          var tc2 = cols2[0];
          var assets2 = [];
          for (var r2 = 0; r2 < raw2.length; r2++) {
            var tk2 = String(raw2[r2][tc2]||"").trim().toUpperCase();
            if (!tk2 || tk2.length < 2) continue;
            assets2.push({ticker:tk2, name:"", qty:0, avgPrice:0, currentPrice:0, totalValue:0, type:"", subClass:"", classe:""});
          }
          setPosAssets(assets2);
        }
        return;
      }

      // Map columns by header name
      var headers = allRows[headerIdx];
      function findHCol(patterns) {
        for (var c = 0; c < headers.length; c++) {
          var h = String(headers[c]||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
          for (var p = 0; p < patterns.length; p++) { if (h.indexOf(patterns[p]) >= 0) return c; }
        }
        return -1;
      }

      var iAtivo = findHCol(["ativo","ticker","codigo","papel"]);
      var iSubClass = findHCol(["sub-classe","subclasse","sub classe","subcategoria"]);
      var iClasse = findHCol(["classe","class","categoria","tipo"]);
      var iQty = findHCol(["quantidade","qtd","qty","shares"]);
      var iPos = findHCol(["posicao","posição","posição (r$)","posicao (r$)","saldo","valor","financeiro"]);
      var iPreco = findHCol(["preco (r$)","preco","cotacao","preco atual","ultimo"]);
      var iPrecoMedio = findHCol(["preco medio","medio","custo","preco médio"]);
      var iCorretora = findHCol(["corretora","broker","custodiante"]);

      var assets = [];
      for (var ri = headerIdx + 1; ri < allRows.length; ri++) {
        var row = allRows[ri];
        var ativoRaw = String(row[iAtivo >= 0 ? iAtivo : 0] || "").trim();
        if (!ativoRaw || ativoRaw.length < 2) continue;
        if (/^(total|subtotal|patrimonio|resultado|rentabilidade)$/i.test(ativoRaw)) continue;

        var subClass = iSubClass >= 0 ? String(row[iSubClass]||"").trim() : "";
        var classe = iClasse >= 0 ? String(row[iClasse]||"").trim() : "";
        var totalVal = iPos >= 0 ? parseFloat(String(row[iPos]||"0").toString().replace(/[^\d,.-]/g,"").replace(",",".")) || 0 : 0;
        var qty = iQty >= 0 ? parseFloat(String(row[iQty]||"0").toString().replace(/[^\d,.-]/g,"").replace(",",".")) || 0 : 0;
        var preco = iPreco >= 0 ? parseFloat(String(row[iPreco]||"0").toString().replace(/[^\d,.-]/g,"").replace(",",".")) || 0 : 0;
        var precoMedio = iPrecoMedio >= 0 ? parseFloat(String(row[iPrecoMedio]||"0").toString().replace(/[^\d,.-]/g,"").replace(",",".")) || 0 : 0;

        // Extract ticker from ativo field (could be "VALE3" or "LCA 91% CDI BANCO...")
        var ticker = ativoRaw.toUpperCase();
        var name = "";
        // If it looks like a ticker (4-6 chars + optional number), use as is
        if (/^[A-Z]{3,6}\d{0,2}$/.test(ticker)) {
          name = ativoRaw;
        } else {
          // It's a name (e.g. "LCA 91% CDI BANCO BTG"). Use first word or abbreviate
          name = ativoRaw;
          // Try to extract a short label
          if (ativoRaw.length > 20) ticker = ativoRaw.slice(0, 20) + "...";
        }

        // Skip zero-value rows
        if (totalVal === 0 && qty === 0) continue;

        assets.push({
          ticker: ticker, name: name,
          qty: qty, avgPrice: precoMedio, currentPrice: preco,
          totalValue: totalVal,
          type: classe, // "Renda Fixa", "Renda Variável", "Caixa"
          subClass: subClass // "Ações", "FIIs", "ETFs", "Indexado a Juros", "Fundos", "Caixa"
        });
      }
      setPosAssets(assets);
      // Save position to client profile
      if (editingProfile && assets.length > 0) {
        var updated = Object.assign({}, editingProfile, {posAssets: assets, posFileName: f.name, posImportDate: new Date().toISOString().slice(0,10)});
        saveProfileToList(updated);
      }
      if (assets.length > 0) setError("");
      else setError("Nenhum ativo encontrado na planilha. Verifique o formato.");
    } catch(err) { setError("Erro ao ler Excel: " + err.message); }
  }

  // ── Build asset list from ALL sources ──
  function buildAssetList() {
    var jbd = editingProfile ? editingProfile.jbData : null;
    var cartLookup = {};
    (carteirasData.carteiras || []).forEach(function(cart) {
      (carteirasData.ativos[cart.id] || []).forEach(function(a) {
        cartLookup[a.ticker] = Object.assign({carteira: cart.name, intl: cart.intl}, a);
      });
    });
    var assetMap = {};
    var suggested = jbd ? (jbd.suggestedPortfolio || []) : [];
    var rationales = jbd ? (jbd.assetRationales || []) : [];
    suggested.forEach(function(asset) {
      assetMap[asset.ticker] = { ticker: asset.ticker, name: asset.name || "", class: asset.class || "", subclass: asset.subclass || "", suggestedValue: asset.value || 0, suggestedPercent: asset.percentPortfolio || 0, source: "JB" };
    });
    Object.keys(cartLookup).forEach(function(tk) {
      if (!assetMap[tk]) {
        var ca = cartLookup[tk];
        assetMap[tk] = { ticker: tk, name: ca.name || "", class: ca.intl ? "Internacional" : "", subclass: "", suggestedValue: 0, suggestedPercent: 0, source: "Carteira" };
      }
    });
    var result = Object.keys(assetMap).map(function(tk) {
      var a = assetMap[tk];
      var appMatch = null;
      for (var i = 0; i < allAppStocks.length; i++) { if (allAppStocks[i].ticker === tk) { appMatch = allAppStocks[i]; break; } }
      var rat = null;
      for (var j = 0; j < rationales.length; j++) { if (rationales[j].ticker === tk) { rat = rationales[j]; break; } }
      var posMatch = null;
      for (var pi = 0; pi < posAssets.length; pi++) { if (posAssets[pi].ticker === tk) { posMatch = posAssets[pi]; break; } }
      var cartMatch = cartLookup[tk] || null;
      a.name = a.name || (posMatch ? posMatch.name : "") || (appMatch ? appMatch.name : "");
      a.currentPrice = rat ? rat.currentPrice : (posMatch ? posMatch.currentPrice : null);
      a.ceilingPrice = rat ? rat.ceilingPrice : (cartMatch ? cartMatch.precoTeto : null);
      a.deltaCeiling = (a.ceilingPrice && a.currentPrice) ? Math.round((a.ceilingPrice / a.currentPrice - 1) * 100) : null;
      a.rationale = rat ? rat.rationale : null;
      a.currentQty = posMatch ? posMatch.qty : 0; a.currentAvgPrice = posMatch ? posMatch.avgPrice : 0;
      a.currentTotalValue = posMatch ? posMatch.totalValue : 0; a.hasPosition = !!posMatch;
      a.appMatch = appMatch ? { thesis: appMatch.thesis, result: appMatch.result, resultPros: (appMatch.resultPros||[]).slice(0,5), resultCons: (appMatch.resultCons||[]).slice(0,5), sunoView: appMatch.sunoView, sentiment: appMatch.sentiment, quarter: appMatch.quarter, rankScore: appMatch.rankScore, portfolio: appMatch._portfolio } : null;
      a.hasAppData = !!appMatch;
      a.carteiraSuno = cartMatch;
      // Calculate % of portfolio: JB suggested vs current position (from Excel)
      a.jbPercent = a.suggestedPercent || 0;
      var excelTotal = posAssets.reduce(function(s,x){return s+(x.totalValue||0);},0);
      var posMatch2 = null;
      for (var pj = 0; pj < posAssets.length; pj++) { if (posAssets[pj].ticker === tk) { posMatch2 = posAssets[pj]; break; } }
      a.posPercent = (posMatch2 && excelTotal > 0) ? (posMatch2.totalValue / excelTotal * 100) : 0;
      a.posValue = posMatch2 ? posMatch2.totalValue : 0;
      return a;
    });
    result.sort(function(x,y) { var ra = x.carteiraSuno?(x.carteiraSuno.rank||999):999; var rb = y.carteiraSuno?(y.carteiraSuno.rank||999):999; return ra !== rb ? ra - rb : (x.ticker||"").localeCompare(y.ticker||""); });
    setCrossrefData(result); setSelectedAssets({}); setAnalyses({}); setRecStep("select");
  }

  // ── Fetch live quotes via AI + web search ──
  async function fetchQuotes() {
    if (!crossrefData || crossrefData.length === 0) return;
    setQuotesLoading(true);
    try {
      // Get unique tickers that have a ceiling price (worth looking up)
      var tickers = [];
      crossrefData.forEach(function(c) {
        if (c.ceilingPrice && tickers.indexOf(c.ticker) < 0) tickers.push(c.ticker);
      });
      if (tickers.length === 0) { setQuotesLoading(false); return; }

      // Batch in groups of ~20
      var batchSize = 20;
      var allQuotes = {};
      for (var b = 0; b < tickers.length; b += batchSize) {
        var batch = tickers.slice(b, b + batchSize);

        var resp = await fetch("/api/anthropic", {
          method: "POST", headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 2048,
            tools: [{"type": "web_search_20250305", "name": "web_search"}],
            messages: [{role: "user", content: "Busque a cotacao atual (preco de fechamento mais recente) destes ativos. Responda SOMENTE com JSON puro: {\"TICKER\": preco_numerico, ...}. Ativos: " + batch.join(", ")}]
          })
        });
        if (!resp.ok) throw new Error("API " + resp.status);
        var d = await resp.json();
        var raw = "";
        for (var i = 0; i < d.content.length; i++) { if (d.content[i].text) raw += d.content[i].text; }
        raw = raw.trim().replace(/```json\s*/g, "").replace(/```\s*/g, "");
        var si = raw.indexOf("{"); var ei = raw.lastIndexOf("}");
        if (si >= 0 && ei > si) {
          raw = raw.slice(si, ei + 1);
          try {
            var parsed = JSON.parse(raw);
            Object.keys(parsed).forEach(function(tk) { allQuotes[tk.toUpperCase()] = parseFloat(parsed[tk]) || 0; });
          } catch(e) { console.warn("Quote parse error:", e); }
        }
      }

      // Update crossrefData with live prices
      if (Object.keys(allQuotes).length > 0) {
        setCrossrefData(function(prev) {
          return prev.map(function(c) {
            var livePrice = allQuotes[c.ticker];
            if (livePrice && livePrice > 0) {
              var updated = Object.assign({}, c, { currentPrice: livePrice });
              if (c.ceilingPrice) {
                updated.deltaCeiling = Math.round((c.ceilingPrice / livePrice - 1) * 100);
              }
              return updated;
            }
            return c;
          });
        });
        setQuotesUpdated(new Date().toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"}));
      }
    } catch(err) { console.error("Fetch quotes error:", err); }
    setQuotesLoading(false);
  }
  function buildProfileContext() {
    if (!editingProfile) return "";
    var pr = editingProfile;
    var parts = ["PERFIL DO CLIENTE:"];
    if (pr.name) parts.push("Nome: " + pr.name);
    if (pr.age) parts.push("Idade: " + pr.age + " anos");
    if (pr.profession) parts.push("Profissao: " + pr.profession);
    if (pr.totalWealth) parts.push("Patrimonio: R$ " + parseFloat(pr.totalWealth).toLocaleString("pt-BR"));
    if (pr.monthlyIncome) parts.push("Renda: R$ " + parseFloat(pr.monthlyIncome).toLocaleString("pt-BR"));
    if (pr.monthlyContribution) parts.push("Aporte mensal: R$ " + parseFloat(pr.monthlyContribution).toLocaleString("pt-BR"));
    parts.push("Perfil: " + (pr.riskProfile || "Moderado"));
    if (pr.horizon) parts.push("Horizonte: " + pr.horizon + " anos");
    if (pr.longTermGoals) parts.push("Objetivos: " + pr.longTermGoals);
    if (pr.strategy) parts.push("Estrategia: " + pr.strategy);
    var alloc = pr.allocation || {};
    var ap = []; ALLOC_CLASSES.forEach(function(cls) {
      var a = alloc[cls] || {target:0,current:0};
      ap.push(cls + ": meta=" + a.target + "%, atual=" + a.current + "%");
    });
    if (ap.length > 0) parts.push("Alocacao: " + ap.join("; "));
    return parts.join("\n");
  }

  function buildJourneyContext() {
    var jbd = editingProfile ? editingProfile.jbData : null;
    var parts = [];

    // JB = META ALVO (objetivo)
    if (jbd) {
      parts.push("JOURNEY BOOK (META ALVO — onde o cliente DEVERIA estar):");
      if (jbd.projections) {
        var pj = jbd.projections;
        if (pj.capitalAtRetirement) parts.push("Capital projetado: R$ " + pj.capitalAtRetirement.toLocaleString("pt-BR"));
      }
      if (jbd.allocationMacro && jbd.allocationMacro.classes) {
        parts.push("ALOCACAO META:");
        jbd.allocationMacro.classes.forEach(function(c) {
          parts.push("  " + c.name + ": meta=" + c.suggestedPercent + "%");
        });
      }
    }

    // POSIÇÃO EXCEL = REALIDADE ATUAL (fonte de verdade)
    if (posAssets.length > 0) {
      var posTotal = posAssets.reduce(function(s,a){return s+(a.totalValue||0);},0);
      parts.push("\nPOSICAO ATUAL DO EXCEL (realidade — fonte de verdade):");
      parts.push("Patrimonio total em ativos: R$ " + posTotal.toLocaleString("pt-BR"));
      if (availableCash) parts.push("Caixa disponivel para aportes: R$ " + parseFloat(availableCash).toLocaleString("pt-BR"));

      // Breakdown by class/subclass
      var classBreak = {};
      posAssets.forEach(function(a) {
        var cls = a.type || "Outros"; // "Renda Fixa", "Renda Variável", "Caixa"
        var sub = a.subClass || "Outros"; // "Ações", "FIIs", "ETFs", etc
        var key = cls === "Renda Variável" ? sub : cls; // RF=class, RV=subclass
        if (!classBreak[key]) classBreak[key] = {value:0, count:0, tickers:[]};
        classBreak[key].value += (a.totalValue||0);
        classBreak[key].count++;
        classBreak[key].tickers.push(a.ticker);
      });
      parts.push("COMPOSICAO ATUAL POR CLASSE (do Excel):");
      Object.keys(classBreak).forEach(function(k) {
        var cb = classBreak[k];
        var pct = posTotal > 0 ? (cb.value / posTotal * 100).toFixed(1) : "0";
        parts.push("  " + k + ": R$ " + cb.value.toLocaleString("pt-BR") + " (" + pct + "%) — " + cb.count + " ativos");
      });

      // Top holdings
      var sorted = posAssets.slice().sort(function(a,b){return (b.totalValue||0)-(a.totalValue||0);});
      parts.push("MAIORES POSICOES:");
      sorted.slice(0, 15).forEach(function(a) {
        var pct = posTotal > 0 ? ((a.totalValue||0) / posTotal * 100).toFixed(1) : "0";
        parts.push("  " + a.ticker + " (" + (a.subClass||a.type||"") + "): R$ " + (a.totalValue||0).toLocaleString("pt-BR") + " (" + pct + "%)");
      });
    }
    return parts.join("\n");
  }

  function buildCarteirasContext() {
    var cartCtx = [];
    (carteirasData.carteiras || []).forEach(function(cart) {
      var ativos = carteirasData.ativos[cart.id] || [];
      if (ativos.length === 0) return;
      cartCtx.push("CARTEIRA " + cart.name.toUpperCase() + ":");
      ativos.forEach(function(a) {
        cartCtx.push("  #" + (a.rank||"?") + " " + a.ticker + " Teto:" + (a.precoTeto!=null?(cart.intl?"US$":"R$")+a.precoTeto:"N/A") + " " + (a.vies||""));
      });
    });
    return cartCtx.length > 0 ? "CARTEIRAS SUNO:\n" + cartCtx.join("\n") : "";
  }

  function buildMacroCtxShort() {
    var md = loadMacroData(); var parts = [];
    if (md.macroReports && md.macroReports.length > 0) { parts.push("MACRO: " + md.macroReports.slice(0,3).map(function(r){return r.text.slice(0,1500);}).join(" | ")); }
    if (md.biasViews && Object.keys(md.biasViews).length > 0) { parts.push("VIES: " + Object.keys(md.biasViews).map(function(k){return k+"="+(md.biasViews[k]>0?"+":"")+md.biasViews[k];}).join(", ")); }
    return parts.join("\n");
  }

  // ── Generate preview: strategy + cash distribution + rationale per asset ──
  async function generatePreview() {
    var selected = (crossrefData || []).filter(function(c) { return selectedAssets[c.ticker]; });
    if (selected.length === 0) return;
    setGenerating(true); setError(""); setGenProgress("Gerando prévia estratégica...");
    setPreviewApproved(false);
    try {
      var profileCtx = buildProfileContext();
      var journeyCtx = buildJourneyContext();
      var carteirasCtx = buildCarteirasContext();
      var macroCtx = buildMacroCtxShort();
      var baseCash = parseFloat(availableCash) || 0;
      var sellTotal = Object.keys(sellAssets).reduce(function(s,tk){return s+(sellAssets[tk].value||0);},0);
      var cash = baseCash + sellTotal;

      // Build sell context
      var sellCtx = "";
      if (sellTotal > 0) {
        var sellItems = Object.keys(sellAssets).map(function(tk) {
          var pa = posAssets.find(function(p){return p.ticker===tk;});
          return { ticker: tk, sellValue: sellAssets[tk].value, currentValue: pa?(pa.totalValue||0):0, subClass: pa?(pa.subClass||""):"" };
        });
        sellCtx = "\nVENDAS PROPOSTAS (R$ " + sellTotal.toLocaleString("pt-BR") + " total):\n" + JSON.stringify(sellItems);
      }

      var assetsCtx = selected.map(function(a) {
        var ctx = { ticker: a.ticker, name: a.name, class: a.class || a._classTag || "", jbPercent: a.jbPercent, posPercent: a.posPercent, posValue: a.posValue || 0, ceilingPrice: a.ceilingPrice, currentPrice: a.currentPrice, deltaCeiling: a.deltaCeiling, hasPosition: a.hasPosition };
        if (a.appMatch) ctx.appData = { result: (a.appMatch.result||"").slice(0,200), sentiment: a.appMatch.sentiment, rankScore: a.appMatch.rankScore };
        if (a.carteiraSuno) ctx.carteiraSuno = { rank: a.carteiraSuno.rank, precoTeto: a.carteiraSuno.precoTeto, vies: a.carteiraSuno.vies, carteira: a.carteiraSuno.carteira };
        return ctx;
      });

      // Use shared tone instruction
      var toneInst = getToneInstruction(writingTone, false);

      var sys = 'Voce e um consultor de investimentos gerando um RELATORIO DE RECOMENDACOES MENSAL.'
        + '\n\nTOM DE ESCRITA: ' + toneInst
        + '\n\nREGRAS DE ESCRITA OBRIGATORIAS:'
        + ' - SEM SENSACIONALISMO. NAO use expressoes como "oportunidade unica", "momento excepcional", "nao pode perder", "excelente momento", "oportunidade rara". Seja NEUTRO e FACTUAL.'
        + ' - NAO mencione rankings internos ("ativo #1 da carteira X", "lider da carteira Y", "top da carteira").'
        + ' - NAO mencione classificacoes internas como "vies Comprar/Aguardar".'
        + ' - FOQUE em: tese do ativo (o que a empresa faz e por que e relevante), resultados recentes, visao dos analistas, desconto atual vs preco justo, e como se encaixa no plano do cliente.'
        + ' - Escreva de forma EQUILIBRADA — mencione tanto pontos positivos quanto riscos.'
        + '\n\nVoce recebera: perfil do cliente, Journey Book (METAS), POSICAO ATUAL DO EXCEL (carteira real hoje com % por classe), cenario macro, e ativos selecionados.'
        + ' A POSICAO ATUAL vem do EXCEL — e a carteira real. O Journey Book e o PLANO com as metas.'
        + ' O cliente tem R$ ' + cash.toLocaleString("pt-BR") + ' disponiveis para investir' + (sellTotal > 0 ? ' (R$ ' + baseCash.toLocaleString("pt-BR") + ' em caixa + R$ ' + sellTotal.toLocaleString("pt-BR") + ' de vendas propostas).' : '.')
        + '\n\nGere JSON:'
        + ' {"strategy":"3-5 paragrafos: 1) Onde esta a carteira hoje (dados do Excel) vs o plano (JB) — use numeros reais. 2) Cenario economico atual. 3) Oportunidades identificadas. 4) Como distribuimos o caixa e por que. Tom neutro e factual.",'
        + ' "allocations":[{"ticker":"XXXX","value":NUMERO_EM_REAIS,"percent":PERCENTUAL_DO_CAIXA,"rationale":"1 PARAGRAFO neutro: o que a empresa faz, resultados recentes, quanto o preco esta abaixo do justo, como esse aporte ajuda a carteira a se aproximar do plano.","verdict":"APORTAR|MANTER|REDUZIR|AGUARDAR"}]'
        + (sellTotal > 0 ? ',"sells":[{"ticker":"XXXX","value":VALOR_DA_VENDA,"rationale":"1 PARAGRAFO neutro explicando por que faz sentido reduzir ou encerrar posicao nesse ativo.","verdict":"VENDER|REDUZIR"}]' : '')
        + '}'
        + '\n\nREGRAS TECNICAS: Distribua R$ ' + cash.toLocaleString("pt-BR") + ' inteligentemente. Soma = EXATAMENTE esse valor. Valores inteiros. Priorize classes sub-alocadas e ativos com desconto. JSON puro.';

      var userMsg = profileCtx + "\n" + journeyCtx + "\n" + macroCtx + "\n" + carteirasCtx + "\nCaixa total: R$ " + cash.toLocaleString("pt-BR") + sellCtx + "\nATIVOS SELECIONADOS PARA COMPRA:\n" + JSON.stringify(assetsCtx);

      var resp = await fetch("/api/anthropic", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 6000, system: sys, messages: [{role:"user", content: userMsg}] }) });
      if (!resp.ok) throw new Error("API " + resp.status);
      var d = await resp.json(); var raw = "";
      for (var i = 0; i < d.content.length; i++) { if (d.content[i].text) raw += d.content[i].text; }
      raw = raw.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");
      var si = raw.indexOf("{"); var ei = raw.lastIndexOf("}");
      if (si >= 0 && ei > si) raw = raw.slice(si, ei + 1);
      raw = raw.replace(/,\s*}/g, "}").replace(/,\s*\]/g, "]");
      var parsed = JSON.parse(raw);

      setStrategyText(parsed.strategy || "");
      var allocMap = {};
      (parsed.allocations || []).forEach(function(a) {
        allocMap[a.ticker] = { value: a.value || 0, percent: a.percent || 0, rationale: a.rationale || "", verdict: a.verdict || "APORTAR", type: "buy" };
      });
      // Process sells
      (parsed.sells || []).forEach(function(a) {
        allocMap[a.ticker] = { value: -(a.value || 0), percent: 0, rationale: a.rationale || "", verdict: a.verdict || "VENDER", type: "sell" };
      });
      setAllocations(allocMap);
      setRecStep("preview");
    } catch(err) { console.error(err); setError("Erro: " + err.message); }
    setGenerating(false); setGenProgress("");
  }

  // ── Readjust after consultant changes values ──
  async function readjustTexts() {
    setGenerating(true); setError(""); setGenProgress("Reajustando textos...");
    try {
      var items = Object.keys(allocations).map(function(tk) {
        var a = allocations[tk];
        var cr = (crossrefData||[]).find(function(c){return c.ticker===tk;});
        return { ticker: tk, name: cr?cr.name:"", value: a.value, verdict: a.verdict, class: cr?(cr._classTag||cr.class):"", ceilingPrice: cr?cr.ceilingPrice:null, deltaCeiling: cr?cr.deltaCeiling:null };
      });
      var totalAlloc = items.reduce(function(s,a){return s+(a.value||0);},0);

      var sys = 'O consultor ajustou os valores de aporte. Reescreva os textos mantendo os NOVOS VALORES. TOM: ' + getToneInstruction(writingTone, true)
        + ' NAO mencione rankings internos, "vies Comprar/Aguardar", "lider da carteira X". FOQUE na tese do ativo, resultados recentes, desconto vs preco justo, e como se encaixa no plano.'
        + ' JSON: {"strategy":"NOVO TEXTO 3-5 paragrafos em linguagem simples","allocations":[{"ticker":"","rationale":"1 PARAGRAFO atualizado com novo valor, linguagem clara","verdict":"APORTAR|MANTER"}]} JSON puro.';
      var userMsg = "Estrategia anterior:\n" + strategyText.slice(0,2000) + "\n\nNOVOS VALORES (total R$ " + totalAlloc.toLocaleString("pt-BR") + "):\n" + JSON.stringify(items) + "\n\n" + buildProfileContext() + "\n" + buildJourneyContext();

      var resp = await fetch("/api/anthropic", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:4096, system:sys, messages:[{role:"user",content:userMsg}]}) });
      if (!resp.ok) throw new Error("API " + resp.status);
      var d = await resp.json(); var raw = "";
      for (var i = 0; i < d.content.length; i++) { if (d.content[i].text) raw += d.content[i].text; }
      raw = raw.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");
      var si = raw.indexOf("{"); var ei = raw.lastIndexOf("}");
      if (si >= 0 && ei > si) raw = raw.slice(si, ei + 1);
      var parsed = JSON.parse(raw);
      if (parsed.strategy) setStrategyText(parsed.strategy);
      if (parsed.allocations) {
        var newAlloc = Object.assign({}, allocations);
        parsed.allocations.forEach(function(a) {
          if (newAlloc[a.ticker]) {
            newAlloc[a.ticker] = Object.assign({}, newAlloc[a.ticker], { rationale: a.rationale || newAlloc[a.ticker].rationale, verdict: a.verdict || newAlloc[a.ticker].verdict });
          }
        });
        setAllocations(newAlloc);
      }
      setPreviewApproved(false);
    } catch(err) { console.error(err); setError("Erro: " + err.message); }
    setGenerating(false); setGenProgress("");
  }

  function updateAllocation(ticker, field, value) {
    setAllocations(function(prev) {
      var n = Object.assign({}, prev);
      n[ticker] = Object.assign({}, n[ticker]);
      n[ticker][field] = value;
      return n;
    });
    setPreviewApproved(false);
  }

  function deselectAsset(ticker) {
    setSelectedAssets(function(prev) { var n = Object.assign({}, prev); delete n[ticker]; return n; });
    setAnalyses(function(prev) { var n = Object.assign({}, prev); delete n[ticker]; return n; });
  }


  function updateAnalysis(ticker, field, value) {
    setAnalyses(function(prev) {
      var n = Object.assign({}, prev);
      n[ticker] = Object.assign({}, n[ticker]);
      n[ticker][field] = value;
      return n;
    });
  }

  // ── Operational PDF (table for daily banker) ──
  function generateOperationalPDF() {
    var doc = new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    var W=297;var H=210;var ML=15;var MR=15;var CW=W-ML-MR;
    var clientName = editingProfile ? editingProfile.name : "";

    // Header
    doc.setFillColor(180,40,40);doc.rect(0,0,W,0.5,"F");
    doc.setFontSize(8);doc.setFont("helvetica","bold");doc.setTextColor(140,140,140);
    doc.text("SUNO ADVISORY HUB",ML,8);
    doc.setFont("helvetica","normal");doc.text("ORDEM DE MOVIMENTAÇÃO",W-MR,8,{align:"right"});
    doc.setDrawColor(215,215,215);doc.line(ML,11,W-MR,11);

    // Client info
    var y = 18;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.setTextColor(30,30,30);
    doc.text("Movimentações — " + (clientName||"Cliente"),ML,y);y+=6;
    doc.setFontSize(9);doc.setFont("helvetica","normal");doc.setTextColor(100,100,100);
    doc.text("Período: " + (period||"Mensal") + "  |  Consultor: " + (consultorName||"") + "  |  Data: " + new Date().toLocaleDateString("pt-BR"),ML,y);y+=10;

    // Table header
    var cols = [{l:"TIPO",w:22},{l:"TICKER",w:28},{l:"ATIVO",w:70},{l:"CLASSE",w:35},{l:"QTD APROX.",w:25},{l:"PREÇO ATUAL",w:30},{l:"VALOR (R$)",w:32},{l:"CORRETORA",w:25}];
    var totalW = cols.reduce(function(s,c){return s+c.w;},0);

    doc.setFillColor(245,245,245);doc.rect(ML,y-1,totalW,7,"F");
    doc.setFontSize(7);doc.setFont("helvetica","bold");doc.setTextColor(100,100,100);
    var cx = ML;
    cols.forEach(function(col){doc.text(col.l,cx+2,y+3);cx+=col.w;});
    doc.setDrawColor(200,200,200);doc.line(ML,y+5,ML+totalW,y+5);y+=8;

    // Sort: sells first, then buys
    var items = Object.keys(allocations).map(function(tk){
      var al=allocations[tk];
      var cr=(crossrefData||[]).find(function(c){return c.ticker===tk;});
      var pa=posAssets.find(function(p){return p.ticker===tk;});
      return {ticker:tk, name:cr?cr.name:(pa?pa.name:""), class:cr?(cr._classTag||cr.class||""):(pa?(pa.subClass||pa.type||""):""), value:al.value||0, verdict:al.verdict||"", type:al.type||"buy", currentPrice:cr?cr.currentPrice:(pa?pa.currentPrice:0)};
    });
    items.sort(function(a,b){if(a.type!==b.type)return a.type==="sell"?-1:1;return Math.abs(b.value)-Math.abs(a.value);});

    var totalBuy=0;var totalSell=0;
    doc.setFontSize(8);doc.setFont("helvetica","normal");
    items.forEach(function(item){
      var absVal=Math.abs(item.value);
      var qty=item.currentPrice>0?Math.floor(absVal/item.currentPrice):0;
      var isSell=item.type==="sell";
      if(isSell)totalSell+=absVal;else totalBuy+=absVal;

      cx=ML;
      doc.setTextColor(isSell?170:25,isSell?45:120,isSell?45:65);
      doc.text(isSell?"VENDA":"COMPRA",cx+2,y);cx+=cols[0].w;
      doc.setTextColor(30,30,30);doc.setFont("helvetica","bold");
      doc.text(item.ticker,cx+2,y);cx+=cols[1].w;
      doc.setFont("helvetica","normal");doc.setTextColor(80,80,80);
      doc.text((item.name||"").slice(0,30),cx+2,y);cx+=cols[2].w;
      doc.text((item.class||"").slice(0,18),cx+2,y);cx+=cols[3].w;
      doc.text(qty>0?String(qty):"—",cx+2,y);cx+=cols[4].w;
      doc.text(item.currentPrice>0?"R$ "+item.currentPrice.toFixed(2):"—",cx+2,y);cx+=cols[5].w;
      doc.setFont("helvetica","bold");doc.setTextColor(isSell?170:25,isSell?45:120,isSell?45:65);
      doc.text("R$ "+absVal.toLocaleString("pt-BR"),cx+2,y);cx+=cols[6].w;
      doc.setFont("helvetica","normal");doc.setTextColor(140,140,140);
      doc.text("",cx+2,y);
      doc.setDrawColor(230,230,230);doc.line(ML,y+2,ML+totalW,y+2);
      y+=6;
    });

    // Totals
    y+=3;doc.setDrawColor(100,100,100);doc.line(ML,y-1,ML+totalW,y-1);
    doc.setFontSize(9);doc.setFont("helvetica","bold");
    if(totalSell>0){doc.setTextColor(170,45,45);doc.text("Total Vendas: R$ "+totalSell.toLocaleString("pt-BR"),ML+2,y+4);}
    doc.setTextColor(25,120,65);doc.text("Total Compras: R$ "+totalBuy.toLocaleString("pt-BR"),ML+120,y+4);
    doc.setTextColor(30,30,30);doc.text("Líquido: R$ "+(totalBuy-totalSell).toLocaleString("pt-BR"),ML+200,y+4);

    // Footer
    y+=14;doc.setFontSize(7);doc.setFont("helvetica","italic");doc.setTextColor(175,175,175);
    doc.text("Documento operacional — uso interno. Quantidades aproximadas baseadas no preço de mercado no momento da geração.",ML,y);
    doc.setFillColor(180,40,40);doc.rect(0,H-0.5,W,0.5,"F");

    var fn="movimentacoes"+(clientName?"-"+clientName.replace(/\s+/g,"-").toLowerCase():"")+"-"+(period||"").replace(/\s/g,"")+".pdf";
    doc.save(fn);
  }

  // ── PDF ──
  async function generatePDF() {
    setPdfGenerating(true);
    try {
      var doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      var W=210;var H=297;var ML=24;var MR=20;var CW=W-ML-MR;
      var C={black:[18,18,18],title:[30,30,30],body:[50,50,50],secondary:[100,100,100],caption:[140,140,140],muted:[175,175,175],rule:[215,215,215],bg_light:[245,245,245],bg_card:[250,250,252],accent:[180,40,40],positive:[25,120,65],positive_bg:[235,248,240],negative:[170,45,45],negative_bg:[252,238,238],neutral_tag:[90,90,90],amber:[150,105,25],amber_bg:[255,248,232],blue:[40,80,160],blue_bg:[232,242,255]};
      function setC(c){doc.setTextColor(c[0],c[1],c[2]);}
      function setF(c){doc.setFillColor(c[0],c[1],c[2]);}
      function setD(c){doc.setDrawColor(c[0],c[1],c[2]);}
      function wrap(t,mw,sz){doc.setFontSize(sz);return doc.splitTextToSize(t||"",mw);}
      var y=0;
      function drawHeader(){setF(C.accent);doc.rect(0,0,W,0.5,"F");doc.setFontSize(6.5);doc.setFont("helvetica","bold");setC(C.muted);doc.text("SUNO ADVISORY HUB",ML,8);doc.setFont("helvetica","normal");doc.text("RELATÓRIO DE RECOMENDAÇÕES",W-MR,8,{align:"right"});setD(C.rule);doc.line(ML,11,W-MR,11);}
      function newPage(){doc.addPage();drawHeader();return 18;}
      function chk(needed){if(y+needed>H-16){y=newPage();return true;}return false;}
      var clientName = editingProfile ? editingProfile.name : "";
      // COVER
      setF(C.accent);doc.rect(0,0,W,1,"F");setF(C.accent);doc.rect(24,40,0.8,100,"F");
      doc.setFontSize(8);doc.setFont("helvetica","bold");setC(C.caption);doc.text("SUNO CONSULTORIA",32,46);
      doc.setFontSize(34);doc.setFont("helvetica","bold");setC(C.black);doc.text("Relatório de",32,64);doc.text("Recomendações",32,80);
      doc.setFontSize(10);doc.setFont("helvetica","normal");setC(C.secondary);doc.text("Recomendação Mensal — Todos os Pilares",32,98);
      if(period.trim()){doc.setFontSize(9);doc.text("Período: "+period.trim(),32,108);}
      if(clientName){doc.setFontSize(7.5);setC(C.secondary);doc.text("ELABORADO PARA",32,170);doc.setFontSize(18);doc.setFont("helvetica","bold");setC(C.title);doc.text(clientName,32,179);}
      if(consultorName.trim()){doc.setFontSize(7.5);doc.setFont("helvetica","normal");setC(C.secondary);doc.text("CONSULTOR",32,200);doc.setFontSize(10.5);setC(C.body);doc.text(consultorName.trim(),32,207);}
      setD(C.caption);doc.line(32,268,W-MR,268);doc.setFontSize(8);doc.setFont("helvetica","normal");setC(C.secondary);doc.text(new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"}),32,274);setF(C.accent);doc.rect(0,H-1,W,1,"F");
      // STRATEGY
      y=newPage();doc.setFontSize(6.5);doc.setFont("helvetica","bold");setC(C.accent);doc.text("VISÃO ESTRATÉGICA CONSOLIDADA",ML,y);y+=4;setF(C.accent);doc.rect(ML,y,25,0.4,"F");y+=6;
      doc.setFontSize(8.5);doc.setFont("helvetica","normal");setC(C.body);
      var sLines=wrap(strategyText,CW-4,8.5);
      for(var sli=0;sli<sLines.length;sli++){chk(4.5);doc.setFontSize(8.5);doc.setFont("helvetica","normal");setC(C.body);doc.text(sLines[sli],ML+2,y);y+=4.5;}
      y+=8;
      // INDIVIDUAL ANALYSES
      var reportAssets=(crossrefData||[]).filter(function(c){return allocations[c.ticker];});
      // Add sell assets that might not be in crossrefData
      Object.keys(allocations).forEach(function(tk){
        if(allocations[tk].type==="sell" && !reportAssets.find(function(r){return r.ticker===tk;})){
          var pa=posAssets.find(function(p){return p.ticker===tk;});
          reportAssets.push({ticker:tk, name:pa?pa.name:"", class:pa?(pa.subClass||pa.type):"", currentPrice:pa?pa.currentPrice:0, ceilingPrice:null, deltaCeiling:null});
        }
      });
      reportAssets.sort(function(a,b){var va=allocations[a.ticker]||{};var vb=allocations[b.ticker]||{};return(vb.value||0)-(va.value||0);});
      for(var ai=0;ai<reportAssets.length;ai++){
        var c=reportAssets[ai];var an=allocations[c.ticker];if(!an)continue;
        chk(50);
        setF(C.bg_card);setD(C.rule);doc.rect(ML,y-1,CW,22,"DF");
        doc.setFontSize(16);doc.setFont("helvetica","bold");setC(C.title);doc.text(c.ticker,ML+4,y+7);
        doc.setFontSize(8.5);doc.setFont("helvetica","normal");setC(C.secondary);doc.text(c.name+"  ·  "+(c.class||""),ML+4,y+13);
        if(an.value){var absVal=Math.abs(an.value);var isSell=an.type==="sell";var qtyText="";if(c.currentPrice>0){qtyText=" (≈ "+Math.floor(absVal/c.currentPrice)+" cotas/ações)";}doc.setFontSize(7);setC(isSell?C.negative:C.positive);doc.text((isSell?"Venda: R$ ":"Aporte: R$ ")+absVal.toLocaleString("pt-BR")+qtyText+" — "+an.verdict,ML+4,y+18);}
        var verdictMap={"APORTAR":{bg:C.positive_bg,fg:C.positive},"MANTER":{bg:C.blue_bg,fg:C.blue},"REDUZIR":{bg:C.negative_bg,fg:C.negative},"AGUARDAR":{bg:C.amber_bg,fg:C.amber},"NOVO":{bg:C.positive_bg,fg:C.positive}};
        var vInfo=verdictMap[an.verdict]||verdictMap["AGUARDAR"];
        var vW=24;setF(vInfo.bg);doc.rect(W-MR-vW-4,y+2,vW,7,"F");
        doc.setFontSize(6.5);doc.setFont("helvetica","bold");setC(vInfo.fg);doc.text(an.verdict||"—",W-MR-vW-4+vW/2,y+6.5,{align:"center"});
        if(an.priority){doc.setFontSize(6);setC(C.muted);doc.text("P"+an.priority,W-MR-vW-4+vW/2,y+12,{align:"center"});}
        y+=26;
        // Render text paragraph
        var assetText = an.rationale || an.text || "";
        if (assetText) {
          chk(12);doc.setFontSize(6.5);doc.setFont("helvetica","bold");setC(C.accent);doc.text("RECOMENDAÇÃO",ML+2,y);y+=5;
          doc.setFontSize(8.5);doc.setFont("helvetica","normal");setC(C.body);
          var atLines=wrap(assetText,CW-6,8.5);
          for(var atl=0;atl<atLines.length;atl++){chk(4.5);doc.setFontSize(8.5);doc.setFont("helvetica","normal");setC(C.body);doc.text(atLines[atl],ML+2,y);y+=4.5;}
          y+=3;
        }
        y+=3;setD(C.rule);doc.line(ML,y,ML+25,y);y+=10;
      }
      // Disclaimer
      chk(20);y+=5;doc.setFontSize(6);doc.setFont("helvetica","italic");setC(C.muted);
      var discLines=wrap("Este relatório tem caráter informativo e não constitui recomendação de investimento. Investimentos envolvem riscos. Consulte seu assessor.",CW,6);
      for(var dli=0;dli<discLines.length;dli++){doc.text(discLines[dli],ML,y);y+=3;}
      var pc=doc.internal.getNumberOfPages();for(var pg=2;pg<=pc;pg++){doc.setPage(pg);doc.setFontSize(6.5);doc.setFont("helvetica","normal");setC(C.muted);doc.text((pg-1)+"  |  "+(pc-1),W/2,H-10,{align:"center"});setF(C.accent);doc.rect(0,H-0.5,W,0.5,"F");}
      var fn="consultivo-mensal"+(clientName?"-"+clientName.replace(/\s+/g,"-").toLowerCase():"")+"-"+(period||"").replace(/\s/g,"")+".pdf";
      doc.save(fn);
    }catch(err){console.error(err);alert("Erro PDF: "+err.message);}
    setPdfGenerating(false);
  }

  // ── Styles ──
  var iS={width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"8px 10px",color:"#e2e8f0",fontSize:"12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  var lS={fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:"4px",display:"block"};
  var btnBase={padding:"8px 16px",borderRadius:"8px",border:"none",cursor:"pointer",fontWeight:700,fontSize:"12px"};

  var selCount=Object.keys(selectedAssets).length;
  var matchCount=crossrefData?crossrefData.filter(function(c){return c.hasAppData;}).length:0;
  var cartCount=crossrefData?crossrefData.filter(function(c){return c.carteiraSuno;}).length:0;
  var jbData = editingProfile ? editingProfile.jbData : null;
  var hasJB = !!jbData;

  // ── RENDER ──
  return (
    <div style={p.inline?{padding:"0"}:{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:"#0A0A0A",borderRadius:p.inline?"0":"16px",border:p.inline?"none":"1px solid rgba(220,38,38,0.15)",width:"100%",maxWidth:p.inline?"100%":"850px",maxHeight:p.inline?"none":"92vh",overflow:"auto",padding:"0"}}>
        {/* Header */}
        <div style={{padding:"20px 24px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#0A0A0A",zIndex:10,borderRadius:"16px 16px 0 0"}}>
          <div>
            <div style={{fontSize:"16px",fontWeight:800,color:"#fff"}}>Recomendações</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",marginTop:"2px"}}>Estratégia (JB) + Relatório de Recomendações</div>
          </div>
          <button onClick={p.onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"20px",cursor:p.inline?"default":"pointer",display:p.inline?"none":"block"}}>✕</button>
        </div>

        {/* Client selector */}
        <div style={{padding:"12px 24px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <select value={selectedProfileId} onChange={function(e){selectProfile(e.target.value);}} style={Object.assign({},iS,{flex:1})}>
              <option value="" style={{background:"#1a1a1a"}}>Selecionar cliente...</option>
              {clientProfiles.map(function(pr){return <option key={pr.id} value={pr.id} style={{background:"#1a1a1a"}}>{pr.name||"Sem nome"}{pr.riskProfile?" ("+pr.riskProfile+")":""}{pr.jbData?" ✓ JB":""}</option>;})}
            </select>
            <button onClick={createNewProfileInline} style={{fontSize:"10px",color:"#DC2626",background:"transparent",border:"1px solid rgba(220,38,38,0.2)",borderRadius:"7px",padding:"8px 12px",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>+ Novo</button>
          </div>
        </div>

        {/* Sub-abas */}
        {editingProfile && (<div>
          <div style={{display:"flex",gap:"2px",padding:"10px 24px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            {[{k:CONSULT_TAB_STRATEGY,l:"Estratégia (JB)",icon:"📋"},{k:CONSULT_TAB_RECOMMEND,l:"Recomendação Mensal",icon:"📊"}].map(function(t){
              return <button key={t.k} onClick={function(){setMainTab(t.k);}} style={{padding:"9px 18px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:700,borderRadius:"7px 7px 0 0",background:mainTab===t.k?"rgba(220,38,38,0.12)":"transparent",color:mainTab===t.k?"#DC2626":"rgba(255,255,255,0.3)"}}>{t.icon} {t.l}</button>;
            })}
          </div>

          <div style={{padding:"20px 24px 24px"}}>
            {error&&<div style={{color:"#f87171",fontSize:"11px",padding:"8px 10px",background:"rgba(220,38,38,0.08)",borderRadius:"6px",marginBottom:"10px"}}>{error}</div>}

            {/* ═══ TAB ESTRATÉGIA ═══ */}
            {mainTab===CONSULT_TAB_STRATEGY&&(<div>
              {/* Profile editor */}
              <div style={{background:"rgba(220,38,38,0.02)",border:"1px solid rgba(220,38,38,0.1)",borderRadius:"10px",padding:"12px",marginBottom:"14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                  <span style={{fontSize:"10px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1px"}}>Perfil: {editingProfile.name || "Sem nome"}</span>
                  <button onClick={function(){setShowProfileEditor(!showProfileEditor);}} style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",padding:"3px 8px",cursor:"pointer"}}>{showProfileEditor?"Recolher":"Editar Perfil"}</button>
                </div>
                {!showProfileEditor&&editingProfile.name&&<div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>{editingProfile.age&&editingProfile.age+" anos"}{editingProfile.profession&&" · "+editingProfile.profession}{editingProfile.riskProfile&&" · "+editingProfile.riskProfile}{editingProfile.horizon&&" · "+editingProfile.horizon+" anos"}</div>}
                {showProfileEditor&&<div><ClientProfileEditor profile={editingProfile} onChange={function(u){setEditingProfile(u);}}/><button onClick={function(){saveProfileToList(editingProfile);setShowProfileEditor(false);}} style={Object.assign({},btnBase,{background:"#DC2626",color:"#fff",marginTop:"10px",width:"100%"})}>Salvar perfil</button></div>}
              </div>

              {/* JB status */}
              <div style={{fontSize:"10px",fontWeight:700,color:"#fbbf24",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Journey Book</div>
              {hasJB ? (
                <div style={{background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"10px",padding:"14px",marginBottom:"14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <span style={{fontSize:"9px",padding:"2px 8px",borderRadius:"10px",background:"rgba(74,222,128,0.12)",color:"#4ade80",fontWeight:700}}>JB SALVO</span>
                      <span style={{fontSize:"10px",color:"rgba(255,255,255,0.4)"}}>Importado em {editingProfile.jbImportDate}</span>
                    </div>
                    <div style={{display:"flex",gap:"4px"}}>
                      <label style={{fontSize:"9px",color:"#fbbf24",background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:"5px",padding:"4px 8px",cursor:"pointer",fontWeight:600}}>
                        Reimportar
                        <input ref={fileRef} type="file" accept=".pdf" onChange={handleJBUpload} style={{display:"none"}}/>
                      </label>
                      <button onClick={clearJB} style={{fontSize:"9px",color:"rgba(220,38,38,0.5)",background:"transparent",border:"1px solid rgba(220,38,38,0.15)",borderRadius:"5px",padding:"4px 8px",cursor:"pointer"}}>Remover</button>
                    </div>
                  </div>
                  <div style={{fontSize:"10px",color:"rgba(255,255,255,0.45)",lineHeight:1.6}}>
                    {jbData.suggestedPortfolio&&<span>{jbData.suggestedPortfolio.length} ativos sugeridos</span>}
                    {jbData.projections&&jbData.projections.capitalAtRetirement&&<span> · Capital projetado: R$ {jbData.projections.capitalAtRetirement.toLocaleString("pt-BR")}</span>}
                    {jbData.allocationMacro&&jbData.allocationMacro.classes&&<span> · {jbData.allocationMacro.classes.length} classes de alocação</span>}
                  </div>
                  {jbFileName && <div style={{marginTop:"8px",padding:"8px",background:"rgba(251,191,36,0.04)",borderRadius:"6px",border:"1px solid rgba(251,191,36,0.1)"}}>
                    <div style={{fontSize:"10px",color:"rgba(255,255,255,0.5)",marginBottom:"6px"}}>Novo arquivo: {jbFileName}</div>
                    <button onClick={parseJourneyBook} disabled={jbParsing} style={Object.assign({},btnBase,{background:jbParsing?"rgba(255,255,255,0.05)":"#fbbf24",color:jbParsing?"rgba(255,255,255,0.3)":"#000",fontSize:"10px",width:"100%"})}>{jbParsing?"Processando...":"Reimportar Journey Book"}</button>
                  </div>}
                </div>
              ) : (
                <div style={{background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(255,255,255,0.1)",borderRadius:"10px",padding:"20px",textAlign:"center",marginBottom:"14px"}}>
                  <div style={{fontSize:"11px",color:"rgba(255,255,255,0.3)",marginBottom:"8px"}}>Nenhum Journey Book importado para este cliente</div>
                  <label style={{display:"inline-block",padding:"8px 16px",borderRadius:"7px",border:"none",background:"#DC2626",color:"#fff",fontWeight:700,fontSize:"11px",cursor:"pointer"}}>
                    Importar PDF do Journey Book
                    <input ref={fileRef} type="file" accept=".pdf" onChange={handleJBUpload} style={{display:"none"}}/>
                  </label>
                  {jbFileName && <div style={{marginTop:"8px"}}>
                    <div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",marginBottom:"4px"}}>{jbFileName}</div>
                    <button onClick={parseJourneyBook} disabled={jbParsing} style={Object.assign({},btnBase,{background:jbParsing?"rgba(255,255,255,0.05)":"#DC2626",color:jbParsing?"rgba(255,255,255,0.3)":"#fff",fontSize:"11px"})}>{jbParsing?"Processando com IA...":"Processar Journey Book"}</button>
                  </div>}
                </div>
              )}

              <div style={{fontSize:"9px",color:"rgba(255,255,255,0.2)",lineHeight:1.6}}>O Journey Book fica salvo permanentemente no perfil do cliente. Na aba "Recomendação Mensal" você só precisa importar a posição atual e gerar.</div>
            </div>)}

            {/* ═══ TAB RECOMENDAÇÃO ═══ */}
            {mainTab===CONSULT_TAB_RECOMMEND&&(<div>
              {!hasJB && <div style={{textAlign:"center",padding:"30px 0",color:"rgba(255,255,255,0.3)",fontSize:"12px"}}>Importe o Journey Book na aba "Estratégia" primeiro.</div>}
              {hasJB && (<div>
                {/* Step indicator */}
                <div style={{display:"flex",gap:"3px",marginBottom:"14px"}}>
                  {REC_STEPS.map(function(s){
                    var isActive=s===recStep;var idx=REC_STEPS.indexOf(s);var curIdx=REC_STEPS.indexOf(recStep);var isDone=idx<curIdx;
                    return <div key={s} style={{flex:1,textAlign:"center",padding:"5px 3px",borderRadius:"6px",fontSize:"8px",fontWeight:700,textTransform:"uppercase",background:isActive?"rgba(220,38,38,0.12)":isDone?"rgba(74,222,128,0.06)":"rgba(255,255,255,0.02)",color:isActive?"#DC2626":isDone?"#4ade80":"rgba(255,255,255,0.2)",border:isActive?"1px solid rgba(220,38,38,0.2)":"1px solid transparent"}}>{isDone?"✓ ":""}{REC_STEP_LABELS[s]}</div>;
                  })}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"12px"}}>
                  <div><label style={lS}>Consultor</label><input value={consultorName} onChange={function(e){setConsultorName(e.target.value);}} style={iS}/></div>
                  <div><label style={lS}>Período</label><input value={period} onChange={function(e){setPeriod(e.target.value);}} type="month" style={iS}/></div>
                </div>

                {/* STEP 1: Position */}
                {recStep==="position"&&(<div>
                  <div style={{fontSize:"10px",fontWeight:700,color:"#fbbf24",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Posição Atual</div>
                  {posAssets.length>0&&editingProfile&&editingProfile.posImportDate&&!posFile&&(
                    <div style={{background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"8px",padding:"10px",marginBottom:"10px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><span style={{fontSize:"9px",padding:"2px 8px",borderRadius:"10px",background:"rgba(74,222,128,0.12)",color:"#4ade80",fontWeight:700}}>POSIÇÃO SALVA</span><span style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",marginLeft:"8px"}}>{posAssets.length} ativos · {editingProfile.posImportDate}</span></div>
                      </div>
                    </div>
                  )}
                  <label style={{display:"block",padding:"14px",border:"1px dashed rgba(255,255,255,0.1)",borderRadius:"8px",textAlign:"center",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontSize:"11px",marginBottom:"10px"}}>
                    {posFileName&&posFile?posFileName:(posAssets.length>0?"Importar nova planilha (substitui a salva)":"Upload Excel da posição (.xlsx)")}
                    <input ref={posFileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handlePosUpload} style={{display:"none"}}/>
                  </label>
                  {posAssets.length>0&&<div style={{fontSize:"10px",color:"#4ade80",marginBottom:"6px"}}>{posAssets.length} ativos carregados{editingProfile&&editingProfile.posImportDate&&!posFile?" (posição de "+editingProfile.posImportDate+")":""}</div>}
                  <div style={{marginBottom:"10px"}}><label style={lS}>Caixa disponível (R$)</label><input value={availableCash?("R$ "+formatBRL(availableCash)):""} onChange={function(e){setAvailableCash(String(parseBRL(e.target.value)));}} placeholder="R$ 50.000" style={iS}/></div>
                  <button onClick={function(){buildAssetList();}} disabled={posAssets.length===0} style={Object.assign({},btnBase,{width:"100%",background:posAssets.length>0?"#DC2626":"rgba(255,255,255,0.05)",color:posAssets.length>0?"#fff":"rgba(255,255,255,0.3)"})}>{posAssets.length>0?"Selecionar Ativos →":"Importe a posição primeiro"}</button>
                </div>)}

                {/* STEP 2: Select with filters */}
                {recStep==="select"&&crossrefData&&(function(){
                  var cartNames=[];(carteirasData.carteiras||[]).forEach(function(cart){if((carteirasData.ativos[cart.id]||[]).length>0)cartNames.push(cart.name);});

                  // Map asset to BIAS_CLASSES subclass
                  function mapToSubclass(ticker, subClass, classe, classHint, assetName) {
                    var sc=(subClass||"").toLowerCase(); var cl=(classe||"").toLowerCase(); var ch=(classHint||"").toLowerCase(); var tk=(ticker||"").toUpperCase();
                    var fullName = ((ticker||"") + " " + (assetName||"")).toUpperCase(); // combine ticker + name for better matching

                    // ── RENDA FIXA: classificar por tipo de indexador ──
                    if(sc==="caixa"||cl==="caixa"||fullName.indexOf("CAIXA")>=0) return "Cash";

                    // Check if it's RF (by class or subclass)
                    var isRF = cl.indexOf("renda fixa")>=0 || sc.indexOf("indexado")>=0 || sc.indexOf("juros")>=0 || sc.indexOf("fundo")>=0 && cl.indexOf("renda fixa")>=0;
                    if (!isRF) {
                      // Also check by ticker name patterns for RF products
                      isRF = /^(LCA|LCI|CDB|CRA|CRI|LF |DEBENTURE|NTN|LTN|TESOURO)/i.test(fullName) || /CDI|SELIC|DI |IPCA|INFLAC|PRE.?FIX|PREFIXAD/i.test(fullName);
                    }

                    if (isRF) {
                      // Pré-fixado: LTN, Pré-fixado, Tesouro Prefixado
                      if (/PRE.?FIX|PREFIXAD|LTN|TESOURO PRE/i.test(fullName)) return "Pré-fixado";
                      // Inflação: IPCA+, NTN-B, Tesouro IPCA, inflação
                      if (/IPCA|INFLAC|NTN.?B|TESOURO IPCA/i.test(fullName)) return "IPCA+";
                      // Pós-fixado: CDI, Selic, DI, Tesouro Selic, LCA, LCI, CDB, fundos RF
                      if (/CDI|SELIC|TESOURO SELIC|DI |% DI|BANCO|LCA |LCI |CDB |CLASSE|COTAS|FUNDO|RF|RENDA FIXA/i.test(fullName)) return "Pós-fixado";
                      // Sub-classe do Excel diz algo específico?
                      if(sc.indexOf("inflac")>=0||sc.indexOf("ipca")>=0) return "IPCA+";
                      if(sc.indexOf("pre")>=0&&sc.indexOf("fix")>=0) return "Pré-fixado";
                      // Default RF = Pós-fixado
                      return "Pós-fixado";
                    }

                    // ── RENDA VARIÁVEL ──
                    // Exception: some tickers ending in 11 are stocks (units), not FIIs
                    var notFII11 = ["BRBI11","KLBN11","TAEE11","SAPR11","EGIE11","ALUP11","BPAC11","SANB11","RNEW11","TIMS11","VIVT11"];
                    if(sc.indexOf("fii")>=0||sc.indexOf("imobili")>=0||ch.indexOf("fii")>=0) return "FIIs";
                    if(/^[A-Z]{4}11$/.test(tk) && notFII11.indexOf(tk)<0 && sc.indexOf("aço")<0 && sc!=="ações") return "FIIs";
                    if(sc.indexOf("etf")>=0) {
                      if(/^(IVVB|NASD|HASH|EURP|XINA|ACWI)/i.test(tk)) return "Equities Offshore";
                      return "Ações Brasil";
                    }
                    if(sc.indexOf("aço")>=0||sc==="ações"||ch.indexOf("aço")>=0||ch.indexOf("ações")>=0) return "Ações Brasil";
                    if(sc.indexOf("alter")>=0||ch.indexOf("alter")>=0) return "Alternativos";
                    if(ch.indexOf("intern")>=0||ch.indexOf("offshore")>=0) return "Equities Offshore";
                    if(/^[A-Z]{4}11$/.test(tk) && notFII11.indexOf(tk)<0) return "FIIs";
                    if(/^[A-Z]{4}(3|4|5|6)$/.test(tk)) return "Ações Brasil";
                    if(/^[A-Z]{1,5}$/.test(tk)&&!/\d/.test(tk)) return "Equities Offshore";
                    return "Ações Brasil";
                  }

                  // Build structured data by BIAS_CLASSES
                  var posTotal = posAssets.reduce(function(s,a){return s+(a.totalValue||0);},0);
                  var subclassData = {};
                  ALL_BIAS_ITEMS.forEach(function(item){ subclassData[item] = {jb:0, pos:0, posValue:0, assets:[]}; });

                  // JB meta by subclass - distribute RF among Pós/IPCA+/Pré using JB assets
                  var jbd = editingProfile ? editingProfile.jbData : null;
                  var allocClasses = jbd && jbd.allocationMacro ? jbd.allocationMacro.classes : [];
                  
                  // Simple mapping for non-RF classes
                  var jbMapSimple = {"Ações":"Ações Brasil","FIIs":"FIIs","Internacional":"Equities Offshore","Alternativo":"Alternativos","Caixa":"Cash","Multimercado":"Alternativos"};
                  
                  allocClasses.forEach(function(ac) {
                    var name = ac.name || "";
                    var pct = ac.suggestedPercent || 0;
                    
                    if (name === "Renda Fixa" || name.indexOf("Renda Fixa") >= 0) {
                      // Sum percentPortfolio from JB suggestedPortfolio RF assets by subclass
                      var rfAssets = ((jbd && jbd.suggestedPortfolio) || []).filter(function(a) {
                        var cl = (a.class||"").toLowerCase();
                        return cl.indexOf("renda fixa") >= 0 || cl.indexOf("rf") >= 0 || cl.indexOf("crédito") >= 0;
                      });
                      if (rfAssets.length > 0) {
                        var subMap = {"Pós-fixado":"Pós-fixado","Pos-fixado":"Pós-fixado","Inflação":"IPCA+","Inflacao":"IPCA+","IPCA+":"IPCA+","Pré-fixado":"Pré-fixado","Pre-fixado":"Pré-fixado","Caixa":"Cash","Cash":"Cash"};
                        rfAssets.forEach(function(a) {
                          var sc = a.subclass || "";
                          var mapped = subMap[sc];
                          if (!mapped) {
                            var tk = (a.ticker||a.name||"").toUpperCase();
                            if (/IPCA|INFLAC|NTN.?B/i.test(tk)) mapped = "IPCA+";
                            else if (/PRE.?FIX|PREFIXAD|LTN/i.test(tk)) mapped = "Pré-fixado";
                            else if (/CAIXA/i.test(tk)) mapped = "Cash";
                            else mapped = "Pós-fixado";
                          }
                          if (subclassData[mapped]) subclassData[mapped].jb += (a.percentPortfolio || 0);
                        });
                      } else {
                        subclassData["Pós-fixado"].jb = pct;
                      }
                    } else {
                      var k = jbMapSimple[name] || name;
                      if (subclassData[k]) subclassData[k].jb = pct;
                    }
                  });

                  // Position from Excel
                  posAssets.forEach(function(pa){
                    var mapped = mapToSubclass(pa.ticker, pa.subClass, pa.type, "", pa.name);
                    if(subclassData[mapped]){ subclassData[mapped].posValue += (pa.totalValue||0); }
                  });
                  if(posTotal>0){ ALL_BIAS_ITEMS.forEach(function(item){ subclassData[item].pos = subclassData[item].posValue/posTotal*100; }); }

                  // Assign crossref assets to subclasses
                  crossrefData.forEach(function(a){
                    var pa=null; for(var pi=0;pi<posAssets.length;pi++){if(posAssets[pi].ticker===a.ticker){pa=posAssets[pi];break;}}
                    var mapped = mapToSubclass(a.ticker, pa?pa.subClass:"", pa?pa.type:"", a.class, pa?pa.name:a.name);
                    a._subclass = mapped;
                    a._classTag = BIAS_CLASSES.find(function(g){return g.items.indexOf(mapped)>=0;});
                    a._classTag = a._classTag ? a._classTag.group : "Equities";
                    if(subclassData[mapped]) subclassData[mapped].assets.push(a);
                  });

                  // Apply filters
                  function passesFilters(c) {
                    if(filterVies!=="all"){var v=c.carteiraSuno?c.carteiraSuno.vies:null;if(v!==filterVies)return false;}
                    if(filterCarteira!=="all"){var ca=c.carteiraSuno?c.carteiraSuno.carteira:null;if(ca!==filterCarteira)return false;}
                    if(filterSentiment!=="all"&&c.appMatch&&c.appMatch.sentiment!==filterSentiment)return false;
                    if(filterRank!=="all"&&c.carteiraSuno){var r=c.carteiraSuno.rank||999;if(filterRank==="top5"&&r>5)return false;if(filterRank==="top10"&&r>10)return false;}
                    if(filterMargem!=="all"&&c.deltaCeiling!=null){if(filterMargem==="desconto"&&c.deltaCeiling<=0)return false;if(filterMargem==="desconto20"&&c.deltaCeiling<=20)return false;}
                    return true;
                  }

                  var selCt=Object.keys(selectedAssets).length;
                  var totalFiltered = crossrefData.filter(passesFilters).length;
                  var viesColors={"Comprar":"#4ade80","Aguardar":"#fbbf24","Vender":"#f87171"};

                  return <div>
                    {/* Legend */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                      <span style={{fontSize:"10px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1px"}}>{selCt} selecionados</span>
                      <div style={{display:"flex",gap:"12px",fontSize:"9px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"4px"}}><div style={{width:"8px",height:"8px",borderRadius:"2px",background:"#60a5fa"}}></div><span style={{color:"rgba(255,255,255,0.4)"}}>Meta (JB)</span></div>
                        <div style={{display:"flex",alignItems:"center",gap:"4px"}}><div style={{width:"8px",height:"8px",borderRadius:"2px",background:"#fbbf24"}}></div><span style={{color:"rgba(255,255,255,0.4)"}}>Atual (Excel)</span></div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"10px"}}>
                      <select value={filterVies} onChange={function(e){setFilterVies(e.target.value);}} style={{background:"#1a1a1a",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"6px",padding:"5px 10px",color:"#e2e8f0",fontSize:"10px",outline:"none"}}><option value="all">Viés: Todos</option><option value="Comprar">Comprar</option><option value="Aguardar">Aguardar</option></select>
                      <select value={filterCarteira} onChange={function(e){setFilterCarteira(e.target.value);}} style={{background:"#1a1a1a",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"6px",padding:"5px 10px",color:"#e2e8f0",fontSize:"10px",outline:"none"}}><option value="all">Carteira: Todas</option>{cartNames.map(function(cn){return <option key={cn} value={cn}>{cn}</option>;})}</select>
                      <select value={filterSentiment} onChange={function(e){setFilterSentiment(e.target.value);}} style={{background:"#1a1a1a",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"6px",padding:"5px 10px",color:"#e2e8f0",fontSize:"10px",outline:"none"}}><option value="all">Sentimento: Todos</option><option value="positive">Positivo</option><option value="neutral">Neutro</option><option value="negative">Negativo</option></select>
                      <select value={filterRank} onChange={function(e){setFilterRank(e.target.value);}} style={{background:"#1a1a1a",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"6px",padding:"5px 10px",color:"#e2e8f0",fontSize:"10px",outline:"none"}}><option value="all">Rank: Todos</option><option value="top5">Top 5</option><option value="top10">Top 10</option></select>
                      <select value={filterMargem} onChange={function(e){setFilterMargem(e.target.value);}} style={{background:"#1a1a1a",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"6px",padding:"5px 10px",color:"#e2e8f0",fontSize:"10px",outline:"none"}}><option value="all">Margem: Todas</option><option value="desconto">Com desconto</option><option value="desconto20">&gt;20%</option></select>
                      <div style={{marginLeft:"auto",display:"flex",gap:"4px",alignItems:"center"}}>
                        {quotesUpdated&&<span style={{fontSize:"8px",color:"rgba(74,222,128,0.5)"}}>Preços {quotesUpdated}</span>}
                        <button onClick={fetchQuotes} disabled={quotesLoading} style={{fontSize:"8px",padding:"4px 8px",borderRadius:"4px",border:"1px solid rgba(74,222,128,0.2)",background:quotesLoading?"rgba(74,222,128,0.05)":"rgba(74,222,128,0.08)",color:quotesLoading?"rgba(74,222,128,0.3)":"#4ade80",cursor:quotesLoading?"wait":"pointer",fontWeight:600}}>{quotesLoading?"Buscando...":"Atualizar Cotações"}</button>
                        <button onClick={function(){var sel={};crossrefData.filter(passesFilters).forEach(function(c){sel[c.ticker]=true;});setSelectedAssets(function(prev){return Object.assign({},prev,sel);});}} style={{fontSize:"8px",padding:"4px 8px",borderRadius:"4px",border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer"}}>Sel. visíveis</button>
                        <button onClick={function(){setSelectedAssets({});}} style={{fontSize:"8px",padding:"4px 8px",borderRadius:"4px",border:"1px solid rgba(220,38,38,0.15)",background:"transparent",color:"rgba(220,38,38,0.4)",cursor:"pointer"}}>Limpar</button>
                      </div>
                    </div>

                    {/* Structured table by BIAS_CLASSES */}
                    <div style={{maxHeight:"420px",overflow:"auto",marginBottom:"12px",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px"}}>
                      {/* Column headers */}
                      <div style={{padding:"4px 10px 4px 32px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",gap:"4px",position:"sticky",top:0,background:"#0A0A0A",zIndex:2}}>
                        <span style={{width:"20px",flexShrink:0}}></span>
                        <span style={{width:"52px",flexShrink:0,fontSize:"7px",color:"rgba(255,255,255,0.3)",fontWeight:600}}>TICKER</span>
                        <span style={{flex:1,fontSize:"7px",color:"rgba(255,255,255,0.3)",fontWeight:600}}>EMPRESA</span>
                        <span style={{width:"72px",textAlign:"center",flexShrink:0,fontSize:"7px",color:"rgba(255,255,255,0.3)",fontWeight:600}}>META → ATUAL</span>
                        <span style={{width:"28px",textAlign:"center",flexShrink:0,fontSize:"7px",color:"rgba(255,255,255,0.3)",fontWeight:600}}>RANK</span>
                        <span style={{width:"22px",textAlign:"center",flexShrink:0,fontSize:"7px",color:"rgba(255,255,255,0.3)",fontWeight:600}}>NOTA</span>
                        <span style={{width:"32px",textAlign:"right",flexShrink:0,fontSize:"7px",color:"rgba(255,255,255,0.3)",fontWeight:600}}>DESC.</span>
                      </div>
                      {BIAS_CLASSES.map(function(group){
                        var groupAssets = group.items.reduce(function(s,item){return s.concat(subclassData[item].assets);}, []);
                        var groupFiltered = groupAssets.filter(passesFilters);
                        var groupJb = group.items.reduce(function(s,item){return s+subclassData[item].jb;},0);
                        var groupPos = group.items.reduce(function(s,item){return s+subclassData[item].pos;},0);
                        var groupVal = group.items.reduce(function(s,item){return s+subclassData[item].posValue;},0);
                        var groupDiff = groupJb - groupPos;
                        var diffColor = groupDiff>3?"#4ade80":groupDiff<-3?"#f87171":"#94a3b8";

                        return <div key={group.group}>
                          {/* Group header */}
                          <div style={{padding:"8px 10px",background:"rgba(220,38,38,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <span style={{fontSize:"11px",fontWeight:800,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1px"}}>{group.group}</span>
                            <div style={{display:"flex",gap:"10px",alignItems:"center",fontSize:"10px"}}>
                              <span style={{color:"#60a5fa",fontWeight:700}}>{groupJb.toFixed(0)}%</span>
                              <span style={{color:"rgba(255,255,255,0.15)"}}>→</span>
                              <span style={{color:"#fbbf24",fontWeight:700}}>{groupPos.toFixed(0)}%</span>
                              {groupVal>0&&<span style={{color:"rgba(255,255,255,0.3)",fontSize:"9px"}}>R$ {groupVal.toLocaleString("pt-BR",{maximumFractionDigits:0})}</span>}
                              <span style={{color:diffColor,fontWeight:700,fontSize:"9px"}}>{groupDiff>0?"+":""}{groupDiff.toFixed(0)}pp</span>
                            </div>
                          </div>

                          {/* Subclass rows */}
                          {group.items.map(function(item){
                            var sd = subclassData[item];
                            var itemAssets = sd.assets.filter(passesFilters);
                            if(itemAssets.length === 0 && sd.jb === 0 && sd.posValue === 0) return null;
                            var itemDiff = sd.jb - sd.pos;
                            var idColor = itemDiff>2?"#4ade80":itemDiff<-2?"#f87171":"#94a3b8";

                            return <div key={item}>
                              {/* Subclass header */}
                              <div style={{padding:"5px 10px 5px 20px",background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(255,255,255,0.03)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <span style={{fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.5)"}}>{item}</span>
                                <div style={{display:"flex",gap:"8px",alignItems:"center",fontSize:"9px"}}>
                                  <span style={{color:"rgba(96,165,250,0.7)"}}>{sd.jb.toFixed(0)}%</span>
                                  <span style={{color:"rgba(255,255,255,0.1)"}}>→</span>
                                  <span style={{color:"rgba(251,191,36,0.7)"}}>{sd.pos.toFixed(0)}%</span>
                                  {sd.posValue>0&&<span style={{color:"rgba(255,255,255,0.2)"}}>R$ {sd.posValue.toLocaleString("pt-BR",{maximumFractionDigits:0})}</span>}
                                  <span style={{color:idColor,fontSize:"8px"}}>{itemDiff>0?"+":""}{itemDiff.toFixed(0)}pp</span>
                                  <span style={{color:"rgba(255,255,255,0.15)"}}>{itemAssets.length} ativos</span>
                                </div>
                              </div>

                              {/* Assets in this subclass */}
                              {itemAssets.map(function(c){
                                var isSel=!!selectedAssets[c.ticker];
                                var vC=c.carteiraSuno?(viesColors[c.carteiraSuno.vies]||"#94a3b8"):"#94a3b8";
                                return <div key={c.ticker} style={{padding:"5px 10px 5px 32px",borderBottom:"1px solid rgba(255,255,255,0.02)",background:isSel?"rgba(220,38,38,0.04)":"transparent",display:"flex",alignItems:"center",gap:"4px"}}>
                                  <input type="checkbox" checked={isSel} onChange={function(){setSelectedAssets(function(prev){var n=Object.assign({},prev);if(n[c.ticker])delete n[c.ticker];else n[c.ticker]=true;return n;});}} style={{accentColor:"#DC2626",flexShrink:0}}/>
                                  <span style={{fontWeight:700,fontSize:"11px",color:isSel?"#DC2626":"#f1f5f9",width:"52px",flexShrink:0}}>{c.ticker}</span>
                                  <span style={{fontSize:"9px",color:"rgba(255,255,255,0.25)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                                  <div style={{display:"flex",gap:"2px",alignItems:"center",width:"72px",justifyContent:"center",flexShrink:0}}>
                                    {c.jbPercent>0?<span style={{fontSize:"8px",padding:"1px 3px",borderRadius:"3px",background:"rgba(96,165,250,0.1)",color:"#60a5fa"}}>{c.jbPercent.toFixed(1)}%</span>:<span style={{fontSize:"8px",color:"rgba(255,255,255,0.08)"}}>—</span>}
                                    <span style={{fontSize:"6px",color:"rgba(255,255,255,0.1)"}}>→</span>
                                    {c.posPercent>0?<span style={{fontSize:"8px",padding:"1px 3px",borderRadius:"3px",background:"rgba(251,191,36,0.1)",color:"#fbbf24"}}>{c.posPercent.toFixed(1)}%</span>:<span style={{fontSize:"8px",color:"rgba(255,255,255,0.08)"}}>—</span>}
                                  </div>
                                  <span style={{width:"28px",textAlign:"center",flexShrink:0,fontSize:"7px",padding:"1px 0",borderRadius:"4px",background:c.carteiraSuno?(vC+"18"):"transparent",color:c.carteiraSuno?vC:"transparent",fontWeight:600}}>{c.carteiraSuno?("#"+c.carteiraSuno.rank):""}</span>
                                  <span style={{width:"22px",textAlign:"center",flexShrink:0,fontSize:"7px",color:c.appMatch?(c.appMatch.sentiment==="positive"?"#4ade80":c.appMatch.sentiment==="negative"?"#f87171":"#94a3b8"):"transparent"}}>{c.appMatch&&c.appMatch.rankScore?c.appMatch.rankScore.toFixed(1):""}</span>
                                  <span style={{width:"32px",textAlign:"right",flexShrink:0,fontSize:"7px",color:c.deltaCeiling!=null?(c.deltaCeiling>0?"#4ade80":"#f87171"):"transparent",fontWeight:600}}>{c.deltaCeiling!=null?((c.deltaCeiling>0?"+":"")+c.deltaCeiling+"%"):""}</span>
                                </div>;
                              })}
                            </div>;
                          })}
                        </div>;
                      })}
                    </div>

                    {/* ── SELL/RESGATE SECTION: structured by class like buys ── */}
                    {posAssets.length>0&&(function(){
                      var sellTotal = Object.keys(sellAssets).reduce(function(s,tk){return s+(sellAssets[tk].value||0);},0);
                      var totalCash = (parseBRL(availableCash)||0) + sellTotal;

                      // Organize posAssets by BIAS_CLASSES subclass
                      var sellBySubclass = {};
                      ALL_BIAS_ITEMS.forEach(function(item){ sellBySubclass[item] = []; });
                      posAssets.filter(function(pa){return pa.totalValue > 0;}).forEach(function(pa){
                        var mapped = mapToSubclass(pa.ticker, pa.subClass, pa.type, "", pa.name);
                        if(sellBySubclass[mapped]) sellBySubclass[mapped].push(pa);
                        else { if(!sellBySubclass["Pós-fixado"]) sellBySubclass["Pós-fixado"]=[]; sellBySubclass["Pós-fixado"].push(pa); }
                      });

                      var hasAnySellable = posAssets.some(function(pa){return pa.totalValue > 0;});
                      if(!hasAnySellable) return null;

                      return <div style={{marginBottom:"12px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                          <span style={{fontSize:"10px",fontWeight:700,color:"#f87171",textTransform:"uppercase",letterSpacing:"1px"}}>Vendas / Resgates</span>
                          <div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)"}}>
                            {sellTotal>0&&<span style={{color:"#f87171",fontWeight:600}}>Vendas: R$ {sellTotal.toLocaleString("pt-BR")} · </span>}
                            <span style={{color:"#4ade80",fontWeight:600}}>Caixa total: R$ {totalCash.toLocaleString("pt-BR")}</span>
                          </div>
                        </div>
                        <div style={{maxHeight:"280px",overflow:"auto",border:"1px solid rgba(248,113,113,0.1)",borderRadius:"8px"}}>
                          {BIAS_CLASSES.map(function(group){
                            var groupAssets = group.items.reduce(function(s,item){return s.concat(sellBySubclass[item]||[]);}, []);
                            if(groupAssets.length===0) return null;
                            var groupVal = groupAssets.reduce(function(s,a){return s+(a.totalValue||0);},0);
                            var groupSellVal = groupAssets.reduce(function(s,a){return s+(sellAssets[a.ticker]?sellAssets[a.ticker].value:0);},0);

                            return <div key={group.group}>
                              <div style={{padding:"6px 10px",background:"rgba(248,113,113,0.06)",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <span style={{fontSize:"10px",fontWeight:800,color:"#f87171",textTransform:"uppercase",letterSpacing:"0.5px"}}>{group.group}</span>
                                <div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)"}}>
                                  R$ {groupVal.toLocaleString("pt-BR",{maximumFractionDigits:0})}
                                  {groupSellVal>0&&<span style={{color:"#f87171",marginLeft:"6px"}}>(-R$ {groupSellVal.toLocaleString("pt-BR")})</span>}
                                </div>
                              </div>
                              {group.items.map(function(item){
                                var itemAssets = sellBySubclass[item] || [];
                                if(itemAssets.length===0) return null;
                                var itemVal = itemAssets.reduce(function(s,a){return s+(a.totalValue||0);},0);
                                return <div key={item}>
                                  <div style={{padding:"4px 10px 4px 20px",background:"rgba(255,255,255,0.01)",borderBottom:"1px solid rgba(255,255,255,0.02)",display:"flex",justifyContent:"space-between"}}>
                                    <span style={{fontSize:"9px",fontWeight:600,color:"rgba(255,255,255,0.4)"}}>{item}</span>
                                    <span style={{fontSize:"8px",color:"rgba(255,255,255,0.2)"}}>R$ {itemVal.toLocaleString("pt-BR",{maximumFractionDigits:0})} · {itemAssets.length} ativos</span>
                                  </div>
                                  {itemAssets.map(function(pa){
                                    var isSelling = !!sellAssets[pa.ticker];
                                    var sellVal = isSelling ? sellAssets[pa.ticker].value : 0;
                                    return <div key={pa.ticker} style={{padding:"4px 10px 4px 32px",borderBottom:"1px solid rgba(255,255,255,0.02)",background:isSelling?"rgba(248,113,113,0.04)":"transparent",display:"flex",alignItems:"center",gap:"6px"}}>
                                      <input type="checkbox" checked={isSelling} onChange={function(){setSellAssets(function(prev){var n=Object.assign({},prev);if(n[pa.ticker])delete n[pa.ticker];else n[pa.ticker]={value:Math.round(pa.totalValue),total:true};return n;});}} style={{accentColor:"#f87171",flexShrink:0}}/>
                                      <span style={{fontWeight:700,fontSize:"10px",color:isSelling?"#f87171":"#f1f5f9",width:"52px",flexShrink:0}}>{pa.ticker.length>15?pa.ticker.slice(0,15)+"…":pa.ticker}</span>
                                      <span style={{fontSize:"8px",color:"rgba(255,255,255,0.2)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pa.name||""}</span>
                                      <span style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",flexShrink:0}}>R$ {(pa.totalValue||0).toLocaleString("pt-BR",{maximumFractionDigits:0})}</span>
                                      {isSelling&&<input type="text" value={sellVal?"R$ "+formatBRL(sellVal):""} onChange={function(e){var v=parseBRL(e.target.value);setSellAssets(function(prev){var n=Object.assign({},prev);n[pa.ticker]=Object.assign({},n[pa.ticker],{value:v,total:false});return n;});}} style={{width:"90px",background:"rgba(248,113,113,0.05)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:"4px",color:"#f87171",fontSize:"10px",textAlign:"right",padding:"3px 6px",outline:"none",fontWeight:700}} placeholder="R$ valor"/>}
                                    </div>;
                                  })}
                                </div>;
                              })}
                            </div>;
                          })}
                        </div>
                      </div>;
                    })()}

                    {/* Writing tone selector + generate button */}
                    <div style={{marginBottom:"8px"}}><ToneSelector value={writingTone} onChange={setWritingTone}/></div>

                    <div style={{display:"flex",gap:"8px"}}>
                      <button onClick={function(){setRecStep("position");}} style={Object.assign({},btnBase,{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"})}>←</button>
                      <button onClick={function(){generatePreview();}} disabled={selCt===0||generating} style={Object.assign({},btnBase,{flex:1,background:selCt>0&&!generating?"#DC2626":"rgba(255,255,255,0.05)",color:selCt>0&&!generating?"#fff":"rgba(255,255,255,0.3)"})}>{generating?genProgress:("Gerar Recomendações ("+selCt+") →")}</button>
                    </div>
                  </div>;
                })()}

                {/* STEP 3: Review */}
                {/* STEP 3: Preview */}
                {recStep==="preview"&&(<div>
                  {generating&&<div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:"12px",fontWeight:600,color:"#DC2626",marginBottom:"6px"}}>Gerando prévia...</div><div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)"}}>{genProgress}</div></div>}
                  {!generating&&(<div>
                    <div style={{marginBottom:"16px"}}>
                      <div style={{fontSize:"10px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"6px"}}>Resumo Estratégico da Recomendação</div>
                      <textarea value={strategyText} onChange={function(e){setStrategyText(e.target.value);setPreviewApproved(false);}} rows={8} style={Object.assign({},iS,{resize:"vertical",lineHeight:1.7,fontSize:"11px"})}/>
                    </div>

                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                      <div style={{fontSize:"10px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1.5px"}}>Distribuição do Caixa</div>
                      <div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)"}}>
                        Compras: R$ {Object.keys(allocations).filter(function(tk){return(allocations[tk].type||"buy")==="buy";}).reduce(function(s,tk){return s+(allocations[tk].value||0);},0).toLocaleString("pt-BR")}
                        {Object.keys(allocations).some(function(tk){return allocations[tk].type==="sell";})&&<span style={{color:"#f87171"}}> · Vendas: R$ {Object.keys(allocations).filter(function(tk){return allocations[tk].type==="sell";}).reduce(function(s,tk){return s+Math.abs(allocations[tk].value||0);},0).toLocaleString("pt-BR")}</span>}
                      </div>
                    </div>

                    {Object.keys(allocations).map(function(tk){
                      var al=allocations[tk];
                      var cr=(crossrefData||[]).find(function(c){return c.ticker===tk;});
                      var vc={"APORTAR":"#4ade80","MANTER":"#60a5fa","REDUZIR":"#f87171","AGUARDAR":"#fbbf24","VENDER":"#f87171"};
                      return <div key={tk} style={{background:"#111",borderRadius:"10px",padding:"12px",border:"1px solid rgba(255,255,255,0.06)",marginBottom:"6px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                            <span style={{fontWeight:800,fontSize:"13px",color:"#f1f5f9"}}>{tk}</span>
                            <span style={{fontSize:"9px",color:"rgba(255,255,255,0.3)"}}>{cr?cr.name:""}</span>
                            {cr&&cr._classTag&&<span style={{fontSize:"8px",padding:"1px 5px",borderRadius:"5px",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.3)"}}>{cr._classTag}</span>}
                          </div>
                          <select value={al.verdict||"APORTAR"} onChange={function(e){updateAllocation(tk,"verdict",e.target.value);}} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"6px",padding:"3px 8px",color:vc[al.verdict]||"#fbbf24",fontSize:"10px",fontWeight:700,outline:"none"}}><option value="APORTAR">APORTAR</option><option value="MANTER">MANTER</option><option value="REDUZIR">REDUZIR</option><option value="AGUARDAR">AGUARDAR</option><option value="VENDER">VENDER</option></select>
                        </div>
                        <div style={{display:"flex",gap:"8px",marginBottom:"8px",alignItems:"center"}}>
                          <div style={{flex:"0 0 120px"}}><label style={lS}>{al.type==="sell"?"Venda (R$)":"Valor (R$)"}</label><input type="number" value={Math.abs(al.value)||""} onChange={function(e){var v=parseInt(e.target.value)||0;updateAllocation(tk,"value",al.type==="sell"?-Math.abs(v):v);}} style={Object.assign({},iS,{fontSize:"13px",fontWeight:700,textAlign:"right",color:al.type==="sell"?"#f87171":"#e2e8f0",borderColor:al.type==="sell"?"rgba(248,113,113,0.2)":"rgba(255,255,255,0.08)"})}/></div>
                          <div style={{flex:"0 0 80px",textAlign:"center"}}>
                            {cr&&cr.currentPrice>0&&Math.abs(al.value)>0?(function(){
                              var qty=Math.floor(Math.abs(al.value)/cr.currentPrice);
                              var isSell=al.type==="sell";
                              return <div><div style={{fontSize:"14px",fontWeight:800,color:isSell?"#f87171":"#a78bfa"}}>{qty}</div><div style={{fontSize:"7px",color:isSell?"rgba(248,113,113,0.5)":"rgba(167,139,250,0.5)"}}>≈ {isSell?"vender":"comprar"}</div></div>;
                            })():<div style={{fontSize:"9px",color:"rgba(255,255,255,0.15)"}}>—</div>}
                          </div>
                          <div style={{flex:1,fontSize:"10px",color:"rgba(255,255,255,0.3)",lineHeight:1.5}}>
                            {cr&&cr.currentPrice>0&&<span>Preço: R$ {cr.currentPrice.toFixed(2)}</span>}
                            {cr&&cr.deltaCeiling!=null&&<span style={{marginLeft:"8px",color:cr.deltaCeiling>0?"#4ade80":"#f87171"}}>{cr.deltaCeiling>0?"+":""}{cr.deltaCeiling}% vs teto</span>}
                          </div>
                        </div>
                        <textarea value={al.rationale||""} onChange={function(e){updateAllocation(tk,"rationale",e.target.value);setPreviewApproved(false);}} rows={2} style={Object.assign({},iS,{resize:"vertical",fontSize:"11px",lineHeight:1.6})}/>
                      </div>;
                    })}

                    <div style={{display:"flex",gap:"8px",marginTop:"14px",flexWrap:"wrap"}}>
                      <button onClick={function(){setRecStep("select");}} style={Object.assign({},btnBase,{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"})}>← Voltar</button>
                      <button onClick={readjustTexts} disabled={generating} style={Object.assign({},btnBase,{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.2)",color:"#fbbf24"})}>{generating?"Reajustando...":"Reajustar com IA"}</button>
                      <button onClick={function(){setPreviewApproved(true);setRecStep("review");}} style={Object.assign({},btnBase,{flex:1,background:"#DC2626",color:"#fff"})}>Aprovar e Revisar →</button>
                    </div>
                  </div>)}
                </div>)}

                {/* STEP 4: Review final */}
                {recStep==="review"&&(<div>
                  <div style={{background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"10px",padding:"14px",marginBottom:"14px"}}>
                    <div style={{fontSize:"10px",fontWeight:700,color:"#4ade80",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"}}>Prévia Aprovada ✓</div>
                    <div style={{fontSize:"11px",color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{strategyText.slice(0,300)}...</div>
                  </div>
                  <div style={{fontSize:"10px",fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"8px"}}>Resumo Final — {Object.keys(allocations).length} ativos · R$ {Object.keys(allocations).reduce(function(s,tk){return s+(allocations[tk].value||0);},0).toLocaleString("pt-BR")}</div>
                  {Object.keys(allocations).map(function(tk){
                    var al=allocations[tk];
                    var cr=(crossrefData||[]).find(function(c){return c.ticker===tk;});
                    return <div key={tk} style={{background:"#111",borderRadius:"8px",padding:"10px 12px",border:"1px solid rgba(255,255,255,0.05)",marginBottom:"4px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
                      <div style={{minWidth:"50px"}}><div style={{fontWeight:800,fontSize:"12px",color:"#f1f5f9"}}>{tk}</div><div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)"}}>{cr?cr.name:""}</div></div>
                      <div style={{flex:1,fontSize:"10px",color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{al.rationale}</div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:"13px",fontWeight:800,color:al.type==="sell"?"#f87171":"#4ade80"}}>{al.type==="sell"?"- ":""}R$ {Math.abs(al.value||0).toLocaleString("pt-BR")}</div>
                        {cr&&cr.currentPrice>0&&Math.abs(al.value)>0&&<div style={{fontSize:"9px",color:al.type==="sell"?"rgba(248,113,113,0.6)":"#a78bfa",fontWeight:600}}>≈ {Math.floor(Math.abs(al.value)/cr.currentPrice)} cotas</div>}
                        <div style={{fontSize:"8px",color:"rgba(255,255,255,0.3)"}}>{al.verdict}</div>
                      </div>
                    </div>;
                  })}
                  <div style={{display:"flex",gap:"8px",marginTop:"14px"}}>
                    <button onClick={function(){setRecStep("preview");}} style={Object.assign({},btnBase,{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"})}>← Ajustar</button>
                    <button onClick={function(){setRecStep("pdf");}} style={Object.assign({},btnBase,{flex:1,background:"#DC2626",color:"#fff"})}>Gerar PDF →</button>
                  </div>
                </div>)}

                {/* STEP 5: PDF */}
                {recStep==="pdf"&&(<div style={{textAlign:"center",padding:"20px 0"}}>
                  <div style={{fontSize:"18px",fontWeight:800,color:"#fff",marginBottom:"6px"}}>Relatório de Recomendações</div>
                  <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)",marginBottom:"16px"}}>{editingProfile&&editingProfile.name} · {Object.keys(allocations).length} ativos · R$ {Object.keys(allocations).reduce(function(s,tk){return s+(allocations[tk].value||0);},0).toLocaleString("pt-BR")} · {period||"Mensal"}</div>
                  <button onClick={generatePDF} disabled={pdfGenerating} style={Object.assign({},btnBase,{background:"#DC2626",color:"#fff",padding:"14px 40px",fontSize:"14px",width:"100%",opacity:pdfGenerating?0.6:1})}>{pdfGenerating?"Gerando PDF...":"Gerar Relatório PDF"}</button>
                  <button onClick={generateOperationalPDF} style={Object.assign({},btnBase,{background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.5)",padding:"12px 40px",fontSize:"12px",width:"100%",marginTop:"8px"})}>Gerar Tabela de Movimentações (Banker)</button>
                  <div style={{marginTop:"10px"}}><button onClick={function(){setRecStep("review");}} style={Object.assign({},btnBase,{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"})}>← Revisar</button></div>
                </div>)}
              </div>)}
            </div>)}
          </div>
        </div>)}

        {!editingProfile && <div style={{padding:"40px 24px",textAlign:"center",color:"rgba(255,255,255,0.2)",fontSize:"12px"}}>Selecione um cliente acima para começar.</div>}
      </div>
    </div>
  );
}

export default function App() {
  var [data,setData]=useState(function(){return makeData();});
  var [tab,setTab]=useState("Dividendos");var [isub,setIsub]=useState("Dollar Income");
  var [search,setSearch]=useState("");var [sf,setSf]=useState("all");
  var [panel,setPanel]=useState(false);var [notif,setNotif]=useState(null);var [hl,setHl]=useState(false);
  var [revalLoad,setRevalLoad]=useState(false);var [revalProg,setRevalProg]=useState("");

  // Navigation: pilar + page
  var [pilar, setPilar] = useState("research"); // research, consultoria, clientes
  var [page, setPage] = useState("teses"); // sub-pages
  var [openDropdown, setOpenDropdown] = useState(null);

  useEffect(function(){try{var s=localStorage.getItem("tt-v7");if(!s)s=localStorage.getItem("tt-v6");if(s)setData(migrateData(JSON.parse(s)));}catch(e){}},[]);
  useEffect(function(){try{localStorage.setItem("tt-v7",JSON.stringify(data));}catch(e){}},[data]);

  function notify(msg,type){setNotif({msg:msg,type:type||"ok"});setTimeout(function(){setNotif(null);},3500);}
  function nav(p, pg) { setPilar(p); setPage(pg); setOpenDropdown(null); }

  function handleAdd(entry,portfolio){setData(function(prev){var u={};Object.keys(prev).forEach(function(k){u[k]=prev[k].slice();});var l=u[portfolio]||[];var idx=-1;for(var i=0;i<l.length;i++){if(l[i].ticker===entry.ticker){idx=i;break;}}if(idx>=0){l[idx]=mergeStock(l[idx],entry);notify(entry.ticker+" atualizado!");}else{entry.history=entry.history||[];entry.lastUpdated=new Date().toISOString().slice(0,10);l.push(entry);notify(entry.ticker+" adicionado!");}u[portfolio]=l;return u;});setPanel(false);}

  function handleDel(ticker){setData(function(prev){var u={};Object.keys(prev).forEach(function(k){u[k]=prev[k].slice();});u[tab]=(u[tab]||[]).filter(function(s){return s.ticker!==ticker;});return u;});notify(ticker+" excluído.");}

  async function handleReeval() {
    var portfolio = tab; var list = (data[portfolio] || []).slice();
    if (list.length === 0) return;
    setRevalLoad(true); setRevalProg("Preparando...");
    var sys = 'Voce e um analista financeiro brasileiro. Para CADA ativo, avalie: 1) rankScore: 1.0-10.0. 2) highlight: true/false. 3) sentiment: positive/neutral/negative. JSON puro: [{"ticker":"XXX","rankScore":N.N,"highlight":true/false,"sentiment":"..."},...]';
    var stocksSummary = list.map(function(s) { return {ticker:s.ticker,name:s.name,quarter:s.quarter,result:s.result||"",resultPros:(s.resultPros||[]).slice(0,7),resultCons:(s.resultCons||[]).slice(0,7)}; });
    var batchSize = 15; var results = [];
    for (var b = 0; b < stocksSummary.length; b += batchSize) {
      var batch = stocksSummary.slice(b, b + batchSize);
      setRevalProg("Lote " + (Math.floor(b/batchSize)+1) + "...");
      try {
        var resp = await fetch("/api/anthropic", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2048,system:sys,messages:[{role:"user",content:"Avalie:\n"+JSON.stringify(batch)}]})});
        if (!resp.ok) throw new Error("API "+resp.status);
        var d = await resp.json(); var raw = "";
        for (var ci=0;ci<d.content.length;ci++){if(d.content[ci].text)raw+=d.content[ci].text;}
        raw=raw.trim().replace(/```json\s*/g,"").replace(/```\s*/g,"");
        var si=raw.indexOf("[");var ei=raw.lastIndexOf("]");
        if(si>=0&&ei>si)raw=raw.slice(si,ei+1);
        results=results.concat(JSON.parse(raw));
      } catch(err){console.error(err);}
    }
    if (results.length > 0) {
      setData(function(prev){var u={};Object.keys(prev).forEach(function(k){u[k]=prev[k].slice();});var pList=u[portfolio]||[];
        for(var ri=0;ri<results.length;ri++){var r=results[ri];for(var pi=0;pi<pList.length;pi++){if(pList[pi].ticker===r.ticker){pList[pi].prevRankScore=pList[pi].rankScore||null;pList[pi].rankScore=typeof r.rankScore==="number"?r.rankScore:parseFloat(r.rankScore)||5;pList[pi].highlight=!!r.highlight;if(r.sentiment)pList[pi].sentiment=r.sentiment;pList[pi].lastUpdated=new Date().toISOString().slice(0,10);break;}}}
        u[portfolio]=pList;return u;});
      notify(results.length+" ativos reavaliados!");
    }
    setRevalLoad(false);setRevalProg("");
  }

  var stocks=(data[tab]||[]).filter(function(s){var mq=!search||s.ticker.toLowerCase().indexOf(search.toLowerCase())>=0||s.name.toLowerCase().indexOf(search.toLowerCase())>=0;var ms=sf==="all"||s.sentiment===sf;var mh=!hl||s.highlight;return mq&&ms&&mh;});
  if(tab==="Internacional"){var subT=INTL_SUBS[isub]||[];stocks=stocks.filter(function(s){return subT.indexOf(s.ticker)>=0||s.intlSub===isub;});}
  var hasRanks=stocks.some(function(s){return typeof s.rankScore==="number";});
  if(hasRanks)stocks=stocks.slice().sort(function(a,b){return(b.rankScore||0)-(a.rankScore||0);});
  stocks=stocks.map(function(s,i){var c=Object.assign({},s);if(hasRanks)c._rank=i+1;return c;});
  var all=[].concat(data.Dividendos||[],data.Valor||[],data["Small Caps"]||[],data.Internacional||[]);
  var stats=[{l:"Total",v:all.length,c:"#DC2626"},{l:"Positivos",v:all.filter(function(s){return s.sentiment==="positive";}).length,c:"#4ade80"},{l:"Neutros",v:all.filter(function(s){return s.sentiment==="neutral";}).length,c:"#94a3b8"},{l:"Negativos",v:all.filter(function(s){return s.sentiment==="negative";}).length,c:"#f87171"}];

  // Pillar configs
  var pillarItems = {
    research: [{id:"teses",label:"Teses & Resultados"},{id:"carteiras",label:"Carteiras Suno"},{id:"macro",label:"Macro & Viés"}],
    consultoria: [{id:"recomendacoes",label:"Recomendações"},{id:"reuniao",label:"Preparo de Reunião"}],
    clientes: [{id:"perfis",label:"Perfis & JB"},{id:"panorama",label:"Panorama de Resultados"},{id:"config",label:"Configurações"}]
  };
  var pillarColors = {research:"#991b1b",consultoria:"#DC2626",clientes:"#ef4444"};
  var pillarLabels = {research:"Research",consultoria:"Consultoria",clientes:"Clientes"};

  return(
    <div style={{minHeight:"100vh",background:"#09090b",color:"#e2e8f0",fontFamily:"system-ui,-apple-system,sans-serif"}} onClick={function(){setOpenDropdown(null);}}>
      {notif&&<div style={{position:"fixed",top:"14px",right:"14px",zIndex:1000,padding:"10px 18px",borderRadius:"8px",background:notif.type==="err"?"#DC2626":"#16a34a",color:"#fff",fontWeight:600,fontSize:"12px",boxShadow:"0 6px 24px rgba(0,0,0,0.5)"}}>{notif.msg}</div>}

      {/* ═══ HEADER ═══ */}
      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"linear-gradient(180deg, rgba(220,38,38,0.04) 0%, transparent 100%)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",flexShrink:0}} onClick={function(e){e.stopPropagation();nav("research","teses");}}>
            <div style={{width:"32px",height:"32px",borderRadius:"8px",background:"linear-gradient(135deg, #DC2626 0%, #991b1b 100%)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(220,38,38,0.3)",flexShrink:0}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
            <div><h1 style={{margin:0,fontSize:"16px",fontWeight:800,color:"#fff"}}>Suno <span style={{color:"#DC2626"}}>Advisory</span> Hub</h1></div>
          </div>

          {/* Navigation pillars */}
          <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
            {["research","consultoria","clientes"].map(function(pKey){
              var isActive = pilar === pKey;
              var color = pillarColors[pKey];
              var items = pillarItems[pKey];
              var isOpen = openDropdown === pKey;
              return <div key={pKey} style={{position:"relative"}}>
                <button onClick={function(e){e.stopPropagation();setOpenDropdown(isOpen?null:pKey);}} style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid "+(isActive?color+"55":"rgba(255,255,255,0.06)"),cursor:"pointer",background:isActive?color+"18":"transparent",color:isActive?color:"rgba(255,255,255,0.4)",fontWeight:700,fontSize:"12px",display:"flex",alignItems:"center",gap:"4px"}}>
                  {pillarLabels[pKey]}
                  <span style={{fontSize:"8px",opacity:0.5}}>▾</span>
                </button>
                {isOpen&&<div style={{position:"absolute",top:"100%",left:0,marginTop:"4px",background:"#1a1a1a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"4px",minWidth:"180px",zIndex:100,boxShadow:"0 8px 30px rgba(0,0,0,0.5)"}}>
                  {items.map(function(item){
                    var itemActive = pilar===pKey && page===item.id;
                    return <button key={item.id} onClick={function(e){e.stopPropagation();nav(pKey,item.id);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",borderRadius:"6px",border:"none",cursor:"pointer",background:itemActive?color+"22":"transparent",color:itemActive?color:"rgba(255,255,255,0.6)",fontSize:"11px",fontWeight:itemActive?700:500}}>{item.label}</button>;
                  })}
                </div>}
              </div>;
            })}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div>
        {/* RESEARCH > TESES */}
        {pilar==="research"&&page==="teses"&&(<div>
          <div style={{padding:"12px 24px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>{stats.map(function(s){return <div key={s.l} style={{background:"#111",borderRadius:"10px",padding:"8px 14px",border:"1px solid rgba(255,255,255,0.05)",flex:1,minWidth:"70px",textAlign:"center"}}><div style={{fontSize:"18px",fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:"8px",color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>{s.l}</div></div>;})}</div>
            {panel&&<AddPanel onAdd={handleAdd} currentData={data}/>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"12px"}}>
              <div style={{display:"flex",gap:"2px"}}>{["Visão Geral","Dividendos","Valor","Small Caps","Internacional"].map(function(t){return <button key={t} onClick={function(){setTab(t);if(t==="Internacional")setIsub("Dollar Income");}} style={{padding:"8px 14px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:700,borderRadius:"7px 7px 0 0",background:tab===t?(t==="Visão Geral"?"rgba(139,92,246,0.9)":"#DC2626"):"transparent",color:tab===t?"#fff":"rgba(255,255,255,0.3)"}}>{t}{t!=="Visão Geral"&&<span style={{marginLeft:"4px",fontSize:"9px",padding:"1px 5px",borderRadius:"5px",background:tab===t?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.04)"}}>{(data[t]||[]).length}</span>}</button>;})}</div>
              <button onClick={function(){setPanel(!panel);}} style={{padding:"6px 14px",borderRadius:"7px",border:"none",cursor:"pointer",background:panel?"rgba(255,255,255,0.07)":"#DC2626",color:"#fff",fontWeight:700,fontSize:"10px"}}>{panel?"Fechar":"+ Adicionar"}</button>
            </div>
          </div>
          {tab==="Internacional"&&(<div style={{padding:"0 24px",background:"rgba(220,38,38,0.02)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><div style={{display:"flex",gap:"2px",paddingTop:"6px"}}>{["Dollar Income","Hidden Value","Great Companies"].map(function(sub){var cnt=(data.Internacional||[]).filter(function(s){return(INTL_SUBS[sub]||[]).indexOf(s.ticker)>=0||s.intlSub===sub;}).length;return <button key={sub} onClick={function(){setIsub(sub);}} style={{padding:"7px 14px",border:"none",cursor:"pointer",fontSize:"10px",fontWeight:700,borderRadius:"5px 5px 0 0",background:isub===sub?"rgba(220,38,38,0.12)":"transparent",color:isub===sub?"#DC2626":"rgba(255,255,255,0.25)",borderBottom:isub===sub?"2px solid #DC2626":"2px solid transparent"}}>{sub}<span style={{marginLeft:"4px",fontSize:"9px"}}>{cnt}</span></button>;})}</div></div>)}
          {tab!=="Visão Geral"&&(<div style={{padding:"10px 24px",display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"}}><input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Buscar..." style={{padding:"7px 12px",borderRadius:"7px",border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)",color:"#e2e8f0",fontSize:"11px",outline:"none",width:"180px"}}/>{["all","positive","neutral","negative"].map(function(s){var lb={all:"Todos",positive:"Positivos",neutral:"Neutros",negative:"Negativos"};return <button key={s} onClick={function(){setSf(s);}} style={{padding:"5px 10px",borderRadius:"14px",border:"none",cursor:"pointer",fontSize:"10px",fontWeight:600,background:sf===s?(s==="all"?"#DC2626":"rgba(255,255,255,0.08)"):"rgba(255,255,255,0.03)",color:sf===s?(s==="all"?"#fff":s==="positive"?"#4ade80":s==="neutral"?"#94a3b8":"#f87171"):"rgba(255,255,255,0.3)"}}>{lb[s]}</button>;})}<button onClick={function(){setHl(!hl);}} style={{padding:"5px 10px",borderRadius:"14px",border:"none",cursor:"pointer",fontSize:"10px",fontWeight:600,background:hl?"rgba(251,191,36,0.12)":"rgba(255,255,255,0.03)",color:hl?"#fbbf24":"rgba(255,255,255,0.3)"}}>★ Destaques</button><button onClick={handleReeval} disabled={revalLoad} style={{padding:"5px 10px",borderRadius:"14px",border:"none",cursor:revalLoad?"wait":"pointer",fontSize:"10px",fontWeight:600,background:"rgba(139,92,246,0.1)",color:"#a78bfa",marginLeft:"auto"}}>{revalLoad?"Avaliando...":"Reavaliar"}</button></div>)}
          {revalProg&&<div style={{padding:"6px 24px"}}><div style={{fontSize:"10px",color:"#a78bfa",padding:"6px 10px",background:"rgba(139,92,246,0.05)",borderRadius:"6px"}}>{revalProg}</div></div>}
          <div style={{padding:"0 24px 24px"}}>{tab==="Visão Geral"?(<div>
            {(function(){
              var ranked=all.filter(function(s){return typeof s.rankScore==="number";}).slice();ranked.sort(function(a,b){return(b.rankScore||0)-(a.rankScore||0);});
              var top10=ranked.slice(0,10);var bottom10=ranked.slice(-10).reverse();
              function findPort(ticker){var ports=["Dividendos","Valor","Small Caps","Internacional"];for(var i=0;i<ports.length;i++){var l=data[ports[i]]||[];for(var j=0;j<l.length;j++){if(l[j].ticker===ticker)return ports[i];}}return"";}
              var rowS={display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)"};
              var scCol=function(sc){return sc>=8?"#4ade80":sc>=5?"#fbbf24":"#f87171";};
              function renderRow(s,i,isTop){var port=findPort(s.ticker);var sc=s.rankScore||0;var delta=(typeof s.prevRankScore==="number")?(sc-s.prevRankScore):null;var showD=delta!==null&&Math.abs(delta)>=1.5;
                return <div key={s.ticker} style={rowS}><div style={{display:"flex",alignItems:"center",gap:"12px"}}><div style={{fontSize:"14px",fontWeight:800,color:isTop?"rgba(74,222,128,0.6)":"rgba(248,113,113,0.6)",width:"28px",textAlign:"center"}}>#{i+1}</div><div><div style={{display:"flex",alignItems:"center",gap:"6px"}}><span style={{fontWeight:700,fontSize:"13px",color:"#f1f5f9"}}>{s.ticker}</span>{s.highlight&&<span style={{color:"#DC2626",fontSize:"12px"}}>★</span>}<span style={{fontSize:"10px",color:"rgba(255,255,255,0.25)",padding:"1px 6px",borderRadius:"8px",background:"rgba(255,255,255,0.04)"}}>{port}</span></div><div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)",marginTop:"1px"}}>{s.name} — {s.quarter}</div></div></div><div style={{display:"flex",alignItems:"center",gap:"6px"}}>{showD&&<div style={{fontSize:"9px",fontWeight:800,color:delta>0?"#4ade80":"#f87171"}}>{delta>0?"▲":"▼"}{Math.abs(delta).toFixed(1)}</div>}<div style={{fontSize:"14px",fontWeight:800,color:scCol(sc),minWidth:"36px",textAlign:"right"}}>{sc.toFixed(1)}</div><SentimentBadge sentiment={s.sentiment}/></div></div>;}
              return <div>
                <div style={{background:"#111",borderRadius:"12px",overflow:"hidden",border:"1px solid rgba(74,222,128,0.15)",marginBottom:"12px"}}><div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><span style={{fontSize:"10px",fontWeight:700,color:"#4ade80",textTransform:"uppercase",letterSpacing:"1.5px"}}>▲ Top 10</span></div>{top10.map(function(s,i){return renderRow(s,i,true);})}</div>
                <div style={{background:"#111",borderRadius:"12px",overflow:"hidden",border:"1px solid rgba(248,113,113,0.15)"}}><div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><span style={{fontSize:"10px",fontWeight:700,color:"#f87171",textTransform:"uppercase",letterSpacing:"1.5px"}}>▼ Bottom 10</span></div>{bottom10.map(function(s,i){return renderRow(s,i,false);})}</div>
              </div>;
            })()}
          </div>):(<div>{stocks.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,0.18)",fontSize:"12px"}}>Nenhum ativo encontrado.</div>}{stocks.map(function(s){return <StockCard key={s.ticker} stock={s} onDelete={handleDel}/>;})}</div>)}</div>
        </div>)}

        {/* RESEARCH > CARTEIRAS */}
        {pilar==="research"&&page==="carteiras"&&<CarteirasModal onClose={function(){nav("research","teses");}} inline={true}/>}

        {/* RESEARCH > MACRO */}
        {pilar==="research"&&page==="macro"&&<MacroModal onClose={function(){nav("research","teses");}} inline={true}/>}

        {/* CONSULTORIA > RECOMENDAÇÕES */}
        {pilar==="consultoria"&&page==="recomendacoes"&&<ConsultiveReportModal data={data} onClose={function(){nav("research","teses");}} inline={true}/>}

        {/* CONSULTORIA > REUNIÃO */}
        {pilar==="consultoria"&&page==="reuniao"&&<MeetingPrepModal data={data} onClose={function(){nav("research","teses");}} inline={true}/>}

        {/* CLIENTES > PERFIS */}
        {pilar==="clientes"&&page==="perfis"&&<ClientProfilesModal onClose={function(){nav("research","teses");}} inline={true}/>}

        {/* CLIENTES > PANORAMA */}
        {pilar==="clientes"&&page==="panorama"&&<ReportModal data={data} onClose={function(){nav("clientes","panorama");}} inline={true}/>}

        {/* CLIENTES > CONFIG */}
        {pilar==="clientes"&&page==="config"&&(<div style={{padding:"24px"}}>
          <div style={{fontSize:"16px",fontWeight:800,color:"#fff",marginBottom:"16px"}}>Configurações</div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <button onClick={function(){if(confirm("Resetar dados?")){try{localStorage.removeItem("tt-v7");}catch(e){}setData(makeData());notify("Dados resetados!");}}} style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(220,38,38,0.2)",background:"transparent",color:"rgba(220,38,38,0.6)",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>Resetar Dados</button>
            <button onClick={function(){var b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="advisory-hub-backup.json";a.click();}} style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.4)",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>Exportar JSON</button>
            <label style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(34,197,94,0.2)",background:"transparent",color:"rgba(34,197,94,0.6)",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>Importar JSON<input type="file" accept=".json" style={{display:"none"}} onChange={function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var d=JSON.parse(r.result);if(d.Dividendos||d.Valor){setData(migrateData(d));notify("Importado!");}else notify("JSON inválido","err");}catch(er){notify("Erro: "+er.message,"err");}};r.readAsText(f);}}/></label>
          </div>
        </div>)}
      </div>
    </div>
  );
}
