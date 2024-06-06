async function askyourpdf(sentence) {
    try {
      const response = await fetch('https://tools.askyourpdf.com/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"action":"TEXT_GENERATOR","text":"${sentence}","parameters":{"LENGHT":"Very Short","TONE":"Professional","PURPOSE":"Educational"},"model_temperature":1}`
      });
      
      const data = await response.text();
      return data;
    } catch (error) {
      data=('Erreur:', error);
    }
}

module.exports = askyourpdf;