document.addEventListener('DOMContentLoaded', () => {
    // aguarda o DOM carregar

    async function fetchProducts(url) {
        // buscar produtos na API

        let products = document.querySelector('.products');
        let lateral = document.querySelector('.lateral-menu');
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
            let pageUrl = url.replace('{}', currentPage);

            let data = await fetch(pageUrl);
            let response = await data.json();
            console.log(response);

            // Atualiza o número total de páginas
            totalPages = response.total_pages;
            
            //exibir grade de produtos 3x3
            for (let i = 0; i < 9; i++) {
                let contd = 1;
                const price = response.products[i].price;
                const priceString = price.toString();
                const formattedPrice = priceString.slice(0, 2) + '.' + priceString.slice(2);

                var ratingHTML = '';
                for (let j = 1; j <= 5; j++) {
                    //Estrelas de avaliação
                    if (j <= response.products[i].rating.rate) {
                        ratingHTML += '<i class="bi bi-star-fill"></i>';
                    } else {
                        ratingHTML += '<i class="bi bi-star"></i>';
                    }
                }

                let title = response.products[i].title;
                products.innerHTML += `
          <div class="product">
            <img src="${response.products[i].image}" alt="" class="product-img" onclick="pagina(${response.products[i].id})">
            <h2 class="product-title">${title.length > 20 ? title.substring(0, 20).concat('...') : title}</h2>
            <p class="product-rate">${ratingHTML}</p>
            <div class="product-price-container">
            <h3 class="product-price">$ ${formattedPrice}</h3>
              <a href="#!" data-productId="${response.products[i].id}" class="add-to-cart"><ion-icon name="cart-outline"></ion-icon></a>
            </div>
          </div>
        `;
                contd++;
            }

            for (let i = 0; i < 6; i++) {
                // barra lateral
                let cont = 1;
                const price = response.products[i].price;
                const priceString = price.toString();
                const formattedPrice = priceString.slice(0, 2) + '.' + priceString.slice(2);
                let title = response.products[i].title;
                var ratingHTML = '';

                for (let j = 1; j <= 5; j++) {
                    // Cria o HTML para exibir a classificação dos produtos
                    if (j <= response.products[i].rating.rate) {
                        ratingHTML += '<i class="bi bi-star-fill"></i>';
                    } else {
                        ratingHTML += '<i class="bi bi-star"></i>';
                    }
                }

                lateral.innerHTML += `
          <div class="product-lateral" onclick="pagina(${response.products[i].id})">
            <img src="${response.products[i].image}" alt="" class="product-img">
            <div class="product-info">
              <h2 class="product-title-lateral">${title.length > 20 ? title.substring(0, 20).concat('...') : title}</h2>
              <p class="product-rate">${ratingHTML}</p>
              <h3 class="product-price">$ ${formattedPrice}</h3>
              <a href="#!" data-productId="${response.products[i].id}" class="add-to-cart-2"><ion-icon name="cart-outline"></ion-icon></a>
            </div>
          </div>
          <hr/>
        `;
                cont++;
            }
            currentPage++;
            if (contd == 9 && cont == 6) {
                break;
            }
        }
    }

    fetchProducts('https://diwserver.vps.webdock.cloud/products?page={}');
});

// Página do produto
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
let productPage = document.querySelector('.product-details');

