const camposPessoais = [
  "name",
  "height",
  "mass",
  "hair_color",
  "skin_color",
  "eye_color",
  "birth_year",
  "gender",
  "homeworld"
];

const camposAdicionais = [
    "films",
    "species",
    "vehicles",
    "starships",
]

fetch("https://swapi.dev/api/people")
    .then(response => response.json())
    .then(data => {
        let lista=document.querySelector(".lista-personagens")
        data.results.forEach(personagens => {
            let li = document.createElement("li")
            li.innerText = personagens.name
            li.setAttribute("class", "item")

            li.addEventListener("click", async function () {
                let listaPessoal = document.querySelector(".listaPessoal");
                let listaAdicional = document.querySelector(".adicional");
                listaPessoal.innerHTML = "";
                listaAdicional.innerHTML = "";

                let listaItens = Object.entries(personagens);
                for (let [chave, item] of listaItens) {
                    let liPessoal = document.createElement("li");

                    if (chave === "homeworld") {
                        try {
                            const res = await fetch(item);
                            const planeta = await res.json();
                            item = planeta.name;
                        } catch (error) {
                            console.error("Erro ao buscar planeta: ", error);
                        }
                    }



                    
                    if (camposPessoais.includes(chave)) {
                        liPessoal.innerText = `${chave} : ${item}`;
                        listaPessoal.appendChild(liPessoal);
                    } else if (camposAdicionais.includes(chave)) {
                        if (chave === "films") {
                            let filmesTitulo = document.createElement("h3");
                            filmesTitulo.innerText = "Filmes";
                            listaAdicional.appendChild(filmesTitulo);

                            let listaFilmes = document.createElement("ul");

                            for (let urlFilme of item) {   // item já é array
                                try {
                                    const res = await fetch(urlFilme);
                                    const filme = await res.json();

                                    let liFilme = document.createElement("li");
                                    liFilme.innerText = filme.title; // campo correto
                                    listaFilmes.appendChild(liFilme);
                                } catch (error) {
                                    console.error("Erro ao buscar filme:", error);
                                }
                            }

                            listaAdicional.appendChild(listaFilmes);
                        } else if (chave === "species") {
                            let especieTitulo = document.createElement("h3");
                            especieTitulo.innerText = "Espécies";
                            listaAdicional.appendChild(especieTitulo);

                            let listaEspecies = document.createElement("ul");

                            for (let urlEspecie of item) {
                                try {
                                    const res = await fetch(urlEspecie);
                                    const especie = await res.json();

                                    let liEspecie = document.createElement("li");
                                    liEspecie.innerText = especie.name; // campo correto
                                    listaEspecies.appendChild(liEspecie);
                                } catch (error) {
                                    console.error("Erro ao buscar espécie:", error);
                                }
                            }

                            listaAdicional.appendChild(listaEspecies);
                        } else if (chave === "vehicles") {
                            let veiculoTitulo = document.createElement("h3")
                            veiculoTitulo.innerText = "Veículos"
                            listaAdicional.appendChild(veiculoTitulo)

                            let listaVeiculo = document.createElement("ul")

                            for (let urlVeiculo of item) {
                                try {
                                    const res = await fetch(urlVeiculo)
                                    const veiculo = await res.json()

                                    let liVeiculo = document.createElement("li")
                                    liVeiculo.innerText = veiculo.name
                                    listaVeiculo.appendChild(liVeiculo)
                                } catch (error) {
                                    console.error("Erro ao buscar veiculo:", error);
                                }
                            }

                            listaAdicional.appendChild(listaVeiculo)
                        } else if (chave === "starships") {
                            let naveTitulos = document.createElement("h3")
                            naveTitulos.innerText = "Naves"
                            listaAdicional.appendChild(naveTitulos)

                            let listaNave = document.createElement("ul")

                            for (let urlNave of item) {
                                try {
                                    const res = await fetch(urlNave)
                                    const nave = await res.json()
                                    
                                    let liNave = document.createElement("li")
                                    liNave.innerText = nave.name
                                    listaNave.appendChild(liNave)
                                } catch (error) {
                                    console.error("Erro ao buscar nave:", error);
                                }
                            }
                            listaAdicional.appendChild(listaNave)
                        }

                    }
                    
                }
});


            lista.appendChild(li)
        });

        let pesquisa = document.querySelector(".campoPesquisa")
        let itens=lista.getElementsByTagName("li")
        pesquisa.addEventListener("input", function () {
            let filtro = pesquisa.value.toLowerCase();

            for (let i = 0; i < itens.length; i++){
                let texto = itens[i].textContent.toLowerCase();
                if (texto.includes(filtro)) {
                    itens[i].style.display=""
                } else {
                    itens[i].style.display="none"
                }
            }
        })




    })
    .catch(error =>
        console.error("Erro: ", error)
    )