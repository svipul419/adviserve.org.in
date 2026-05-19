const fs = require('fs');
const files = require('glob').sync('src/**/*.{tsx,ts}', { nodir: true });

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace text-white safely
  content = content.replace(/className="([^"]*)text-white([^"]*)"/g, 'className="$1text-black dark:text-white$2"');
  
  // Replace text-white/60
  content = content.replace(/className="([^"]*)text-white\/60([^"]*)"/g, 'className="$1text-gray-600 dark:text-white/60$2"');
  
  // Replace text-white/70
  content = content.replace(/className="([^"]*)text-white\/70([^"]*)"/g, 'className="$1text-gray-700 dark:text-white/70$2"');
  
  // Replace text-[#8a8a9e]
  content = content.replace(/className="([^"]*)text-\[#8a8a9e\]([^"]*)"/g, 'className="$1text-gray-500 dark:text-[#8a8a9e]$2"');
  
  // Replace border-white/10
  content = content.replace(/border-white\/10/g, 'border-black/10 dark:border-white/10');
  content = content.replace(/border-white\/5/g, 'border-black/5 dark:border-white/5');
  content = content.replace(/border-white\/20/g, 'border-black/20 dark:border-white/20');
  
  // Replace bg-transparent in some places if needed, but not universally
  
  // Fix weird instances
  content = content.replace(/text-black dark:text-black dark:text-white/g, 'text-black dark:text-white');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
