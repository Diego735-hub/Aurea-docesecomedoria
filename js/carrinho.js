// Número do WhatsApp (DDI + DDD + número, sem espaços ou traços)
const WHATSAPP_NUMBER = "5581987284072";

// Carrega carrinho do localStorage
function carregarCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
}

// Salva carrinho no localStorage
function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContador();
}

// Atualiza contador no botão do header
function atualizarContador() {
    const carrinho = carregarCarrinho();
    const contador = document.getElementById("carrinho-qtd");
    if (contador) contador.innerText = carrinho.length;
}

// Adiciona produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
    const carrinho = carregarCarrinho();
    carrinho.push({ nome, preco });
    salvarCarrinho(carrinho);
    alert(`${nome} foi adicionado ao carrinho!`);
}

// Mostra/oculta o popup de carrinho
function mostrarCarrinho() {
    let popup = document.getElementById("carrinho-popup");
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "carrinho-popup";
        popup.style.position = "absolute";
        popup.style.top = "50px";
        popup.style.right = "0";
        popup.style.width = "300px";
        popup.style.background = "white";
        popup.style.border = "1px solid #ccc";
        popup.style.padding = "15px";
        popup.style.zIndex = "1000";
        popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
        popup.innerHTML = `
            <h3>Seu Carrinho</h3>
            <div id="carrinho-itens"></div>
            <p><strong>Total:</strong> R$ <span id="carrinho-total">0.00</span></p>
            <button id="finalizar-compra">Finalizar no WhatsApp</button>
        `;
        document.body.appendChild(popup);

        // Evento do botão finalizar
        document.getElementById("finalizar-compra").addEventListener("click", enviarParaWhatsApp);
    }

    atualizarPopup();
    popup.style.display = popup.style.display === "none" ? "block" : "none";
}

// Atualiza itens e total do popup
function atualizarPopup() {
    const carrinho = carregarCarrinho();
    const itensDiv = document.getElementById("carrinho-itens");
    const totalSpan = document.getElementById("carrinho-total");
    itensDiv.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        const p = document.createElement("p");
        p.innerHTML = `${item.nome} - R$ ${item.preco.toFixed(2)} <button onclick="removerItem(${index})">❌</button>`;
        itensDiv.appendChild(p);
    });

    totalSpan.innerText = total.toFixed(2);
}

// Remove item do carrinho
function removerItem(index) {
    const carrinho = carregarCarrinho();
    carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    atualizarPopup();
}

// Envia pedido para WhatsApp
function enviarParaWhatsApp() {
    const carrinho = carregarCarrinho();
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "🛒 *Pedido Aurea Cakes*\n\n";
    let total = 0;
    carrinho.forEach(item => {
        mensagem += `🍰 ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
        total += item.preco;
    });
    mensagem += `\n💰 Total: R$ ${total.toFixed(2)}\n\nPor favor, informe seu endereço para entrega.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");

    // Limpa carrinho
    localStorage.removeItem("carrinho");
    atualizarContador();
    const popup = document.getElementById("carrinho-popup");
    if (popup) popup.style.display = "none";
}

// Evento do botão do header
const btnCarrinho = document.getElementById("carrinho-botao");
if (btnCarrinho) {
    btnCarrinho.addEventListener("click", mostrarCarrinho);
}

// Inicializa contador na página
atualizarContador();
