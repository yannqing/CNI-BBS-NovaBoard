# Project Context  
- Stack: Next.js 15, TailwindCSS
- Style: Functional components, TypeScript strict mode, Early returns  
  
# Workflow Rules
- 1. **Spec First**: 任何超过 10 行代码的改动，必须先更新 docs/specs/ 下的对应文档。
- 2. **Test Driven**: 修改代码前必须先运行相关测试；提交前必须确保 npm test 通过。
- 3. **No Magic**: 禁止使用未在 package.json 中声明的外部依赖。
  
  
  
# Build Instructions  
- Run npm install to setup dependencies.  
- Run npm run dev to start local server on port 3000.  
  
# Testing Strategy  
- Unit tests are in __tests__/. Run with npm test.  
- E2E tests use Playwright. Run with npm run test:e2e.  
- **Verification Rule**: If you modify UI components, you MUST run E2E tests.  
  
# Data Seeding  
- Use npm run seed to populate local DB with test data.  
- Test user: [admin@example.com](mailto:admin@example.com) / password123

