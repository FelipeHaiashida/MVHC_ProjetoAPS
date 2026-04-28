/* ================================================================
   MUSEU VIRTUAL DA HISTÓRIA DA COMPUTAÇÃO — script.js
   Funcionalidades:
   · Sistema de login demonstrativo
   · Canvas de partículas (hero)
   · Navbar scroll + menu mobile
   · Scroll reveal (Intersection Observer)
   · Ativação do CTA após login
   ================================================================ */

/* ----------------------------------------------------------------
   1. SISTEMA DE LOGIN DEMONSTRATIVO
   Credenciais de demo: usuário "museu" / senha "1234"
   (Substitua ou conecte a um backend real conforme necessário)
   ---------------------------------------------------------------- */

/** Credenciais aceitas pelo sistema demo */
const DEMO_USERS = [
  { user: 'museu',                        pass: '1234' },
  { user: 'felipe.haiashida@email.com',   pass: 'museu2026' },
  { user: 'fernando.freitas@email.com',   pass: 'museu2026' },
];

/**
 * Trata o submit do formulário de login.
 * Chamado pelo onclick do botão "Entrar".
 */
function handleLogin() {
  const userInput = document.getElementById('login-user');
  const passInput = document.getElementById('login-pass');
  const errUser   = document.getElementById('err-user');
  const errPass   = document.getElementById('err-pass');
  const errLogin  = document.getElementById('login-error');
  const btnLogin  = document.getElementById('btn-login');

  /* Limpa erros anteriores */
  clearError(userInput, errUser);
  clearError(passInput, errPass);
  errLogin.textContent = '';

  const userVal = userInput.value.trim();
  const passVal = passInput.value;

  /* Validações de campo vazio */
  let hasError = false;

  if (!userVal) {
    setError(userInput, errUser, 'Informe o usuário ou e-mail.');
    hasError = true;
  }

  if (!passVal) {
    setError(passInput, errPass, 'Informe a senha.');
    hasError = true;
  }

  if (hasError) return;

  /* Animação de loading no botão */
  btnLogin.querySelector('span:not(.btn-arrow)').textContent = 'Verificando...';
  btnLogin.disabled = true;

  /* Simulação de latência de rede (500 ms) */
  setTimeout(() => {
    const match = DEMO_USERS.find(
      u => u.user === userVal && u.pass === passVal
    );

    if (match) {
      /* Login bem-sucedido: anima saída e mostra o site */
      loginSuccess();
    } else {
      /* Credenciais erradas */
      btnLogin.querySelector('span:not(.btn-arrow)').textContent = 'Entrar';
      btnLogin.disabled = false;
      errLogin.textContent = 'Usuário ou senha incorretos. Tente: museu / 1234';
      passInput.value = '';
      setError(passInput, errPass, '');
    }
  }, 500);
}

/** Exibe mensagem de erro em um campo */
function setError(input, errEl, msg) {
  input.classList.add('input-error');
  errEl.textContent = msg;
}

/** Remove marcação de erro de um campo */
function clearError(input, errEl) {
  input.classList.remove('input-error');
  errEl.textContent = '';
}

/** Executa a transição de saída do login e revela o site */
function loginSuccess() {
  const loginScreen = document.getElementById('login-screen');
  const mainSite    = document.getElementById('main-site');

  /* Fade out na tela de login */
  loginScreen.style.transition = 'opacity .5s ease, transform .5s ease';
  loginScreen.style.opacity    = '0';
  loginScreen.style.transform  = 'scale(1.03)';

  setTimeout(() => {
    loginScreen.remove();               /* Remove do DOM definitivamente */
    mainSite.classList.remove('hidden');
    document.body.style.overflow = '';  /* Restaura scroll */

    /* Inicia o canvas APÓS o site estar visível */
    initHeroCanvas();
    initScrollReveal();
  }, 500);
}

/* Garante que o body não scrolla enquanto o login está ativo */
document.body.style.overflow = 'hidden';

/* Permite login com Enter */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.getElementById('login-screen')) {
    handleLogin();
  }
});

/* ----------------------------------------------------------------
   2. NAVBAR — scroll shadow + menu mobile
   ---------------------------------------------------------------- */

