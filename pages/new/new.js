// Cria uma string HTML com uma opção padrão para o seletor de proprietários.
var ownerOptions = '<option value="">-- Selecione --</option>';

// Declaração da função myHome.
function myHome() {
    // Muda o título da página para 'Novo Documento'.
    changeTitle('Novo Documento');
    
    // Obtém opções de proprietários para o seletor.
    getOwnersToSelect();
    
    // Verifica se existe uma guia aberta na sessionStorage; se não, define 'item' como padrão.
    if (sessionStorage.openTab == undefined)
        sessionStorage.openTab = 'item';

    // Exibe a guia conforme a sessionStorage.
    showTab(sessionStorage.openTab);

    // Adiciona um evento de clique para exibir a guia de proprietários.
    $('#btnNewOwner').click(() => { showTab('owner') });

    // Adiciona um evento de clique para exibir a guia de itens.
    $('#btnNewItem').click(() => { showTab('item'); });

    // Adiciona um evento de submissão de formulário para enviar dados.
    $('.tabs form').submit(sendData);
}

// Declaração da função sendData, que trata o envio de dados do formulário.
function sendData(ev) {
    // Impede o comportamento padrão de enviar o formulário.
    ev.preventDefault();

    // Inicializa um objeto JSON vazio.
    var formJSON = {};

    // Obtém os dados do formulário e popula o objeto JSON.
    const formData = new FormData(ev.target);
    formData.forEach((value, key) => {
        formJSON[key] = stripTags(value);
        $('#' + key).val(formJSON[key]);
    });

    // Verifica se algum campo obrigatório está vazio.
    for (const key in formJSON)
        if (formJSON[key] == '')
            return false;

    // Chama a função para salvar os dados.
    saveData(formJSON);
    return false;
}

// Declaração da função saveData, responsável por enviar os dados para a API.
function saveData(formJSON) {
    // Constrói a URL da API com base no tipo de formulário.
    requestURL = `${app.apiBaseURL}/${formJSON.type}s`;
    delete formJSON.type;

    // Renomeia 'ownerName' para 'name' se existir.
    if (formJSON.ownerName != undefined) {
        formJSON['name'] = formJSON.ownerName;
        delete formJSON.ownerName;
    }

    // Renomeia 'itemName' para 'name' se existir.
    if (formJSON.itemName != undefined) {
        formJSON['name'] = formJSON.itemName;
        delete formJSON.itemName;
    }

    // Utiliza jQuery para fazer uma requisição AJAX (POST) para a API.
    $.ajax({
        type: "POST",
        url: requestURL,
        data: JSON.stringify(formJSON),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
        .done(() => { // Se bem-sucedido, exibe uma mensagem de sucesso.
            viewHTML = `
                <form>
                    <h3>Oba!</h3>
                    <p>Cadastro efetuado com sucesso.</p>
                    <p>Obrigado...</p>
                </form>
            `;
        })
        .fail((error) => { // Se falhar, exibe uma mensagem de erro.
            console.error('Erro:', error.status, error.statusText, error.responseJSON);
            viewHTML = `
                <form>
                    <h3>Oooops!</h3>
                    <p>Não foi possível realizar o cadastro. Ocorreu uma falha no servidor.</p>
                </form>
            `;
        })
        .always(() => { // Executado sempre, atualiza o conteúdo na página.
            $('.tabBlock').html(viewHTML);
            $('#formNewOwner').trigger('reset');
            $('#formNewItem').trigger('reset');
        });

    return false;
}

// Declaração da função showTab, que exibe a guia correspondente.
function showTab(tabName) {
    // Reseta os formulários de proprietário e item.
    $('#formNewOwner').trigger('reset');
    $('#formNewItem').trigger('reset');

    // Seleciona a guia a ser exibida com base no nome.
    switch (tabName) {
        case 'owner':
            $('#tabOwner').show();
            $('#tabItem').hide();
            $('#btnNewOwner').attr('class', 'active');
            $('#btnNewItem').attr('class', 'inactive');
            sessionStorage.openTab = 'owner';
            break;
        case 'item':
            $('#tabItem').show();
            $('#tabOwner').hide();
            $('#btnNewItem').attr('class', 'active');
            $('#btnNewOwner').attr('class', 'inactive');
            break;
    }
}

// Declaração da função getOwnersToSelect, que obtém os proprietários para o seletor.
function getOwnersToSelect() {
    // Constrói a URL da API para obter a lista de proprietários.
    requestURL = `${app.apiBaseURL}/owners`;

    // Faz uma requisição AJAX (GET) para a API.
    $.get(requestURL)
        .done((apiData) => { // Se bem-sucedido, popula as opções do seletor.
            apiData.forEach((item) => {
                ownerOptions += `<option value="${item.id}">${item.id} - ${item.name}</option>`;
            });

            $('#owner').html(ownerOptions);
        })
        .fail((error) => { // Se falhar, exibe uma mensagem de erro no console.
            console.error('Erro:', error.status, error.statusText, error.responseJSON);
        });
}

// Função executada quando o documento estiver pronto.
$(document).ready(myHome);
