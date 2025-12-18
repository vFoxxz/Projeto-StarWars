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

const generoMap = {
    male: "Masculino",
    female: "Feminino",
    "n/a": "N/A",
    none: "Nenhum",
    hermaphrodite: "Hermafrodita"
};


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
const personagens = [];
const planetas = [];
const naves = [];
const veiculos = [];
const especies = [];

const params = new URLSearchParams(window.location.search)
const consultaAPI = params.get('tipo')
const lista = document.querySelector('.lista-personagens');
const tituloLista = document.querySelector('.titulo-lista');
const inputPesquisa = document.getElementById('searchInput');

const containerLista = document.querySelector('.container-listas');

const apiKey = `https://swapi.info/api/${consultaAPI}/`;

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatarValor(valor) {
    if (!valor || valor === "unknown" || valor === "n/a") {
        return "Desconhecido";
    }

    if (valor.includes("-")) {
        return valor;
    }

    const numero = Number(valor.replace(/,/g, ""));
    if (isNaN(numero)) {
        return "Desconhecido";
    }
    return numero.toLocaleString("pt-BR");
}


async function fetchLocalStorage(chave, url) {
    const cache = localStorage.getItem(chave);
    if (cache) {
        return JSON.parse(cache)
    }
    const response = await fetch(url);
    const data = await response.json()

    localStorage.setItem(chave, JSON.stringify(data))
    return data;
}

async function carregarTodos(consultaAPI) {
    let url = `https://swapi.info/api/${consultaAPI}/`;
    const chaveCache = `cache_${consultaAPI}`

    const cache = localStorage.getItem(chaveCache)
    if (cache) {
        return JSON.parse(cache)
    }
    const resultados = [];

    while (url) {
        const response = await fetch(url);
        const data = await response.json();

        resultados.push(...data);
        url = data.next;
    }

    localStorage.setItem(chaveCache, JSON.stringify(resultados))
    return resultados;
}


//getCount(apiKey).then(count=>console.log(count))

