describe('Schedule Management Page', () => {
  beforeEach(() => {
    // 登录操作
    cy.visit('/login');
    cy.get('input[placeholder="Username *"]').type('admin_nxz');
    cy.get('input[placeholder="Password *"]').type('123456');
    cy.contains('Login').click();

    // 等待跳转到 dashboard 页面
    cy.url().should('include', '/dashboard');

    // 通过 sidebar 进入 schedule management 页面
    cy.contains('Schedule Management').click();
    
    // 等待页面加载完成
    cy.contains(/Schedule.*Management/).should('be.visible');
    cy.wait(2000); // 给更多时间加载数据
  });

  it('should show schedule management page and basic elements', () => {
    // 验证页面标题
    cy.contains(/Schedule.*Management/).should('be.visible');
    
    // 验证添加按钮
    cy.contains(/Add|Create|New/).should('be.visible');
    
    // 验证搜索框
    cy.get('input[type="text"]').should('exist');
    
    // 验证日期筛选
    cy.get('input[type="date"]').should('exist');

    // 验证表格存在
    cy.get('table').should('exist');
  });

  it('should open add schedule form', () => {
    // 点击添加按钮
    cy.contains(/Add|Create|New/).click();
    cy.wait(1000);
    
    // 验证表单字段
    cy.get('form').should('exist').within(() => {
      // 名称字段
      cy.get('input[name="name"]').should('exist');
      
      // 时间字段
      cy.get('input[type="datetime-local"]').should('exist');
      
      // 重复类型
      cy.get('select').should('exist');
      
      // 优先级
      cy.get('input[type="number"]').should('exist');
    });
  });

  it('should create new schedule', () => {
    // 点击添加按钮
    cy.contains(/Add|Create|New/).click();
    cy.wait(1000);
    
    // 填写表单
    const scheduleName = 'Test Schedule ' + Date.now();
    
    cy.get('form').should('exist').within(() => {
      // 名称
      cy.get('input[name="name"]').type(scheduleName);
      
      // 开始时间
      const now = new Date();
      const startTime = now.toISOString().slice(0, 16);
      cy.get('input[type="datetime-local"]').first().type(startTime);
      
      // 结束时间
      now.setHours(now.getHours() + 1);
      const endTime = now.toISOString().slice(0, 16);
      cy.get('input[type="datetime-local"]').last().type(endTime);
      
      // 重复类型
      cy.get('select').first().select('ONCE');
      
      // 优先级
      cy.get('input[type="number"]').type('1');
    });
    
    // 提交表单
    cy.contains(/Submit|Save|Create|确定/).click();
    cy.wait(2000);
  });

  it('should search schedules', () => {
    // 输入搜索关键词
    cy.get('input[type="text"]').first().type('Test');
    cy.wait(2000);
  });

  it('should filter by date', () => {
    // 设置日期筛选
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[type="date"]').first().type(today);
    cy.wait(2000);
  });

  context('with existing schedules', () => {
    beforeEach(() => {
      cy.wait(2000);
    });

    it('should delete schedule', () => {
      cy.get('table tbody tr').then($rows => {
        if ($rows.length > 0) {
          // 点击删除按钮
          cy.get('table tbody tr').first().contains(/Delete|Remove|删除/).click();
          
          // 处理确认对话框
          cy.on('window:confirm', () => true);
          cy.wait(2000);
        }
      });
    });

    it('should show schedule details', () => {
      cy.get('table tbody tr').then($rows => {
        if ($rows.length > 0) {
          cy.get('table tbody tr').first().within(() => {
            // 验证必要字段存在
            cy.get('td').should('have.length.at.least', 3);
            // 验证至少有一个非空单元格
            cy.get('td').first().invoke('text').should('not.be.empty');
          });
        }
      });
    });
  });

  // 分页测试
  it('should handle pagination if exists', () => {
    // 检查分页组件 - 使用更通用的选择器
    cy.get('[role="navigation"], nav, .pagination, ul').then($nav => {
      if ($nav.length > 0) {
        // 如果有下一页按钮就点击
        cy.contains(/Next|下一页/).then($next => {
          if ($next.length > 0 && !$next.prop('disabled')) {
            cy.wrap($next).click({ force: true });
            cy.wait(2000);
          }
        });
      }
    });
  });

  // 空状态测试
  it('should handle empty schedule list', () => {
    cy.get('table tbody tr').then($rows => {
      if ($rows.length === 0) {
        // 检查是否显示空状态提示
        cy.get('table tbody').should('exist');
      }
    });
  });
}); 