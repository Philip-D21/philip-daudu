import sequelize from './db'


sequelize
	.sync({
		//alter: true,
	})
	.then(() => {
		console.log('Table synced successfully')
	})
	.catch((err: Error) => {
		console.log('Unable to sync successfully: ' + err.message)
	})
