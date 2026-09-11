const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content', 'blog');
const outputIndex = path.join(contentDir, 'index.json');

function parseFrontmatter(rawContent) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: rawContent };
  }
  const yamlLines = match[1].split(/\r?\n/);
  const data = {};
  for (const line of yamlLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }
  return { data, body: match[2] };
}

function buildBlog() {
  if (!fs.existsSync(contentDir)) {
    console.log('No content/blog directory found.');
    return;
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, body } = parseFrontmatter(raw);

    const slug = file.replace(/\.md$/, '');
    const wordCount = body.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 180));

    posts.push({
      slug,
      filename: file,
      title: data.title || slug,
      code: data.code || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Dr. Pedro Hernán Pérez Estrada (docSERsol)',
      category: data.category || 'General',
      image: data.image || '',
      summary: data.summary || '',
      readTime: `${readTime} min de lectura`,
      body: body.trim()
    });
  }

  // Sort descending by date
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(outputIndex, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`Successfully built blog index with ${posts.length} post(s) -> ${outputIndex}`);
}

buildBlog();
