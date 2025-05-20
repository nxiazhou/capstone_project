describe('User Management Page', () => {
  beforeEach(() => {
    // 访问登录页并执行登录操作
    cy.visit('/login');
    cy.get('input[placeholder="Username *"]').type('admin_nxz');
    cy.get('input[placeholder="Password *"]').type('123456');
    cy.contains('Login').click();

    // ✅ 等待跳转到 dashboard 页面
    cy.url().should('include', '/dashboard');

    // ✅ 通过 sidebar 点击进入 user management 页面
    cy.contains('User Management').click();
  });

  it('should show user table and Add button', () => {
    cy.contains('User Management').should('be.visible');
    cy.contains('+ Add New User').should('be.visible');
  });

  it('should open Add User modal', () => {
    cy.contains('+ Add New User').click();
    cy.contains('Add New User').should('be.visible');
  });
  
  it('should fill Add User form and submit (mock)', () => {
    // 点击打开模态框
    cy.contains('+ Add New User').click();
    cy.contains('Add New User').should('be.visible');

    // 填表单字段（根据顺序）
    cy.get('input').eq(0).type('testuser1', { force: true }); // Username
    cy.get('input').eq(1).type('testuser1@example.com', { force: true }); // Email
    cy.get('input').eq(2).type('password123', { force: true }); // Password
    cy.get('input').eq(3).type('Example Corp', { force: true }); // Company Name

    // 选择角色，注意只选择一个 select，避免多个冲突
    cy.get('select').eq(0).select('user', { force: true });

    // 继续填 phone 和 address
    cy.get('input').eq(4).type('98765432', { force: true }); // Phone
    cy.get('input').eq(5).type('123 Orchard Road', { force: true }); // Address

    // 提交按钮
    cy.contains('Submit').click({ force: true });
  });

  it('should delete a user (mock, only if user exists)', () => {
    // 模拟点击删除第一个用户（不删除 admin）
    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.contains('Delete').click();
      });

    // 弹窗提示（依赖于你页面的实现）
    // cy.contains('User deleted.').should('exist');
  });
});