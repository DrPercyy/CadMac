// ======================================================
// CadMac - Frontend
// ======================================================


// ======================================================
// LOG
// ======================================================

function adicionarLog(texto) {

    const log =
        document.getElementById("log");


    const hora =
        new Date()
            .toLocaleTimeString();


    log.innerHTML +=
        `<br>[${hora}] ${texto}`;


    // Limita quantidade de linhas
    const limite = 50;


    const linhas =
        log.innerHTML.split("<br>");


    if (linhas.length > limite) {

        log.innerHTML =
            linhas
                .slice(
                    linhas.length - limite
                )
                .join("<br>");

    }


    log.scrollTop =
        log.scrollHeight;
}



// ======================================================
// PESQUISA DOS MACS
// ======================================================


async function pesquisar() {


    const campo =
        document.getElementById("macInput");


    const texto =
        campo.value.trim();



    if (!texto) {

        adicionarLog(
            "Nenhum MAC informado."
        );

        return;

    }



    const macs =
        texto
            .split(/\n/)
            .filter(
                linha => linha.trim() !== ""
            );



    adicionarLog(
        `${macs.length} MACs recebidos.`
    );



    const resposta =
        await fetch(
            "/search",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        {
                            macs: macs
                        }
                    )

            }
        );



    const dados =
        await resposta.json();



    mostrarResultado(
        dados.encontrados,
        dados.nao_encontrados
    );


    adicionarLog(
        `${dados.encontrados.length} MACs encontrados.`
    );


    adicionarLog(
        `${dados.nao_encontrados.length} MACs não cadastrados.`
    );


    if (
        dados.nao_encontrados.length
    ) {

        adicionarLog(
            "MACs não encontrados:"
        );


        dados.nao_encontrados
            .forEach(mac => {

                adicionarLog(
                    mac
                );

            });

    }


}



// ======================================================
// MOSTRAR RESULTADO
// ======================================================


function mostrarResultado(
    encontrados,
    nao_encontrados
) {


    const resultado =
        document.getElementById(
            "resultado"
        );


    let html = "";



    // =============================
    // NÃO CADASTRADOS
    // =============================


    html += `

    <h5>
        NÃO CADASTRADOS
    </h5>

    <hr>

    `;


    if (
        nao_encontrados.length === 0
    ) {

        html += `
        Nenhum MAC não cadastrado.
        `;

    }
    else {


        nao_encontrados.forEach(mac => {

            html += `
            <div>
                ${mac}
            </div>
            `;

        });


    }




    // =============================
    // SEPARADOR
    // =============================


    html += `

    <br>

    <hr>

    <h5>
        CADASTRADOS
    </h5>

    <hr>

    `;



    // =============================
    // CADASTRADOS
    // =============================


    if (
        encontrados.length === 0
    ) {

        html += `
        Nenhum MAC encontrado.
        `;

    }
    else {


        encontrados.forEach(item => {


            html += `

            <div class="encontrado">

                <strong>
                ${item.MAC}
                </strong>

                <br>

                LOCAL:
                ${item.Grupo}

            </div>

            <br>

            `;


        });


    }


    resultado.innerHTML = html;

}


// ======================================================
// LIMPAR
// ======================================================


function limpar() {


    document
        .getElementById("macInput")
        .value = "";


    document
        .getElementById("resultado")
        .innerHTML = "";


    document
        .getElementById("log")
        .innerHTML =
        "Aguardando...";


}



// ======================================================
// ENVIO DA BASE HUAWEI
// ======================================================


async function enviarBase() {


    const arquivo =

        document
            .getElementById("baseFile")
            .files[0];



    if (!arquivo) {

        return;

    }



    adicionarLog(
        "Enviando nova base..."
    );



    const form =
        new FormData();


    form.append(
        "file",
        arquivo
    );



    const resposta =
        await fetch(
            "/upload-base",
            {

                method: "POST",

                body: form

            }
        );



    const dados =
        await resposta.json();



    adicionarLog(
        "Base atualizada."
    );


    adicionarLog(
        `Total de MACs:
        ${dados.total}`
    );



}



// ======================================================
// IMPORTAR TXT
// ======================================================


function lerTXT(event) {


    const arquivo =
        event.target.files[0];


    if (!arquivo) {

        return;

    }



    const leitor =
        new FileReader();



    leitor.onload =
        function (e) {


            document
                .getElementById(
                    "macInput"
                )
                .value =
                e.target.result;



            adicionarLog(
                "Arquivo TXT carregado."
            );


        };



    leitor.readAsText(
        arquivo
    );


}




// ======================================================
// STATUS DA BASE AO ABRIR
// ======================================================


async function carregarStatus() {


    const resposta =
        await fetch(
            "/status"
        );


    const dados =
        await resposta.json();



    document
        .getElementById(
            "statusBase"
        )
        .innerHTML =

        `
    MACs carregados:
    <strong>
    ${dados.base_carregada}
    </strong>
    `;



}



carregarStatus();