describe('Конструктор бургера', () => {
  it('загружает ингредиенты', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');

    cy.get('[data-cy^=add-]').should('exist');
  });

  it('добавляет ингредиент в конструктор', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');

    cy.get('[data-cy^=add-]').first().click();

    cy.get('[data-cy=constructor-list]').should('not.be.empty');
  });

  it('открывает и закрывает модалку', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');

    cy.get('[data-cy^=ingredient-]').first().click();

    cy.get('[data-cy=modal]').should('exist');

    cy.get('[data-cy=modal-close]').click();

    cy.get('[data-cy=modal]').should('not.exist');
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
        order: { number: 12345 }
      }
    }).as('createOrder');

    cy.setCookie('accessToken', 'test');
    window.localStorage.setItem('refreshToken', 'test');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');

    cy.get('[data-cy^=add-]').first().click();
    cy.get('[data-cy^=add-]').eq(1).click();

    cy.get('[data-cy=order-button]').click();

    cy.wait('@createOrder');

    cy.get('[data-cy=order-number]').should('contain', '12345');

    cy.get('[data-cy=modal-close]').click();

    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=constructor-list]').should('be.empty');
  });
});
