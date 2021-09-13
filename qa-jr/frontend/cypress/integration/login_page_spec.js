describe('The Login Page', () => {

    beforeEach(() => {
        
        // reset localStorage
        cy.clearLocalStorage("@token")
   
    })

    it('Visits the Map Page', () => {

        cy.visit('/login')

        cy.get('input[name=email]')
            .type(Cypress.env('login_email'))
            .should('have.value', Cypress.env('login_email'))

        cy.get('input[type=password]')
            .type(Cypress.env('login_password'))
            .should('have.value', Cypress.env('login_password'))

        cy.get('button[type=submit]')
            .click()

        // we should be redirected to /mapa
        cy.location('pathname', {timeout: 20000}).should('include', '/mapa', () => {

            // our auth token should be present into localStorage
            expect(localStorage.getItem("@token")).to.exist
        })

    })
});