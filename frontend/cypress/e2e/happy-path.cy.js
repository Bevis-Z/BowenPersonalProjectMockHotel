describe('Happy Path', () => {
  // Before each test we need to restore local storage to preserve it.
  beforeEach(() => {
    cy.restoreLocalStorage()
  });
  // After each test we save local storage.
  afterEach(() => {
    cy.saveLocalStorage()
  });
  // Step1 START =====> Enter landing page.
  it('Enter landing page successfully', () => {
    // Enter the landing page.
    cy.visit('http://localhost:3000');
    cy.url().should('include', 'localhost:3000');
    cy.get('img').should('have.attr', 'alt', 'logo');
  });
  // <==================== END ==========================>
  // Step2 START =====> Create a new account.
  it('Create a new account successfully', () => {
    cy.visit('localhost:3000/register');
    cy.url().should('include', 'localhost:3000/register');
    // Input Email
    cy.get('#inputUserEmail').type('example666666645@email.com');

    // Input Username
    cy.get('#inputUserName').type('exampleuser346');

    // Input Password
    cy.get('#inputUserPassword').type('password123');

    // Check Password
    cy.get('#checkUserPassword').type('password123');

    // Submit
    cy.get('button#registerBtn').click();
    cy.get('.ant-message').should('have.text', 'Register successfully');
    cy.url().should('include', 'localhost:3000/');
  });
  // <==================== END ==========================>
  // Step3 START =====> Create a new host.
  it('Create a new host successfully', () => {
    cy.visit('localhost:3000/hosting');
    cy.url().should('include', 'localhost:3000/hosting');
    // Click on the create host button.
    cy.get('button#createHost').click();
    // Input Host Name
    cy.get('input[type="text"]').eq(0).type('Sample 663t5');

    // Input Host Description
    cy.get('input[type="text"]').eq(1).type('123 Main St');

    // Input Host Location
    cy.get('input[type="text"]').eq(2).type('100');

    cy.get('select').select('House');

    // Submit
    cy.get('button.btn-primary').click();

    cy.get('.bathroom input[type="text"]').type('2');
    cy.get('button#addBedroom').click()
    cy.get('#bedRoomSelect').select('master');
    cy.get('.inputBedCount input[type="number"]').type('2');
    cy.get('input[type="checkbox"].form-check-input').check({ force: true });
    cy.get('button#createHosting').click();

    cy.get('.ant-message').should('contain', 'Create successfully');
  });
});
