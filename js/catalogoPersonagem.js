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
const filmesPersonagens = [];
const VeiculosPersonagens = [];
const NavesPersonagens = [];


const apiKey = `https://swapi.dev/api/${consultaAPI}/`;

fetch(apiKey)
    .then(response => response.json())
    .then(data => {
        const contador = data.count;
        const lista = document.querySelector('.lista-personagens');

        const personagens = []; // guarda objetos completos

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
                        filmesPersonagens.length = 0;
                        NavesPersonagens.length = 0;

                        //Consulta Filmes
                        for (let linkFilme of personagem.films) {
                            const responseFilme = await fetch(linkFilme);
                            const filme = await responseFilme.json();
                            filmesPersonagens.push(filme.title);
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
                        ${filmesPersonagens.map(filme => `<li>${filme}</li>`).join('')}
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
            }
        }


        for (let i = 1; i <= contador; i++) {
            if (i === 17) {
                continue;
            }
            const linkConsulta = apiKey + i;
            Consulta(linkConsulta, consultaAPI)

        }


    })

    .catch(error =>
        console.error("Erro: ", error)
    )