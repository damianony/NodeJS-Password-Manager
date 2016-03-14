console.log('Starting Password Manager');

var storage = require('node-persist');
storage.initSync();

var crypto = require('crypto-js');

var argv = require('yargs')
    .command('create', 'Create a new account', function (yargs) {
        yargs.options({
        	name: {
        		demand: true,
        		alias: 'n',
        		description: 'Account name (eg: Twitter, Facebook)',
        		type: 'string'
        	},
        	username: {
        		demand: true,
        		alias: 'u',
        		description: 'Name of the user',
        		type: 'string'
        	},
        	password: {
        		demand: true,
        		alias: 'p',
        		description: 'Your account password',
        		type: 'string'
        	},
        	masterPassword: {
        		demand: true,
        		alias: 'm',
        		description: 'Your master password',
        		type: 'string'
        	}
        }).help('help');
    })
    .command('get', 'Get an account', function (yargs) {
        yargs.options({
        	name: {
        		demand: true,
        		alias: 'n',
        		description: 'Your account name',
        		type: 'string'
        	},
        	masterPassword: {
        		demand: true,
        		alias: 'm',
        		description: 'Your master password',
        		type: 'string'
        	}
        }).help('help');
    })
    .help('help')
    .argv;

function getAccounts (masterPassword) {
	var encryptedAccounts = storage.getItemSync('accounts');
	var accounts = [];

	if(typeof encryptedAccounts !== 'undefined') {
		var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}

	return accounts;
}

function saveAccounts (accounts, masterPassword) {
	var encryptedAccounts= crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

	storage.setItemSync('accounts', encryptedAccounts.toString());
	return accounts;
}

function createAccount (account, masterPassword) {
	var accounts = getAccounts(masterPassword);
	
	accounts.push(account);

	saveAccounts(accounts, masterPassword);

	return account;
}

function getAccount (accountName, masterPassword) {
	var accounts = getAccounts(masterPassword);
	var matchedAccount;
	
	accounts.forEach(function (account) {
		if(account.name === accountName) {
			matchedAccount = account;
		}
	});

	return matchedAccount;
}

var command = argv._[0];

if (command === 'create' && typeof argv.name != 'undefined' 
	&& typeof argv.username != 'undefined' && typeof argv.password != 'undefined') {
    var createdAccount = createAccount ({
		name: argv.name,
		username: argv.username,
		password: argv.password
	}, argv.masterPassword);
	console.log(createdAccount);
	console.log("New account created!");
} else if (command === 'get' && typeof argv.name != 'undefined') {
	var fetchedAccount = getAccount(argv.name, argv.masterPassword);

	if(typeof fetchedAccount === 'undefined') {
		console.log('Account not found');
	} else {
		console.log(fetchedAccount);
		console.log("Got account!");
	}
} else {
	console.log("Invalid Arguments");
}
