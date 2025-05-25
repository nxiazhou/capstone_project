// cypress/e2e/content-management.cy.js

describe('Content Management Page', () => {
  beforeEach(() => {
    // 登录操作
    cy.visit('/login');
    cy.get('input[placeholder="Username *"]').type('admin_nxz');
    cy.get('input[placeholder="Password *"]').type('123456');
    cy.contains('Login').click();

    // 等待跳转到 dashboard 页面
    cy.url().should('include', '/dashboard');

    // 通过 sidebar 进入 content management 页面
    cy.contains('Content Management').click();
    cy.contains('Content Management').should('be.visible');
  });

  it('should show content management page and Upload button', () => {
    cy.contains('Content Management').should('be.visible');
    cy.contains('Upload File').should('be.visible');
  });

  it('should have search input', () => {
    cy.get('input[placeholder="Search by file name..."]').should('exist');
  });

  it('should show table headers', () => {
    cy.contains('th', 'File Name').should('be.visible');
    cy.contains('th', 'Upload Time').should('be.visible');
    cy.contains('th', 'Actions').should('be.visible');
  });

  it('should open upload file modal', () => {
    cy.contains('Upload File').click();
    cy.get('input[type="file"]').should('exist');
  });

  it('should upload file (mock)', () => {
    cy.contains('Upload File').click();
    cy.get('input[type="file"]').should('exist').then(($input) => {
      const testFile = new File(['test content'], 'test-image.jpg', { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      $input[0].files = dataTransfer.files;
      cy.wrap($input).trigger('change', { force: true });
    });
    cy.wait(2000);
  });

  it('should search for files', () => {
    const searchTerm = 'test';
    cy.get('input[placeholder="Search by file name..."]').type(searchTerm);
    cy.wait(1000);
  });

  context('with existing files', () => {
    beforeEach(() => {
      cy.wait(1000);
    });

    it('should preview file', () => {
      cy.get('table tbody tr').then($rows => {
        if ($rows.length > 0) {
          cy.get('table tbody tr').first().contains('View').click();
        }
      });
    });

  it('should delete file', () => {
    cy.get('table tbody tr').then($rows => {
      if ($rows.length > 0) {
        cy.get('table tbody tr').first().contains('Delete').click();
        cy.on('window:confirm', () => true);
        cy.wait(1000);
      } else {
        // 🔁 如果没有文件，上传 test.png 并删除
        cy.fixture('test.png', 'base64').then(fileContent => {
          const token = localStorage.getItem('authToken');
          cy.request({
            method: 'POST',
            url: '/api/files/upload',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: {
              file: {
                fileName: 'test.png',
                mimeType: 'image/png',
                contents: fileContent,
              },
            },
            form: true
          }).then(() => {
            cy.reload();
            cy.wait(1000);
            cy.get('table tbody tr').first().contains('Delete').click();
            cy.on('window:confirm', () => true);
          });
        });
      }
    });
  });

  it('should show file details if any exist', () => {
    cy.get('table tbody').then($tbody => {
      const $rows = $tbody.find('tr');
      if ($rows.length > 0) {
        cy.wrap($rows[0]).within(() => {
          cy.get('td').should('have.length.at.least', 3);
          cy.get('td').eq(0).should('not.be.empty');
          cy.get('td').eq(1).should('not.be.empty');
        });
      } else {
        cy.log('No files to show details');
      }
    });
  });

  });

it('should handle empty content list', () => {
  cy.get('table tbody').then($tbody => {
    expect($tbody.find('tr').length).to.eq(0);  // ✅ 没有 tr 就通过
  });
});
});
