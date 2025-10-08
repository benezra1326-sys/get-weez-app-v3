#!/usr/bin/env node

/**
 * Test script to verify Playwright MCP installation
 */

const { spawn } = require('child_process');

console.log('🧪 Testing Playwright MCP installation...\n');

// Test 1: Check if the package can be executed
console.log('1. Testing Playwright MCP availability...');
const testProcess = spawn('npx', ['@playwright/mcp@latest', '--help'], {
  stdio: 'pipe',
  timeout: 10000
});

testProcess.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Playwright MCP')) {
    console.log('✅ Playwright MCP is available and working');
    console.log(`   Version: ${output.match(/Playwright MCP \[options\]/)?.[0] || 'Unknown'}`);
  }
});

testProcess.stderr.on('data', (data) => {
  console.log('⚠️  Warning:', data.toString().trim());
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Playwright MCP test completed successfully\n');
    
    // Test 2: Check configuration files
    console.log('2. Checking configuration files...');
    const fs = require('fs');
    const path = require('path');
    
    const configFiles = [
      '.cursor/mcp-servers.json',
      'playwright-mcp-config.json'
    ];
    
    configFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ Configuration file found: ${file}`);
        try {
          const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (config.mcpServers && config.mcpServers.playwright) {
            console.log(`   Command: ${config.mcpServers.playwright.command}`);
            console.log(`   Args: ${config.mcpServers.playwright.args?.join(' ') || 'default'}`);
          }
        } catch (error) {
          console.log(`❌ Error reading ${file}:`, error.message);
        }
      } else {
        console.log(`❌ Configuration file not found: ${file}`);
      }
    });
    
    console.log('\n🎉 Playwright MCP installation and configuration complete!');
    console.log('\nNext steps:');
    console.log('1. Restart Cursor to load the MCP configuration');
    console.log('2. Use Playwright MCP tools for browser automation');
    console.log('3. Check the ./playwright-output directory for saved sessions and traces');
    
  } else {
    console.log('❌ Playwright MCP test failed with code:', code);
  }
});

testProcess.on('error', (error) => {
  console.log('❌ Error running Playwright MCP:', error.message);
});