/** Adiciona sombra à navbar ao rolar */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/** Abre/fecha o menu mobile */
function toggleMenu() {
  const links  = document.getElementById('nav-links');
  const toggle = document.getElementById('nav-toggle');
  if (!links) return;

  links.classList.toggle('open');
  const isOpen = links.classList.contains('open');

  /* Anima as linhas do hambúrguer */
  const spans = toggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
}

/** Fecha o menu mobile (chamado nos links) */
function closeMenu() {
  const links  = document.getElementById('nav-links');
  const toggle = document.getElementById('nav-toggle');
  if (!links) return;

  links.classList.remove('open');
  const spans = toggle.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity   = '';
  spans[2].style.transform = '';
}

/* Fecha menu ao clicar fora */
document.addEventListener('click', (e) => {
  const links  = document.getElementById('nav-links');
  const toggle = document.getElementById('nav-toggle');
  if (!links || !links.classList.contains('open')) return;
  if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
});

/* ----------------------------------------------------------------
   3. CANVAS DE PARTÍCULAS — hero
   ---------------------------------------------------------------- */

/**
 * Desenha um campo de partículas conectadas no canvas do hero,
 * simulando uma rede de dados / grade holográfica animada.
 */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const PARTICLE_COUNT = 70;
  const MAX_DISTANCE   = 140;
  const SPEED          = 0.35;

  /* Cores da paleta */
  const COLORS = ['#0CFFE1', '#5B4EFF', '#8B7EFF', '#3DCEFF'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * SPEED * 2,
      vy: (Math.random() - .5) * SPEED * 2,
      r:  Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * .5 + .3,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Actualiza posições */
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      /* Rebote nas bordas */
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    /* Desenha conexões */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const alpha = (1 - dist / MAX_DISTANCE) * .25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(92,105,255,${alpha})`;
          ctx.lineWidth   = .7;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    /* Desenha partículas */
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    animId = requestAnimationFrame(draw);
  }

  /* Pausa quando a aba não está visível (economia de CPU) */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
}

/* ----------------------------------------------------------------
   4. SCROLL REVEAL — Intersection Observer
   ---------------------------------------------------------------- */

/**
 * Observa todos os elementos com classe .reveal e adiciona
 * .visible quando entram no viewport.
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); /* Observa apenas uma vez */
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------------
   5. LINK DA APLICAÇÃO UNITY WEBGL
   Centraliza o endereço para facilitar substituição futura.
   Altere UNITY_URL para o link real após publicar no GitHub Pages.
   ---------------------------------------------------------------- */
const UNITY_URL = 'https://seu-link-da-unity-webgl.com';

/** Atualiza todos os links do museu com a URL da Unity */
function applyUnityLinks() {
  const links = document.querySelectorAll('a[href="https://seu-link-da-unity-webgl.com"]');
  links.forEach(link => {
    link.setAttribute('href', UNITY_URL);
  });
}

/* ----------------------------------------------------------------
   6. SMOOTH SCROLL PARA ÂNCORAS
   Compensa a altura do navbar fixo.
   ---------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ----------------------------------------------------------------
   7. TIPAGEM ANIMADA NO BADGE DO HERO (efeito typewriter)
   ---------------------------------------------------------------- */
function initTypewriter() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  const original = badge.textContent.trim();
  badge.textContent = '';

  let i = 0;
  const interval = setInterval(() => {
    badge.textContent = original.slice(0, ++i);
    if (i >= original.length) clearInterval(interval);
  }, 38);
}

/* ----------------------------------------------------------------
   8. INICIALIZAÇÃO GERAL
   (chamada após o login remover a tela de cobertura)
   ---------------------------------------------------------------- */
function initSite() {
  initNavbar();
  initSmoothScroll();
  applyUnityLinks();
  initTypewriter();
  /* initHeroCanvas() e initScrollReveal() são chamados em loginSuccess() */
}

/* Inicia funções que não dependem da visibilidade do site */
document.addEventListener('DOMContentLoaded', () => {
  initSite();

  /* Se o login já foi pulado (ex: recarregamento com main-site visível) */
  if (!document.getElementById('login-screen')) {
    initHeroCanvas();
    initScrollReveal();
  }
});