async function Consulta(linkConsulta, consultaAPI) {
    const jsonResposta = await fetchLocalStorage(`item_${linkConsulta}`, linkConsulta);



    if (consultaAPI === 'people') {
        // Consultas Planeta

        tituloLista.textContent = 'Lista de personagens';
        inputPesquisa.setAttribute('placeholder', 'Pesquisar personagens...')
        const jsonPlanet = await fetchLocalStorage(`planet_${jsonResposta.homeworld}`, jsonResposta.homeworld)
        jsonResposta.homeworld = jsonPlanet.name

        // Consultas Espécie
        if (jsonResposta.species.length > 0) {
            const Specie = await fetchLocalStorage(`specie_${jsonResposta.species[0]}`, jsonResposta.species[0]); // pega a primeira espécie
            jsonResposta.species = Specie.name
        } else {
            jsonResposta.species = 'Desconhecida';
        }

        // guarda personagem
        personagens.push(jsonResposta);

        // ordena por nome
        personagens.sort((a, b) => a.name.localeCompare(b.name));
        containerLista.innerHTML = '';
        for (let personagem of personagens) {
            const div = document.createElement('div');
            div.setAttribute('class', 'catalogo');
            div.innerHTML = '';
            div.innerHTML = `
                                ${personagem.name}
                                <br>
                                <div class="info-card"> 
                                     ${generoMap[personagem.gender]}
                                     <br>
                                     <span class="linha-raca"> <span class="raca"> Raça: </span> ${personagem.species === 'Human' ? 'Humano' : personagem.species} </span>
                                </div>
                            `;

            div.setAttribute('data-bs-target', '#exampleModalCenter');
            div.setAttribute('data-bs-toggle', 'modal');

            div.addEventListener('click', async () => {

                const listaPessoal = document.querySelector('.modal-body');

                //Limpa Arrays pro proximo personagem
                VeiculosPersonagens.length = 0;
                filmes.length = 0;
                NavesPersonagens.length = 0;

                //Consulta Filmes
                for (let linkFilme of personagem.films) {
                    const filme = await fetchLocalStorage(`filme_${linkFilme}`, linkFilme)
                    filmes.push(filme.title)
                }
                //Consultas Veículos
                for (let linkVeiculo of personagem.vehicles) {
                    const veiculo = await fetchLocalStorage(`veiculo_${linkVeiculo}`, linkVeiculo)
                    VeiculosPersonagens.push(veiculo.name);
                }

                //Consultas naves
                for (let linkNave of personagem.starships) {
                    const nave = await fetchLocalStorage(`nave_${linkNave}`, linkNave)
                    NavesPersonagens.push(nave.name);
                }

                listaPessoal.innerHTML = `
                                <strong>Nome:</strong> ${personagem.name === "unknown" ? "Desconhecido" : personagem.name}<br>
                                <strong>Altura:</strong> ${personagem.height === "unknown" ? "Desconhecido" : `${personagem.height} cm`} <br>
                                <strong>Peso:</strong> ${personagem.mass === "unknown" ? "Desconhecido" : `${personagem.mass} KG`} <br>
                                <strong>Cabelo:</strong> ${personagem.hair_color === "unknown" ? "Desconhecido" : personagem.hair_color}<br>
                                <strong>Pele:</strong> ${personagem.skin_color === "unknown" ? "Desconhecido" : personagem.skin_color}<br>
                                <strong>Olhos:</strong> ${personagem.eye_color === "unknown" ? "Desconhecido" : personagem.eye_color}<br>
                                <strong>Nascimento:</strong> ${personagem.birth_year === "unknown" ? "Desconhecido" : personagem.birth_year}<br>
                                <strong>Gênero:</strong> ${personagem.gender === "unknown" ? "Desconhecido" : personagem.gender}<br>
                                <strong>Planeta:</strong> ${personagem.homeworld === "unknown" ? "Desconhecido" : personagem.homeworld}<br>
                                <strong>Espécie: </strong> ${personagem.species === "unknown" ? "Desconhecido" : personagem.species}<br> 
                                <hr>
                                <strong> Informações adicionais </strong>
                                <br>
                                <br>
                                <strong>Filmes:</strong>
                                ${filmes.length > 0 ? filmes.map(filme => `<li>${filme}</li>`).join('') : 'Não tem<br>'}
                                <br>
                                <strong>Veículos:</strong>
                                ${VeiculosPersonagens.length > 0 ? VeiculosPersonagens.map(veiculo => `<li>${veiculo}</li>`).join('') : 'Não tem<br>'}
                                <br>
                                <strong>Naves:</strong>
                                ${NavesPersonagens.length > 0 ? NavesPersonagens.map(nave => `<li>${nave}</li>`).join('') : 'Não tem<br>'}
                            `;




            });
            containerLista.appendChild(div);
        }
    } else if (consultaAPI === 'planets') {
        tituloLista.textContent = 'Lista de planetas';
        inputPesquisa.setAttribute('placeholder', 'Pesquisar planetas...')
        planetas.push(jsonResposta);
        planetas.sort((a, b) => a.name.localeCompare(b.name))

        containerLista.innerHTML = '';
        for (let planeta of planetas) {
            const div = document.createElement('div');
            div.setAttribute('class', 'catalogo');
            div.innerHTML = '';
            div.innerHTML = `
                                ${planeta.name}
                                <br>
                                <div class="info-card"> 
                                     <br>
                                     <span class="linha-raca"> <span class="raca"> População: </span> ${planeta.population === 'unknown' ? "Desconhecido" : formatarValor(planeta.population)} </span>
                                </div>
                            `;

            div.setAttribute('data-bs-target', '#exampleModalCenter');
            div.setAttribute('data-bs-toggle', 'modal');

            div.addEventListener("click", async () => {
                const listaPessoal = document.querySelector('.modal-body');

                residentesPlanetas.length = 0
                filmes.length = 0

                for (let linkResidentes of planeta.residents) {
                    const residents = await fetchLocalStorage(`people_${linkResidentes}`, linkResidentes)
                    residentesPlanetas.push(residents.name)
                }

                for (let linkFilme of planeta.films) {
                    const filme = await fetchLocalStorage(`filme_${linkFilme}`, linkFilme)
                    filmes.push(filme.title)
                }

                listaPessoal.innerHTML = `
                      
                                <strong>Nome:</strong> ${planeta.name === "unknown" ? "Desconhecido" : planeta.name}<br>
                                <strong>Período de rotação:</strong> ${planeta.rotation_period === "unknown" ? "Desconhecido" : planeta.rotation_period} horas<br>
                                <strong>Período orbital:</strong> ${planeta.orbital_period === "unknown" ? "Desconhecido" : `${planeta.orbital_period} dias`} <br>
                                <strong>Diâmetro:</strong> ${planeta.diameter === "unknown" ? "Desconhecido" : `${planeta.diameter} km`}<br>
                                <strong>Clima:</strong> ${planeta.climate === "unknown" ? "Desconhecido" : planeta.climate}<br>
                                <strong>Gravidade:</strong> ${planeta.gravity === "unknown" ? "Desconhecido" : planeta.gravity}<br>
                                <strong>Terreno:</strong> ${planeta.terrain === "unknown" ? "Desconhecido" : planeta.terrain}<br>
                                <strong>Água na superfície:</strong> ${planeta.surface_water === "unknown" ? "Desconhecido" : `${planeta.surface_water}%`}<br>
                                <strong>População:</strong> ${planeta.population === "unknown" ? "Desconhecido" : `${formatarValor(planeta.population)} habitantes`} <br>
                                <hr>
                                <strong> Informações adicionais </strong>
                                <br>
                                <br>
                                <strong>Residentes:</strong><br>
                                ${residentesPlanetas.length > 0 ? residentesPlanetas.map(residente => `<li>${residente}</li>`).join('') : 'Não tem'}
                                <br>
                                <strong>Filmes:</strong><br>
                                ${filmes.length > 0 ? filmes.map(filme => `<li>${filme}</li>`).join('') : 'Não tem<br>'}
                                <br>
                        
                        `;





            })
            containerLista.append(div)

        }
    } else if (consultaAPI === 'starships') {
        tituloLista.textContent = 'Lista de naves';
        inputPesquisa.setAttribute('placeholder', 'Pesquisar naves...')
        naves.push(jsonResposta)
        naves.sort((a, b) => a.name.localeCompare(b.name))
        containerLista.innerHTML = ''
        for (let nave of naves) {
            const div = document.createElement('div');
            div.setAttribute('class', 'catalogo');
            div.innerHTML = '';
            div.innerHTML = `
                                ${nave.name}
                                <br>
                                <div class="info-card"> 
                                     <br>
                                     <span class="linha-raca"> <span class="raca"> Custo: </span> ${nave.cost_in_credits === "unknown" ? "Desconhecido" : formatarValor(nave.cost_in_credits)} </span><br>
                                     <span class="linha-raca"> <span class="raca"> Comprimento: </span> ${nave.length === "unknown" ? "Desconhecido" : `${nave.length} Metros`}</span>
                                     
                                </div>
                            `;

            div.setAttribute('data-bs-target', '#exampleModalCenter');
            div.setAttribute('data-bs-toggle', 'modal');

            div.addEventListener("click", async () => {
                const listaPessoal = document.querySelector('.modal-body');

                pilotos.length = 0
                filmes.length = 0;

                for (let linkFilme of nave.films) {
                    const filme = await fetchLocalStorage(`filme_${linkFilme}`, linkFilme)
                    filmes.push(filme.title)
                }

                for (let linkPiloto of nave.pilots) {
                    const piloto = await fetchLocalStorage(`people_${linkPiloto}`, linkPiloto)
                    pilotos.push(piloto.name)
                }
                listaPessoal.innerHTML = `
                                
                                    <strong>Nome:</strong> ${nave.name === "unknown" ? "Desconhecido" : nave.name}<br>
                                    <strong>Modelo:</strong> ${nave.model === "unknown" ? "Desconhecido" : nave.model}<br>
                                    <strong>Fabricante:</strong> ${nave.manufacturer === "unknown" ? "Desconhecido" : nave.manufacturer}<br>
                                    <strong>Custo:</strong> ${nave.cost_in_credits === "unknown" ? "Desconhecido" : `${formatarValor(nave.cost_in_credits)} crédito`}<br>
                                    <strong>Comprimento:</strong> ${nave.length === "unknown" ? "Desconhecido" : `${formatarValor(nave.length)} metros`}<br>
                                    <strong>Velocidade atmosférica máxima:</strong> ${formatarValor(nave.max_atmosphering_speed) === "Desconhecido" ? "Desconhecido" : `${nave.max_atmosphering_speed} km/h`}<br>
                                    <strong>Tripulação:</strong> ${formatarValor
                                    (nave.crew) === "Desconhecido" ? "Desconhecido" : `${formatarValor
                                    (nave.crew)} ${formatarValor(nave.crew).includes("-") ? "pessoas" : (Number(nave.crew.replace(/,/g, "")) > 1 ? "pessoas" : "pessoa")}`}<br>
                                    <strong>Passageiros:</strong> ${formatarValor
                                    (nave.passengers)}<br>
                                    <strong>Capacidade de carga:</strong> ${nave.cargo_capacity === "unknown" ? "Desconhecido" : `${formatarValor(nave.cargo_capacity)} kg`}<br>
                                    <strong>Consumíveis:</strong> ${nave.consumables === "unknown" ? "Desconhecido" : nave.consumables}<br>
                                    <strong>Classificação do hiperdrive:</strong> ${nave.hyperdrive_rating === "unknown" ? "Desconhecido" : formatarValor(nave.hyperdrive_rating)}<br>
                                    <strong>MGLT:</strong> ${nave.MGLT === "unknown" ? "Desconhecido" : formatarValor(nave.MGLT)}<br>
                                    <strong>Classe da nave:</strong> ${nave.starship_class === "unknown" ? "Desconhecido" : nave.starship_class}<br>
                                    <hr>
                                    <strong> Informações adicionais </strong>
                                    <br>
                                    <br>
                                    <strong>Pilotos:</strong><br>
                                    ${pilotos.length > 0 ? pilotos.map(piloto => `<li>${piloto}</li>`).join('') : 'Não tem<br>'}
                                    <br>
                                    <strong>Filmes:</strong><br>
                                    ${filmes.length > 0 ? filmes.map(filme => `<li>${filme}</li>`).join('') : 'Não tem<br>'}
                                    <br>
                                
                            `;



            })
            containerLista.append(div)
        }
    } else if (consultaAPI === 'vehicles') {
        tituloLista.textContent = 'Lista de veículos';
        inputPesquisa.setAttribute('placeholder', 'Pesquisar veículos...')
        veiculos.push(jsonResposta)
        veiculos.sort((a, b) => a.name.localeCompare(b.name))
        containerLista.innerHTML = ''
        for (let veiculo of veiculos) {
            const div = document.createElement('div');
            div.setAttribute('class', 'catalogo');
            div.innerHTML = '';
            div.innerHTML = `
                                ${veiculo.name}
                                <br>
                                <div class="info-card"> 
                                     <br>
                                     <span class="linha-raca"> <span class="raca"> Custo: </span> ${veiculo.cost_in_credits === "unknown" ? "Desconhecido" : `${formatarValor(veiculo.cost_in_credits)}`} </span><br>
                                     <span class="linha-raca"> <span class="raca"> Velocidade: </span> ${veiculo.max_atmosphering_speed === "unknown" ? "Desconhecido" : `${formatarValor(veiculo.max_atmosphering_speed)} km/h`}</span>
                                     
                                </div>
                            `;

            div.setAttribute('data-bs-target', '#exampleModalCenter');
            div.setAttribute('data-bs-toggle', 'modal');
            div.addEventListener("click", async () => {
                const listaPessoal = document.querySelector('.modal-body');

                pilotos.length = 0
                filmes.length = 0;

                for (let linkFilme of veiculo.films) {
                    const filme = await fetchLocalStorage(`filme_${linkFilme}`, linkFilme)
                    filmes.push(filme.title)
                }

                for (let linkPiloto of veiculo.pilots) {
                    const piloto = await fetchLocalStorage(`people_${linkPiloto}`, linkPiloto)
                    pilotos.push(piloto.name)
                }

                listaPessoal.innerHTML = `
                                <strong>Nome:</strong> ${veiculo.name === "unknown" ? "Desconhecido" : veiculo.name}<br>
                                <strong>Modelo:</strong> ${veiculo.model === "unknown" ? "Desconhecido" : veiculo.model}<br>
                                <strong>Fabricante:</strong> ${veiculo.manufacturer === "unknown" ? "Desconhecido" : veiculo.manufacturer}<br>
                                <strong>Custo:</strong> ${veiculo.cost_in_credits === "unknown" ? "Desconhecido" : `${formatarValor(veiculo.cost_in_credits)} créditos`}<br>
                                <strong>Comprimento:</strong> ${veiculo.length === "unknown" ? "Desconhecido" : `${formatarValor(veiculo.length)} metros`}<br>
                                <strong>Velocidade atmosférica máxima:</strong> ${veiculo.max_atmosphering_speed === "unknown" ? "Desconhecido" : `${formatarValor(veiculo.max_atmosphering_speed)} km/h`}<br>
                                <strong>Tripulação:</strong> ${veiculo.crew === "unknown" ? "Desconhecido" : `${formatarValor(veiculo.crew) > 1 ? `${formatarValor(veiculo.crew)} pessoas` : `${formatarValor(veiculo.crew)} pessoa`} `}<br>
                                <strong>Passageiros:</strong> ${veiculo.passengers === "unknown" ? "Desconhecido" : formatarValor(veiculo.passengers)}<br>
                                <strong>Capacidade de carga:</strong> ${veiculo.cargo_capacity === "unknown" ? "Desconhecido" : `${veiculo.cargo_capacity} kg`}<br>
                                <strong>Consumíveis:</strong> ${veiculo.consumables === "unknown" ? "Desconhecido" : veiculo.consumables}<br>
                                <strong>Classe do veículo:</strong> ${veiculo.vehicle_class === "unknown" ? "Desconhecido" : veiculo.vehicle_class}<br>
                                <hr>
                                <strong> Informações adicionais </strong>
                                <br>
                                <br>
                                <strong>Pilotos:</strong><br>
                                ${pilotos.length > 0 ? pilotos.map(piloto => `<li>${piloto}</li>`).join('') : 'Não tem<br>'}
                                <br>
                                <strong>Filmes:</strong><br>
                                ${filmes.length > 0 ? filmes.map(filme => `<li>${filme}</li>`).join('') : 'Não tem<br>'}
                                <br>
                        `;




            })
            containerLista.append(div)
        }

    } else if (consultaAPI === 'films') {
        tituloLista.textContent = 'Lista de filmes';
        inputPesquisa.setAttribute('placeholder', 'Pesquisar filmes...')
        filmes.push(jsonResposta)
        filmes.sort((a, b) => a.title.localeCompare(b.title))
        containerLista.innerHTML = ''
        for (let filme of filmes) {
            const div = document.createElement('div');
            div.setAttribute('class', 'catalogo');
            div.innerHTML = '';
            div.innerHTML = `
                                ${filme.title}
                                <br>
                                <div class="info-card"> 
                                     <br>
                                     <span class="linha-raca"> <span class="raca"> Episódio: </span> ${filme.episode_id} </span><br>
                                     <span class="linha-raca"> <span class="raca"> Data de lançamento: </span> ${formatarData(filme.release_date)}</span>
                                     
                                </div>
                            `;

            div.setAttribute('data-bs-target', '#exampleModalCenter');
            div.setAttribute('data-bs-toggle', 'modal');
            div.addEventListener("click", async () => {
                const listaPessoal = document.querySelector('.modal-body');

                personagensFilmes.length = 0
                planetasFilmes.length = 0
                navesFilmes.length = 0
                veiculosFilmes.length = 0
                especiesFilmes.length = 0

                for (let linkPersonagem of filme.characters) {
                    const personagem = await fetchLocalStorage(`people_${linkPersonagem}`, linkPersonagem)
                    personagensFilmes.push(personagem.name)
                }

                for (let linkPlaneta of filme.planets) {
                    const planeta = await fetchLocalStorage(`planet_${linkPlaneta}`, linkPlaneta)
                    planetasFilmes.push(planeta.name)
                }

                for (let linkNaves of filme.starships) {
                    const nave = await fetchLocalStorage(`nave_${linkNaves}`, linkNaves)
                    navesFilmes.push(nave.name)
                }

                for (let linkVeiculo of filme.vehicles) {
                    const veiculo = await fetchLocalStorage(`veiculo_${linkVeiculo}`, linkVeiculo)
                    veiculosFilmes.push(veiculo.name)
                }

                for (let linkEspecie of filme.species) {
                    const especie = await fetchLocalStorage(`specie_${linkEspecie}`, linkEspecie)
                    especiesFilmes.push(especie.name)
                }
                listaPessoal.innerHTML = `
                            <li>
                                <strong>Título:</strong> ${filme.title === "unknown" ? "Desconhecido" : filme.title}<br>
                                <strong>Episódio:</strong> ${filme.episode_id === "unknown" ? "Desconhecido" : filme.episode_id}<br>
                                <strong>Diretor:</strong> ${filme.director === "unknown" ? "Desconhecido" : filme.director}<br>
                                <strong>Produtor(es):</strong> ${filme.producer === "unknown" ? "Desconhecido" : filme.producer}<br>
                                <strong>Data de lançamento:</strong> ${formatarData(filme.release_date)}<br>
                                <strong>Abertura:</strong><br>
                                <pre>${filme.opening_crawl === "unknown" ? "Desconhecido" : filme.opening_crawl}</pre>
                                <hr>
                                <strong> Informações adicionais </strong>
                                <br>
                                <br>
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
                            </li>
                        `;






            })
            containerLista.append(div)
        }
    } else if (consultaAPI === 'species') {
        tituloLista.textContent = 'Lista de espécies';
        inputPesquisa.setAttribute('placeholder', 'Pesquisar espécies...')
        const jsonPlanet = await fetchLocalStorage(`planet_${jsonResposta.homeworld}`, jsonResposta.homeworld);
        jsonResposta.homeworld = jsonPlanet.name;

        especies.push(jsonResposta)
        especies.sort((a, b) => a.name.localeCompare(b.name))
        containerLista.innerHTML = ''
        for (let especie of especies) {
            const div = document.createElement('div');
            div.setAttribute('class', 'catalogo');
            div.innerHTML = '';
            div.innerHTML = `
                                ${especie.name}
                                <br>
                                <div class="info-card"> 
                                     <br>
                                     <span class="linha-raca"> <span class="raca"> Altura média: </span> ${especie.average_height === "unknown" ? "Desconhecido" : `${especie.average_height} cm`} </span><br>
                                     <span class="linha-raca"> <span class="raca"> Linguagem: </span> ${especie.language === "unknown" ? "Desconhecido" : especie.language}</span>
                                     
                                </div>
                            `;

            div.setAttribute('data-bs-target', '#exampleModalCenter');
            div.setAttribute('data-bs-toggle', 'modal');
            div.addEventListener("click", async () => {
                const listaPessoal = document.querySelector('.modal-body');

                pilotos.length = 0
                filmes.length = 0;

                for (let linkFilme of especie.films) {
                    const filme = await fetchLocalStorage(`filme_${linkFilme}`, linkFilme)
                    filmes.push(filme.title)
                }

                for (let linkPiloto of especie.people) {
                    const piloto = await fetchLocalStorage(`people_${linkPiloto}`, linkPiloto)
                    pilotos.push(piloto.name)
                }
                listaPessoal.innerHTML = `
                            
                                <strong>Nome:</strong> ${especie.name === "unknown" ? "Desconhecido" : especie.name}<br>
                                <strong>Classificação:</strong> ${especie.classification === "unknown" ? "Desconhecido" : especie.classification}<br>
                                <strong>Designação:</strong> ${especie.designation === "unknown" ? "Desconhecido" : especie.designation}<br>
                                <strong>Altura média:</strong> ${especie.average_height === "unknown" ? "Desconhecido" : `${especie.average_height} cm`} <br>
                                <strong>Cores de pele:</strong> ${especie.skin_colors === "unknown" ? "Desconhecido" : especie.skin_colors}<br>
                                <strong>Cores de cabelo:</strong> ${especie.hair_colors === "unknown" ? "Desconhecido" : especie.hair_colors}<br>
                                <strong>Cores de olhos:</strong> ${especie.eye_colors === "unknown" ? "Desconhecido" : especie.eye_colors}<br>
                                <strong>Expectativa de vida:</strong> ${especie.average_lifespan === "unknown" ? "Desconhecido" : `${especie.average_lifespan} anos`}<br>
                                <strong>Planeta natal:</strong> ${especie.homeworld === "unknown" ? "Desconhecido" : especie.homeworld}<br>
                                <strong>Linguagem:</strong> ${especie.language === "unknown" ? "Desconhecido" : especie.language}<br>
                                <hr>
                                <strong> Informações adicionais </strong>
                                <br>
                                <br>
                                <strong>Pessoas:</strong><br>
                                ${pilotos.length > 0 ? pilotos.map(piloto => `<li>${piloto}</li>`).join('') : 'Não tem<br>'}
                                <br>
                                <strong>Filmes:</strong><br>
                                ${filmes.length > 0 ? filmes.map(filme => `<li>${filme}</li>`).join('') : 'Não tem<br>'}
                                <br>
                            
                        `;




            })
            containerLista.append(div)
        }
    }
}

carregarTodos(consultaAPI).then(async (todos) => {
    await Promise.all(todos.map(item => Consulta(item.url, consultaAPI)));
});

let itens = containerLista.getElementsByClassName('catalogo');
inputPesquisa.addEventListener("input", function () {
    let filtro = inputPesquisa.value.toLowerCase();

    for (let i = 0; i < itens.length; i++) {
        let texto = itens[i].textContent.toLowerCase();
        if (texto.includes(filtro)) {
            itens[i].style.display = ""
        } else {
            itens[i].style.display = "none"
        }
    }
})