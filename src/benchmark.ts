/**
 * Performance benchmarks for v3-templater
 */

import { Template } from './template';

interface BenchmarkResult {
  name: string;
  ops: number;
  time: number;
  avgTime: number;
}

function benchmark(name: string, fn: () => void, iterations = 1000): BenchmarkResult {
  // Warmup
  for (let i = 0; i < 10; i++) {
    fn();
  }

  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = process.hrtime.bigint();
  const time = Number(end - start) / 1_000_000; // Convert to ms
  const avgTime = time / iterations;
  const ops = (iterations / time) * 1000; // Operations per second

  return {
    name,
    ops: Math.round(ops),
    time,
    avgTime,
  };
}

function runBenchmarks(): void {
  console.log('v3-templater Performance Benchmarks\n');

  const results: BenchmarkResult[] = [];

  // Simple variable interpolation
  results.push(
    benchmark('Simple variable', () => {
      const template = new Template({ cache: false });
      template.render('Hello {{ name }}!', { name: 'World' });
    })
  );

  // With caching
  const cachedTemplate = new Template({ cache: true });
  const simpleTemplate = 'Hello {{ name }}!';
  results.push(
    benchmark('Cached variable', () => {
      cachedTemplate.render(simpleTemplate, { name: 'World' });
    })
  );

  // Filters
  results.push(
    benchmark('Filters', () => {
      const template = new Template({ cache: false });
      template.render('{{ name | upper | trim }}', { name: '  world  ' });
    })
  );

  // Conditionals
  results.push(
    benchmark('Conditionals', () => {
      const template = new Template({ cache: false });
      template.render(
        '{% if show %}visible{% else %}hidden{% endif %}',
        { show: true }
      );
    })
  );

  // Loops
  results.push(
    benchmark('Small loop (10 items)', () => {
      const template = new Template({ cache: false });
      template.render(
        '{% for item in items %}{{ item }}{% endfor %}',
        { items: Array.from({ length: 10 }, (_, i) => i) }
      );
    })
  );

  results.push(
    benchmark('Medium loop (100 items)', () => {
      const template = new Template({ cache: false });
      template.render(
        '{% for item in items %}{{ item }}{% endfor %}',
        { items: Array.from({ length: 100 }, (_, i) => i) }
      );
    }, 100)
  );

  // Complex template
  const complexTemplate = `
    <html>
      <head><title>{{ title }}</title></head>
      <body>
        <h1>{{ title | upper }}</h1>
        {% if users %}
          <ul>
            {% for user in users %}
              <li>{{ user.name }} ({{ user.age }})</li>
            {% endfor %}
          </ul>
        {% else %}
          <p>No users found</p>
        {% endif %}
      </body>
    </html>
  `;

  results.push(
    benchmark('Complex template', () => {
      const template = new Template({ cache: false });
      template.render(complexTemplate, {
        title: 'Users',
        users: [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 },
          { name: 'Charlie', age: 35 },
        ],
      });
    })
  );

  // Print results
  console.log('┌─────────────────────────────┬──────────────┬────────────┬───────────┐');
  console.log('│ Benchmark                   │ Ops/sec      │ Total (ms) │ Avg (ms)  │');
  console.log('├─────────────────────────────┼──────────────┼────────────┼───────────┤');

  for (const result of results) {
    const name = result.name.padEnd(27);
    const ops = result.ops.toLocaleString().padStart(12);
    const time = result.time.toFixed(2).padStart(10);
    const avg = result.avgTime.toFixed(4).padStart(9);
    console.log(`│ ${name} │ ${ops} │ ${time} │ ${avg} │`);
  }

  console.log('└─────────────────────────────┴──────────────┴────────────┴───────────┘');

  // Memory usage
  const used = process.memoryUsage();
  console.log('\nMemory Usage:');
  console.log(`  RSS: ${Math.round(used.rss / 1024 / 1024)} MB`);
  console.log(`  Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)} MB`);
  console.log(`  Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)} MB`);
}

if (require.main === module) {
  runBenchmarks();
}

export { benchmark, runBenchmarks };