async function fetchProductDetails(productId) {

    let response = await fetch(`https://diwserver.vps.webdock.cloud/products/${productId}`);
    let productData = await response.json();
    var ratingHTML = '';

    for (let j = 1; j <= 5; j++) {
        if (j <= productData.rating.rate) {
            ratingHTML += '<i class="bi bi-star-fill"></i>';
        } else {
            ratingHTML += '<i class="bi bi-star"></i>';
        }
    }
    const price = productData.price;
    const priceString = price.toString();
    const formattedPrice = priceString.slice(0, 2) + '.' + priceString.slice(2);
    productPage.innerHTML = `
      <div class="product-single">
      <div class="uppart">
        <img src="${productData.image}" alt="" class="product-img-single">
        <div class="details">
          <h2 class="product-title-single">${productData.title}</h2>
          <p class="product-rate-single">${ratingHTML}</p>
          <p class="product-review-single">(${productData.rating.count} Reviews)</p>
          <div class="product-price-container-single">
            <h3 class="product-price-single">$ ${formattedPrice}</h3>
            <a href="#!"><button class="buy-button">Buy Product</button></a>
            <a href="#!" data-productId="${productData.id}" class="add-to-cart-single"><ion-icon name="cart-outline"></ion-icon> Adicionar ao carrinho</a>
          </div>
        </div>
      </div>
      </div>
      <div class="description">
        <h3 class="prod-descr">Product Description</h3>
        <p class="product-description-single">${productData.description}</p>
      </div>
      <div class="info-desc">
        <h3 class="prod-descr">Brand</h3>
        <p class="product-description-single">${productData.brandName}</p>
      </div>
      <div class="info-desc">
        <h3 class="prod-descr">Season</h3>
        <p class="product-description-single">${productData.season}</p>
      </div>
      <div class="info-desc">
        <h3 class="prod-descr">Usage</h3>
        <p class="product-description-single">${productData.usage}</p>
      </div>
      <div class="info-desc">
        <h3 class="prod-descr">Gender</h3>
        <p class="product-description-single">${productData.gender}</p>
      </div>
      <div class="info-desc">
        <h3 class="prod-descr">Article Number</h3>
        <p class="product-description-single">${productData.articleNumber}</p>
      </div>
      <div class="info-desc-f">
        <h3 class="prod-descr">Article type</h3>
        <p class="product-description-single">${productData.articleType}</p>
      </div>
    `;
}

fetchProductDetails(productId);

function pagina(productId) {
    // redirecionar para pagina do produto
    window.location.href = `detalhes.html?id=`+productId;
}

document.addEventListener('DOMContentLoaded', () => {
    const inputSearch = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    searchButton.addEventListener('click', () => {
        //botão de pesquisa
        const searchTerm = inputSearch.value.toLowerCase();
        window.location.href = `pesquisa.html?search=` +encodeURIComponent(searchTerm);
        // Redireciona para a página de pesquisa com o termo buscado no input
    });
});

// BARRA DE PESQUISA
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get('search');
    const inputSearch = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const content = document.querySelector('.content');
    let produtos = []; 

    fetch('https://diwserver.vps.webdock.cloud/products')
        .then((res) => res.json())
        .then((data) => {
            produtos = data.products;

            // verificar se tem um termo no input
            if (searchTerm) {
                inputSearch.value = searchTerm;
                const filteredProducts = filterProducts(searchTerm);
                renderProducts(filteredProducts);
            } else {
                const noResultsMessage = document.createElement('p');
                noResultsMessage.innerHTML = `<div class="produto-not-1"><h3 class="product-notfound" >Pesquise o seu produto aqui!</h3></div>`;
                content.appendChild(noResultsMessage);
            }
        })
        .catch((error) => {
            console.log(error);
        });

    // Filtrar os produtos a partir do termo inserido no input
    function filterProducts(searchTerm) {
        return produtos.filter((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Função para renderizar os produtos na página
    function renderProducts(products) {
        
        content.innerHTML = ""; 

        if (products.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.innerHTML = `<div class="produto-not"><h3 class="product-notfound">Nenhum resultado encontrado.</h3></div>`;
            content.appendChild(noResultsMessage);
        } else {
            products.forEach((product) => {
                const price = product.price;
                const priceString = price.toString();
                const formattedPrice = priceString.slice(0, 2) + '.' + priceString.slice(2);
                const div = document.createElement("div");
                let descricao = product.description;
                div.innerHTML = `
            <div class="product-search" data-productId="${product.id}" onclick="redirectToProductPage(productId)">
              <img src="${product.image}" alt="" class="product-img-search">
              <div class="details-search">
                <h2 class="product-title-search">${product.title}</h2>
                <p class="product-rate-search">Rate: ${product.rating.rate} (${product.rating.count} Reviews) </p>
                <div class="product-price-container-search">
                  <h3 class="product-price-search">$ ${formattedPrice}</h3>
                  <p class="product-description-search">${descricao.length > 20 ? descricao.substring(0, 150).concat(' <strong>...more</strong>') : descricao}</p><br>
                  <a href="#!" data-productId="${product.id}" class="see-product">See Product</a>
                </div>
              </div>
            </div>
          `;

                content.appendChild(div);

                const productDiv = div.querySelector('.product-search');
                productDiv.addEventListener('click', () => {
                    redirectToProductPage(product.id);
                });
            });
        }
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = inputSearch.value.trim();
        const filteredProducts = filterProducts(searchTerm);
        renderProducts(filteredProducts);
    });

    function redirectToProductPage(productId) {
        window.location.href = `detalhes.html?id=`+ productId;
    }
});



