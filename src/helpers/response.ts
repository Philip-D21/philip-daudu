export const successResponse = (
	res: any,
	message: string = 'Operation successfull',
	data?: any,
	statusCode: number = 200
) => {
	return res.status(200).json({
		status: true,
		message,
		data,
		statusCode
	})
}



export const errorResponse = (
	res: any,
	message: string = 'An error occured',
	data?: any,
	statusCode: number = 500
) => {
	return res.status(400).json({
		status: false,
		message,
		data,
		statusCode
	})
}