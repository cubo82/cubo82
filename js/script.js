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

/* LÓGICA DOS GUIAS E DOWNLOAD */

const botaoGuia = document.querySelectorAll(".guia-download");
const inputGuiaPendente = document.getElementById("guia-pendente");

botaoGuia.forEach((botao) => {
  botao.addEventListener("click", () => {
    const caminhoGuia = botao.getAttribute("data-guide");

    const jaPreencheuFormulario = localStorage.getItem(
      "cubo82_lead_formulario",
    );

    if (jaPreencheuFormulario === "true") {
      window.open(caminhoGuia, "_blank");
    } else {
      if (inputGuiaPendente) {
        // 1. Armazena o link do guia no input invisível
        inputGuiaPendente.value = caminhoGuia;
      }

      // 2. Rola a página suavemente até o formulário de diagnóstico
      const secaoDiagnostico = document.getElementById("diagnostico");

      if (secaoDiagnostico) {
        secaoDiagnostico.scrollIntoView({ behavior: "smooth" });

        // Opcional: Dar um pequeno destaque visual no form para o usuário saber que deve preencher
        const caixaBriefing = document.querySelector(".caixa-briefing");
        caixaBriefing.style.boxShadow = "0 0 20px rgba(255, 255, 0 , 0.03)";
        setTimeout(() => {
          caixaBriefing.style.boxShadow = "none";
        }, 2000);
      }
    }
  });
});

/* FORMULÁRIO DE DIAGNÓSTICO (BRIEFING) */
const formBriefing = document.getElementById("form-briefing");

if (formBriefing) {
  formBriefing.addEventListener("submit", function (e) {
    e.preventDefault();

    const btn = this.querySelector("button");
    const inputGuiaPendente = document.getElementById("guia-pendente");
    const guiaParaAbrir = inputGuiaPendente ? inputGuiaPendente.value : "";

    const dadosForm = new FormData(this);
    const nomeEmpresa = dadosForm.get("empresa");

    // Converte para um objeto simples para enviar como JSON
    const objetoDados = Object.fromEntries(dadosForm.entries());

    // Injeta o guia que o usuário tentou baixar nos dados do Webhook
    objetoDados.guia_baixado = guiaParaAbrir || "Nenhum (Direto via Form)";

    // Feedback visual de carregamento
    btn.innerHTML = `Gerando Diagnóstico... <i class="fas fa-spinner fa-spin"></i>`;
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // ENVIO REAL PARA O WEBHOOK (Substitua a URL abaixo pela sua do Make.com)
    fetch("/api/diagnostico", {
      method: "POST",
      body: JSON.stringify(objetoDados),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // SALVA NO NAVEGADOR QUE O USUÁRIO JÁ SE CADASTROU
          localStorage.setItem("cubo82_lead_formulario", "true");

          // 1. Se houver um guia pendente, abre em nova aba
          if (guiaParaAbrir) {
            window.open(guiaParaAbrir, "_blank");
          }

          // DISPARANDO O SWEETALERT2
          Swal.fire({
            title: "Sucesso!",
            text: guiaParaAbrir
              ? `O download do guia para ${nomeEmpresa} foi liberado!`
              : `Recebemos os dados da ${nomeEmpresa}. Em breve entraremos em contato.`,
            icon: "success",
            background: "#203731",
            color: "#fff",
            confirmButtonColor: "#ffb612",
            iconColor: "#ffb612",
            timer: 4000,
            timerProgressBar: true,
          });
          // 3. Reseta o formulário e o estado do botão
          this.reset();
          if (inputGuiaPendente) inputGuiaPendente.value = ""; // Limpa o guia pendente
        } else {
          throw new Error("Erro no servidor");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        Swal.fire({
          title: "Ops!",
          text: "Houve um erro ao enviar seus dados. Tente novamente ou nos chame no WhatsApp.",
          icon: "error",
          confirmButtonColor: "#ffb612",
        });
      })
      .finally(() => {
        // Retorna o botão ao estado original independente de sucesso ou erro
        btn.innerHTML = `Receber diagnóstico <i class="fas fa-paper-plane"></i>`;
        btn.disabled = false;
        btn.style.opacity = "1";
      });
  });
}
