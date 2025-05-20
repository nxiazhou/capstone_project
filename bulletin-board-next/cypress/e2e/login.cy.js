describe('Login Page', () => {
  it('should show username required error', () => {
    cy.visit('/login');
    cy.contains('Login').click();
    cy.contains('Please enter username');
  });

  it('should show password required error', () => {
    cy.visit('/login');
    cy.get('input[placeholder="Username *"]').type('admin');
    cy.contains('Login').click();
    cy.contains('Please enter password');
  });

  it('should open signup modal', () => {
    cy.visit('/login');
    cy.contains('Sign up').click();
    cy.contains('Sign Up');
  });
});
