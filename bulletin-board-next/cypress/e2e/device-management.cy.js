/// <reference types="cypress" />

describe('Device Management Page', () => {
  beforeEach(() => {
    // 登录流程
    cy.visit('/login');
    cy.get('input[placeholder="Username *"]').type('admin_nxz', { force: true });
    cy.get('input[placeholder="Password *"]').type('123456', { force: true });
    cy.contains('Login').click({ force: true });

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
    cy.contains('th', 'Actions').should('exist');
  });

  it('should open Add Device modal', () => {
    cy.contains('+ Add Device').click();
    cy.contains('Add Device').should('be.visible');
  });

  it('should add, edit, and then delete the last device', () => {
    // 创建设备
    cy.contains('+ Add Device').click();
    cy.contains('Add Device').should('be.visible');
    cy.get('.fixed.inset-0').within(() => {
      cy.get('input').eq(0).type('CypressTestDevice', { force: true });
      cy.get('input').eq(1).type('CypressLocation', { force: true });
      cy.get('input').eq(2).type('192.168.1.200', { force: true });
      cy.get('input').eq(3).type('00-22-33-44-55-66', { force: true });
      cy.contains('Save').click({ force: true });
    });
    cy.get('.fixed.inset-0').should('not.exist');

    // 编辑刚创建的设备（最后一行）
    cy.get('table tbody tr').last().within(() => {
      cy.contains('Edit').click({ force: true });
    });
    cy.contains('Edit Device').should('be.visible');
    cy.get('input').eq(0).clear({ force: true }).type('CypressTestDevice-Edit', { force: true });
    cy.contains('Save').click({ force: true });
    cy.get('.fixed.inset-0').should('not.exist');

    // 清空搜索框，确保能看到所有设备
    cy.get('input[placeholder="Search by name or location..."]').clear({ force: true });
    cy.wait(1000);
    cy.get('table tbody tr').should('exist');

    // 删除刚编辑的设备（最后一行）
    cy.get('table tbody tr').last().within(() => {
      cy.contains('Delete').click({ force: true });
    });
    cy.on('window:confirm', () => true);
    cy.wait(1000);
    cy.get('table tbody tr').should('not.contain', 'CypressTestDevice-Edit');
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