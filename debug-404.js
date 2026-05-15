const http = require('http');
http.get('http://localhost:3000/pt', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Check for common error patterns
    const patterns = [
      /NEXT_MISSING_ROOT_TAGS/,
      /MODULE_NOT_FOUND/,
      /error-message/,
      /digest/,
      /template/,
      /Error:/,
    ];
    for (const p of patterns) {
      const m = d.match(p);
      if (m) console.log('Found:', m[0]);
    }
    // Look for the error template
    const tmpl = d.match(/<template[^>]*data-next-error-message="([^"]+)"/);
    if (tmpl) console.log('Error msg:', tmpl[1]);
    // Look for error boundary info
    const errBoundary = d.match(/data-next-error-digest="([^"]+)"/);
    if (errBoundary) console.log('Error digest:', errBoundary[1]);
    if (!tmpl && !errBoundary) console.log('First 1000 chars:', d.substring(0, 1000));
  });
});
