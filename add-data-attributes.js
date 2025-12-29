#!/usr/bin/env node
/**
 * Script to add data-field attributes to report pages for dynamic rendering
 * This automates the tedious process of adding attributes to all 12 remaining pages
 */

const fs = require('fs');
const path = require('path');

// Define the replacements for each page
const pageReplacements = {
  // Pages 4-15 will have common replacements for names/photos
  common: [
    {
      search: /src="https:\/\/i\.pravatar\.cc\/150\?u=toni3" alt="Toni"/g,
      replace: 'data-field="person1_photo" src="https://i.pravatar.cc/150?u=toni3" alt="Person 1"'
    },
    {
      search: /src="https:\/\/i\.pravatar\.cc\/150\?u=chris3" alt="Chris"/g,
      replace: 'data-field="person2_photo" src="https://i.pravatar.cc/150?u=chris3" alt="Person 2"'
    },
    {
      search: /<span class="name-label[^>]*>TONI<\/span>/g,
      replace: '<span class="name-label" data-person="person1">TONI</span>'
    },
    {
      search: /<span class="name-label[^>]*>CHRIS<\/span>/g,
      replace: '<span class="name-label" data-person="person2">CHRIS</span>'
    }
  ]
};

// Process each page file
const pages = ['page4.html', 'page5.html', 'page6.html', 'page7.html', 'page8.html', 'page9.html', 
               'page10.html', 'page11.html', 'page12.html', 'page13.html', 'page14.html', 'page15.html'];

let totalChanges = 0;

pages.forEach(pageFile => {
  const filePath = path.join(__dirname, pageFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${pageFile} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let changes = 0;
  
  // Apply common replacements
  pageReplacements.common.forEach(replacement => {
    const matches = content.match(replacement.search);
    if (matches) {
      content = content.replace(replacement.search, replacement.replace);
      changes += matches.length;
    }
  });
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated ${pageFile} - ${changes} changes`);
    totalChanges += changes;
  } else {
    console.log(`ℹ️  No changes needed for ${pageFile}`);
  }
});

console.log(`\n🎉 Complete! Total changes: ${totalChanges}`);

