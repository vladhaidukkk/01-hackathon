import { Popup } from '../components/popup';
import { Module } from '../core/module';

export class CocktailModule extends Module {
    #urls;
    #popup;

    constructor() {
        super('cocktailModule', 'Get daily cocktail');
        this.#urls = {
            randomCocktail: 'https://www.thecocktaildb.com/api/json/v1/1/random.php',
        };
        this.#popup = new Popup();
    }

    #createLoader() {
        const loader = document.createElement('div');
        loader.className = 'lds-ripple';
        loader.innerHTML = '<div></div><div></div>';

        return loader;
    }

    #generateCard(data) {
        const { strDrinkThumb, strDrink, strInstructions } = data;

        const ingridients = [];
        const quantity = [];
        for (let i = 1; i <= 15; i++) {
            if (data[`strIngredient${i}`]) {
                ingridients.push(data[`strIngredient${i}`]);
                quantity.push(data[`strMeasure${i}`]);
            } else {
                break;
            }
        }

        const cocktailCard = document.createElement('div');
        cocktailCard.className = 'cocktail-box mt-2';

        const cocktailCardTop = document.createElement('div');
        cocktailCardTop.className = '';

        const img = document.createElement('img');
        img.src = strDrinkThumb;
        img.alt = strDrink + ' image';
        img.className = 'cocktail-box__image w-2/6 float-left rounded mr-4 shadow-md';

        const cocktailInfo = document.createElement('div');
        cocktailInfo.className = 'cocktail-box__info text-gray-700';

        const cocktailName = document.createElement('p');
        cocktailName.textContent = `Coctail name: ${strDrink}`;

        const ingridientsElem = document.createElement('p');
        ingridientsElem.innerText = 'Ingridients:';

        cocktailInfo.append(cocktailName);
        ingridients.forEach((item, i) => {
            const ingridient = document.createElement('p');
            ingridient.textContent = `${item}: ${quantity[i]}`;
            cocktailInfo.append(ingridient);
        });
        const instructions = document.createElement('p');
        instructions.textContent = strInstructions;


        const generateButton = document.createElement('button');
        generateButton.className = 'cocktail-card__button btn rounded bg-blue-400 px-2 py-1 mt-4 hover:bg-blue-300 text-white w-full transition-all';
        generateButton.type = 'button';
        generateButton.innerText = 'Generate new';


        cocktailInfo.append(instructions);
        cocktailCardTop.append(img, cocktailInfo);
        cocktailCard.append(cocktailCardTop, generateButton);

        return cocktailCard;
    }

    async #generateNew() {
        try {
            this.#popup.update(this.#createLoader().outerHTML);
            const cocktail = await this.#fetchRandomCocktail();
            const generatedHTML = this.#generateCard(cocktail).outerHTML;
            this.#popup.update(generatedHTML);
            const generateButton = document.querySelector('.cocktail-card__button');
            generateButton.addEventListener('click', this.#generateNew.bind(this));
        } catch (error) {
            console.log(error);
        }
    }

    async #fetchRandomCocktail() {
        try {
            const response = await fetch(this.#urls.randomCocktail);
            const data = await response.json();
            const cocktail = data.drinks[0];
            return cocktail;
        } catch (error) {
            console.log(error);
        }
    }

    async trigger() {
        try {
            this.#popup.setContent(this.#createLoader());
            this.#popup.open();
            const cocktail = await this.#fetchRandomCocktail();
            this.#popup.setHeader(`Today's cocktail for you`);
            this.#popup.setContent(this.#generateCard(cocktail).outerHTML);
            this.#popup.update();
            const generateButton = document.querySelector('.cocktail-card__button');
            generateButton.addEventListener('click', this.#generateNew.bind(this));
        } catch (error) {
            console.log(error);
        }
    }
}
