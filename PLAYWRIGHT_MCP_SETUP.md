# Playwright MCP Setup

This document explains how Playwright MCP (Model Context Protocol) is configured in this project.

## What is Playwright MCP?

Playwright MCP is a server that provides browser automation capabilities through the Model Context Protocol. It allows you to:
- Automate web browsers (Chrome, Firefox, Safari)
- Take screenshots and recordings
- Interact with web pages
- Test web applications
- Extract data from websites

## Installation Status

✅ **Playwright MCP is installed and configured**

- Package: `@playwright/mcp@latest`
- Installation method: `npx @playwright/mcp@latest`
- Configuration files created
- Test script verified installation

## Configuration Files

### 1. `.cursor/mcp-servers.json`
Basic configuration for Cursor IDE integration:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### 2. `playwright-mcp-config.json`
Advanced configuration with additional options:
- Browser: Chrome
- Viewport: 1920x1080
- Timeouts: 30s navigation, 10s actions
- Output directory: `./playwright-output`
- Session and trace saving enabled

## Usage Instructions

### 1. Restart Cursor
After installation, restart Cursor to load the MCP configuration.

### 2. Available Commands
Once loaded, you can use Playwright MCP tools through Cursor:
- Navigate to websites
- Take screenshots
- Fill forms
- Click elements
- Extract text and data
- Record sessions
- Save traces for debugging

### 3. Output Files
All Playwright MCP outputs are saved to `./playwright-output/`:
- Session data
- Browser traces
- Screenshots
- Videos (if enabled)

## Testing Your Setup

Run the test script to verify everything is working:
```bash
node test-playwright-mcp.js
```

## Configuration Options

You can customize Playwright MCP by modifying the configuration files:

### Browser Options
- `--browser chrome|firefox|webkit|msedge`
- `--headless` (run without GUI)
- `--viewport-size 1920x1080`

### Performance Options
- `--timeout-navigation 30000` (30 seconds)
- `--timeout-action 10000` (10 seconds)
- `--no-sandbox` (disable sandbox)

### Output Options
- `--save-session` (save browser state)
- `--save-trace` (save debugging traces)
- `--save-video 1920x1080` (record sessions)
- `--output-dir ./playwright-output`

### Security Options
- `--allowed-hosts host1,host2`
- `--blocked-origins origin1;origin2`
- `--ignore-https-errors`

## Troubleshooting

### Common Issues

1. **MCP not loading in Cursor**
   - Restart Cursor completely
   - Check `.cursor/mcp-servers.json` syntax
   - Verify `npx @playwright/mcp@latest` works in terminal

2. **Browser not launching**
   - Ensure Chrome/Chromium is installed
   - Try `--browser firefox` as alternative
   - Check system permissions

3. **Timeout errors**
   - Increase timeout values in configuration
   - Check network connectivity
   - Verify target website is accessible

### Getting Help

- Run `npx @playwright/mcp@latest --help` for all options
- Check the [Playwright MCP GitHub repository](https://github.com/microsoft/playwright-mcp)
- Review browser console for error messages

## Integration with Your Project

This setup is perfect for:
- Testing your Gliitz web application
- Automating user flows
- Taking screenshots for documentation
- Performance testing
- Accessibility testing
- Mobile device emulation

## Next Steps

1. Restart Cursor to activate Playwright MCP
2. Try automating a simple task like navigating to your app
3. Use it to test your chat interface and user flows
4. Create automated tests for critical user journeys

