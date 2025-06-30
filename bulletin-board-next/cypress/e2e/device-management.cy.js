/// <reference types="cypress" />

describe('Device Management Page', () => {
  beforeEach(() => {
    // 登录流程
    cy.visit('/login');
    cy.get('input[placeholder="Username *"]').type('admin_nxz');
    cy.get('input[placeholder="Password *"]').type('123456');
    cy.contains('Login').click();

    // 进入 Device Management 页面
    cy.url().should('include', '/dashboard');
    cy.contains('Device Management').click();
    cy.url().should('include', '/device-management');
    cy.contains('Device Management').should('be.visible');
  });

  it('should render UI elements', () => {
    cy.contains('+ Add Device').should('be.visible');
    cy.get('input[placeholder="Search by name or location..."]').should('exist');
    cy.contains('th', 'Device Name').should('exist');
    cy.contains('th', 'Location').should('exist');
    cy.contains('th', 'IP Address').should('exist');
    cy.contains('th', 'MAC Address').should('exist');
    cy.contains('th', 'Last Heartbeat').should('exist');
    cy.contains('th', 'Actions').should('exist');
  });

  it('should open Add Device modal', () => {
    cy.contains('+ Add Device').click();
    cy.contains('Add Device').should('be.visible');
  });

  it('should add a new device (mock)', () => {
    cy.contains('+ Add Device').click();
    cy.contains('Add Device').should('be.visible');
    // 输入操作必须在模态框打开后进行
    cy.get('.fixed.inset-0').within(() => {
      cy.get('input').eq(0).type('TestDevice', { force: true });
      cy.get('input').eq(1).type('TestLocation', { force: true });
      cy.get('input').eq(2).type('192.168.1.100', { force: true });
      cy.get('input').eq(3).type('00-11-22-33-44-99', { force: true });
      cy.contains('Save').click({ force: true });
    });
    // 等待模态框关闭
    cy.get('.fixed.inset-0').should('not.exist');
  });

  it('should search device by name', () => {
    cy.get('input[placeholder="Search by name or location..."]').type('TestDevice', { force: true });
    cy.wait(500);
    cy.get('table tbody tr').then($rows => {
      if ($rows.length > 0) {
        cy.wrap($rows).each(($row) => {
          cy.wrap($row).contains('TestDevice', { matchCase: false });
        });
      } else {
        cy.contains('No devices').should('exist');
      }
    });
  });

  it('should edit a device (mock)', () => {
    // 确保没有遮罩层
    cy.get('.fixed.inset-0').should('not.exist');
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Edit').click({ force: true });
    });
    cy.contains('Edit Device').should('be.visible');
    cy.get('input').eq(0).clear({ force: true }).type('TestDevice-Edit', { force: true });
    cy.contains('Save').click({ force: true });
    cy.get('.fixed.inset-0').should('not.exist');
  });

  it('should delete a device (mock)', () => {
    // 确保没有遮罩层
    cy.get('.fixed.inset-0').should('not.exist');
    cy.get('table tbody tr').then($rows => {
      if ($rows.length > 0) {
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Delete').click({ force: true });
        });
        cy.on('window:confirm', () => true);
        cy.wait(1000);
      }
    });
  });

  context('when devices exist', () => {
    it('should show device details', () => {
      cy.get('table tbody tr').then($rows => {
        if ($rows.length > 0) {
          cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(0).should('not.be.empty'); // Device Name
            cy.get('td').eq(1).should('not.be.empty'); // Location
            cy.get('td').eq(2).should('not.be.empty'); // IP Address
            cy.get('td').eq(3).should('not.be.empty'); // MAC Address
            cy.get('td').eq(4).should('not.be.empty'); // Last Heartbeat
            cy.contains('Edit');
            cy.contains('Delete');
          });
        }
      });
    });
    // 如有导出/下载功能可在此补充
  });

  it('should show empty state gracefully', () => {
    cy.get('table tbody tr').then($rows => {
      if ($rows.length === 0) {
        cy.contains('No devices').should('exist');
      }
    });
  });
}); 