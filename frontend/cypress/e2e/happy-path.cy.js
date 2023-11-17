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
    cy.get('#inputUserEmail').type('exampleUser12@email.com');

    // Input Username
    cy.get('#inputUserName').type('exampleUser');

    // Input Password
    cy.get('#inputUserPassword').type('exampleUser');

    // Check Password
    cy.get('#checkUserPassword').type('exampleUser');

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
    cy.get('input[type="text"]').eq(0).type('Sample test12');

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
    cy.get('input[type="checkbox"].form-check-input').check({ force: true });
    cy.get('button#createHosting').click();

    cy.get('.ant-message').should('contain', 'Create successfully');
  });

  // Step4 START =====> LogOut and Login.
  it('Logout Successful & login successfully', () => {
    cy.visit('localhost:3000/hosting');
    // Click on the user button.
    cy.get('button#userButton').click();
    // Click on the logout button.
    cy.get('a#logoutButton').click();
    // Should see a logout message.
    cy.get('.ant-message').should('contain', 'Logout successfully');
    // Click on the login button.
    cy.visit('localhost:3000/login');
    // Input Email
    cy.get('#inputUserEmail').type('exampleUser12@email.com');
    // Input Password
    cy.get('#inputUserPassword').type('exampleUser');
    // Submit
    cy.get('button#loginButton').click();
    // Show a login message.
    cy.get('.ant-message').should('contain', 'Login successfully');
  });
});
