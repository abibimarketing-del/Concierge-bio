import { useState } from "react";
import { Sparkles, ArrowRight, ExternalLink, RotateCcw } from "lucide-react";

// ────────────────────────────────────────────────────────────
// CATÁLOGO — versão SIMPLES (sem chamada de IA a cada visita).
// A recomendação usa regras fixas por categoria, então funciona
// direto, sem custo de API e sem depender de internet além do link.
//
// Marcas confirmadas por categoria. As marcas Saint Germain, True,
// Tia Sonia e You Sense ainda não entraram na lógica do quiz porque
// preciso que você confirme categoria + descrição de cada uma —
// elas já aparecem na lista "ver todos os links" lá embaixo.
// ────────────────────────────────────────────────────────────
const CATALOGO = {
  beleza: [
    {
      nome: "Oceane",
      descricao: "Maquiagem para o dia a dia.",
      link: "https://www.oceane.com.br/?utmi_pc=AchadosdaAlexandra",
      cupom: "ACHADOSDAALEXANDRA",
    },
    {
      nome: "Pink Cheeks",
      descricao: "Maquiagem e protetor solar de alta performance.",
      link: "https://pinkcheeks.com.br/",
      cupom: "PNK-ALEXANDRAABIBI",
    },
    {
      nome: "Braé",
      descricao: "Cuidados capilares — condicionador, óleo e finalizadores.",
      link: "https://www.brae.com.br/?parceiro=Alexandra",
      cupom: "ALEXANDRA",
    },
    {
      nome: "New Hair",
      descricao: "Mega hair e extensões capilares.",
      link: "https://newhair.com.br/?influencer=1?utm_source=instagram&utm_medium={{cupom}}_inbazz&utm_campaign=creators&utm_content=stories",
      cupom: "",
    },
    {
      nome: "You Sense",
      descricao: "Maquiagem — gloss e brow lamination para deixar a sobrancelha em ordem.",
      link: "https://yousense.com.br/",
      cupom: "Alexandra",
    },
  ],
  estilo: [
    {
      nome: "Go Case",
      descricao: "Capinhas e acessórios personalizados para celular.",
      link: "https://www.gocase.com.br/",
      cupom: "ALEABIBI",
    },
    {
      nome: "Toda Up",
      descricao: "Moda íntima e soluções de sustentação.",
      link: "https://todaup.com/",
      cupom: "", // sem cupom próprio por enquanto — confirmar com a marca se dá pra gerar um
    },
    {
      nome: "Saint Germain",
      descricao: "Relógios e óculos.",
      link: "https://www.saintgermainbrand.com.br/",
      cupom: "A-ABIBISGPA",
    },
  ],
  alimentos: [
    {
      nome: "Tia Sônia",
      descricao: "Granolas, cookies e alimentação saudável.",
      link: "https://www.tiasonia.com.br/",
      cupom: "TSALEXANDRA",
    },
  ],
  casa: [
    {
      nome: "Hoomy",
      descricao: "Itens para casa — toalhas, lençóis e roupa de cama.",
      link: "https://hoomy.com.br",
      cupom: "ABIBI",
    },
  ],
  "bem-estar": [
    {
      nome: "SuperCoffee",
      descricao: "Café funcional, energia para o dia corrido.",
      link: "https://www.supercoffee.com.br/",
      cupom: "ABIBI",
    },
    {
      nome: "Always Fit",
      descricao: "Moda fitness.",
      link: "https://alwaysfit.com.br/?utm_source=insta&utm_medium=cupom&utm_campaign=influ",
      cupom: "ALEABIBI",
    },
    {
      nome: "True",
      descricao: "Suplementos.",
      link: "https://vivatrue.com.br/",
      cupom: "TRUEALEXANDRABIBI",
    },
  ],
};

// Marcas sem link de compra ainda — precisam do link real pra funcionarem
// de verdade no botão "Comprar agora" (aparecem no quiz, mas sem link
// mostram o aviso "falta o link" até você me mandar).

const VITRINE_TIKTOK = {
  nome: "Vitrine TikTok Shop",
  descricao: "Confira a vitrine de Alexandra Abibi no TikTok!",
  link: "https://vt.tiktok.com/ZS9kXkpaSpkpk-jrO0c/",
};

const PERGUNTAS = [
  {
    id: "categoria",
    texto: "O que você está buscando hoje?",
    opcoes: [
      { label: "Cuidar da beleza (pele, cabelo, make)", valor: "beleza" },
      { label: "Renovar o estilo", valor: "estilo" },
      { label: "Alimentação saudável", valor: "alimentos" },
      { label: "Coisas pra casa", valor: "casa" },
      { label: "Energia e bem-estar", valor: "bem-estar" },
    ],
  },
  {
    id: "prioridade",
    texto: "O que mais pesa na sua escolha agora?",
    opcoes: [
      { label: "Praticidade", valor: "praticidade" },
      { label: "Economia", valor: "economia" },
      { label: "Qualidade", valor: "qualidade" },
      { label: "Novidade", valor: "novidade" },
    ],
  },
  {
    id: "fase",
    texto: "Em que fase você está?",
    opcoes: [
      { label: "Gestante", valor: "gestante" },
      { label: "Mãe de bebê ou criança pequena", valor: "kids" },
      { label: "Mãe de crianças maiores", valor: "kids-grande" },
      { label: "Sem filhos por enquanto", valor: "sem-filhos" },
    ],
  },
];

