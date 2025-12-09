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

const nomesOrdenados = [];
const filmes = [];
const VeiculosPersonagens = [];
const NavesPersonagens = [];
const residentesPlanetas = [];
const pilotos = [];
const personagensFilmes = [];
const planetasFilmes = [];
const navesFilmes = [];
const veiculosFilmes = [];
const especiesFilmes = [];


const apiKey = `https://swapi.dev/api/${consultaAPI}/`;

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}


fetch(apiKey)
    .then(response => response.json())
    .then(data => {
        const contador = data.count;
        const lista = document.querySelector('.lista-personagens');

        const personagens = []; // guarda objetos completos
        const planetas = [];
        const naves = [];
        const veiculos = [];
        const filmes = [];
        const especies = [];

        async function carregarTodos(consultaAPI) {
            let url = `https://swapi.dev/api/${consultaAPI}/`;
            const resultados = [];

            while (url) {
                const response = await fetch(url);
                const data = await response.json();

                resultados.push(...data.results);
                url = data.next;
            }

            return resultados;
        }


        async function Consulta(linkConsulta, consultaAPI) {
            const response = await fetch(linkConsulta);
            const jsonResposta = await response.json();

            if (consultaAPI === 'people') {
                // Consultas Planeta
                const responsePlanet = await fetch(jsonResposta.homeworld);
                const jsonPlanet = await responsePlanet.json();
                jsonResposta.homeworld = jsonPlanet.name;

                // Consultas Espécie
                if (jsonResposta.species.length > 0) {
                    const responseSpecie = await fetch(jsonResposta.species[0]); // pega a primeira espécie
                    const jsonSpecie = await responseSpecie.json();
                    jsonResposta.species = jsonSpecie.name;
                } else {
                    jsonResposta.species = 'Desconhecida';
                }



                // guarda personagem
                personagens.push(jsonResposta);

                // ordena por nome
                personagens.sort((a, b) => a.name.localeCompare(b.name));

                // re-renderiza lista
                lista.innerHTML = '';
                for (let personagem of personagens) {
                    const li = document.createElement('li');
                    li.innerText = personagem.name;
                    li.setAttribute('class', 'item');

                    li.addEventListener('click', async () => {
                        const listaPessoal = document.querySelector('.listaPessoal');
                        const listaAdicional = document.querySelector('.adicional');

                        listaPessoal.innerHTML = `
                            <li>
                                <strong>Nome:</strong> ${personagem.name}<br>
                                <strong>Altura:</strong> ${personagem.height} cm<br>
                                <strong>Peso:</strong> ${personagem.mass} kg<br>
                                <strong>Cabelo:</strong> ${personagem.hair_color}<br>
                                <strong>Pele:</strong> ${personagem.skin_color}<br>
                                <strong>Olhos:</strong> ${personagem.eye_color}<br>
                                <strong>Nascimento:</strong> ${personagem.birth_year}<br>
                                <strong>Gênero:</strong> ${personagem.gender}<br>
                                <strong>Planeta:</strong> ${personagem.homeworld}<br>
                                <strong>Espécie: </strong> ${personagem.species}<br> 
                            </li>
                            `;

                        //Limpa Arrays pro proximo personagem
                        VeiculosPersonagens.length = 0;
                        filmes.length = 0;
                        NavesPersonagens.length = 0;

                        //Consulta Filmes
                        for (let linkFilme of personagem.films) {
                            const responseFilme = await fetch(linkFilme);
                            const filme = await responseFilme.json();
                            filmes.push(filme.title);
                        }
                        //Consultas Veículos
                        for (let linkVeiculo of personagem.vehicles) {
                            const responseVehicles = await fetch(linkVeiculo);
                            const veiculo = await responseVehicles.json();
                            VeiculosPersonagens.push(veiculo.name);
                        }

                        //Consultas naves
                        for (let linkNave of personagem.starships) {
                            const responseStarships = await fetch(linkNave);
                            const nave = await responseStarships.json();
                            NavesPersonagens.push(nave.name);
                        }


                        listaAdicional.innerHTML = `
                        <li>
                        <strong>Filmes:</strong>
                        ${filmes.map(filme => `<li>${filme}</li>`).join('')}
                        <br>
                        <strong>Veículos:</strong>
                        ${VeiculosPersonagens.length > 0 ? VeiculosPersonagens.map(veiculo => `<li>${veiculo}</li>`).join('') : 'Não tem'}
                        <br>
                        <strong>Naves:</strong>
                        ${NavesPersonagens.length > 0 ? NavesPersonagens.map(nave => `<li>${nave}</li>`).join('') : 'Não tem'}
                        </li>
                        `;
                    });

                    lista.appendChild(li);
                }
            } else if (consultaAPI === 'planets') {

                planetas.push(jsonResposta);
                planetas.sort((a, b) => a.name.localeCompare(b.name))

                lista.innerHTML = ''
                for (let planeta of planetas) {

                    const li = document.createElement('li');
                    li.innerText = planeta.name;
                    li.setAttribute('class', 'item');
                    li.addEventListener("click", async () => {
                        const listaPessoal = document.querySelector('.listaPessoal');
                        const listaAdicional = document.querySelector('.adicional');

                        listaPessoal.innerHTML = `
                            <li>
                                <strong>Nome:</strong> ${planeta.name}<br>
                                <strong>Período de rotação:</strong> ${planeta.rotation_period} horas<br>
                                <strong>Período orbital:</strong> ${planeta.orbital_period} dias<br>
                                <strong>Diâmetro:</strong> ${planeta.diameter} km<br>
                                <strong>Clima:</strong> ${planeta.climate}<br>
                                <strong>Gravidade:</strong> ${planeta.gravity}<br>
                                <strong>Terreno:</strong> ${planeta.terrain}<br>
                                <strong>Água na superfície:</strong> ${planeta.surface_water}%<br>
                                <strong>População:</strong> ${planeta.population} habitantes<br>
                            </li>
                        `;

                        residentesPlanetas.length = 0
                        filmes.length = 0

                        for (let linkResidentes of planeta.residents) {
                            const responseResidents = await fetch(linkResidentes)
                            const residents = await responseResidents.json()
                            residentesPlanetas.push(residents.name)
                        }

                        for (let linkFilme of planeta.films) {
                            const responseFilme = await fetch(linkFilme)
                            const filme = await responseFilme.json()
                            filmes.push(filme.title)
                        }

                        listaAdicional.innerHTML = `
                            <li>
                            <strong>Residentes:</strong><br>
                            ${residentesPlanetas.length > 0 ? residentesPlanetas.map(residente => `<li>${residente}</li>`).join('') : 'Não tem'}
                            <br>
                            <strong>Filmes:</strong><br>
                            ${filmes.map(filme => `<li>${filme}</li>`).join('')}
                            <br>
                            </li>
                        
                        `

                    })
                    lista.append(li)

                }
            } else if (consultaAPI === 'starships') {
                naves.push(jsonResposta)
                naves.sort((a, b) => a.name.localeCompare(b.name))
                lista.innerHTML = ''
                for (let nave of naves) {
                    const li = document.createElement('li');
                    li.innerText = nave.name;
                    li.setAttribute('class', 'item');
                    li.addEventListener("click", async () => {
                        const listaPessoal = document.querySelector('.listaPessoal');
                        const listaAdicional = document.querySelector('.adicional');
                        listaPessoal.innerHTML = `
                                <li>
                                    <strong>Nome:</strong> ${nave.name}<br>
                                    <strong>Modelo:</strong> ${nave.model}<br>
                                    <strong>Fabricante:</strong> ${nave.manufacturer}<br>
                                    <strong>Custo:</strong> ${nave.cost_in_credits} créditos<br>
                                    <strong>Comprimento:</strong> ${nave.length} metros<br>
                                    <strong>Velocidade atmosférica máxima:</strong> ${nave.max_atmosphering_speed} km/h<br>
                                    <strong>Tripulação:</strong> ${nave.crew} pessoas<br>
                                    <strong>Passageiros:</strong> ${nave.passengers}<br>
                                    <strong>Capacidade de carga:</strong> ${nave.cargo_capacity} kg<br>
                                    <strong>Consumíveis:</strong> ${nave.consumables}<br>
                                    <strong>Classificação do hiperdrive:</strong> ${nave.hyperdrive_rating}<br>
                                    <strong>MGLT:</strong> ${nave.MGLT}<br>
                                    <strong>Classe da nave:</strong> ${nave.starship_class}<br>
                                </li>
                            `;
                        pilotos.length = 0
                        filmes.length = 0;

                        for (let linkFilme of nave.films) {
                            const responseFilme = await fetch(linkFilme)
                            const filme = await responseFilme.json()
                            filmes.push(filme.title)
                        }

                        for (let linkPiloto of nave.pilots) {
                            const responsePiloto = await fetch(linkPiloto)
                            const piloto = await responsePiloto.json()
                            pilotos.push(piloto.name)
                        }

                        listaAdicional.innerHTML = `
                            <li>
                            <strong>Pilotos:</strong><br>
                            ${pilotos.length > 0 ? pilotos.map(piloto => `<li>${piloto}</li>`).join('') : 'Não tem<br>'}
                            <br>
                            <strong>Filmes:</strong><br>
                            ${filmes.map(filme => `<li>${filme}</li>`).join('')}
                            <br>
                            <\li>
                        `

                    })
                lista.append(li)
                }
            } else if (consultaAPI === 'vehicles') {
                veiculos.push(jsonResposta)
                veiculos.sort((a, b) => a.name.localeCompare(b.name))
                lista.innerHTML = ''
                for (let veiculo of veiculos) {
                    const li = document.createElement('li');
                    li.innerText = veiculo.name;
                    li.setAttribute('class', 'item');
                    li.addEventListener("click", async () => {
                        const listaPessoal = document.querySelector('.listaPessoal');
                        const listaAdicional = document.querySelector('.adicional');
                        listaPessoal.innerHTML = `
                            <li>
                                <strong>Nome:</strong> ${veiculo.name}<br>
                                <strong>Modelo:</strong> ${veiculo.model}<br>
                                <strong>Fabricante:</strong> ${veiculo.manufacturer}<br>
                                <strong>Custo:</strong> ${veiculo.cost_in_credits} créditos<br>
                                <strong>Comprimento:</strong> ${veiculo.length} metros<br>
                                <strong>Velocidade atmosférica máxima:</strong> ${veiculo.max_atmosphering_speed} km/h<br>
                                <strong>Tripulação:</strong> ${veiculo.crew} pessoas<br>
                                <strong>Passageiros:</strong> ${veiculo.passengers}<br>
                                <strong>Capacidade de carga:</strong> ${veiculo.cargo_capacity} kg<br>
                                <strong>Consumíveis:</strong> ${veiculo.consumables}<br>
                                <strong>Classe do veículo:</strong> ${veiculo.vehicle_class}<br>
                            </li>
                        `;

                        pilotos.length = 0
                        filmes.length = 0;

                        for (let linkFilme of veiculo.films) {
                            const responseFilme = await fetch(linkFilme)
                            const filme = await responseFilme.json()
                            filmes.push(filme.title)
                        }

                        for (let linkPiloto of veiculo.pilots) {
                            const responsePiloto = await fetch(linkPiloto)
                            const piloto = await responsePiloto.json()
                            pilotos.push(piloto.name)
                        }

                        listaAdicional.innerHTML = `
                            <li>
                            <strong>Pilotos:</strong><br>
                            ${pilotos.length > 0 ? pilotos.map(piloto => `<li>${piloto}</li>`).join('') : 'Não tem<br>'}
                            <br>
                            <strong>Filmes:</strong><br>
                            ${filmes.map(filme => `<li>${filme}</li>`).join('')}
                            <br>
                            <\li>
                        `
                    })
                    lista.append(li)
                }
                
            } else if (consultaAPI === 'films') {
                filmes.push(jsonResposta)
                filmes.sort((a, b) => a.title.localeCompare(b.title))
                lista.innerHTML = ''
                for (let filme of filmes) {
                    const li = document.createElement('li');
                    li.innerText = filme.title;
                    li.setAttribute('class', 'item');
                    li.addEventListener("click", async () => {
                        const listaPessoal = document.querySelector('.listaPessoal');
                        const listaAdicional = document.querySelector('.adicional');
                        listaPessoal.innerHTML = `
                            <li>
                                <strong>Título:</strong> ${filme.title}<br>
                                <strong>Episódio:</strong> ${filme.episode_id}<br>
                                <strong>Diretor:</strong> ${filme.director}<br>
                                <strong>Produtor(es):</strong> ${filme.producer}<br>
                                <strong>Data de lançamento:</strong> ${formatarData(filme.release_date)}<br>
                                <strong>Abertura:</strong><br>
                                <pre>${filme.opening_crawl}</pre>
                            </li>
                        `;

                        personagensFilmes.length = 0
                        planetasFilmes.length = 0
                        navesFilmes.length = 0
                        veiculosFilmes.length = 0
                        especiesFilmes.length = 0
                        
                        for (let linkPersonagem of filme.characters) {
                            const responsePersonagem = await fetch(linkPersonagem)
                            const personagem = await responsePersonagem.json()
                            personagensFilmes.push(personagem.name)
                        }

                        for (let linkPlaneta of filme.planets) {
                            const responsePlanet = await fetch(linkPlaneta)
                            const planeta = await responsePlanet.json()
                            planetasFilmes.push(planeta.name)
                        }

                        for (let linkNaves of filme.starships){
                            const responseNave = await fetch(linkNaves)
                            const nave = await responseNave.json()
                            navesFilmes.push(nave.name)
                        }

                        for (let linkVeiculo of filme.vehicles) {
                            const responseVeiculo = await fetch(linkVeiculo)
                            const veiculo = await responseVeiculo.json()
                            veiculosFilmes.push(veiculo.name)
                        }

                        for (let linkEspecie of filme.species) {
                            const responseEspecie = await fetch(linkEspecie)
                            const especie = await responseEspecie.json()
                            especiesFilmes.push(especie.name)
                        }

                        listaAdicional.innerHTML = `
                            <li>
                            <strong>Personagens :</strong><br>
                            ${personagensFilmes.length > 0 ? personagensFilmes.map(personagens => `<li>${personagens}</li>`).join('') : 'Não tem<br>'}
                            <br>
                            <strong>Planetas :</strong><br>
                            ${planetasFilmes.length > 0 ? planetasFilmes.map(planetas => `<li>${planetas}</li>`).join('') : 'Não tem<br>'}
                            <br>
                            <strong>Naves :</strong><br>
                            ${navesFilmes.length > 0 ? navesFilmes.map(naves => `<li>${naves}</li>`).join('') : 'Não tem<br>'}
                            <br>
                            <strong>Veiculos :</strong><br>
                            ${veiculosFilmes.length > 0 ? veiculosFilmes.map(veiculos => `<li>${veiculos}</li>`).join('') : 'Não tem<br>'}
                            <br>
                            <strong>Especies :</strong><br>
                            ${especiesFilmes.length > 0 ? especiesFilmes.map(especies => `<li>${especies}</li>`).join('') : 'Não tem<br>'}
                            <br>
                            <\li>
                        `


                    })
                    lista.append(li)
                }
            } else if (consultaAPI === 'species') {
                const responsePlanet = await fetch(jsonResposta.homeworld);
                const jsonPlanet = await responsePlanet.json();
                jsonResposta.homeworld = jsonPlanet.name;

                especies.push(jsonResposta)
                especies.sort((a, b) => a.name.localeCompare(b.name))
                lista.innerHTML = ''
                for (let especie of especies) {
                    const li = document.createElement('li');
                    li.innerText = especie.name;
                    li.setAttribute('class', 'item');
                    li.addEventListener("click", async () => {
                        const listaPessoal = document.querySelector('.listaPessoal');
                        const listaAdicional = document.querySelector('.adicional');
                        listaPessoal.innerHTML = `
                            <li>
                                <strong>Nome:</strong> ${especie.name}<br>
                                <strong>Classificação:</strong> ${especie.classification}<br>
                                <strong>Designação:</strong> ${especie.designation}<br>
                                <strong>Altura média:</strong> ${especie.average_height} cm<br>
                                <strong>Cores de pele:</strong> ${especie.skin_colors}<br>
                                <strong>Cores de cabelo:</strong> ${especie.hair_colors}<br>
                                <strong>Cores de olhos:</strong> ${especie.eye_colors}<br>
                                <strong>Expectativa de vida:</strong> ${especie.average_lifespan} anos<br>
                                <strong>Planeta natal:</strong> ${especie.homeworld}<br>
                                <strong>Linguagem:</strong> ${especie.language}<br>
                            </li>
                        `;

                        pilotos.length = 0
                        filmes.length = 0;

                        for (let linkFilme of especie.films) {
                            const responseFilme = await fetch(linkFilme)
                            const filme = await responseFilme.json()
                            filmes.push(filme.title)
                        }

                        for (let linkPiloto of especie.people) {
                            const responsePiloto = await fetch(linkPiloto)
                            const piloto = await responsePiloto.json()
                            pilotos.push(piloto.name)
                        }

                        listaAdicional.innerHTML = `
                            <li>
                            <strong>Pessoas:</strong><br>
                            ${pilotos.length > 0 ? pilotos.map(piloto => `<li>${piloto}</li>`).join('') : 'Não tem<br>'}
                            <br>
                            <strong>Filmes:</strong><br>
                            ${filmes.map(filme => `<li>${filme}</li>`).join('')}
                            <br>
                            <\li>
                        `

                    })
                    lista.append(li)
                }
            }
        }


        carregarTodos(consultaAPI).then(async (todos) => {
            await Promise.all(todos.map(item => Consulta(item.url, consultaAPI)));
        });


        let pesquisa = document.querySelector(".campoPesquisa")
        let itens = lista.getElementsByTagName("li")
        pesquisa.addEventListener("input", function () {
            let filtro = pesquisa.value.toLowerCase();

            for (let i = 0; i < itens.length; i++) {
                let texto = itens[i].textContent.toLowerCase();
                if (texto.includes(filtro)) {
                    itens[i].style.display = ""
                } else {
                    itens[i].style.display = "none"
                }
            }
        })

    })

    .catch(error =>
        console.error("Erro: ", error)
    )