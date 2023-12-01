function myAbout() {
    changeTitle(`Sobre o ${app.siteName}`);

    query = sessionStorage.search
    getAll(query)
}
$(document).ready(myAbout);


function getAll(query) {

    // View da tabela.
    var tableData = '<ul>';

    // Acessa o endpoint da API.
    $.get(app.apiBaseURL + "/items/search/" + query)

        // Se deu certo.
        .done((apiData) => {

            // Debug: exibe dados da API no console.
            console.log("API Data:", apiData);

            // Conta quantos registros retornaram da API.
            const numItems = Object.keys(apiData).length;


            // Itera cada registro que retornou da API.
            for (const id in apiData) {

                // Obtém o registro atual para 'item'.
                const item = apiData[id];

                // Monta a 'view' da tabela.
                tableData += `
                        <li class="items" data-id="${item.id}">
                                ${item.name}
                        </li>                   
                    `;
            }
            tableData += '</ul>'

            $('#results').html(tableData);
            $('.items').click(getClickedItem);

        })

        // Se falhou ou ler a API...
        .fail((error) => {

            // Monta e exibe uma mensagem de erro dentro da tabela correspondente.
            tableData = '<tr><td>Nenhum registro encontrado.</td></tr>';
            $(tableId + ' tbody').html(tableData);
        })

    // Termina sem fazer mais nada.
    return false;
}