//filtro de categoria
document.addEventListener('DOMContentLoaded', () => {

    async function fetchProductsall(url) {

        let products = document.querySelector('.produtos-grid');
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
            let pageUrl = url.replace('{}', currentPage);
            let data = await fetch(pageUrl);
            let response = await data.json();

            console.log(response);
            totalPages = response.total_pages;

            for (let i = 0; i < response.products.length; i++) {
                let category = response.products[i].category;

                if (!document.querySelector(`#categ option[value="${category}"]`)) {
                    let option = document.createElement('option');
                    option.value = category;
                    option.text = category;
                    document.querySelector('#categ').appendChild(option);
                }
            }

            for (let i = 0; i < 20; i++) {
                let contd = 1;
                const price = response.products[i].price;
                const priceString = price.toString();
                const formattedPrice = priceString.slice(0, 2) + '.' + priceString.slice(2);


                var ratingHTML = '';
                for (let j = 1; j <= 5; j++) {
                    if (j <= response.products[i].rating.rate) {
                        ratingHTML += '<i class="bi bi-star-fill"></i>';
                    } else {
                        ratingHTML += '<i class="bi bi-star"></i>';
                    }
                }

                let title = response.products[i].title;

                products.innerHTML += `
            <div class="product">
              <img src="${response.products[i].image}" alt="" class="product-img" onclick="pagina(${response.products[i].id})">
              <h2 class="product-title">${title.length > 20 ? title.substring(0, 20).concat('...') : title}</h2>
              <p class="product-rate">${ratingHTML}</p>
              <div class="product-price-container">
              <h3 class="product-price">$ ${formattedPrice}</h3>
                <a href="#!" data-productId="${response.products[i].id}" class="add-to-cart"><ion-icon name="cart-outline"></ion-icon></a>
              </div>
            </div>
          `;
                contd++;
            }
            currentPage++;
        }
    }

    fetchProductsall('https://diwserver.vps.webdock.cloud/products?page={}');

    document.querySelector('.category-btn').addEventListener('click', function(event) {
        event.preventDefault(); 
      
        filterProductsByCategory();
      });
      

// Função para filtrar os produtos por categoria
async function filterProductsByCategory() {
    let pageUrl = 'https://diwserver.vps.webdock.cloud/products?page={}';

    let data = await fetch(pageUrl);
    let response = await data.json();
    let selectedCategory = document.querySelector('#categ').value;
    let filteredProducts = response.products.filter(product => product.category === selectedCategory);
  
    document.querySelector('.produtos-grid').innerHTML = '';
  
    for (let i = 0; i < filteredProducts.length; i++) {
      const price = filteredProducts[i].price;
      const priceString = price.toString();
      const formattedPrice = priceString.slice(0, 2) + '.' + priceString.slice(2);
      const imgprod = filteredProducts[i].image;
      const idprod = filteredProducts[i].id;
  
      var ratingHTML = '';
      for (let j = 1; j <= 5; j++) {
        if (j <= filteredProducts[i].rating.rate) {
          ratingHTML += '<i class="bi bi-star-fill"></i>';
        } else {
          ratingHTML += '<i class="bi bi-star"></i>';
        }
      }
  
      let title = filteredProducts[i].title;
      let productHTML = `
        <div class="product" onclick="pagina(${idprod})">
          <img src="${imgprod}"  class="product-img">
          <h4>${title}</h4>
          <div class="product-rate"><strong>${ratingHTML}</strong></div>
          <p class="price">$${formattedPrice}</p>
          
        </div>
      `;
  
      document.querySelector('.produtos-grid').insertAdjacentHTML('beforeend', productHTML);
    }
  }
  
  document.querySelector('.category-btn').addEventListener('click', filterProductsByCategory);
  
});

//menu mobile
function menuShow(){
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile.classList.contains('open')){
        menuMobile.classList.remove('open');
    }
    else{
        menuMobile.classList.add('open');
    }
}
document.addEventListener('DOMContentLoaded', () => {
  const inputSearch = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  searchButton.addEventListener('click', () => {
      const searchTerm = inputSearch.value.toLowerCase();
      window.location.href = `/pesquisa.html?search=` +encodeURIComponent(searchTerm);
  });
});
