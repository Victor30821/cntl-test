const nonCapitalizedWords = [
	'BR',
	'AC',
	'AL',
	'AP',
	'AM',
	'BA',
	'CE',
	'ES',
	'GO',
	'MA',
	'MT',
	'MS',
	'MG',
	'PA',
	'PB',
	'PR',
	'PE',
	'PI',
	'RJ',
	'RN',
	'RS',
	'RO',
	'RR',
	'SC',
	'SP',
	'SE',
	'TO',
	'DF',
	'da',
	'de',
	'do'
];

export default (message) => {
	if (typeof message !== 'string') return message;

	const regexPunctuation = /(,|\.|\/)/g;
	const regexPunctuationRoundBySpace = / (,|\.|\/) /g;

	const newMessage = message.replace(regexPunctuation, ' $1 ');
	const arrayMessage = newMessage.toLowerCase().split(" ");

	const capitalizedMessage = arrayMessage.map(word => {
		const filteredWord = nonCapitalizedWords.filter(w => w.toLowerCase() === word);
		if (filteredWord.length > 0) return filteredWord[0];

		const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
		return capitalizedWord;
	});

	return capitalizedMessage.join(" ").replace(regexPunctuationRoundBySpace, '$1');
}
