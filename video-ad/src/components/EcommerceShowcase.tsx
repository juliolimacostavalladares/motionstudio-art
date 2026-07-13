import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Easing,
  interpolateColors,
} from "remotion";

interface EcommerceShowcaseProps {}

export const EcommerceShowcase: React.FC<EcommerceShowcaseProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame;

  // ─── 1. Câmera Cinemática (Zoom e Movimento) ──────────────────────────────
  const { width, height } = useVideoConfig();
  const isVertical = width < height;

  // Papel Quadriculado (0 a 100): Câmera aproximada focado no centro-esquerdo.
  // Pullback para ver o Ecommerce Inteiro: frame 230 a 290.
  const zoomSpring = spring({
    frame: localFrame - 230,
    fps,
    config: { mass: 1.2, damping: 20, stiffness: 45 },
  });

  const startScale = isVertical ? 1.70 : 1.48;
  const endScale = isVertical ? 1.22 : 0.90;

  const cameraScale = interpolate(
    zoomSpring,
    [0, 1],
    [startScale, endScale]
  );

  const panXSpring = spring({
    frame: localFrame - 230,
    fps,
    config: { mass: 1.2, damping: 20, stiffness: 45 },
  });
  const panXStart = isVertical ? -3 : -8;
  const cameraPanX = interpolate(panXSpring, [0, 1], [panXStart, 0]);

  const panYSpring = spring({
    frame: localFrame - 230,
    fps,
    config: { mass: 1.2, damping: 20, stiffness: 45 },
  });
  const panYStart = isVertical ? -4 : -2;
  const cameraPanY = interpolate(panYSpring, [0, 1], [panYStart, 0]);

  // Micro-drift constante para dar vida
  const cameraDriftX = Math.sin(localFrame * 0.02) * 0.8;
  const cameraDriftY = Math.cos(localFrame * 0.02) * 0.5;

  // ─── 2. Flip 3D (Rascunho -> Loja Real) ───────────────────────────────────
  // Clique no papel aos 95 frames. Flip inicia no frame 100 e estabiliza no 140.
  const flipSpring = spring({
    frame: localFrame - 100,
    fps,
    config: { mass: 1.4, damping: 22, stiffness: 40 },
  });
  const flipRotationY = interpolate(flipSpring, [0, 1], [0, 180]);

  // Dynamic 3D lift-off mechanics during the flip
  const liftProgress = Math.sin(flipSpring * Math.PI); // Peaks at 1 in the middle
  const flipScale = 1 + liftProgress * 0.12; // scales up by 12% in the middle
  const flipTranslateZ = liftProgress * 95; // lifts 95px up in Z space

  // ─── 3. Rotação Cinemática de Perspectiva (Cena 3) ─────────────────────────
  // No pullback (frame 235), o mockup inclina para revelar os cards laterais.
  const perspectiveSpring = spring({
    frame: localFrame - 235,
    fps,
    config: { mass: 1.5, damping: 22, stiffness: 35 },
  });
  const rotateX = interpolate(perspectiveSpring, [0, 1], [0, 14]);
  const rotateY = interpolate(perspectiveSpring, [0, 1], [0, -18]);
  const rotateZ = interpolate(perspectiveSpring, [0, 1], [0, 2]);

  // ─── 4. Linha do Tempo das Interações (Frames Locais) ──────────────────────
  // localFrame 140: E-commerce ativo (Listagem de produtos).
  // localFrame 140 a 220: Scroll inercial suave.
  // localFrame 230: Mouse vai até o headphone azul.
  // localFrame 250: Clique no headphone azul -> Transição para a página de detalhes.
  // localFrame 330: Mouse vai até o botão "Adicionar ao Carrinho" (Add to Cart).
  // localFrame 350: Clique no botão "Add to Cart" -> Animação de loading no botão.
  // localFrame 375: Bolinha voa do botão até a sacola no topo -> Wobble da sacola.
  // localFrame 450: Mouse viaja até o carrinho para finalizar a compra.
  // localFrame 475: Clique na sacola -> Transição para a tela de Checkout/Sucesso.
  // localFrame 475 a 540: Confetes explodem na tela de sucesso.

  // ─── 5. Posições do Mouse (Precedidas por curva de Bézier) ─────────────────
  const mouseX = interpolate(
    localFrame,
    [0, 25, 95, 115, 215, 235, 250, 310, 330, 350, 430, 450, 475, 520],
    [-240, -220, 0, -220, -220, -120, -120, -90, -90, -90, 185, 185, 185, 320],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 1, 0.4, 1), // custom ease-out deceleration
    }
  );

  const mouseY = interpolate(
    localFrame,
    [0, 25, 95, 115, 215, 235, 250, 310, 330, 350, 430, 450, 475, 520],
    [300, 250, 10, 220, 220, -245, -245, 80, 80, 80, -170, -170, -170, 285],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 1, 0.4, 1),
    }
  );

  // Click Ripples (com física de mola)
  const click1Spring = spring({ frame: localFrame - 95, fps, config: { mass: 0.5, damping: 12, stiffness: 140 } });
  const click1Scale = interpolate(click1Spring, [0, 1], [0.2, 1.8], { extrapolateRight: "clamp" });
  const click1Opacity = interpolate(click1Spring, [0, 1], [1, 0], { extrapolateRight: "clamp" });

  const click2Spring = spring({ frame: localFrame - 250, fps, config: { mass: 0.5, damping: 12, stiffness: 140 } });
  const click2Scale = interpolate(click2Spring, [0, 1], [0.2, 1.8], { extrapolateRight: "clamp" });
  const click2Opacity = interpolate(click2Spring, [0, 1], [1, 0], { extrapolateRight: "clamp" });

  const click3Spring = spring({ frame: localFrame - 350, fps, config: { mass: 0.5, damping: 12, stiffness: 140 } });
  const click3Scale = interpolate(click3Spring, [0, 1], [0.2, 1.8], { extrapolateRight: "clamp" });
  const click3Opacity = interpolate(click3Spring, [0, 1], [1, 0], { extrapolateRight: "clamp" });

  const click4Spring = spring({ frame: localFrame - 475, fps, config: { mass: 0.5, damping: 12, stiffness: 140 } });
  const click4Scale = interpolate(click4Spring, [0, 1], [0.2, 1.8], { extrapolateRight: "clamp" });
  const click4Opacity = interpolate(click4Spring, [0, 1], [1, 0], { extrapolateRight: "clamp" });

  // ─── 6. Estados e Transições do E-commerce ────────────────────────────────
  // Scroll inercial suave da listagem (frames 140 a 220)
  const scrollSpring = spring({
    frame: localFrame - 140,
    fps,
    config: { mass: 1.5, damping: 24, stiffness: 35 },
  });
  const scrollY = interpolate(scrollSpring, [0, 1], [0, -290]);

  // Transição de tela 1: Grid -> Detalhe do Produto (Clica no 250, página entra no 260)
  const pageTransitionSpring = spring({
    frame: localFrame - 250,
    fps,
    config: { mass: 0.9, damping: 15, stiffness: 85 },
  });
  const pageTransition = pageTransitionSpring; // 0 = Grid, 1 = Detalhe do Produto

  // Staggered springs for Detail Page panels (Scene 3 entrance)
  const leftPanelSpring = spring({
    frame: localFrame - 258,
    fps,
    config: { mass: 0.8, damping: 13, stiffness: 100 },
  });
  const rightPanelSpring = spring({
    frame: localFrame - 252,
    fps,
    config: { mass: 0.8, damping: 13, stiffness: 100 },
  });

  // Transição de tela 2: Detalhe -> Sucesso (Clica no 475, página entra no 485)
  const successTransitionSpring = spring({
    frame: localFrame - 475,
    fps,
    config: { mass: 1.0, damping: 16, stiffness: 80 },
  });
  const successTransition = successTransitionSpring; // 0 = Detalhe, 1 = Sucesso

  // Staggered springs for Success Page elements
  const successTitleSpring = spring({
    frame: localFrame - 485,
    fps,
    config: { mass: 0.8, damping: 12, stiffness: 120 },
  });
  const successCardSpring = spring({
    frame: localFrame - 495,
    fps,
    config: { mass: 0.8, damping: 12, stiffness: 120 },
  });

  // Hover do Card do Headphone no Grid (frame 220 a 250)
  const cardHoverScale = interpolate(
    localFrame,
    [215, 230, 250, 260],
    [1, 1.06, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Parallax depth offset for card image during hover
  const cardImageParallax = interpolate(
    localFrame,
    [215, 230, 250, 260],
    [0, -8, -8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Botão "Add to Cart" (frame 350): Loading e depois Adicionado
  const isButtonLoading = localFrame >= 350 && localFrame < 370;
  const isButtonAdded = localFrame >= 370;
  
  // Spring-based button click indentation (scale drop to 0.94 and bounce back)
  const buttonClickSpring = spring({
    frame: localFrame - 350,
    fps,
    config: { mass: 0.4, damping: 8, stiffness: 160 },
  });
  const buttonActiveScale = interpolate(buttonClickSpring, [0, 0.3, 1], [1, 0.94, 1]);

  // Smooth color interpolation for adding to cart
  const buttonColor = interpolateColors(
    localFrame,
    [368, 373],
    ["#111111", "#16a34a"]
  );

  // Configuração de Cores e Fone
  const selectedColorIndex = 0; // Foco total no Headphone Azul original
  const COLORS = [
    { name: "azul", hex: "#2563eb", grad: ["#3b82f6", "#1d4ed8"] },
    { name: "laranja", hex: "#ea580c", grad: ["#f97316", "#c2410c"] },
    { name: "verde", hex: "#16a34a", grad: ["#22c55e", "#15803d"] },
  ];

  // Escala de pulso para a sacola de compras no clique/chegada do item
  const cartPulseSpring = spring({
    frame: localFrame - 395,
    fps,
    config: { mass: 0.6, damping: 10, stiffness: 130 },
  });
  const cartScale = interpolate(cartPulseSpring, [0, 0.5, 1], [1, 1.4, 1], { extrapolateRight: "clamp" });

  // Flutuação vertical contínua do headphone
  const headphoneFloat = Math.sin(localFrame * 0.045) * 6;

  // ─── 7. Micro-Interação: Bolinha voando para o Carrinho ───────────────────
  // A bolinha se solta no frame 370 e pousa no 400.
  const flyProgress = interpolate(
    localFrame,
    [370, 395],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  
  const isFadingFlyBall = localFrame >= 370 && localFrame < 396;
  const flyBallX = interpolate(flyProgress, [0, 1], [-90, 185]);
  const flyBallY = interpolate(flyProgress, [0, 1], [80, -170]) - Math.sin(flyProgress * Math.PI) * 110;

  // Wobble do Carrinho quando a bolinha atinge (frame 395 a 425)
  const cartWobbleProgress = localFrame - 395;
  const cartWobble = cartWobbleProgress > 0 && cartWobbleProgress < 30
    ? Math.sin(cartWobbleProgress * 0.6) * 15 * Math.exp(-cartWobbleProgress * 0.1)
    : 0;

  const hasItemInCart = localFrame >= 395;

  // ─── 8. Animação de Confetes na Tela de Sucesso ────────────────────────────
  const successActive = localFrame >= 485;
  const successTime = localFrame - 485;

  // Checkmark Desenho animado
  const checkmarkDraw = spring({
    frame: successTime - 10,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // ─── 9. Cards Flutuantes da Abertura da Cena 3 (Staggered) ────────────────
  const card1Spring = spring({ frame: localFrame - 250, fps, config: { damping: 14 } });
  const card2Spring = spring({ frame: localFrame - 265, fps, config: { damping: 14 } });
  const card3Spring = spring({ frame: localFrame - 280, fps, config: { damping: 14 } });
  const card4Spring = spring({ frame: localFrame - 295, fps, config: { damping: 14 } });

  const floatOffset = Math.sin(localFrame * 0.035) * 8;
  const floatOffsetInverse = Math.cos(localFrame * 0.035) * 6;

  // Crystalline sweep light transition
  const sweepProgress = interpolate(localFrame, [135, 175], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  // Combined click pulse for cursor (active when any click is recent)
  const activePulse = Math.max(click1Opacity, click2Opacity, click3Opacity, click4Opacity) > 0.01
    ? Math.max(
        click1Spring > 0.01 ? click1Scale : 0,
        click2Spring > 0.01 ? click2Scale : 0,
        click3Spring > 0.01 ? click3Scale : 0,
        click4Spring > 0.01 ? click4Scale : 0
      )
    : 0;

  return (
    <div className="w-full h-full flex justify-center items-center relative overflow-hidden bg-transparent">
      {/* Container de Câmera 3D */}
      <div
        style={{
          transform: `scale(${cameraScale}) translate(${cameraPanX + cameraDriftX}%, ${cameraPanY + cameraDriftY}%)`,
          transformOrigin: "50% 50%",
          perspective: 1500,
        }}
        className="w-full h-full flex justify-center items-center absolute inset-0"
      >
        
        {/* Mockup Central do E-commerce */}
        <div
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + flipRotationY}deg) rotateZ(${rotateZ}deg) scale(${flipScale}) translateZ(${flipTranslateZ}px)`,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            boxShadow: `0 ${45 + liftProgress * 50}px ${95 + liftProgress * 60}px rgba(0,0,0,${0.55 - liftProgress * 0.15})`,
          }}
          className="relative w-[85%] max-w-[620px] aspect-[4/3] rounded-[32px] bg-[#f4f5f0] border-2 border-white/50"
        >
          
          {/* FRONT FACE: Rascunho no Papel Quadriculado Claro Aprovado */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              position: "absolute",
              inset: 0,
              backgroundColor: "#fbfbf8",
              backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            className="w-full h-full rounded-[32px] p-8 flex flex-col justify-between items-center text-neutral-800 overflow-hidden"
          >
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-red-400/30 pointer-events-none" />
            <div className="w-full flex justify-between items-center pl-6 shrink-0 z-10">
              <span className="handwritten text-xs text-neutral-400 tracking-wider">PROJETO E-COMMERCE</span>
              <span className="handwritten text-[10px] text-red-500 font-bold border border-red-300 rounded px-1.5 py-0.5 transform -rotate-3">IDEIA NO PAPEL</span>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center relative z-10 w-full mt-2">
              <svg
                width="140"
                height="140"
                viewBox="0 0 100 100"
                className="text-neutral-400 stroke-current fill-none stroke-[2]"
                strokeDasharray="4 3"
              >
                <path d="M20 50 A 30 30 0 0 1 80 50" />
                <rect x="15" y="45" width="12" height="24" rx="4" />
                <rect x="73" y="45" width="12" height="24" rx="4" />
                <path d="M27 50 L 73 50" strokeDasharray="1 4" />
                <path d="M10 10 L 90 90" strokeWidth="0.5" strokeDasharray="2 2" className="text-neutral-300" />
                <path d="M90 10 L 10 90" strokeWidth="0.5" strokeDasharray="2 2" className="text-neutral-300" />
              </svg>
              <span className="handwritten text-xs text-neutral-500 mt-2">[ Foto do Produto ]</span>
            </div>

            <div className="absolute left-10 top-20 handwritten text-[12px] text-neutral-600 bg-yellow-100/90 border border-yellow-200/50 shadow-md rounded px-2.5 py-1 transform -rotate-6 z-10">
              Checkout travado? 💸
            </div>
            <div className="absolute right-10 top-24 handwritten text-[12px] text-neutral-600 bg-blue-100/90 border border-blue-200/50 shadow-md rounded px-2.5 py-1 transform rotate-6 z-10">
              Sem escala 📈
            </div>
            <div className="absolute left-12 bottom-16 handwritten text-[13px] text-red-600/80 font-bold transform -rotate-12 z-10">
              Loja física fechada? 🔒
            </div>
            <div className="absolute right-12 bottom-20 handwritten text-[12px] text-neutral-600 bg-green-100/90 border border-green-200/50 shadow-md rounded px-2.5 py-1 transform rotate-3 z-10">
              Como vender online? 🤔
            </div>

            <div className="w-full text-center pl-6 shrink-0 z-10">
              <span className="handwritten text-sm text-neutral-500 font-bold block animate-pulse">
                👇 Clique aqui para tirar a ideia do papel
              </span>
            </div>
          </div>

          {/* BACK FACE: E-commerce de Altíssima Fidelidade (React/CSS/Confetes) */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 w-full h-full rounded-[32px] bg-[#f4f5f0] p-5 flex flex-col justify-between overflow-hidden"
          >
            
            {/* Crystalline Light Sweep during flip */}
            {localFrame >= 135 && localFrame <= 175 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 50,
                  background: `linear-gradient(115deg, transparent ${sweepProgress - 30}%, rgba(255,255,255,0.35) ${sweepProgress - 10}%, rgba(255,255,255,0.5) ${sweepProgress}%, rgba(255,255,255,0.35) ${sweepProgress + 10}%, transparent ${sweepProgress + 30}%)`,
                  pointerEvents: "none",
                  borderRadius: "32px",
                }}
              />
            )}
            
            {/* ─── NAVEGAÇÃO SUPERIOR DO E-COMMERCE ─── */}
            <div className="flex justify-between items-center w-full pb-3 border-b border-neutral-300/30 shrink-0 z-20 bg-[#f4f5f0]/80 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <div className="h-5.5 w-5.5 rounded-lg bg-neutral-900 flex items-center justify-center text-[#d4e157] font-bold text-[12px]">
                  N
                </div>
                <span className="font-extrabold text-sm text-neutral-900 tracking-tight">nitec.</span>
              </div>

              {/* Barra de Busca Premium */}
              <div className="h-8 bg-white border border-neutral-200 shadow-sm rounded-full pl-4 pr-1 py-0.5 flex items-center w-[200px]">
                <span className="text-[10px] text-neutral-400 mr-auto">Search products...</span>
                <div className="h-6.5 w-6.5 rounded-full bg-neutral-900 flex items-center justify-center text-white">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Ícones com wobble ao receber produto */}
              <div className="flex items-center gap-3">
                <div 
                  style={{
                    transform: `rotate(${cartWobble}deg)`,
                    transformOrigin: "center top",
                  }}
                  className="relative h-7.5 w-7.5 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center transition-transform duration-75"
                >
                  <svg className="w-4.5 h-4.5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  
                  {hasItemInCart && (
                    <div
                      style={{
                        transform: `scale(${cartScale})`,
                      }}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#2563eb] text-white text-[9px] font-extrabold flex items-center justify-center shadow-lg shadow-blue-500/30"
                    >
                      1
                    </div>
                  )}
                </div>

                <div className="h-7.5 w-7.5 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className="h-7.5 w-7.5 rounded-full bg-neutral-900 overflow-hidden flex items-center justify-center border border-neutral-300 shadow-sm">
                  <div className="h-4.5 w-4.5 rounded-full bg-neutral-600" />
                </div>
              </div>
            </div>

            {/* ─── ELEMENTO DE CONTEÚDO PRINCIPAL (TRANSICIONÁVEL) ─── */}
            <div className="flex-grow relative w-full overflow-hidden mt-4">
              
              {/* TELA A: GRID DE PRODUTOS COM SCROLL ATIVO (pageTransition = 0) */}
              <div
                style={{
                  opacity: 1 - pageTransition,
                  transform: `translateY(${scrollY}px)`,
                  display: pageTransition > 0.99 ? "none" : "flex",
                }}
                className="w-full flex flex-col gap-4 text-left transition-opacity duration-300"
              >
                {/* Hero Banner Grid */}
                <div className="w-full h-[180px] bg-white rounded-3xl p-5 border border-neutral-200/50 relative overflow-hidden flex flex-col justify-between shrink-0 shadow-sm">
                  <div className="max-w-[200px] z-10 flex flex-col justify-between h-full">
                    <div className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[8px] font-bold text-neutral-400 border border-neutral-200/50 w-max">
                      ⚡ Novidades de Som
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-neutral-900 leading-tight">Fone Sequoia Premium</h3>
                      <p className="text-[10px] text-neutral-400 leading-tight mt-1">O som ideal para o seu dia a dia.</p>
                    </div>
                    <span className="text-xs font-bold text-[#2563eb]">$ 299.00</span>
                  </div>
                  <img
                    src={staticFile("product-headphone-blue.jpg")}
                    alt="Sequoia Blue Headphone"
                    style={{ mixBlendMode: "multiply" }}
                    className="absolute right-0 top-0 w-[220px] h-full object-cover pointer-events-none"
                  />
                </div>

                {/* Grid List de Produtos com 4 Imagens Reais (Apple/Google Vibe) */}
                <div className="grid grid-cols-2 gap-4 shrink-0 w-full pb-8">
                  {/* Card 1: Headphone Azul Sequoia (Clicável) */}
                  <div
                    style={{
                      transform: `scale(${cardHoverScale})`,
                      boxShadow: cardHoverScale > 1.01 ? "0 15px 35px rgba(0,0,0,0.1)" : "0 4px 10px rgba(0,0,0,0.02)",
                    }}
                    className="bg-white border border-neutral-200/60 rounded-3xl p-4 flex flex-col justify-between aspect-square transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-full flex-1 relative overflow-hidden rounded-2xl bg-[#f5f5f3]">
                      <img
                        src={staticFile("product-headphone-blue.jpg")}
                        alt="Sequoia Fone"
                        style={{
                          mixBlendMode: "multiply",
                          transform: `translateY(${cardImageParallax}px)`,
                        }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 mt-2">
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">Sequoia Blue Headphone</h4>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[11px] font-extrabold text-[#2563eb]">$299</span>
                        <span
                          style={{
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                          }}
                          className="text-[8px] bg-[#d4e157]/15 text-neutral-800 font-bold px-2 py-0.5 rounded-full border border-[#d4e157]/25 shadow-sm"
                        >Populares</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: X-Bud Earbuds Pro */}
                  <div className="bg-white border border-neutral-200/60 rounded-3xl p-4 flex flex-col justify-between aspect-square shadow-sm">
                    <div className="w-full flex-1 relative overflow-hidden rounded-2xl bg-[#f5f5f3]">
                      <img
                        src={staticFile("product-earbuds-black.jpg")}
                        alt="X-Bud Pro"
                        style={{ mixBlendMode: "multiply" }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 mt-2">
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">X-Bud Air Earbuds</h4>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[11px] font-extrabold text-neutral-900">$149</span>
                        <span className="text-[8px] text-neutral-400">Novidades</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Smartwatch v4 */}
                  <div className="bg-white border border-neutral-200/60 rounded-3xl p-4 flex flex-col justify-between aspect-square shadow-sm">
                    <div className="w-full flex-1 relative overflow-hidden rounded-2xl bg-[#f5f5f3]">
                      <img
                        src={staticFile("product-smartwatch.jpg")}
                        alt="Sequoia Smartwatch"
                        style={{ mixBlendMode: "multiply" }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 mt-2">
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">Sequoia Active Watch</h4>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[11px] font-extrabold text-neutral-900">$199</span>
                        <span
                          style={{
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                          }}
                          className="text-[8px] bg-blue-500/10 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-500/20 shadow-sm"
                        >Tech</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Nebula VR Vision */}
                  <div className="bg-white border border-neutral-200/60 rounded-3xl p-4 flex flex-col justify-between aspect-square shadow-sm">
                    <div className="w-full flex-1 relative overflow-hidden rounded-2xl bg-[#f5f5f3]">
                      <img
                        src={staticFile("product-vr-headset.jpg")}
                        alt="Nebula VR Headset"
                        style={{ mixBlendMode: "multiply" }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">Nebula VR Vision</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[11px] font-extrabold text-neutral-900">$499</span>
                        <span
                          style={{
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                          }}
                          className="text-[8px] bg-[#ff2e93]/10 text-[#ff2e93] font-bold px-2 py-0.5 rounded-full border border-[#ff2e93]/20 shadow-sm"
                        >Imersivo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TELA B: PÁGINA DETALHADA DO PRODUTO (pageTransition > 0, successTransition = 0) */}
              <div
                style={{
                  opacity: pageTransition * (1 - successTransition),
                  display: pageTransition < 0.01 || successTransition > 0.99 ? "none" : "flex",
                }}
                className="absolute inset-0 w-full h-full flex gap-5 text-left transition-all duration-300"
              >
                {/* Detalhes do Produto (Left Panel with stagger) */}
                <div
                  style={{
                    transform: `translateY(${interpolate(leftPanelSpring, [0, 1], [30, 0])}px) scale(${interpolate(leftPanelSpring, [0, 1], [0.95, 1])})`,
                    opacity: leftPanelSpring,
                  }}
                  className="w-[52%] flex flex-col justify-between h-full bg-white border border-neutral-200/50 rounded-3xl p-6 shadow-sm"
                >
                  <div>
                    <span
                      style={{
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                      className="text-[8px] bg-blue-500/10 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-500/20 shadow-sm"
                    >
                      Best Seller
                    </span>
                    <h2 className="text-[20px] font-black text-neutral-900 leading-tight mt-3">
                      Sequoia Premium Wireless Headphone
                    </h2>
                    <p className="text-[10px] text-neutral-400 leading-relaxed mt-2">
                      Experiência sonora pura com cancelamento ativo de ruído inteligente, drivers customizados e bateria de 40 horas.
                    </p>
                    
                    {/* Preço */}
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-lg font-black text-[#2563eb]">$ 299.00</span>
                      <span className="text-[10px] text-neutral-400 line-through">$ 349.00</span>
                    </div>

                    {/* Popular Colors */}
                    <div className="mt-5">
                      <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider">Popular Colors</span>
                      <div className="flex gap-2.5 mt-2">
                        {COLORS.slice(0, 3).map((color, cIdx) => (
                          <div
                            key={cIdx}
                            style={{
                              borderColor: selectedColorIndex === cIdx ? "#111" : "transparent",
                            }}
                            className="h-6 w-6 rounded-full border flex items-center justify-center"
                          >
                            <div style={{ backgroundColor: color.hex }} className="h-4.5 w-4.5 rounded-full border border-black/5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botão de Ação Google-like */}
                  <div className="w-full mt-4 relative">
                    <button
                      style={{
                        transform: `scale(${buttonActiveScale})`,
                        backgroundColor: buttonColor,
                      }}
                      className="w-full py-3.5 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2.5 border-none shadow-md shadow-neutral-950/20 hover:opacity-95 transition-all duration-300 cursor-pointer"
                    >
                      {isButtonLoading ? (
                        // Spinner animado (Google level)
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : isButtonAdded ? (
                        <span>✓ Adicionado</span>
                      ) : (
                        <>
                          <span>Adicionar no carrinho</span>
                          <svg className="w-4 h-4 text-[#d4e157]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Imagem do Produto Expandido (Right Panel with stagger) */}
                <div
                  style={{
                    transform: `translateY(${interpolate(rightPanelSpring, [0, 1], [30, 0])}px) scale(${interpolate(rightPanelSpring, [0, 1], [0.95, 1])})`,
                    opacity: rightPanelSpring,
                  }}
                  className="w-[48%] bg-[#f5f5f3] border border-neutral-200/50 rounded-3xl overflow-hidden flex flex-col justify-center items-center relative shadow-sm"
                >
                  <div
                    style={{
                      transform: `translateY(${headphoneFloat}px)`,
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* Imagem do Fone azul reativa ou renderizada */}
                    <img
                      src={staticFile("product-headphone-blue.jpg")}
                      alt="Sequoia Blue Headphone"
                      style={{
                        mixBlendMode: "multiply",
                        filter: selectedColorIndex === 0
                          ? "hue-rotate(0deg)"
                          : "hue-rotate(120deg) saturate(1.2)",
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* TELA C: SUCCESS PAGE / COMPRA CONFIRMADA (successTransition > 0) */}
              <div
                style={{
                  opacity: successTransition,
                  transform: `scale(${interpolate(successTransition, [0, 1], [0.92, 1])})`,
                  display: successTransition < 0.01 ? "none" : "flex",
                }}
                className="absolute inset-0 w-full h-full bg-[#f4f5f0] flex flex-col justify-center items-center text-center p-8 z-30 transition-all duration-300"
              >
                {/* Círculo com checkmark animado */}
                <div
                  style={{
                    transform: `scale(${interpolate(successTitleSpring, [0, 1], [0.5, 1])})`,
                    opacity: successTitleSpring,
                  }}
                  className="h-20 w-20 rounded-full bg-[#d4e157]/15 border-2 border-[#d4e157]/30 flex items-center justify-center relative mb-5 shadow-inner"
                >
                  <svg className="h-10 w-10 text-[#d4e157]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      style={{
                        strokeDasharray: 50,
                        strokeDashoffset: interpolate(checkmarkDraw, [0, 1], [50, 0]),
                      }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    transform: `translateY(${interpolate(successTitleSpring, [0, 1], [15, 0])}px)`,
                    opacity: successTitleSpring,
                  }}
                  className="text-2xl font-extrabold text-neutral-900 tracking-tight"
                >
                  Compra Confirmada!
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-[280px] mt-2">
                  Seu e-commerce premium foi criado e integrado em tempo recorde com a Motion Studio.
                </p>

                {/* Detalhes do Pedido Neumórficos */}
                <div
                  style={{
                    transform: `translateY(${interpolate(successCardSpring, [0, 1], [20, 0])}px) scale(${interpolate(successCardSpring, [0, 1], [0.95, 1])})`,
                    opacity: successCardSpring,
                  }}
                  className="mt-6 bg-white border border-neutral-200/50 rounded-2xl px-6 py-4 flex flex-col gap-2 w-full max-w-[260px] text-left shadow-sm"
                >
                  <div className="flex justify-between text-[9px] font-bold text-neutral-400">
                    <span>STATUS</span>
                    <span className="text-[#16a34a]">APROVADO</span>
                  </div>
                  <div className="h-[1px] bg-neutral-200/60 my-0.5" />
                  <div className="flex justify-between text-[10px] font-extrabold text-neutral-800">
                    <span>PRODUTO</span>
                    <span>Sequoia Blue</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-extrabold text-neutral-800">
                    <span>TOTAL</span>
                    <span className="text-[#2563eb]">$299.00</span>
                  </div>
                </div>

                {/* ── Confetes Premium: Explosão Multi-Wave com Física Realista ── */}
                {successActive && Array.from({ length: 80 }).map((_, idx) => {
                  // Multi-wave stagger: 3 ondas de explosão
                  const wave = idx < 30 ? 0 : idx < 55 ? 1 : 2;
                  const waveDelay = wave * 8;
                  const delay = (idx % 30) * 0.8 + waveDelay;
                  const fallDuration = 70 + (idx % 20) * 2;
                  const fallProgress = interpolate(
                    successTime,
                    [delay, delay + fallDuration],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );

                  // Seed pseudo-aleatória por partícula
                  const seed = idx * 13.7 + wave * 42;
                  const seedSin = Math.sin(seed) * 0.5 + 0.5;
                  const seedCos = Math.cos(seed * 1.3) * 0.5 + 0.5;

                  // Ângulo e força da explosão (em arco mais amplo)
                  const spreadAngle = ((seed * 37) % 360) * (Math.PI / 180);
                  const forceBase = 100 + (seedSin * 160);
                  const force = forceBase * (wave === 0 ? 1 : wave === 1 ? 0.85 : 0.7);

                  // Trajetória com gravidade + vento sutil
                  const windX = Math.sin(successTime * 0.04 + seed) * 15;
                  const xArc = Math.cos(spreadAngle) * force * Math.min(1, fallProgress * 1.8);
                  const yUp = -Math.sin(spreadAngle) * force * 0.9 * Math.min(1, fallProgress * 1.5);
                  const gravity = 420 * Math.pow(fallProgress, 2);
                  const xOffset = xArc + windX;
                  const yOffset = yUp + gravity;

                  // Rotação 3D com tumble
                  const rotX = fallProgress * (200 + seedSin * 300);
                  const rotY = fallProgress * (180 + seedCos * 240);
                  const rotZ = fallProgress * (90 + seedSin * 180);

                  // Cores premium (brand palette + acentos)
                  const confColors = [
                    "#2563eb", "#3b82f6", // blues
                    "#ea580c", "#f97316", // oranges
                    "#16a34a", "#22c55e", // greens
                    "#d4e157", "#c6d417", // lime/yellow-green
                    "#dc2626", "#ef4444", // reds
                    "#0891b2", "#06b6d4", // cyans
                    "#8b5cf6", "#a78bfa", // purples
                    "#ec4899", "#f472b6", // pinks
                  ];
                  const color = confColors[idx % confColors.length];

                  // Formas variadas
                  const shapes = ["rect", "circle", "strip", "star"];
                  const shape = shapes[idx % 4];
                  const baseSize = 6 + seedSin * 10;

                  if (fallProgress <= 0.01 || fallProgress >= 0.98) return null;

                  // Opacidade com fade suave e brilho no início
                  const fadeOut = interpolate(fallProgress, [0.7, 1], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  const fadeIn = interpolate(fallProgress, [0, 0.05], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  const opacity = fadeIn * fadeOut;

                  // Escala com squash & stretch
                  const scaleY = 1 + Math.sin(fallProgress * Math.PI * 4) * 0.3;
                  const scaleX = 1 / scaleY;

                  let borderRadius = "2px";
                  let width = `${baseSize}px`;
                  let height = `${baseSize * 0.6}px`;

                  if (shape === "circle") {
                    borderRadius = "50%";
                    width = `${baseSize * 0.7}px`;
                    height = `${baseSize * 0.7}px`;
                  } else if (shape === "strip") {
                    borderRadius = "3px";
                    width = `${baseSize * 0.35}px`;
                    height = `${baseSize * 1.4}px`;
                  } else if (shape === "star") {
                    borderRadius = "1px";
                    width = `${baseSize * 0.5}px`;
                    height = `${baseSize * 0.5}px`;
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        bottom: "38%",
                        left: "50%",
                        transform: `translate(${xOffset}px, ${yOffset}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scaleX}, ${scaleY})`,
                        width,
                        height,
                        backgroundColor: color,
                        borderRadius,
                        opacity,
                        boxShadow: `0 1px 3px ${color}40`,
                      }}
                      className="pointer-events-none"
                    />
                  );
                })}

              </div>

            </div>

          </div>

        </div>

        {/* ─── Bolinha voadora da micro-interação (Add to Cart) ────────────── */}
        {isFadingFlyBall && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(${flyBallX}px, ${flyBallY}px) scale(${interpolate(flyProgress, [0, 0.2, 0.8, 1], [0.2, 1, 1, 0])})`,
              zIndex: 100,
            }}
            className="w-4.5 h-4.5 rounded-full bg-[#2563eb] border-2 border-white shadow-lg pointer-events-none"
          />
        )}

        {/* ─── Cursor do Mouse Virtual (Movimentos Orgânicos) ──────────────── */}
        {localFrame > 30 && localFrame < 510 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(${mouseX}px, ${mouseY}px)`,
              zIndex: 100,
            }}
            className="pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.2 2.2c-.4 0-.8.2-1 .6-.2.4-.2.8 0 1.2l10 24c.2.4.6.6 1 .6.4 0 .8-.2 1-.6l3.5-8.5 8.5-3.5c.4-.2.6-.6.6-1s-.2-.8-.6-1l-24-10c-.1-.1-.3-.2-.4-.2-.2 0-.4 0-.6.1z"
                fill="white"
                stroke="black"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* Ondas de clique */}
            {activePulse > 0.01 && (
              <div
                style={{
                  transform: `scale(${activePulse})`,
                  opacity: interpolate(activePulse, [0, 1.3], [1, 0]),
                  position: "absolute",
                  left: "-12px",
                  top: "-12px",
                }}
                className="w-10 h-10 rounded-full border-4 border-[#d4e157] bg-[#d4e157]/20"
              />
            )}
          </div>
        )}

        {/* ─── Cards Flutuantes 3D orbitando (Cena 3) ─────────────────────── */}
        
        {/* Card 1: Checkout Transparente (Superior Esquerdo) */}
        {card1Spring > 0.01 && (
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "-18%",
              transform: `scale(${card1Spring}) translateY(${floatOffset}px) translateZ(80px)`,
              zIndex: 50,
              boxShadow: "0 20px 45px rgba(0,0,0,0.4)",
            }}
            className="w-[180px] rounded-2xl border border-white/10 bg-neutral-950/80 p-4 backdrop-blur-md flex flex-col gap-2 text-left"
          >
            <div className="h-8 w-8 rounded-lg bg-[#d4e157]/10 border border-[#d4e157]/20 flex items-center justify-center text-[#d4e157]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-white tracking-tight">Checkout Otimizado</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">Pagamento transparente e rápido.</p>
            </div>
          </div>
        )}

        {/* Card 2: Performance Máxima (Inferior Esquerdo) */}
        {card2Spring > 0.01 && (
          <div
            style={{
              position: "absolute",
              bottom: "12%",
              left: "-22%",
              transform: `scale(${card2Spring}) translateY(${floatOffsetInverse}px) translateZ(100px)`,
              zIndex: 50,
              boxShadow: "0 20px 45px rgba(0,0,0,0.4)",
            }}
            className="w-[190px] rounded-2xl border border-white/10 bg-neutral-950/80 p-4 backdrop-blur-md flex flex-col gap-2 text-left"
          >
            <div className="h-8 w-8 rounded-lg bg-[#d4e157]/10 border border-[#d4e157]/20 flex items-center justify-center text-[#d4e157]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-white tracking-tight">Velocidade Extrema</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">Mais velocidade, mais vendas.</p>
            </div>
          </div>
        )}

        {/* Card 3: Design Sob Medida (Superior Direito) */}
        {card3Spring > 0.01 && (
          <div
            style={{
              position: "absolute",
              top: "14%",
              right: "-20%",
              transform: `scale(${card3Spring}) translateY(${floatOffsetInverse}px) translateZ(70px)`,
              zIndex: 50,
              boxShadow: "0 20px 45px rgba(0,0,0,0.4)",
            }}
            className="w-[185px] rounded-2xl border border-white/10 bg-neutral-950/80 p-4 backdrop-blur-md flex flex-col gap-2 text-left"
          >
            <div className="h-8 w-8 rounded-lg bg-[#d4e157]/10 border border-[#d4e157]/20 flex items-center justify-center text-[#d4e157]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-white tracking-tight">Experiência Premium</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">Design sob medida focado na marca.</p>
            </div>
          </div>
        )}

        {/* Card 4: Escala Ilimitada (Inferior Direito) */}
        {card4Spring > 0.01 && (
          <div
            style={{
              position: "absolute",
              bottom: "16%",
              right: "-18%",
              transform: `scale(${card4Spring}) translateY(${floatOffset}px) translateZ(120px)`,
              zIndex: 50,
              boxShadow: "0 20px 45px rgba(0,0,0,0.4)",
            }}
            className="w-[180px] rounded-2xl border border-[#d4e157]/20 bg-neutral-950/80 p-4 backdrop-blur-md flex flex-col gap-2 text-left"
          >
            <div className="h-8 w-8 rounded-lg bg-[#d4e157]/10 border border-[#d4e157]/20 flex items-center justify-center text-[#d4e157]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-white tracking-tight">Escala & SaaS</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">Pronto para grandes fluxos.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
