const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function test() {
  const form = new FormData();
  fs.writeFileSync('dummy.pdf', 'fake pdf content');
  form.append('resume', fs.createReadStream('dummy.pdf'));
  
  try {
    const res = await axios.post('http://localhost:5000/api/analyze', form, {
      headers: form.getHeaders(),
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Failed:", err.response ? err.response.data : err.message);
  }
}
test();
