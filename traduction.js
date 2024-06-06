async function reverso(from, to, sentence){
    try {
        const response = await fetch("https://api.reverso.net/translate/v1/translation", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                format: "text",
                from: from,
                to: to,
                input: sentence,
                options: {
                    sentenceSplitter: true,
                    origin: "translation.web",
                    contextResults: true,
                    languageDetection: true
                }
            })
        });

        const data = await response.json();
        
        function check(liste, mot) {
            for (let i = 0; i < liste.length; i++) {
                if (liste[i].includes(mot)) {
                    liste.splice(i, 1);
                    i--;
                }
            }
            return liste;
        }
          
        data["translation"] = check(data["translation"], "texte")

        return data["translation"].join('');
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

module.exports = reverso;