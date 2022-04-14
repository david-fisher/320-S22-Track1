/// <reference types="cypress" />

describe('TimeRange works correctly', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      // We set the "baseUrl" in cypress.json so we can use '/' to refer to the baseUrl
      cy.visit('/log-events');
    });

    it('displays the TimeRange component', () => {
      // We use the `cy.get()` command to get all elements that match the selector.
      // Then, we use `should` to assert that there are elements that match
      cy.get('.timerange').should('exist');
    });

    it('displays both start and end date', () => {
      // to check if the dropdown is visible
      cy.get('.timerange').should('be.visible');

      
      cy.get('.timerange > #timerangestack').contains("Start Time").should("exist");
      // cy.get('.timerange > #timerangestack > #startformcontrol').should("have.length", 5);
      cy.get('.timerange > #timerangestack').contains("End Time").should("exist");
    });

    it('displays what date the user enters', () => {
      cy
        .get('[id="startformcontrol"]').click()
        .type('2017-06-01T08:30')
        .get("#startimeinput")
        .should('have.value', '2017-06-01T08:30');
      cy
        .get('[id="endformcontrol"]').click()
        .type('2017-06-01T08:30')
        .get("#endtimeinput")
        .should('have.value', '2017-06-01T08:30');
    });

    it('shows an error when the start time is after the end time', () => {
      cy
        .get('[id="startformcontrol"]').click()
        .type('2018-06-01T08:30');
      cy
        .get('[id="endformcontrol"]').click()
        .type('2017-06-01T08:30')
        .contains('Start must be before End');
    });

    it('shows an error when improper input is entered', () => {
      
      cy
        .get('[id="startformcontrol"]').click()
        .type('0000-00-00T08:30')
        .contains('Input is missing a value');
      cy
        .get('[id="endformcontrol"]').click()
        .type('2017-00-01T08:30')
        .contains('Input is missing a value');
        
    });

    it("validates if there is an error, the apply button is disabled", () => {
      cy
        .get('[id="startformcontrol"]').click()
        .type('2018-06-01T08:30')
      cy
        .get('[id="endformcontrol"]').click()
        .type('2017-06-01T08:30')
     
  
      cy.get(".apply-filters-btn").should("be.disabled");
    });



     
});