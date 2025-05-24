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
    
    // 等待页面加载
    cy.contains('Content Management').should('be.visible');
  });

  it('should show content management page and Upload button', () => {
    cy.contains('Content Management').should('be.visible');
    // 使用label文本查找按钮
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
    // 等待文件输入框出现
    cy.get('input[type="file"]').should('exist');
  });

  it('should upload file (mock)', () => {
    // 点击上传按钮
    cy.contains('Upload File').click();
    
    // 等待文件输入框出现并上传文件
    cy.get('input[type="file"]').should('exist').then(($input) => {
      // 创建测试文件
      const testFile = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      $input[0].files = dataTransfer.files;
      cy.wrap($input).trigger('change', { force: true });
    });

    // 等待上传完成
    cy.wait(2000); // 给予足够的时间让文件上传
  });

  it('should search for files', () => {
    const searchTerm = 'test';
    cy.get('input[placeholder="Search by file name..."]')
      .type(searchTerm);
    // 等待搜索结果更新
    cy.wait(1000);
  });

  // 如果有文件时才运行这些测试
  context('with existing files', () => {
    beforeEach(() => {
      // 等待文件列表加载
      cy.wait(1000);
    });

    it('should preview file', () => {
      // 检查是否有文件存在
      cy.get('table tbody tr').then($rows => {
        if ($rows.length > 0) {
          // 使用View链接预览文件
          cy.get('table tbody tr').first().contains('View').click();
        }
      });
    });

    it('should delete file', () => {
      // 检查是否有文件存在
      cy.get('table tbody tr').then($rows => {
        if ($rows.length > 0) {
          // 点击删除按钮
          cy.get('table tbody tr').first().contains('Delete').click();
          // 处理确认对话框
          cy.on('window:confirm', () => true);
          // 等待删除操作完成
          cy.wait(1000);
        }
      });
    });

    it('should show file details', () => {
      // 检查是否有文件存在
      cy.get('table tbody tr').then($rows => {
        if ($rows.length > 0) {
          // 验证文件详情
          cy.get('table tbody tr').first().within(() => {
            cy.get('td').should('have.length.at.least', 3);
            cy.get('td').eq(0).should('not.be.empty'); // 文件名
            cy.get('td').eq(1).should('not.be.empty'); // 上传时间
          });
        }
      });
    });
  });

  // 空状态测试
  it('should handle empty content list', () => {
    // 如果没有文件，应该显示空表格
    cy.get('table tbody tr').then($rows => {
      if ($rows.length === 0) {
        cy.get('table tbody').should('be.empty');
      }
    });
  });
}); 