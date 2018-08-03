(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        // fetch the unsplash image content
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 462d22cae6dd1d4877bb082c9e9c6502893a9bb7305d4bf8f681d13b56d4abc3'
            }
        })
            // then parse the information though .json()
            .then(response => response.json())
            // then add the image to the page
            .then(addImage)
            // catch if search or network error
            .catch(e => requestError(e, 'image'));
        // add images to the page function
        function addImage(data) {
            let htmlContent = '';
            const firstImage = data.results[0];
            // if image data exists, add it to the page
            if (firstImage) {
                htmlContent = `<figure>
                  <img src="${firstImage.urls.small}" alt="${searchedForText}">
                  <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
              </figure>`;
                // if the data doesn't exist, display below content
            } else {
                htmlContent = 'Unfortunately, no image was returned for your search.';
            }
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }
        // error thrown upon network error or search error
        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }
        // fetch the nytimes article
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`)
            // then parse the result
            .then(response => response.json())
            // then add the article to the page
            .then(addArticle)
            // catch upon network or search error
            .catch(e => requestError(e, 'article'));
        // add articles to page
        function addArticle(data) {
            let htmlContent = '';
            // if article exists add it to the page
            if (data.response && data.response.docs && data.response.docs.length > 1) {
                const articles = data.response.docs;
                htmlContent = '<ul>' + articles.map(article => `<li class="article">
                      <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                            <p>${article.snippet}</p>
                  </li>`
                ).join('') + '</ul>';
                // if article doesn't exist then add the below to the page
            } else {
                htmlContent = '<div class="error-no-articles">No articles available</div>';
            }
            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
    });
})();
