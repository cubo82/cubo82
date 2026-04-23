/* INICIALIZAÇÃO AOS */
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 1000,
    once: true,
  });
});

/* HEADER E EFEITO DE ROLAGEM */
const cabecalho = document.getElementById("cabecalho");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    cabecalho.classList.add("rolagem");
  } else {
    cabecalho.classList.remove("rolagem");
  }
});

/* MENU MOBILE */
const botaoMenu = document.querySelector(".botao-menu");
const linksNav = document.querySelector(".links-navegacao");

if (botaoMenu) {
  botaoMenu.addEventListener("click", () => {
    linksNav.classList.toggle("ativo");
    const icone = botaoMenu.querySelector("i");

    if (linksNav.classList.contains("ativo")) {
      icone.classList.replace("fa-bars", "fa-xmark");
    } else {
      icone.classList.replace("fa-xmark", "fa-bars");
    }
  });
}

// Fechar menu ao clicar no link
document.querySelectorAll(".links-navegacao a").forEach((link) => {
  link.addEventListener("click", () => {
    linksNav.classList.remove("ativo");
    botaoMenu.querySelector("i").classList.replace("fa-xmark", "fa-bars");
  });
});

/* FORMULÁRIO DE DIAGNÓSTICO (BRIEFING) */
const formBriefing = document.getElementById("form-briefing");

if (formBriefing) {
  formBriefing.addEventListener("submit", function (e) {
    e.preventDefault();

    const btn = this.querySelector("button");
    const dados = new FormData(this);
    const nomeEmpresa = dados.get("empresa");

    btn.innerHTML = `Gerando Diagnóstico... <i class="fas fa-spinner fa-spin"></i>`;
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // Simulação de processamento
    setTimeout(() => {
      alert(
        `Obrigado! Recebemos os dados da ${nomeEmpresa}. Em breve você receberá nosso contato com o diagnóstico.`,
      );
      btn.innerHTML = `Receber diagnóstico <i class="fas fa-paper-plane"></i>`;
      btn.disabled = false;
      btn.style.opacity = "1";
      this.reset();
    }, 2500);
  });
}