const FRASES_MOTIVO = {
  praticidade: "sei que seu tempo é curto, então escolhi algo prático pro seu dia a dia",
  economia: "separei essa opção pensando no seu bolso, com o cupom aplicado",
  qualidade: "essa é uma das marcas que eu mais confio pela qualidade",
  novidade: "sei que você gosta de novidade, então trouxe algo diferente pra você experimentar",
};

const PALETTE = {
  bg: "#F1E9DD",
  ink: "#1E1B18",
  card: "#FFFFFF",
  muted: "#8A8074",
  line: "#E2D7C6",
};

function escolherProduto(respostas) {
  const lista = CATALOGO[respostas.categoria] || CATALOGO.beleza;
  // regra fixa simples: usa a resposta de "fase" pra variar a escolha
  // dentro da categoria, sem precisar de IA.
  const indice =
    respostas.fase === "gestante" || respostas.fase === "kids" ? 0 : 1;
  const produto = lista[indice] || lista[0];
  return { produto, generico: false };
}

export default function ConciergeBio() {
  const [step, setStep] = useState(-1);
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);

  function escolher(valor) {
    const novasRespostas = { ...respostas, [PERGUNTAS[step].id]: valor };
    setRespostas(novasRespostas);
    if (step + 1 < PERGUNTAS.length) {
      setStep(step + 1);
    } else {
      setResultado(escolherProduto(novasRespostas));
    }
  }

  function recomecar() {
    setStep(-1);
    setRespostas({});
    setResultado(null);
  }

  const todasAsMarcas = Object.values(CATALOGO).flat();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PALETTE.bg,
        color: PALETTE.ink,
        fontFamily: "Georgia, 'Times New Roman', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 20px 56px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: PALETTE.muted,
            marginBottom: 6,
          }}
        >
          @alexandra.abibi
        </div>
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
            color: PALETTE.ink,
            margin: "0 0 14px",
          }}
        >
          Maravilhosa, aqui você encontra todos os meus cupons de desconto 💛
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 400, margin: 0, lineHeight: 1.25 }}>
          seu <em style={{ fontStyle: "italic" }}>concierge</em> de produtos
        </h1>
      </div>

      {step === -1 && !resultado && (
        <div style={{ maxWidth: 380, textAlign: "center" }}>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, lineHeight: 1.6, color: PALETTE.muted }}>
            Três perguntas rápidas e eu te mostro exatamente o produto certo pra você.
          </p>
          <button
            onClick={() => setStep(0)}
            style={{
              marginTop: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: PALETTE.ink,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "14px 28px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Sparkles size={16} /> Começar <ArrowRight size={16} />
          </button>

          <a
            href={VITRINE_TIKTOK.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: `1px solid ${PALETTE.line}`,
              color: PALETTE.ink,
              borderRadius: 999,
              padding: "13px 20px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Ver vitrine no TikTok Shop <ExternalLink size={14} />
          </a>
        </div>
      )}

      {step >= 0 && !resultado && (
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 22 }}>
            {PERGUNTAS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 4,
                  borderRadius: 2,
                  background: i <= step ? PALETTE.ink : PALETTE.line,
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: 19, textAlign: "center", marginBottom: 18 }}>
            {PERGUNTAS[step].texto}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PERGUNTAS[step].opcoes.map((opcao) => (
              <button
                key={opcao.valor}
                onClick={() => escolher(opcao.valor)}
                style={{
                  background: PALETTE.card,
                  border: `1px solid ${PALETTE.line}`,
                  borderRadius: 14,
                  padding: "14px 18px",
                  textAlign: "left",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 15,
                  cursor: "pointer",
                  color: PALETTE.ink,
                }}
              >
                {opcao.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {resultado && (
        <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: PALETTE.muted,
              marginBottom: 10,
            }}
          >
            recomendado pra você
          </div>
          <div
            style={{
              background: PALETTE.card,
              border: `1px solid ${PALETTE.line}`,
              borderRadius: 18,
              padding: 22,
              textAlign: "left",
            }}
          >
            <h2 style={{ fontSize: 22, margin: "0 0 8px" }}>{resultado.produto.nome}</h2>
            <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, lineHeight: 1.55, color: "#4a423e" }}>
              {resultado.produto.descricao}
              {!resultado.generico && FRASES_MOTIVO[respostas.prioridade] && (
                <> — {FRASES_MOTIVO[respostas.prioridade]}.</>
              )}
            </p>
            {resultado.produto.link ? (
              <a
                href={resultado.produto.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: PALETTE.ink,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "13px 20px",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Comprar agora <ExternalLink size={15} />
              </a>
            ) : (
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: PALETTE.muted, marginTop: 12 }}>
                (falta o link dessa marca — me manda que eu completo)
              </p>
            )}
            {resultado.produto.cupom && (
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, textAlign: "center", marginTop: 8, color: PALETTE.muted }}>
                cupom <strong>{resultado.produto.cupom}</strong>
              </p>
            )}
          </div>
          <button
            onClick={recomecar}
            style={{
              marginTop: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "system-ui, sans-serif",
              background: "none",
              border: "none",
              color: PALETTE.muted,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={13} /> refazer perguntas
          </button>
        </div>
      )}

      <div style={{ marginTop: 48, width: "100%", maxWidth: 380 }}>
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: PALETTE.muted,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          ver todos os links
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {todasAsMarcas.map((p) => (
            <a
              key={p.nome}
              href={p.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 13,
                color: PALETTE.ink,
                background: "#EADFCE",
                borderRadius: 10,
                padding: "9px 14px",
                textDecoration: "none",
                display: "flex",
                justifyContent: "space-between",
                opacity: p.link ? 1 : 0.55,
              }}
            >
              <span>{p.nome}</span>
              <span style={{ color: PALETTE.muted }}>{p.cupom || ""}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
