describe('Content Management Page', () => {
  beforeEach(() => {
    // 登录流程
    cy.visit('/login');
    cy.get('input[placeholder="Username *"]').type('admin_nxz');
    cy.get('input[placeholder="Password *"]').type('123456');
    cy.contains('Login').click();

    // 进入 Content Management 页面
    cy.url().should('include', '/dashboard');
    cy.contains('Content Management').click();
    cy.url().should('include', '/content-management');
    cy.contains('Content Management').should('be.visible');
  });

  it('should render UI elements', () => {
    cy.contains('Upload File').should('be.visible');
    cy.get('input[placeholder="Search by file name..."]').should('exist');
    cy.contains('th', 'File Name').should('exist');
    cy.contains('th', 'Upload Time').should('exist');
    cy.contains('th', 'Preview').should('exist');
    cy.contains('th', 'Actions').should('exist');
  });

  it('should upload a file (real image)', () => {
    cy.contains('Upload File').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test.png', { force: true });
    cy.wait(2000); // 等待上传完成
  });

  it('should filter files by search keyword', () => {
    cy.get('input[placeholder="Search by file name..."]').type('test');
    cy.wait(500);
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('test', { matchCase: false });
    });
  });

  context('when files exist', () => {
    it('should have download link with download attribute', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('a')
          .should('have.attr', 'download');

        cy.get('a')
          .invoke('attr', 'href')
          .should('match', /\.(txt|pdf|jpg|jpeg|png|mp4|docx)$/); // ✅ 检查扩展名
      });
    });

    it('should delete a file', () => {
      cy.get('table tbody tr').then($rows => {
        if ($rows.length > 0) {
          cy.get('table tbody tr').first().within(() => {
            cy.contains('Delete').click();
          });
          cy.on('window:confirm', () => true);
          cy.wait(1000);
        }
      });
    });

    it('should show file details', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('td').eq(0).should('not.be.empty'); // File name
        cy.get('td').eq(1).should('not.be.empty'); // Upload time
        cy.get('td').eq(2).contains('Download');  // Download button
      });
    });
  });

  it('should show empty state gracefully', () => {
    cy.get('table tbody tr').then($rows => {
      if ($rows.length === 0) {
        cy.contains('No files').should('exist');
      }
    });
  });
});