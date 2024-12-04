// Captura o formulário e a tabela
const form = document.getElementById('produtoForm');
const bookTable = document.getElementById('produtosList');

// Função para adicionar livro ao backend via POST
form.addEventListener('submit', function (e) {
    e.preventDefault();  // Previne o envio do formulário (recarga da página)

    // Obtém os dados do formulário
    const author = document.getElementById('book-author').value;
    const quantity = document.getElementById('book-quantity').value;
    const genre = document.getElementById('book-genre').value;
    const title = document.getElementById('book-title').value;
    const image = document.getElementById('book-image').files[0];
    const imageUrl = document.getElementById('imagemUrl').value;

    // Enviar os dados para o backend via POST
    const formData = new FormData();
    formData.append('autor', author);
    formData.append('quantidade', quantity);
    formData.append('genero', genre);
    formData.append('titulo', title);
    if (image) {
        formData.append('image', image);
    }
    formData.append('imagemUrl', imageUrl);

    // Enviar dados via Fetch API
    fetch('http://localhost:8080/bibliotech', {
        method: 'POST',
        body: formData, // Enviar os dados como FormData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Produto adicionado:', data);
        // Adiciona o produto à tabela localmente
        addProductToTable(data);
        form.reset(); // Limpa o formulário
    })
    .catch(error => {
        console.error('Erro ao adicionar produto:', error);
    });
});

// Função para adicionar produto à tabela (localmente no frontend)
function addProductToTable(product) {
    const newRow = bookTable.insertRow();
    const idCell = newRow.insertCell(0);
    const authorCell = newRow.insertCell(1);
    const titleCell = newRow.insertCell(2);
    const genreCell = newRow.insertCell(3);
    const quantityCell = newRow.insertCell(4);
    const imageCell = newRow.insertCell(5);
    const actionsCell = newRow.insertCell(6);

    idCell.textContent = product.id;
    authorCell.textContent = product.autor;
    titleCell.textContent = product.titulo;
    genreCell.textContent = product.genero;
    quantityCell.textContent = product.quantidade;

    const imgElement = document.createElement('img');
    imgElement.src = product.imagURL; // Usando o caminho da imagem retornado pelo backend
    imgElement.alt = product.titulo;
    imgElement.width = 50;
    imageCell.appendChild(imgElement);

    actionsCell.innerHTML = `
        <a href="#" class="delete" data-id="${product.id}">Excluir</a>
        <a href="#" class="edit" data-id="${product.id}">Editar</a>
    `;
}

// Deletar produto
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('delete')) {
        const productId = e.target.getAttribute('data-id');
        fetch(`http://localhost:8080/bibliotech/${productId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Produto excluído');
                e.target.closest('tr').remove(); // Remove a linha da tabela
            }
        })
        .catch(error => console.error('Erro ao excluir produto:', error));
});
