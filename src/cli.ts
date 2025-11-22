#!/usr/bin/env node
/**
 * CLI tool for v3-templater
 */

import { Template } from './template';
import * as fs from 'fs';
import * as path from 'path';

interface CliOptions {
  template?: string;
  data?: string;
  output?: string;
  autoEscape?: boolean;
  strict?: boolean;
  help?: boolean;
  version?: boolean;
}

function printHelp(): void {
  console.log(`
v3-templater - Modern templating engine CLI

Usage:
  v3t [options]

Options:
  -t, --template <file>   Template file to render (required)
  -d, --data <file>       JSON data file for context
  -o, --output <file>     Output file (default: stdout)
  --no-escape             Disable HTML auto-escaping
  --strict                Enable strict mode
  -h, --help              Show this help message
  -v, --version           Show version

Examples:
  v3t -t template.html -d data.json
  v3t -t email.html -d user.json -o output.html
  echo '{"name":"World"}' | v3t -t hello.html
  v3t -t template.html --strict --no-escape

Template Syntax:
  Variables:       {{ variable }}
  Filters:         {{ variable | upper }}
  Conditionals:    {% if condition %} ... {% endif %}
  Loops:           {% for item in items %} ... {% endfor %}
  Blocks:          {% block name %} ... {% endblock %}
  Includes:        {% include "partial.html" %}
`);
}

function printVersion(): void {
  const packageJson = require('../package.json');
  console.log(`v3-templater v${packageJson.version}`);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-t':
      case '--template':
        options.template = args[++i];
        break;
      case '-d':
      case '--data':
        options.data = args[++i];
        break;
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
      case '--no-escape':
        options.autoEscape = false;
        break;
      case '--strict':
        options.strict = true;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-v':
      case '--version':
        options.version = true;
        break;
    }
  }

  return options;
}

function main(): void {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (options.version) {
    printVersion();
    process.exit(0);
  }

  if (!options.template) {
    console.error('Error: Template file is required');
    console.error('Use -h or --help for usage information');
    process.exit(1);
  }

  try {
    // Read template
    const templatePath = path.resolve(options.template);
    if (!fs.existsSync(templatePath)) {
      console.error(`Error: Template file not found: ${options.template}`);
      process.exit(1);
    }
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    // Read data
    let context: Record<string, any> = {};
    if (options.data) {
      const dataPath = path.resolve(options.data);
      if (!fs.existsSync(dataPath)) {
        console.error(`Error: Data file not found: ${options.data}`);
        process.exit(1);
      }
      const dataContent = fs.readFileSync(dataPath, 'utf-8');
      context = JSON.parse(dataContent);
    }

    // Create template engine
    const template = new Template({
      autoEscape: options.autoEscape ?? true,
      strictMode: options.strict ?? false,
    });

    template.setTemplateDirs([path.dirname(templatePath)]);

    // Render
    const result = template.render(templateContent, context);

    // Output
    if (options.output) {
      fs.writeFileSync(options.output, result, 'utf-8');
      console.log(`Output written to: ${options.output}`);
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main, parseArgs };
