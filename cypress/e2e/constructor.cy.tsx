const testUrl = '/';
const ingredientAddButton = '[data-cy^=add-]';
const constructorList = '[data-cy=constructor-list]';
const modal = '[data-cy=modal]';
const modalCloseButton = '[data-cy=modal-close]';

describe('Конструктор бургера', () => {
  it('загружает ингредиенты', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit(testUrl);
    cy.wait('@getIngredients');

    cy.get(ingredientAddButton).should('exist');
  });

  it('добавляет ингредиент в конструктор', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit(testUrl);
    cy.wait('@getIngredients');

    cy.get(ingredientAddButton).first().click();

    cy.get(constructorList).should('not.be.empty');
  });

  it('открывает и закрывает модалку', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit(testUrl);
    cy.wait('@getIngredients');

    cy.get('[data-cy^=ingredient-]').first().click();

    cy.get(modal).should('exist');

    cy.get(modalCloseButton).click();

    cy.get(modal).should('not.exist');
  });

  it('создаёт заказ', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      success: true,
      user: { email: 'pushkarevromana@gmail.com', name: 'kr1spy' }
    });

    cy.intercept('POST', '**/api/orders', {
      body: {
        success: true,
        order: {
          _id: '123',
          ingredients: ['ing1', 'ing2'],
          status: 'done',
          name: 'Cheeseburger',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          number: 12345
        }
      }
    }).as('createOrder');

    cy.setCookie('accessToken', 'test');
    window.localStorage.setItem('refreshToken', 'test');
    cy.visit(testUrl);
    cy.wait('@getIngredients');

    cy.get(ingredientAddButton).first().click();
    cy.get(ingredientAddButton).eq(1).click();

    cy.get('[data-cy=order-button]').click();

    cy.wait('@createOrder');

    cy.get('[data-cy=order-number]').should('contain', '12345');

    cy.get(modalCloseButton).click();

    cy.get(modal).should('not.exist');

    cy.get(constructorList).should('be.empty');
  });
});
